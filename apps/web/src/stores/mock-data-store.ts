// DEMO CLASS — SIMULATED DATA
// Central Reactive Mock Data Store (Zustand)
// Single source of truth for runtime state across the entire application
// 100% Deterministic — Zero Math.random()

import { create } from "zustand";
import {
  MOCK_STUDENTS,
  MockStudent,
  RiskLevel,
  StudentQuizAttempt,
} from "@/data/mockStudents";
import {
  INITIAL_INTERVENTIONS,
  MockIntervention,
} from "@/data/mockInterventions";
import {
  MOCK_CLASSROOM,
  MockClassroom,
  ClassroomAggregates,
  deriveClassroomAggregates,
} from "@/data/mockClassroom";
import {
  KNOWLEDGE_COMPONENTS,
  KCStat,
  InterventionStats,
} from "@/data";

interface MockDataState {
  // State
  students: MockStudent[];
  classroom: MockClassroom;
  interventions: MockIntervention[];
  selectedStudentId: string; // for dynamic student view, defaults to 'st-01' (Aarav Patel)
  isHydrated: boolean;

  // Actions (Mutations must ONLY happen through these)
  selectStudent: (id: string) => void;
  updateStudentMastery: (id: string, kcCode: string, newScore: number) => void;
  recordQuizAttempt: (studentId: string, attempt: StudentQuizAttempt) => void;
  completeIntervention: (studentId: string, interventionId: string) => void;
  addIntervention: (intervention: Omit<MockIntervention, "id">) => string;
  resetToDefault: () => void;
  hydrate: () => void;

  // Computed / Selectors (Derived dynamically)
  getStudent: (id: string) => MockStudent | undefined;
  getSelectedStudent: () => MockStudent;
  getAtRiskStudents: () => MockStudent[];
  getStudentsByRisk: (level: RiskLevel) => MockStudent[];
  getClassMastery: () => number;
  getClassroomAggregates: () => ClassroomAggregates;
  getKnowledgeComponentStats: () => KCStat[];
  getInterventionStats: () => InterventionStats;
}

const STORAGE_KEY = "mindmesh_mock_state_v1";

function persistToStorage(state: {
  students: MockStudent[];
  interventions: MockIntervention[];
  selectedStudentId: string;
}) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota or disabled fallback
    }
  }
}

function loadFromStorage(): {
  students: MockStudent[];
  interventions: MockIntervention[];
  selectedStudentId: string;
} | null {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed.students) && parsed.students.length === 45) {
          return parsed;
        }
      }
    } catch {
      return null;
    }
  }
  return null;
}

export const useMockDataStore = create<MockDataState>((set, get) => ({
  // Initialize with deterministic fixtures
  students: JSON.parse(JSON.stringify(MOCK_STUDENTS)),
  classroom: MOCK_CLASSROOM,
  interventions: JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS)),
  selectedStudentId: "st-01",
  isHydrated: false,

  hydrate: () => {
    if (get().isHydrated) return;
    const stored = loadFromStorage();
    if (stored) {
      set({
        students: stored.students,
        interventions: stored.interventions,
        selectedStudentId: stored.selectedStudentId || "st-01",
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },

  selectStudent: (id: string) => {
    set({ selectedStudentId: id });
    persistToStorage({
      students: get().students,
      interventions: get().interventions,
      selectedStudentId: id,
    });
  },

  updateStudentMastery: (id: string, kcCode: string, newScore: number) => {
    const clamped = Math.max(0, Math.min(1, newScore));
    set((state) => {
      const nextStudents = state.students.map((student) => {
        if (student.id !== id) return student;

        const updatedKCs = { ...student.knowledgeComponents, [kcCode]: clamped };
        const scores = Object.values(updatedKCs);
        const avg = Math.round(
          (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
        );

        const status: "GREEN" | "YELLOW" | "RED" =
          avg >= 75 ? "GREEN" : avg >= 50 ? "YELLOW" : "RED";
        const riskLevel: RiskLevel =
          avg >= 75 ? "LOW" : avg >= 50 ? "MEDIUM" : "HIGH";

        return {
          ...student,
          knowledgeComponents: updatedKCs,
          overallMastery: avg,
          status,
          riskLevel,
        };
      });

      persistToStorage({
        students: nextStudents,
        interventions: state.interventions,
        selectedStudentId: state.selectedStudentId,
      });

      return { students: nextStudents };
    });
  },

  recordQuizAttempt: (studentId: string, attempt: StudentQuizAttempt) => {
    set((state) => {
      const nextStudents = state.students.map((student) => {
        if (student.id !== studentId) return student;

        const nextAttempts = [attempt, ...student.quizAttempts];
        let nextKCs = { ...student.knowledgeComponents };

        // If scored well on this attempt, boost mastery for those evaluated KCs deterministically
        if (attempt.score >= 80) {
          for (const kc of attempt.knowledgeComponents) {
            nextKCs[kc] = Math.min(1, (nextKCs[kc] || 0.5) + 0.1);
          }
        }

        const scores = Object.values(nextKCs);
        const avg = Math.round(
          (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
        );

        const status: "GREEN" | "YELLOW" | "RED" =
          avg >= 75 ? "GREEN" : avg >= 50 ? "YELLOW" : "RED";
        const riskLevel: RiskLevel =
          avg >= 75 ? "LOW" : avg >= 50 ? "MEDIUM" : "HIGH";

        return {
          ...student,
          quizAttempts: nextAttempts,
          knowledgeComponents: nextKCs,
          overallMastery: avg,
          status,
          riskLevel,
          lastActive: "Just now",
        };
      });

      persistToStorage({
        students: nextStudents,
        interventions: state.interventions,
        selectedStudentId: state.selectedStudentId,
      });

      return { students: nextStudents };
    });
  },

  completeIntervention: (studentId: string, interventionId: string) => {
    set((state) => {
      const nextInterventions = state.interventions.map((intv) =>
        intv.id === interventionId ? { ...intv, status: "completed" as const } : intv
      );

      const nextStudents = state.students.map((student) => {
        if (student.id !== studentId) return student;

        const nextStudentIntvs = student.interventions.map((i) =>
          i.id === interventionId ? { ...i, status: "completed" as const } : i
        );

        return {
          ...student,
          interventions: nextStudentIntvs,
          remediationProgress: Math.min(100, student.remediationProgress + 15),
        };
      });

      persistToStorage({
        students: nextStudents,
        interventions: nextInterventions,
        selectedStudentId: state.selectedStudentId,
      });

      return {
        students: nextStudents,
        interventions: nextInterventions,
      };
    });
  },

  addIntervention: (newIntv) => {
    const id = "int-" + Date.now();
    const created: MockIntervention = {
      ...newIntv,
      id,
    };

    set((state) => {
      const nextInterventions = [created, ...state.interventions];
      const nextStudents = state.students.map((student) => {
        if (student.id !== created.studentId) return student;
        return {
          ...student,
          interventions: [
            {
              id: created.id,
              title: created.reason,
              kcCode: created.kcCode,
              status: created.status,
              strategy: created.recommendedActivity,
              peerBuddy: created.peerBuddy,
            },
            ...student.interventions,
          ],
        };
      });

      persistToStorage({
        students: nextStudents,
        interventions: nextInterventions,
        selectedStudentId: state.selectedStudentId,
      });

      return {
        students: nextStudents,
        interventions: nextInterventions,
      };
    });

    return id;
  },

  resetToDefault: () => {
    const freshStudents = JSON.parse(JSON.stringify(MOCK_STUDENTS));
    const freshInterventions = JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS));
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    set({
      students: freshStudents,
      interventions: freshInterventions,
      selectedStudentId: "st-01",
    });
  },

  // Dynamic Selectors
  getStudent: (id: string) => {
    return get().students.find((s) => s.id === id);
  },

  getSelectedStudent: () => {
    const { students, selectedStudentId } = get();
    return (
      students.find((s) => s.id === selectedStudentId) ||
      students[0] ||
      MOCK_STUDENTS[0]
    );
  },

  getAtRiskStudents: () => {
    return get().students.filter(
      (s) => s.riskLevel === "HIGH" || s.overallMastery < 50
    );
  },

  getStudentsByRisk: (level: RiskLevel) => {
    return get().students.filter((s) => s.riskLevel === level);
  },

  getClassMastery: () => {
    const { students } = get();
    if (!students || students.length === 0) return 0;
    const sum = students.reduce((acc, s) => acc + s.overallMastery, 0);
    return Math.round(sum / students.length);
  },

  getClassroomAggregates: () => {
    return deriveClassroomAggregates(get().students);
  },

  getKnowledgeComponentStats: () => {
    const { students } = get();
    const kcs = Object.values(KNOWLEDGE_COMPONENTS);

    return kcs.map((kc) => {
      let totalScore = 0;
      let count = 0;
      let struggling = 0;
      let mastered = 0;

      for (const student of students) {
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
  },

  getInterventionStats: () => {
    const { interventions } = get();
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let highPriority = 0;

    for (const intv of interventions) {
      if (intv.status === "pending") pending++;
      else if (intv.status === "in-progress") inProgress++;
      else if (intv.status === "completed") completed++;

      if (intv.priority === "HIGH") highPriority++;
    }

    return {
      total: interventions.length,
      pending,
      inProgress,
      completed,
      highPriority,
    };
  },
}));
