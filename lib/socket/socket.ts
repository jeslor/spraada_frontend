import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444";

let socket: Socket | null = null;

export const getSocket = (userId: number): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { userId },
    });

    socket.on("connect", () => {
      // console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }

  return socket;
};
