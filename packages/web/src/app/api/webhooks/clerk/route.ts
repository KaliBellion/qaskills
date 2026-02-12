import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === 'user.created') {
      const email = data.email_addresses?.[0]?.email_address || '';
      const username = data.username || data.id;

      // Create user
      const result = await db.insert(users).values({
        clerkId: data.id,
        email,
        username,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        avatar: data.image_url || '',
        githubHandle:
          data.external_accounts?.find(
            (a: Record<string, unknown>) => a.provider === 'oauth_github',
          )?.username || '',
      }).onConflictDoNothing().returning();

      // Create user preferences with defaults
      if (result.length > 0) {
        await db.insert(userPreferences).values({
          userId: result[0].id,
          emailNotifications: true,
          weeklyDigest: true,
          newSkillAlerts: true,
          packAlerts: true,
          leadSource: null, // Can be enhanced with UTM tracking
        }).onConflictDoNothing();

        // Send welcome email (non-blocking)
        sendWelcomeEmail({ email, username, userId: result[0].id }).catch((error) =>
          console.error('Failed to send welcome email:', error),
        );
      }
    }

    if (type === 'user.updated') {
      await db.update(users).set({
        email: data.email_addresses?.[0]?.email_address || '',
        username: data.username || data.id,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        avatar: data.image_url || '',
        updatedAt: new Date(),
      }).where(eq(users.clerkId, data.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}
