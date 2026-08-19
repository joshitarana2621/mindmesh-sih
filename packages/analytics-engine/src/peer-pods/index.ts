import { StudentCandidate, PeerPod, PeerPodResult } from "./types";

export function generatePeerPods(
  candidates: StudentCandidate[],
  targetKC: string,
  maxPodSize: number = 4
): PeerPodResult {
  const mentors = candidates
    .filter((c) => c.role === "MENTOR" && c.strongKCs.includes(targetKC))
    .sort((a, b) => {
      const aMastery = a.mastery[targetKC] || 0;
      const bMastery = b.mastery[targetKC] || 0;
      return bMastery - aMastery;
    });

  const mentees = candidates
    .filter((c) => c.role === "MENTEE" && c.weakKCs.includes(targetKC))
    .sort((a, b) => {
      const aMastery = a.mastery[targetKC] || 0;
      const bMastery = b.mastery[targetKC] || 0;
      return aMastery - bMastery;
    });

  const pods: PeerPod[] = [];
  const unmatched: PeerPodResult["unmatched"] = [];
  const usedMentors = new Set<string>();
  const usedMentees = new Set<string>();

  for (const mentee of mentees) {
    let bestMentor: StudentCandidate | null = null;
    let bestScore = -1;

    for (const mentor of mentors) {
      if (usedMentors.has(mentor.studentId)) continue;
      if (mentor.studentId === mentee.studentId) continue;

      let score = 0;
      score += (mentor.mastery[targetKC] || 0) * 40;

      if (mentor.language === mentee.language) score += 20;

      if (mentor.mentorCapacity > 0) score += 15;

      const pairCount = mentee.recentPairingCounts[mentor.studentId] || 0;
      score -= pairCount * 10;

      if (score > bestScore) {
        bestScore = score;
        bestMentor = mentor;
      }
    }

    if (bestMentor && bestScore > 20) {
      let addedToExisting = false;
      for (const pod of pods) {
        if (
          pod.mentors.length < maxPodSize &&
          pod.targetKC === targetKC &&
          pod.mentors.some((m) => m.studentId === bestMentor!.studentId)
        ) {
          pod.mentees.push({ studentId: mentee.studentId, studentName: mentee.studentName });
          usedMentors.add(bestMentor.studentId);
          usedMentees.add(mentee.studentId);
          addedToExisting = true;
          break;
        }
      }

      if (!addedToExisting) {
        pods.push({
          mentors: [{ studentId: bestMentor.studentId, studentName: bestMentor.studentName }],
          mentees: [{ studentId: mentee.studentId, studentName: mentee.studentName }],
          targetKC,
          estimatedDurationMinutes: 10,
        });
        usedMentors.add(bestMentor.studentId);
        usedMentees.add(mentee.studentId);
      }
    } else {
      unmatched.push({
        studentId: mentee.studentId,
        studentName: mentee.studentName,
        reason: bestMentor ? "No compatible mentor available" : "No mentor with target KC strength",
      });
    }
  }

  for (const mentor of mentors) {
    if (!usedMentors.has(mentor.studentId)) {
      unmatched.push({
        studentId: mentor.studentId,
        studentName: mentor.studentName,
        reason: "No mentee needing this KC",
      });
    }
  }

  return { pods, unmatched };
}

export type { StudentCandidate, PeerPod, PeerPodResult };
