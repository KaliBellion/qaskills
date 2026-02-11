import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Get the authenticated user from Clerk in an API route context.
 * Returns the DB user row if found. If the user exists in Clerk but
 * not in the DB, auto-creates the row (handles missed webhooks).
 * Returns null when Clerk is not available or user is not signed in.
 */
export async function getAuthUser() {
  try {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    if (!userId) return null;

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existing) return existing;

    // User exists in Clerk but not in DB — auto-create (missed webhook)
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

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

    return created || null;
  } catch {
    return null;
  }
}
