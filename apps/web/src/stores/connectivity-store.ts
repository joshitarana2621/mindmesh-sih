import { create } from "zustand";

export type CS = "ONLINE" | "OFFLINE" | "SYNCING" | "NEEDS_ATTENTION";

interface ConnectivityStore {
  state: CS;
  syncQueueCount: number;
  lastSyncAt: string | null;
  isSimulatedOffline: boolean;
  setState: (s: CS) => void;
  setSyncQueueCount: (n: number) => void;
  setLastSyncAt: (s: string) => void;
  toggleSimulatedOffline: () => void;
  setSimulatedOffline: (v: boolean) => void;
}

const getInitialLastSync = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("eduadapt-last-sync") || new Date().toISOString();
};

export const useConnectivityStore = create<ConnectivityStore>((set, get) => ({
  state: typeof navigator !== "undefined" && !navigator.onLine ? "OFFLINE" : "ONLINE",
  syncQueueCount: 0,
  lastSyncAt: getInitialLastSync(),
  isSimulatedOffline: false,
  setState: (state) => set({ state }),
  setSyncQueueCount: (n) => set({ syncQueueCount: n }),
  setLastSyncAt: (s) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("eduadapt-last-sync", s);
      } catch {}
    }
    set({ lastSyncAt: s });
  },
  toggleSimulatedOffline: () => {
    const next = !get().isSimulatedOffline;
    set({
      isSimulatedOffline: next,
      state: next ? "OFFLINE" : (navigator.onLine ? "ONLINE" : "OFFLINE"),
    });
  },
  setSimulatedOffline: (v) => {
    set({
      isSimulatedOffline: v,
      state: v ? "OFFLINE" : (navigator.onLine ? "ONLINE" : "OFFLINE"),
    });
  },
}));

let isInitialized = false;

export function initConnectivity(onAutoSync?: () => void) {
  if (typeof window === "undefined" || isInitialized) return;
  isInitialized = true;

  const handleOnline = () => {
    const { isSimulatedOffline, setState } = useConnectivityStore.getState();
    if (!isSimulatedOffline) {
      setState("ONLINE");
      if (onAutoSync) {
        onAutoSync();
      }
    }
  };

  const handleOffline = () => {
    useConnectivityStore.getState().setState("OFFLINE");
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Initial state check
  if (!navigator.onLine) {
    useConnectivityStore.getState().setState("OFFLINE");
  }
}
