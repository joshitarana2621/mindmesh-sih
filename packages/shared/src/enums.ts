import { z } from "zod";

export const UserRole = z.enum(["STUDENT", "TEACHER", "INSTITUTION_ADMIN", "PLATFORM_SUPPORT"]);
export type UserRole = z.infer<typeof UserRole>;

export const ClassroomRole = z.enum(["STUDENT", "TEACHER", "ASSISTANT"]);
export type ClassroomRole = z.infer<typeof ClassroomRole>;

export const QuizStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export type QuizStatus = z.infer<typeof QuizStatus>;

export const QuestionType = z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]);
export type QuestionType = z.infer<typeof QuestionType>;

export const AttemptStatus = z.enum([
  "ASSIGNED", "DOWNLOADED", "AVAILABLE_OFFLINE", "STARTED",
  "IN_PROGRESS", "COMPLETED", "LOCALLY_SCORED", "QUEUED", "SYNCED", "NEEDS_ATTENTION"
]);
export type AttemptStatus = z.infer<typeof AttemptStatus>;

export const RiskPriority = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export type RiskPriority = z.infer<typeof RiskPriority>;

export const MisconceptionCategory = z.enum([
  "CALCULATION_SLIP", "READING_ERROR", "CARELESS_ERROR", "SYNTAX_ERROR",
  "LOGICAL_ERROR", "CONCEPTUAL_ERROR", "PREREQUISITE_GAP", "UNKNOWN"
]);
export type MisconceptionCategory = z.infer<typeof MisconceptionCategory>;

export const InterventionStatus = z.enum([
  "OPEN", "ACKNOWLEDGED", "SNOOZED", "IN_PROGRESS", "RESOLVED", "DISMISSED"
]);
export type InterventionStatus = z.infer<typeof InterventionStatus>;

export const SyncStatus = z.enum(["PENDING", "ACCEPTED", "DUPLICATE", "REJECTED"]);
export type SyncStatus = z.infer<typeof SyncStatus>;

export const PeerRole = z.enum(["MENTOR", "MENTEE"]);
export type PeerRole = z.infer<typeof PeerRole>;

export const PeerPodStatus = z.enum(["DRAFT", "PUBLISHED", "COMPLETED"]);
export type PeerPodStatus = z.infer<typeof PeerPodStatus>;

export const ConnectivityState = z.enum(["ONLINE", "OFFLINE", "SYNCING", "NEEDS_ATTENTION"]);
export type ConnectivityState = z.infer<typeof ConnectivityState>;

export const MasteryBand = z.enum(["RED", "YELLOW", "GREEN", "INSUFFICIENT"]);
export type MasteryBand = z.infer<typeof MasteryBand>;

export const TelemetryEventType = z.enum([
  "question.answered", "quiz.started", "quiz.completed", "quiz.abandoned",
  "package.downloaded", "sync.completed", "sync.failed", "student.risk.changed",
]);
export type TelemetryEventType = z.infer<typeof TelemetryEventType>;
