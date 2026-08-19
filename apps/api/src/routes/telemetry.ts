import { Router, Request, Response } from "express";
import { prisma } from "@eduadpat/database";
import { requireAuth } from "../middleware/auth";
import { telemetryBatchSchema } from "@eduadpat/shared";
import { validate } from "../middleware/validate";

const router: Router = Router();

router.post("/", requireAuth, async (req: Request, res: Response) => {
  const event = req.body;
  const created = await prisma.telemetryEvent.create({
    data: {
      eventId: event.eventId || crypto.randomUUID(),
      studentId: req.actor!.id,
      profileNamespace: event.profileNamespace || req.actor!.id,
      deviceId: event.deviceId || "unknown",
      sequence: event.sequence || 0,
      type: event.type,
      payload: event.payload,
      schemaVersion: event.schemaVersion || 1,
      occurredAt: event.occurredAt ? new Date(event.occurredAt) : new Date(),
    },
  });

  res.status(201).json({ success: true, data: { eventId: created.eventId } });
});

router.post("/batch", requireAuth, validate(telemetryBatchSchema), async (req: Request, res: Response) => {
  const { events } = req.body;
  const results = [];

  for (const event of events) {
    try {
      const created = await prisma.telemetryEvent.create({
        data: {
          eventId: event.eventId,
          studentId: req.actor!.id,
          profileNamespace: event.profileNamespace,
          deviceId: event.deviceId,
          sequence: event.sequence || 0,
          type: event.type,
          payload: event.payload,
          schemaVersion: event.schemaVersion || 1,
          occurredAt: new Date(event.occurredAt),
        },
      });
      results.push({ eventId: created.eventId, status: "accepted" });
    } catch (error: any) {
      if (error.code === "P2002") {
        results.push({ eventId: event.eventId, status: "duplicate" });
      } else {
        results.push({ eventId: event.eventId, status: "rejected" });
      }
    }
  }

  res.json({ success: true, data: { results } });
});

export { router as telemetryRoutes };

