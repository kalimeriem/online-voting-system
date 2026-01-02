import { Request, Response } from 'express';
import * as pollService from './poll.service.js';

interface AuthRequest extends Request {
  admin?: { adminId: number; email: string };
}

export const createPoll = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, endDate, isPublic, options, allowedEmails, allowedDomains } = req.body;

    if (!title || !endDate || !options) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, end date, and options are required' 
      });
    }

    const poll = await pollService.createPoll({
      title,
      description,
      endDate: new Date(endDate),
      isPublic: isPublic ?? true,
      options,
      allowedEmails,
      allowedDomains,
      adminId: req.admin!.adminId
    });

    res.status(201).json({ success: true, data: poll });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyPolls = async (req: AuthRequest, res: Response) => {
  try {
    const polls = await pollService.getAdminPolls(req.admin!.adminId);
    res.status(200).json({ success: true, data: polls });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPollStats = async (req: AuthRequest, res: Response) => {
  try {
    const pollId = parseInt(req.params.id);
    
    if (isNaN(pollId)) {
      return res.status(400).json({ success: false, message: 'Invalid poll ID' });
    }

    const stats = await pollService.getPollStats(pollId, req.admin!.adminId);
    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPollByUrl = async (req: Request, res: Response) => {
  try {
    const { uniqueUrl } = req.params;
    const poll = await pollService.getPollByUrl(uniqueUrl);
    res.status(200).json({ success: true, data: poll });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const deletePoll = async (req: AuthRequest, res: Response) => {
  try {
    const pollId = parseInt(req.params.id);
    
    if (isNaN(pollId)) {
      return res.status(400).json({ success: false, message: 'Invalid poll ID' });
    }

    const result = await pollService.deletePoll(pollId, req.admin!.adminId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ADD THIS NEW CONTROLLER
export const addVoters = async (req: AuthRequest, res: Response) => {
  try {
    const pollId = parseInt(req.params.id);
    if (isNaN(pollId)) {
      return res.status(400).json({ success: false, message: 'Invalid poll ID' });
    }

    const { emails } = req.body;
    
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Emails array is required and must not be empty' 
      });
    }

    const result = await pollService.addEligibleVoters(pollId, req.admin!.adminId, emails);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
