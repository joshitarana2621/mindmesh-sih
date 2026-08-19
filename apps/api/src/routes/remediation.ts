import { Router, Request, Response } from "express";
import { prisma } from "@eduadpat/database";
import { requireAuth } from "../middleware/auth";
import { remediationRequestSchema, quizGeneratorRequestSchema } from "@eduadpat/shared";
import { validate } from "../middleware/validate";

const router: Router = Router();

router.post("/remediation", requireAuth, validate(remediationRequestSchema), async (req: Request, res: Response) => {
  const { kcCode, misconception, language, contentVersion } = req.body;

  const cached = await prisma.remediation.findFirst({
    where: {
      kcCode,
      language,
      misconception: misconception || null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (cached) {
    await prisma.remediation.update({
      where: { id: cached.id },
      data: { usageCount: { increment: 1 } },
    });

    res.json({
      success: true,
      data: {
        content: cached.content,
        type: "explanation",
        language: cached.language,
        promptVersion: cached.promptVersion,
        schemaVersion: cached.schemaVersion,
        isAiGenerated: false,
        fallbackUsed: false,
      },
    });
    return;
  }

  const fallbackContent = generateFallbackRemediation(kcCode, misconception, language);

  res.json({
    success: true,
    data: {
      content: fallbackContent,
      type: "explanation",
      language,
      promptVersion: "fallback-v1",
      schemaVersion: 1,
      isAiGenerated: false,
      fallbackUsed: true,
    },
  });
});

router.post("/quiz-generator", requireAuth, async (req: Request, res: Response) => {
  const { kcCode, topicName, difficulty, questionCount, language, gradeBand } = req.body;

  res.json({
    success: true,
    data: {
      message: "Quiz generation requires AI service. This is a draft for teacher review.",
      draft: {
        kcCode,
        topicName,
        suggestedQuestions: [
          { text: `What is ${topicName}?`, type: "MULTIPLE_CHOICE", difficulty },
        ],
        requiresTeacherReview: true,
      },
    },
  });
});

function generateFallbackRemediation(kcCode: string, misconception?: string, language: string = "en"): string {
  const fallbacks: Record<string, string> = {
    "KC-001": "Arrays are ordered collections of elements. In JavaScript, you can declare an array using square brackets: let arr = [1, 2, 3].",
    "KC-002": "Array indexing starts at 0. The first element is at index 0, the second at index 1, and so on. arr[0] gives you the first element.",
    "KC-003": "Array traversal means visiting each element. Use a for loop: for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }",
    "KC-004": "To insert into an array, use push() to add at the end, unshift() at the beginning, or splice() at a specific position.",
  };

  return fallbacks[kcCode] || `Review the concept of ${kcCode}. Practice related exercises and ask your teacher for help if needed.`;
}

export { router as remediationRoutes };

