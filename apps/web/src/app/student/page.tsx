"use client";
import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useKioskStore } from "@/stores/kiosk-store";
import { useSync } from "@/hooks/use-sync";
import { useConnectivityStore } from "@/stores/connectivity-store";
import { useMockDataStore } from "@/stores/mock-data-store";
import { KNOWLEDGE_COMPONENTS } from "@/data/mockKCs";
import { DemoBadge } from "@/components/ui/demo-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icons";
import { InitialAvatar, ProgressBar } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { OfflineSyncCard } from "@/components/offline/offline-sync-card";

export default function StudentDashboard() {
  const auth = useAuthStore();
  const kiosk = useKioskStore();
  useSync();
  const conn = useConnectivityStore((s) => s.state);
  const queue = useConnectivityStore((s) => s.syncQueueCount);

  const mockStudents = useMockDataStore((s) => s.students);
  const selectedStudentId = useMockDataStore((s) => s.selectedStudentId);
  const selectStudent = useMockDataStore((s) => s.selectStudent);
  const hydrate = useMockDataStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const activeMockStudent =
    mockStudents.find((s) => s.id === selectedStudentId) || mockStudents[0];
  const name = kiosk.currentProfile?.name || auth.name || activeMockStudent.name;

  const [searchQuery, setSearchQuery] = useState("");
  const [showExplainAI, setShowExplainAI] = useState(false);

  // Derive topics from the active selected student's knowledge components
  const topics = useMemo(() => {
    return Object.entries(activeMockStudent.knowledgeComponents).map(([code, mastery]) => {
      const def = KNOWLEDGE_COMPONENTS[code];
      return {
        code,
        t: def?.title || code,
        m: mastery,
        domain: def?.domain || "General",
        description: def?.description || "",
      };
    });
  }, [activeMockStudent]);

  const filteredTopics = topics.filter(
    (t) =>
      t.t.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const masteredCount = topics.filter((t) => t.m >= 0.8).length;
  const practiceCount = topics.filter((t) => t.m >= 0.5 && t.m < 0.8).length;
  const supportCount = topics.filter((t) => t.m < 0.5).length;

  const next =
    topics.length > 0
      ? [...topics].sort((a, b) => a.m - b.m)[0]
      : { t: "Array indexing", m: 0.45, code: "KC-002" };

  const topStrengths = useMemo(() => {
    return [...topics].sort((a, b) => b.m - a.m).slice(0, 2);
  }, [topics]);

  const topWeaknesses = useMemo(() => {
    return [...topics].sort((a, b) => a.m - b.m).slice(0, 2);
  }, [topics]);

  const activeIntervention = activeMockStudent.interventions[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InitialAvatar name={name} className="w-10 h-10" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900">Hi, {name} 👋</h1>
                <Badge
                  variant={
                    activeMockStudent.status === "GREEN"
                      ? "success"
                      : activeMockStudent.status === "YELLOW"
                      ? "warning"
                      : "destructive"
                  }
                  className="text-[10px]"
                >
                  {activeMockStudent.overallMastery}% Mastery
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <label htmlFor="student-picker" className="text-[11px] text-slate-400 font-semibold">
                  Simulated Student:
                </label>
                <select
                  id="student-picker"
                  value={activeMockStudent.id}
                  onChange={(e) => selectStudent(e.target.value)}
                  className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                >
                  {mockStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.overallMastery}% · {st.status})
                    </option>
                  ))}
                </select>
              </div>
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
        {/* Simulation Notice Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <DemoBadge showReset />
          <span className="text-xs text-slate-400 font-medium">
            Student ID: <code className="font-mono font-bold text-slate-600">{activeMockStudent.id}</code> · Seat: <span className="font-semibold text-slate-600">{activeMockStudent.seat}</span> · Group: <span className="font-semibold text-slate-600">{activeMockStudent.status}</span>
          </span>
        </div>

        {/* Top Stat Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-up">
          <StatCard icon="check" label="Topics Mastered" value={masteredCount} accent="emerald" sub="≥ 80% mastery" />
          <StatCard icon="clock" label="Need Practice" value={practiceCount} accent="amber" sub="50–80% mastery" />
          <StatCard icon="alert" label="Need Support" value={supportCount} accent="rose" sub="< 50% mastery" />
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
              <span className="text-sm font-extrabold text-emerald-600">
                {activeMockStudent.learningDNA.confidence}%
              </span>
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
                  {topStrengths.map((str) => (
                    <div key={str.code}>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {str.t}
                        </span>
                        <span className="font-bold text-emerald-600">
                          {Math.round(str.m * 100)}%
                        </span>
                      </div>
                      <ProgressBar value={str.m} barClassName="bg-emerald-500" />
                      <p className="text-[11px] text-slate-400 mt-1">
                        {str.code} · Prerequisite verified · Strong retention
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>
                  Retention Index: <strong className="text-slate-700">{activeMockStudent.learningDNA.retentionRate}%</strong>
                </span>
                <span className="text-emerald-600 font-bold">
                  {activeMockStudent.overallMastery >= 80 ? "● Ready for Peer Tutoring" : "● Progressing Steadily"}
                </span>
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
                  {topWeaknesses.map((w) => {
                    const studentMisc = activeMockStudent.misconceptions.find(
                      (m) => m.title.toLowerCase().includes(w.t.toLowerCase()) || m.code.includes(w.code)
                    );
                    return (
                      <div key={w.code}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                w.m < 0.5 ? "bg-rose-500" : "bg-amber-500"
                              }`}
                            />
                            {w.t}
                          </span>
                          <span
                            className={`font-bold ${
                              w.m < 0.5 ? "text-rose-600" : "text-amber-600"
                            }`}
                          >
                            {Math.round(w.m * 100)}%
                          </span>
                        </div>
                        <ProgressBar
                          value={w.m}
                          barClassName={w.m < 0.5 ? "bg-rose-500" : "bg-amber-500"}
                        />
                        <p
                          className={`text-[11px] font-medium mt-1 ${
                            w.m < 0.5 ? "text-rose-500" : "text-amber-600"
                          }`}
                        >
                          {w.code} · {studentMisc?.title || "Requires targeted conceptual scaffolding"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>
                  Cognitive Stall Risk:{" "}
                  <strong
                    className={
                      activeMockStudent.riskLevel === "HIGH"
                        ? "text-rose-600"
                        : activeMockStudent.riskLevel === "MEDIUM"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }
                  >
                    {activeMockStudent.riskLevel === "HIGH"
                      ? "Critical"
                      : activeMockStudent.riskLevel === "MEDIUM"
                      ? "Moderate"
                      : "Low"}
                  </strong>
                </span>
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
                  <Badge variant="info">Target {activeIntervention?.kcCode || next.code}</Badge>
                </div>

                <div className="bg-white rounded-xl border border-sky-100 p-3.5 shadow-sm space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {activeIntervention?.title || `Mastering ${next.t}: Interactive Concept Scaffolding`}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {activeIntervention?.strategy ||
                      `Targeted reinforcement session for ${next.code} addressing diagnosed misconceptions before evaluating transfer.`}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Icon name="clock" className="w-3 h-3" /> ~4 mins</span>
                    <span>·</span>
                    <span>3 micro-problems</span>
                    {activeIntervention?.peerBuddy && (
                      <>
                        <span>·</span>
                        <span className="text-sky-700 font-semibold">Buddy: {activeIntervention.peerBuddy}</span>
                      </>
                    )}
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
                        <strong className="text-white">Why this lesson: </strong>
                        {activeMockStudent.learningDNA.errorPattern}
                      </p>
                      <p>
                        <strong className="text-white">Cognitive Style: </strong>
                        {activeMockStudent.learningDNA.cognitiveStyle} (Retention Rate: {activeMockStudent.learningDNA.retentionRate}%)
                      </p>
                      <p className="text-emerald-300 font-semibold pt-0.5">
                        ✓ Expected outcome: +30% mastery on {activeIntervention?.kcCode || next.code}, reducing diagnostic risk.
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
                key={k.code}
                className="bg-white rounded-2xl border border-slate-200 p-4 card-hover animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2.5">
                    <span className="font-semibold text-slate-800 text-sm">{k.t}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded px-1.5 py-0.5 font-mono">
                      {k.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {k.domain}
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
                <ProgressBar
                  value={k.m}
                  barClassName={
                    k.m >= 0.8
                      ? "bg-emerald-500"
                      : k.m >= 0.5
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <OfflineSyncCard />
      </main>
    </div>
  );
}
