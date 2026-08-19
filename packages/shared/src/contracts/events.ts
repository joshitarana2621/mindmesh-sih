export interface SocketEvent {
  eventVersion: number;
  eventId: string;
  occurredAt: string;
  correlationId: string;
}

export interface StudentQuizSubmittedEvent extends SocketEvent {
  type: "student.quiz.submitted";
  payload: {
    studentName: string;
    quizTitle: string;
    score: number;
    totalQuestions: number;
    classroomId: string;
  };
}

export interface StudentRiskChangedEvent extends SocketEvent {
  type: "student.risk.changed";
  payload: {
    studentId: string;
    studentName: string;
    kcCode: string;
    kcName: string;
    previousPriority: string;
    currentPriority: string;
    explanation: string;
    classroomId: string;
  };
}

export interface InterventionCreatedEvent extends SocketEvent {
  type: "intervention.created";
  payload: {
    interventionId: string;
    studentName: string;
    priority: string;
    triggerFamily: string;
    kcName: string;
    evidence: unknown;
    classroomId: string;
  };
}

export interface InterventionAcknowledgedEvent extends SocketEvent {
  type: "intervention.acknowledged";
  payload: {
    interventionId: string;
    teacherName: string;
    classroomId: string;
  };
}

export interface InterventionResolvedEvent extends SocketEvent {
  type: "intervention.resolved";
  payload: {
    interventionId: string;
    outcome: string;
    recheckAttemptId?: string;
    classroomId: string;
  };
}

export interface ClassroomPulseUpdatedEvent extends SocketEvent {
  type: "classroom.pulse.updated";
  payload: {
    classroomId: string;
    onlineCount: number;
    activeQuizCount: number;
    pendingSyncCount: number;
    openInterventionCount: number;
  };
}

export interface StudentPresenceEvent extends SocketEvent {
  type: "student.online" | "student.offline";
  payload: {
    studentId: string;
    studentName: string;
    classroomId: string;
  };
}

export interface SyncCompletedEvent extends SocketEvent {
  type: "sync.completed";
  payload: {
    acceptedCount: number;
    duplicateCount: number;
    rejectedCount: number;
  };
}

export type ServerToClientEvent =
  | StudentQuizSubmittedEvent
  | StudentRiskChangedEvent
  | InterventionCreatedEvent
  | InterventionAcknowledgedEvent
  | InterventionResolvedEvent
  | ClassroomPulseUpdatedEvent
  | StudentPresenceEvent
  | SyncCompletedEvent;
