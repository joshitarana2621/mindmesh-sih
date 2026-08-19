export interface MasteryInput {
  studentId: string;
  kcCode: string;
  correctAnswers: number;
  assessedAnswers: number;
  correctLatencyMs: number;
  totalCorrectAttempts: number;
  targetLatencyMs: number;
  recentKcCorrectness: number;
}

export interface MasteryResult {
  studentId: string;
  kcCode: string;
  accuracy: number;
  latencyScore: number;
  kcPerformance: number;
  mastery: number;
  band: "RED" | "YELLOW" | "GREEN" | "INSUFFICIENT";
  configVersion: string;
}

export interface MasteryConfig {
  accuracyWeight: number;
  latencyWeight: number;
  kcPerformanceWeight: number;
  targetLatencyMs: number;
  maxLatencyMs: number;
  minAttemptsForStable: number;
  redThreshold: number;
  yellowThreshold: number;
  version: string;
}

export const DEFAULT_MASTERY_CONFIG: MasteryConfig = {
  accuracyWeight: 0.60,
  latencyWeight: 0.15,
  kcPerformanceWeight: 0.25,
  targetLatencyMs: 15000,
  maxLatencyMs: 60000,
  minAttemptsForStable: 3,
  redThreshold: 0.50,
  yellowThreshold: 0.80,
  version: "mastery-v1",
};
