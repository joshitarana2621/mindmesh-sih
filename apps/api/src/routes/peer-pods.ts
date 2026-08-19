import { Router, Request, Response } from "express";
import { prisma } from "@eduadpat/database";
import { requireAuth, requireRole } from "../middleware/auth";
import { generatePeerPodsSchema } from "@eduadpat/shared";
import { validate } from "../middleware/validate";
import { generatePeerPods } from "@eduadpat/analytics-engine";

const router: Router = Router();

router.get("/", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), async (req: Request, res: Response) => {
  const { classroomId } = req.query;

  const pods = await prisma.peerPod.findMany({
    where: classroomId ? { classroomId: classroomId as string } : {},
    include: {
      members: { include: { student: { include: { user: { select: { name: true } } } } } },
      activities: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: pods });
});

router.post("/generate", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), validate(generatePeerPodsSchema), async (req: Request, res: Response) => {
  const classroomId: string = String(req.body.classroomId);
  const targetKC: string | undefined = req.body.targetKC;

  const members = await prisma.classroomMember.findMany({
    where: { classroomId, role: "STUDENT" },
    include: {
      user: {
        include: {
          studentProfile: {
            include: {
              masteryRecords: { include: { kc: true } },
            },
          },
        },
      },
    },
  });

  const candidates = members
    .filter((m) => m.user.studentProfile)
    .map((m) => {
      const profile = m.user.studentProfile!;
      const masteryMap: Record<string, number> = {};
      const strongKCs: string[] = [];
      const weakKCs: string[] = [];

      for (const record of profile.masteryRecords) {
        masteryMap[record.kc.code] = record.mastery;
        if (record.mastery >= 0.8) strongKCs.push(record.kc.code);
        if (record.mastery < 0.5) weakKCs.push(record.kc.code);
      }

      const hasStrongKC = targetKC ? strongKCs.includes(targetKC) : strongKCs.length > 0;
      const hasWeakKC = targetKC ? weakKCs.includes(targetKC) : weakKCs.length > 0;

      return {
        studentId: profile.userId,
        studentName: m.user.name,
        role: hasStrongKC && !hasWeakKC ? "MENTOR" as const : hasWeakKC ? "MENTEE" as const : "MENTOR" as const,
        weakKCs,
        strongKCs,
        mastery: masteryMap,
        language: profile.language,
        recentPairingCounts: {} as Record<string, number>,
        mentorCapacity: 3,
      };
    });

  const kc = targetKC || candidates[0]?.strongKCs[0] || "unknown";
  const result = generatePeerPods(candidates, kc);

  const createdPods = [];
  for (const pod of result.pods) {
    const dbPod = await prisma.peerPod.create({
      data: {
        classroomId,
        targetKC: kc,
        status: "DRAFT",
        createdBy: req.actor!.id,
        members: {
          create: [
            ...pod.mentors.map((m) => ({
              studentId: m.studentId,
              role: "MENTOR" as const,
            })),
            ...pod.mentees.map((m) => ({
              studentId: m.studentId,
              role: "MENTEE" as const,
            })),
          ],
        },
        activities: {
          create: {
            objective: `Peer practice for ${kc}`,
            kcCode: kc,
            durationMinutes: 10,
            status: "PLANNED",
          },
        },
      },
      include: { members: true, activities: true },
    });
    createdPods.push(dbPod);
  }

  res.json({
    success: true,
    data: {
      pods: createdPods,
      unmatched: result.unmatched,
    },
  });
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const pod = await prisma.peerPod.findUnique({
    where: { id: String(req.params.id) },
    include: {
      members: { include: { student: { include: { user: { select: { name: true } } } } } },
      activities: true,
    },
  });

  if (!pod) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Peer pod not found" } });
    return;
  }

  res.json({ success: true, data: pod });
});

export { router as peerPodRoutes };

