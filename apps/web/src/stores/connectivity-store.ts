import { create } from "zustand";
type CS = "ONLINE" | "OFFLINE" | "SYNCING" | "NEEDS_ATTENTION";
interface ConnectivityStore { state: CS; syncQueueCount: number; lastSyncAt: string | null; setState: (s: CS) => void; setSyncQueueCount: (n: number) => void; setLastSyncAt: (s: string) => void; }
export const useConnectivityStore = create<ConnectivityStore>((set) => ({ state: "ONLINE", syncQueueCount: 0, lastSyncAt: null, setState: (state) => set({ state }), setSyncQueueCount: (n) => set({ syncQueueCount: n }), setLastSyncAt: (s) => set({ lastSyncAt: s }) }));
export function initConnectivity() {
  if (typeof window === "undefined") return;
  const apply = () => useConnectivityStore.getState().setState(navigator.onLine ? "ONLINE" : "OFFLINE");
  apply();
  window.addEventListener("online", apply);
  window.addEventListener("offline", apply);
}
