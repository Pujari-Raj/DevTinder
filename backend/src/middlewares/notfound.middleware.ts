import { RequestHandler } from "express";
import { ErrorHandler } from "../utils/handlers";

export const notfoundMiddleware: RequestHandler = (req, res, next) => {
  // Returning the response
  const error = new ErrorHandler(
    `Route ${req.method} ${req.originalUrl} not found`,
    404
  );

  next(error);
};
