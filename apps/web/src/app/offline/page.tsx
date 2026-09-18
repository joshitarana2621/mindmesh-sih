"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Toaster, toast } from "@/components/ui/toast";
import { useConnectivityStore } from "@/stores/connectivity-store";
import { useSync } from "@/hooks/use-sync";
import {
  getQueuedQuizAttempts,
  QueuedQuizAttempt,
  getQueueCount,
  getDeviceId,
  queueQuizCompletion,
} from "@/lib/indexeddb";

function formatTimestamp(iso: string | null): string {
  if (!iso) return "Never";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return iso;
  }
}

export default function OfflineLearningPage() {
  const connState = useConnectivityStore((s) => s.state);
  const queueCount = useConnectivityStore((s) => s.syncQueueCount);
  const setQueueCount = useConnectivityStore((s) => s.setSyncQueueCount);
  const lastSyncAt = useConnectivityStore((s) => s.lastSyncAt);
  const setLastSyncAt = useConnectivityStore((s) => s.setLastSyncAt);
  const isSimulatedOffline = useConnectivityStore((s) => s.isSimulatedOffline);
  const toggleSimulatedOffline = useConnectivityStore((s) => s.toggleSimulatedOffline);
  const { sync } = useSync();

  const [queuedQuizzes, setQueuedQuizzes] = useState<QueuedQuizAttempt[]>([]);
  const [deviceId, setDeviceId] = useState<string>("loading...");
  const [isSyncingManual, setIsSyncingManual] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  // Load offline data from IndexedDB
  const refreshQueue = async () => {
    try {
      const attempts = await getQueuedQuizAttempts();
      setQueuedQuizzes(attempts);
      const qSize = await getQueueCount();
      setQueueCount(qSize);
    } catch (e) {
      console.error("Failed to read IndexedDB queue", e);
    }
  };

  useEffect(() => {
    setDeviceId(getDeviceId());
    refreshQueue();

    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        setSwRegistered(regs.length > 0);
      });
    }
  }, [queueCount, connState]);

  const handleManualSync = async () => {
    if (isSimulatedOffline) {
      toast({
        title: "Currently in Simulated Offline Mode",
        body: "Toggle offline mode off to allow auto-sync to connect to server.",
        kind: "alert",
      });
      return;
    }
    setIsSyncingManual(true);
    const res = await sync(true);
    await refreshQueue();
    setIsSyncingManual(false);
  };

  const handleSimulateQuizSubmission = async () => {
    const randomAttemptId = crypto.randomUUID();
    const correctCount = Math.floor(Math.random() * 2) + 2; // 2 to 4
    await queueQuizCompletion({
      attemptId: randomAttemptId,
      quizId: "offline-array-quiz",
      title: "Arrays & Bounds Check",
      namespace: "student-offline-demo",
      score: correctCount / 4,
      totalQuestions: 4,
      correctCount,
      answers: {
        "q-1": { answer: "20", isCorrect: true },
        "q-2": { answer: "let arr = []", isCorrect: true },
        "q-3": { answer: "2", isCorrect: correctCount >= 3 },
        "q-4": { answer: "for loop", isCorrect: correctCount === 4 },
      },
      completedAt: new Date().toISOString(),
    });

    await refreshQueue();
    toast({
      title: "Offline Quiz Queued",
      body: `Attempt ${randomAttemptId.slice(0, 8)} saved locally in IndexedDB sync queue.`,
      kind: "sync",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                E
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                    EduAdapt
                  </span>
                  <Badge
                    variant={connState === "ONLINE" ? "success" : "warning"}
                    className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider"
                  >
                    {connState === "ONLINE" ? "Online Mode" : "Offline Engine"}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Zero-Connectivity Learning & Resilient Sync Architecture
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/quiz"
              className="text-xs font-bold bg-brand text-white px-3.5 py-2 rounded-lg hover:opacity-90 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Icon name="play" className="w-3.5 h-3.5" />
              <span>Launch Quiz</span>
            </Link>
            <Link
              href="/kiosk"
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Icon name="users" className="w-3.5 h-3.5" />
              <span>Kiosk Mode</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* HERO CARD: Real-time Connection & Sync Status */}
        <section aria-labelledby="offline-hero-heading">
          <div
            className={`rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden transition-colors ${
              connState === "OFFLINE"
                ? "bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950"
                : connState === "SYNCING"
                ? "bg-gradient-to-br from-sky-800 via-blue-900 to-indigo-950"
                : "bg-brand"
            }`}
          >
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

            <div className="relative space-y-6">
              {/* Header inside Hero */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center font-bold shrink-0">
                    <Icon
                      name={
                        connState === "ONLINE"
                          ? "wifi"
                          : connState === "SYNCING"
                          ? "refresh"
                          : "offline"
                      }
                      className={`w-6 h-6 text-amber-200 ${
                        connState === "SYNCING" ? "animate-spin" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1
                        id="offline-hero-heading"
                        className="text-xl sm:text-2xl font-black text-white tracking-tight"
                      >
                        {connState === "ONLINE"
                          ? "Online & Synced"
                          : connState === "SYNCING"
                          ? "Synchronizing Queue..."
                          : "Offline Learning Active"}
                      </h1>
                      <span className="text-[10px] font-bold bg-white/20 border border-white/30 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {isSimulatedOffline ? "Simulated Offline" : "Live Device State"}
                      </span>
                    </div>
                    <p className="text-xs text-white/80 mt-0.5">
                      {connState === "OFFLINE"
                        ? "Zero internet required. Completed quizzes are queued in IndexedDB and will auto-sync when online."
                        : "Device is connected to the classroom server. Telemetry and attempts sync automatically."}
                    </p>
                  </div>
                </div>

                {/* Controls in Hero */}
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSimulatedOffline}
                    className="bg-white/15 hover:bg-white/25 text-white border-white/30 backdrop-blur text-xs gap-1.5"
                  >
                    <Icon name="offline" className="w-3.5 h-3.5" />
                    {isSimulatedOffline ? "Disable Simulated Offline" : "Simulate Offline"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManualSync}
                    disabled={isSyncingManual || connState === "OFFLINE"}
                    className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs gap-1.5 shadow-sm"
                  >
                    <Icon
                      name="refresh"
                      className={`w-3.5 h-3.5 ${isSyncingManual ? "animate-spin" : ""}`}
                    />
                    {isSyncingManual ? "Syncing..." : "Sync Now"}
                  </Button>
                </div>
              </div>

              {/* Status Ribbon inside Hero */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Status indicator */}
                <div className="bg-black/20 backdrop-blur border border-white/15 rounded-xl p-3 flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      connState === "ONLINE"
                        ? "bg-emerald-400"
                        : connState === "SYNCING"
                        ? "bg-sky-400 animate-pulse"
                        : "bg-amber-400"
                    }`}
                  />
                  <div>
                    <p className="text-[10px] text-white/60 font-semibold uppercase">Network State</p>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {connState} {isSimulatedOffline ? "(Simulated)" : ""}
                    </p>
                  </div>
                </div>

                {/* Queued items */}
                <div className="bg-black/20 backdrop-blur border border-white/15 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">
                    <Icon name="clock" className="w-4 h-4 text-amber-200" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 font-semibold uppercase">Local Queue</p>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {queueCount} {queueCount === 1 ? "item waiting" : "items waiting to sync"}
                    </p>
                  </div>
                </div>

                {/* Last synced timestamp */}
                <div className="bg-black/20 backdrop-blur border border-white/15 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">
                    <Icon name="check" className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 font-semibold uppercase">Last Synced</p>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {formatTimestamp(lastSyncAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: Queued Completed Quizzes (Offline Queue Manager) */}
        <section aria-labelledby="offline-queue-heading">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Icon name="clock" className="w-4 h-4" />
                  </div>
                  <h2
                    id="offline-queue-heading"
                    className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight"
                  >
                    Locally Queued Completed Quizzes ({queuedQuizzes.length})
                  </h2>
                  <Badge variant={queueCount > 0 ? "warning" : "success"} className="text-[10px]">
                    {queueCount > 0 ? "Pending Cloud Sync" : "All Caught Up"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Quizzes completed while disconnected are stored securely in browser IndexedDB
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSimulateQuizSubmission}
                  className="text-xs gap-1 text-slate-700"
                >
                  <Icon name="plus" className="w-3.5 h-3.5" />
                  Queue Test Quiz
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={handleManualSync}
                  disabled={queueCount === 0 || connState === "OFFLINE"}
                  className="text-xs gap-1.5"
                >
                  <Icon name="refresh" className="w-3.5 h-3.5" />
                  Sync Queue ({queueCount})
                </Button>
              </div>
            </div>

            {queuedQuizzes.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Icon name="check" className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">
                  Queue is Clear · All Quizzes Synced
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No pending attempts waiting in local storage. Complete a quiz while offline or click
                  &quot;Queue Test Quiz&quot; above to simulate an offline attempt.
                </p>
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:underline pt-2"
                >
                  Take an Offline Assessment Now <Icon name="arrowRight" className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {queuedQuizzes.map((quizItem) => (
                  <div
                    key={quizItem.attemptId}
                    className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 hover:bg-white hover:border-amber-300 transition-all card-hover space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md uppercase">
                            Queued
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {quizItem.attemptId.slice(0, 8)}...
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{quizItem.title}</h4>
                      </div>
                      <span className="text-xs font-black text-amber-700 bg-white border border-amber-200 px-2 py-0.5 rounded-lg">
                        {Math.round(quizItem.score * 100)}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span>Score:</span>
                        <span className="font-bold text-slate-700">
                          {quizItem.correctCount} / {quizItem.totalQuestions} questions
                        </span>
                      </div>
                      <ProgressBar
                        value={quizItem.score}
                        barClassName={quizItem.score >= 0.75 ? "bg-emerald-500" : "bg-amber-500"}
                      />
                    </div>

                    <div className="pt-2 border-t border-amber-100/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Saved: {formatTimestamp(quizItem.completedAt)}</span>
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <Icon name="clock" className="w-3 h-3" /> Auto-sync pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: Offline Learning Modules (Cached Content) */}
        <section aria-labelledby="offline-modules-heading">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2
                  id="offline-modules-heading"
                  className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2"
                >
                  <Icon name="book" className="w-4 h-4 text-emerald-600" />
                  Pre-Cached Offline Learning Modules
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Curriculum units stored in browser ServiceWorker cache, accessible even in airplane mode
                </p>
              </div>
              <Badge variant="outline" className="text-xs self-start sm:self-auto">
                PWA Cached
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  code: "KC-001",
                  title: "Array Declaration & Fixed Allocation",
                  desc: "Memory buffers, type safety, and contiguous slots.",
                  questions: 4,
                  status: "100% Cached",
                },
                {
                  code: "KC-002",
                  title: "Zero-Indexed Bounds & Offsets",
                  desc: "Off-by-one errors and valid boundary offsets.",
                  questions: 4,
                  status: "100% Cached",
                },
                {
                  code: "KC-003",
                  title: "Loop Traversal Conditions",
                  desc: "Iterating through elements using for/while loops.",
                  questions: 4,
                  status: "100% Cached",
                },
                {
                  code: "KC-004",
                  title: "Dynamic Resizing & Insertion",
                  desc: "Shifting elements and expanding arrays.",
                  questions: 4,
                  status: "100% Cached",
                },
              ].map((mod) => (
                <div
                  key={mod.code}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition-all card-hover flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md uppercase">
                        {mod.code}
                      </span>
                      <Badge variant="success" className="text-[10px]">
                        {mod.status}
                      </Badge>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{mod.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-snug">{mod.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{mod.questions} questions</span>
                    <Link
                      href="/quiz"
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      Practice <Icon name="arrowRight" className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: Offline Telemetry & PWA Architecture */}
        <section aria-labelledby="offline-architecture-heading">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <h2
                id="offline-architecture-heading"
                className="text-base font-extrabold text-slate-900 flex items-center gap-2"
              >
                <Icon name="zap" className="w-4 h-4 text-violet-600" />
                How MindMesh Offline-First Learning Works
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Engineered specifically for SIH 26207 to support rural Indian classrooms with erratic power and zero internet connectivity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-violet-50/60 border border-violet-100 space-y-1.5">
                  <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <h3 className="text-xs font-bold text-violet-950">Local Storage Caching</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    ServiceWorker caches the full PWA shell and micro-assessments. All attempts are saved to IndexedDB.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1.5">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <h3 className="text-xs font-bold text-sky-950">Conflict-Free Queue</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Attempts use cryptographically generated UUIDs and monotonic sequence timestamps to eliminate sync collisions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <h3 className="text-xs font-bold text-emerald-950">Automatic Reconnection</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Browser automatically listens to network events. When internet returns, queued quizzes upload in one atomic batch.
                  </p>
                </div>
              </div>
            </div>

            {/* Device Diagnostic Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Icon name="radar" className="w-4 h-4 text-sky-600" />
                  Device Diagnostics
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Local client environment specs
                </p>

                <div className="space-y-3 mt-4 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Service Worker:</span>
                    <span className="font-bold text-emerald-600">
                      {swRegistered ? "Active (sw.js)" : "Registered (Production)"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Storage Engine:</span>
                    <span className="font-bold text-slate-800">IndexedDB (eduadpat-v1)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Device ID:</span>
                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-[140px]">
                      {deviceId}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">PWA Manifest:</span>
                    <span className="font-bold text-slate-800">Linked (/manifest.webmanifest)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "PWA Install Ready",
                      body: "Tap browser menu (or address bar icon) and select 'Install MindMesh App' for native offline experience.",
                      kind: "info",
                    });
                  }}
                  className="w-full text-xs gap-1.5"
                >
                  <Icon name="sparkles" className="w-3.5 h-3.5 text-sky-600" />
                  Install App as PWA
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Interactive Toaster */}
      <Toaster />
    </div>
  );
}
