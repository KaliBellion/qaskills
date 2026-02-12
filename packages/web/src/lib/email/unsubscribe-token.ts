import { createHmac, timingSafeEqual } from 'crypto';

const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || process.env.CRON_SECRET;
  if (!secret) {
    throw new Error('UNSUBSCRIBE_SECRET or CRON_SECRET must be set');
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

/**
 * Generate a signed unsubscribe token for the given user ID.
 * Token format: base64url(userId:timestamp).base64url(HMAC-SHA256 signature)
 */
export function generateUnsubscribeToken(userId: string): string {
  const timestamp = Date.now();
  const payload = `${userId}:${timestamp}`;
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = sign(payload);
  return `${encodedPayload}.${signature}`;
}

/**
 * Verify an unsubscribe token and return the decoded payload.
 * Returns null if the token is invalid or expired (older than 30 days).
 */
export function verifyUnsubscribeToken(
  token: string,
): { userId: string; timestamp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return null;
    }

    const [encodedPayload, providedSignature] = parts;

    // Decode payload
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const separatorIndex = payload.lastIndexOf(':');
    if (separatorIndex === -1) {
      return null;
    }

    const userId = payload.substring(0, separatorIndex);
    const timestamp = parseInt(payload.substring(separatorIndex + 1), 10);

    if (!userId || isNaN(timestamp)) {
      return null;
    }

    // Verify signature using timing-safe comparison
    const expectedSignature = sign(payload);
    const providedBuf = Buffer.from(providedSignature, 'utf-8');
    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');

    if (providedBuf.length !== expectedBuf.length) {
      return null;
    }

    if (!timingSafeEqual(providedBuf, expectedBuf)) {
      return null;
    }

    // Check expiration (30 days)
    if (Date.now() - timestamp > TOKEN_MAX_AGE_MS) {
      return null;
    }

    return { userId, timestamp };
  } catch {
    return null;
  }
}
