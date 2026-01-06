import { NextFunction, Request, RequestHandler, Response } from "express";

// Async await handler
const AsyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

// Error Handler
class ErrorHandler extends Error {
  public statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message),
      this.statusCode = statusCode,
      Error?.captureStackTrace(this, this.constructor);
  }
}

export { AsyncHandler, ErrorHandler };
