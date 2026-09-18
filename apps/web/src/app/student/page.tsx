"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useKioskStore } from "@/stores/kiosk-store";
import { useSync } from "@/hooks/use-sync";
import { useConnectivityStore } from "@/stores/connectivity-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icons";
import { InitialAvatar, ProgressBar } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { OfflineSyncCard } from "@/components/offline/offline-sync-card";

const TOPICS = [
  { t: "Array declaration", m: 0.9, code: "KC-001" },
  { t: "Array indexing", m: 0.45, code: "KC-002" },
  { t: "Array traversal", m: 0.65, code: "KC-003" },
  { t: "Array insertion", m: 0.85, code: "KC-004" },
];

export default function StudentDashboard() {
  const auth = useAuthStore();
  const kiosk = useKioskStore();
  const name = kiosk.currentProfile?.name || auth.name || "Aarav Patel";
  useSync();
  const conn = useConnectivityStore((s) => s.state);
  const [topics, setTopics] = useState(TOPICS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showExplainAI, setShowExplainAI] = useState(false);

  useEffect(() => {
    const fetchMastery = async () => {
      try {
        const res = await api<any[]>("/api/v1/students/me/mastery");
        if (res && res.length > 0) {
          setTopics(res.map((m) => ({ t: m.kcName, m: m.mastery, code: m.kcCode })));
        }
      } catch (err) {
        console.error("Using offline mock topics", err);
      }
    };
    fetchMastery();
  }, []);

  const filteredTopics = topics.filter(
    (t) =>
      t.t.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const queue = useConnectivityStore((s) => s.syncQueueCount);
  const next = topics.reduce((a, b) => (a.m < b.m ? a : b));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InitialAvatar name={name} className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">Hi, {name} 👋</h1>
              <p className="text-xs text-slate-400 font-medium">Learn · Assess · Improve</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                conn === "ONLINE"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : conn === "OFFLINE"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : conn === "SYNCING"
                  ? "bg-sky-50 text-sky-700 border border-sky-200 animate-pulse"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              <Icon
                name={conn === "ONLINE" ? "wifi" : conn === "OFFLINE" ? "offline" : "refresh"}
                className="w-3.5 h-3.5"
              />
              {conn === "ONLINE"
                ? "Online"
                : conn === "OFFLINE"
                ? "Offline"
                : conn === "SYNCING"
                ? "Syncing…"
                : `${queue} to sync`}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                auth.logout();
                window.location.href = "/login";
              }}
              className="gap-1.5"
            >
              <Icon name="logout" className="w-3.5 h-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Top Stat Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-up">
          <StatCard icon="check" label="Topics Mastered" value={3} accent="emerald" sub="≥ 80% mastery" />
          <StatCard icon="clock" label="Need Practice" value={2} accent="amber" sub="50–80% mastery" />
          <StatCard icon="alert" label="Need Support" value={1} accent="rose" sub="< 50% mastery" />
        </div>

        {/* Adaptive Learning Path Banner */}
        <div className="bg-brand rounded-2xl p-6 sm:p-7 text-white shadow-lg shadow-violet-500/25 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
                <Icon name="target" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Your Adaptive Learning Path</h2>
                <p className="text-white/80 text-sm mt-0.5">
                  Next: Revise <span className="font-bold text-white">{next.t}</span> — 3 practice questions
                </p>
              </div>
            </div>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-white text-violet-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-50 shadow-md transition-all active:scale-[.98] shrink-0"
            >
              Continue Learning <Icon name="arrowRight" className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* NEW SECTION: Learning DNA */}
        <section aria-labelledby="learning-dna-title" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center font-bold shadow-md shadow-violet-500/20">
                <Icon name="brain" className="w-5 h-5 text-sky-200" />
              </div>
              <div>
                <h2 id="learning-dna-title" className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Learning DNA
                  <span className="text-[10px] font-bold text-violet-700 bg-violet-100 border border-violet-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    AI Profile
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">Cognitive mastery profile & real-time pedagogical gap analysis</p>
              </div>
            </div>

            {/* Overall Confidence Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 shadow-sm self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-500">Confidence Level:</span>
              <span className="text-sm font-extrabold text-emerald-600">84%</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Column 1: Strengths Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-hover flex flex-col justify-between space-y-4 animate-fade-up">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Icon name="check" className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Validated Strengths</h3>
                  </div>
                  <Badge variant="success">High Mastery</Badge>
                </div>

                <div className="space-y-3.5">
                  {/* Skill 1 */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Array Declaration & Memory Layout
                      </span>
                      <span className="font-bold text-emerald-600">92%</span>
                    </div>
                    <ProgressBar value={0.92} barClassName="bg-emerald-500" />
                    <p className="text-[11px] text-slate-400 mt-1">KC-001 · 4/4 clean attempts · 0.8s avg latency</p>
                  </div>

                  {/* Skill 2 */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Rightward Element Shifting
                      </span>
                      <span className="font-bold text-emerald-600">85%</span>
                    </div>
                    <ProgressBar value={0.85} barClassName="bg-emerald-500" />
                    <p className="text-[11px] text-slate-400 mt-1">KC-004 · Strong prerequisite logic retention</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Retention Index: <strong className="text-slate-700">94%</strong></span>
                <span className="text-emerald-600 font-bold">● Ready for Peer Tutoring</span>
              </div>
            </div>

            {/* Column 2: Weak Skills / Growth Areas Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-hover flex flex-col justify-between space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Icon name="alert" className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Growth Areas (Weak Skills)</h3>
                  </div>
                  <Badge variant="destructive">Needs Focus</Badge>
                </div>

                <div className="space-y-3.5">
                  {/* Weak Skill 1 */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Zero-Indexed Offsets & Bounds
                      </span>
                      <span className="font-bold text-rose-600">45%</span>
                    </div>
                    <ProgressBar value={0.45} barClassName="bg-rose-500" />
                    <p className="text-[11px] text-rose-500 font-medium mt-1">KC-002 · 3 consecutive off-by-one errors</p>
                  </div>

                  {/* Weak Skill 2 */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Loop Termination Conditions
                      </span>
                      <span className="font-bold text-amber-600">62%</span>
                    </div>
                    <ProgressBar value={0.62} barClassName="bg-amber-500" />
                    <p className="text-[11px] text-amber-600 font-medium mt-1">KC-003 · Confusing `&lt;` with `&lt;=` in traversal</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Cognitive Stall Risk: <strong className="text-amber-600">Moderate</strong></span>
                <span className="text-violet-700 font-bold">● Micro-drills recommended</span>
              </div>
            </div>

            {/* Column 3: Next Recommended Lesson & Explain AI Card */}
            <div className="bg-gradient-to-br from-white to-sky-50/50 rounded-2xl border border-sky-200/80 p-5 shadow-sm card-hover flex flex-col justify-between space-y-4 animate-fade-up relative overflow-hidden" style={{ animationDelay: "160ms" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/20 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-700 flex items-center justify-center font-bold">
                      <Icon name="sparkles" className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Next Recommended Lesson</h3>
                  </div>
                  <Badge variant="info">Target KC-002</Badge>
                </div>

                <div className="bg-white rounded-xl border border-sky-100 p-3.5 shadow-sm space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    Mastering Zero-Index Offsets: Visual Pointer Tracing
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Interactive physical grid simulation mapping array slots 0 to N-1 before testing boundary calculations.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Icon name="clock" className="w-3 h-3" /> ~4 mins</span>
                    <span>·</span>
                    <span>3 micro-problems</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-sky-100">
                <div className="flex items-center gap-2">
                  <Link
                    href="/quiz"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 hover:opacity-95 transition-all active:scale-[0.98]"
                  >
                    <span>Start Lesson</span>
                    <Icon name="arrowRight" className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowExplainAI(!showExplainAI)}
                    className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl border border-sky-300/80 bg-white text-sky-800 text-xs font-bold hover:bg-sky-50 transition-colors shadow-sm"
                    aria-expanded={showExplainAI}
                    aria-controls="explain-ai-drawer"
                  >
                    <Icon name="brain" className="w-3.5 h-3.5 text-sky-600" />
                    <span>Explain AI</span>
                  </button>
                </div>

                {/* Explain AI Drawer */}
                {showExplainAI && (
                  <div
                    id="explain-ai-drawer"
                    className="rounded-xl bg-sky-900 text-white p-3.5 text-xs space-y-2 animate-scale-in border border-sky-700 shadow-md"
                  >
                    <div className="flex items-center justify-between text-sky-300 font-bold text-[11px] uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Icon name="sparkles" className="w-3 h-3" /> AI Recommendation Rationale</span>
                      <button
                        onClick={() => setShowExplainAI(false)}
                        className="text-white/60 hover:text-white"
                        aria-label="Close rationale"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-1.5 text-white/90 leading-relaxed text-[11px]">
                      <p>
                        <strong className="text-white">Why this lesson:</strong> Telemetry detected 3 consecutive boundary miscalculations on question pattern <code className="bg-sky-950 px-1 py-0.5 rounded text-amber-300">arr[size]</code>.
                      </p>
                      <p>
                        <strong className="text-white">Scaffolding:</strong> Replaces abstract syntax with a visual pointer trace before testing again to break the misconception loop.
                      </p>
                      <p className="text-emerald-300 font-semibold pt-0.5">
                        ✓ Expected outcome: +35% mastery on KC-002, unlocking sequential traversal.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Existing Topic Mastery Section with Search */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Topic Mastery</h2>
              <p className="text-xs text-slate-400 font-medium">KC · knowledge component</p>
            </div>
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Icon name="search" className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search topics or KCs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="space-y-3">
            {filteredTopics.map((k, i) => (
              <div
                key={k.t}
                className="bg-white rounded-2xl border border-slate-200 p-4 card-hover animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2.5">
                    <span className="font-semibold text-slate-800 text-sm">{k.t}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">
                      {k.code}
                    </span>
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      k.m >= 0.8 ? "text-emerald-600" : k.m >= 0.5 ? "text-amber-600" : "text-rose-600"
                    }`}
                  >
                    {Math.round(k.m * 100)}%
                  </span>
                </div>
                <ProgressBar value={k.m} />
              </div>
            ))}
          </div>
        </div>

        <OfflineSyncCard />
      </main>
    </div>
  );
}