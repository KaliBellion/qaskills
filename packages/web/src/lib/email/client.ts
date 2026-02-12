import { Resend } from 'resend';

// Lazy initialization of Resend client to avoid build-time errors
let _resend: Resend | null = null;

export function getResendClient(): Resend {
  if (!_resend) {
    // Use a dummy key during build if not set, will be replaced at runtime
    const apiKey = process.env.RESEND_API_KEY || 're_placeholder';
    _resend = new Resend(apiKey);
  }
  return _resend;
}

// Export resend as a getter for backward compatibility
export const resend = {
  get emails() {
    return getResendClient().emails;
  },
  get domains() {
    return getResendClient().domains;
  },
  get apiKeys() {
    return getResendClient().apiKeys;
  },
};

// Email sender configuration
export const FROM_EMAIL = 'QASkills <noreply@qaskills.sh>';
export const SUPPORT_EMAIL = 'support@qaskills.sh';
