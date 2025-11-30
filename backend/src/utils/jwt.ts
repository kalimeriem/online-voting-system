import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const signToken = (
  payload: Record<string, any>,
  expiresIn: string = "1d"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as any;
};
