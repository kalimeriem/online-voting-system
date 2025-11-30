import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import * as userService from "./user.service";

interface AuthRequest extends Request {
  user?: { userId: number; email?: string };
}

export const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userService.getProfile(req.user!.userId);
  res.json({ success: true, data: user });
});

export const getDashboard = catchAsync(async (req: AuthRequest, res: Response) => {
  const dashboard = await userService.getDashboard(req.user!.userId, req.user!.email);
  res.json({ success: true, data: dashboard });
});
