import { Request, Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/type";
import mongoose from "mongoose";
import { UserModel } from "../models/user.model";
import { ConnectionRequestModel } from "../models/request.model";
import { Chat, ChatModel } from "../models/chat.model";
import { MessageModel } from "../models/message.model";

// send Message
const sendMessage = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const loggedInUser = req.user;

    console.log("LoggedIn User:", loggedInUser?._id);
    const { receiverId } = req.params;
    const { text } = req.body;

    console.log("Receiver Id:", receiverId);
    console.log("Message Text:", text);

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

    if (loggedInUser._id.toString() === receiverId) {
      throw new ErrorHandler("You cannot message yourself", 400);
    }

    /*** CHECK RECEIVER EXISTS ***/

    const receiver = await UserModel.findById(receiverId);

    if (!receiver) {
      throw new ErrorHandler("Receiver not found", 404);
    }

    /*** CHECK CONNECTION ***/

    console.log({
      sender: loggedInUser._id.toString(),
      receiver: receiverId,
    });

    const connection = await ConnectionRequestModel.findOne({
      status: "accepted",
      $or: [
        {
          senderId: loggedInUser._id,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: loggedInUser._id,
        },
      ],
    });

    console.log("Connection:", connection);

    if (!connection) {
      throw new ErrorHandler("Users are not connected", 403);
    }

    /**
     * -------------------------
     * FIND EXISTING CHAT
     * -------------------------
     */

    let chat = await ChatModel.findOne({
      participants: {
        $all: [loggedInUser._id, receiverId],
      },
    });

    /**
     * -------------------------
     * CREATE CHAT
     * -------------------------
     */

    if (!chat) {
      chat = await ChatModel.create({
        participants: [loggedInUser._id, receiverId],
      });
    }

    /**
     * -------------------------
     * CREATE MESSAGE
     * -------------------------
     */

    const message = await MessageModel.create({
      chatId: chat._id,
      senderId: loggedInUser._id,
      receiverId,
      text: text.trim(),
    });

    /**
     * -------------------------
     * UPDATE CHAT
     * -------------------------
     */

    chat.lastMessage = message.text;
    chat.lastMessageAt = new Date();
    chat.lastMessageSenderId = loggedInUser?._id;

    await chat.save();

    /**
     * -------------------------
     * TODO (Socket.IO)
     * -------------------------
     *
     * 1. Find receiver socket.
     * 2. Emit newMessage event.
     * 3. Emit updated chat list.
     * 4. Update unread count.
     *
     */

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
    /**
     * -------------------------
     * GET REQUEST DATA
     * -------------------------
     */
    const loggedInUser = req.user;
    const { chatId } = req.params;

    console.log("Chat Id:", chatId);
    console.log("Logged In User:", loggedInUser?._id);

    /**
     * -------------------------
     * VALIDATIONS
     * -------------------------
     */

    if (!chatId) {
      throw new ErrorHandler("Chat Id is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      throw new ErrorHandler("Invalid Chat Id", 400);
    }

    /**
     * -------------------------
     * CHECK CHAT EXISTS
     * -------------------------
     */

    const chat = await ChatModel.findById(chatId) as Chat | null;

    if (!chat) {
      throw new ErrorHandler("Chat not found", 404);
    }

    /**
     * -------------------------
     * AUTHORIZATION
     * -------------------------
     * Logged-in user should be one of the
     * participants of this chat.
     */

    const isParticipant = chat.participants.some(
      (participant) => participant.toString() === loggedInUser._id.toString(),
    );

    if (!isParticipant) {
      throw new ErrorHandler("Unauthorized access to this chat", 403);
    }

    /**
     * -------------------------
     * FETCH MESSAGES
     * -------------------------
     */

    const messages = await MessageModel.find({
      chatId,
    })
      .sort({ createdAt: 1 })
      .lean();

    /**
     * -------------------------
     * SUCCESS RESPONSE
     * -------------------------
     */

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully.",
      data: messages,
    });
  },
);

// get All Messages of loggedIn user

const getAllMessages = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    // getting loggedIn user data
  },
);

const getUserChats = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const loggedInUser = req.user;

    const chats = await ChatModel.find({
      participants: loggedInUser._id,
    })
      .populate("participants", "name photoUrl")
      .sort({ lastMessageAt: -1 })
      .lean();

    const formattedChats = chats.map((chat) => {
      const participant = chat.participants.find(
        (user: any) => user._id.toString() !== loggedInUser._id.toString()
      );

      return {
        chatId: chat._id,
        participant,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        lastMessageSenderId: chat.lastMessageSenderId,
        isLastMessageSentByLoggedInUser: chat.lastMessageSenderId?.toString() === loggedInUser._id.toString(),
      };
    });

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully.",
      data: formattedChats,
    });
  }
);

export { sendMessage, getMessagesByChatId, getAllMessages, getUserChats };
