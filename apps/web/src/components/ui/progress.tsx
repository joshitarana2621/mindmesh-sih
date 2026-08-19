import { cn } from "@/lib/utils";
const PALETTE = [
  "bg-violet-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-indigo-500",
  "bg-teal-500", "bg-fuchsia-500", "bg-lime-600", "bg-orange-500", "bg-cyan-500", "bg-blue-600",
];
export function InitialAvatar({ name, className }: { name: string; className?: string }) {
  const idx = (name.charCodeAt(0) || 0) % PALETTE.length;
  return (
    <div className={cn("rounded-full flex items-center justify-center text-white font-bold shrink-0", PALETTE[idx], className || "w-10 h-10 text-sm")}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}
export function ProgressBar({ value, className, barClassName, showLabel }: { value: number; className?: string; barClassName?: string; showLabel?: boolean }) {
  const band = value < 0.5 ? "bg-rose-500" : value < 0.8 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className={cn("w-full", className)}>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", barClassName || band)} style={{ width: `${Math.min(100, value * 100)}%` }} />
      </div>
      {showLabel && <p className="text-xs text-slate-400 mt-1">{Math.round(value * 100)}% mastery</p>}
    </div>
  );
}