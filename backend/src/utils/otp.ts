import prisma from '../db/prisma.js';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveOTP = async (email: string, pollId: number, code: string) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.oTP.upsert({
    where: { email_pollId: { email, pollId } },
    update: { code, expiresAt },
    create: { email, pollId, code, expiresAt }
  });
};

export const verifyOTP = async (email: string, pollId: number, code: string): Promise<boolean> => {
  const otp = await prisma.oTP.findUnique({
    where: { email_pollId: { email, pollId } }
  });

  if (!otp) return false;
  if (otp.code !== code) return false;
  if (new Date() > otp.expiresAt) return false;

  // Delete OTP after successful verification
  await prisma.oTP.delete({
    where: { email_pollId: { email, pollId } }
  });

  return true;
};