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
  creatorId: number;
}

export const createElection = async (input: CreateElectionInput): Promise<Election & { candidates: Candidate[]; participants: ElectionParticipant[] }> => {
  const { title, description, startDate, endDate, departmentId, candidateNames, participantIds, creatorId } = input;
  // Create election in a transaction: if departmentId is provided, include all current
  // department members as participants in addition to any explicit participantIds.
  return await prisma.$transaction(async (tx) => {
    let deptMemberIds: number[] = [];

    if (departmentId) {
      const members = await tx.departmentMember.findMany({ where: { departmentId }, select: { userId: true } });
      deptMemberIds = members.map((m) => m.userId);
    }

    const explicitParticipantIds = participantIds || [];
    // Always include the creator as a participant
    const combinedParticipantIds = Array.from(new Set([creatorId, ...explicitParticipantIds, ...deptMemberIds]));

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
