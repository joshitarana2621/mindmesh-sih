"use client";
import { useEffect, useState } from "react";
import { useConnectivityStore } from "@/stores/connectivity-store";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export function OfflineSyncCard({ compact }: { compact?: boolean }) {
  const conn = useConnectivityStore();
  const [simOffline, setSimOffline] = useState(false);
  const [queue, setQueue] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>("Today · 09:14 AM");

  useEffect(() => {
    const t = setInterval(randomActivity, 14000);
    return () => clearInterval(t);
  }, [simOffline]);
  const randomActivity = () => {
    if (Math.random() < 0.6) return;
    setQueue(q => q + 1 + Math.floor(Math.random() * 2));
    conn.setSyncQueueCount(queue + 1);
  };
  const toggleOffline = () => {
    const next = !simOffline;
    setSimOffline(next);
    if (next) {
      setQueue(q => q + 2 + Math.floor(Math.random() * 3));
      conn.setSyncQueueCount(queue + 2);
      toast({ kind: "sync", title: "Connectivity lost — you're offline", body: "All new work is saved locally in the device cache. Nothing is lost.", });
    } else {
      toast({ kind: "info", title: "Connection restored", body: "Queued work will now sync automatically.", });
      doSync(true);
    }
  };
  const doSync = async (instant = false) => {
    setSyncing(true);
    toast({ kind: "sync", title: "Auto-sync in progress", body: `${queue} item(s) uploading…`, });
    await new Promise(r => setTimeout(r, instant ? 900 : 2200 + Math.random() * 1500));
    setQueue(0); conn.setSyncQueueCount(0);
    setLastSync(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setSyncing(false);
    toast({ kind: "success", title: "Sync complete", body: "All attempts, answers and telemetry are now on the server.", });
  };
  const effectiveOffline = simOffline || conn.state === "OFFLINE";
  const online = !effectiveOffline && !syncing;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className={cn("w-9 h-9 rounded-xl flex items-center justify-center", online ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}><Icon name={online ? "wifi" : "offline"} className={cn("w-4.5 h-4.5", online ? "" : "text-amber-600")} /></span>
          <div>
            <p className="font-bold text-slate-900 text-sm">{online ? "You are online" : "Working offline"}</p>
            <p className="text-xs text-slate-400">{online ? "Data syncs automatically in the background" : "Everything saves locally · syncs when back"}</p>
          </div>
        </div>
        <button onClick={toggleOffline} className={cn("relative w-11 h-6 rounded-full transition-colors", effectiveOffline ? "bg-amber-500" : "bg-emerald-500")} aria-label="toggle offline">
          <span className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", effectiveOffline ? "left-0.5" : "left-[22px]")} />
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
        <span className="text-slate-600">Sync queue:</span>
        <span className={cn("px-2 py-0.5 rounded-full", queue > 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200")}>{queue} item{queue === 1 ? "" : "s"}</span>
        <span className="ml-auto flex items-center gap-1 text-slate-400"><Icon name="clock" className="w-3.5 h-3.5" /> Last sync {lastSync}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => doSync()} disabled={syncing || queue === 0} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand text-white rounded-xl py-2 text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all active:scale-[.98]">
          <Icon name="refresh" className={cn("w-3.5 h-3.5", syncing && "animate-spin")} /> {syncing ? "Syncing…" : "Sync now"}
        </button>
        <button onClick={toggleOffline} className={cn("flex-1 rounded-xl py-2 text-xs font-bold border transition-all active:scale-[.98]", effectiveOffline ? "bg-emerald-500 text-white border-emerald-500 hover:opacity-90" : "bg-amber-500 text-white border-amber-500 hover:opacity-90")}>
          {effectiveOffline ? "Go online" : "Go offline"}
        </button>
      </div>
      {!compact && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
          <Icon name="offline" className="w-4 h-4 shrink-0 mt-0.5 text-violet-400" />
          <p><span className="font-bold text-slate-500">No waiting, no data loss:</span> the PWA caches quizzes & content (service worker), stores attempts in IndexedDB, and auto-syncs the moment connectivity returns.</p>
        </div>
      )}
    </div>
  );
}