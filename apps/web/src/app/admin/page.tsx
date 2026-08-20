"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icons";
import { StatCard } from "@/components/ui/stat-card";
export default function AdminPage() {
  const auth = useAuthStore();
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [stats, setStats] = useState({ teachers: 2, students: 6, quizzes: 1, institutions: 1 });
  useEffect(() => { api<any[]>("/api/v1/classrooms").then(setClassrooms).catch(() => {}); }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-md shadow-violet-500/30"><Icon name="sparkles" className="w-5 h-5" /></div>
            <div><h1 className="text-lg font-extrabold text-slate-900">Institution Admin</h1><p className="text-xs text-slate-400 font-medium">{auth.institutionId ? `Institution: ${auth.institutionId.slice(0, 8)}` : "Demo School"}</p></div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => { auth.logout(); window.location.href = "/login"; }} className="gap-1.5"><Icon name="logout" className="w-3.5 h-3.5" /> Sign out</Button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up">
          <StatCard icon="users" label="Institutions" value={stats.institutions} accent="violet" />
          <StatCard icon="grad" label="Teachers" value={stats.teachers} accent="sky" />
          <StatCard icon="zap" label="Students" value={stats.students} accent="amber" />
          <StatCard icon="target" label="Quizzes" value={stats.quizzes} accent="emerald" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-up">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Icon name="users" className="w-5 h-5 text-violet-600" /> Classrooms</h2>
          <div className="space-y-3">
            {(classrooms.length ? classrooms : [{ id: "demo", name: "Grade 8 - Section A", gradeBand: "8", subject: "Computer Science", _count: { members: 8 } }]).map((c: any) => (
              <div key={c.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-4 card-hover">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-soft text-violet-600 flex items-center justify-center"><Icon name="book" className="w-5 h-5" /></div>
                  <div><p className="font-bold text-slate-800">{c.name}</p><p className="text-xs text-slate-400">{c.gradeBand || "Grade 8"} · {c.subject || "Computer Science"} · {c._count?.members || 8} members</p></div>
                </div>
                <div className="flex gap-2"><Badge variant="success">Active</Badge><Button size="sm" variant="outline">Manage</Button></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-up">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Icon name="book" className="w-5 h-5 text-violet-600" /> Curriculum & Knowledge Components</h2>
          <div className="text-sm text-slate-600 space-y-2.5">
            <p className="flex items-center gap-2"><span className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center"><Icon name="book" className="w-4 h-4" /></span> Course: Introduction to Programming (CS-801)</p>
            <p className="pl-9 flex items-center gap-2"><span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center"><Icon name="book" className="w-4 h-4" /></span> Subject: Fundamentals</p>
            <p className="pl-14 flex items-center gap-2"><span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center"><Icon name="book" className="w-4 h-4" /></span> Chapter: Data Structures</p>
            <p className="pl-19 flex items-center gap-2"><span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><Icon name="target" className="w-4 h-4" /></span> Topic: Arrays</p>
            <div className="pl-24 pt-2 flex flex-wrap gap-2">{[["KC-001", "Array declaration"], ["KC-002", "Array indexing"], ["KC-003", "Array traversal → needs KC-002"], ["KC-004", "Array insertion → needs KC-001, KC-002"]].map(([code, desc]) => (<span key={code} className="text-xs bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 font-medium text-slate-600"><span className="font-bold text-violet-600">{code}</span> {desc}</span>))}</div>
          </div>
        </div>
      </main>
    </div>
  );
}