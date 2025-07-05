import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function isTokenExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}
