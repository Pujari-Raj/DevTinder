import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { viewProfile, editProfile } from "../controllers/profile.controller";

const profileRouter = Router();
profileRouter.get("/view", userAuth, viewProfile);
profileRouter.patch("/update", userAuth, editProfile);

export default profileRouter;