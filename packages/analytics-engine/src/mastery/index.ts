import { MasteryInput, MasteryResult, MasteryConfig, DEFAULT_MASTERY_CONFIG } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function computeMastery(
  input: MasteryInput,
  config: MasteryConfig = DEFAULT_MASTERY_CONFIG
): MasteryResult {
  const { correctAnswers, assessedAnswers, correctLatencyMs, totalCorrectAttempts, targetLatencyMs, recentKcCorrectness } = input;

  const accuracy = assessedAnswers > 0 ? correctAnswers / assessedAnswers : 0;

  let latencyScore = 0;
  if (correctAnswers > 0 && totalCorrectAttempts > 0) {
    const avgCorrectLatency = correctLatencyMs / totalCorrectAttempts;
    const target = targetLatencyMs || config.targetLatencyMs;
    latencyScore = clamp(target / avgCorrectLatency, 0, 1);
  }

  const kcPerformance = clamp(recentKcCorrectness, 0, 1);

  const mastery = clamp(
    config.accuracyWeight * accuracy +
    config.latencyWeight * latencyScore +
    config.kcPerformanceWeight * kcPerformance,
    0, 1
  );

  let band: "RED" | "YELLOW" | "GREEN" | "INSUFFICIENT";
  if (assessedAnswers < config.minAttemptsForStable) {
    band = "INSUFFICIENT";
  } else if (mastery < config.redThreshold) {
    band = "RED";
  } else if (mastery < config.yellowThreshold) {
    band = "YELLOW";
  } else {
    band = "GREEN";
  }

  return {
    studentId: input.studentId,
    kcCode: input.kcCode,
    accuracy,
    latencyScore,
    kcPerformance,
    mastery,
    band,
    configVersion: config.version,
  };
}

export function computeMasteryBatch(
  inputs: MasteryInput[],
  config?: MasteryConfig
): MasteryResult[] {
  return inputs.map((input) => computeMastery(input, config));
}

export type { MasteryInput, MasteryResult, MasteryConfig };
export { DEFAULT_MASTERY_CONFIG };
