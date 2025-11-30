export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const badRequest = (msg = "Bad Request") => new ApiError(msg, 400);
export const unauthorized = (msg = "Unauthorized") => new ApiError(msg, 401);
export const forbidden = (msg = "Forbidden") => new ApiError(msg, 403);
export const notFound = (msg = "Not Found") => new ApiError(msg, 404);
