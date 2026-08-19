const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export async function api<T>(path: string, opts: { method?: string; body?: unknown; headers?: Record<string, string> } = {}): Promise<T> {
  const { method = "GET", body, headers: extra = {} } = opts;
  const h: Record<string, string> = { "Content-Type": "application/json", ...extra };
  if (typeof window !== "undefined") {
    const s = localStorage.getItem("eduadpat-session");
    if (s) { const d = JSON.parse(s); h["x-session-user"] = d.userId; h["x-session-role"] = d.role; h["x-session-institution"] = d.institutionId; h["x-session-id"] = d.sessionId; }
  }
  const r = await fetch(`${API_URL}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json();
  if (!d.success) throw new Error(d.error?.message || "API failed");
  return d.data as T;
}
