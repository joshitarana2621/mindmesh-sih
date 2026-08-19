import { Router, Request, Response } from "express";
import { prisma } from "@eduadpat/database";
import { requireAuth, requireRole } from "../middleware/auth";
import { authorizeOrThrow } from "../middleware/authorization";
import {
  acknowledgeInterventionSchema,
  resolveInterventionSchema,
  snoozeInterventionSchema,
  dismissInterventionSchema,
} from "@eduadpat/shared";
import { validate } from "../middleware/validate";
import { io } from "../index";
import { emitToTeacherRoom } from "../websocket/handlers";

const router: Router = Router();

router.get("/", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), async (req: Request, res: Response) => {
  const { classroomId, status, priority } = req.query;

  const where: any = {
    institutionId: req.actor!.institutionId,
  };

  if (classroomId) where.classroomId = classroomId;
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const events = await prisma.interventionEvent.findMany({
    where,
    include: {
      student: { include: { user: { select: { name: true } } } },
      kc: true,
    },
    orderBy: [
      { priority: "asc" },
      { createdAt: "desc" },
    ],
  });

  res.json({
    success: true,
    data: events.map((e) => ({
      ...e,
      studentName: e.student.user.name,
      knowledgeComponentCode: e.kc?.code,
      knowledgeComponentName: e.kc?.name,
    })),
  });
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const event = await prisma.interventionEvent.findUnique({
    where: { id: String(req.params.id) },
    include: {
      student: { include: { user: { select: { name: true } } } },
      kc: true,
      actions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!event) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Intervention not found" } });
    return;
  }

  res.json({ success: true, data: { ...event, studentName: event.student.user.name } });
});

router.post("/:id/acknowledge", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), validate(acknowledgeInterventionSchema), async (req: Request, res: Response) => {
  const event = await prisma.interventionEvent.findUnique({ where: { id: String(req.params.id) } });
  if (!event) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Intervention not found" } });
    return;
  }

  const updated = await prisma.interventionEvent.update({
    where: { id: String(req.params.id) },
    data: { status: "ACKNOWLEDGED", acknowledgedAt: new Date() },
  });

  await prisma.interventionAction.create({
    data: {
      interventionId: String(req.params.id),
      actorId: req.actor!.id,
      actionType: "ACKNOWLEDGE",
      reason: req.body.reason,
    },
  });

  await prisma.auditLog.create({
    data: {
      institutionId: req.actor!.institutionId,
      actorId: req.actor!.id,
      action: "INTERVENTION_ACKNOWLEDGED",
      resourceType: "InterventionEvent",
      resourceId: String(req.params.id),
    },
  });

  emitToTeacherRoom(io, event.institutionId, event.classroomId, "intervention.acknowledged", {
    interventionId: String(req.params.id),
    teacherName: req.actor!.id,
    classroomId: event.classroomId,
  });

  res.json({ success: true, data: updated });
});

router.post("/:id/resolve", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), validate(resolveInterventionSchema), async (req: Request, res: Response) => {
  const event = await prisma.interventionEvent.findUnique({ where: { id: String(req.params.id) } });
  if (!event) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Intervention not found" } });
    return;
  }

  const updated = await prisma.interventionEvent.update({
    where: { id: String(req.params.id) },
    data: {
      status: "RESOLVED",
      resolvedAt: new Date(),
      outcome: req.body.outcome,
    },
  });

  await prisma.interventionAction.create({
    data: {
      interventionId: String(req.params.id),
      actorId: req.actor!.id,
      actionType: "RESOLVE",
      reason: req.body.outcome,
      recheckAttemptId: req.body.recheckAttemptId,
    },
  });

  emitToTeacherRoom(io, event.institutionId, event.classroomId, "intervention.resolved", {
    interventionId: String(req.params.id),
    outcome: req.body.outcome,
    recheckAttemptId: req.body.recheckAttemptId,
    classroomId: event.classroomId,
  });

  res.json({ success: true, data: updated });
});

router.post("/:id/snooze", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), validate(snoozeInterventionSchema), async (req: Request, res: Response) => {
  const updated = await prisma.interventionEvent.update({
    where: { id: String(req.params.id) },
    data: { status: "SNOOZED", snoozedUntil: new Date(req.body.until) },
  });

  await prisma.interventionAction.create({
    data: {
      interventionId: String(req.params.id),
      actorId: req.actor!.id,
      actionType: "SNOOZE",
      reason: `Snoozed until ${req.body.until}`,
    },
  });

  res.json({ success: true, data: updated });
});

router.post("/:id/dismiss", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), validate(dismissInterventionSchema), async (req: Request, res: Response) => {
  const updated = await prisma.interventionEvent.update({
    where: { id: String(req.params.id) },
    data: { status: "DISMISSED" },
  });

  await prisma.interventionAction.create({
    data: {
      interventionId: String(req.params.id),
      actorId: req.actor!.id,
      actionType: "DISMISS",
      reason: req.body.reason,
    },
  });

  await prisma.auditLog.create({
    data: {
      institutionId: req.actor!.institutionId,
      actorId: req.actor!.id,
      action: "INTERVENTION_DISMISSED",
      resourceType: "InterventionEvent",
      resourceId: String(req.params.id),
      details: { reason: req.body.reason },
    },
  });

  res.json({ success: true, data: updated });
});

export { router as interventionRoutes };

