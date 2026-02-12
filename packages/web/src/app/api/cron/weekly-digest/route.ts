import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { skills, users, userPreferences } from '@/db/schema';
import { desc, eq, and, gte, sql } from 'drizzle-orm';
import { sendWeeklyDigest } from '@/lib/email/send';

/**
 * Weekly Digest Cron Job
 *
 * This endpoint should be called weekly via Vercel Cron or similar service.
 * It sends a digest of top skills to all users who opted in.
 *
 * To set up in Vercel:
 * 1. Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/weekly-digest",
 *     "schedule": "0 9 * * 1"
 *   }]
 * }
 *
 * Security: Protect with CRON_SECRET environment variable
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 },
      );
    }

    // Get top 10 skills from the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const topSkills = await db
      .select({
        name: skills.name,
        description: skills.description,
        author: skills.authorName,
        slug: skills.slug,
        installCount: skills.installCount,
        qualityScore: skills.qualityScore,
        authorName: skills.authorName,
      })
      .from(skills)
      .orderBy(desc(skills.weeklyInstalls), desc(skills.installCount))
      .limit(10);

    if (topSkills.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No skills to send',
        sent: 0,
      });
    }

    // Get users who want weekly digest
    const subscribers = await db
      .select({
        userId: users.id,
        email: users.email,
        username: users.username,
      })
      .from(users)
      .innerJoin(userPreferences, eq(users.id, userPreferences.userId))
      .where(
        and(
          eq(userPreferences.emailNotifications, true),
          eq(userPreferences.weeklyDigest, true),
        ),
      );

    console.log(`📧 Sending weekly digest to ${subscribers.length} subscribers`);

    let sentCount = 0;
    let failedCount = 0;

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const results = await Promise.allSettled(
        batch.map((subscriber) =>
          sendWeeklyDigest(
            { email: subscriber.email, username: subscriber.username, userId: subscriber.userId },
            topSkills,
          ),
        ),
      );

      // Count successes and failures
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.success) {
          sentCount++;
        } else {
          failedCount++;
          console.error('Failed to send weekly digest:', result);
        }
      });

      // Wait 1 second between batches to respect rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      failed: failedCount,
      total: subscribers.length,
      topSkills: topSkills.length,
    });
  } catch (error) {
    console.error('Weekly digest cron error:', error);
    return NextResponse.json(
      { error: 'Failed to send weekly digest' },
      { status: 500 },
    );
  }
}

// Allow POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
