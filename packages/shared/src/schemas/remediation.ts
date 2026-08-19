import { z } from "zod";

export const remediationRequestSchema = z.object({
  kcCode: z.string(),
  misconception: z.string().optional(),
  language: z.string().default("en"),
  contentVersion: z.string().optional(),
});

export const remediationResponseSchema = z.object({
  content: z.string(),
  type: z.enum(["explanation", "practice_prompt", "activity_suggestion"]),
  language: z.string(),
  promptVersion: z.string(),
  schemaVersion: z.number(),
  isAiGenerated: z.boolean(),
  fallbackUsed: z.boolean(),
});

export const quizGeneratorRequestSchema = z.object({
  kcCode: z.string(),
  topicName: z.string(),
  difficulty: z.number().min(0).max(1),
  questionCount: z.number().min(1).max(10).default(3),
  language: z.string().default("en"),
  gradeBand: z.string(),
});

export type RemediationRequest = z.infer<typeof remediationRequestSchema>;
export type RemediationResponse = z.infer<typeof remediationResponseSchema>;
