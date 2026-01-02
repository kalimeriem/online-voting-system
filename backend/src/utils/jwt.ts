import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateToken = (payload: { adminId: number; email: string }): string => {
  return jwt.sign(payload, config.jwtSecret, { 
    expiresIn: config.jwtExpiresIn 
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};