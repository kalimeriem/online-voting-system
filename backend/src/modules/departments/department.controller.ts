import { Request, Response } from "express";
import * as departmentService from "./department.service";
import catchAsync from "../../utils/catchAsync";

interface AuthRequest extends Request {
  user?: { userId: number };
}

export const createDepartment = catchAsync(async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;
  const department = await departmentService.createDepartment(
    name,
    description,
    req.user!.userId
  );
  res.status(201).json({ success: true, data: department });
});

export const getDepartments = catchAsync(async (req: AuthRequest, res: Response) => {
  const departments = await departmentService.getUserDepartments(req.user!.userId);
  res.json({ success: true, data: departments });
});
