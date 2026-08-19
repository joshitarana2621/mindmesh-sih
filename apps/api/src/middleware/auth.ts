import { Request, Response, NextFunction } from "express";

function extractSession(req: Request): { id: string; role: string; institutionId: string; sessionId: string } | null {
  const sessionUser = req.headers["x-session-user"] as string;
  const sessionRole = req.headers["x-session-role"] as string;
  const sessionInst = req.headers["x-session-institution"] as string;
  const sessionId = req.headers["x-session-id"] as string;

  if (sessionUser && sessionRole && sessionInst) {
    return {
      id: sessionUser,
      role: sessionRole,
      institutionId: sessionInst,
      sessionId: sessionId || "unknown",
    };
  }
  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = extractSession(req);
  if (!session) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    return;
  }
  req.actor = session;
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.actor) {
      res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
      return;
    }
    if (!roles.includes(req.actor.role)) {
      res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Insufficient permissions" } });
      return;
    }
    next();
  };
}
