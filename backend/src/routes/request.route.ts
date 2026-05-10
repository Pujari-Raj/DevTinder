import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { reviewConnectionRequest, sendConnectionRequest } from "../controllers/request.controller";

const requestRouter = Router();

requestRouter.post("/send/:status/:userId", userAuth, sendConnectionRequest)
requestRouter.patch("/review/:status/:requestId", userAuth, reviewConnectionRequest)

export default requestRouter;