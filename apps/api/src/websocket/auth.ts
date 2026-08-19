import { Server as SocketIOServer, Socket } from "socket.io";

export function setupSocketAuth(io: SocketIOServer) {
  io.use((socket: Socket, next) => {
    const userId = socket.handshake.auth.userId;
    const role = socket.handshake.auth.role;
    const institutionId = socket.handshake.auth.institutionId;

    if (!userId || !role || !institutionId) {
      next(new Error("Authentication required"));
      return;
    }

    (socket as any).actor = {
      id: userId,
      role,
      institutionId,
    };
    next();
  });
}
