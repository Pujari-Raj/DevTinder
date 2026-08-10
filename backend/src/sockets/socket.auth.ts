import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { env } from "../config/config";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./socket.types";

type AuthSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

/**
 * Minimal cookie-header parser.
 *
 * The socket handshake is a plain HTTP upgrade request, so it carries the same
 * `devTinderToken` cookie as any REST call — but `cookie-parser` is Express
 * middleware and never runs here. Parsing the raw header keeps the socket layer
 * dependency-free.
 */
const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex === -1) return acc;

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();

    if (key) acc[key] = decodeURIComponent(value);

    return acc;
  }, {});
};

/**
 * Handshake gate — the socket equivalent of `userAuth`.
 *
 * Runs once per connection, before any event handler is registered, so an
 * unauthenticated socket never reaches the chat handlers. The authenticated
 * identity is cached on `socket.data`, which means we do one user lookup per
 * connection instead of one per message (the REST middleware does one per
 * request).
 *
 * Note the `catch`: `jwt.verify` throws on an expired or tampered token, and
 * that is reported as a connection error the client can react to.
 */
export const socketAuth = async (
  socket: AuthSocket,
  next: (err?: Error) => void,
) => {
  try {
    const { devTinderToken } = parseCookies(socket.handshake.headers.cookie);

    if (!devTinderToken) {
      return next(new Error("Please login to continue"));
    }

    const decodedPayload = jwt.verify(devTinderToken, env.JWT_SECRET) as {
      _id: string;
    };

    const user = await UserModel.findById(decodedPayload._id).select("name");

    if (!user) {
      return next(new Error("User does not exists"));
    }

    socket.data.userId = String(user._id);
    socket.data.userName = user.name;

    return next();
  } catch {
    return next(new Error("Session is invalid or has expired"));
  }
};
