import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe-token';

type UnsubscribeType = 'all' | 'weekly' | 'alerts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, type } = body as { token?: string; type?: UnsubscribeType };

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Verify the token
    const payload = verifyUnsubscribeToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired unsubscribe token' },
        { status: 400 },
      );
    }

    const { userId } = payload;

    // Verify the user exists
    const dbUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build the update based on type
    const updateFields: Record<string, unknown> = { updatedAt: new Date() };
    const unsubscribeType = type || 'all';

    switch (unsubscribeType) {
      case 'all':
        updateFields.emailNotifications = false;
        break;
      case 'weekly':
        updateFields.weeklyDigest = false;
        break;
      case 'alerts':
        updateFields.newSkillAlerts = false;
        break;
      default:
        updateFields.emailNotifications = false;
    }

    // Try to update existing preferences
    const updated = await db
      .update(userPreferences)
      .set(updateFields)
      .where(eq(userPreferences.userId, userId))
      .returning();

    if (updated.length === 0) {
      // No preferences row exists — create one with the appropriate fields disabled
      const defaults = {
        userId,
        emailNotifications: true,
        weeklyDigest: true,
        newSkillAlerts: true,
        packAlerts: true,
      };

      if (unsubscribeType === 'all') {
        defaults.emailNotifications = false;
      } else if (unsubscribeType === 'weekly') {
        defaults.weeklyDigest = false;
      } else if (unsubscribeType === 'alerts') {
        defaults.newSkillAlerts = false;
      }

      await db.insert(userPreferences).values(defaults);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing unsubscribe:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 },
    );
  }
}
