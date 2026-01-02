import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

interface AuthRequest extends Request {
  admin?: { adminId: number; email: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};