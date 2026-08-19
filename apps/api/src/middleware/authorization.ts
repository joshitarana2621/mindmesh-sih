import { prisma } from "@eduadpat/database";

interface ResourceContext {
  institutionId?: string;
  classroomId?: string;
  studentId?: string;
  ownerId?: string;
}

type Action =
  | "read:own_profile"
  | "read:classroom"
  | "read:classroom_students"
  | "write:classroom"
  | "read:quiz"
  | "write:quiz"
  | "start:quiz_attempt"
  | "submit:quiz"
  | "read:own_attempts"
  | "read:analytics"
  | "read:diagnostics"
  | "read:interventions"
  | "write:interventions"
  | "read:peer_pods"
  | "write:peer_pods"
  | "read:rotations"
  | "write:rotations"
  | "request:remediation"
  | "sync:events"
  | "read:own_progress"
  | "read:own_mastery";

export async function can(
  actor: { id: string; role: string; institutionId: string },
  action: Action,
  resource?: ResourceContext
): Promise<boolean> {
  if (actor.role === "PLATFORM_SUPPORT") return true;

  if (resource?.institutionId && resource.institutionId !== actor.institutionId) {
    return false;
  }

  switch (action) {
    case "read:own_profile":
      return true;

    case "read:classroom":
    case "write:classroom": {
      if (actor.role === "INSTITUTION_ADMIN") return true;
      const member = await prisma.classroomMember.findFirst({
        where: { userId: actor.id, classroomId: resource?.classroomId },
      });
      return !!member;
    }

    case "read:classroom_students": {
      if (actor.role === "TEACHER" || actor.role === "INSTITUTION_ADMIN") {
        const member = await prisma.classroomMember.findFirst({
          where: { userId: actor.id, classroomId: resource?.classroomId, role: { in: ["TEACHER", "ASSISTANT"] } },
        });
        return !!member;
      }
      return false;
    }

    case "start:quiz_attempt":
    case "submit:quiz":
    case "read:own_attempts":
    case "read:own_progress":
    case "read:own_mastery": {
      if (actor.role === "STUDENT") return true;
      if (actor.role === "TEACHER" || actor.role === "INSTITUTION_ADMIN") return true;
      return false;
    }

    case "read:quiz":
    case "write:quiz": {
      if (actor.role === "INSTITUTION_ADMIN") return true;
      if (actor.role === "TEACHER") return true;
      return false;
    }

    case "read:analytics":
    case "read:diagnostics": {
      if (actor.role === "TEACHER" || actor.role === "INSTITUTION_ADMIN") {
        if (resource?.classroomId) {
          const member = await prisma.classroomMember.findFirst({
            where: { userId: actor.id, classroomId: resource.classroomId, role: { in: ["TEACHER", "ASSISTANT"] } },
          });
          return !!member;
        }
        return true;
      }
      if (actor.role === "STUDENT") {
        return !resource?.classroomId;
      }
      return false;
    }

    case "read:interventions":
    case "write:interventions": {
      if (actor.role === "TEACHER" || actor.role === "INSTITUTION_ADMIN") return true;
      return false;
    }

    case "read:peer_pods":
    case "write:peer_pods": {
      if (actor.role === "TEACHER" || actor.role === "INSTITUTION_ADMIN") return true;
      return false;
    }

    case "read:rotations":
    case "write:rotations": {
      if (actor.role === "TEACHER" || actor.role === "INSTITUTION_ADMIN") return true;
      return false;
    }

    case "request:remediation": {
      return true;
    }

    case "sync:events": {
      return true;
    }

    default:
      return false;
  }
}

export async function authorizeOrThrow(
  actor: { id: string; role: string; institutionId: string },
  action: Action,
  resource?: ResourceContext
): Promise<void> {
  const allowed = await can(actor, action, resource);
  if (!allowed) {
    throw new Error("Forbidden: insufficient permissions for this action");
  }
}
