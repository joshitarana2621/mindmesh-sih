"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Icon } from "@/components/ui/icons";

const DEMO_ACCOUNTS = [
  { email: "teacher@demoschool.edu", role: "Teacher", color: "bg-sky-500" },
  { email: "student1@demoschool.edu", role: "Student", color: "bg-emerald-500" },
  { email: "admin@demoschool.edu", role: "Admin", color: "bg-violet-500" },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("teacher@demoschool.edu");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user.role === "TEACHER") router.push("/teacher");
      else if (res.user.role === "STUDENT") router.push("/student");
      else router.push("/admin");
    } catch (err: any) {
      setError(err?.message ?? "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-brand p-12 text-white">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="relative flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur border border-white/25 flex items-center justify-center font-extrabold">E</div>
          <span className="font-extrabold text-xl tracking-tight">EduAdapt</span>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">Every student,<br />seen clearly.</h1>
          <p className="text-white/80 leading-relaxed max-w-md">
            Topic-level analytics, early-risk detection and a teacher radar that turns raw attempts into one clear signal: who needs help, right now.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Micro-assessments", "Offline-first", "Intervention Radar", "Peer pods"].map((t) => (
              <span key={t} className="bg-white/15 backdrop-blur border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-semibold">{t}</span>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/60">© 2026 EduAdapt · Smart India Hackathon</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center font-extrabold">E</div>
            <span className="font-extrabold text-slate-900 text-lg">EduAdapt</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-xl font-extrabold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to your demo school account</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                  placeholder="you@school.edu"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                  placeholder="••••••"
                />
              </div>
              {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white rounded-xl py-2.5 text-sm font-bold hover:opacity-90 disabled:opacity-50 shadow-md shadow-violet-500/30 transition-all active:scale-[.98]"
              >
                {loading ? "Signing in…" : "Sign in →"}
              </button>
            </form>
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Demo accounts</p>
              <div className="space-y-1.5">
                {DEMO_ACCOUNTS.map((d) => (
                  <button key={d.email} onClick={() => { setEmail(d.email); setPassword("demo123"); }} className="w-full flex items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 transition-colors">
                    <span className={`w-2 h-2 rounded-full ${d.color}`} />
                    <span className="text-sm text-slate-600 flex-1">{d.email}</span>
                    <span className="text-xs font-semibold text-slate-400">{d.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 text-center"><Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-violet-600 transition-colors"><Icon name="arrowLeft" className="w-4 h-4" /> Back to home</Link></div>
        </div>
      </div>
    </div>
  );
}