import { config } from '../config/env.js';

interface RecaptchaResponse {
  success: boolean;
  score: number;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export const verifyRecaptcha = async (token: string, ip: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptcha.secretKey}&response=${token}&remoteip=${ip}`,
      {
        method: 'POST'
      }
    );

    const data = await response.json() as RecaptchaResponse;
    const { success, score } = data;
    
    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 0.0 = likely bot, 1.0 = likely human
    // Recommended threshold: 0.5
    return success && score >= 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
};
