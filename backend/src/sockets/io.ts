import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./socket.types";

export type ChatServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

/**
 * Holds the single Socket.IO server instance.
 *
 * Kept in its own module so anything that needs to push an event (including the
 * REST controllers) can reach the server without importing the socket bootstrap
 * and creating an import cycle.
 */
let io: ChatServer | null = null;

export const setIO = (instance: ChatServer) => {
  io = instance;
};

/** For callers that cannot proceed without sockets. */
export const getIO = (): ChatServer => {
  if (!io) {
    throw new Error("Socket.IO has not been initialised yet");
  }

  return io;
};

/**
 * For callers that should keep working when sockets are unavailable — the REST
 * endpoints must not fail just because no socket server is running (tests,
 * scripts). Returns null instead of throwing.
 */
export const tryGetIO = (): ChatServer | null => io;
