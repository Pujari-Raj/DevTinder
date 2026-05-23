import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { userFeed,fetchConnectionRequests, fetchConnections } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/feed", userAuth, userFeed);
userRouter.get("/requests/received", userAuth, fetchConnectionRequests);
userRouter.get("/connections", userAuth, fetchConnections)

export default userRouter;