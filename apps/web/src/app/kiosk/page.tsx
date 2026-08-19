"use client";
import { ProfilePicker } from "@/components/kiosk/profile-picker";
import { KioskToolbar } from "@/components/kiosk/kiosk-toolbar";
import { useKioskStore } from "@/stores/kiosk-store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InitialAvatar } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icons";
import { OfflineSyncCard } from "@/components/offline/offline-sync-card";
export default function KioskPage() {
  const state = useKioskStore(s => s.state);
  const profile = useKioskStore(s => s.currentProfile);
  if (state === "PROFILE_PICKER") return <ProfilePicker />;
  if (!profile) return <ProfilePicker />;
  return (
    <div className="min-h-screen bg-slate-50">
      <KioskToolbar />
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="bg-brand rounded-2xl p-6 text-white shadow-lg shadow-violet-500/25 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-4 relative">
            <InitialAvatar name={profile.name} className="w-14 h-14 text-lg ring-2 ring-white/40" />
            <div>
              <h1 className="text-2xl font-extrabold">Welcome, {profile.name}!</h1>
              <p className="text-white/80 text-sm">Your work is saved privately. Continue offline anytime.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Link href="/quiz" className="block group">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center transition-transform group-hover:scale-110"><Icon name="zap" className="w-6 h-6" /></div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900">Take a Micro-Assessment</h2>
                <p className="text-slate-500 text-sm mt-0.5">2-minute quiz. We'll find exactly which topics you need help with.</p>
              </div>
              <Icon name="arrowRight" className="w-5 h-5 text-slate-300 group-hover:text-violet-500 transition-colors" />
            </div>
          </Link>
          <Link href="/student/progress" className="block group">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110"><Icon name="chart" className="w-6 h-6" /></div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900">My Progress</h2>
                <p className="text-slate-500 text-sm mt-0.5">See your topic-level mastery and personal learning path.</p>
              </div>
              <Icon name="arrowRight" className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          </Link>
        </div>
        <OfflineSyncCard />
        <div className="flex justify-center pt-2">
          <Button variant="ghost" onClick={() => { if (window.history.length > 1) window.history.back(); }} className="gap-1.5"><Icon name="arrowLeft" className="w-4 h-4" /> Back</Button>
        </div>
      </div>
    </div>
  );
}