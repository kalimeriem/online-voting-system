import { Request, Response } from "express";
import * as invitationService from "./invitation.service";
import catchAsync from "../../utils/catchAsync";

interface AuthRequest extends Request {
  user?: { userId: number; email?: string };
}

export const sendInvitation = catchAsync(async (req: AuthRequest, res: Response) => {
  const { email, departmentId } = req.body;
  const invitation = await invitationService.createDepartmentInvitation(
    email,
    departmentId,
    req.user!.userId
  );
  res.status(201).json({ success: true, data: invitation });
});

export const listUserInvitations = catchAsync(async (req: AuthRequest, res: Response) => {
  const invitations = await invitationService.getUserInvitations(req.user!.email!);
  res.json({ success: true, data: invitations });
});

export const respondInvitation = catchAsync(async (req: AuthRequest, res: Response) => {
  const { invitationId, accept } = req.body;
  const invitation = await invitationService.respondToInvitation(invitationId, accept, req.user!.userId);
  res.json({ success: true, data: invitation });
});
