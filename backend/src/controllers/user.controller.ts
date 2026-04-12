// feed route

import { Request, Response } from "express";
import { ApiResponse } from "../@types/type";
import { AsyncHandler } from "../utils/handlers";
import { ConnectionRequestModal } from "../models/request.model";
import { UserModel } from "../models/user.model";

const USER_DATA = "name gender age photoUrl about skills";

const userFeed = AsyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    console.log("inside feed route");

    // Getting loggedIN user details
    const loggedInUser = req?.user;
    const loggedInUserId = req.user._id;

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get all users connected to loggedIn user
    const allConnectedUsers = await ConnectionRequestModal.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    console.log("Connected Users Count:", allConnectedUsers.length);
    console.log("Connected Users:", allConnectedUsers);

    // excluding users
    const excludeIds = new Set<String>();
    excludeIds.add(loggedInUser?._id.toString());

    console.log("ExcludeIds:", excludeIds);
    console.log("LoggedInUserId:", loggedInUserId.toString());

    const allUsers = await UserModel.find();
    console.log("Total users in DB:", allUsers.length);

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

    console.log("Filtered Users:", users.length);

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

export { userFeed };
