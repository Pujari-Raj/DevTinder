// feed route

import { Request, Response } from "express";
import { ApiResponse } from "../@types/type";
import { AsyncHandler } from "../utils/handlers";
import { ConnectionRequestModel } from "../models/request.model";
import { UserModel } from "../models/user.model";

const USER_DATA = "name gender age photoUrl about skills";

// Get user feed
const userFeed = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    // Getting loggedIN user details
    const loggedInUser = req?.user;
    const loggedInUserId = req.user._id;

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get all users connected to loggedIn user
    const allConnectedUsers = await ConnectionRequestModel.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    // excluding users
    const excludeIds = new Set<String>();
    excludeIds.add(loggedInUser?._id.toString());

    const allUsers = await UserModel.find();

    allConnectedUsers.forEach(({ senderId, receiverId }) => {
      excludeIds.add(senderId.toString());
      excludeIds.add(receiverId.toString());
    });

    const users = await UserModel.find({
      _id: {
        $nin: Array.from(excludeIds),
      },
    })
      .select(USER_DATA)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await UserModel.countDocuments({
      _id: {
        $nin: Array.from(excludeIds),
      },
    });

    // Returning response

    res.status(200).json({
      success: true,
      message: "Users Feteched successfully",
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasMore: page * limit < totalUsers,
      },
    });
  },
);

// Get all connection request received to loggedIn user

const fetchConnectionRequests = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    // getting loggedIn user data
    const userData = req?.user;
    const loggedInUserId = req?.user?._id;

    const connectionRequestsReceived = await ConnectionRequestModel.find({
      receiverId: loggedInUserId,
      status: "interested",
    })
      .select("senderId")
      .populate({ path: "senderId", select: USER_DATA });

    // Returning response
    res.status(200).json({
      success: true,
      message: "Connection Requests Feteched successfully",
      data: connectionRequestsReceived,
    });
  },
);

// Get all connections of loggedIn user

const fetchConnections = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    // getting loggedIn user data
    const userData = req?.user;
    const loggedInUserId = req?.user?._id;

    const allConnections = await ConnectionRequestModel.find({
      $or: [
        {
          senderId: loggedInUserId,
          status: "accepted",
        },
        {
          receiverId: loggedInUserId,
          status: "accepted",
        }
      ],
    }).populate([
      {path : "senderId", select: USER_DATA},
      {path : "receiverId", select: USER_DATA},
    ]);

    const allConnectionsFormattedData = allConnections.map(connection => {
      if(String(connection.senderId._id) === String(loggedInUserId)) {
        return connection.receiverId;
      }
      return connection.senderId;
    });

    //
    res.status(200).json({
      success: true,
      message: "Connections Feteched successfully",
      data: allConnectionsFormattedData,
    })
  },
);

export { userFeed, fetchConnectionRequests, fetchConnections };
