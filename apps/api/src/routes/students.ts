import { Router, Request, Response } from "express";
import { prisma } from "@eduadpat/database";
import { requireAuth, requireRole } from "../middleware/auth";
import { authorizeOrThrow } from "../middleware/authorization";

const router: Router = Router();

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: req.actor!.id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!profile) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Student profile not found" } });
    return;
  }

  res.json({ success: true, data: profile });
});

router.get("/me/progress", requireAuth, async (req: Request, res: Response) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: req.actor!.id },
  });

  if (!profile) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Student profile not found" } });
    return;
  }

  const masteryRecords = await prisma.studentMastery.findMany({
    where: { studentId: profile.id },
    include: { kc: { include: { topic: true } } },
  });

  const recentAttempts = await prisma.quizAttempt.findMany({
    where: { studentId: profile.id, status: "SYNCED" },
    include: { quiz: { select: { title: true } } },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  const overallMastery = masteryRecords.length > 0
    ? masteryRecords.reduce((sum, m) => sum + m.mastery, 0) / masteryRecords.length
    : 0;

  res.json({
    success: true,
    data: {
      studentId: profile.id,
      overallMastery,
      kcMastery: masteryRecords.map((m) => ({
        kcCode: m.kc.code,
        kcName: m.kc.name,
        mastery: m.mastery,
        band: m.mastery < 0.5 ? "RED" : m.mastery < 0.8 ? "YELLOW" : "GREEN",
        attemptCount: m.attemptCount,
      })),
      recentAttempts: recentAttempts.map((a) => ({
        attemptId: a.id,
        quizTitle: a.quiz.title,
        score: a.serverScore || a.localScore || 0,
        completedAt: a.completedAt?.toISOString() || "",
      })),
    },
  });
});

router.get("/me/mastery", requireAuth, async (req: Request, res: Response) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: req.actor!.id },
  });

  if (!profile) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Student profile not found" } });
    return;
  }

  const masteryRecords = await prisma.studentMastery.findMany({
    where: { studentId: profile.id },
    include: { kc: true },
  });

  res.json({
    success: true,
    data: masteryRecords.map((m) => ({
      kcCode: m.kc.code,
      kcName: m.kc.name,
      accuracy: m.accuracy,
      latencyScore: m.latencyScore,
      kcPerformance: m.kcPerformance,
      mastery: m.mastery,
      attemptCount: m.attemptCount,
      band: m.mastery < 0.5 ? "RED" : m.mastery < 0.8 ? "YELLOW" : "GREEN",
    })),
  });
});

router.get("/:id/diagnostics", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), async (req: Request, res: Response) => {
  const studentId: string = String(req.params.id);

  const profile: any = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { user: { select: { name: true } } },
    });

  if (!profile) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Student not found" } });
    return;
  }

  const mastery: any = await prisma.studentMastery.findMany({
    where: { studentId },
    include: { kc: true },
  });

  const misconceptions: any = await prisma.misconception.findMany({
    where: { studentId },
    orderBy: { detectedAt: "desc" },
    take: 20,
  });

  const risks: any = await prisma.learningRisk.findMany({
    where: { studentId },
    orderBy: { computedAt: "desc" },
    take: 10,
  });

  res.json({
    success: true,
    data: {
      studentId,
      name: profile.user.name,
      mastery: mastery.map((m) => ({
        kcCode: m.kc.code,
        kcName: m.kc.name,
        accuracy: m.accuracy,
        latencyScore: m.latencyScore,
        kcPerformance: m.kcPerformance,
        mastery: m.mastery,
        band: m.mastery < 0.5 ? "RED" : m.mastery < 0.8 ? "YELLOW" : "GREEN",
      })),
      misconceptions: misconceptions.map((m) => ({
        kcCode: m.kcCode,
        category: m.category,
        confidence: m.confidence,
        detectedAt: m.detectedAt.toISOString(),
      })),
      risks: risks.map((r) => ({
        kcCode: r.kcCode,
        priority: r.priority,
        explanation: r.explanation,
        computedAt: r.computedAt.toISOString(),
      })),
    },
  });
});

export { router as studentRoutes };




