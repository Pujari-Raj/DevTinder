import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/handlers";

export const errorMiddleware: ErrorRequestHandler = (
  err: ErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err?.statusCode || 500;
  console.log('before sedning response');
  
  // Returning the response with message, success
  res.status(status).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
};
