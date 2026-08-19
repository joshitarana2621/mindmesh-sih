import { z } from "zod";

export const syncEventPayloadSchema = z.object({
  attemptId: z.string().uuid().optional(),
  questionId: z.string().uuid().optional(),
  quizId: z.string().uuid().optional(),
  answers: z.array(z.any()).optional(),
  mastery: z.any().optional(),
  telemetry: z.any().optional(),
}).passthrough();

export const syncEventSchema = z.object({
  eventId: z.string().uuid(),
  sequence: z.number().min(0),
  type: z.string(),
  occurredAt: z.string().datetime(),
  schemaVersion: z.number().default(1),
  payload: syncEventPayloadSchema,
});

export const syncBatchSchema = z.object({
  deviceId: z.string().min(1),
  events: z.array(syncEventSchema).min(1).max(50),
});

export const syncReceiptSchema = z.object({
  eventId: z.string().uuid(),
  status: z.enum(["accepted", "duplicate", "rejected"]),
  receiptId: z.string().uuid(),
  resolution: z.string().optional(),
  serverOutcome: z.any().optional(),
});

export const syncBatchResponseSchema = z.object({
  receipts: z.array(syncReceiptSchema),
  syncVersion: z.string(),
});

export type SyncEvent = z.infer<typeof syncEventSchema>;
export type SyncBatch = z.infer<typeof syncBatchSchema>;
export type SyncReceipt = z.infer<typeof syncReceiptSchema>;
export type SyncBatchResponse = z.infer<typeof syncBatchResponseSchema>;
