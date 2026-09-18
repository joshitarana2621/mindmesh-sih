"use client";

import { useState, useEffect } from "react";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 180
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [customVideoUrl, setCustomVideoUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [activeTab, setActiveTab] = useState<"interactive" | "video">("interactive");

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (showDemoModal && isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 180) {
            setIsPlaying(false);
            return 180;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showDemoModal, isPlaying, playbackSpeed]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const jumpToChapter = (seconds: number) => {
    setCurrentTime(seconds);
    setIsPlaying(true);
  };

  const getYouTubeEmbed = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null;
  };

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
                onClick={() => {
                  setShowDemoModal(true);
                  setIsPlaying(true);
                  setCurrentTime(0);
                  setActiveTab("interactive");
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-300 cursor-pointer"
                aria-haspopup="dialog"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-500/80 flex items-center justify-center animate-pulse" aria-hidden="true">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
          >
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in max-h-[95vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/90 gap-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Icon name="play" className="w-4 h-4 translate-x-0.5" />
                  </span>
                  <div>
                    <h3 id="demo-modal-title" className="text-sm sm:text-base font-extrabold text-slate-900">
                      MindMesh 3-Minute Walkthrough
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Problem Statement SIH 26207 Solution Architecture
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  {/* Mode switcher tabs */}
                  <div className="inline-flex rounded-xl bg-slate-200/90 p-0.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("interactive");
                        setIsPlaying(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === "interactive"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>⚡ AI Simulation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("video");
                        setIsPlaying(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === "video"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>🎬 Real Video</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShowDemoModal(false);
                      setIsPlaying(false);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close walkthrough modal"
                  >
                    <Icon name="close" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
                {activeTab === "video" ? (
                  /* Real Video Tab: Embedded Player with Native Controls */
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-800">
                      <iframe
                        src={
                          customVideoUrl && getYouTubeEmbed(customVideoUrl)
                            ? getYouTubeEmbed(customVideoUrl)!
                            : "https://www.youtube-nocookie.com/embed/ujXnsh5j454?autoplay=1"
                        }
                        title="MindMesh Walkthrough Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 shrink-0">Custom Video:</span>
                      <input
                        type="url"
                        value={customVideoUrl}
                        onChange={(e) => setCustomVideoUrl(e.target.value)}
                        placeholder="Paste YouTube link (e.g. https://youtu.be/...)"
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                      {customVideoUrl && (
                        <button
                          type="button"
                          onClick={() => setCustomVideoUrl("")}
                          className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 cursor-pointer"
                        >
                          Reset Default
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Interactive Animated AI Simulation Screen */
                  <div
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="relative aspect-video rounded-2xl bg-gradient-to-br from-slate-950 via-[#0A1931] to-[#1A3D63] border border-slate-800 shadow-2xl flex flex-col justify-between p-3 sm:p-5 text-white select-none overflow-hidden group cursor-pointer"
                    title={isPlaying ? "Click to Pause" : "Click to Play"}
                  >
                    {/* Background Radial Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(74,127,167,0.35),transparent_75%)] pointer-events-none" />

                    {/* Top Screen Overlay: Current Chapter Badge & Resolution */}
                    <div className="relative z-10 flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/20 font-bold text-sky-200">
                        <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                        <span>
                          {isPlaying ? "Playing: " : "Paused: "}
                          {currentTime < 65
                            ? "Chapter 1: The Problem (45 Students, 1 Teacher)"
                            : currentTime < 130
                            ? "Chapter 2: AI Solution (Learning DNA & Offline PWA)"
                            : "Chapter 3: Intervention (Radar & Peer Pods)"}
                        </span>
                      </span>
                      <span className="bg-white/15 backdrop-blur px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">
                        1080p HD · SIH 26207
                      </span>
                    </div>

                    {/* Center Display: Glowing Play Button when Paused, or Dynamic Interactive Scene when Playing */}
                    {!isPlaying ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlaying(true);
                        }}
                        className="relative z-20 text-center space-y-3 max-w-md mx-auto my-auto p-4 sm:p-5 rounded-2xl bg-black/65 backdrop-blur-md border border-white/25 shadow-2xl hover:bg-black/75 hover:scale-[1.02] transition-all cursor-pointer"
                      >
                        <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center mx-auto shadow-2xl ring-4 ring-emerald-400/40 animate-pulse transition-all">
                          <Icon name="play" className="w-8 sm:w-9 h-8 sm:h-9 text-white translate-x-0.5" />
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
                            <span>▶ CLICK HERE TO PLAY</span>
                          </div>
                          <p className="text-xs text-white/90 leading-relaxed mt-2">
                            {currentTime === 0
                              ? "Start 3-minute interactive demonstration of MindMesh classroom telemetry."
                              : `Resume from ${formatDuration(currentTime)} (or click anywhere on screen)`}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Dynamic Scene Content based on currentTime */
                      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 sm:my-3">
                        {currentTime < 65 ? (
                          /* SCENE 1: The Problem (45 Students, 1 Teacher) */
                          <div className="w-full max-w-lg text-center space-y-2.5 animate-fade-in">
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                              ⚠️ 18 / 45 Students Falling Behind Invisibly
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-white">
                              The Overcrowded Classroom Bottleneck
                            </h4>

                            {/* Animated 45-Desk Matrix Simulation */}
                            <div className="grid grid-cols-9 gap-1.5 p-3 rounded-xl bg-black/40 border border-white/10 max-w-sm mx-auto">
                              {Array.from({ length: 45 }).map((_, idx) => {
                                const isStruggling = idx % 3 === 0;
                                const isFast = idx % 5 === 0;
                                return (
                                  <div
                                    key={idx}
                                    className={`h-4 rounded flex items-center justify-center text-[8px] font-bold transition-transform ${
                                      isStruggling
                                        ? "bg-rose-500 text-white animate-pulse"
                                        : isFast
                                        ? "bg-emerald-500 text-white"
                                        : "bg-amber-500 text-white"
                                    }`}
                                    title={`Student ${idx + 1}`}
                                  >
                                    {isStruggling ? "!" : isFast ? "★" : "·"}
                                  </div>
                                );
                              })}
                            </div>

                            <p className="text-[11px] text-white/80 italic max-w-sm mx-auto bg-black/30 p-2 rounded-lg border border-white/10">
                              &ldquo;One teacher cannot diagnose 45 different learning speeds in real-time without automated diagnostic telemetry.&rdquo;
                            </p>
                          </div>
                        ) : currentTime < 130 ? (
                          /* SCENE 2: AI Solution (Learning DNA & Offline PWA) */
                          <div className="w-full max-w-lg text-center space-y-2.5 animate-fade-in">
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-300 bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                              ⚡ 2-Minute Micro-Assessment Engine (Offline-First)
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-white">
                              Generating Real-Time Learning DNA
                            </h4>

                            {/* Simulated Assessment & DNA Bars */}
                            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left space-y-2 text-xs max-w-sm mx-auto">
                              <div className="flex justify-between items-center text-[10px] text-slate-300">
                                <span>Quiz: &quot;arr = [10, 20, 30]; arr[1]=?&quot;</span>
                                <span className="text-emerald-400 font-bold">✓ 20 (KC-002)</span>
                              </div>
                              <div className="space-y-1 text-[10px]">
                                <div className="flex justify-between">
                                  <span>KC-001 (Array Declaration)</span>
                                  <span className="text-emerald-400 font-bold">94%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                  <div className="w-[94%] h-full bg-emerald-400 rounded-full" />
                                </div>
                              </div>
                              <div className="space-y-1 text-[10px]">
                                <div className="flex justify-between">
                                  <span>KC-002 (Zero-Indexed Bounds)</span>
                                  <span className="text-rose-400 font-bold">45% (Needs Focus)</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                  <div className="w-[45%] h-full bg-rose-400 rounded-full" />
                                </div>
                              </div>
                            </div>

                            <p className="text-[11px] text-white/80 italic max-w-sm mx-auto bg-black/30 p-2 rounded-lg border border-white/10">
                              &ldquo;Constructs a multi-dimensional cognitive DNA profile with zero server latency even without school internet.&rdquo;
                            </p>
                          </div>
                        ) : (
                          /* SCENE 3: Intervention (Radar & Peer Pods) */
                          <div className="w-full max-w-lg text-center space-y-2.5 animate-fade-in">
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-300 bg-violet-500/20 px-2.5 py-0.5 rounded-full border border-violet-400/30">
                              🎯 Teacher Radar & Automated Peer Pods
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-white">
                              Closing the Gap Before the Bell Rings
                            </h4>

                            {/* Simulated Peer Pod & Radar Card */}
                            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left space-y-2 text-xs max-w-sm mx-auto">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sky-200">Pod #02 Formed:</span>
                                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                                  92% Recovery Rate
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs bg-white/10 p-2 rounded-lg">
                                <div>
                                  <p className="font-bold text-white">Aarav Patel (Mentor)</p>
                                  <p className="text-[10px] text-emerald-300">Mastery: 94%</p>
                                </div>
                                <span className="text-base">🤝</span>
                                <div>
                                  <p className="font-bold text-white">Rohan Gupta (Mentee)</p>
                                  <p className="text-[10px] text-rose-300">Mastery: 44%</p>
                                </div>
                              </div>
                            </div>

                            <p className="text-[11px] text-white/80 italic max-w-sm mx-auto bg-black/30 p-2 rounded-lg border border-white/10">
                              &ldquo;Teachers get instant radar alerts while high-achievers tutor struggling classmates in balanced peer pods.&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Controls & Timeline Bar */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-20 space-y-2 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/15"
                    >
                      {/* Clickable Scrubber Slider */}
                      <div className="relative flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="180"
                          value={currentTime}
                          onChange={(e) => {
                            setCurrentTime(Number(e.target.value));
                          }}
                          className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:accent-emerald-300"
                        />
                      </div>

                      {/* Control Buttons & Timestamp Row */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer ${
                              isPlaying
                                ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                                : "bg-emerald-500 hover:bg-emerald-400 text-white animate-pulse"
                            }`}
                            aria-label={isPlaying ? "Pause video" : "Play video"}
                          >
                            <Icon name={isPlaying ? "pause" : "play"} className="w-3.5 h-3.5" />
                            <span>{isPlaying ? "Pause" : "Play"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                            className="text-[11px] text-white/80 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                            title="Rewind 10 seconds"
                          >
                            -10s
                          </button>

                          <button
                            type="button"
                            onClick={() => setCurrentTime(Math.min(180, currentTime + 10))}
                            className="text-[11px] text-white/80 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                            title="Forward 10 seconds"
                          >
                            +10s
                          </button>

                          <span className="font-mono text-[11px] text-white/90">
                            {formatDuration(currentTime)} / 03:00
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const speeds = [1, 1.5, 2];
                              const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                              setPlaybackSpeed(speeds[nextIdx]);
                            }}
                            className="text-[10px] font-mono font-bold bg-white/15 px-2 py-0.5 rounded hover:bg-white/25 transition-colors cursor-pointer"
                          >
                            {playbackSpeed}x
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setCurrentTime(0);
                              setIsPlaying(true);
                            }}
                            className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 cursor-pointer"
                            title="Restart Walkthrough"
                          >
                            <Icon name="refresh" className="w-3 h-3" />
                            <span className="hidden sm:inline">Restart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3 Clickable Chapter Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("interactive");
                      jumpToChapter(0);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group ${
                      activeTab === "interactive" && currentTime < 65
                        ? "bg-sky-50/90 border-sky-300 ring-2 ring-sky-200/80 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:border-sky-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-extrabold text-sky-600 uppercase">
                        00:00 · The Problem
                      </p>
                      {activeTab === "interactive" && currentTime < 65 && isPlaying ? (
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                          Playing ▶
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 group-hover:text-sky-600">
                          Play ▶
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">45 Students, 1 Teacher</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Overcrowded classrooms and silent disengagement.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("interactive");
                      jumpToChapter(65);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group ${
                      activeTab === "interactive" && currentTime >= 65 && currentTime < 130
                        ? "bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-200/80 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-extrabold text-emerald-600 uppercase">
                        01:05 · AI Solution
                      </p>
                      {activeTab === "interactive" && currentTime >= 65 && currentTime < 130 && isPlaying ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Playing ▶
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-600">
                          Play ▶
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      Learning DNA & Offline PWA
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Knowledge component graphs and zero-latency caching.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("interactive");
                      jumpToChapter(130);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group ${
                      activeTab === "interactive" && currentTime >= 130
                        ? "bg-violet-50/90 border-violet-300 ring-2 ring-violet-200/80 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:border-violet-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-extrabold text-violet-600 uppercase">
                        02:10 · Intervention
                      </p>
                      {activeTab === "interactive" && currentTime >= 130 && isPlaying ? (
                        <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-1.5 py-0.5 rounded">
                          Playing ▶
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 group-hover:text-violet-600">
                          Play ▶
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">Radar & Peer Pods</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Automated student pairing and instant remediation.
                    </p>
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <p className="text-xs text-slate-500">
                  Prefer to try the actual app with real classroom data?
                </p>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDemoModal(false);
                      setIsPlaying(false);
                    }}
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