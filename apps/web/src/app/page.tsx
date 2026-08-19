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
        <section className="relative overflow-hidden bg-brand pb-24 pt-20 text-white">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4 text-center animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-6">
              <Icon name="wifi" className="w-3.5 h-3.5" /> Built for low-connectivity classrooms
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
              Personalized learning that works{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-emerald-200">even offline</span>
            </h1>
            <p className="mt-5 text-lg text-white/85 max-w-2xl mx-auto">
              Micro-assessments, real-time teacher radar, adaptive remediation, peer pods and rotation-based classrooms — designed for overcrowded schools.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3.5 justify-center">
              <Link href="/kiosk" className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 px-7 py-3.5 rounded-xl font-bold hover:bg-violet-50 shadow-lg transition-all active:scale-[.98]">
                <Icon name="zap" className="w-5 h-5" /> Try Student Mode
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-violet-900/40 backdrop-blur border border-white/25 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-violet-900/60 transition-all active:scale-[.98]">
                Teacher Sign In <Icon name="arrowRight" className="w-5 h-5" />
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[["2 min", "micro-checks"], ["0 Mbps", "required"], ["1 tap", "to assess"]].map(([v, l]) => (
                <div key={l} className="bg-white/10 backdrop-blur rounded-xl py-3 border border-white/15">
                  <p className="text-xl font-extrabold">{v}</p>
                  <p className="text-[11px] text-white/75 uppercase tracking-wide">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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