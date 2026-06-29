import { Request, Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/type";
import mongoose from "mongoose";
import { UserModel } from "../models/user.model";
import { ConnectionRequestModel } from "../models/request.model";
import { ChatModel } from "../models/chat.model";
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

// get Message By chatId

const getMessagesByChatId = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    // getting loggedIn user data
  },
);

// get All Messages of loggedIn user

const getAllMessages = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    // getting loggedIn user data
  },
);

export { sendMessage, getMessagesByChatId, getAllMessages };
