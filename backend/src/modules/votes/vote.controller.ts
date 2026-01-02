import { Request, Response } from 'express';
import * as voteService from './vote.service.js';

// 🆕 Helper to get client IP
const getClientIP = (req: Request): string => {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown'
  );
};

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { email, pollId } = req.body;
    const ip = getClientIP(req);  // 🆕 Get IP

    if (!email || !pollId) {
      return res.status(400).json({
        success: false,
        message: 'Email and poll ID are required'
      });
    }

    const result = await voteService.requestOTP(email, pollId, ip);  // 🆕 Pass IP
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const castVote = async (req: Request, res: Response) => {
  try {
    const { pollId, optionId, voterEmail, otp, wantsResult, recaptchaToken } = req.body;  // 🆕 Get recaptchaToken
    const ip = getClientIP(req);  // 🆕 Get IP

    if (!pollId || !optionId) {
      return res.status(400).json({
        success: false,
        message: 'Poll ID and option ID are required'
      });
    }

    // 🆕 Validate recaptchaToken
    if (!recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification required'
      });
    }

    const result = await voteService.castVote(
      pollId,
      optionId,
      voterEmail || null,
      otp || null,
      wantsResult || false,
      ip,  // 🆕 Pass IP
      recaptchaToken  // 🆕 Pass token
    );

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getResults = async (req: Request, res: Response) => {
  try {
    const pollId = parseInt(req.params.pollId);

    if (isNaN(pollId)) {
      return res.status(400).json({ success: false, message: 'Invalid poll ID' });
    }

    const results = await voteService.getPublicResults(pollId);
    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
