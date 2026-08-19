import * as React from "react";
import { cn } from "@/lib/utils";
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> { variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "brand"; }
export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const v = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-600",
    destructive: "bg-rose-50 text-rose-700 border border-rose-200",
    outline: "border border-slate-300 text-slate-600",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
    brand: "bg-violet-500/10 text-violet-600 border border-violet-200",
  }[variant];
  return <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", v, className)} {...props} />;
}