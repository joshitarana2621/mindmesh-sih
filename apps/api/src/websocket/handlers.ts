import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "@eduadpat/database";

export function registerSocketHandlers(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    const actor = (socket as any).actor;
    console.log(`Socket connected: ${actor.id} (${actor.role})`);

    socket.on("join:classroom", async (classroomId: string) => {
      const member = await prisma.classroomMember.findFirst({
        where: {
          userId: actor.id,
          classroomId,
          role: { in: ["TEACHER", "ASSISTANT"] },
        },
      });

      if (!member && actor.role !== "INSTITUTION_ADMIN") {
        socket.emit("error", { message: "Not authorized for this classroom" });
        return;
      }

      const roomName = `institution:${actor.institutionId}:classroom:${classroomId}:teacher`;
      socket.join(roomName);
      socket.emit("joined:classroom", { classroomId, room: roomName });
    });

    socket.on("leave:classroom", (classroomId: string) => {
      const roomName = `institution:${actor.institutionId}:classroom:${classroomId}:teacher`;
      socket.leave(roomName);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${actor.id}`);
    });
  });
}

export function emitToTeacherRoom(
  io: SocketIOServer,
  institutionId: string,
  classroomId: string,
  event: string,
  payload: unknown
) {
  const roomName = `institution:${institutionId}:classroom:${classroomId}:teacher`;
  io.to(roomName).emit(event, {
    eventVersion: 1,
    eventId: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
    correlationId: crypto.randomUUID(),
    payload,
  });
}
