import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Get the authenticated user from Clerk in an API route context.
 * Returns the DB user row if found. If the user exists in Clerk but
 * not in the DB, auto-creates the row (handles missed webhooks).
 * Returns null when Clerk is not available or user is not signed in.
 *
 * IMPORTANT: Uses static import of @clerk/nextjs/server so the auth()
 * function shares the same async local storage context set by the
 * clerkMiddleware in middleware.ts.
 */
export async function getAuthUser() {
  console.log('🔥 [v7-hotfix] getAuthUser called — if you see this, the new code is LIVE baby!');
  try {
    let authResult;
    try {
      authResult = await auth();
      console.log('🎯 [v7-hotfix] auth() returned successfully, full result keys:', Object.keys(authResult));
    } catch (authErr) {
      console.error('💀 [v7-hotfix] auth() threw an error — Clerk is having a bad day:', authErr);
      return null;
    }

    const { userId } = authResult;
    console.log(`🧑 [v7-hotfix] userId = ${userId ?? 'NULL — Houston, we have a problem'}`);
    if (!userId) return null;

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existing) {
      console.log('[getAuthUser] Found existing DB user:', existing.id);
      return existing;
    }

    console.log('[getAuthUser] User not in DB, auto-creating from Clerk...');

    // User exists in Clerk but not in DB — auto-create (missed webhook)
    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.error('[getAuthUser] currentUser() returned null for userId:', userId);
      return null;
    }

    const githubAccount = clerkUser.externalAccounts?.find(
      (a) => a.provider === 'oauth_github',
    );

    const [created] = await db
      .insert(users)
      .values({
        clerkId: userId,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        username: clerkUser.username || githubAccount?.username || userId,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        avatar: clerkUser.imageUrl || '',
        githubHandle: githubAccount?.username || '',
      })
      .onConflictDoNothing()
      .returning();

    console.log('[getAuthUser] Auto-created user:', created?.id ?? 'FAILED (conflict?)');
    return created || null;
  } catch (err) {
    console.error('[getAuthUser] Unexpected error:', err);
    return null;
  }
}
