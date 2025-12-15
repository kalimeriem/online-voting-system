import { Request, Response } from "express";
import * as electionService from "./election.service";
import catchAsync from "../../utils/catchAsync";

interface AuthRequest extends Request {
  user?: { userId: number };
}

function computeStatus(election: any) {
  const now = new Date();

  if (now < new Date(election.startDate)) return "UPCOMING";
  if (now > new Date(election.endDate)) return "ENDED";
  return "ACTIVE";
}

export const createElection = catchAsync(async (req: AuthRequest, res: Response) => {
  const election = await electionService.createElection({
    ...req.body,
    creatorId: req.user!.userId
  });
  res.status(201).json({ success: true, data: election });
});

export const getUserElections = catchAsync(async (req: AuthRequest, res: Response) => {
  const elections = await electionService.getUserElections(req.user!.userId);
  res.json({ success: true, data: elections });
});

export const getAllElections = catchAsync(async (req: AuthRequest, res: Response) => {
  const elections = await electionService.getAllElections();
  
  // Transform to match frontend expectations
  const transformedElections = elections.map((election: any) => ({
    ...election,
    creator: election.creator.email, // Extract creator email
    eligibleVoters: election.participants.map((p: any) => ({
      email: p.user.email,
      name: p.user.name,
      userId: p.user.id
    }))
  }));
  
  res.json({ success: true, data: transformedElections });
});

export const getParticipants = catchAsync(async (req: AuthRequest, res: Response) => {
  const electionId = Number(req.params.id);
  if (Number.isNaN(electionId)) throw new Error("Invalid election id");
  const participants = await electionService.getElectionParticipants(electionId);
  res.json({ success: true, data: participants });
});
