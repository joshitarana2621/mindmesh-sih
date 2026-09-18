"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConnectivityStore, initConnectivity } from "@/stores/connectivity-store";
import { Icon } from "@/components/ui/icons";
import { useSync } from "@/hooks/use-sync";

function formatLastSync(isoString: string | null): string {
  if (!isoString) return "Never";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSec < 30) return "Just now";
    if (diffSec < 120) return "1 min ago";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoString;
  }
}

export function ConnectivityBanner() {
  const state = useConnectivityStore((s) => s.state);
  const queueCount = useConnectivityStore((s) => s.syncQueueCount);
  const lastSyncAt = useConnectivityStore((s) => s.lastSyncAt);
  const isSimulatedOffline = useConnectivityStore((s) => s.isSimulatedOffline);
  const toggleSimulatedOffline = useConnectivityStore((s) => s.toggleSimulatedOffline);
  const { sync } = useSync();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    initConnectivity();
  }, []);

  if (!isClient || state === "ONLINE") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative z-50 text-white px-4 py-2.5 shadow-md transition-all ${
        state === "OFFLINE"
          ? "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800"
          : state === "SYNCING"
          ? "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600"
          : "bg-gradient-to-r from-rose-600 to-rose-700"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm">
        {/* Left: Status and message */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Icon
              name={state === "OFFLINE" ? "offline" : state === "SYNCING" ? "refresh" : "alert"}
              className={`w-3.5 h-3.5 ${state === "SYNCING" ? "animate-spin" : ""}`}
            />
          </span>

          <span className="font-extrabold tracking-tight">
            {state === "OFFLINE"
              ? isSimulatedOffline
                ? "Simulated Offline Mode"
                : "Offline Mode Active"
              : state === "SYNCING"
              ? "Auto-Syncing Data..."
              : "Sync Attention Needed"}
          </span>

          <span className="text-white/80 hidden md:inline">·</span>

          <span className="text-white/90 text-xs">
            {state === "OFFLINE"
              ? "All quiz answers and progress are stored locally. Auto-sync occurs when connected."
              : state === "SYNCING"
              ? "Uploading locally queued quiz completions and telemetry to server..."
              : `${queueCount} item(s) pending sync retry.`}
          </span>
        </div>

        {/* Right: Telemetry & Actions */}
        <div className="flex items-center gap-3 text-xs flex-wrap justify-center sm:justify-end">
          {/* Queue pill */}
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            <span>
              {queueCount} {queueCount === 1 ? "quiz queued" : "items queued"}
            </span>
          </div>

          {/* Last sync time */}
          <div className="hidden lg:flex items-center gap-1 text-white/80 text-[11px]">
            <Icon name="clock" className="w-3 h-3 text-white/60" />
            <span>Last sync: {formatLastSync(lastSyncAt)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => sync(true)}
              className="bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold px-2.5 py-1 rounded-lg border border-white/20 transition-all text-xs flex items-center gap-1"
            >
              <Icon name="refresh" className="w-3 h-3" />
              Sync Now
            </button>

            {isSimulatedOffline ? (
              <button
                onClick={toggleSimulatedOffline}
                className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-2.5 py-1 rounded-lg shadow-sm transition-all text-xs"
              >
                Go Online
              </button>
            ) : (
              <Link
                href="/offline"
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-2.5 py-1 rounded-lg transition-all text-xs"
              >
                Offline Hub
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}