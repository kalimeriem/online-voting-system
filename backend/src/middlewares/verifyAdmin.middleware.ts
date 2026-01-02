import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma.js';

interface AuthRequest extends Request {
  admin?: { adminId: number; email: string };
}

export const requireVerified = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.adminId }
    });

    if (!admin?.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before creating polls' 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};