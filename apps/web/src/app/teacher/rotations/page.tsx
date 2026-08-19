"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
const STATIONS = ["DIGITAL", "TEACHER", "PEER"];
const STATION_META = [
  { icon: "offline", name: "Digital Station", desc: "Quiz, practice, digital content", color: "text-sky-600 bg-sky-500/10 border-sky-200" },
  { icon: "grad", name: "Teacher Station", desc: "Small-group explanation, recheck", color: "text-violet-600 bg-violet-500/10 border-violet-200" },
  { icon: "users", name: "Peer Station", desc: "Teach-back, collaborative practice", color: "text-emerald-600 bg-emerald-500/10 border-emerald-200" },
];
interface Assignment { groupNumber: number; slotIndex: number; station: string; studentIds: string[]; }
interface Plan { id: string; name: string; stationCount: number; slotDurationMinutes: number; totalSlots: number; status: string; assignments: Assignment[]; startedAt: string | null; }
const GROUP_NAMES = ["Group 1", "Group 2", "Group 3"];
export default function RotationsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [active, setActive] = useState<{ station: string; group: number; timeLeft: number }>({ station: "DIGITAL", group: 1, timeLeft: 15 * 60 });
  const [running, setRunning] = useState(false);
  const [slot, setSlot] = useState(0);
  useEffect(() => { const load = async () => { try { const c = await api<any[]>("/api/v1/classrooms"); const p = c[0] ? await api<any[]>("/api/v1/classrooms/" + c[0].id + "/rotation-plans").catch(() => []) : []; setPlans(p); } catch { } }; load(); }, []);
  useEffect(() => { if (!running) return; const t = setInterval(() => { setActive(a => { const nl = a.timeLeft - 1; if (nl <= 0) { setSlot(s => { const ns = s + 1; return ns >= 3 ? 0 : ns; }); return { ...a, station: STATIONS[(slot + 1) % 3], timeLeft: 15 * 60 }; } return { ...a, timeLeft: nl }; }); }, 1000); return () => clearInterval(t); }, [running, slot]);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const studentsByGroup: Record<number, string[]> = { 1: ["Aarav", "Diya"], 2: ["Rohan", "Ananya"], 3: ["Kabir", "Meera"] };
  const activeIdx = STATIONS.indexOf(active.station);
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-md shadow-violet-500/30"><Icon name="refresh" className="w-5 h-5" /></div>
            <h1 className="text-lg font-extrabold text-slate-900">Classroom Rotations</h1>
          </div>
          <Link href="/teacher" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"><Icon name="arrowLeft" className="w-4 h-4" /> Radar</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="bg-brand rounded-2xl p-6 sm:p-7 text-white relative overflow-hidden animate-fade-up">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="flex flex-wrap items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center"><Icon name="refresh" className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-extrabold">Three-Station Classroom Mode</h2>
                <p className="text-white/80 text-sm mt-0.5">Every group rotates through Digital · Teacher · Peer stations</p>
              </div>
            </div>
            <Button className={cn("bg-white shadow-lg gap-1.5", running ? "text-amber-700 hover:bg-amber-50" : "text-violet-700 hover:bg-violet-50")} onClick={() => { setRunning(!running); if (!running) { setActive({ station: "DIGITAL", group: 1, timeLeft: 15 * 60 }); setSlot(0); } }}>{running ? <> <Icon name="clock" className="w-4 h-4" /> Pause Session</> : <> <Icon name="zap" className="w-4 h-4" /> Start Classroom Session</>}</Button>
          </div>
          {running && (
            <div className="mt-5 bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 relative">
              <div>
                <p className="text-sm text-white/80 font-semibold flex items-center gap-1.5"><Icon name="radar" className="w-4 h-4" /> Now at <span className="text-white font-bold">{STATION_META[activeIdx].name}</span> · Slot {slot + 1}/3</p>
                <p className="text-4xl font-extrabold mt-1.5 tabular-nums">{fmt(active.timeLeft)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 font-semibold">Next: {STATION_META[(slot + 1) % 3].name}</p>
                <p className="text-xs text-white/60 mt-1 flex items-center justify-end gap-1"><Icon name="wifi" className="w-3.5 h-3.5" /> Server is source of truth when connected</p>
              </div>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {STATIONS.map((s, i) => {
            const isActive = running && active.station === s;
            return (
              <div key={s} className={cn("rounded-2xl border p-5 card-hover animate-fade-up", isActive ? "border-violet-300 bg-violet-50 ring-2 ring-violet-200 shadow-lg" : "bg-white border-slate-200")} style={{ animationDelay: `${i * 60}ms` }}>
                <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center mb-3", isActive ? "bg-violet-600 text-white border-violet-600" : STATION_META[i].color)}><Icon name={STATION_META[i].icon} className="w-5.5 h-5.5" /></div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{STATION_META[i].name}</h3>
                  {isActive && <Badge className="bg-violet-600 border-violet-600 text-white">Live</Badge>}
                </div>
                <p className="text-xs text-slate-500 mt-1">{STATION_META[i].desc}</p>
                <div className="mt-3.5 space-y-1.5">
                  {studentsByGroup[(i % 3) + 1].map(st => <div key={st} className={cn("text-sm rounded-lg px-2.5 py-1.5 font-medium", isActive ? "bg-white text-slate-700 border border-violet-200" : "bg-slate-50 text-slate-600")}>● {st}</div>)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-up">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Icon name="book" className="w-5 h-5 text-violet-600" /> Rotation Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-slate-400 border-b border-slate-200 text-xs uppercase tracking-wide"><th className="py-2.5 font-bold">Group</th><th className="font-bold">Slot 1</th><th className="font-bold">Slot 2</th><th className="font-bold">Slot 3</th></tr></thead>
              <tbody>
                {GROUP_NAMES.map((g, gi) => (
                  <tr key={g} className="border-b border-slate-50">
                    <td className="py-3.5 font-bold text-slate-800">{g}</td>
                    {[0, 1, 2].map(sl => {
                      const current = running && sl === slot && gi === active.group - 1;
                      return <td key={sl} className="py-3.5"><span className={cn("px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5", current ? "bg-brand text-white shadow-md shadow-violet-500/30" : "bg-slate-100 text-slate-600")}>{current && <Icon name="zap" className="w-3 h-3" />}{STATIONS[(gi + sl) % 3]}</span></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-up">
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">Create Rotation Plan</h2>
          <p className="text-sm text-slate-400 mb-4">3 stations · 15-minute slots · groups rotate automatically</p>
          <div className="flex items-center gap-3">
            <Button variant="brand" className="gap-1.5" onClick={async () => { try { const c = await api<any[]>("/api/v1/classrooms"); const plan = await api<any>("/api/v1/classrooms/" + c[0].id + "/rotation-plans", { method: "POST", body: { name: "Arrays Lesson Rotation", stationCount: 3, slotDurationMinutes: 15, totalSlots: 3 } }); setPlans(p => [...p, plan]); } catch { } }}><Icon name="plus" className="w-4 h-4" /> Create Plan</Button>
            {plans.length > 0 && <Badge variant="info">{plans.length} plan{plans.length > 1 ? "s" : ""} created</Badge>}
          </div>
        </div>
      </main>
    </div>
  );
}