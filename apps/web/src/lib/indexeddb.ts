import { openDB, DBSchema, IDBPDatabase } from "idb";

interface EduadpatDB extends DBSchema {
  profiles: { key: string; value: { profileNamespace: string; userId: string; role: string; name: string } };
  contentPackages: { key: string; value: { packageId: string; version: number; quizId: string; data: unknown; downloadedAt: string } };
  attempts: { key: string; value: { attemptId: string; namespace: string; quizId: string; status: string; localScore?: number; startedAt: string; completedAt?: string }; indexes: { "by-namespace": string } };
  answers: { key: string; value: { key: string; attemptId: string; questionId: string; answer: string; isCorrect?: boolean; latencyMs: number; attemptNumber: number; answerChangeCount: number; submittedAt: string }; indexes: { "by-attempt": string } };
  telemetryEvents: { key: string; value: { eventId: string; type: string; profileNamespace: string; deviceId: string; sequence: number; payload: unknown; occurredAt: string; syncedAt?: string } };
  syncQueue: { key: string; value: { eventId: string; sequence: number; type: string; payload: unknown; status: string; attempts: number; createdAt: string } };
  syncReceipts: { key: string; value: { eventId: string; status: string; receiptId: string; serverOutcome?: unknown } };
  settings: { key: string; value: { key: string; value: unknown } };
}

let dbInstance: IDBPDatabase<EduadpatDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<EduadpatDB>> {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB<EduadpatDB>("eduadpat", 1, {
    upgrade(db) {
      db.createObjectStore("profiles", { keyPath: "profileNamespace" });
      db.createObjectStore("contentPackages", { keyPath: "packageId" });
      const a = db.createObjectStore("attempts", { keyPath: "attemptId" });
      a.createIndex("by-namespace", "namespace");
      const an = db.createObjectStore("answers", { keyPath: "key" });
      an.createIndex("by-attempt", "attemptId");
      db.createObjectStore("telemetryEvents", { keyPath: "eventId" });
      db.createObjectStore("syncQueue", { keyPath: "eventId" });
      db.createObjectStore("syncReceipts", { keyPath: "eventId" });
      db.createObjectStore("settings", { keyPath: "key" });
    },
  });
  return dbInstance;
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("eduadpat-device-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("eduadpat-device-id", id);
  }
  return id;
}

export async function saveAnswer(answer: EduadpatDB["answers"]["value"]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["answers", "telemetryEvents", "syncQueue"], "readwrite");
  await tx.objectStore("answers").put(answer);
  const evt = {
    eventId: crypto.randomUUID(),
    type: "question.answered",
    profileNamespace: "default",
    deviceId: getDeviceId(),
    sequence: Date.now(),
    payload: { attemptId: answer.attemptId, questionId: answer.questionId, answer: answer.answer },
    occurredAt: new Date().toISOString(),
  };
  await tx.objectStore("telemetryEvents").put(evt);
  await tx.objectStore("syncQueue").put({
    eventId: evt.eventId,
    sequence: evt.sequence,
    type: evt.type,
    payload: evt.payload,
    status: "pending",
    attempts: 0,
    createdAt: evt.occurredAt,
  });
  await tx.done;
}

export interface QueuedQuizAttempt {
  attemptId: string;
  quizId: string;
  title: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  namespace: string;
  completedAt: string;
  answers: Record<string, { answer: string; isCorrect: boolean }>;
}

export async function queueQuizCompletion(payload: {
  attemptId: string;
  quizId: string;
  title?: string;
  namespace: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  answers: Record<string, { answer: string; isCorrect: boolean }>;
  completedAt: string;
}): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["attempts", "telemetryEvents", "syncQueue"], "readwrite");
  await tx.objectStore("attempts").put({
    attemptId: payload.attemptId,
    namespace: payload.namespace,
    quizId: payload.quizId,
    status: "COMPLETED",
    startedAt: payload.completedAt,
    completedAt: payload.completedAt,
    localScore: payload.score,
  });
  const evt = {
    eventId: crypto.randomUUID(),
    type: "quiz.completed",
    profileNamespace: payload.namespace,
    deviceId: getDeviceId(),
    sequence: Date.now(),
    payload: {
      attemptId: payload.attemptId,
      quizId: payload.quizId,
      title: payload.title || "Arrays Quick Check",
      score: payload.score,
      totalQuestions: payload.totalQuestions,
      correctCount: payload.correctCount,
      answers: payload.answers,
      completedAt: payload.completedAt,
    },
    occurredAt: payload.completedAt,
  };
  await tx.objectStore("telemetryEvents").put(evt);
  await tx.objectStore("syncQueue").put({
    eventId: evt.eventId,
    sequence: evt.sequence,
    type: evt.type,
    payload: evt.payload,
    status: "pending",
    attempts: 0,
    createdAt: evt.occurredAt,
  });
  await tx.done;
}

export async function getQueuedQuizAttempts(): Promise<QueuedQuizAttempt[]> {
  const db = await getDB();
  const queue = await db.getAll("syncQueue");
  return queue
    .filter((e) => e.status === "pending" && e.type === "quiz.completed")
    .map((e) => e.payload as QueuedQuizAttempt)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
}

export async function getQueueCount(): Promise<number> {
  const db = await getDB();
  return (await db.getAll("syncQueue")).filter((e) => e.status === "pending").length;
}

export async function getPendingEvents() {
  const db = await getDB();
  return (await db.getAll("syncQueue")).filter((e) => e.status === "pending").sort((a, b) => a.sequence - b.sequence);
}

export async function markEventSynced(eventId: string, receipt: { status: string; receiptId: string }) {
  const db = await getDB();
  await db.put("syncReceipts", { eventId, ...receipt });
  await db.delete("syncQueue", eventId);
}

export async function saveQuizPackage(pkg: EduadpatDB["contentPackages"]["value"]) {
  const db = await getDB();
  await db.put("contentPackages", pkg);
}

export async function getQuizPackage(packageId: string) {
  const db = await getDB();
  return db.get("contentPackages", packageId);
}

export async function saveAttempt(attempt: {
  attemptId: string;
  namespace: string;
  quizId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  localScore?: number;
}) {
  const db = await getDB();
  await db.put("attempts", attempt);
}

export async function getAttemptsByNamespace(namespace: string) {
  const db = await getDB();
  return db.getAllFromIndex("attempts", "by-namespace", namespace);
}
