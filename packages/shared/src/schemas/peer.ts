import { z } from "zod";

export const peerPodSchema = z.object({
  id: z.string().uuid(),
  classroomId: z.string().uuid(),
  targetKC: z.string().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "COMPLETED"]),
  members: z.array(z.object({
    studentId: z.string().uuid(),
    studentName: z.string(),
    role: z.enum(["MENTOR", "MENTEE"]),
  })),
  activities: z.array(z.object({
    id: z.string().uuid(),
    objective: z.string(),
    kcCode: z.string().nullable(),
    durationMinutes: z.number().nullable(),
    status: z.string(),
  })),
  createdAt: z.string().datetime(),
});

export const generatePeerPodsSchema = z.object({
  classroomId: z.string().uuid(),
  targetKC: z.string().optional(),
});

export const rotationPlanSchema = z.object({
  id: z.string().uuid(),
  classroomId: z.string().uuid(),
  name: z.string(),
  stationCount: z.number(),
  slotDurationMinutes: z.number(),
  totalSlots: z.number(),
  status: z.string(),
  assignments: z.array(z.object({
    groupNumber: z.number(),
    slotIndex: z.number(),
    station: z.string(),
    studentIds: z.array(z.string().uuid()),
  })),
  startedAt: z.string().datetime().nullable(),
});

export const createRotationPlanSchema = z.object({
  name: z.string().min(1),
  stationCount: z.number().min(2).max(5).default(3),
  slotDurationMinutes: z.number().min(5).max(60).default(15),
  totalSlots: z.number().min(1).max(10).default(3),
});

export type PeerPod = z.infer<typeof peerPodSchema>;
export type RotationPlan = z.infer<typeof rotationPlanSchema>;
