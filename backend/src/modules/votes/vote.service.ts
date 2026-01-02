import prisma from '../../db/prisma.js';
import { generateOTP, saveOTP, verifyOTP } from '../../utils/otp.js';
import { sendOTPEmail } from '../../utils/email.js';
import { verifyRecaptcha } from '../../utils/recaptcha.js';  // 🆕 Import

export const requestOTP = async (email: string, pollId: number, ip: string) => {  // 🆕 Add ip parameter
  // Check if poll exists and is active
  const poll = await prisma.poll.findUnique({ where: { id: pollId } });
  
  if (!poll) {
    throw new Error('Poll not found');
  }

  if (new Date() > poll.endDate) {
    throw new Error('This poll has ended');
  }

  // If poll is private, check if email is allowed
  if (!poll.isPublic) {
    const isAllowed = await prisma.allowedEmail.findFirst({
      where: {
        pollId,
        OR: [
          { email },
          { domain: email.split('@')[1] }
        ]
      }
    });

    if (!isAllowed) {
      throw new Error('You are not authorized to vote in this poll');
    }
  }

  // 🆕 Check if IP already voted
  const ipVote = await prisma.vote.findFirst({
    where: { pollId, voterIP: ip }
  });

  if (ipVote) {
    throw new Error('This IP address has already voted in this poll');
  }

  // Check if already voted
  const existingVote = await prisma.vote.findUnique({
    where: { pollId_voterEmail: { pollId, voterEmail: email } }
  });

  if (existingVote) {
    throw new Error('You have already voted in this poll');
  }

  // Generate and send OTP
  const otp = generateOTP();
  await saveOTP(email, pollId, otp);
  await sendOTPEmail(email, otp);

  return { message: 'OTP sent to your email' };
};

export const castVote = async (
  pollId: number,
  optionId: number,
  voterEmail: string | null,
  otp: string | null,
  wantsResult: boolean,
  ip: string,  // 🆕 NEW parameter
  recaptchaToken: string  // 🆕 NEW parameter
) => {
  // 🆕 Verify reCAPTCHA first
  const isHuman = await verifyRecaptcha(recaptchaToken, ip);
  
  if (!isHuman) {
    throw new Error('reCAPTCHA verification failed. Please try again.');
  }

  // Get poll
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: true }
  });

  if (!poll) {
    throw new Error('Poll not found');
  }

  if (new Date() > poll.endDate) {
    throw new Error('This poll has ended');
  }

  // Verify option belongs to this poll
  const option = poll.options.find(o => o.id === optionId);
  if (!option) {
    throw new Error('Invalid option for this poll');
  }

  // For private polls, verify OTP
  if (!poll.isPublic) {
    if (!voterEmail || !otp) {
      throw new Error('Email and OTP are required for private polls');
    }

    const isValid = await verifyOTP(voterEmail, pollId, otp);
    if (!isValid) {
      throw new Error('Invalid or expired OTP');
    }
  }

  // 🆕 Check if IP already voted
  const ipVote = await prisma.vote.findFirst({
    where: { pollId, voterIP: ip }
  });

  if (ipVote) {
    throw new Error('This IP address has already voted in this poll');
  }

  // Check if already voted
  if (voterEmail) {
    const existingVote = await prisma.vote.findUnique({
      where: { pollId_voterEmail: { pollId, voterEmail } }
    });

    if (existingVote) {
      throw new Error('You have already voted in this poll');
    }
  }

  // Cast vote with IP  🆕
  const vote = await prisma.vote.create({
    data: {
      pollId,
      optionId,
      voterEmail,
      voterIP: ip,  // 🆕 Store IP
      wantsResult
    }
  });

  return {
    message: 'Vote cast successfully!',
    vote: {
      id: vote.id,
      pollId: vote.pollId,
      wantsResult: vote.wantsResult
    }
  };
};

export const getPublicResults = async (pollId: number) => {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: true }
  });

  if (!poll) {
    throw new Error('Poll not found');
  }

  // Get vote counts
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

  // 🆕 Fixed winner logic (handle ties)
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
      title: poll.title,
      description: poll.description,
      endDate: poll.endDate,
      hasEnded: new Date() > poll.endDate
    },
    totalVotes,
    results,
    winner
  };
};
