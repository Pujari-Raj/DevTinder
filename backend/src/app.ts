import express from "express";
import healthRouter from "./routes/health.routes";
import http from "http";
import { errorMiddleware } from "./middlewares/error.middleware";
import { ErrorHandler } from "./utils/handlers";
import { notfoundMiddleware } from "./middlewares/notfound.middleware";
import authRouter from "./routes/auth.routes";

const app = express();

// test comment
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);

//  test route
// app.use((_req, _res, next) => {
//     next(new ErrorHandler("Route Not Found", 404));
// })

// notfound Middleware , 404 Handler
app.use(notfoundMiddleware);

// Global ErrorMiddleware
app.use(errorMiddleware);

const server = http.createServer(app);

export { app, server };
