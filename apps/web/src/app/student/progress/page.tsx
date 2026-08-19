"use client";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useKioskStore } from "@/stores/kiosk-store";
import { Button } from "@/components/ui/button";
import { ProgressBar, InitialAvatar } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icons";
import { getMasteryBand } from "@/lib/utils";
import { cn } from "@/lib/utils";
export default function StudentProgress() {
  const auth = useAuthStore();
  const kiosk = useKioskStore();
  const name = kiosk.currentProfile?.name || auth.name || "Student";
  const kcs = [
    { code: "KC-001", name: "Array declaration", mastery: 0.9, attempts: 4 },
    { code: "KC-002", name: "Array indexing", mastery: 0.45, attempts: 5 },
    { code: "KC-003", name: "Array traversal", mastery: 0.65, attempts: 3 },
    { code: "KC-004", name: "Array insertion", mastery: 0.85, attempts: 3 },
  ];
  const red = kcs.filter(k => k.mastery < 0.5); const yellow = kcs.filter(k => k.mastery >= 0.5 && k.mastery < 0.8); const green = kcs.filter(k => k.mastery >= 0.8);
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><InitialAvatar name={name} className="w-9 h-9" /><h1 className="text-lg font-extrabold text-slate-900">My Learning Progress</h1></div>
          <Link href="/student" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"><Icon name="arrowLeft" className="w-4 h-4" /> Dashboard</Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="grid md:grid-cols-3 gap-4 animate-fade-up">
          <div className={cn("rounded-2xl border p-5 card-hover", red.length ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white")}>
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center"><Icon name="alert" className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-900 mt-3">Need Support</h3>
            {red.length ? red.map(k => <p key={k.code} className="text-sm text-rose-700 mt-1.5 font-medium">• {k.name}</p>) : <p className="text-sm text-slate-500 mt-1.5">None 🎉</p>}
          </div>
          <div className={cn("rounded-2xl border p-5 card-hover", yellow.length ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white")}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center"><Icon name="clock" className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-900 mt-3">Need Practice</h3>
            {yellow.length ? yellow.map(k => <p key={k.code} className="text-sm text-amber-700 mt-1.5 font-medium">• {k.name}</p>) : <p className="text-sm text-slate-500 mt-1.5">None 🎉</p>}
          </div>
          <div className={cn("rounded-2xl border p-5 card-hover", green.length ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white")}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center"><Icon name="check" className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-900 mt-3">On Track</h3>
            {green.length ? green.map(k => <p key={k.code} className="text-sm text-emerald-700 mt-1.5 font-medium">• {k.name}</p>) : <p className="text-sm text-slate-500 mt-1.5">Keep going!</p>}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 card-hover animate-fade-up">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Icon name="sparkles" className="w-5 h-5 text-violet-600" /> Your Recommended Learning Path</h2>
          <div className="space-y-3">
            {red.map(k => <div key={k.code} className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl p-3.5"><span className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0"><Icon name="bell" className="w-4 h-4" /></span><div className="flex-1"><p className="font-semibold text-sm text-slate-800">{k.name}</p><p className="text-xs text-slate-500">Immediate support: 1-on-1 teacher explanation + recheck</p></div></div>)}
            {yellow.map(k => <div key={k.code} className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5"><span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0"><Icon name="users" className="w-4 h-4" /></span><div className="flex-1"><p className="font-semibold text-sm text-slate-800">{k.name}</p><p className="text-xs text-slate-500">Peer practice with a classmate + extra questions</p></div></div>)}
            {green.map(k => <div key={k.code} className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5"><span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0"><Icon name="grad" className="w-4 h-4" /></span><div className="flex-1"><p className="font-semibold text-sm text-slate-800">{k.name}</p><p className="text-xs text-slate-500">On track — try extension challenges or mentor a classmate</p></div></div>)}
          </div>
          <Link href="/quiz" className="inline-flex items-center gap-2 mt-5 bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-violet-500/30 hover:opacity-90 transition-all active:scale-[.98]">Continue Adaptive Practice <Icon name="arrowRight" className="w-4 h-4" /></Link>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-up">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">Topic-Level Mastery Detail</h2>
          <div className="space-y-5">
            {kcs.map(k => { const band = getMasteryBand(k.mastery); return (
              <div key={k.code}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-800">{k.name} <span className="text-slate-400 text-xs font-medium">({k.code})</span></span>
                  <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", band.color)}>{band.label} · {Math.round(k.mastery * 100)}%</span>
                </div>
                <ProgressBar value={k.mastery} />
                <p className="text-xs text-slate-400 mt-1.5">{k.attempts} attempts · Mastery = 0.60×accuracy + 0.15×speed + 0.25×recent</p>
              </div>
            ); })}
          </div>
        </div>
        <div className="flex justify-center pb-8"><Button variant="outline" onClick={() => { window.location.href = "/kiosk"; }} className="gap-1.5"><Icon name="offline" className="w-4 h-4" /> Back to Kiosk</Button></div>
      </main>
    </div>
  );
}