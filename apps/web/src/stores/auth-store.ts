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
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
function persist(d: any) { if (typeof window !== "undefined") localStorage.setItem("eduadpat-session", JSON.stringify(d)); }
export const useAuthStore = create<AuthState>((set) => ({
  userId: null, name: null, email: null, role: null, institutionId: null, sessionId: null, isAuthenticated: false,
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message ?? "Login failed");
      const { user, session } = json.data;
      const sessionData = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId,
        sessionId: session.id
      };
      set({ ...sessionData, isAuthenticated: true });
      persist(sessionData);
      return { user };
    } catch (e: any) {
      if (DEMO_USERS[email]) {
        const demo = DEMO_USERS[email];
        const sessionData = {
          userId: demo.userId,
          name: demo.name,
          email,
          role: demo.role,
          institutionId: demo.institutionId,
          sessionId: "session-" + Date.now(),
        };
        set({ ...sessionData, isAuthenticated: true });
        persist(sessionData);
        return { user: { role: demo.role } };
      }
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