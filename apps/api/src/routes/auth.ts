import { Router, Request, Response } from "express";
import { prisma } from "@eduadpat/database";
import { requireAuth } from "../middleware/auth";

const router: Router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Email is required" } });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { institution: true },
  });

  if (!user) {
    res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    return;
  }

  const sessionId = crypto.randomUUID();

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId,
      },
      session: { id: sessionId },
    },
  });
});

router.post("/logout", requireAuth, async (_req: Request, res: Response) => {
  res.json({ success: true, data: { message: "Logged out" } });
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.actor!.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      institutionId: true,
    },
  });

  if (!user) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } });
    return;
  }

  res.json({ success: true, data: user });
});

export { router as authRoutes };

