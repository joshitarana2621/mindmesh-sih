import { z } from "zod";

export const classroomSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  gradeBand: z.string().nullable(),
  subject: z.string().nullable(),
  institutionId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export const createClassroomSchema = z.object({
  name: z.string().min(1).max(200),
  gradeBand: z.string().optional(),
  subject: z.string().optional(),
});

export const classroomMemberSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(["STUDENT", "TEACHER", "ASSISTANT"]),
  name: z.string(),
  email: z.string().email().nullable(),
});

export type Classroom = z.infer<typeof classroomSchema>;
export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
export type ClassroomMember = z.infer<typeof classroomMemberSchema>;
