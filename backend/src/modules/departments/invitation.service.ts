import prisma from "../../db/prisma";
import type { Invitation } from "@prisma/client";

/**
 * Send a department invitation
 */
export const createDepartmentInvitation = async (
  email: string,
  departmentId: number,
  createdById: number
): Promise<Invitation> => {
  const invitation = await prisma.invitation.create({
    data: {
      type: "DEPARTMENT",
      email,
      departmentId,
      createdById
    }
  });

  return invitation;
};

/**
 * Get all pending invitations for a user
 */
export const getUserInvitations = async (email: string): Promise<Invitation[]> => {
  return await prisma.invitation.findMany({
    where: { email, status: "PENDING" },
    include: { department: true }
  });
};

/**
 * Respond to an invitation (accept or refuse)
 * If accepted and the invitation is for a department, the user will be added
 * as a DepartmentMember and automatically added to all ongoing elections
 * for that department.
 */
export const respondToInvitation = async (
  invitationId: number,
  accept: boolean,
  userId: number
): Promise<Invitation> => {
  const now = new Date();

  return await prisma.$transaction(async (tx) => {
    const invitation = await tx.invitation.update({
      where: { id: invitationId },
      data: {
        status: accept ? "ACCEPTED" : "REFUSED",
        respondedAt: now
      },
      include: { department: true, election: true }
    });

    if (accept) {
      // If invitation is for a department, add member and add to ongoing elections
      if (invitation.departmentId) {
        try {
          await tx.departmentMember.create({
            data: {
              userId,
              departmentId: invitation.departmentId,
              isManager: false
            }
          });
        } catch (err) {
          // ignore duplicate membership errors
        }

        // Find ongoing elections for this department and add user as participant
        const ongoingElections = await tx.election.findMany({
          where: {
            departmentId: invitation.departmentId,
            startDate: { lte: now },
            endDate: { gte: now }
          },
          select: { id: true }
        });

        if (ongoingElections.length > 0) {
          const participants = ongoingElections.map((e) => ({ electionId: e.id, userId }));
          // createMany with skipDuplicates to avoid unique constraint violations
          await tx.electionParticipant.createMany({ data: participants, skipDuplicates: true });
        }
      }

      // If invitation refers to a specific election, add participant
      if (invitation.electionId) {
        try {
          await tx.electionParticipant.create({ data: { electionId: invitation.electionId, userId } });
        } catch (err) {
          // ignore duplicate
        }
      }
    }

    return invitation;
  });
};
