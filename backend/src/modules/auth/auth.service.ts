import prisma from "../../db/prisma";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt";
import { ApiError } from "../../utils/apiError";

const SALT_ROUNDS = 10;

export const registerUser = async (email: string, password: string, name?: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new ApiError("User already exists", 400);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  const token = signToken({ userId: user.id });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  console.log("Login attempt:", { email, password: password ? "***" : "empty" });
  const user = await prisma.user.findUnique({ where: { email } });
  console.log("User found:", user ? `${user.email}` : "Not found");
  if (!user) throw new ApiError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);
  if (!isMatch) throw new ApiError("Invalid credentials", 401);

  const token = signToken({ userId: user.id });
  return { user, token };
};
