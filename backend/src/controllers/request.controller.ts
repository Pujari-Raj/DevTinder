import { Response } from "express";
import { ApiResponse } from "../@types/type";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ReviewConnectionRequestSchema, ReviewConnectionRequestSchemaType, sendConnectionRequestSchema, SendConnectionRequestSchemaType } from "../validators/request.schema";
import { UserModel } from "../models/user.model";
import { ConnectionRequestModel } from "../models/request.model";

// Send Connection Request
const sendConnectionRequest = AsyncHandler(async (req, res: Response<ApiResponse>) => {
    // Getting user Id of loggedin user
    const senderId = req?.user._id;

    // Validation of data
    const { status, userId: receiverId } = await sendConnectionRequestSchema.validate(req.params as SendConnectionRequestSchemaType, {
        abortEarly: false,
        stripUnknown: true,
    });

    // checking if receviever user exists in DB 
    const receiverExists = await UserModel.findById(receiverId);
    if (!receiverExists) {
        throw new ErrorHandler("User Does not exist", 404);
    }

    // check if sender & recevier is not same 
    if (String(senderId) === String(receiverId)) {
        throw new ErrorHandler("You cannot send request to yourself", 409)
    }

    //checking if connection request is already sent to user(request exists in DB)
        const connectionRequestExists = await ConnectionRequestModel.findOne({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    });
    if (connectionRequestExists) {
        throw new ErrorHandler("Connection request already exists", 409);
    }

    // Creating new connection request
    const newConnectionRequest = await ConnectionRequestModel.create({
        senderId,
        receiverId,
        status
    });

    const connectionRequestData = await newConnectionRequest.populate([
        { path: "senderId", select: "name" },
        { path: "receiverId", select: "name" }
    ])

    // Retuning response

    res.status(201).json({
        success: true,
        message: status === "interested" ? "You made a move" : "Hard Pass",
        data: connectionRequestData
    })
})

// Review connection request
const reviewConnectionRequest = AsyncHandler(async (req, res: Response<ApiResponse>) => {
    // Get logged in user's id
    const receiverId = req.user._id;

    // Validation of data
    const { status, requestId } = await ReviewConnectionRequestSchema.validate(req.params as ReviewConnectionRequestSchemaType, {
        abortEarly: false,
        stripUnknown: true
    });

    // Check if the connection request exists in the db or not
    const connectionRequestExists = await ConnectionRequestModel.findOne({
        _id: requestId,
        receiverId,
        status: "interested"
    });
    if (!connectionRequestExists) {
        throw new ErrorHandler("Connection request does not exists", 404);
    }

    // Update and save connection request status
    connectionRequestExists.status = status;
    await connectionRequestExists.save({ validateBeforeSave: false });

    // Populate the connection request data
    const connectionRequestData = await connectionRequestExists.populate([
        { path: "senderId", select: "name" },
        { path: "receiverId", select: "name" }
    ]);

    // Return the response
    res.status(200).json({
        success: true,
        message: status === "accepted" ? "🎉 It’s a match" : "😬 Rejected. Keep swiping",
        data: connectionRequestData
    });
});

export { sendConnectionRequest, reviewConnectionRequest }