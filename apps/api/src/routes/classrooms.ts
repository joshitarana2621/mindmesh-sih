import { Router, Request, Response } from "express";
import { prisma } from "@eduadpat/database";
import { requireAuth, requireRole } from "../middleware/auth";
import { authorizeOrThrow } from "../middleware/authorization";
import { createClassroomSchema } from "@eduadpat/shared";
import { validate } from "../middleware/validate";

const router: Router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const where = req.actor!.role === "INSTITUTION_ADMIN"
    ? { institutionId: req.actor!.institutionId }
    : { members: { some: { userId: req.actor!.id } } };

  const classrooms = await prisma.classroom.findMany({
    where,
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: classrooms });
});

router.post("/", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), validate(createClassroomSchema), async (req: Request, res: Response) => {
  const classroom = await prisma.classroom.create({
    data: {
      institutionId: req.actor!.institutionId,
      ...req.body,
    },
  });

  await prisma.classroomMember.create({
    data: {
      classroomId: classroom.id,
      userId: req.actor!.id,
      role: "TEACHER",
    },
  });

  res.status(201).json({ success: true, data: classroom });
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const classroom = await prisma.classroom.findUnique({
    where: { id: String(req.params.id) },
    include: { _count: { select: { members: true } } },
  });

  if (!classroom) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Classroom not found" } });
    return;
  }

  await authorizeOrThrow(req.actor!, "read:classroom", { classroomId: classroom.id });

  res.json({ success: true, data: classroom });
});

router.get("/:id/students", requireAuth, async (req: Request, res: Response) => {
  await authorizeOrThrow(req.actor!, "read:classroom_students", { classroomId: String(req.params.id) });

  const members: any = await prisma.classroomMember.findMany({
    where: { classroomId: String(req.params.id), role: "STUDENT" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          studentProfile: {
            select: { id: true, rollNumber: true, gradeBand: true, language: true },
          },
        },
      },
    },
  });

  res.json({
    success: true,
    data: members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      profileId: m.user.studentProfile?.id,
      rollNumber: m.user.studentProfile?.rollNumber,
      gradeBand: m.user.studentProfile?.gradeBand,
      language: m.user.studentProfile?.language,
    })),
  });
});

router.get("/:id/analytics", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), async (req: Request, res: Response) => {
  await authorizeOrThrow(req.actor!, "read:analytics", { classroomId: String(req.params.id) });

  const classroomId = String(req.params.id);
  const members: any = await prisma.classroomMember.findMany({
    where: { classroomId, role: "STUDENT" },
    include: { user: { include: { studentProfile: true } } },
  });

  const studentIds = members
    .map((m) => m.user.studentProfile?.id)
    .filter(Boolean) as string[];

  const masteryRecords = await prisma.studentMastery.findMany({
    where: { studentId: { in: studentIds } },
    include: { kc: true },
  });

  const avgMastery = masteryRecords.length > 0
    ? masteryRecords.reduce((sum, m) => sum + m.mastery, 0) / masteryRecords.length
    : 0;

  const riskDistribution = { red: 0, yellow: 0, green: 0, insufficient: 0 };
  for (const m of masteryRecords) {
    if (m.mastery < 0.5) riskDistribution.red++;
    else if (m.mastery < 0.8) riskDistribution.yellow++;
    else riskDistribution.green++;
  }

  if (studentIds.length > 0 && masteryRecords.length === 0) {
    riskDistribution.insufficient = studentIds.length;
  }

  const interventionEvents: any = await prisma.interventionEvent.findMany({
    where: { classroomId, status: { not: "RESOLVED" } },
    include: { kc: true },
  });

  const kcInterventions = new Map<string, { count: number; avgMastery: number; name: string }>();
  for (const event of interventionEvents) {
    if (!event.kc) continue;
    const existing = kcInterventions.get(event.kcCode || "") || { count: 0, avgMastery: 0, name: event.kc.name };
    existing.count++;
    kcInterventions.set(event.kcCode || "", existing);
  }

  res.json({
    success: true,
    data: {
      classroomId,
      studentCount: studentIds.length,
      averageMastery: avgMastery,
      riskDistribution,
      topInterventions: Array.from(kcInterventions.values()).sort((a, b) => b.count - a.count).slice(0, 5),
    },
  });
});

router.get("/:id/mastery", requireAuth, async (req: Request, res: Response) => {
  await authorizeOrThrow(req.actor!, "read:analytics", { classroomId: String(req.params.id) });

  const classroomId = String(req.params.id);
  const members: any = await prisma.classroomMember.findMany({
    where: { classroomId, role: "STUDENT" },
    include: { user: { include: { studentProfile: true } } },
  });

  const studentIds = members
    .map((m) => m.user.studentProfile?.id)
    .filter(Boolean) as string[];

  const masteryRecords = await prisma.studentMastery.findMany({
    where: { studentId: { in: studentIds } },
    include: { kc: true, student: { include: { user: { select: { name: true } } } } },
  });

  res.json({ success: true, data: masteryRecords });
});

export { router as classroomRoutes };


