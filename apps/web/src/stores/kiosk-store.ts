import { create } from "zustand";
type KS = "PROFILE_PICKER" | "AUTHENTICATING" | "ACTIVE" | "LOCKED" | "HANDOFF";
interface KioskStore { state: KS; currentProfile: { userId: string; name: string; profileNamespace: string } | null; setState: (s: KS) => void; startSession: (p: { userId: string; name: string; profileNamespace: string }) => void; endTurn: () => void; }
export const useKioskStore = create<KioskStore>((set) => ({ state: "PROFILE_PICKER", currentProfile: null, setState: (s) => set({ state: s }), startSession: (p) => set({ state: "ACTIVE", currentProfile: p }), endTurn: () => { if (typeof window !== "undefined") localStorage.removeItem("eduadpat-active-profile"); set({ state: "PROFILE_PICKER", currentProfile: null }); } }));
