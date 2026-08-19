"use client";
import { useEffect } from "react";
import { useConnectivityStore, initConnectivity } from "@/stores/connectivity-store";
import { Icon } from "@/components/ui/icons";
export function ConnectivityBanner() {
  const state = useConnectivityStore(s => s.state);
  const queueCount = useConnectivityStore(s => s.syncQueueCount);
  useEffect(() => { initConnectivity(); }, []);
  if (state === "ONLINE") return null;
  const cfg = {
    OFFLINE: { bg: "bg-amber-500", icon: "offline", text: "You are offline — your work is saved locally and will sync automatically." },
    SYNCING: { bg: "bg-blue-500", icon: "refresh", text: "Syncing your data…" },
    NEEDS_ATTENTION: { bg: "bg-rose-500", icon: "alert", text: `${queueCount} item${queueCount === 1 ? "" : "s"} waiting to sync.` },
  }[state];
  return (
    <div className={`${cfg.bg} text-white px-4 py-2 text-sm font-medium text-center flex items-center justify-center gap-2`}>
      <Icon name={cfg.icon} className={`w-4 h-4 ${state === "SYNCING" ? "animate-spin" : ""}`} />
      {cfg.text}
      {state === "OFFLINE" && <button onClick={() => useConnectivityStore.getState().setState(navigator.onLine ? "ONLINE" : "OFFLINE")} className="underline font-bold hover:opacity-80">Recheck</button>}
    </div>
  );
}