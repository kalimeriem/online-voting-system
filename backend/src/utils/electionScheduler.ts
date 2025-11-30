import prisma from "../db/prisma";

function computeStatusForDates(start: Date, end: Date): string {
  const now = new Date();
  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "ACTIVE";
  return "ENDED";
}

export function startElectionStatusScheduler() {
  const timers = new Map<number, NodeJS.Timeout>();

  const scheduleElectionUpdates = async () => {
    try {
      const elections = await prisma.election.findMany({
        select: { id: true, startDate: true, endDate: true, status: true },
        where: { status: { not: "ENDED" } } // Only schedule non-ended elections
      });

      for (const e of elections) {
        const startTime = new Date(e.startDate).getTime();
        const endTime = new Date(e.endDate).getTime();
        const now = Date.now();

        // Clear old timer if exists
        if (timers.has(e.id)) clearTimeout(timers.get(e.id)!);

        // If election hasn't started, schedule it to start
        if (now < startTime) {
          const delayMs = startTime - now;
          const timer = setTimeout(async () => {
            await prisma.election.update({ where: { id: e.id }, data: { status: "ACTIVE" } });
            console.log(`Election ${e.id} status updated to ACTIVE`);
            scheduleElectionUpdates(); // Re-schedule remaining elections
          }, delayMs);
          timers.set(e.id, timer);
        }
        // If election is active, schedule it to end
        else if (now >= startTime && now <= endTime) {
          const delayMs = endTime - now;
          const timer = setTimeout(async () => {
            await prisma.election.update({ where: { id: e.id }, data: { status: "ENDED" } });
            console.log(`Election ${e.id} status updated to ENDED`);
            scheduleElectionUpdates(); // Re-schedule remaining elections
          }, delayMs);
          timers.set(e.id, timer);
        }
      }
    } catch (err) {
      console.error("Election scheduler error:", err);
    }
  };

  // Start scheduling
  scheduleElectionUpdates();

  return () => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  };
}

