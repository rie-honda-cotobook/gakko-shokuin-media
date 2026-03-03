import { createHash, randomBytes } from 'crypto';

const SECRET = process.env.SLACK_ACTION_TOKEN || '';

export function generateReviewToken(): string {
  return randomBytes(24).toString('hex');
}

export function hashReviewToken(token: string): string {
  return createHash('sha256').update(token + SECRET).digest('hex');
}

export function verifyReviewToken(token: string, storedHash: string | null): boolean {
  if (!token || !storedHash || !SECRET) return false;
  return createHash('sha256').update(token + SECRET).digest('hex') === storedHash;
}
