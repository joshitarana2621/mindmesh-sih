import { z } from "zod";

export const telemetryEventSchema = z.object({
  eventId: z.string().uuid(),
  type: z.string(),
  profileNamespace: z.string(),
  deviceId: z.string(),
  payload: z.any(),
  occurredAt: z.string().datetime(),
  schemaVersion: z.number().default(1),
});

export const telemetryBatchSchema = z.object({
  events: z.array(telemetryEventSchema).min(1).max(100),
});

export const masterySchema = z.object({
  studentId: z.string().uuid(),
  kcCode: z.string(),
  kcName: z.string(),
  accuracy: z.number().min(0).max(1),
  latencyScore: z.number().min(0).max(1),
  kcPerformance: z.number().min(0).max(1),
  mastery: z.number().min(0).max(1),
  attemptCount: z.number(),
  band: z.enum(["RED", "YELLOW", "GREEN", "INSUFFICIENT"]),
});

export type TelemetryEvent = z.infer<typeof telemetryEventSchema>;
export type Mastery = z.infer<typeof masterySchema>;
