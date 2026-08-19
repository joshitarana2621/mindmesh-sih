import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function getMasteryBand(m: number) {
  if (m < 0.5) return { label: "Needs Help", color: "bg-red-100 text-red-700", dot: "bg-red-500" };
  if (m < 0.8) return { label: "Developing", color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" };
  return { label: "Strong", color: "bg-green-100 text-green-700", dot: "bg-green-500" };
}
export function getPriorityStyle(p: string) {
  switch (p) {
    case "CRITICAL": return { label: "Critical", color: "bg-red-600 text-white", ring: "ring-red-500" };
    case "HIGH": return { label: "High", color: "bg-orange-500 text-white", ring: "ring-orange-500" };
    case "MEDIUM": return { label: "Medium", color: "bg-yellow-500 text-white", ring: "ring-yellow-500" };
    default: return { label: "Low", color: "bg-blue-500 text-white", ring: "ring-blue-500" };
  }
}
