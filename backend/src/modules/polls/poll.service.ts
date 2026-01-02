import prisma from '../../db/prisma.js';
import { nanoid } from 'nanoid';
import { pollResultsQueue } from '../../utils/queue.js';
import { config } from '../../config/env.js';


interface CreatePollInput {
  title: string;
  description?: string;
  endDate: Date;
  isPublic: boolean;
  options: string[];
  allowedEmails?: string[];
  allowedDomains?: string[];
  adminId: number;
}

export const createPoll = async (input: CreatePollInput) => {
  const { title, description, endDate, isPublic, options, allowedEmails, allowedDomains, adminId } = input;

  if (!options || options.length < 2) {
    throw new Error('Poll must have at least 2 options');
  }

  // Generate unique URL
  const uniqueUrl = nanoid(10);

  // Prepare allowed emails data
  const allowedEmailsData = [];
  if (allowedEmails && allowedEmails.length > 0) {
    allowedEmailsData.push(...allowedEmails.map((email) => ({ email })));
  }
  if (allowedDomains && allowedDomains.length > 0) {
    allowedEmailsData.push(...allowedDomains.map((domain) => ({ email: '', domain })));
  }

  // Create poll with options
  const poll = await prisma.poll.create({
    data: {
      title,
      description,
      endDate,
      isPublic,
      uniqueUrl,
      adminId,
      options: {
        create: options.map((text) => ({ text }))
      },
      ...(allowedEmailsData.length > 0 && {
        allowedEmails: {
          create: allowedEmailsData
        }
      })
    },
    include: {
      options: true,
      allowedEmails: true
    }
  });
  // Schedule email sending job for when poll ends
const delay = poll.endDate.getTime() - Date.now();

if (delay > 0) {
  await pollResultsQueue.add(
    { pollId: poll.id },
    {
      delay: delay, // Execute exactly when poll ends
      attempts: 3, // Retry 3 times if it fails
      backoff: {
        type: 'exponential',
        delay: 60000 // Wait 1 minute between retries
      }
    }
  );
  console.log(`✓ Scheduled results email for poll ${poll.id} at ${poll.endDate}`);
}


  return {
    ...poll,
    pollUrl: `${config.frontendUrl}/vote/${poll.uniqueUrl}`
  };
};

export const getAdminPolls = async (adminId: number) => {
  const polls = await prisma.poll.findMany({
    where: { adminId },
    include: {
      options: true,
      _count: {
        select: { votes: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return polls.map(poll => ({
    ...poll,
    totalVotes: poll._count.votes,
    hasEnded: new Date() > poll.endDate,
    pollUrl: `${config.frontendUrl}/vote/${poll.uniqueUrl}`
  }));
};

export const getPollByUrl = async (uniqueUrl: string) => {
  const poll = await prisma.poll.findUnique({
    where: { uniqueUrl },
    include: {
      options: true,
      allowedEmails: true
    }
  });

  if (!poll) {
    throw new Error('Poll not found');
  }

  // Check if poll has ended
  if (new Date() > poll.endDate) {
    throw new Error('This poll has ended');
  }

  return poll;
};

export const getPollStats = async (pollId: number, adminId: number) => {
  // Verify admin owns this poll
  const poll = await prisma.poll.findFirst({
    where: { id: pollId, adminId },
    include: {
      options: true
    }
  });

  if (!poll) {
    throw new Error('Poll not found or unauthorized');
  }

  // Get vote counts per option
  const votes = await prisma.vote.groupBy({
    by: ['optionId'],
    where: { pollId },
    _count: { id: true }
  });

  const totalVotes = votes.reduce((sum, v) => sum + v._count.id, 0);

  const results = poll.options.map((option) => {
    const voteCount = votes.find((v) => v.optionId === option.id)?._count.id || 0;
    const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

    return {
      optionId: option.id,
      text: option.text,
      votes: voteCount,
      percentage: parseFloat(percentage.toFixed(2))
    };
  });

  // Find winner (handle ties)
  const maxVotes = Math.max(...results.map(r => r.votes));
  const winners = results.filter(r => r.votes === maxVotes);

  const winner = winners.length > 1 
    ? {
        optionId: null,
        text: `Tie: ${winners.map(w => w.text).join(', ')}`,
        votes: maxVotes,
        percentage: winners[0].percentage,
        isTie: true
      }
    : { ...winners[0], isTie: false };

  return {
    poll: {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      endDate: poll.endDate,
      hasEnded: new Date() > poll.endDate,
      uniqueUrl: poll.uniqueUrl,
      isPublic: poll.isPublic 
    },
    totalVotes,
    results,
    winner
  };
};



export const deletePoll = async (pollId: number, adminId: number) => {
  // Verify admin owns this poll
  const poll = await prisma.poll.findFirst({
    where: { id: pollId, adminId }
  });

  if (!poll) {
    throw new Error('Poll not found or unauthorized');
  }

  // Delete the poll (cascades to options, votes, allowedEmails due to schema)
  await prisma.poll.delete({
    where: { id: pollId }
  });

  return { message: 'Poll deleted successfully' };
};

// ADD THIS NEW FUNCTION
export const addEligibleVoters = async (pollId: number, adminId: number, emails: string[]) => {
  // Verify admin owns this poll
  const poll = await prisma.poll.findFirst({
    where: { id: pollId, adminId },
    include: { allowedEmails: true }
  });

  if (!poll) {
    throw new Error('Poll not found or unauthorized');
  }

  if (poll.isPublic) {
    throw new Error('Cannot add eligible voters to public polls');
  }

  if (new Date() > poll.endDate) {
    throw new Error('Cannot add voters to an ended poll');
  }

  // Filter out emails that already exist
  const existingEmails = poll.allowedEmails
    .filter(ae => ae.email && ae.email !== '')
    .map(ae => ae.email.toLowerCase());
  
  const newEmails = emails
    .map(e => e.toLowerCase().trim())
    .filter(e => e && !existingEmails.includes(e));

  if (newEmails.length === 0) {
    return { message: 'No new voters to add (all emails already exist)', count: 0 };
  }

  // Add new eligible voters
  await prisma.allowedEmail.createMany({
    data: newEmails.map(email => ({
      pollId,
      email
    })),
    skipDuplicates: true
  });

  return { 
    message: `Successfully added ${newEmails.length} eligible voter(s)`, 
    count: newEmails.length,
    addedEmails: newEmails
  };
};

