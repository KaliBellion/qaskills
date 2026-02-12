import { Resend } from 'resend';

// Initialize Resend client
// The API key should be set in environment variable RESEND_API_KEY
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
export const FROM_EMAIL = 'QASkills <noreply@qaskills.sh>';
export const SUPPORT_EMAIL = 'support@qaskills.sh';
