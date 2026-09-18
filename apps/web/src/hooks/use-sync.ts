"use client";

import { useCallback, useEffect } from "react";
import { syncPendingEvents } from "@/lib/sync-service";
import { useConnectivityStore } from "@/stores/connectivity-store";
import { toast } from "@/components/ui/toast";

export function useSync() {
  const setState = useConnectivityStore((s) => s.setState);
  const setQueueCount = useConnectivityStore((s) => s.setSyncQueueCount);
  const setLastSyncAt = useConnectivityStore((s) => s.setLastSyncAt);

  const sync = useCallback(
    async (showToast = false) => {
      const { state, isSimulatedOffline } = useConnectivityStore.getState();
      if (isSimulatedOffline || (typeof navigator !== "undefined" && !navigator.onLine)) {
        const remaining = await import("@/lib/indexeddb").then((m) => m.getQueueCount()).catch(() => 0);
        setQueueCount(remaining);
        setState("OFFLINE");
        return { accepted: 0, duplicate: 0, rejected: 0, serverReachable: false };
      }

      setState("SYNCING");
      const r = await syncPendingEvents();
      const remaining = await import("@/lib/indexeddb").then((m) => m.getQueueCount()).catch(() => 0);
      setQueueCount(remaining);
      const now = new Date().toISOString();
      setLastSyncAt(now);

      if (remaining > 0 && r.serverReachable && r.rejected > 0) {
        setState("NEEDS_ATTENTION");
      } else if (remaining > 0 && !r.serverReachable) {
        setState("OFFLINE");
      } else {
        setState("ONLINE");
      }

      if (showToast || r.accepted > 0) {
        toast({
          title: "Data Synced",
          body:
            r.accepted > 0
              ? `${r.accepted} queued item(s) uploaded successfully.`
              : "Sync check completed. Everything is up to date.",
          kind: "success",
        });
      }

      return r;
    },
    [setState, setQueueCount, setLastSyncAt]
  );

  useEffect(() => {
    // Initial sync check
    sync(false);

    // Auto-sync on window 'online' event
    const handleOnline = () => {
      const isSimulatedOffline = useConnectivityStore.getState().isSimulatedOffline;
      if (!isSimulatedOffline) {
        toast({
          title: "Internet Restored",
          body: "Auto-syncing locally stored quizzes and answers...",
          kind: "info",
        });
        sync(true);
      }
    };

    window.addEventListener("online", handleOnline);
    const timer = setInterval(() => sync(false), 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      clearInterval(timer);
    };
  }, [sync]);

  return { sync };
}