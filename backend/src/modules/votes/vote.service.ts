import prisma from "../../db/prisma";
import type { Vote, Election, Candidate } from "@prisma/client";

interface CastVoteInput {
  electionId: number;
  candidateId: number;
  userId: number;
}

export const castVote = async ({ electionId, candidateId, userId }: CastVoteInput): Promise<Vote> => {
  // Ensure election exists and is active
  const election = await prisma.election.findUnique({ where: { id: electionId } });
  if (!election) throw new Error("Election not found");

  const now = new Date();
  if (now < election.startDate || now > election.endDate) {
    throw new Error("Election is not active");
  }

  // Ensure user is a participant or the creator
  const isParticipant = await prisma.electionParticipant.findUnique({
    where: { electionId_userId: { electionId, userId } }
  });
  if (!isParticipant && election.creatorId !== userId) {
    throw new Error("User is not a participant in this election");
  }

  // Create vote in a transaction to handle concurrency
  return await prisma.$transaction(async (tx) => {
    const existingVote = await tx.vote.findUnique({ where: { electionId_userId: { electionId, userId } } });
    if (existingVote) throw new Error("User has already voted in this election.");

    const vote = await tx.vote.create({ data: { electionId, candidateId, userId } });
    return vote;
  });
};

// Get election results
export const getElectionResults = async (electionId: number): Promise<{ candidate: Candidate; votes: number; percentage: number }[]> => {
  const totalVotesRes = await prisma.vote.aggregate({ where: { electionId }, _count: { _all: true } });
  const totalVotes = totalVotesRes._count._all || 0;

  const votes = await prisma.vote.groupBy({
    by: ["candidateId"],
    where: { electionId },
    _count: { candidateId: true }
  });

  const results = await Promise.all(
    votes.map(async (v) => {
      const candidate = await prisma.candidate.findUnique({ where: { id: v.candidateId } });
      const count = v._count.candidateId;
      const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
      return { candidate: candidate!, votes: count, percentage };
    })
  );

  return results;
};
