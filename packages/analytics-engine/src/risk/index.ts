import { RiskInput, RiskResult, RiskSignal, RiskConfig, DEFAULT_RISK_CONFIG } from "./types";

export function evaluateRisk(
  input: RiskInput,
  config: RiskConfig = DEFAULT_RISK_CONFIG
): RiskResult {
  const signals: RiskSignal[] = [];
  const now = Date.now();

  const recentWindow = input.recentAttempts.filter(
    (a) => now - new Date(a.submittedAt).getTime() < config.timeWindowMs
  );

  const consecutiveIncorrect = countConsecutiveIncorrect(input.recentAttempts);
  signals.push({
    name: "repeated_incorrect",
    triggered: consecutiveIncorrect >= config.repeatedIncorrectThreshold,
    weight: 0.35,
    description: `${consecutiveIncorrect} consecutive incorrect responses for ${input.kcCode}`,
  });

  const lowMastery = input.currentMastery < config.lowMasteryThreshold;
  signals.push({
    name: "low_mastery",
    triggered: lowMastery,
    weight: 0.25,
    description: `Mastery is ${(input.currentMastery * 100).toFixed(0)}% (below ${config.lowMasteryThreshold * 100}%)`,
  });

  const prerequisiteGap = input.prerequisiteMastery !== undefined &&
    input.prerequisiteMastery < config.prerequisiteErrorThreshold;
  signals.push({
    name: "prerequisite_error",
    triggered: prerequisiteGap,
    weight: 0.20,
    description: prerequisiteGap
      ? `Prerequisite mastery is ${(input.prerequisiteMastery! * 100).toFixed(0)}%`
      : "No prerequisite gap detected",
  });

  const avgLatency = recentWindow.length > 0
    ? recentWindow.reduce((sum, a) => sum + a.latencyMs, 0) / recentWindow.length
    : 0;
  const targetLatency = 15000;
  const longHesitation = avgLatency > targetLatency * config.longHesitationMultiplier;
  signals.push({
    name: "long_hesitation",
    triggered: longHesitation,
    weight: 0.08,
    description: longHesitation
      ? `Average response time ${(avgLatency / 1000).toFixed(1)}s is unusually long`
      : "Response time within normal range",
  });

  const answerChanges = recentWindow.filter((a) => a.answerChanged).length;
  signals.push({
    name: "answer_changes",
    triggered: answerChanges >= 2,
    weight: 0.05,
    description: `${answerChanges} answer changes in recent attempts`,
  });

  signals.push({
    name: "abandonment",
    triggered: !!input.hasAbandonment,
    weight: 0.05,
    description: input.hasAbandonment ? "Quiz was abandoned" : "No abandonment detected",
  });

  signals.push({
    name: "help_requests",
    triggered: (input.helpRequestCount || 0) >= 2,
    weight: 0.02,
    description: `${input.helpRequestCount || 0} help requests`,
  });

  let score = 0;
  const triggeredSignals = signals.filter((s) => s.triggered);
  for (const signal of triggeredSignals) {
    score += signal.weight;
  }

  const hasStrongTrigger = consecutiveIncorrect >= config.repeatedIncorrectThreshold &&
    (lowMastery || prerequisiteGap);

  let priority: RiskResult["priority"];
  if (score >= config.criticalScoreThreshold || (hasStrongTrigger && score >= config.highScoreThreshold)) {
    priority = "CRITICAL";
  } else if (score >= config.highScoreThreshold) {
    priority = "HIGH";
  } else if (score >= config.mediumScoreThreshold) {
    priority = "MEDIUM";
  } else {
    priority = "LOW";
  }

  const explanation = buildExplanation(priority, triggeredSignals, input.kcCode, input.currentMastery);

  return {
    studentId: input.studentId,
    kcCode: input.kcCode,
    priority,
    score,
    signals,
    explanation,
    ruleVersion: config.version,
  };
}

function countConsecutiveIncorrect(attempts: RiskInput["recentAttempts"]): number {
  let count = 0;
  for (let i = attempts.length - 1; i >= 0; i--) {
    if (!attempts[i].isCorrect) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

function buildExplanation(
  priority: string,
  signals: RiskSignal[],
  kcCode: string,
  mastery: number
): string {
  const triggeredDescriptions = signals
    .filter((s) => s.triggered)
    .map((s) => s.description);

  if (triggeredDescriptions.length === 0) {
    return `No significant risk signals for ${kcCode}. Mastery: ${(mastery * 100).toFixed(0)}%`;
  }

  return `${priority} priority for ${kcCode}: ${triggeredDescriptions.join("; ")}`;
}

export function dedupeAndCooldown(
  events: Array<{ dedupeKey: string; createdAt: string; priority: string }>,
  cooldownMs: number = 30 * 60 * 1000
): Map<string, { shouldCreate: boolean; aggregateCount: number }> {
  const result = new Map<string, { shouldCreate: boolean; aggregateCount: number }>();
  const now = Date.now();

  const byKey = new Map<string, typeof events>();
  for (const event of events) {
    const existing = byKey.get(event.dedupeKey) || [];
    existing.push(event);
    byKey.set(event.dedupeKey, existing);
  }

  for (const [key, keyEvents] of byKey) {
    const recentEvents = keyEvents.filter(
      (e) => now - new Date(e.createdAt).getTime() < cooldownMs
    );

    if (recentEvents.length === 0) {
      result.set(key, { shouldCreate: true, aggregateCount: 0 });
    } else {
      const highestPriority = getHighestPriority(recentEvents.map((e) => e.priority));
      result.set(key, {
        shouldCreate: true,
        aggregateCount: recentEvents.length,
      });
    }
  }

  return result;
}

function getHighestPriority(priorities: string[]): string {
  const order = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  for (const p of order) {
    if (priorities.includes(p)) return p;
  }
  return "LOW";
}

export type { RiskInput, RiskResult, RiskSignal, RiskConfig };
export { DEFAULT_RISK_CONFIG };
