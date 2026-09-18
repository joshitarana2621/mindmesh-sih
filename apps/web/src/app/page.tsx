"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";

const FEATURES = [
  { icon: "zap", title: "Micro-Assessments", body: "2-minute low-stakes quizzes that adapt to each child's mastery of core concepts, synced when connectivity returns.", color: "bg-violet-500/10 text-violet-600" },
  { icon: "radar", title: "Teacher Intervention Radar", body: "Instantly see which students are at risk, struggling or about to disengage — and act before the bell rings.", color: "bg-sky-500/10 text-sky-600" },
  { icon: "offline", title: "True Offline / Kiosk Mode", body: "Share one device or a class set. Signed-in and anonymous profiles keep working with zero internet.", color: "bg-emerald-500/10 text-emerald-600" },
  { icon: "brain", title: "Adaptive Remediation", body: "Each wrong answer triggers targeted practice paths and multilingual hints for the exact misconception.", color: "bg-amber-500/10 text-amber-600" },
  { icon: "users", title: "Learning Pods", body: "The system forms balanced peer pods — high-achievers tutoring strugglers — based on mastery distance.", color: "bg-rose-500/10 text-rose-600" },
  { icon: "refresh", title: "Rotation Stations", body: "Manage rotation-based classrooms: seatwork, teacher-led and group stations with live progress.", color: "bg-indigo-500/10 text-indigo-600" },
];

export default function LandingPage() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-violet-500/30">E</div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight">EduAdapt</span>
              <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline font-medium">Offline-first blended learning</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors">Sign in</Link>
            <Link href="/kiosk" className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-lg hover:opacity-90 shadow-md shadow-violet-500/30 transition-all">Kiosk Mode</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Redesigned Problem-First Hero Section for SIH 26207 */}
        <section className="relative overflow-hidden bg-brand pb-20 pt-16 sm:pt-24 text-white" aria-labelledby="hero-heading">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
          
          <div className="relative max-w-5xl mx-auto px-4 text-center animate-fade-up">
            {/* SIH 26207 Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-sky-200 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span>SIH 26207 Problem-First Story</span>
              <span className="text-white/40" aria-hidden="true">·</span>
              <span className="text-white/90">Personalized Blended Learning</span>
            </div>

            {/* Headline */}
            <h1 id="hero-heading" className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white max-w-4xl mx-auto">
              1 Teacher. 45 Students.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-teal-200 to-amber-200 mt-2.5">
                45 Different Learning Speeds.
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-white/85 max-w-3xl mx-auto font-normal leading-relaxed">
              MindMesh is an AI-powered learning platform that identifies learning gaps, creates personalized learning paths, and helps teachers intervene at the right time.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-[#0A1931] px-8 py-3.5 rounded-xl font-bold hover:bg-slate-100 shadow-xl shadow-black/10 hover:shadow-2xl transition-all duration-200 active:scale-[0.98] group"
              >
                <span>Try Demo</span>
                <Icon name="arrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-300"
                aria-haspopup="dialog"
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                  <Icon name="play" className="w-3 h-3 text-white" />
                </span>
                <span>Watch 3-min Demo</span>
              </button>
            </div>

            {/* 3 Impact Cards */}
            <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto text-left">
              {/* Card 1: AI Learning DNA */}
              <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 hover:bg-white/[0.14] hover:border-white/25 transition-all duration-300 group shadow-lg">
                <div className="w-11 h-11 rounded-xl bg-sky-400/20 text-sky-200 flex items-center justify-center mb-4 border border-sky-300/30 group-hover:scale-105 transition-transform" aria-hidden="true">
                  <Icon name="brain" className="w-5 h-5 text-sky-200" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">AI Learning DNA</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-400/30">Adaptive</span>
                </div>
                <p className="text-sm text-white/75 leading-relaxed">
                  Pinpoints exact cognitive misconceptions across Knowledge Components (KCs) and maps individualized micro-remediation paths for each learner.
                </p>
              </div>

              {/* Card 2: Offline First */}
              <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 hover:bg-white/[0.14] hover:border-white/25 transition-all duration-300 group shadow-lg">
                <div className="w-11 h-11 rounded-xl bg-emerald-400/20 text-emerald-200 flex items-center justify-center mb-4 border border-emerald-300/30 group-hover:scale-105 transition-transform" aria-hidden="true">
                  <Icon name="offline" className="w-5 h-5 text-emerald-200" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">Offline First</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">0 Mbps OK</span>
                </div>
                <p className="text-sm text-white/75 leading-relaxed">
                  Full curriculum assessment runs locally on single or shared devices. Automatically reconciles telemetry the instant connection returns.
                </p>
              </div>

              {/* Card 3: Teacher Heatmap */}
              <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 hover:bg-white/[0.14] hover:border-white/25 transition-all duration-300 group shadow-lg">
                <div className="w-11 h-11 rounded-xl bg-amber-400/20 text-amber-200 flex items-center justify-center mb-4 border border-amber-300/30 group-hover:scale-105 transition-transform" aria-hidden="true">
                  <Icon name="radar" className="w-5 h-5 text-amber-200" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">Teacher Heatmap</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">Real-Time</span>
                </div>
                <p className="text-sm text-white/75 leading-relaxed">
                  Early-warning radar turns 45 learning streams into 1 clear actionable view. Identifies who needs help, why, and what intervention to run.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Video Walkthrough Modal */}
        {showDemoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
          >
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-bold text-sm">
                    <Icon name="play" className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 id="demo-modal-title" className="text-base font-bold text-slate-900">
                      MindMesh 3-Minute Walkthrough
                    </h3>
                    <p className="text-xs text-slate-500">Problem Statement SIH 26207 Solution Architecture</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                  aria-label="Close walkthrough modal"
                >
                  <Icon name="close" className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Simulated Interactive Video Screen */}
                <div className="relative aspect-video rounded-xl bg-gradient-to-br from-slate-900 via-[#1A3D63] to-[#0A1931] border border-slate-800 flex flex-col items-center justify-center text-white p-6 shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(74,127,167,0.3),transparent_70%)]" />
                  <div className="relative text-center space-y-3 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center mx-auto shadow-xl group hover:scale-110 transition-transform">
                      <Icon name="play" className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold tracking-tight text-white">Live System Demonstration</h4>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Watch how MindMesh automates formative micro-assessments, categorizes cognitive gaps via AI Learning DNA, and signals teachers on the live radar.
                    </p>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white/70">
                    <span className="font-mono">01:42 / 03:00</span>
                    <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] font-semibold">1080p HD</span>
                  </div>
                </div>

                {/* 3 Quick Chapters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-bold text-sky-600 uppercase">00:00 · The Problem</p>
                    <p className="text-xs font-semibold text-slate-800 mt-1">45 Students, 1 Teacher</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Overcrowded classrooms and silent disengagement.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-bold text-emerald-600 uppercase">01:05 · AI Solution</p>
                    <p className="text-xs font-semibold text-slate-800 mt-1">Learning DNA & Offline PWA</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Knowledge component graphs and zero-latency caching.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-bold text-violet-600 uppercase">02:10 · Intervention</p>
                    <p className="text-xs font-semibold text-slate-800 mt-1">Radar & Peer Pods</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Automated student pairing and instant remediation.</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500">Want to interact with real data instead?</p>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowDemoModal(false)}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href="/login"
                    onClick={() => setShowDemoModal(false)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-brand text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-violet-500/30 hover:opacity-90 transition-all"
                  >
                    Launch Interactive Demo <Icon name="arrowRight" className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Existing problem cards section */}
        <section className="max-w-6xl mx-auto px-4 pb-16 mt-12">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide">The 3 problems we fix</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Built for classrooms where <span className="text-brand">technology usually fails</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "offline", color: "bg-emerald-500/10 text-emerald-600", problem: "Poor connectivity stops learning and data syncing", title: "Offline-First PWA", body: "Assessment packages are cached, attempts saved to device storage, and auto-sync fires the moment the network returns. Learning never stops.", link: "/kiosk", linkText: "See offline demo", badge: "Offline caching + auto sync" },
              { icon: "users", color: "bg-sky-500/10 text-sky-600", problem: "Shared touchscreens mix students' data and collide on one UI", title: "Multi-User Tracking", body: "Every touch and profile is tracked independently — separate answers, separate mastery, zero overlapping UI. Kiosk mode for 1:N sharing.", link: "/multiuser", linkText: "Try multi-touch demo", badge: "Multi-touch profiles" },
              { icon: "radar", color: "bg-rose-500/10 text-rose-600", problem: "Teachers only notice struggling students when checking dashboards manually", title: "Intervention Radar", body: "Repeated errors or mastery drops trigger instant, prioritized, explainable alerts — pushed live to the teacher. Act before the bell rings.", link: "/teacher", linkText: "Open live radar", badge: "Real-time teacher alerts" },
            ].map((f, i) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover flex flex-col animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}><Icon name={f.icon} className="w-5.5 h-5.5" /></div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">{f.badge}</span>
                </div>
                <p className="mt-4 text-xs font-semibold text-rose-500 leading-snug">⚠ {f.problem}</p>
                <h3 className="mt-1.5 text-lg font-extrabold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">{f.body}</p>
                <Link href={f.link} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors">{f.linkText} <Icon name="arrowRight" className="w-4 h-4" /></Link>
              </div>
            ))}
          </div>
        </section>

        {/* Existing features section */}
        <section className="max-w-6xl mx-auto px-4 pb-16 mt-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}><Icon name={f.icon} className="w-5.5 h-5.5" /></div>
                <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-brand-soft border border-violet-200/60 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 card-hover">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Ready to see it live?</h2>
              <p className="mt-1 text-slate-500">Jump into the demo student experience — no sign-up needed. Works fully offline.</p>
            </div>
            <Link href="/quiz" className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-violet-500/30 hover:opacity-90 transition-all active:scale-[.98] shrink-0">
              <Icon name="target" className="w-5 h-5" /> Take a Demo Quiz
            </Link>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">EduAdapt · Smart India Hackathon 2026 · Works where the internet doesn't</footer>
      </main>
    </div>
  );
}