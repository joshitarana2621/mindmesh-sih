import { Router, Request, Response } from "express";
import { prisma } from "@eduadpat/database";
import { requireAuth, requireRole } from "../middleware/auth";
import { authorizeOrThrow } from "../middleware/authorization";
import { createQuizSchema, startAttemptSchema } from "@eduadpat/shared";
import { validate } from "../middleware/validate";

const router: Router = Router();

router.post("/", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), validate(createQuizSchema), async (req: Request, res: Response) => {
  const { title, description, classroomId, durationMinutes, language, questionIds } = req.body;

  const quiz = await prisma.quiz.create({
    data: {
      institutionId: req.actor!.institutionId,
      title,
      description,
      classroomId,
      durationMinutes,
      language,
      createdBy: req.actor!.id,
      status: "DRAFT",
    },
  });

  const quizVersion = await prisma.quizVersion.create({
    data: {
      quizId: quiz.id,
      version: 1,
      packageId: `pkg-${quiz.id}-v1`,
      integrityHash: `sha256-${Date.now()}`,
      scoringConfigVersion: "mastery-v1",
    },
  });

  const questions = await prisma.questionVersion.findMany({
    where: { id: { in: questionIds } },
  });

  await prisma.quizQuestion.createMany({
    data: questions.map((q, i) => ({
      quizVersionId: quizVersion.id,
      questionVersionId: q.id,
      order: i + 1,
      points: 1.0,
    })),
  });

  res.status(201).json({ success: true, data: quiz });
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const quiz: any = await prisma.quiz.findUnique({
    where: { id: String(req.params.id) },
    include: {
      versions: {
        orderBy: { version: "desc" },
        take: 1,
        include: {
          questions: {
            include: {
              questionVersion: {
                include: { options: true, kcMappings: { include: { kc: true } } },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!quiz) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Quiz not found" } });
    return;
  }

  res.json({ success: true, data: quiz });
});

router.post("/:id/start", requireAuth, validate(startAttemptSchema), async (req: Request, res: Response) => {
  const quiz: any = await prisma.quiz.findUnique({
    where: { id: String(req.params.id) },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  if (!quiz) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Quiz not found" } });
    return;
  }

  const profile = await prisma.studentProfile.findUnique({ where: { userId: req.actor!.id } });
  if (!profile && req.actor!.role === "STUDENT") {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Student profile not found" } });
    return;
  }

  const latestVersion = quiz.versions[0];
  if (!latestVersion) {
    res.status(400).json({ success: false, error: { code: "NO_VERSION", message: "Quiz has no published version" } });
    return;
  }

  const attempt = await prisma.quizAttempt.create({
    data: {
      studentId: profile!.id,
      quizId: quiz.id,
      quizVersionId: latestVersion.id,
      deviceId: req.body.deviceId,
      profileNamespace: req.body.profileNamespace,
      status: "STARTED",
      startedAt: new Date(),
    },
  });

  res.status(201).json({ success: true, data: attempt });
});

router.post("/:id/submit", requireAuth, async (req: Request, res: Response) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Answers array is required" } });
    return;
  }

  const profile = await prisma.studentProfile.findUnique({ where: { userId: req.actor!.id } });

  const attempt: any = await prisma.quizAttempt.findFirst({
    where: { quizId: String(req.params.id), studentId: profile?.id, status: { in: ["STARTED", "IN_PROGRESS"] } },
  });

  if (!attempt) {
    res.status(404).json({ success: false, error: { code: "NO_ACTIVE_ATTEMPT", message: "No active attempt found" } });
    return;
  }

  let correctCount = 0;
  for (const answer of answers) {
    const questionVersion = await prisma.questionVersion.findUnique({
      where: { id: answer.questionVersionId },
      include: { options: true },
    });

    const isCorrect = questionVersion?.options.some(
      (o) => o.text === answer.answer && o.isCorrect
    ) || false;

    if (isCorrect) correctCount++;

    const question = await prisma.questionVersion.findUnique({
      where: { id: answer.questionVersionId },
    });

    await prisma.questionAttempt.create({
      data: {
        attemptId: attempt.id,
        questionId: question?.questionId || "",
        questionVersionId: answer.questionVersionId,
        answer: answer.answer,
        isCorrect,
        latencyMs: answer.latencyMs || 0,
        attemptNumber: answer.attemptNumber || 1,
        answerChangeCount: answer.answerChangeCount || 0,
        startedAt: answer.startedAt ? new Date(answer.startedAt) : undefined,
        submittedAt: new Date(answer.submittedAt || Date.now()),
      },
    });
  }

  const totalQuestions = answers.length;
  const score = totalQuestions > 0 ? correctCount / totalQuestions : 0;

  await prisma.quizAttempt.update({
    where: { id: attempt.id },
    data: {
      status: "LOCALLY_SCORED",
      completedAt: new Date(),
      localScore: score,
      networkState: req.body.networkState || "online",
    },
  });

  res.json({
    success: true,
    data: {
      attemptId: attempt.id,
      score,
      correctCount,
      totalQuestions,
      status: "LOCALLY_SCORED",
    },
  });
});

router.get("/packages/:id", requireAuth, async (req: Request, res: Response) => {
  const version: any = await prisma.quizVersion.findUnique({
    where: { packageId: String(req.params.id) },
    include: {
      quiz: true,
      questions: {
        include: {
          questionVersion: {
            include: { options: true, kcMappings: { include: { kc: true } } },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!version) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Package not found" } });
    return;
  }

  const pkg = {
    packageId: version.packageId,
    version: version.version,
    quizId: version.quizId,
    expiresAt: version.expiresAt?.toISOString() || null,
    questions: version.questions.map((qq) => ({
      id: qq.questionVersion.questionId,
      text: qq.questionVersion.text,
      type: "MULTIPLE_CHOICE" as const,
      difficulty: 0.5,
      options: qq.questionVersion.options.map((o) => ({
        id: o.id,
        text: o.text,
        isCorrect: o.isCorrect,
        order: o.order,
      })),
      kcCodes: qq.questionVersion.kcMappings.map((km) => km.kc.code),
    })),
    scoringConfigVersion: version.scoringConfigVersion,
    integrityHash: version.integrityHash,
    locale: version.quiz.language,
  };

  res.json({ success: true, data: pkg });
});

export { router as quizRoutes };



