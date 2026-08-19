export interface RiskInput {
  studentId: string;
  kcCode: string;
  recentAttempts: Array<{
    isCorrect: boolean;
    latencyMs: number;
    submittedAt: string;
    answerChanged: boolean;
  }>;
  currentMastery: number;
  prerequisiteMastery?: number;
  hasAbandonment?: boolean;
  helpRequestCount?: number;
}

export interface RiskSignal {
  name: string;
  triggered: boolean;
  weight: number;
  description: string;
}

export interface RiskResult {
  studentId: string;
  kcCode: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  score: number;
  signals: RiskSignal[];
  explanation: string;
  ruleVersion: string;
}

export interface RiskConfig {
  repeatedIncorrectThreshold: number;
  timeWindowMs: number;
  lowMasteryThreshold: number;
  prerequisiteErrorThreshold: number;
  longHesitationMultiplier: number;
  mediumScoreThreshold: number;
  highScoreThreshold: number;
  criticalScoreThreshold: number;
  version: string;
}

export const DEFAULT_RISK_CONFIG: RiskConfig = {
  repeatedIncorrectThreshold: 3,
  timeWindowMs: 10 * 60 * 1000,
  lowMasteryThreshold: 0.50,
  prerequisiteErrorThreshold: 0.40,
  longHesitationMultiplier: 2.0,
  mediumScoreThreshold: 0.3,
  highScoreThreshold: 0.6,
  criticalScoreThreshold: 0.85,
  version: "risk-v1",
};
