import { z } from "zod";

export const questionOptionSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  isCorrect: z.boolean(),
  order: z.number(),
  distractorType: z.string().nullable().optional(),
});

export const questionSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]),
  difficulty: z.number(),
  options: z.array(questionOptionSchema),
  kcCodes: z.array(z.string()),
});

export const quizPackageSchema = z.object({
  packageId: z.string(),
  version: z.number(),
  quizId: z.string().uuid(),
  expiresAt: z.string().datetime().nullable(),
  questions: z.array(questionSchema),
  scoringConfigVersion: z.string(),
  integrityHash: z.string(),
  locale: z.string(),
});

export const createQuizSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  classroomId: z.string().uuid().optional(),
  durationMinutes: z.number().min(1).max(10).default(2),
  language: z.string().default("en"),
  questionIds: z.array(z.string().uuid()).min(1),
});

export const startAttemptSchema = z.object({
  deviceId: z.string().optional(),
  profileNamespace: z.string().optional(),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().uuid(),
  questionVersionId: z.string().uuid(),
  answer: z.string(),
  startedAt: z.string().datetime(),
  submittedAt: z.string().datetime(),
  latencyMs: z.number().min(0),
  attemptNumber: z.number().min(1).default(1),
  answerChangeCount: z.number().min(0).default(0),
});

export const submitQuizSchema = z.object({
  answers: z.array(submitAnswerSchema),
  networkState: z.string().optional(),
});

export type QuizPackage = z.infer<typeof quizPackageSchema>;
export type Question = z.infer<typeof questionSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type StartAttemptInput = z.infer<typeof startAttemptSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
