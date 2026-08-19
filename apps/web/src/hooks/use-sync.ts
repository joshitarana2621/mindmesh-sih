"use client";
import { useCallback, useEffect } from "react";
import { syncPendingEvents } from "@/lib/sync-service";
import { useConnectivityStore } from "@/stores/connectivity-store";
export function useSync() {
  const setState = useConnectivityStore(s => s.setState);
  const setQueueCount = useConnectivityStore(s => s.setSyncQueueCount);
  const setLastSyncAt = useConnectivityStore(s => s.setLastSyncAt);
  const sync = useCallback(async () => {
    const prev = useConnectivityStore.getState().state;
    if (prev === "NEEDS_ATTENTION" || prev === "ONLINE") setState("SYNCING");
    const r = await syncPendingEvents();
    const remaining = await import("@/lib/indexeddb").then(m => m.getQueueCount());
    setQueueCount(remaining); setLastSyncAt(new Date().toISOString());
    if (remaining > 0 && r.serverReachable && r.rejected > 0) setState("NEEDS_ATTENTION");
    else if (remaining > 0) setState("OFFLINE");
    else setState("ONLINE");
    return r;
  }, [setState, setQueueCount, setLastSyncAt]);
  useEffect(() => { sync(); const t = setInterval(sync, 30000); return () => clearInterval(t); }, [sync]);
  return { sync };
}