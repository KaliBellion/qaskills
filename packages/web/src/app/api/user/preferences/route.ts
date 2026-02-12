import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users, userPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const dbUsers = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, user.id))
      .limit(1);

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dbUser = dbUsers[0];

    // Get user preferences
    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, dbUser.id))
      .limit(1);

    if (prefs.length === 0) {
      // Create default preferences if they don't exist
      const newPrefs = await db
        .insert(userPreferences)
        .values({
          userId: dbUser.id,
          emailNotifications: true,
          weeklyDigest: true,
          newSkillAlerts: true,
          packAlerts: true,
        })
        .returning();

      return NextResponse.json(newPrefs[0]);
    }

    return NextResponse.json(prefs[0]);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { emailNotifications, weeklyDigest, newSkillAlerts, packAlerts } = body;

    // Get user from database
    const dbUsers = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, user.id))
      .limit(1);

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dbUser = dbUsers[0];

    // Update preferences
    const updated = await db
      .update(userPreferences)
      .set({
        emailNotifications,
        weeklyDigest,
        newSkillAlerts,
        packAlerts,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, dbUser.id))
      .returning();

    if (updated.length === 0) {
      // Create if doesn't exist
      const created = await db
        .insert(userPreferences)
        .values({
          userId: dbUser.id,
          emailNotifications,
          weeklyDigest,
          newSkillAlerts,
          packAlerts,
        })
        .returning();

      return NextResponse.json(created[0]);
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 },
    );
  }
}
