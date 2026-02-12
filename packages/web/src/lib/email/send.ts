import { resend, FROM_EMAIL } from './client';
import WelcomeEmail from '@/emails/welcome';
import NewSkillAlert from '@/emails/new-skill-alert';
import WeeklyDigest from '@/emails/weekly-digest';

interface User {
  email: string;
  username: string;
}

interface Skill {
  name: string;
  description: string;
  author: string;
  slug: string;
  installCount: number;
  qualityScore: number;
  authorName: string;
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(user: User) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set, skipping welcome email');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Welcome to QASkills.sh! 🎉',
      react: WelcomeEmail({ username: user.username }),
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send new skill alert to users who opted in
 */
export async function sendNewSkillAlert(user: User, skill: Skill) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set, skipping skill alert');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `New QA Skill: ${skill.name}`,
      react: NewSkillAlert({
        skillName: skill.name,
        skillDescription: skill.description,
        skillAuthor: skill.author,
        skillSlug: skill.slug,
        authorName: skill.authorName,
      }),
    });

    if (error) {
      console.error('Failed to send skill alert:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending skill alert:', error);
    return { success: false, error };
  }
}

/**
 * Send weekly digest with top skills
 */
export async function sendWeeklyDigest(user: User, skills: Skill[]) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set, skipping weekly digest');
      return { success: false, error: 'Email service not configured' };
    }

    const now = new Date();
    const weekNumber = getWeekNumber(now);
    const year = now.getFullYear();

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `QASkills Weekly Digest - Week ${weekNumber}, ${year}`,
      react: WeeklyDigest({ skills, weekNumber, year }),
    });

    if (error) {
      console.error('Failed to send weekly digest:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending weekly digest:', error);
    return { success: false, error };
  }
}

/**
 * Get ISO week number for a date
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Send batch emails with rate limiting
 */
export async function sendBatchEmails<T>(
  recipients: T[],
  sendFn: (recipient: T) => Promise<any>,
  batchSize = 10,
  delayMs = 1000,
) {
  const results = [];
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(sendFn));
    results.push(...batchResults);

    // Add delay between batches to respect rate limits
    if (i + batchSize < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return results;
}
