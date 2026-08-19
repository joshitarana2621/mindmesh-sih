export interface StudentCandidate {
  studentId: string;
  studentName: string;
  role: "MENTOR" | "MENTEE";
  weakKCs: string[];
  strongKCs: string[];
  mastery: Record<string, number>;
  language: string;
  station?: string;
  recentPairingCounts: Record<string, number>;
  mentorCapacity: number;
}

export interface PeerPod {
  mentors: Array<{ studentId: string; studentName: string }>;
  mentees: Array<{ studentId: string; studentName: string }>;
  targetKC: string;
  estimatedDurationMinutes: number;
}

export interface PeerPodResult {
  pods: PeerPod[];
  unmatched: Array<{
    studentId: string;
    studentName: string;
    reason: string;
  }>;
}
