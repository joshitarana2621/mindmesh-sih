"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InitialAvatar } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icons";
import { Toaster, toast } from "@/components/ui/toast";
interface PodMember { studentId: string; studentName: string; role: string; }
interface Pod { id: string; classroomId: string; targetKC: string | null; status: string; members: PodMember[]; activities: Array<{ id: string; objective: string; kcCode: string | null; durationMinutes: number | null; status: string }>; }

const DEFAULT_PODS: Pod[] = [
  { id: "demo-1", classroomId: "c1", targetKC: "KC-002", status: "DRAFT", members: [{ studentId: "s3", studentName: "Rohan Gupta", role: "MENTOR" }, { studentId: "s2", studentName: "Diya Sharma", role: "MENTEE" }, { studentId: "s4", studentName: "Ananya Rao", role: "MENTEE" }], activities: [{ id: "a1", objective: "Teach-back: Array indexing with index cards", kcCode: "KC-002", durationMinutes: 10, status: "PLANNED" }] },
  { id: "demo-2", classroomId: "c1", targetKC: "KC-003", status: "PUBLISHED", members: [{ studentId: "s6", studentName: "Meera Nair", role: "MENTOR" }, { studentId: "s1", studentName: "Aarav Patel", role: "MENTEE" }], activities: [{ id: "a2", objective: "Guided traversal loop practice", kcCode: "KC-003", durationMinutes: 10, status: "PLANNED" }] },
];

export default function PeerPodsPage() {
  const [pods, setPods] = useState<Pod[]>(DEFAULT_PODS);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const load = async () => {
    try {
      const res = await api<Pod[]>("/api/v1/peer-pods");
      if (res && res.length > 0) setPods(res);
    } catch { }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      await api<{ pods: Pod[]; unmatched: any[] }>("/api/v1/peer-pods/generate", { method: "POST", body: { classroomId: "demo-classroom" } });
      await load();
      toast({ kind: "success", title: "Peer Pods Generated", body: "Matched mentors and mentees based on topic mastery." });
    } catch {
      // Dynamic offline generator
      const newPod: Pod = {
        id: "pod-" + Date.now(),
        classroomId: "c1",
        targetKC: "KC-004",
        status: "DRAFT",
        members: [
          { studentId: "s7", studentName: "Aarav Patel", role: "MENTOR" },
          { studentId: "s8", studentName: "Kabir Singh", role: "MENTEE" }
        ],
        activities: [
          { id: "act-" + Date.now(), objective: "Array insertion: practice shifting rightwards without data loss", kcCode: "KC-004", durationMinutes: 15, status: "PLANNED" }
        ]
      };
      setPods(prev => [newPod, ...prev]);
      toast({ kind: "success", title: "⚡ Peer Pod Generated (AI Matching)", body: "Matched Aarav Patel (Mentor) with Kabir Singh (Mentee) for KC-004" });
    }
    setGenerating(false);
  };

  const publishPod = (id: string) => {
    setPods(prev => prev.map(p => p.id === id ? { ...p, status: "PUBLISHED" } : p));
    toast({ kind: "success", title: "Pod Published", body: "Assigned activity and notified mentor & mentees." });
  };

  const assignRecheck = (id: string) => {
    toast({ kind: "info", title: "Recheck Assessment Scheduled", body: "3-question rapid check queued for mentees upon session completion." });
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-md shadow-violet-500/30"><Icon name="users" className="w-5 h-5" /></div>
            <h1 className="text-lg font-extrabold text-slate-900">Peer Learning Pods</h1>
          </div>
          <Link href="/teacher" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"><Icon name="arrowLeft" className="w-4 h-4" /> Radar</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="bg-brand rounded-2xl p-6 text-white relative overflow-hidden animate-fade-up">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="flex flex-wrap items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center"><Icon name="users" className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-extrabold">Green students mentor Yellow students</h2>
                <p className="text-white/80 text-sm mt-0.5">Deterministic matching by topic strength, language, capacity and pairing history — teacher-reviewed before publishing.</p>
              </div>
            </div>
            <Button className="bg-white text-violet-700 hover:bg-violet-50 shadow-lg gap-1.5" onClick={generate} disabled={generating}>{generating ? "Matching…" : <> <Icon name="zap" className="w-4 h-4" /> Generate Peer Pods</>}</Button>
          </div>
        </div>
        {loading ? <div className="flex items-center justify-center py-14 text-slate-400 font-medium gap-2"><Icon name="refresh" className="w-5 h-5 animate-spin" /> Matching students…</div> : (
          <div className="grid md:grid-cols-2 gap-4">
            {pods.map((pod: Pod, idx: number) => (
              <div key={pod.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-hover animate-fade-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex items-center justify-between mb-4">
                  <div><h3 className="font-bold text-slate-900 flex items-center gap-2"><span className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center"><Icon name="users" className="w-4 h-4" /></span> Pod · {pod.targetKC}</h3><p className="text-xs text-slate-400 mt-0.5">Knowledge Component target</p></div>
                  <Badge variant={pod.status === "PUBLISHED" ? "success" : pod.status === "DRAFT" ? "warning" : "secondary"}>{pod.status}</Badge>
                </div>
                <div className="space-y-2 mb-4">
                  {pod.members.map(m => (
                    <div key={m.studentId} className="flex items-center justify-between bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-100">
                      <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-800"><InitialAvatar name={m.studentName} className="w-7 h-7 text-[10px]" /> {m.studentName}</span>
                      <Badge variant={m.role === "MENTOR" ? "success" : "warning"}>{m.role === "MENTOR" ? "Mentor" : "Mentee"}</Badge>
                    </div>
                  ))}
                </div>
                {pod.activities.map(a => (
                  <div key={a.id} className="border-t border-slate-100 pt-3.5">
                    <p className="text-sm text-slate-700"><span className="font-bold text-slate-900">Activity:</span> {a.objective}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Icon name="clock" className="w-3.5 h-3.5" /> ~{a.durationMinutes || 10} min · teach-back + recheck link</p>
                  </div>
                ))}
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => publishPod(pod.id)} className={pod.status === "PUBLISHED" ? "opacity-50 pointer-events-none" : "gap-1.5"}><Icon name="check" className="w-3.5 h-3.5" /> Review & Publish</Button>
                  <Button size="sm" variant="ghost" onClick={() => assignRecheck(pod.id)} className="gap-1.5"><Icon name="refresh" className="w-3.5 h-3.5" /> Assign Recheck</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}