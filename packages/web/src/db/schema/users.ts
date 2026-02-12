import { pgTable, text, boolean, integer, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  name: text('name').notNull().default(''),
  avatar: text('avatar').default(''),
  bio: text('bio').default(''),
  githubHandle: text('github_handle').default(''),
  verifiedPublisher: boolean('verified_publisher').default(false).notNull(),
  totalInstalls: integer('total_installs').default(0).notNull(),
  skillsPublished: integer('skills_published').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  weeklyDigest: boolean('weekly_digest').default(true).notNull(),
  newSkillAlerts: boolean('new_skill_alerts').default(true).notNull(),
  packAlerts: boolean('pack_alerts').default(true).notNull(),
  leadSource: text('lead_source'),
  capturedAt: timestamp('captured_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserRow = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserPreferencesRow = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
