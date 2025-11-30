import { Request, Response } from "express";
import * as authService from "./auth.service";
import catchAsync from "../../utils/catchAsync";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const result = await authService.registerUser(email, password, name);
  res.status(201).json({ success: true, data: result });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.status(200).json({ success: true, data: result });
});
