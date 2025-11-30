import prisma from "../../db/prisma";
import type { User, Election } from "@prisma/client";

export const getProfile = async (userId: number): Promise<Omit<User, 'password'>> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  const { password, ...rest } = user as any;
  return rest;
};

export const getDashboard = async (userId: number, email?: string): Promise<{ invitations: any[]; activeElections: (Election & { status: string })[]; recentActivities: any[] }> => {
  const now = new Date();

  // Ensure we have the user's email (token may only include userId)
  let userEmail = email;
  if (!userEmail) {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    userEmail = u?.email;
  }

  // Invitations by email if available
  let invitations: any[] = [];
  if (userEmail) {
    invitations = await prisma.invitation.findMany({ where: { email: userEmail, status: 'PENDING' }, include: { department: true, election: true } });
  }

  // Direct participant elections
  const direct = await prisma.electionParticipant.findMany({ where: { userId }, include: { election: true } });
  const directElections = direct.map(d => d.election);

  // Department elections where user is member
  const userDepartments = await prisma.departmentMember.findMany({ where: { userId }, include: { department: { include: { elections: true } } } });
  const departmentElections: Election[] = userDepartments.flatMap((d: any) => d.department.elections || []);

  const allMap = new Map<number, Election>();
  directElections.forEach(e => allMap.set(e.id, e));
  departmentElections.forEach(e => allMap.set(e.id, e));

  // Include elections that are not finished yet (upcoming or active)
  const electionsNotFinished = Array.from(allMap.values()).filter((e) => new Date(e.endDate) >= now);

  // Attach status and candidate vote summaries to each election
  const activeElections = await Promise.all(
    electionsNotFinished.map(async (e) => {
      const start = new Date(e.startDate);
      const end = new Date(e.endDate);
      let status = "UPCOMING";
      if (now >= start && now <= end) status = "ACTIVE";
      if (now > end) status = "ENDED";

      // total votes
      const totalVotesRes = await prisma.vote.aggregate({ where: { electionId: e.id }, _count: { _all: true } });
      const totalVotes = totalVotesRes._count._all || 0;

      // votes per candidate
      const candidateVotes = await prisma.vote.groupBy({
        by: ["candidateId"],
        where: { electionId: e.id },
        _count: { candidateId: true }
      });

      const candidates = await prisma.candidate.findMany({ where: { electionId: e.id } });

      const candidatesWithCounts = candidates.map((c) => {
        const cv = candidateVotes.find((v) => v.candidateId === c.id);
        const count = cv?._count.candidateId || 0;
        const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
        return { ...c, votes: count, percentage };
      });

      return { ...e, status, candidates: candidatesWithCounts } as Election & { status: string; candidates: any[] };
    })
  );

  // Recent activities placeholder
  const recentActivities: any[] = [];

  return { invitations, activeElections, recentActivities };
};
