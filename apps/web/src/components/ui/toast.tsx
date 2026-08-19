"use client";
import { create } from "zustand";
import { Icon } from "./icons";
import { cn } from "@/lib/utils";
export interface Toast { id: string; title: string; body?: string; kind?: "alert" | "success" | "info" | "sync"; }
interface ToastStore { toasts: Toast[]; push: (t: Omit<Toast, "id">) => void; remove: (id: string) => void; }
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (t) => { const id = Math.random().toString(36).slice(2); set(s => ({ toasts: [...s.toasts, { ...t, id }] })); setTimeout(() => useToastStore.getState().remove(id), 6000); },
  remove: (id) => set(s => ({ toasts: s.toasts.filter(x => x.id !== id) })),
}));
export const toast = (t: Omit<Toast, "id">) => useToastStore.getState().push(t);
const STYLE: Record<NonNullable<Toast["kind"]>, string> = {
  alert: "border-rose-200 bg-rose-50 text-rose-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  sync: "border-violet-200 bg-violet-50 text-violet-800",
};
const ICONS: Record<NonNullable<Toast["kind"]>, string> = { alert: "bell", success: "check", info: "wifi", sync: "refresh" };
export function Toaster({ className }: { className?: string }) {
  const toasts = useToastStore(s => s.toasts);
  if (toasts.length === 0) return null;
  return (
    <div className={cn("fixed top-4 right-4 z-50 space-y-2.5 w-80 max-w-[calc(100vw-2rem)]", className)}>
      {toasts.map(t => {
        const k = t.kind || "info";
        return (
          <div key={t.id} className={cn("rounded-2xl border shadow-lg px-4 py-3 animate-fade-up flex items-start gap-3", STYLE[k])}>
            <span className="w-8 h-8 rounded-xl bg-white/80 border border-current/20 flex items-center justify-center shrink-0"><Icon name={ICONS[k]} className="w-4 h-4" /></span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight">{t.title}</p>
              {t.body && <p className="text-xs mt-0.5 opacity-80 leading-snug">{t.body}</p>}
            </div>
            <button onClick={() => useToastStore.getState().remove(t.id)} className="opacity-50 hover:opacity-100 text-xs font-bold shrink-0">✕</button>
          </div>
        );
      })}
    </div>
  );
}