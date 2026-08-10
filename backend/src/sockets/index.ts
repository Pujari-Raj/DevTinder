import http from "http";
import { Server } from "socket.io";
import { env } from "../config/config";
import { socketAuth } from "./socket.auth";
import { registerChatHandlers } from "./chat.handler";
import { ChatServer, setIO } from "./io";
import { userRoom } from "./socket.types";

/**
 * Attaches Socket.IO to the existing HTTP server.
 *
 * Sharing the server (rather than listening on a second port) is what lets the
 * handshake reuse the `devTinderToken` cookie and the same CORS origin as the
 * REST API.
 */
export const initSocket = (server: http.Server): ChatServer => {
  const io: ChatServer = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  // Authenticate the handshake before any event handler exists on the socket.
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const { userId, userName } = socket.data;

    /**
     * Every user joins a private room named after their id. Pushing to
     * `user:<id>` reaches all of that user's tabs and devices at once, and means
     * we never have to maintain a manual socketId lookup table.
     */
    socket.join(userRoom(userId));

    // Tell the client which account the cookie authenticated as. The client
    // needs its own id to tell its messages apart from the other participant's.
    socket.emit("session:ready", { _id: userId, name: userName });

    registerChatHandlers(socket);

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Socket disconnected (${userName}): ${reason}`);
    });
  });

  setIO(io);

  console.log("⚡ Socket.IO is ready");

  return io;
};

export { getIO, tryGetIO } from "./io";
