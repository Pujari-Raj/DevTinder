import express from "express";
import healthRouter from "./routes/health.routes";
import http from "http";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/v1/health", healthRouter);

const server = http.createServer(app);

export { app, server };
