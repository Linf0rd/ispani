import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a verification token with expiry
 */
export function generateVerificationToken() {
  const token = generateSecureToken();
  // Token expires in 24 hours
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return {
    token,
    expires
  };
}

/**
 * Generate a password reset token with expiry
 */
export function generatePasswordResetToken() {
  const token = generateSecureToken();
  // Token expires in 1 hour
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  
  return {
    token,
    expires
  };
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}
