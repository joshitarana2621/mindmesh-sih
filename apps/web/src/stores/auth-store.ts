import { create } from "zustand";
interface AuthState {
  userId: string | null; name: string | null; email: string | null; role: string | null;
  institutionId: string | null; sessionId: string | null; isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: { role: string } }>;
  logout: () => void;
  hydrate: () => void;
}
const DEMO_USERS: Record<string, { userId: string; name: string; role: string; institutionId: string }> = {
  "teacher@demoschool.edu": { userId: "demo-user-teacher", name: "Demo Teacher", role: "TEACHER", institutionId: "demo-institution" },
  "student1@demoschool.edu": { userId: "demo-user-student1", name: "Aarav", role: "STUDENT", institutionId: "demo-institution" },
  "admin@demoschool.edu": { userId: "demo-user-admin", name: "Demo Admin", role: "ADMIN", institutionId: "demo-institution" },
};
function persist(d: any) { if (typeof window !== "undefined") localStorage.setItem("eduadpat-session", JSON.stringify(d)); }
export const useAuthStore = create<AuthState>((set) => ({
  userId: null, name: null, email: null, role: null, institutionId: null, sessionId: null, isAuthenticated: false,
  login: async (email, password) => {
    const demo = DEMO_USERS[email.toLowerCase().trim()];
    if (demo) {
      const user = demo;
      set({ ...user, email, sessionId: "demo-session", isAuthenticated: true });
      persist({ ...user, email, sessionId: "demo-session" });
      return { user };
    }
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      set({ ...data.user, sessionId: data.sessionId, email, isAuthenticated: true });
      persist({ ...data.user, sessionId: data.sessionId, email });
      return { user: data.user };
    } catch (e: any) {
      throw new Error(e?.message ?? "Could not reach server");
    }
  },
  logout: () => {
    if (typeof window !== "undefined") localStorage.removeItem("eduadpat-session");
    set({ userId: null, name: null, email: null, role: null, institutionId: null, sessionId: null, isAuthenticated: false });
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    const s = localStorage.getItem("eduadpat-session");
    if (!s) return;
    try { const d = JSON.parse(s); set({ ...d, isAuthenticated: true }); } catch {}
  },
}));
export function initAuthFromStorage() { useAuthStore.getState().hydrate(); }