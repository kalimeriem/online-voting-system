import prisma from "../../db/prisma";
import type { Election, Candidate, ElectionParticipant, DepartmentMember } from "@prisma/client";

interface CreateElectionInput {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  departmentId?: number; // optional
  candidateNames: string[]; // initial candidates
  participantIds?: number[]; // optional additional participants
  voterEmails?: string[]; // optional voter emails to add
  creatorId: number;
}

export const createElection = async (input: CreateElectionInput): Promise<Election & { candidates: Candidate[]; participants: ElectionParticipant[] }> => {
  const { title, description, startDate, endDate, departmentId, candidateNames, participantIds, voterEmails, creatorId } = input;
  // Create election in a transaction: if departmentId is provided, include all current
  // department members as participants in addition to any explicit participantIds.
  return await prisma.$transaction(async (tx) => {
    let deptMemberIds: number[] = [];

    if (departmentId) {
      const members = await tx.departmentMember.findMany({ where: { departmentId }, select: { userId: true } });
      deptMemberIds = members.map((m) => m.userId);
    }

    // Convert voter emails to user IDs
    let voterUserIds: number[] = [];
    if (voterEmails && voterEmails.length > 0) {
      const users = await tx.user.findMany({
        where: {
          email: { in: voterEmails, mode: 'insensitive' }
        },
        select: { id: true }
      });
      voterUserIds = users.map((u) => u.id);
    }

    const explicitParticipantIds = participantIds || [];
    // Always include the creator as a participant
    const combinedParticipantIds = Array.from(new Set([creatorId, ...explicitParticipantIds, ...deptMemberIds, ...voterUserIds]));

    const election = await tx.election.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        status: "UPCOMING",
        creatorId,
        departmentId,
        candidates: {
          create: candidateNames.map((name: string) => ({ name, description: "" }))
        },
        participants: {
          create: combinedParticipantIds.map((id: number) => ({ userId: id }))
        }
      },
      include: {
        candidates: true,
        participants: true
      }
    });

    return election;
  });
};

/**
 * List elections for a user
 * Includes department elections if user is member
 */
export const getUserElections = async (userId: number): Promise<Election[]> => {
  // 1. Direct participant
  const directElections = await prisma.electionParticipant.findMany({
    where: { userId },
    include: { election: true }
  });

  // 2. Department elections
  const userDepartments = await prisma.departmentMember.findMany({
    where: { userId },
    include: { department: { include: { elections: true } } }
  });

  const departmentElections: Election[] = userDepartments.flatMap((d: DepartmentMember & { department: { elections: Election[] } }) => d.department.elections);

  // Merge and remove duplicates
  const allElectionsMap = new Map<number, Election>();
  directElections.forEach((p: ElectionParticipant & { election: Election }) => allElectionsMap.set(p.electionId, p.election));
  departmentElections.forEach((e: Election) => allElectionsMap.set(e.id, e));

  return Array.from(allElectionsMap.values());
};

/**
 * Get all elections with candidates and participants (with user details)
 */
export const getAllElections = async (): Promise<any[]> => {
  return await prisma.election.findMany({
    include: {
      candidates: true,
      participants: {
        include: {
          user: {
            select: { id: true, email: true, name: true }
          }
        }
      },
      creator: {
        select: { id: true, email: true, name: true }
      }
    }
  });
};

export const getElectionParticipants = async (electionId: number) => {
  const participants = await prisma.electionParticipant.findMany({ where: { electionId }, include: { user: true } });
  return participants.map((p) => p.user);
};

/**
 * Add voters to an election (only UPCOMING)
 */
export const addVotersToElection = async (electionId: number, emails: string[], userId: number) => {
  // Verify election exists and user is creator
  const election = await prisma.election.findUniqueOrThrow({
    where: { id: electionId }
  });

  if (election.creatorId !== userId) {
    throw new Error("Only election creator can add voters");
  }

  // Check election status
  const now = new Date();
  const isUpcoming = now < new Date(election.startDate);
  if (!isUpcoming) {
    throw new Error("Can only add voters to UPCOMING elections");
  }

  // Find users by email and add as participants
  const validEmails = Array.from(new Set(emails.map((e: string) => e.trim().toLowerCase())));
  
  let addedCount = 0;
  const results = await Promise.all(
    validEmails.map(async (email: string) => {
      try {
        const user = await prisma.user.findFirst({
          where: { email: { mode: 'insensitive', equals: email } }
        });

        if (!user) {
          throw new Error(`User with email ${email} not found`);
        }

        // Check if already a participant
        const existing = await prisma.electionParticipant.findFirst({
          where: { electionId, userId: user.id }
        });

        if (existing) {
          return { email, status: 'already_participant', userId: user.id };
        }

        // Add as participant
        await prisma.electionParticipant.create({
          data: { electionId, userId: user.id }
        });

        addedCount++;
        return { email, status: 'added', userId: user.id };
      } catch (error) {
        return { email, status: 'error', error: (error as Error).message };
      }
    })
  );

  // Get updated participants
  const participants = await prisma.electionParticipant.findMany({
    where: { electionId },
    include: {
      user: {
        select: { id: true, email: true, name: true }
      }
    }
  });

  return {
    addedCount,
    results,
    participants: participants.map((p) => ({
      email: p.user.email,
      name: p.user.name,
      userId: p.user.id
    }))
  };
};

/**
 * Add candidate to an election (only UPCOMING)
 */
export const addCandidateToElection = async (
  electionId: number,
  candidateData: { name: string; description?: string },
  userId: number
) => {
  // Verify election exists and user is creator
  const election = await prisma.election.findUniqueOrThrow({
    where: { id: electionId }
  });

  if (election.creatorId !== userId) {
    throw new Error("Only election creator can add candidates");
  }

  // Check election status
  const now = new Date();
  const isUpcoming = now < new Date(election.startDate);
  if (!isUpcoming) {
    throw new Error("Can only add candidates to UPCOMING elections");
  }

  // Check if candidate already exists
  const existing = await prisma.candidate.findFirst({
    where: {
      electionId,
      name: { mode: 'insensitive', equals: candidateData.name }
    }
  });

  if (existing) {
    throw new Error("Candidate with this name already exists");
  }

  // Create candidate
  const candidate = await prisma.candidate.create({
    data: {
      electionId,
      name: candidateData.name,
      description: candidateData.description || ""
    }
  });

  return candidate;
};
