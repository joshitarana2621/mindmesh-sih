"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKioskStore } from "@/stores/kiosk-store";
import { getDeviceId } from "@/lib/indexeddb";
import { InitialAvatar } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icons";
const DEMO_STUDENTS = [
  { id: "s1", name: "Aarav Patel", roll: "R001" }, { id: "s2", name: "Diya Sharma", roll: "R002" },
  { id: "s3", name: "Rohan Gupta", roll: "R003" }, { id: "s4", name: "Ananya Rao", roll: "R004" },
  { id: "s5", name: "Kabir Singh", roll: "R005" }, { id: "s6", name: "Meera Nair", roll: "R006" },
];
export function ProfilePicker() {
  const startSession = useKioskStore(s => s.startSession);
  const [selected, setSelected] = useState<string | null>(null);
  const handle = (s: typeof DEMO_STUDENTS[0]) => {
    setSelected(s.id); getDeviceId();
    setTimeout(() => startSession({ userId: s.id, name: s.name, profileNamespace: `${s.id}-${crypto.randomUUID().slice(0, 8)}` }), 300);
  };
  return (
    <div className="min-h-screen bg-brand p-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-fuchsia-400/25 blur-3xl" />
      <Card className="w-full max-w-md relative shadow-2xl border-white/60 animate-fade-up">
        <CardHeader className="text-center pt-8 pb-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center shadow-lg shadow-violet-500/40 mb-3"><Icon name="users" className="w-7 h-7" /></div>
          <CardTitle className="text-xl text-slate-900">Select Your Profile</CardTitle>
          <p className="text-sm text-slate-500">Shared device — choose your name. Your work stays private and syncs when online.</p>
        </CardHeader>
        <CardContent className="space-y-2.5 px-6 pb-8">
          {DEMO_STUDENTS.map(s => (
            <Button key={s.id} variant={selected === s.id ? "brand" : "outline"} className="w-full justify-between h-14 rounded-xl px-3.5" onClick={() => handle(s)}>
              <span className="flex items-center gap-3"><InitialAvatar name={s.name} className="w-8 h-8 text-xs" /><span className="font-semibold">{s.name}</span></span>
              <span className={selected === s.id ? "text-white/80 text-xs font-medium" : "text-slate-400 text-xs font-medium"}>{s.roll}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}