"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useKioskStore } from "@/stores/kiosk-store";
import { useSync } from "@/hooks/use-sync";
import { useConnectivityStore } from "@/stores/connectivity-store";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { InitialAvatar, ProgressBar } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { OfflineSyncCard } from "@/components/offline/offline-sync-card";
const TOPICS = [
  { t: "Array declaration", m: 0.9, code: "KC-001" }, { t: "Array indexing", m: 0.45, code: "KC-002" },
  { t: "Array traversal", m: 0.65, code: "KC-003" }, { t: "Array insertion", m: 0.85, code: "KC-004" },
];
export default function StudentDashboard() {
  const auth = useAuthStore();
  const kiosk = useKioskStore();
  const name = kiosk.currentProfile?.name || auth.name || "Student";
  useSync();
  const conn = useConnectivityStore(s => s.state);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTopics = TOPICS.filter(t => t.t.toLowerCase().includes(searchQuery.toLowerCase()) || t.code.toLowerCase().includes(searchQuery.toLowerCase()));
  const queue = useConnectivityStore(s => s.syncQueueCount);
  const next = TOPICS.reduce((a, b) => (a.m < b.m ? a : b));
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InitialAvatar name={name} className="w-10 h-10" />
            <div><h1 className="text-lg font-extrabold text-slate-900">Hi, {name} 👋</h1><p className="text-xs text-slate-400 font-medium">Learn · Assess · Improve</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${conn === "ONLINE" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : conn === "OFFLINE" ? "bg-amber-50 text-amber-700 border border-amber-200" : conn === "SYNCING" ? "bg-sky-50 text-sky-700 border border-sky-200 animate-pulse" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
              <Icon name={conn === "ONLINE" ? "wifi" : conn === "OFFLINE" ? "offline" : "refresh"} className="w-3.5 h-3.5" />
              {conn === "ONLINE" ? "Online" : conn === "OFFLINE" ? "Offline" : conn === "SYNCING" ? "Syncing…" : `${queue} to sync`}
            </span>
            <Button size="sm" variant="ghost" onClick={() => { auth.logout(); window.location.href = "/login"; }} className="gap-1.5"><Icon name="logout" className="w-3.5 h-3.5" /> Sign out</Button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-3 gap-4 animate-fade-up">
          <StatCard icon="check" label="Topics Mastered" value={3} accent="emerald" sub="≥ 80% mastery" />
          <StatCard icon="clock" label="Need Practice" value={2} accent="amber" sub="50–80% mastery" />
          <StatCard icon="alert" label="Need Support" value={1} accent="rose" sub="< 50% mastery" />
        </div>
        <div className="bg-brand rounded-2xl p-6 sm:p-7 text-white shadow-lg shadow-violet-500/25 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="flex flex-wrap items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center"><Icon name="target" className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-extrabold">Your Adaptive Learning Path</h2>
                <p className="text-white/80 text-sm mt-0.5">Next: Revise <span className="font-bold text-white">{next.t}</span> — 3 practice questions</p>
              </div>
            </div>
            <Link href="/quiz" className="inline-flex items-center gap-2 bg-white text-violet-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-50 shadow-md transition-all active:scale-[.98]">Continue Learning <Icon name="arrowRight" className="w-4 h-4" /></Link>
          </div>
        </div>
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
              <div key={k.t} className="bg-white rounded-2xl border border-slate-200 p-4 card-hover animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2.5"><span className="font-semibold text-slate-800 text-sm">{k.t}</span><span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">{k.code}</span></span>
                  <span className={`text-xs font-bold ${k.m >= 0.8 ? "text-emerald-600" : k.m >= 0.5 ? "text-amber-600" : "text-rose-600"}`}>{Math.round(k.m * 100)}%</span>
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