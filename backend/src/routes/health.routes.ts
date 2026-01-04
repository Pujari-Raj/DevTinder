import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    succes: true,
    message: "health check is running",
    uptime: process.uptime(),
    timeStamp: new Date().toISOString(),
  });
});

export default healthRouter;