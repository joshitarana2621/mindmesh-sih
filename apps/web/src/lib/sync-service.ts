import { api } from "./api";
import { getPendingEvents, markEventSynced, getQueueCount } from "./indexeddb";
export async function syncPendingEvents(): Promise<{ accepted: number; duplicate: number; rejected: number; serverReachable: boolean }> {
  const events = await getPendingEvents();
  if (events.length === 0) return { accepted: 0, duplicate: 0, rejected: 0, serverReachable: true };
  const deviceId = typeof window !== "undefined" ? localStorage.getItem("eduadpat-device-id") || "unknown" : "unknown";
  const batch = events.map(e => ({ eventId: e.eventId, sequence: e.sequence, type: e.type, occurredAt: new Date().toISOString(), schemaVersion: 1, payload: e.payload }));
  try {
    const result = await api<{ receipts: Array<{ eventId: string; status: string; receiptId: string }> }>("/api/v1/sync/batch", { method: "POST", body: { deviceId, events: batch } });
    let accepted = 0, duplicate = 0, rejected = 0;
    for (const r of result.receipts) { await markEventSynced(r.eventId, { status: r.status, receiptId: r.receiptId }); if (r.status === "accepted") accepted++; else if (r.status === "duplicate") duplicate++; else rejected++; }
    return { accepted, duplicate, rejected, serverReachable: true };
  } catch {
    return { accepted: 0, duplicate: 0, rejected: 0, serverReachable: false };
  }
}
export async function getSyncQueueSize() { return getQueueCount(); }