import { AsyncHandler } from "../utils/handlers";
import jwt from 'jsonwebtoken'
import { UserModel } from "../models/user.model";

export const userAuth = AsyncHandler(async (req, res, next) => {
    // getting token from cookies
  
    const token = req?.cookies?.devTinderToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User Unauthorized"
        })
    }

    //checking if token is available
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // checking if user is there in DB
    const user = UserModel.findById(decodedUser?.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User Not Found'
        })
    }

    (req as any).user = user;
    next();
})