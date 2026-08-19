import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
export function StatCard({ icon, label, value, accent, sub }: { icon: string; label: string; value: React.ReactNode; accent?: "violet" | "sky" | "emerald" | "amber" | "rose" | "slate"; sub?: string }) {
  const ac = {
    violet: "bg-violet-500/10 text-violet-600",
    sky: "bg-sky-500/10 text-sky-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-500/10 text-amber-600",
    rose: "bg-rose-500/10 text-rose-600",
    slate: "bg-slate-500/10 text-slate-600",
  }[accent || "violet"];
  return (
    <div className="bg-white rounded-2xl border p-4 shadow-sm card-hover">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-2", ac)}><Icon name={icon} className="w-4.5 h-4.5" /></div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}