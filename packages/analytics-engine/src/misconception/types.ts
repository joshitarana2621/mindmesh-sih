export interface MisconceptionInput {
  questionId: string;
  kcCode: string;
  selectedAnswer: string;
  correctAnswer: string;
  distractorType?: string;
  latencyMs: number;
  attemptNumber: number;
}

export interface MisconceptionResult {
  kcCode: string;
  category: "CALCULATION_SLIP" | "READING_ERROR" | "CARELESS_ERROR" | "SYNTAX_ERROR" |
            "LOGICAL_ERROR" | "CONCEPTUAL_ERROR" | "PREREQUISITE_GAP" | "UNKNOWN";
  confidence: number;
  evidence: {
    questionId: string;
    selectedAnswer: string;
    correctAnswer: string;
    distractorType?: string;
  };
}
