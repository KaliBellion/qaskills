import type { MetadataRoute } from 'next';
import { db } from '@/db';
import { skills, users } from '@/db/schema';

const baseUrl = 'https://qaskills.sh';

const staticPages: MetadataRoute.Sitemap = [
  { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${baseUrl}/getting-started`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
  { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${baseUrl}/packs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${baseUrl}/how-to-publish`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
  { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${baseUrl}/llms.txt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
  // Index pages
  { url: `${baseUrl}/agents`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
  { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
  { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  // Agent pages
  { url: `${baseUrl}/agents/claude-code`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
  { url: `${baseUrl}/agents/cursor`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
  { url: `${baseUrl}/agents/copilot`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
  { url: `${baseUrl}/agents/windsurf`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
  { url: `${baseUrl}/agents/cline`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
  // Category pages
  { url: `${baseUrl}/categories/e2e-testing`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  { url: `${baseUrl}/categories/unit-testing`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  { url: `${baseUrl}/categories/api-testing`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  { url: `${baseUrl}/categories/performance-testing`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  { url: `${baseUrl}/categories/accessibility-testing`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  // Comparison pages
  { url: `${baseUrl}/compare/qaskills-vs-skillsmp`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.75 },
  { url: `${baseUrl}/compare/playwright-vs-cypress-skills`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.75 },
];

const blogPosts = [
  { slug: 'introducing-qaskills', date: '2025-12-01' },
  { slug: 'playwright-e2e-best-practices', date: '2025-12-15' },
  { slug: 'ai-agents-qa-revolution', date: '2026-01-10' },
];

const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: new Date(post.date),
  changeFrequency: 'monthly',
  priority: 0.6,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const allSkills = await db
      .select({ slug: skills.slug, authorName: skills.authorName, updatedAt: skills.updatedAt })
      .from(skills);

    const skillPages: MetadataRoute.Sitemap = allSkills.map((skill) => ({
      url: `${baseUrl}/skills/${skill.authorName}/${skill.slug}`,
      lastModified: skill.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const allUsers = await db
      .select({ username: users.username, updatedAt: users.updatedAt })
      .from(users);

    const userPages: MetadataRoute.Sitemap = allUsers.map((user) => ({
      url: `${baseUrl}/users/${user.username}`,
      lastModified: user.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticPages, ...skillPages, ...userPages, ...blogPages];
  } catch {
    // Fallback to static pages only when DB is not available
    return [...staticPages, ...blogPages];
  }
}
