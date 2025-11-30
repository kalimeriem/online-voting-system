import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	const isDev = process.env.NODE_ENV !== "production";
	if (err instanceof ApiError) {
		const payload = { success: false, message: err.message };
		if (isDev) (payload as any).stack = err.stack;
		return res.status(err.statusCode).json(payload);
	}

	// Unknown error
	console.error(err);
	const message = isDev ? err.message || "Internal Server Error" : "Internal Server Error";
	const payload: any = { success: false, message };
	if (isDev) payload.stack = err.stack;
	res.status(500).json(payload);
}
