"use client";

import React from "react";
import { Icon } from "./icons";
import { useMockDataStore } from "@/stores/mock-data-store";

interface DemoBadgeProps {
  className?: string;
  showReset?: boolean;
  size?: "sm" | "md";
}

export function DemoBadge({
  className = "",
  showReset = false,
  size = "sm",
}: DemoBadgeProps) {
  const resetToDefault = useMockDataStore((s) => s.resetToDefault);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-amber-800 shadow-sm ${className}`}
      role="status"
      aria-label="Simulation notice"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
      </span>
      <span>DEMO CLASS — SIMULATED DATA</span>
      {showReset && (
        <button
          type="button"
          onClick={() => {
            resetToDefault();
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }}
          className="ml-1 inline-flex items-center gap-1 rounded-md bg-amber-200/70 px-2 py-0.5 text-[10px] font-bold text-amber-900 transition-colors hover:bg-amber-300 active:scale-95"
          title="Reset all mock data to clean initial state"
        >
          <Icon name="refresh" className="h-2.5 w-2.5" />
          <span>Reset Demo</span>
        </button>
      )}
    </div>
  );
}
