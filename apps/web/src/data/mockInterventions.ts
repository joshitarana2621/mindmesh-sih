// DEMO CLASS — SIMULATED DATA
// Central Intervention Registry
// 100% Deterministic — Zero Math.random()

export type InterventionType =
  | "PEER_POD"
  | "REMEDIAL_PRACTICE"
  | "TEACHER_1ON1"
  | "INTERACTIVE_SIMULATION";

export type InterventionStatus = "pending" | "in-progress" | "completed";

export type InterventionPriority = "HIGH" | "MEDIUM" | "LOW";

export interface MockIntervention {
  id: string;
  studentId: string;
  studentName: string;
  type: InterventionType;
  reason: string;
  knowledgeComponent: string;
  kcCode: string;
  misconceptionCode?: string;
  recommendedActivity: string;
  status: InterventionStatus;
  date: string;
  expectedOutcome: string;
  priority: InterventionPriority;
  peerBuddy?: string;
  notes?: string;
}

export const INITIAL_INTERVENTIONS: MockIntervention[] = [
  {
    id: "int-01",
    studentId: "st-03",
    studentName: "Rohan Gupta",
    type: "PEER_POD",
    reason: "Compares fractions using numerator only (ignores denominators)",
    knowledgeComponent: "KC-FRAC-03 (Comparing Fractions)",
    kcCode: "KC-FRAC-03",
    misconceptionCode: "MISC-FRAC-04",
    recommendedActivity: "Double number-line visualization comparing fractions with common denominators",
    status: "pending",
    date: "2026-09-18",
    expectedOutcome: "Mastery improvement on unlike-denominator ordering from 44% to 75%",
    priority: "HIGH",
    peerBuddy: "Aarav Patel (Mentor - 94% Mastery)",
    notes: "Aarav will guide Rohan through 5 visual fraction-card comparison drills.",
  },
  {
    id: "int-02",
    studentId: "st-05",
    studentName: "Kabir Singh",
    type: "TEACHER_1ON1",
    reason: "Applies addition instead of multiplication in proportional reasoning (additive scaling error)",
    knowledgeComponent: "KC-RAT-02 (Proportions & Scaling)",
    kcCode: "KC-RAT-02",
    misconceptionCode: "MISC-RAT-02",
    recommendedActivity: "3-minute ratio table walkthrough demonstrating constant multiplier across rows",
    status: "in-progress",
    date: "2026-09-17",
    expectedOutcome: "Elimination of additive scaling error; mastery threshold >= 70%",
    priority: "HIGH",
    notes: "Teacher station small-group demo scheduled for Period 2.",
  },
  {
    id: "int-03",
    studentId: "st-02",
    studentName: "Diya Sharma",
    type: "REMEDIAL_PRACTICE",
    reason: "Confuses decimal place values: occasionally treats 0.25 as larger than 0.7",
    knowledgeComponent: "KC-DEC-02 (Decimal Comparison)",
    kcCode: "KC-DEC-02",
    misconceptionCode: "MISC-DEC-02",
    recommendedActivity: "Zero-padding grid practice (comparing 0.70 vs 0.25) with place-value chips",
    status: "completed",
    date: "2026-09-15",
    expectedOutcome: "Solidified place value comparison to >= 85%",
    priority: "MEDIUM",
    peerBuddy: "Meera Nair (Mentor)",
    notes: "Completed 10 micro-drill questions with 90% post-test accuracy.",
  },
  {
    id: "int-04",
    studentId: "st-04",
    studentName: "Ananya Rao",
    type: "INTERACTIVE_SIMULATION",
    reason: "Loop termination boundary error: uses '<=' instead of '<' in traversal loops",
    knowledgeComponent: "KC-003 (Loop Traversal & Iteration Limits)",
    kcCode: "KC-003",
    misconceptionCode: "MISC-CS-03",
    recommendedActivity: "Interactive step-by-step array index simulation with memory out-of-bounds trigger",
    status: "in-progress",
    date: "2026-09-18",
    expectedOutcome: "Consistent correct loop boundary selection across traversal algorithms",
    priority: "MEDIUM",
    peerBuddy: "Diya Sharma (Mentor)",
  },
  {
    id: "int-05",
    studentId: "st-36",
    studentName: "Sahil Chawla",
    type: "TEACHER_1ON1",
    reason: "Severe prerequisite breakdown across fractions and simple equations; repeated guessing",
    knowledgeComponent: "KC-ALG-03 (Simple Linear Equations)",
    kcCode: "KC-ALG-03",
    misconceptionCode: "MISC-ALG-03",
    recommendedActivity: "Direct balance-scale manipulation: inverse operations on both sides simultaneously",
    status: "pending",
    date: "2026-09-18",
    expectedOutcome: "Raise baseline algebra confidence above 50% without anxiety",
    priority: "HIGH",
    notes: "Requires foundational review of negative numbers and inverse operations.",
  },
  {
    id: "int-06",
    studentId: "st-43",
    studentName: "Karthik Subramanian",
    type: "REMEDIAL_PRACTICE",
    reason: "Rapid performance decline over last 2 weeks: accuracy dropped from 84% to 58%",
    knowledgeComponent: "KC-FRAC-04 (Fraction Operations)",
    kcCode: "KC-FRAC-04",
    misconceptionCode: "MISC-FRAC-05",
    recommendedActivity: "Re-engage foundational fraction strip addition module; check attendance and pacing",
    status: "pending",
    date: "2026-09-19",
    expectedOutcome: "Diagnose root cause of drop and restore mastery to previous baseline (>80%)",
    priority: "HIGH",
    notes: "Missed 3 days due to mild illness; backlog remediation assigned.",
  },
  {
    id: "int-07",
    studentId: "st-37",
    studentName: "Aditi Pandey",
    type: "PEER_POD",
    reason: "Direct denominator addition error (e.g. 1/3 + 1/4 = 2/7)",
    knowledgeComponent: "KC-FRAC-04 (Fraction Operations)",
    kcCode: "KC-FRAC-04",
    misconceptionCode: "MISC-FRAC-05",
    recommendedActivity: "Peer teach-back with fraction tiles showing common denominator necessity",
    status: "pending",
    date: "2026-09-18",
    expectedOutcome: "Elimination of denominator addition misconception",
    priority: "HIGH",
    peerBuddy: "Vikram Malhotra (Mentor - 91% Mastery)",
  },
  {
    id: "int-08",
    studentId: "st-38",
    studentName: "Manan Shah",
    type: "TEACHER_1ON1",
    reason: "Zero-indexing confusion: repeatedly accesses index arr.length, crashing evaluations",
    knowledgeComponent: "KC-002 (Zero-Indexed Bounds & Off-by-One)",
    kcCode: "KC-002",
    misconceptionCode: "MISC-CS-02",
    recommendedActivity: "Physical index pointer card exercise with numbered boxes 0 through N-1",
    status: "in-progress",
    date: "2026-09-17",
    expectedOutcome: "100% accuracy on offset access drills (arr[0] to arr[N-1])",
    priority: "HIGH",
    peerBuddy: "Ishaan Sharma (Mentor)",
  },
];
