"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InitialAvatar, ProgressBar } from "@/components/ui/progress";
import { Toaster, toast } from "@/components/ui/toast";
import { DemoBadge } from "@/components/ui/demo-badge";
import { useMockDataStore } from "@/stores/mock-data-store";
import { KNOWLEDGE_COMPONENTS } from "@/data/mockKCs";
import type { MockStudent } from "@/data/mockStudents";

interface StudentData {
  id: string;
  name: string;
  seat: string;
  score: number; // 0 to 100
  status: "GREEN" | "YELLOW" | "RED";
  learningDNA: {
    confidence: number;
    cognitiveStyle: string;
    errorPattern: string;
    retentionRate: number;
  };
  weakTopics: Array<{
    code: string;
    name: string;
    mastery: number;
    severity: "CRITICAL" | "HIGH" | "MODERATE";
  }>;
  intervention: {
    strategy: string;
    action: string;
    peerBuddy: string;
    drill: string;
  };
}

function toStudentData(st: MockStudent): StudentData {
  const weakTopics = Object.entries(st.knowledgeComponents)
    .filter(([_, mastery]) => mastery < 0.72)
    .sort((a, b) => a[1] - b[1])
    .map(([kcId, mastery]) => {
      const kc = KNOWLEDGE_COMPONENTS[kcId];
      const severity: "CRITICAL" | "HIGH" | "MODERATE" =
        mastery < 0.45 ? "CRITICAL" : mastery < 0.6 ? "HIGH" : "MODERATE";
      return {
        code: kcId,
        name: kc?.title || kcId,
        mastery,
        severity,
      };
    });

  const activeIntervention = st.interventions?.[0];
  const peerBuddy =
    activeIntervention?.peerBuddy ||
    (st.overallMastery >= 80 ? "Rohan Gupta (Mentee)" : "Aarav Patel (Peer Lead)");

  return {
    id: st.id,
    name: st.name,
    seat: st.seat,
    score: st.overallMastery,
    status: st.status,
    learningDNA: st.learningDNA,
    weakTopics,
    intervention: {
      strategy: activeIntervention?.strategy || (st.status === "GREEN" ? "Peer Mentorship Leadership" : "Targeted Adaptive Drill"),
      action: activeIntervention?.title || (st.status === "GREEN" ? "Co-lead peer practice session on foundational topics." : "Complete targeted practice questions in Student Portal."),
      peerBuddy,
      drill: activeIntervention?.kcCode ? activeIntervention.kcCode + " Synthesis Drill" : "Core Concept Synthesis Drill",
    },
  };
}

export default function TeacherHeatmapPage() {
  const rawStudents = useMockDataStore((s) => s.students);
  const hydrate = useMockDataStore((s) => s.hydrate);
  const completeIntervention = useMockDataStore((s) => s.completeIntervention);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const students: StudentData[] = useMemo(() => rawStudents.map(toStudentData), [rawStudents]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [filter, setFilter] = useState<"ALL" | "GREEN" | "YELLOW" | "RED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const greenCount = students.filter((s) => s.status === "GREEN").length;
  const yellowCount = students.filter((s) => s.status === "YELLOW").length;
  const redCount = students.filter((s) => s.status === "RED").length;

  const filteredStudents = students.filter((s) => {
    const matchesFilter = filter === "ALL" ? true : s.status === filter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.seat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAssignIntervention = (student: StudentData) => {
    const rawStudent = rawStudents.find((s) => s.id === student.id);
    const activeIntv = rawStudent?.interventions?.[0];
    if (activeIntv) {
      completeIntervention(student.id, activeIntv.id);
    }
    toast({
      kind: "success",
      title: "Intervention Assigned: " + student.name,
      body: "Scheduled: " + student.intervention.action,
    });
  };

  const handleQueuePeerPod = (student: StudentData) => {
    toast({
      kind: "info",
      title: "Queued to Peer Pod",
      body: "Assigned partner: " + student.intervention.peerBuddy,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-md shadow-violet-500/30">
              <Icon name="radar" className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900">Teacher Heatmap</h1>
                <Badge variant="brand">Cohort Live Grid</Badge>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Grade 8 · Section A · {students.length} Students Live Mastery
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/teacher"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
            >
              <Icon name="arrowLeft" className="w-3.5 h-3.5" /> Back to Radar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 flex-1 w-full">
        {/* Top Summary Banner */}
        <div className="bg-brand rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-violet-500/20 animate-fade-up">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="mb-3"><DemoBadge showReset /></div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-sky-200 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Real-Time Telemetry Matrix
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Classroom Heatmap ({students.length} Students)
              </h2>
              <p className="text-white/80 text-sm mt-1 max-w-xl">
                Click any student tile to inspect their AI Learning DNA, pinpoint cognitive gaps, and deploy 1-click interventions before the class ends.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-4 py-2.5 text-center">
                <p className="text-2xl font-extrabold text-emerald-300">{greenCount}</p>
                <p className="text-[11px] font-bold text-white/80 uppercase">Strong (≥80%)</p>
              </div>
              <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl px-4 py-2.5 text-center">
                <p className="text-2xl font-extrabold text-amber-300">{yellowCount}</p>
                <p className="text-[11px] font-bold text-white/80 uppercase">Average (50-79%)</p>
              </div>
              <div className="bg-rose-500/20 border border-rose-400/30 rounded-xl px-4 py-2.5 text-center">
                <p className="text-2xl font-extrabold text-rose-300">{redCount}</p>
                <p className="text-[11px] font-bold text-white/80 uppercase">Needs Help (&lt;50%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "ALL"
                  ? "bg-brand text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setFilter("GREEN")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === "GREEN"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Strong ({greenCount})
            </button>
            <button
              onClick={() => setFilter("YELLOW")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === "YELLOW"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-amber-700 bg-amber-50 hover:bg-amber-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Average ({yellowCount})
            </button>
            <button
              onClick={() => setFilter("RED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === "RED"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-rose-700 bg-rose-50 hover:bg-rose-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Needs Help ({redCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon name="search" className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search student or seat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* 45-Student Heatmap Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
          {filteredStudents.map((st) => {
            const isSelected = selectedStudent?.id === st.id;
            const cardColor =
              st.status === "GREEN"
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:border-emerald-400 hover:shadow-emerald-500/10"
                : st.status === "YELLOW"
                ? "bg-amber-50/70 border-amber-200 text-amber-950 hover:border-amber-400 hover:shadow-amber-500/10"
                : "bg-rose-50/90 border-rose-300 text-rose-950 hover:border-rose-400 hover:shadow-rose-500/20 ring-1 ring-rose-200";

            const badgeVariant =
              st.status === "GREEN" ? "success" : st.status === "YELLOW" ? "warning" : "destructive";

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStudent(st)}
                className={`text-left rounded-2xl border p-3.5 transition-all duration-200 flex flex-col justify-between relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 ${cardColor} ${
                  isSelected ? "ring-2 ring-violet-600 scale-[1.02] shadow-md" : "hover:scale-[1.02] shadow-sm"
                }`}
                aria-pressed={isSelected}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {st.seat}
                    </span>
                    <span
                      className={`text-xs font-extrabold ${
                        st.status === "GREEN"
                          ? "text-emerald-700"
                          : st.status === "YELLOW"
                          ? "text-amber-700"
                          : "text-rose-700"
                      }`}
                    >
                      {st.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <InitialAvatar name={st.name} className="w-7 h-7 text-xs shrink-0" />
                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                      {st.name}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
                  <Badge variant={badgeVariant} className="text-[9px] px-1.5 py-0">
                    {st.status === "GREEN"
                      ? "Strong"
                      : st.status === "YELLOW"
                      ? "Average"
                      : "Intervene"}
                  </Badge>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-700 font-semibold transition-colors">
                    Details →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Slide-out Side Panel for Selected Student */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedStudent(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="side-panel-name"
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 overflow-y-auto p-6 flex flex-col justify-between animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Panel Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <InitialAvatar name={selectedStudent.name} className="w-12 h-12 text-base" />
                  <div>
                    <h2 id="side-panel-name" className="text-lg font-extrabold text-slate-900 leading-snug">
                      {selectedStudent.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 font-medium">
                        {selectedStudent.seat}
                      </span>
                      <span className="text-xs text-slate-300">·</span>
                      <Badge
                        variant={
                          selectedStudent.status === "GREEN"
                            ? "success"
                            : selectedStudent.status === "YELLOW"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {selectedStudent.score}% Mastery
                      </Badge>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                  aria-label="Close side panel"
                >
                  <Icon name="close" className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Learning DNA Profile Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="brain" className="w-4 h-4 text-violet-600" />
                    Learning DNA
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {selectedStudent.learningDNA.confidence}% Confidence
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-slate-400 font-semibold">Cognitive Learning Style</p>
                    <p className="text-slate-800 font-medium mt-0.5">
                      {selectedStudent.learningDNA.cognitiveStyle}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Misconception & Error Pattern</p>
                    <p className="text-slate-800 font-medium mt-0.5 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                      {selectedStudent.learningDNA.errorPattern}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 font-semibold">Concept Retention Rate</span>
                    <span className="font-bold text-slate-800">
                      {selectedStudent.learningDNA.retentionRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Weak Topics (Knowledge Components) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="target" className="w-4 h-4 text-rose-500" />
                    Weak Topics & Gaps
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {selectedStudent.weakTopics.length} detected
                  </span>
                </div>

                {selectedStudent.weakTopics.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                    ✓ No critical gaps detected. Student is performing at or above benchmark!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedStudent.weakTopics.map((wt) => (
                      <div
                        key={wt.code}
                        className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                              {wt.code}
                            </span>
                            {wt.name}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              wt.severity === "CRITICAL"
                                ? "text-rose-600"
                                : wt.severity === "HIGH"
                                ? "text-amber-600"
                                : "text-sky-600"
                            }`}
                          >
                            {Math.round(wt.mastery * 100)}%
                          </span>
                        </div>
                        <ProgressBar
                          value={wt.mastery}
                          barClassName={
                            wt.severity === "CRITICAL"
                              ? "bg-rose-500"
                              : wt.severity === "HIGH"
                              ? "bg-amber-500"
                              : "bg-sky-500"
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Recommended Intervention */}
              <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="sparkles" className="w-4 h-4 text-sky-600" />
                    Recommended Intervention
                  </h3>
                  <Badge variant="info">AI Prescribed</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-sky-800/80 font-bold">{selectedStudent.intervention.strategy}</p>
                    <p className="text-slate-700 leading-relaxed mt-1">
                      {selectedStudent.intervention.action}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-sky-200/60 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded-lg border border-sky-100">
                      <p className="text-slate-400 font-semibold">Suggested Peer</p>
                      <p className="text-slate-800 font-bold truncate mt-0.5">
                        {selectedStudent.intervention.peerBuddy}
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-sky-100">
                      <p className="text-slate-400 font-semibold">Target Drill</p>
                      <p className="text-slate-800 font-bold truncate mt-0.5">
                        {selectedStudent.intervention.drill}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons in Drawer */}
            <div className="pt-6 border-t border-slate-100 space-y-2 mt-6">
              <Button
                variant="brand"
                className="w-full gap-2 text-xs py-2.5"
                onClick={() => handleAssignIntervention(selectedStudent)}
              >
                <Icon name="check" className="w-4 h-4" /> Assign 1-on-1 Practice
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full text-xs gap-1.5"
                  onClick={() => handleQueuePeerPod(selectedStudent)}
                >
                  <Icon name="users" className="w-3.5 h-3.5" /> Queue to Peer Pod
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-xs text-slate-500 hover:text-slate-800"
                  onClick={() => setSelectedStudent(null)}
                >
                  Dismiss Panel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Toaster */}
      <Toaster />
    </div>
  );
}
