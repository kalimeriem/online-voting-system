import { Request, Response } from "express";
import * as voteService from "./vote.service";
import catchAsync from "../../utils/catchAsync";

interface AuthRequest extends Request {
  user?: { userId: number };
}

export const castVote = catchAsync(async (req: AuthRequest, res: Response) => {
  console.log("Vote request body:", req.body);
  console.log("User ID from auth:", req.user!.userId);
  
  const vote = await voteService.castVote({
    electionId: req.body.electionId,
    candidateId: req.body.candidateId,
    userId: req.user!.userId
  });
  res.status(201).json({ success: true, data: vote });
});

export const getResults = catchAsync(async (req: AuthRequest, res: Response) => {
  const results = await voteService.getElectionResults(Number(req.params.electionId));
  res.json({ success: true, data: results });
});
