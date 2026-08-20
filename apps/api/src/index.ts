import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { v4 as uuidv4 } from "uuid";

import { authRoutes } from "./routes/auth";
import { studentRoutes } from "./routes/students";
import { classroomRoutes } from "./routes/classrooms";
import { quizRoutes } from "./routes/quizzes";
import { syncRoutes } from "./routes/sync";
import { telemetryRoutes } from "./routes/telemetry";
import { interventionRoutes } from "./routes/interventions";
import { peerPodRoutes } from "./routes/peer-pods";
import { rotationRoutes } from "./routes/rotations";
import { remediationRoutes } from "./routes/remediation";
import { errorHandler } from "./middleware/error";
import { requestLogger } from "./middleware/request-id";
import { setupSocketAuth } from "./websocket/auth";
import { registerSocketHandlers } from "./websocket/handlers";

const app: express.Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  },
});

app.use(helmet());
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("combined"));
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/classrooms", classroomRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1/sync", syncRoutes);
app.use("/api/v1/telemetry", telemetryRoutes);
app.use("/api/v1/interventions", interventionRoutes);
app.use("/api/v1/peer-pods", peerPodRoutes);
app.use("/api/v1/classrooms", rotationRoutes);
app.use("/api/v1", remediationRoutes);

setupSocketAuth(io);
registerSocketHandlers(io);

app.use(errorHandler);

const PORT = parseInt(process.env.PORT || "3001", 10);
httpServer.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Socket.IO ready`);
});

export { app, io };

