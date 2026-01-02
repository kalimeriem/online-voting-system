import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

export const sendVerificationEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: config.email.user,
    to,
    subject: 'Verify Your Email - VoteSystem',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066FF;">Email Verification</h2>
        <p>Thank you for registering with VoteSystem!</p>
        <p>Your verification code is:</p>
        <div style="background: #f5f7fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #0066FF; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      </div>
    `
  });
};

export const sendOTPEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: config.email.user,
    to,
    subject: 'Your Voting OTP Code',
    html: `
      <h2>Your OTP Code</h2>
      <p>Your one-time password is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `
  });
};

export const sendResultEmail = async (to: string, pollTitle: string, results: string) => {
  await transporter.sendMail({
    from: config.email.user,
    to,
    subject: `Poll Results: ${pollTitle}`,
    html: `
      <h2>Poll Results for "${pollTitle}"</h2>
      ${results}
    `
  });
};