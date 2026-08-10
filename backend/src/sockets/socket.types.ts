/**
 * The Socket.IO wire contract.
 *
 * These maps are handed to `Server<...>` / `Socket<...>` so that every `emit`
 * and `on` in the socket layer is type-checked: a typo in an event name or a
 * wrong payload shape becomes a compile error rather than a silent no-op.
 *
 * The DTO interfaces describe exactly what crosses the wire. The frontend
 * mirrors them in `src/@types/chat.ts`.
 */

/*** DTOs — what a client actually receives ***/

export interface MessageDTO {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipantDTO {
  _id: string;
  name: string;
  photoUrl?: string;
}

export interface ChatSummaryDTO {
  chatId: string;
  participant: ChatParticipantDTO | null;
  lastMessage: string;
  lastMessageAt: string | null;
  lastMessageSenderId: string | null;
  isLastMessageSentByLoggedInUser: boolean;
}

export interface SessionDTO {
  _id: string;
  name: string;
}

/*** Acknowledgements ***/

/**
 * Socket.IO acknowledgements give us request/response semantics over a socket,
 * which is what makes event-for-endpoint parity with the REST API possible.
 *
 * Modelled as a discriminated union so a client that checks `success` gets
 * `data` narrowed automatically.
 */
export type SocketAck<TData> =
  | { success: true; message: string; data: TData }
  | { success: false; message: string; statusCode: number };

/*** Event maps ***/

export interface ClientToServerEvents {
  // Mirrors GET /api/v1/chat/allChats
  "chat:list": (ack: (response: SocketAck<ChatSummaryDTO[]>) => void) => void;

  // Mirrors GET /api/v1/chat/messages/:chatId
  "chat:messages": (
    payload: { chatId: string },
    ack: (
      response: SocketAck<{ chatId: string; messages: MessageDTO[] }>,
    ) => void,
  ) => void;

  // Mirrors POST /api/v1/chat/send/:receiverId
  "chat:send": (
    payload: { receiverId: string; text: string },
    ack: (
      response: SocketAck<{ chatId: string; message: MessageDTO }>,
    ) => void,
  ) => void;
}

export interface ServerToClientEvents {
  // Emitted once on connect so the client knows who the cookie authenticated as
  "session:ready": (payload: SessionDTO) => void;

  // Pushed to both participants when a message is created (via REST or socket)
  "chat:newMessage": (payload: {
    chatId: string;
    message: MessageDTO;
  }) => void;

  // Pushed to a single user with their own freshly recomputed chat list
  "chat:listUpdated": (payload: ChatSummaryDTO[]) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

/** Populated by the handshake auth middleware, available as `socket.data`. */
export interface SocketData {
  userId: string;
  userName: string;
}

/** Every user gets a private room, so we can push to them by id. */
export const userRoom = (userId: string) => `user:${userId}`;
