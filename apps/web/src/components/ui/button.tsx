import * as React from "react";
import { cn } from "@/lib/utils";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "brand"; size?: "default" | "sm" | "lg" | "icon"; }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const v = {
    default: "bg-slate-900 text-white hover:bg-slate-700 shadow-sm",
    brand: "bg-brand text-white hover:opacity-90 shadow-md shadow-violet-500/30",
    destructive: "bg-rose-600 text-white hover:bg-rose-500 shadow-sm",
    outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm",
    secondary: "bg-violet-50 text-violet-700 hover:bg-violet-100",
    ghost: "hover:bg-slate-100 text-slate-700",
    link: "text-violet-600 underline-offset-4 hover:underline",
  }[variant];
  const s = { default: "h-10 px-4 py-2", sm: "h-8 px-3 text-xs", lg: "h-12 px-8 text-base", icon: "h-10 w-10" }[size];
  return <button ref={ref} className={cn("inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[.98]", v, s, className)} {...props} />;
});
Button.displayName = "Button";
export { Button };