"use client";
import { useEffect, useState } from "react";
import { useQuizStore } from "@/stores/quiz-store";
import { getQuizPackage, saveQuizPackage, saveAttempt, saveAnswer, getDeviceId } from "@/lib/indexeddb";
import { api } from "@/lib/api";
import { useKioskStore } from "@/stores/kiosk-store";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
interface QuizQuestion { id: string; text: string; options: Array<{ id: string; text: string; isCorrect: boolean }>; kcCodes: string[]; }
const OFFLINE_QUIZ: QuizQuestion[] = [
  { id: "off-q1", text: "Given arr = [10, 20, 30], what is arr[1]?", options: [{ id: "a", text: "10", isCorrect: false }, { id: "b", text: "20", isCorrect: true }, { id: "c", text: "30", isCorrect: false }], kcCodes: ["KC-002"] },
  { id: "off-q2", text: "Which code declares an array in JavaScript?", options: [{ id: "a", text: "let arr = []", isCorrect: true }, { id: "b", text: "let arr = {}", isCorrect: false }, { id: "c", text: "let arr = ()", isCorrect: false }], kcCodes: ["KC-001"] },
  { id: "off-q3", text: "What is the index of the LAST element in arr = [5, 10, 15]?", options: [{ id: "a", text: "3", isCorrect: false }, { id: "b", text: "2", isCorrect: true }, { id: "c", text: "1", isCorrect: false }], kcCodes: ["KC-002"] },
  { id: "off-q4", text: "Which loop is best for traversing an array?", options: [{ id: "a", text: "for (let i = 0; i < arr.length; i++)", isCorrect: true }, { id: "b", text: "while (true) {}", isCorrect: false }, { id: "c", text: "if (arr) {}", isCorrect: false }], kcCodes: ["KC-003"] },
];
export default function QuizPage() {
  const quiz = useQuizStore();
  const kioskProfile = useKioskStore(s => s.currentProfile);
  const auth = useAuthStore();
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: number; total: number } | null>(null);
  useEffect(() => { setLoaded(true); }, []);
  const start = async () => {
    const attemptId = crypto.randomUUID();
    const namespace = kioskProfile?.profileNamespace || auth.userId || "default";
    const questions = OFFLINE_QUIZ;
    await saveAttempt({ attemptId, namespace, quizId: "offline-array-quiz", status: "STARTED", startedAt: new Date().toISOString() });
    await saveQuizPackage({ packageId: "offline-array-quiz", version: 1, quizId: "offline-array-quiz", data: questions, downloadedAt: new Date().toISOString() });
    quiz.startQuiz(attemptId, "offline-array-quiz", questions);
    setStarted(true);
    try {
      const res = await api<{ id: string }>("/api/v1/quizzes/offline-array-quiz/start", { method: "POST", body: { deviceId: getDeviceId(), profileNamespace: namespace } });
      if (res?.id) quiz.startQuiz(res.id, "offline-array-quiz", questions);
    } catch { }
  };
  const answer = (qid: string, ans: string, correct: boolean) => {
    quiz.answerQuestion(qid, ans);
    if (quiz.attemptId) {
      saveAnswer({ key: `${quiz.attemptId}:${qid}`, attemptId: quiz.attemptId!, questionId: qid, answer: ans, isCorrect: correct, latencyMs: 0, attemptNumber: 1, answerChangeCount: 0, submittedAt: new Date().toISOString() });
    }
  };
  const complete = () => {
    const qs = quiz.questions;
    let correct = 0;
    for (const q of qs) {
      const a = quiz.answers[q.id];
      if (a) { const opt = q.options.find(o => o.text === a.answer); if (opt?.isCorrect) correct++; }
    }
    const score = correct / qs.length;
    quiz.completeQuiz(score);
    setResult({ score, correct, total: qs.length });
    try {
      api("/api/v1/quizzes/offline-array-quiz/submit", { method: "POST", body: { answers: qs.map(q => ({ questionId: q.id, questionVersionId: q.id, answer: quiz.answers[q.id]?.answer || "", startedAt: quiz.answers[q.id]?.startedAt || new Date().toISOString(), submittedAt: new Date().toISOString(), latencyMs: quiz.answers[q.id]?.latencyMs || 0, attemptNumber: 1, answerChangeCount: quiz.answers[q.id]?.changeCount || 0 })), networkState: navigator.onLine ? "online" : "offline" } });
    } catch { }
  };
  if (!loaded) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>;
  if (!started && !result) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center relative animate-fade-up">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-brand text-white flex items-center justify-center shadow-lg shadow-violet-500/40"><Icon name="zap" className="w-8 h-8" /></div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-4">Arrays Quick Check</h1>
        <div className="flex justify-center gap-3 mt-3 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1"><Icon name="target" className="w-3.5 h-3.5" /> 4 questions</span>
          <span className="flex items-center gap-1"><Icon name="clock" className="w-3.5 h-3.5" /> ~2 minutes</span>
          <span className="flex items-center gap-1"><Icon name="offline" className="w-3.5 h-3.5" /> Works offline</span>
        </div>
        <div className="mt-6 bg-brand-soft border border-violet-200/60 rounded-xl p-4 text-left text-sm text-slate-700">
          <p className="font-bold text-violet-700 mb-1 flex items-center gap-1.5"><Icon name="brain" className="w-4 h-4" /> This assessment finds your learning gap</p>
          <p className="text-slate-500">After completing, we'll tell you which topics you understand and which need more practice — then give you a personalized learning path.</p>
        </div>
        <Button className="w-full mt-6" size="lg" variant="brand" onClick={start}>Start Assessment <Icon name="arrowRight" className="w-4 h-4" /></Button>
        <div className="mt-3"><Link href="/kiosk" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-violet-600 transition-colors"><Icon name="arrowLeft" className="w-4 h-4" /> Back</Link></div>
      </div>
    </div>
  );
  if (result) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full relative animate-fade-up">
        <div className="text-center">
          <div className={cn("relative w-28 h-28 rounded-full mx-auto flex items-center justify-center", result.score >= 0.8 ? "bg-emerald-50" : result.score >= 0.5 ? "bg-amber-50" : "bg-rose-50")}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" className="stroke-slate-100" />
              <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" strokeLinecap="round"
                stroke={result.score >= 0.8 ? "#10b981" : result.score >= 0.5 ? "#f59e0b" : "#f43f5e"}
                strokeDasharray={`${result.score * 2 * Math.PI * 44} ${2 * Math.PI * 44}`} />
            </svg>
            <span className={cn("relative text-2xl font-extrabold", result.score >= 0.8 ? "text-emerald-600" : result.score >= 0.5 ? "text-amber-600" : "text-rose-600")}>{Math.round(result.score * 100)}%</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-4">Assessment Complete!</h2>
          <p className="text-slate-500 mt-1">You got {result.correct} of {result.total} correct</p>
        </div>
        <div className="mt-6 space-y-2.5">
          {quiz.questions.map(q => {
            const a = quiz.answers[q.id]; const opt = a ? q.options.find(o => o.text === a.answer) : null; const correct = !!opt?.isCorrect;
            return (
              <div key={q.id} className={cn("border rounded-xl p-3.5 text-sm", correct ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50")}>
                <p className="font-semibold text-slate-800">{q.text}</p>
                <p className={cn("mt-1 text-xs font-medium", correct ? "text-emerald-600" : "text-rose-600")}>{correct ? "✓ Correct" : `✗ Your answer: ${a?.answer || "none"} · KCs: ${q.kcCodes.join(", ")}`}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => { quiz.reset(); setResult(null); setStarted(false); }}>Retake</Button>
          <Button variant="brand" onClick={() => { window.location.href = "/kiosk"; }}>Continue</Button>
        </div>
      </div>
    </div>
  );
  const q = quiz.questions[quiz.currentIndex];
  if (!q) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading quiz…</div>;
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1.5">{quiz.questions.map((_, i) => <div key={i} className={cn("h-2 w-7 rounded-full transition-colors", i < quiz.currentIndex ? "bg-violet-500" : i === quiz.currentIndex ? "bg-violet-300" : "bg-slate-200")} />)}</div>
          <span className="text-sm text-slate-400 font-semibold">{quiz.currentIndex + 1}/{quiz.questions.length}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200 text-[10px] font-bold uppercase tracking-wide">Micro-assessment</span>
          {q.kcCodes.map(kc => <span key={kc} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">{kc}</span>)}
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-5">{q.text}</h2>
        <div className="space-y-3">
          {q.options.map(o => {
            const picked = quiz.answers[q.id]?.answer === o.text;
            return (
              <button key={o.id} onClick={() => answer(q.id, o.text, o.isCorrect)} className={cn("w-full text-left border-2 rounded-xl p-4 text-sm font-medium transition-all", picked ? "border-violet-500 bg-violet-50 text-violet-900 shadow-sm" : "border-slate-200 hover:border-violet-300 hover:bg-slate-50 text-slate-700")}>
                <span className="flex items-center gap-3"><span className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0", picked ? "border-violet-500 bg-violet-500 text-white" : "border-slate-300 text-slate-400")}>{picked ? "✓" : String.fromCharCode(65 + o.id.charCodeAt(0) - 97)}</span>{o.text}</span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-7">
          <Button variant="ghost" onClick={quiz.prevQuestion} disabled={quiz.currentIndex === 0} className="gap-1.5"><Icon name="arrowLeft" className="w-4 h-4" /> Previous</Button>
          {quiz.currentIndex < quiz.questions.length - 1 ? <Button onClick={quiz.nextQuestion} className="gap-1.5 bg-violet-600 hover:bg-violet-700">Next <Icon name="arrowRight" className="w-4 h-4" /></Button> : <Button onClick={complete} className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"><Icon name="check" className="w-4 h-4" /> Finish Quiz</Button>}
        </div>
      </div>
    </div>
  );
}