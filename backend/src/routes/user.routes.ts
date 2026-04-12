import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { userFeed } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/feed", userAuth, userFeed)

export default userRouter;