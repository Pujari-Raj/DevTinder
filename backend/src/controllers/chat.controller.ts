import { Request, Response } from "express";
import { AsyncHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/type";
import {
  getMessagesService,
  getUserChatsService,
  sendMessageService,
} from "../services/chat.service";
import { broadcastNewMessage } from "../sockets/chat.broadcast";

/**
 * HTTP transport for the chat feature.
 *
 * All rules live in ../services/chat.service.ts — these handlers only translate
 * between HTTP and the service. The Socket.IO handlers call the same service.
 */

// send Message
const sendMessage = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const { receiverId } = req.params;
    const { text } = req.body;

    const { message, chat } = await sendMessageService({
      senderId: req.user._id,
      receiverId,
      text,
    });

    // Keep the two transports in sync: a message posted over HTTP is pushed to
    // any connected socket clients exactly as a `chat:send` would be.
    await broadcastNewMessage({
      chatId: chat._id,
      participantIds: chat.participants,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  },
);

// Get Messages By Chat Id
const getMessagesByChatId = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const { chatId } = req.params;

    const messages = await getMessagesService({
      userId: req.user._id,
      chatId,
    });

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully.",
      data: messages,
    });
  },
);

// get All Chats of loggedIn user
const getUserChats = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const chats = await getUserChatsService({ userId: req.user._id });

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully.",
      data: chats,
    });
  },
);

export { sendMessage, getMessagesByChatId, getUserChats };
