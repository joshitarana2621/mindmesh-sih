import { MisconceptionInput, MisconceptionResult } from "./types";

export function classifyMisconception(input: MisconceptionInput): MisconceptionResult {
  let category: MisconceptionResult["category"] = "UNKNOWN";
  let confidence = 0.3;

  if (input.distractorType) {
    switch (input.distractorType) {
      case "CALCULATION_SLIP":
        category = "CALCULATION_SLIP";
        confidence = 0.8;
        break;
      case "READING_ERROR":
        category = "READING_ERROR";
        confidence = 0.7;
        break;
      case "CARELESS_ERROR":
        category = "CARELESS_ERROR";
        confidence = 0.6;
        break;
      case "SYNTAX_ERROR":
        category = "SYNTAX_ERROR";
        confidence = 0.85;
        break;
      case "LOGICAL_ERROR":
        category = "LOGICAL_ERROR";
        confidence = 0.75;
        break;
      case "CONCEPTUAL_ERROR":
        category = "CONCEPTUAL_ERROR";
        confidence = 0.7;
        break;
      case "PREREQUISITE_GAP":
        category = "PREREQUISITE_GAP";
        confidence = 0.8;
        break;
      default:
        category = "UNKNOWN";
        confidence = 0.2;
    }
  } else {
    if (input.attemptNumber > 1 && input.latencyMs < 3000) {
      category = "CARELESS_ERROR";
      confidence = 0.5;
    } else if (input.latencyMs > 30000) {
      category = "CONCEPTUAL_ERROR";
      confidence = 0.5;
    } else {
      category = "UNKNOWN";
      confidence = 0.2;
    }
  }

  return {
    kcCode: input.kcCode,
    category,
    confidence,
    evidence: {
      questionId: input.questionId,
      selectedAnswer: input.selectedAnswer,
      correctAnswer: input.correctAnswer,
      distractorType: input.distractorType,
    },
  };
}

export function classifyMisconceptionBatch(
  inputs: MisconceptionInput[]
): MisconceptionResult[] {
  return inputs.map(classifyMisconception);
}

export type { MisconceptionInput, MisconceptionResult };
