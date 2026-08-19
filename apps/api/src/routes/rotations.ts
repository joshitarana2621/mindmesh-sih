import { Router, Request, Response } from "express";
import { prisma } from "@eduadpat/database";
import { requireAuth, requireRole } from "../middleware/auth";
import { createRotationPlanSchema } from "@eduadpat/shared";
import { validate } from "../middleware/validate";

const router: Router = Router();

router.post("/:classroomId/rotation-plans", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), validate(createRotationPlanSchema), async (req: Request, res: Response) => {
  const classroomId: string = String(req.params.classroomId);
  const { name, stationCount, slotDurationMinutes, totalSlots } = req.body;

  const members = await prisma.classroomMember.findMany({
    where: { classroomId: classroomId as string, role: "STUDENT" },
  });

  const stations = ["DIGITAL", "TEACHER", "PEER"];
  const groupCount = Math.min(members.length, stationCount);
  const assignments = [];

  for (let slot = 0; slot < totalSlots; slot++) {
    for (let group = 0; group < groupCount; group++) {
      const stationIndex = (group + slot) % stations.length;
      const startIdx = Math.floor((group / groupCount) * members.length);
      const endIdx = Math.floor(((group + 1) / groupCount) * members.length);
      const studentIds = members.slice(startIdx, endIdx).map((m) => m.userId);

      assignments.push({
        groupNumber: group + 1,
        slotIndex: slot,
        station: stations[stationIndex],
        studentIds,
      });
    }
  }

  const plan = await prisma.rotationPlan.create({
    data: {
      classroomId,
      name,
      stationCount,
      slotDurationMinutes,
      totalSlots,
      status: "DRAFT",
      createdBy: req.actor!.id,
      assignments: {
        create: assignments,
      },
    },
    include: { assignments: true },
  });

  res.status(201).json({ success: true, data: plan });
});

router.post("/:classroomId/start-session", requireAuth, requireRole("TEACHER", "INSTITUTION_ADMIN"), async (req: Request, res: Response) => {
  const classroomId: string = String(req.params.classroomId);
  const { planId } = req.body;

  const plan = await prisma.rotationPlan.update({
    where: { id: planId },
    data: { status: "ACTIVE", startedAt: new Date() },
    include: { assignments: true },
  });

  res.json({ success: true, data: plan });
});

export { router as rotationRoutes };



