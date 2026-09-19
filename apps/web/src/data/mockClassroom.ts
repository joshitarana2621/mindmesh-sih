// DEMO CLASS — SIMULATED DATA
// Central Classroom Metadata & Dynamic Aggregate Calculators
// 100% Deterministic — Zero Math.random()

import { MockStudent, RiskLevel } from "./mockStudents";

export interface MockClassroom {
  id: string;
  name: string;
  gradeBand: string;
  section: string;
  academicYear: string;
  institutionName: string;
  institutionCode: string;
  teacherName: string;
  teacherEmail: string;
  totalSeats: number;
  gridDimensions: { rows: number; cols: number };
  activeSubject: string;
}

export const MOCK_CLASSROOM: MockClassroom = {
  id: "cls-001",
  name: "Class 8-A",
  gradeBand: "Grade 8",
  section: "A",
  academicYear: "2026-2027",
  institutionName: "Kendriya Vidyalaya No. 1",
  institutionCode: "KV-001",
  teacherName: "Demo Teacher",
  teacherEmail: "teacher@demoschool.edu",
  totalSeats: 45,
  gridDimensions: { rows: 5, cols: 9 }, // 5 rows x 9 columns = 45 seats
  activeSubject: "Mathematics & Foundational Computer Science",
};

export interface ClassroomAggregates {
  totalStudents: number;
  averageMastery: number; // percentage e.g. 66.8
  averageAttendance: number; // percentage e.g. 86.4
  riskDistribution: Record<RiskLevel, number>;
  statusDistribution: { GREEN: number; YELLOW: number; RED: number };
  trendDistribution: { improving: number; stable: number; declining: number; struggling: number };
  totalActiveInterventions: number;
  resolvedMisconceptionsCount: number;
  activeMisconceptionsCount: number;
}

/**
 * DERIVES all aggregate statistics dynamically from the given students array.
 * Strictly adheres to requirement #8: No duplicated hardcoded aggregate statistics.
 */
export function deriveClassroomAggregates(students: MockStudent[]): ClassroomAggregates {
  if (!students || students.length === 0) {
    return {
      totalStudents: 0,
      averageMastery: 0,
      averageAttendance: 0,
      riskDistribution: { LOW: 0, MEDIUM: 0, HIGH: 0 },
      statusDistribution: { GREEN: 0, YELLOW: 0, RED: 0 },
      trendDistribution: { improving: 0, stable: 0, declining: 0, struggling: 0 },
      totalActiveInterventions: 0,
      resolvedMisconceptionsCount: 0,
      activeMisconceptionsCount: 0,
    };
  }

  const total = students.length;
  let sumMastery = 0;
  let sumAttendance = 0;
  let activeInterventions = 0;
  let activeMisconceptions = 0;
  let resolvedMisconceptions = 0;

  const riskDist: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  const statusDist = { GREEN: 0, YELLOW: 0, RED: 0 };
  const trendDist = { improving: 0, stable: 0, declining: 0, struggling: 0 };

  for (const s of students) {
    sumMastery += s.overallMastery;
    sumAttendance += s.attendance;
    riskDist[s.riskLevel] = (riskDist[s.riskLevel] || 0) + 1;
    statusDist[s.status] = (statusDist[s.status] || 0) + 1;
    trendDist[s.trend] = (trendDist[s.trend] || 0) + 1;

    for (const intv of s.interventions) {
      if (intv.status !== "completed") activeInterventions++;
    }

    for (const misc of s.misconceptions) {
      if (misc.status === "ACTIVE") activeMisconceptions++;
      else if (misc.status === "RESOLVED") resolvedMisconceptions++;
    }
  }

  return {
    totalStudents: total,
    averageMastery: Math.round((sumMastery / total) * 10) / 10,
    averageAttendance: Math.round((sumAttendance / total) * 10) / 10,
    riskDistribution: riskDist,
    statusDistribution: statusDist,
    trendDistribution: trendDist,
    totalActiveInterventions: activeInterventions,
    resolvedMisconceptionsCount: resolvedMisconceptions,
    activeMisconceptionsCount: activeMisconceptions,
  };
}
