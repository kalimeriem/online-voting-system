import bcrypt from 'bcryptjs';
import prisma from '../../db/prisma.js';
import { generateToken } from '../../utils/jwt.js';
import { sendVerificationEmail } from '../../utils/email.js';
import { generateOTP } from '../../utils/otp.js';

export const registerAdmin = async (email: string, password: string, name?: string) => {
  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    throw new Error('Admin already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate OTP
  const verificationCode = generateOTP();
  const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
      verificationCode,
      codeExpiresAt
    }
  });

  // Send verification email with OTP
  await sendVerificationEmail(email, verificationCode);

  return {
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      isVerified: admin.isVerified
    },
    message: 'Registration successful! Please check your email for verification code.'
  };
};

export const loginAdmin = async (email: string, password: string) => {
  // Find admin
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    throw new Error('Invalid email or password');
  }

  // Check if verified
  if (!admin.isVerified) {
    throw new Error('Please verify your email before logging in');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken({ adminId: admin.id, email: admin.email });

  return {
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      isVerified: admin.isVerified
    },
    token
  };
};

export const verifyEmailWithOTP = async (email: string, code: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin) {
    throw new Error('Admin not found');
  }

  if (!admin.verificationCode || admin.verificationCode !== code) {
    throw new Error('Invalid verification code');
  }

  if (admin.codeExpiresAt && new Date() > admin.codeExpiresAt) {
    throw new Error('Verification code has expired');
  }

  // Update admin as verified
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      isVerified: true,
      verificationCode: null,
      codeExpiresAt: null
    }
  });

  return { message: 'Email verified successfully! You can now log in.' };
};

export const resendVerificationCode = async (email: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin) {
    throw new Error('Admin not found');
  }

  if (admin.isVerified) {
    throw new Error('Email is already verified');
  }

  // Generate new OTP
  const verificationCode = generateOTP();
  const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.admin.update({
    where: { id: admin.id },
    data: { verificationCode, codeExpiresAt }
  });

  // Send new code
  await sendVerificationEmail(email, verificationCode);

  return { message: 'Verification code resent to your email' };
};