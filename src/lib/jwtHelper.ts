import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";

export const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret as string, { expiresIn } as any);
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret as string) as JwtPayload;
};
