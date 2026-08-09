import mongoose, { Types } from "mongoose";
import { ErrorHandler } from "../utils/handlers";
import { UserModel } from "../models/user.model";
import { ConnectionRequestModel } from "../models/request.model";
import { Chat, ChatModel } from "../models/chat.model";
import { MessageModel } from "../models/message.model";

/**
 * Shared chat business logic.
 *
 * Both the REST controllers and the Socket.IO handlers call into this file, so
 * the rules (who may message whom, when a Chat is created, how a chat list is
 * shaped) are defined exactly once and cannot drift between transports.
 *
 * Everything in here throws `ErrorHandler`, which carries a `statusCode`.
 * The REST layer forwards it to the global error middleware; the socket layer
 * maps it into an error acknowledgement.
 */

// A participant once it has been populated with `name photoUrl`
export interface ChatParticipant {
  _id: Types.ObjectId;
  name: string;
  photoUrl?: string;
}

// Shape of a single row in a user's chat list
export interface FormattedChat {
  chatId: Types.ObjectId;
  participant?: ChatParticipant;
  lastMessage: string;
  lastMessageAt: Date | null;
  lastMessageSenderId: Types.ObjectId | null;
  isLastMessageSentByLoggedInUser: boolean;
}

type UserId = Types.ObjectId | string;

const toId = (value: UserId) => String(value);

/**
 * Create a message between two connected users, creating the Chat on demand.
 *
 * Returns the created message plus the chat it belongs to, so callers can
 * report the `chatId` back to a client that did not know it yet (the very
 * first message of a conversation).
 */
export const sendMessageService = async ({
  senderId,
  receiverId,
  text,
}: {
  senderId: UserId;
  receiverId?: string;
  text?: string;
}) => {
  /*** VALIDATIONS ***/

  if (!receiverId) {
    throw new ErrorHandler("Receiver Id is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new ErrorHandler("Invalid Receiver Id", 400);
  }

  if (!text || text.trim() === "") {
    throw new ErrorHandler("Message cannot be empty", 400);
  }

  if (toId(senderId) === receiverId) {
    throw new ErrorHandler("You cannot message yourself", 400);
  }

  /*** CHECK RECEIVER EXISTS ***/

  const receiver = await UserModel.findById(receiverId);

  if (!receiver) {
    throw new ErrorHandler("Receiver not found", 404);
  }

  /*** CHECK CONNECTION ***/

  const connection = await ConnectionRequestModel.findOne({
    status: "accepted",
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });

  if (!connection) {
    throw new ErrorHandler("Users are not connected", 403);
  }

  /*** FIND OR CREATE CHAT ***/

  let chat = await ChatModel.findOne({
    participants: {
      $all: [senderId, receiverId],
    },
  });

  if (!chat) {
    chat = await ChatModel.create({
      participants: [senderId, receiverId],
    });
  }

  /*** CREATE MESSAGE ***/

  const message = await MessageModel.create({
    chatId: chat._id,
    senderId,
    receiverId,
    text: text.trim(),
  });

  /*** UPDATE CHAT PREVIEW ***/

  chat.lastMessage = message.text;
  chat.lastMessageAt = new Date();
  chat.lastMessageSenderId = senderId;

  await chat.save();

  return { message, chat };
};

/**
 * Fetch every message in a chat, oldest first.
 *
 * Authorization is enforced here: the requesting user must be a participant of
 * the chat, otherwise any signed-in user could read any conversation by id.
 */
export const getMessagesService = async ({
  userId,
  chatId,
}: {
  userId: UserId;
  chatId?: string;
}) => {
  /*** VALIDATIONS ***/

  if (!chatId) {
    throw new ErrorHandler("Chat Id is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new ErrorHandler("Invalid Chat Id", 400);
  }

  /*** CHECK CHAT EXISTS ***/

  const chat = (await ChatModel.findById(chatId)) as Chat | null;

  if (!chat) {
    throw new ErrorHandler("Chat not found", 404);
  }

  /*** AUTHORIZATION ***/

  const isParticipant = chat.participants.some(
    (participant) => participant.toString() === toId(userId),
  );

  if (!isParticipant) {
    throw new ErrorHandler("Unauthorized access to this chat", 403);
  }

  /*** FETCH MESSAGES ***/

  return MessageModel.find({ chatId }).sort({ createdAt: 1 }).lean();
};

/**
 * Build the chat list for a user: one row per conversation, most recently
 * active first, with the *other* participant resolved for display.
 */
export const getUserChatsService = async ({
  userId,
}: {
  userId: UserId;
}): Promise<FormattedChat[]> => {
  const chats = await ChatModel.find({
    participants: userId,
  })
    .populate("participants", "name photoUrl")
    .sort({ lastMessageAt: -1 })
    .lean();

  return chats.map((chat) => {
    const participant = chat.participants.find(
      (user: ChatParticipant) => user._id.toString() !== toId(userId),
    );

    return {
      chatId: chat._id,
      participant,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      lastMessageSenderId: chat.lastMessageSenderId,
      isLastMessageSentByLoggedInUser:
        chat.lastMessageSenderId?.toString() === toId(userId),
    };
  });
};
