import { z } from "zod";

export const interventionEventSchema = z.object({
  id: z.string().uuid(),
  classroomId: z.string().uuid(),
  studentId: z.string().uuid(),
  studentName: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  triggerFamily: z.string(),
  evidence: z.any(),
  knowledgeComponentCode: z.string().optional(),
  knowledgeComponentName: z.string().optional(),
  recommendedActionText: z.string().optional(),
  status: z.enum(["OPEN", "ACKNOWLEDGED", "SNOOZED", "IN_PROGRESS", "RESOLVED", "DISMISSED"]),
  eventCount: z.number(),
  lastEvidenceAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  acknowledgedAt: z.string().datetime().nullable(),
  resolvedAt: z.string().datetime().nullable(),
  outcome: z.string().nullable(),
});

export const acknowledgeInterventionSchema = z.object({
  reason: z.string().optional(),
});

export const resolveInterventionSchema = z.object({
  outcome: z.string().min(1),
  recheckAttemptId: z.string().uuid().optional(),
});

export const snoozeInterventionSchema = z.object({
  until: z.string().datetime(),
});

export const dismissInterventionSchema = z.object({
  reason: z.string().min(1),
});

export type InterventionEvent = z.infer<typeof interventionEventSchema>;
