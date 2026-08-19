export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StudentProgressResponse {
  studentId: string;
  overallMastery: number;
  kcMastery: Array<{
    kcCode: string;
    kcName: string;
    mastery: number;
    band: "RED" | "YELLOW" | "GREEN" | "INSUFFICIENT";
    attemptCount: number;
  }>;
  recentAttempts: Array<{
    attemptId: string;
    quizTitle: string;
    score: number;
    completedAt: string;
  }>;
}

export interface ClassroomAnalyticsResponse {
  classroomId: string;
  studentCount: number;
  averageMastery: number;
  riskDistribution: {
    red: number;
    yellow: number;
    green: number;
    insufficient: number;
  };
  topInterventions: Array<{
    kcCode: string;
    kcName: string;
    interventionCount: number;
    avgMastery: number;
  }>;
}

export interface DiagnosticsResponse {
  studentId: string;
  name: string;
  mastery: Array<{
    kcCode: string;
    kcName: string;
    accuracy: number;
    latencyScore: number;
    kcPerformance: number;
    mastery: number;
    band: string;
  }>;
  misconceptions: Array<{
    kcCode: string;
    category: string;
    confidence: number;
    detectedAt: string;
  }>;
  risks: Array<{
    kcCode: string;
    priority: string;
    explanation: string;
    computedAt: string;
  }>;
}
