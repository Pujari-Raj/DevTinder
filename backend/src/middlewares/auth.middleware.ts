import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import jwt from 'jsonwebtoken'
import { UserModel } from "../models/user.model";
import {env} from '../config/config'

export const userAuth = AsyncHandler(async (req, _res, next) => {
    // Get token from request cookies
    const { devTinderToken } = req.cookies;

    // Validation of token
    if (!devTinderToken) {
        throw new ErrorHandler("Please login to continue", 401);
    }

    // Decode the token
    const decodedPayload = jwt.verify(devTinderToken, env.JWT_SECRET as string) as { _id: string };

    // Get the user details
    const user = await UserModel.findById(decodedPayload._id);
    if (!user) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Pass the decoded payload and user details
    req.decoded = decodedPayload;
    req.user = user;

    // Move to next handler function
    next();
})