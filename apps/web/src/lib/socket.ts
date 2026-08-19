import { io, Socket } from "socket.io-client";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";
let socket: Socket | null = null;
export function getSocket(): Socket {
  if (!socket) {
    const stored = typeof window !== "undefined" ? localStorage.getItem("eduadpat-session") : null;
    const auth = stored ? JSON.parse(stored) : { userId: "anon", role: "STUDENT", institutionId: "none" };
    socket = io(WS_URL, { auth, autoConnect: false, reconnection: true, reconnectionAttempts: 10, reconnectionDelay: 1000 });
  }
  return socket;
}
export function connectSocket() { const s = getSocket(); if (!s.connected) s.connect(); }
export function disconnectSocket() { if (socket) { socket.disconnect(); socket = null; } }
export function joinClassroom(classroomId: string) { getSocket().emit("join:classroom", classroomId); }
export function leaveClassroom(classroomId: string) { getSocket().emit("leave:classroom", classroomId); }
