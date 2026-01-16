import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/handlers";
import { ValidationError } from "yup";

export const errorMiddleware: ErrorRequestHandler = (
  err: ErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Yup Validation error
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      errors: err?.errors,
    });
  }

  if (err.statusCode) {
    return res.status(err?.statusCode).json({
      success: false,
      errors: err?.message,
    });
  }

  console.log("before sedning response");

  // Returning the response with message, success
  res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
};
