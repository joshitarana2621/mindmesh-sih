"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { InitialAvatar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useKioskStore } from "@/stores/kiosk-store";
import { cn } from "@/lib/utils";

const PROFILES = [
  { id: "s1", name: "Aarav Patel", color: "#7c3aed", left: true },
  { id: "s4", name: "Ananya Rao", color: "#0ea5e9", left: false },
];
interface TouchPoint { id: number; x: number; y: number; owner: string | null; }
interface OwnerState { name: string; taps: number; lastAction: string; }

export default function MultiUserPage() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [touches, setTouches] = useState<Record<number, TouchPoint>>({});
  const [owners, setOwners] = useState<Record<string, OwnerState>>({
    "s1": { name: "Aarav Patel", taps: 0, lastAction: "Waiting for touch…" },
    "s4": { name: "Ananya Rao", taps: 0, lastAction: "Waiting for touch…" },
  });
  const [mode, setMode] = useState<"MULTI" | "TURN">("MULTI");
  const [activeTurn, setActiveTurn] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const assignOwner = (x: number) => { const left = x < (typeof window !== "undefined" ? window.innerWidth : 800) / 2; return left ? "s1" : "s4"; };
  const addLog = (msg: string) => setLog(l => [msg, ...l].slice(0, 12));

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const ownerId = assignOwner(e.clientX);
    const owner = PROFILES.find(p => p.id === ownerId)!;
    setTouches(t => ({ ...t, [e.pointerId]: { id: e.pointerId, x: e.clientX, y: e.clientY, owner: ownerId } }));
    setOwners(o => ({ ...o, [ownerId]: { ...o[ownerId], taps: o[ownerId].taps + 1, lastAction: `Tap at (${e.clientX - 40}, ${e.clientY - 20})` } }));
    addLog(`${owner.name} tapped (touch #${e.pointerId})`);
    if (mode === "TURN") setActiveTurn(ownerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!touches[e.pointerId]) return;
    setTouches(t => ({ ...t, [e.pointerId]: { ...t[e.pointerId], x: e.clientX, y: e.clientY } }));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setTouches(t => { const n = { ...t }; delete n[e.pointerId]; return n; });
    const ownerId = assignOwner(e.clientX);
    setOwners(o => ({ ...o, [ownerId]: { ...o[ownerId], lastAction: `Released at (${e.clientX - 40}, ${e.clientY - 20})` } }));
  };
  const startSession = (ownerId: string) => {
    const owner = PROFILES.find(p => p.id === ownerId)!;
    useKioskStore.getState().startSession({ userId: ownerId, name: owner.name, profileNamespace: `${ownerId}-${crypto.randomUUID().slice(0, 8)}` });
    window.location.href = "/quiz";
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-md shadow-violet-500/30"><Icon name="users" className="w-5 h-5" /></div>
            <div><h1 className="text-lg font-extrabold text-slate-900">Multi-User Kiosk</h1><p className="text-xs text-slate-400 font-medium">Multi-touch tracking · no mixed data, no overlapping UI</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode("MULTI")} className={cn("px-3 py-2 rounded-xl text-xs font-bold transition-all", mode === "MULTI" ? "bg-brand text-white shadow-md shadow-violet-500/30" : "bg-white border border-slate-200 text-slate-500 hover:border-violet-300")}>Simultaneous</button>
            <button onClick={() => setMode("TURN")} className={cn("px-3 py-2 rounded-xl text-xs font-bold transition-all", mode === "TURN" ? "bg-brand text-white shadow-md shadow-violet-500/30" : "bg-white border border-slate-200 text-slate-500 hover:border-violet-300")}>Turn-based</button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 space-y-4">
        <div className="grid lg:grid-cols-3 gap-4 flex-1">
          <div className="lg:col-span-2">
            <div
              ref={surfaceRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative h-[380px] sm:h-[440px] rounded-2xl border border-slate-200 bg-white overflow-hidden select-none touch-none"
              style={{ touchAction: "none", cursor: "crosshair" }}
            >
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-violet-500/8 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-sky-500/8 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-slate-200 pointer-events-none" />
              <div className="absolute top-0 left-0 pointer-events-none w-full flex justify-center">
                <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-b-xl px-4 py-2 text-[11px] font-bold text-slate-500">
                  {mode === "MULTI" ? "👆 Touch anywhere — each touch is tracked independently · halves = separate students" : "👆 Students take turns — only one profile is active at a time (1:1 kiosk)"}
                </div>
              </div>
              {Object.values(touches).map(tp => {
                const owner = PROFILES.find(p => p.id === tp.owner)!;
                return (
                  <div key={tp.id} className="absolute pointer-events-none" style={{ left: tp.x - 28, top: tp.y - 28 }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse-ring" style={{ backgroundColor: `${owner.color}22`, border: `2px solid ${owner.color}` }}>
                      <span className="text-lg" style={{ color: owner.color }}>●</span>
                    </div>
                  </div>
                );
              })}
              {Object.keys(touches).length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2 pointer-events-none">
                  <Icon name="zap" className="w-10 h-10" />
                  <p className="text-sm font-semibold">Waiting for touches…</p>
                  <p className="text-xs">{mode === "MULTI" ? "Try on a touchscreen — two students, two touches" : "Tap to claim your turn"}</p>
                </div>
              )}
            </div>
            <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><Icon name="chart" className="w-4 h-4" /> Live interaction log</p>
              <div className="space-y-1.5 max-h-36 overflow-auto">
                {log.length === 0 && <p className="text-xs text-slate-400">Interactions will appear here — each tagged with its own student profile.</p>}
                {log.map((l, i) => <p key={i} className={cn("text-xs px-2.5 py-1.5 rounded-lg font-medium", i === 0 ? "bg-violet-50 text-violet-700" : "bg-slate-50 text-slate-500")}>{l}</p>)}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {PROFILES.map(p => {
              const st = owners[p.id];
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-hover" style={{ borderColor: `${p.color}33` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <InitialAvatar name={st.name} className="w-10 h-10 text-sm" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm">{st.name}</p>
                      {mode === "TURN" && activeTurn === p.id && <Badge className="bg-violet-500 text-white border-0">Active turn</Badge>}
                    </div>
                    <span className={cn("w-11 h-6 rounded-full relative", st.taps > 0 ? "bg-emerald-500" : "bg-slate-200")}><span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all left-[22px]" /></span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center mb-4">
                    <div className="bg-slate-50 rounded-xl py-2.5"><p className="text-xl font-extrabold" style={{ color: p.color }}>{st.taps}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Touches</p></div>
                    <div className="bg-slate-50 rounded-xl py-2.5"><p className="text-xl font-extrabold text-slate-700">{mode === "MULTI" ? "✓" : activeTurn === p.id ? "●" : "—"}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{mode === "MULTI" ? "Active" : "Turn"}</p></div>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">➜ {st.lastAction}</p>
                  <button onClick={() => startSession(p.id)} className="w-full rounded-xl py-2.5 text-xs font-bold text-white hover:opacity-90 transition-all active:scale-[.98] shadow-md" style={{ backgroundColor: p.color, boxShadow: `0 8px 16px -6px ${p.color}66` }}>
                    Start session as {st.name.split(" ")[0]} →
                  </button>
                </div>
              );
            })}
            <div className="bg-brand-soft border border-violet-200/60 rounded-2xl p-4 flex items-start gap-2.5">
              <Icon name="offline" className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed"><span className="font-bold text-slate-800">Why this matters:</span> shared touchscreens mix students' data and collide on one UI. EduAdapt tracks each touch by profile — separate answers, separate mastery, zero overlap.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center pb-6"><Link href="/kiosk" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-violet-600 transition-colors"><Icon name="arrowLeft" className="w-4 h-4" /> Back to kiosk</Link></div>
      </main>
    </div>
  );
}