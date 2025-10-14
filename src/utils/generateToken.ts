import jwt, { SignOptions } from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET no está definido en el .env");
  }

  const expiresIn = (process.env.TOKEN_EXPIRATION || "1d") as SignOptions["expiresIn"];

  const options: SignOptions = { expiresIn };

  return jwt.sign({ id: userId }, secret, options);
};
