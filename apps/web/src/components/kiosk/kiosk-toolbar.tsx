"use client";
import { Button } from "@/components/ui/button";
import { useKioskStore } from "@/stores/kiosk-store";
import { disconnectSocket } from "@/lib/socket";
import { InitialAvatar } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icons";
export function KioskToolbar() {
  const profile = useKioskStore(s => s.currentProfile);
  const endTurn = useKioskStore(s => s.endTurn);
  if (!profile) return null;
  return (
    <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 text-sm">
      <span className="flex items-center gap-2.5"><InitialAvatar name={profile.name} className="w-7 h-7 text-[10px] ring-1 ring-white/30" /><span><span className="font-semibold">{profile.name}</span> <span className="text-slate-400 text-xs">is signed in · offline-safe</span></span></span>
      <Button size="sm" variant="outline" className="border-white/25 text-white hover:bg-white/10 gap-1.5" onClick={() => { disconnectSocket(); endTurn(); }}><Icon name="logout" className="w-3.5 h-3.5" /> End Turn</Button>
    </div>
  );
}