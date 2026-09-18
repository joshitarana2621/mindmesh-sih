"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InitialAvatar, ProgressBar } from "@/components/ui/progress";
import { Toaster, toast } from "@/components/ui/toast";

interface ChildProfile {
  id: string;
  name: string;
  grade: string;
  school: string;
  rollNo: string;
  avatarColor: string;
  weeklyReport: {
    weekRange: string;
    totalMinutes: number;
    targetMinutes: number;
    attendanceDays: number;
    totalSchoolDays: number;
    currentStreak: number;
    bestStreak: number;
    masteryScore: number;
    masteryDelta: number;
    summary: string;
    aiMentorNote: string;
    dailyActivity: Array<{
      day: string;
      date: string;
      minutes: number;
      completed: boolean;
      topicsCovered: number;
    }>;
    categoryBreakdown: Array<{
      name: string;
      minutes: number;
      percentage: number;
      color: string;
    }>;
  };
  topicsCompleted: Array<{
    code: string;
    title: string;
    subject: string;
    dateCompleted: string;
    mastery: number;
    difficulty: "Foundational" | "Intermediate" | "Advanced";
  }>;
  strengths: Array<{
    code: string;
    title: string;
    mastery: number;
    metric: string;
    parentTip: string;
  }>;
  weakAreas: Array<{
    code: string;
    title: string;
    mastery: number;
    gapPattern: string;
    classroomAction: string;
    severity: "Needs Attention" | "In Progress";
  }>;
  suggestedHomePractice: Array<{
    id: string;
    title: string;
    duration: string;
    type: "Offline / Hands-on" | "Interactive Digital" | "Conversation Starter";
    focusGap: string;
    description: string;
    instructions: string[];
    isCompleted?: boolean;
  }>;
}

const CHILDREN_DATA: ChildProfile[] = [
  {
    id: "child-1",
    name: "Aarav Patel",
    grade: "Class 8-B",
    school: "Kendriya Vidyalaya No. 1",
    rollNo: "Roll #14",
    avatarColor: "bg-violet-600",
    weeklyReport: {
      weekRange: "Sep 12 – Sep 18, 2026",
      totalMinutes: 285,
      targetMinutes: 250,
      attendanceDays: 5,
      totalSchoolDays: 5,
      currentStreak: 12,
      bestStreak: 18,
      masteryScore: 86,
      masteryDelta: 8,
      summary:
        "Aarav had an outstanding learning week! He exceeded his weekly learning target by 35 minutes and demonstrated strong mastery in foundational computer science concepts and linear data representations.",
      aiMentorNote:
        "Aarav excels with visual tactile feedback and grasps memory concepts quickly. His only friction point this week was index boundaries (starting at 0 instead of 1). Two low-stress 10-minute home games are recommended to solidify this without anxiety.",
      dailyActivity: [
        { day: "Mon", date: "Sep 12", minutes: 55, completed: true, topicsCovered: 2 },
        { day: "Tue", date: "Sep 13", minutes: 60, completed: true, topicsCovered: 1 },
        { day: "Wed", date: "Sep 14", minutes: 40, completed: true, topicsCovered: 1 },
        { day: "Thu", date: "Sep 15", minutes: 50, completed: true, topicsCovered: 2 },
        { day: "Fri", date: "Sep 16", minutes: 45, completed: true, topicsCovered: 1 },
        { day: "Sat", date: "Sep 17", minutes: 35, completed: true, topicsCovered: 1 },
        { day: "Sun", date: "Sep 18", minutes: 0, completed: false, topicsCovered: 0 },
      ],
      categoryBreakdown: [
        { name: "Adaptive Practice Quizzes", minutes: 140, percentage: 49, color: "bg-sky-500" },
        { name: "Remediation & Whiteboard Tracing", minutes: 95, percentage: 33, color: "bg-violet-500" },
        { name: "Peer Pod Learning & Discussions", minutes: 50, percentage: 18, color: "bg-emerald-500" },
      ],
    },
    topicsCompleted: [
      {
        code: "KC-001",
        title: "Array Declaration & Fixed Allocation",
        subject: "Computer Science",
        dateCompleted: "Sep 17, 2026",
        mastery: 0.94,
        difficulty: "Foundational",
      },
      {
        code: "KC-004",
        title: "Element Shifting & Dynamic Insertion",
        subject: "Computer Science",
        dateCompleted: "Sep 16, 2026",
        mastery: 0.88,
        difficulty: "Intermediate",
      },
      {
        code: "KC-007",
        title: "Linear Traversal & Counter Bounds",
        subject: "Mathematics & Logic",
        dateCompleted: "Sep 14, 2026",
        mastery: 0.82,
        difficulty: "Foundational",
      },
      {
        code: "KC-009",
        title: "Boolean Truth Logic & Conditional Paths",
        subject: "Computer Science",
        dateCompleted: "Sep 13, 2026",
        mastery: 0.91,
        difficulty: "Advanced",
      },
    ],
    strengths: [
      {
        code: "KC-001",
        title: "Memory Layout & Array Declaration",
        mastery: 0.94,
        metric: "100% accuracy on first attempt · 0.9s avg response",
        parentTip: "Aarav has exceptional spatial intuition for how computer memory reserves slots. Praise his logical clarity!",
      },
      {
        code: "KC-004",
        title: "Rightward Element Shifting",
        mastery: 0.88,
        metric: "5/5 scenario questions answered correctly",
        parentTip: "He easily visualizes step-by-step shifts. He served as a peer buddy this Friday helping a classmate.",
      },
      {
        code: "KC-009",
        title: "Logical Deductions & Truth Tables",
        mastery: 0.91,
        metric: "Mastery retained across 3 revision intervals",
        parentTip: "Strong deductive thinker. Encourage him to explain multi-step puzzles to younger family members.",
      },
    ],
    weakAreas: [
      {
        code: "KC-002",
        title: "Zero-Indexed Bounds & Offsets",
        mastery: 0.45,
        gapPattern: "Tends to query index [N] instead of [N-1] for the last element in a list.",
        classroomAction: "Teacher Roy assigned visual memory strips and a hands-on peer practice session.",
        severity: "Needs Attention",
      },
      {
        code: "KC-003",
        title: "Loop Termination Boundary Conditions",
        mastery: 0.62,
        gapPattern: "Occasionally mixes up '<' with '<=' when looping through elements.",
        classroomAction: "Adaptive practice set queued on Aarav's school tablet with step-by-step trace animations.",
        severity: "In Progress",
      },
    ],
    suggestedHomePractice: [
      {
        id: "hp-1",
        title: "The Index-Card Offset Game",
        duration: "10 mins",
        type: "Offline / Hands-on",
        focusGap: "KC-002: Zero-Indexed Arrays",
        description: "A fun screen-free tactile exercise using 5 household objects (cups, fruits, or playing cards).",
        instructions: [
          "Line up 5 cards on a table.",
          "Write numbers 0, 1, 2, 3, and 4 on small sticky notes and place them under each card.",
          "Ask Aarav: 'How many total cards are there?' (Answer: 5).",
          "Then ask: 'What number is under the very last card?' (Answer: 4, not 5!).",
          "Celebrate when he connects that 'Count starts at 1, but computers start at 0!'",
        ],
      },
      {
        id: "hp-2",
        title: "Boundary Detective: 5-Question Quick Check",
        duration: "8 mins",
        type: "Interactive Digital",
        focusGap: "KC-003: Loop Termination (< vs <=)",
        description: "A bite-sized interactive check you can run together on your phone or tablet.",
        instructions: [
          "Open the 5-question adaptive boundary challenge.",
          "Review the loop conditions together: for (let i = 0; i < 5; i++).",
          "Have Aarav predict the last number printed before pressing submit.",
          "Immediate visual feedback highlights the boundary without penalties.",
        ],
      },
      {
        id: "hp-3",
        title: "The Elevator Ground Floor Analogy",
        duration: "5 mins",
        type: "Conversation Starter",
        focusGap: "Conceptual Intuition",
        description: "A casual chat at dinner or during a walk linking everyday architecture to computer science.",
        instructions: [
          "Ask: 'When we take an elevator in our building or a mall, what is the ground level called?' (Floor 0 or G).",
          "Relate: 'The 1st floor above ground is actually the 2nd level you can walk on.'",
          "Show him that computer memory works exactly like building floors starting at Level 0!",
        ],
      },
    ],
  },
  {
    id: "child-2",
    name: "Ananya Patel",
    grade: "Class 6-A",
    school: "Kendriya Vidyalaya No. 1",
    rollNo: "Roll #08",
    avatarColor: "bg-teal-600",
    weeklyReport: {
      weekRange: "Sep 12 – Sep 18, 2026",
      totalMinutes: 210,
      targetMinutes: 200,
      attendanceDays: 5,
      totalSchoolDays: 5,
      currentStreak: 9,
      bestStreak: 14,
      masteryScore: 89,
      masteryDelta: 5,
      summary:
        "Ananya completed all her science modules ahead of schedule with 89% overall mastery. Her reading comprehension in environmental science remains her strongest asset.",
      aiMentorNote:
        "Ananya shows steady pacing and consistent evening study habits. Focus this week is on reinforcing fractions and numerical representations through practical cooking or measurement activities.",
      dailyActivity: [
        { day: "Mon", date: "Sep 12", minutes: 40, completed: true, topicsCovered: 1 },
        { day: "Tue", date: "Sep 13", minutes: 45, completed: true, topicsCovered: 2 },
        { day: "Wed", date: "Sep 14", minutes: 35, completed: true, topicsCovered: 1 },
        { day: "Thu", date: "Sep 15", minutes: 45, completed: true, topicsCovered: 1 },
        { day: "Fri", date: "Sep 16", minutes: 45, completed: true, topicsCovered: 2 },
        { day: "Sat", date: "Sep 17", minutes: 0, completed: false, topicsCovered: 0 },
        { day: "Sun", date: "Sep 18", minutes: 0, completed: false, topicsCovered: 0 },
      ],
      categoryBreakdown: [
        { name: "Science Visual Experiments", minutes: 110, percentage: 52, color: "bg-teal-500" },
        { name: "Mathematics Fractions Drills", minutes: 65, percentage: 31, color: "bg-sky-500" },
        { name: "Language & Reading", minutes: 35, percentage: 17, color: "bg-amber-500" },
      ],
    },
    topicsCompleted: [
      {
        code: "SCI-102",
        title: "Plant Photosynthesis & Chlorophyll",
        subject: "General Science",
        dateCompleted: "Sep 16, 2026",
        mastery: 0.95,
        difficulty: "Foundational",
      },
      {
        code: "MATH-204",
        title: "Equivalent Fractions on a Number Line",
        subject: "Mathematics",
        dateCompleted: "Sep 15, 2026",
        mastery: 0.84,
        difficulty: "Intermediate",
      },
      {
        code: "SCI-105",
        title: "The Water Cycle & Condensation",
        subject: "General Science",
        dateCompleted: "Sep 13, 2026",
        mastery: 0.92,
        difficulty: "Foundational",
      },
    ],
    strengths: [
      {
        code: "SCI-102",
        title: "Photosynthesis & Plant Biology",
        mastery: 0.95,
        metric: "100% score on diagram labelling",
        parentTip: "Ananya loves hands-on botanical observations. Consider nurturing a small potted plant together!",
      },
      {
        code: "SCI-105",
        title: "Water Cycle & Evaporation",
        mastery: 0.92,
        metric: "Top 5% in class quiz",
        parentTip: "High conceptual recall. She explained rainfall mechanics clearly in class discussions.",
      },
    ],
    weakAreas: [
      {
        code: "MATH-204",
        title: "Subtracting Unlike Fractions",
        mastery: 0.54,
        gapPattern: "Sometimes subtracts denominators directly instead of finding the Least Common Multiple (LCM).",
        classroomAction: "Teacher assigned fraction strip manipulatives during Thursday's math lab.",
        severity: "In Progress",
      },
    ],
    suggestedHomePractice: [
      {
        id: "hp-an-1",
        title: "The Kitchen Measuring Cup Challenge",
        duration: "10 mins",
        type: "Offline / Hands-on",
        focusGap: "MATH-204: Fractions & LCM",
        description: "Use water and kitchen measuring cups (1/2 cup, 1/4 cup, 1/8 cup) to visualize equivalent quantities.",
        instructions: [
          "Take a 1/2 measuring cup and two 1/4 cups.",
          "Pour two 1/4 cups into the 1/2 cup to show they match.",
          "Help Ananya see why denominators change when adding or subtracting unequal parts!",
        ],
      },
    ],
  },
];

export default function ParentDashboard() {
  const [selectedChildId, setSelectedChildId] = useState<string>("child-1");
  const [activePracticeModal, setActivePracticeModal] = useState<any | null>(null);
  const [completedPracticeIds, setCompletedPracticeIds] = useState<string[]>([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacherMessage, setTeacherMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const currentChild =
    CHILDREN_DATA.find((c) => c.id === selectedChildId) || CHILDREN_DATA[0];
  const { weeklyReport } = currentChild;

  const handleTogglePractice = (id: string, title: string) => {
    if (completedPracticeIds.includes(id)) {
      setCompletedPracticeIds(completedPracticeIds.filter((item) => item !== id));
      toast({
        title: "Marked as Incomplete",
        body: `"${title}" has been reset to pending.`,
        kind: "info",
      });
    } else {
      setCompletedPracticeIds([...completedPracticeIds, id]);
      toast({
        title: "Activity Completed! 🎉",
        body: `Great job practicing "${title}" with ${currentChild.name}.`,
        kind: "success",
      });
    }
  };

  const handleSendTeacherMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherMessage.trim() && !selectedTemplate) {
      toast({
        title: "Empty Message",
        body: "Please select a quick note or write your message.",
        kind: "alert",
      });
      return;
    }
    setShowTeacherModal(false);
    setTeacherMessage("");
    setSelectedTemplate("");
    toast({
      title: "Message Delivered to Teacher Roy",
      body: `Your note regarding ${currentChild.name}'s weekly progress has been forwarded to the school portal.`,
      kind: "success",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Weekly Report Prepared",
      body: `Downloading ${currentChild.name}'s PDF Report for ${weeklyReport.weekRange}...`,
      kind: "info",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Parent Portal Navigation Bar */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Portal Branding */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                E
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                    EduAdapt
                  </span>
                  <Badge variant="brand" className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
                    Parent Portal
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Family Learning Companion & Progress Insights
                </p>
              </div>
            </Link>

            {/* Mobile Child Switcher */}
            <div className="sm:hidden flex items-center">
              <select
                aria-label="Select Child"
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {CHILDREN_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.grade})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Child Switcher & Actions (Desktop) */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            {/* Child Selector Tabs */}
            <div className="hidden sm:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
              {CHILDREN_DATA.map((child) => {
                const isActive = child.id === selectedChildId;
                return (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <InitialAvatar name={child.name} className="w-5 h-5 text-[10px]" />
                    <span>{child.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                        isActive ? "bg-sky-50 text-sky-700" : "text-slate-400"
                      }`}
                    >
                      {child.grade}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              className="gap-1.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              <Icon name="chart" className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Download Report</span>
              <span className="md:hidden">Report</span>
            </Button>

            <Button
              variant="brand"
              size="sm"
              onClick={() => setShowTeacherModal(true)}
              className="gap-1.5 text-xs"
            >
              <Icon name="users" className="w-3.5 h-3.5" />
              <span>Contact Teacher</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Child Profile Card & Week Range Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3.5">
            <InitialAvatar
              name={currentChild.name}
              className="w-12 h-12 text-base font-extrabold shadow-sm ring-4 ring-sky-50"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {currentChild.name}
                </h1>
                <Badge variant="secondary" className="font-semibold text-xs">
                  {currentChild.grade}
                </Badge>
                <Badge variant="outline" className="text-[11px] text-slate-500">
                  {currentChild.rollNo}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {currentChild.school} · CBSE Curriculum
              </p>
            </div>
          </div>

          {/* Week Date Picker Display */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 self-start md:self-auto">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Icon name="clock" className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Current Reporting Period
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">
                {weeklyReport.weekRange}
              </p>
            </div>
            <Badge variant="success" className="ml-2 text-[10px] py-0.5">
              Synced Today
            </Badge>
          </div>
        </div>

        {/* SECTION 1: Weekly Learning Report Hero Card */}
        <section aria-labelledby="weekly-report-heading">
          <div className="bg-brand rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden animate-fade-up">
            {/* Subtle decorative glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

            <div className="relative space-y-6">
              {/* Header inside hero */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center font-bold shrink-0">
                    <Icon name="sparkles" className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        id="weekly-report-heading"
                        className="text-lg sm:text-xl font-black text-white tracking-tight"
                      >
                        Weekly Learning Report
                      </h2>
                      <span className="text-[10px] font-bold bg-white/20 border border-white/30 text-sky-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Week 38 Summary
                      </span>
                    </div>
                    <p className="text-xs text-sky-100/80 mt-0.5">
                      AI pedagogical diagnostics generated from classroom quizzes and kiosk practice
                    </p>
                  </div>
                </div>

                {/* Overall Mastery Delta Pill */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2 self-start sm:self-auto">
                  <div>
                    <p className="text-[10px] text-sky-200 uppercase font-semibold">Weekly Progress</p>
                    <p className="text-base font-extrabold text-white">
                      {weeklyReport.masteryScore}%{" "}
                      <span className="text-emerald-300 text-xs font-bold">
                        (+{weeklyReport.masteryDelta}% vs last wk)
                      </span>
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-bold">
                    <Icon name="check" className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Weekly Executive Summary */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/15">
                <p className="text-sm sm:text-base text-white/95 leading-relaxed font-normal">
                  {weeklyReport.summary}
                </p>
              </div>

              {/* AI Mentor Parent Guidance Note */}
              <div className="bg-sky-950/40 border border-sky-400/30 rounded-xl p-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="brain" className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-bold text-amber-200 flex items-center gap-1.5">
                    <span>AI Parent Coach Tip</span>
                    <span className="text-[10px] text-sky-200 font-normal">
                      · Personalized for {currentChild.name}
                    </span>
                  </p>
                  <p className="text-sky-100/90 leading-relaxed font-normal">
                    {weeklyReport.aiMentorNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Top Telemetry Metrics (Total Minutes, Topics Completed, Attendance, Streak) */}
        <section aria-labelledby="telemetry-metrics-heading">
          <h2 id="telemetry-metrics-heading" className="sr-only">
            Weekly Key Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Metric 1: Total Learning Minutes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-hover flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Icon name="clock" className="w-5 h-5" />
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    114% of Goal
                  </Badge>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {weeklyReport.totalMinutes}{" "}
                  <span className="text-sm font-semibold text-slate-400">mins</span>
                </div>
                <p className="text-xs font-bold text-slate-600 mt-1">Total Learning Minutes</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Target: {weeklyReport.targetMinutes}m · Avg {Math.round(weeklyReport.totalMinutes / 7)} mins/day
                </p>
              </div>

              {/* Progress bar to target */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium mb-1.5">
                  <span>Weekly Goal</span>
                  <span className="font-bold text-sky-600">
                    {weeklyReport.totalMinutes} / {weeklyReport.targetMinutes} mins
                  </span>
                </div>
                <ProgressBar
                  value={weeklyReport.totalMinutes / weeklyReport.targetMinutes}
                  barClassName="bg-sky-500"
                />
              </div>
            </div>

            {/* Metric 2: Topics Completed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-hover flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                    <Icon name="check" className="w-5 h-5" />
                  </div>
                  <Badge variant="brand" className="text-[10px]">
                    +4 This Week
                  </Badge>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {currentChild.topicsCompleted.length}{" "}
                  <span className="text-sm font-semibold text-slate-400">topics</span>
                </div>
                <p className="text-xs font-bold text-slate-600 mt-1">Topics Completed</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  18 / 24 Term-1 modules verified (75%)
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium mb-1.5">
                  <span>Term 1 Syllabus</span>
                  <span className="font-bold text-violet-600">75% Complete</span>
                </div>
                <ProgressBar value={0.75} barClassName="bg-violet-600" />
              </div>
            </div>

            {/* Metric 3: Classroom Attendance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-hover flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Icon name="users" className="w-5 h-5" />
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Perfect Attendance
                  </Badge>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {weeklyReport.attendanceDays} / {weeklyReport.totalSchoolDays}
                </div>
                <p className="text-xs font-bold text-slate-600 mt-1">Classroom Attendance</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  5 of 5 days active in school kiosk & class
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Punctuality Rate
                </span>
                <span className="font-bold text-emerald-600">100%</span>
              </div>
            </div>

            {/* Metric 4: Daily Learning Streak */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-hover flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Icon name="zap" className="w-5 h-5" />
                  </div>
                  <Badge variant="warning" className="text-[10px]">
                    🔥 Hot Streak
                  </Badge>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {weeklyReport.currentStreak}{" "}
                  <span className="text-sm font-semibold text-slate-400">days</span>
                </div>
                <p className="text-xs font-bold text-slate-600 mt-1">Learning Streak</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Personal best: {weeklyReport.bestStreak} days · 2 days to milestone
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Streak Protection:</span>
                <span className="font-bold text-amber-600">Active (Shielded)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Weekly Activity Calendar & Time Breakdown */}
        <section aria-labelledby="activity-streak-heading">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Activity & Streak Calendar (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <div>
                  <h3
                    id="activity-streak-heading"
                    className="text-base font-extrabold text-slate-900 flex items-center gap-2"
                  >
                    <Icon name="chart" className="w-4 h-4 text-sky-600" />
                    Daily Learning Activity & Streak Calendar
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Minutes spent learning each day across school kiosk and home practice
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>Goal Achieved</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 ml-2" />
                  <span>Rest Day</span>
                </div>
              </div>

              {/* 7-Day Visual Bar Grid */}
              <div className="grid grid-cols-7 gap-2 sm:gap-3 py-2">
                {weeklyReport.dailyActivity.map((day) => {
                  const maxMins = 65;
                  const barHeightPct = day.minutes > 0 ? Math.max(18, (day.minutes / maxMins) * 100) : 6;
                  return (
                    <div
                      key={day.day}
                      className="flex flex-col items-center justify-end p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/50 transition-all text-center group"
                    >
                      {/* Tooltip on hover */}
                      <span className="text-[11px] font-extrabold text-slate-700 mb-1 opacity-80 group-hover:opacity-100 group-hover:text-sky-600">
                        {day.minutes > 0 ? `${day.minutes}m` : "—"}
                      </span>

                      {/* Bar Representation */}
                      <div className="w-full bg-slate-200/80 rounded-lg h-24 flex items-end justify-center p-1">
                        <div
                          className={`w-full rounded-md transition-all duration-500 ${
                            day.completed
                              ? "bg-gradient-to-t from-sky-600 to-teal-400 group-hover:brightness-105"
                              : "bg-slate-300"
                          }`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>

                      {/* Day Label & Date */}
                      <div className="mt-2 text-center">
                        <p className="text-xs font-bold text-slate-800">{day.day}</p>
                        <p className="text-[10px] text-slate-400">{day.date.split(" ")[1]}</p>
                      </div>

                      {/* Status Icon */}
                      <div className="mt-1.5">
                        {day.completed ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">
                            ·
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Kiosk & Offline Blended Learning Status Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    School Device Sync: <strong>Offline Kiosk Station #03</strong> (Synced 14m ago)
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  All completed offline quiz sessions safely recorded in local storage & synced.
                </div>
              </div>
            </div>

            {/* Learning Category Breakdown (1 Col) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Icon name="target" className="w-4 h-4 text-violet-600" />
                  Time Allocation
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  How {currentChild.name} spends his 285 learning minutes
                </p>

                <div className="space-y-4 mt-6">
                  {weeklyReport.categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{cat.name}</span>
                        <span className="font-bold text-slate-900">
                          {cat.minutes}m{" "}
                          <span className="text-[11px] text-slate-400 font-normal">
                            ({cat.percentage}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${cat.color}`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parent Engagement Insight Card */}
              <div className="mt-6 bg-violet-50/70 border border-violet-100 rounded-xl p-3.5 text-xs text-violet-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-violet-950">
                  <Icon name="sparkles" className="w-3.5 h-3.5 text-violet-600" />
                  Balanced Learning Diet
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Healthy 49% ratio of self-assessment to conceptual practice, preventing cognitive overload.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Topics Completed This Week */}
        <section aria-labelledby="topics-completed-heading">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3
                  id="topics-completed-heading"
                  className="text-base font-extrabold text-slate-900 flex items-center gap-2"
                >
                  <Icon name="book" className="w-4 h-4 text-emerald-600" />
                  Topics Completed This Week ({currentChild.topicsCompleted.length})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Competencies verified through classroom micro-assessments and peer pod activities
                </p>
              </div>
              <Badge variant="outline" className="text-xs self-start sm:self-auto">
                CBSE Grade 8 Term 1
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentChild.topicsCompleted.map((topic) => (
                <div
                  key={topic.code}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-emerald-200 transition-all card-hover space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md uppercase">
                          {topic.code}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {topic.subject}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{topic.title}</h4>
                    </div>
                    <Badge
                      variant={
                        topic.difficulty === "Advanced"
                          ? "brand"
                          : topic.difficulty === "Intermediate"
                          ? "info"
                          : "secondary"
                      }
                      className="text-[10px] shrink-0"
                    >
                      {topic.difficulty}
                    </Badge>
                  </div>

                  {/* Progress & Mastery */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium text-[11px]">
                        Mastery Score: <strong className="text-emerald-700">{Math.round(topic.mastery * 100)}%</strong>
                      </span>
                      <span className="text-slate-400 text-[10px]">{topic.dateCompleted}</span>
                    </div>
                    <ProgressBar value={topic.mastery} barClassName="bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: Strengths & Weak Areas (Diagnostic Cards) */}
        <section aria-labelledby="strengths-weaknesses-heading">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Strengths */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Icon name="check" className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Validated Strengths</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Concepts where {currentChild.name} demonstrates high fluency
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">High Mastery (85%+)</Badge>
                </div>

                <div className="space-y-4">
                  {currentChild.strengths.map((item) => (
                    <div
                      key={item.code}
                      className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {item.title}
                        </h4>
                        <span className="text-xs font-black text-emerald-700">
                          {Math.round(item.mastery * 100)}%
                        </span>
                      </div>
                      <ProgressBar value={item.mastery} barClassName="bg-emerald-500" />
                      <p className="text-[11px] text-emerald-800/80 font-medium">
                        {item.metric}
                      </p>
                      <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-emerald-100/60">
                        💡 <strong>Parent Note:</strong> {item.parentTip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Retention status: <strong className="text-emerald-600">Stable</strong></span>
                <span className="text-slate-400">Class percentile: Top 15%</span>
              </div>
            </div>

            {/* Card 2: Weak Areas / Growth Focus */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Icon name="alert" className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Growth Areas (Needs Focus)</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Identified misconceptions undergoing targeted support
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive">Targeted Gaps</Badge>
                </div>

                <div className="space-y-4">
                  {currentChild.weakAreas.map((item) => (
                    <div
                      key={item.code}
                      className="p-3.5 rounded-xl bg-rose-50/40 border border-rose-100 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          {item.title}
                        </h4>
                        <Badge
                          variant={item.severity === "Needs Attention" ? "destructive" : "warning"}
                          className="text-[10px]"
                        >
                          {item.severity}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[11px] text-slate-500 font-medium">Current Fluency</span>
                          <span className="font-bold text-rose-600">
                            {Math.round(item.mastery * 100)}%
                          </span>
                        </div>
                        <ProgressBar
                          value={item.mastery}
                          barClassName={item.mastery < 0.5 ? "bg-rose-500" : "bg-amber-500"}
                        />
                      </div>

                      {/* Error Pattern Diagnosis */}
                      <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-rose-100 space-y-1">
                        <p className="text-rose-900 font-bold text-[11px]">
                          ⚠️ Identified Misconception:
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.gapPattern}
                        </p>
                      </div>

                      {/* School Action */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Icon name="grad" className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span><strong>School Action:</strong> {item.classroomAction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Support Mode: <strong className="text-rose-600">Active Remediation</strong></span>
                <span className="text-slate-400">Next check: Tuesday</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Suggested Home Practice (Actionable Parent Activities) */}
        <section aria-labelledby="home-practice-heading">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Icon name="sparkles" className="w-4 h-4" />
                  </div>
                  <h3
                    id="home-practice-heading"
                    className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight"
                  >
                    Suggested Home Practice
                  </h3>
                  <Badge variant="warning" className="text-[10px]">
                    No-Stress Activities
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Parent-guided offline and digital activities crafted by AI to resolve {currentChild.name}&apos;s exact weak areas
                </p>
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Completed:{" "}
                <strong className="text-emerald-600">
                  {completedPracticeIds.length} / {currentChild.suggestedHomePractice.length}
                </strong>
              </div>
            </div>

            {/* Practice Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {currentChild.suggestedHomePractice.map((practice) => {
                const isCompleted = completedPracticeIds.includes(practice.id);
                return (
                  <div
                    key={practice.id}
                    className={`rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-4 card-hover ${
                      isCompleted
                        ? "bg-emerald-50/40 border-emerald-200 shadow-none"
                        : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant={
                            practice.type === "Offline / Hands-on"
                              ? "brand"
                              : practice.type === "Interactive Digital"
                              ? "info"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {practice.type}
                        </Badge>
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Icon name="clock" className="w-3 h-3 text-slate-400" />
                          {practice.duration}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{practice.title}</h4>
                        <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                          Target: {practice.focusGap}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {practice.description}
                      </p>
                    </div>

                    {/* Action buttons inside card */}
                    <div className="pt-3 border-t border-slate-100/80 space-y-2">
                      <Button
                        variant={isCompleted ? "outline" : "brand"}
                        size="sm"
                        className="w-full text-xs gap-1.5 justify-center py-2"
                        onClick={() => handleTogglePractice(practice.id, practice.title)}
                      >
                        <Icon
                          name={isCompleted ? "check" : "target"}
                          className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-600" : ""}`}
                        />
                        {isCompleted ? "Marked Done ✓" : "Mark as Completed"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-slate-500 hover:text-slate-800"
                        onClick={() => setActivePracticeModal(practice)}
                      >
                        View Step-by-Step Guide
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 7: Quick Teacher Contact & School Feedback Ribbon */}
        <section aria-labelledby="school-collaboration-heading">
          <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-bold shrink-0">
                <Icon name="users" className="w-6 h-6 text-sky-300" />
              </div>
              <div>
                <h3 id="school-collaboration-heading" className="text-base sm:text-lg font-extrabold">
                  Have questions about {currentChild.name}&apos;s learning path?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Mrs. S. Roy (Computer Science & Math Mentor) is available for questions or feedback.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowTeacherModal(true)}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shrink-0 px-5 py-2.5 shadow-sm"
            >
              Send Note to Teacher
            </Button>
          </div>
        </section>
      </main>

      {/* MODAL 1: Home Practice Instructions Modal */}
      {activePracticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="brand" className="text-[10px] mb-1">
                  {activePracticeModal.type} · {activePracticeModal.duration}
                </Badge>
                <h3 className="text-lg font-black text-slate-900">{activePracticeModal.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Focus: {activePracticeModal.focusGap}
                </p>
              </div>
              <button
                onClick={() => setActivePracticeModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              {activePracticeModal.description}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Step-by-Step Instructions:
              </h4>
              <div className="space-y-2">
                {activePracticeModal.instructions.map((inst: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100"
                  >
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-extrabold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePracticeModal(null)}
                className="text-xs"
              >
                Close Guide
              </Button>
              <Button
                variant="brand"
                size="sm"
                onClick={() => {
                  handleTogglePractice(activePracticeModal.id, activePracticeModal.title);
                  setActivePracticeModal(null);
                }}
                className="text-xs"
              >
                {completedPracticeIds.includes(activePracticeModal.id)
                  ? "Marked Done ✓"
                  : "Mark Completed"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Message Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Message Teacher Roy</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regarding {currentChild.name} · {currentChild.grade}
                </p>
              </div>
              <button
                onClick={() => setShowTeacherModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Quick Select Topic:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  "Aarav loved today's hands-on array exercise!",
                  "We practiced zero-indexed offsets at home this evening.",
                  "Request extra practice drill on loop conditions.",
                ].map((tmpl) => (
                  <button
                    key={tmpl}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tmpl);
                      setTeacherMessage(tmpl);
                    }}
                    className={`text-left text-xs p-2.5 rounded-xl border transition-all ${
                      selectedTemplate === tmpl
                        ? "bg-sky-50 border-sky-300 text-sky-900 font-semibold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"
                    }`}
                  >
                    💬 {tmpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom note textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Personal Note / Feedback:
              </label>
              <textarea
                rows={3}
                value={teacherMessage}
                onChange={(e) => setTeacherMessage(e.target.value)}
                placeholder="Write your note here..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none text-slate-800"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTeacherModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="brand"
                size="sm"
                onClick={handleSendTeacherMessage}
                className="text-xs gap-1.5"
              >
                <Icon name="check" className="w-3.5 h-3.5" />
                Send Note
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive Toaster */}
      <Toaster />
    </div>
  );
}
