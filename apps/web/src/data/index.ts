// DEMO CLASS — SIMULATED DATA
// Central Mock Data Layer & Demo Access Functions
// 100% Deterministic — Zero Math.random()

import {
  MOCK_STUDENTS,
  MockStudent,
  RiskLevel,
  StudentQuizAttempt,
} from "./mockStudents";
import {
  KNOWLEDGE_COMPONENTS,
  MISCONCEPTIONS,
  KnowledgeComponentDef,
  MisconceptionDef,
} from "./mockKCs";
import { MOCK_QUESTIONS, MockQuestion } from "./mockQuestions";
import {
  INITIAL_INTERVENTIONS,
  MockIntervention,
  InterventionStatus,
} from "./mockInterventions";
import {
  MOCK_CLASSROOM,
  MockClassroom,
  ClassroomAggregates,
  deriveClassroomAggregates,
} from "./mockClassroom";

export const DEMO_DATA_BANNER_LABEL = "DEMO CLASS — SIMULATED DATA";

// Re-export all types and data fixtures
export * from "./mockStudents";
export * from "./mockKCs";
export * from "./mockQuestions";
export * from "./mockInterventions";
export * from "./mockClassroom";

// In-memory working copy for static/getter access outside React hooks
// (When used in React components, use useMockDataStore from '@/stores/mock-data-store')
let activeStudents: MockStudent[] = JSON.parse(JSON.stringify(MOCK_STUDENTS));
let activeInterventions: MockIntervention[] = JSON.parse(
  JSON.stringify(INITIAL_INTERVENTIONS)
);

export interface KCStat {
  code: string;
  title: string;
  domain: string;
  averageMastery: number; // 0 to 100
  studentsCount: number;
  strugglingCount: number; // mastery < 0.60
  masteredCount: number; // mastery >= 0.80
}

export interface InterventionStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  highPriority: number;
}

// =========================================================================
// DEMO ACCESS FUNCTIONS (Requirement #10)
// =========================================================================

/**
 * Returns a single student by id.
 */
export function getStudent(id: string): MockStudent | undefined {
  return activeStudents.find((s) => s.id === id);
}

/**
 * Returns all 45 students.
 */
export function getStudents(): MockStudent[] {
  return activeStudents;
}

/**
 * Returns all students marked with HIGH risk or overall mastery < 50%.
 */
export function getAtRiskStudents(): MockStudent[] {
  return activeStudents.filter(
    (s) => s.riskLevel === "HIGH" || s.overallMastery < 50
  );
}

/**
 * Filters students by specific risk level (LOW, MEDIUM, HIGH).
 */
export function getStudentsByRisk(level: RiskLevel): MockStudent[] {
  return activeStudents.filter((s) => s.riskLevel === level);
}

/**
 * Calculates aggregate stats across all Knowledge Components.
 * Derived dynamically from current student state.
 */
export function getKnowledgeComponentStats(): KCStat[] {
  const kcs = Object.values(KNOWLEDGE_COMPONENTS);
  return kcs.map((kc) => {
    let totalScore = 0;
    let count = 0;
    let struggling = 0;
    let mastered = 0;

    for (const student of activeStudents) {
      const score = student.knowledgeComponents[kc.code];
      if (typeof score === "number") {
        totalScore += score * 100;
        count++;
        if (score < 0.6) struggling++;
        if (score >= 0.8) mastered++;
      }
    }

    const avg = count > 0 ? Math.round(totalScore / count) : 0;
    return {
      code: kc.code,
      title: kc.title,
      domain: kc.domain,
      averageMastery: avg,
      studentsCount: count,
      strugglingCount: struggling,
      masteredCount: mastered,
    };
  });
}

/**
 * Returns active intervention counts and priority distribution.
 */
export function getInterventionStats(): InterventionStats {
  let pending = 0;
  let inProgress = 0;
  let completed = 0;
  let highPriority = 0;

  for (const intv of activeInterventions) {
    if (intv.status === "pending") pending++;
    else if (intv.status === "in-progress") inProgress++;
    else if (intv.status === "completed") completed++;

    if (intv.priority === "HIGH") highPriority++;
  }

  return {
    total: activeInterventions.length,
    pending,
    inProgress,
    completed,
    highPriority,
  };
}

/**
 * Returns the average class mastery percentage derived dynamically.
 */
export function getClassMastery(): number {
  if (activeStudents.length === 0) return 0;
  const sum = activeStudents.reduce((acc, s) => acc + s.overallMastery, 0);
  return Math.round(sum / activeStudents.length);
}

/**
 * Updates a student's mastery in a specific Knowledge Component,
 * recalculating their overall mastery and risk level deterministically.
 */
export function updateStudentMastery(
  id: string,
  kcCode: string,
  newScore: number // 0.0 to 1.0
): MockStudent | undefined {
  const student = activeStudents.find((s) => s.id === id);
  if (!student) return undefined;

  // Clamp between 0.0 and 1.0
  const clampedScore = Math.max(0, Math.min(1, newScore));
  student.knowledgeComponents[kcCode] = clampedScore;

  // Recalculate overall mastery as average across all tracked KCs
  const scores = Object.values(student.knowledgeComponents);
  const avg = Math.round(
    (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
  );
  student.overallMastery = avg;

  // Update status and risk level deterministically
  if (avg >= 75) {
    student.status = "GREEN";
    student.riskLevel = "LOW";
  } else if (avg >= 50) {
    student.status = "YELLOW";
    student.riskLevel = "MEDIUM";
  } else {
    student.status = "RED";
    student.riskLevel = "HIGH";
  }

  return student;
}

/**
 * Records a completed quiz attempt for a student.
 */
export function recordQuizAttempt(
  studentId: string,
  attempt: StudentQuizAttempt
): MockStudent | undefined {
  const student = activeStudents.find((s) => s.id === studentId);
  if (!student) return undefined;

  student.quizAttempts.unshift(attempt);
  student.lastActive = "Just now";

  // If score is high and student had active misconceptions in this attempt, resolve them
  if (attempt.score >= 80) {
    for (const kc of attempt.knowledgeComponents) {
      updateStudentMastery(
        studentId,
        kc,
        Math.min(1, (student.knowledgeComponents[kc] || 0.5) + 0.15)
      );
    }
  }

  return student;
}

/**
 * Marks an intervention as completed.
 */
export function completeIntervention(
  studentId: string,
  interventionId: string
): boolean {
  // Update in global interventions
  const intv = activeInterventions.find((i) => i.id === interventionId);
  if (intv) {
    intv.status = "completed";
  }

  // Update in student's embedded interventions
  const student = activeStudents.find((s) => s.id === studentId);
  if (student) {
    const studentIntv = student.interventions.find(
      (i) => i.id === interventionId
    );
    if (studentIntv) {
      studentIntv.status = "completed";
    }
    student.remediationProgress = Math.min(100, student.remediationProgress + 15);
  }

  return true;
}

/**
 * Resets working mock state to initial deterministic defaults (Requirement #12).
 */
export function resetToDefault(): void {
  activeStudents = JSON.parse(JSON.stringify(MOCK_STUDENTS));
  activeInterventions = JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS));
}
