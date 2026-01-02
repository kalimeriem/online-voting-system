import { pollResultsQueue } from './queue.js';
import prisma from '../db/prisma.js';
import { sendResultEmail } from './email.js';

interface PollResultJob {
  pollId: number;
}

// Process jobs when they're triggered
pollResultsQueue.process(async (job) => {
  const { pollId } = job.data as PollResultJob;
  

  try {
    // Get poll with votes
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: true,
        votes: {
          where: {
            wantsResult: true,
            voterEmail: { not: null }
          }
        }
      }
    });

    if (!poll) {
      throw new Error(`Poll ${pollId} not found`);
    }

    // Calculate results
    const voteCounts = await prisma.vote.groupBy({
      by: ['optionId'],
      where: { pollId: poll.id },
      _count: { id: true }
    });

    const totalVotes = voteCounts.reduce((sum, v) => sum + v._count.id, 0);

    const results = poll.options.map((option) => {
      const voteCount = voteCounts.find((v) => v.optionId === option.id)?._count.id || 0;
      const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
      return {
        text: option.text,
        votes: voteCount,
        percentage: percentage.toFixed(2)
      };
    });

    // Find winner (handle ties) 🆕 FIXED
    const maxVotes = Math.max(...results.map(r => r.votes));
    const winners = results.filter(r => r.votes === maxVotes);

    const winnerHTML = winners.length > 1
      ? `
        <div style="background: #fff3cd; padding: 20px; border-radius: 12px; text-align: center; margin-top: 30px; border: 2px solid #ffc107;">
          <div style="font-size: 14px; color: #856404; margin-bottom: 8px;">🤝 It's a Tie!</div>
          <div style="font-size: 24px; font-weight: 700; color: #856404;">${winners.map(w => w.text).join(' & ')}</div>
          <div style="font-size: 16px; color: #856404; margin-top: 8px;">${winners[0].percentage}% • ${winners[0].votes} votes each</div>
        </div>
      `
      : `
        <div style="background: #f5f7fa; padding: 20px; border-radius: 12px; text-align: center; margin-top: 30px;">
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">🏆 Winner</div>
          <div style="font-size: 24px; font-weight: 700; color: #0066FF;">${winners[0].text}</div>
          <div style="font-size: 16px; color: #666; margin-top: 8px;">${winners[0].percentage}% • ${winners[0].votes} votes</div>
        </div>
      `;

    // Build HTML results
    const resultsHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066FF;">Final Results for "${poll.title}"</h2>
        <p style="color: #666;">${poll.description || ''}</p>
        
        <div style="margin: 20px 0;">
          <h3>Total Votes: ${totalVotes}</h3>
          ${results.map(r => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: 600;">${r.text}</span>
                <span style="color: #0066FF; font-weight: 700;">${r.percentage}%</span>
              </div>
              <div style="width: 100%; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="width: ${r.percentage}%; height: 100%; background: #0066FF;"></div>
              </div>
              <div style="color: #666; font-size: 14px; margin-top: 4px;">${r.votes} votes</div>
            </div>
          `).join('')}
        </div>

        ${winnerHTML}

        <p style="color: #666; font-size: 14px; margin-top: 30px;">Thank you for participating in this poll!</p>
      </div>
    `;

    // Get unique emails from voters who want results
    const voterEmails = [...new Set(poll.votes.map(v => v.voterEmail).filter(Boolean))];

    
    // Send emails to all voters who requested results
    for (const email of voterEmails) {
      try {
        await sendResultEmail(email as string, poll.title, resultsHTML);
      } catch (error) {
        console.error(`✗ Failed to send results to ${email}:`, error);
        throw error; // Re-throw to mark job as failed
      }
    }
    return { success: true, emailsSent: voterEmails.length };

  } catch (error) {
    console.error(`Error processing poll ${pollId}:`, error);
    throw error; // Bull will retry failed jobs
  }
});

// Handle completed jobs
pollResultsQueue.on('completed', (job, result) => {

});

// Handle failed jobs
pollResultsQueue.on('failed', (job, err) => {
  console.error(`✗ Job ${job?.id} failed:`, err.message);
});

console.log('✓ Poll results worker started');
