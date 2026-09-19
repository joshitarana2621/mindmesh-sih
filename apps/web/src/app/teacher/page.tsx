"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useRadarStore } from "@/stores/radar-store";
import { getSocket, connectSocket } from "@/lib/socket";
import { useSync } from "@/hooks/use-sync";
import { getPriorityStyle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InitialAvatar } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icons";
import { StatCard } from "@/components/ui/stat-card";
import { Toaster, toast } from "@/components/ui/toast";
import { DemoBadge } from "@/components/ui/demo-badge";
import { cn } from "@/lib/utils";
interface Intervention { id: string; studentName: string; priority: string; triggerFamily: string; knowledgeComponentName?: string; knowledgeComponentCode?: string; status: string; evidence: any; recommendedActionText?: string; createdAt: string; eventCount: number; classroomId: string; }
export default function TeacherDashboard() {
  const auth = useAuthStore();
  const radar = useRadarStore();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "HIGH">("ALL");
  const [loading, setLoading] = useState(true);
  const [expandedAI, setExpandedAI] = useState<Record<string, boolean>>({});
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});

  const triggerAI = (id: string) => {
    setLoadingAI(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoadingAI(prev => ({ ...prev, [id]: false }));
      setExpandedAI(prev => ({ ...prev, [id]: true }));
    }, 1000);
  };

  const AI_RECOMMENDATIONS: Record<string, { gap: string; plan: string[]; buddy: string }> = {
    "Rohan Gupta": {
      gap: "Confuses 0-based indexing with 1-based counting. Attempting to access index 'size' instead of 'size - 1'.",
      plan: [
        "Present a physical grid representing cells from index 0 to index 4.",
        "Solve 3 boundary-check exercises on index-based offset calculations.",
        "Perform a 2-minute trace logic walkthrough on the whiteboard."
      ],
      buddy: "Aarav Patel (90% mastery)"
    },
    "Ananya Rao": {
      gap: "Off-by-one boundary error in traversal loops. Using '<=' instead of '<' loop comparison.",
      plan: [
        "Review syntax distinction between termination conditions (< vs <=).",
        "Deploy a code trace table to track values in the final iteration.",
        "Simulate index boundary execution step-by-step."
      ],
      buddy: "Diya Sharma (85% mastery)"
    },
    "Kabir Singh": {
      gap: "Prerequisite Gap: Student is attempting to traverse arrays (KC-003) while declaration syntax (KC-001) is failing.",
      plan: [
        "Temporarily pause current traversal assignments.",
        "Auto-assign 2 micro-modules focusing on array declaration syntax.",
        "Verify base syntax mastery before resuming loops."
      ],
      buddy: "Aarav Patel (90% mastery)"
    },
    "Meera Nair": {
      gap: "Stall Detected: Accuracy is highly erratic (guessing pattern) indicating lack of confidence.",
      plan: [
        "Convert standard MCQs to scaffolded drag-and-drop code blocks.",
        "Provide 3 fill-in-the-blank traversal statements.",
        "Assign 1 peer mentoring activity."
      ],
      buddy: "Rohan Gupta (80% mastery)"
    }
  };
  useSync();
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api<Intervention[]>("/api/v1/interventions");
        setInterventions(data); radar.setInterventions(data);
      } catch { }
      setLoading(false);
    };
    load();
    connectSocket();
    const s = getSocket();
    s.on("intervention.created", (ev: any) => { const i = ev.payload; setInterventions(prev => [i, ...prev]); });
    s.on("intervention.acknowledged", (ev: any) => { setInterventions(prev => prev.map(i => i.id === ev.payload.interventionId ? { ...i, status: "ACKNOWLEDGED" } : i)); });
    s.on("intervention.resolved", (ev: any) => { setInterventions(prev => prev.map(i => i.id === ev.payload.interventionId ? { ...i, status: "RESOLVED", outcome: ev.payload.outcome } : i)); });
    s.connect();
    return () => { s.off("intervention.created"); s.off("intervention.acknowledged"); s.off("intervention.resolved"); };
  }, []);
  const act = async (id: string, action: "acknowledge" | "resolve" | "dismiss") => {
    try {
      const body = action === "resolve" ? { outcome: "Intervention completed - recheck scheduled" } : action === "dismiss" ? { reason: "Not applicable - teacher judgement" } : { reason: "Teacher acknowledged" };
      await api(`/api/v1/interventions/${id}/${action}`, { method: "POST", body });
      setInterventions(prev => prev.map(i => i.id === id ? { ...i, status: action === "acknowledge" ? "ACKNOWLEDGED" : action === "resolve" ? "RESOLVED" : "DISMISSED" } : i));
    } catch { }
  };
  const filtered = interventions.filter(i => filter === "ALL" ? true : filter === "OPEN" ? i.status === "OPEN" : i.priority === "HIGH" || i.priority === "CRITICAL");
  const openCount = interventions.filter(i => i.status === "OPEN").length;
  const highCount = interventions.filter(i => i.priority === "HIGH" || i.priority === "CRITICAL").length;
  const resolvedCount = interventions.filter(i => i.status === "RESOLVED").length;
  const simulateAlert = () => {
    const simStudents = [
      { name: "Rohan Gupta", kc: "Array indexing", code: "KC-002", evidence: "Failed 4 of last 5 answers on arr[1] style questions. Latency rising (34s avg). Mastery falling: 0.6 → 0.32.", fam: "mastery.drop", pri: "HIGH" },
      { name: "Ananya Rao", kc: "Array traversal", code: "KC-003", evidence: "3 consecutive wrong loop conditions. Repeated misconception pattern: off-by-one in for-loop bounds.", fam: "error.repetition", pri: "CRITICAL" },
      { name: "Kabir Singh", kc: "Array declaration", code: "KC-001", evidence: "Attempting KC-004 but prerequisite KC-001 is RED. Completion rate dropping from 82% to 41%.", fam: "prerequisite.gap", pri: "MEDIUM" },
      { name: "Meera Nair", kc: "Array insertion", code: "KC-004", evidence: "2 correct then 2 wrong — inconsistent mastery. Confidence dropping, recent accuracy 25%.", fam: "stall.detected", pri: "LOW" },
    ];
    const sel = simStudents[Math.floor(Math.random() * simStudents.length)];
    const ev: Intervention = { id: "sim-" + Date.now(), studentName: sel.name, priority: sel.pri, triggerFamily: sel.fam, knowledgeComponentName: sel.kc, knowledgeComponentCode: sel.code, status: "OPEN", evidence: sel.evidence, createdAt: new Date().toISOString(), eventCount: 2 + Math.floor(Math.random() * 5), classroomId: "demo-classroom" };
    radar.upsertIntervention(ev);
    setInterventions(prev => [ev, ...prev]);
    toast({ kind: "alert", title: `🛰️ Alert: ${sel.name} needs help`, body: `${sel.kc} · ${sel.pri} priority · ${sel.fam}` });
    try { new Notification("EduAdapt Intervention Radar", { body: `${sel.name} — ${sel.kc} (${sel.pri})` }); } catch {}
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-md shadow-violet-500/30"><Icon name="radar" className="w-5 h-5" /></div>
            <div><h1 className="text-lg font-extrabold text-slate-900">Intervention Radar</h1><p className="text-xs text-slate-400 font-medium">Welcome, {auth.name || "Teacher"}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/teacher/heatmap" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:border-violet-300 hover:text-violet-600 transition-colors shadow-sm"><Icon name="radar" className="w-4 h-4" /> Heatmap</Link>
            <Link href="/teacher/peers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:border-violet-300 hover:text-violet-600 transition-colors shadow-sm"><Icon name="users" className="w-4 h-4" /> Peer Pods</Link>
            <Link href="/teacher/rotations" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:border-violet-300 hover:text-violet-600 transition-colors shadow-sm"><Icon name="refresh" className="w-4 h-4" /> Rotations</Link>
            <Button size="sm" variant="ghost" onClick={() => { auth.logout(); window.location.href = "/login"; }} className="gap-1.5"><Icon name="logout" className="w-3.5 h-3.5" /> Sign out</Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <DemoBadge showReset />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up">
          <StatCard icon="bell" label="Total Alerts" value={interventions.length} accent="violet" />
          <StatCard icon="alert" label="Open" value={openCount} accent="rose" />
          <StatCard icon="radar" label="High / Critical" value={highCount} accent="amber" />
          <StatCard icon="check" label="Resolved" value={resolvedCount} accent="emerald" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Icon name="chart" className="w-5 h-5 text-sky-600" /> Classroom Skill Matrix (Real-time)
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Cohort learning gaps tracked across core Array Knowledge Components</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Mastered (≥80%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Developing (50-80%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> At Risk (&lt;50%)</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[650px] grid grid-cols-5 gap-3 border border-slate-100 bg-slate-50/50 rounded-2xl p-4">
              <div className="font-bold text-xs text-slate-400 self-center">Student</div>
              <div className="text-center font-bold text-xs text-slate-500 bg-white border border-slate-100 rounded-xl p-2.5">
                KC-001<br/><span className="text-[9px] font-semibold text-slate-400">Declaration</span>
              </div>
              <div className="text-center font-bold text-xs text-slate-500 bg-white border border-slate-100 rounded-xl p-2.5">
                KC-002<br/><span className="text-[9px] font-semibold text-slate-400">Indexing</span>
              </div>
              <div className="text-center font-bold text-xs text-slate-500 bg-white border border-slate-100 rounded-xl p-2.5">
                KC-003<br/><span className="text-[9px] font-semibold text-slate-400">Traversal</span>
              </div>
              <div className="text-center font-bold text-xs text-slate-500 bg-white border border-slate-100 rounded-xl p-2.5">
                KC-004<br/><span className="text-[9px] font-semibold text-slate-400">Insertion</span>
              </div>

              {[
                { name: "Aarav Patel", scores: [0.90, 0.45, 0.65, 0.85] },
                { name: "Diya Sharma", scores: [0.85, 0.75, 0.60, 0.40] },
                { name: "Rohan Gupta", scores: [0.70, 0.32, 0.55, 0.65] },
                { name: "Ananya Rao", scores: [0.80, 0.65, 0.38, 0.50] },
                { name: "Kabir Singh", scores: [0.41, 0.55, 0.60, 0.35] }
              ].map((st) => (
                <React.Fragment key={st.name}>
                  <div className="text-xs font-semibold text-slate-700 self-center flex items-center gap-2">
                    <InitialAvatar name={st.name} className="w-7 h-7 text-[10px]" /> {st.name}
                  </div>
                  {st.scores.map((sc, scidx) => {
                    const bg = sc >= 0.8 ? "bg-emerald-500/10 text-emerald-700 border-emerald-200" : sc >= 0.5 ? "bg-amber-500/10 text-amber-700 border-amber-200" : "bg-rose-500/10 text-rose-700 border-rose-200";
                    return (
                      <div key={scidx} className={cn("text-center font-bold text-xs border rounded-xl py-3.5 shadow-sm transition-all hover:scale-[1.03] duration-150 cursor-help", bg)}>
                        {Math.round(sc * 100)}%
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden animate-fade-up">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="flex flex-wrap items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                <Icon name="radar" className="w-6 h-6 text-violet-300" />
                <span className="absolute inset-0 rounded-full border border-violet-400/40 animate-radar" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Who needs help · which topic · how urgent</h2>
                <p className="text-slate-400 text-sm mt-0.5">Prioritized, deduplicated, explainable — updated live via socket.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => { try { Notification.requestPermission(); } catch {} simulateAlert(); }} className="inline-flex items-center gap-1.5 bg-rose-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-rose-500/40 hover:bg-rose-600 transition-all active:scale-[.98]">
                <Icon name="bell" className="w-4 h-4" /> Simulate Live Alert
              </button>
              <div className="flex gap-1.5 bg-white/10 rounded-xl p-1 border border-white/10">
                {(["ALL", "OPEN", "HIGH"] as const).map(f => <button key={f} onClick={() => setFilter(f)} className={cn("px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors", filter === f ? "bg-white text-slate-900 shadow" : "text-slate-300 hover:bg-white/10")}>{f}</button>)}
              </div>
            </div>
          </div>
        </div>
        {loading ? <div className="flex items-center justify-center py-14 text-slate-400 font-medium gap-2"><Icon name="refresh" className="w-5 h-5 animate-spin" /> Scanning classroom…</div> : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 animate-fade-up">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3"><Icon name="check" className="w-7 h-7" /></div>
            <p className="text-slate-700 font-bold">No intervention alerts</p>
            <p className="text-sm text-slate-400 mt-1">When a student shows repeated errors or low mastery, an alert appears here with full evidence.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((i, idx) => { const p = getPriorityStyle(i.priority); return (
              <div key={i.id} className={cn("bg-white rounded-2xl border-l-4 p-5 shadow-sm card-hover animate-fade-up", p.ring, i.priority === "CRITICAL" && i.status === "OPEN" && "animate-pulse-ring")} style={{ animationDelay: `${idx * 40}ms` }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <InitialAvatar name={i.studentName} className="w-11 h-11" />
                    <div>
                      <p className="font-bold text-slate-900">{i.studentName}</p>
                      <p className="text-sm text-slate-400">{i.knowledgeComponentName || i.knowledgeComponentCode || "Topic"} · {new Date(i.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2"><Badge className={p.color}>{p.label}</Badge><Badge variant={i.status === "OPEN" ? "destructive" : "secondary"}>{i.status}</Badge></div>
                </div>
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm">
                  <p className="text-slate-600">{typeof i.evidence === "string" ? i.evidence : (JSON.stringify(i.evidence)||"").slice(0, 120)}</p>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5"><Icon name="zap" className="w-3.5 h-3.5" /> {i.triggerFamily} · {i.eventCount} aggregated events · {i.recommendedActionText || "Recommended: review topic with student"}</p>
                </div>
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => act(i.id, "acknowledge")} disabled={i.status !== "OPEN"} className="gap-1.5"><Icon name="check" className="w-3.5 h-3.5" /> Acknowledge</Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5" onClick={() => act(i.id, "resolve")} disabled={i.status === "RESOLVED" || i.status === "DISMISSED"}><Icon name="check" className="w-3.5 h-3.5" /> Resolve + Recheck</Button>
                    <Button size="sm" variant="ghost" onClick={() => act(i.id, "dismiss")} disabled={i.status === "RESOLVED" || i.status === "DISMISSED"}>Dismiss</Button>
                  </div>
                  
                  {i.status === "OPEN" && (
                    <Button 
                      size="sm" 
                      onClick={() => triggerAI(i.id)} 
                      disabled={loadingAI[i.id] || expandedAI[i.id]}
                      className="bg-gradient-to-r from-sky-700 to-blue-800 hover:opacity-90 text-white font-bold gap-1.5 shadow-md shadow-blue-800/25"
                    >
                      <Icon name="sparkles" className="w-3.5 h-3.5" />
                      {loadingAI[i.id] ? "Analyzing..." : expandedAI[i.id] ? "Copilot Analyzed" : "Reveal AI Action Plan"}
                    </Button>
                  )}
                </div>

                {loadingAI[i.id] && (
                  <div className="mt-3 bg-sky-50/30 border border-dashed border-sky-200 rounded-xl p-4 flex items-center justify-center gap-2 text-sky-800 font-semibold text-xs animate-pulse">
                    <Icon name="refresh" className="w-4 h-4 animate-spin" /> Analyzing learning gap with AI Copilot...
                  </div>
                )}

                {expandedAI[i.id] && AI_RECOMMENDATIONS[i.studentName] && (() => {
                  const rec = AI_RECOMMENDATIONS[i.studentName];
                  return (
                    <div className="mt-3 bg-gradient-to-br from-sky-50/40 to-blue-50/30 border border-sky-100 rounded-xl p-4 animate-fade-up">
                      <div className="flex items-center gap-2 text-sky-800 font-extrabold text-xs uppercase tracking-wide">
                        <Icon name="sparkles" className="w-4 h-4 text-sky-600 animate-pulse" /> AI Copilot Learning Recommendation
                      </div>
                      <div className="mt-2.5 text-sm text-slate-700">
                        <p className="font-semibold text-slate-800 text-xs">Detected Skill Gap:</p>
                        <p className="text-slate-600 text-xs mt-0.5">{rec.gap}</p>
                      </div>
                      <div className="mt-3 text-sm text-slate-700">
                        <p className="font-semibold text-slate-800 text-xs">Scaffolded Intervention Plan:</p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs mt-1">
                          {rec.plan.map((p, idx) => <li key={idx}>{p}</li>)}
                        </ul>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs border-t border-sky-100/60 pt-2.5">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Icon name="users" className="w-3.5 h-3.5 text-sky-600" /> Peer Study Buddy: <span className="text-violet-700 font-bold">{rec.buddy}</span>
                        </span>
                        <span className="text-[10px] font-bold text-violet-500 bg-sky-100 rounded px-1.5 py-0.5">Scaffolded Mode</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ); })}
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}