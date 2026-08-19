import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error(`[${req.correlationId || "no-id"}] Error:`, err.message);

  if (err.message.includes("not found") || err.message.includes("Not found")) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: err.message } });
    return;
  }

  if (err.message.includes("duplicate") || err.message.includes("unique")) {
    res.status(409).json({ success: false, error: { code: "CONFLICT", message: err.message } });
    return;
  }

  if (err.message.includes("unauthorized") || err.message.includes("Forbidden")) {
    res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: err.message } });
    return;
  }

  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
  });
}
