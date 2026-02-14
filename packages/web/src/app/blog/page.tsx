import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateBreadcrumbJsonLd } from '@/lib/json-ld';

export const metadata = {
  title: 'Blog',
  description:
    'QA testing insights, tutorials, and guides for using AI coding agents with curated testing skills. By The Testing Academy.',
};

const posts = [
  {
    slug: 'introducing-qaskills',
    title: 'Introducing QA Skills — Agent Skills for Testing',
    description: 'Why we built the first QA-specific skills directory for AI coding agents, and how it changes the way you write tests.',
    date: '2026-02-10',
    category: 'Announcement',
  },
  {
    slug: 'playwright-e2e-best-practices',
    title: 'Playwright E2E Best Practices for AI Agents',
    description: 'How our Playwright E2E skill teaches AI agents to write robust, maintainable end-to-end tests.',
    date: '2026-02-08',
    category: 'Tutorial',
  },
  {
    slug: 'ai-agents-qa-revolution',
    title: 'The AI Agent Revolution in QA Testing',
    description: 'How AI coding agents are transforming QA, and why they need specialized testing knowledge.',
    date: '2026-02-05',
    category: 'Industry',
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'QASkills.sh Blog',
            description: 'QA testing insights, tutorials, and guides for AI coding agents.',
            url: 'https://qaskills.sh/blog',
            publisher: {
              '@type': 'Organization',
              name: 'QASkills.sh',
              url: 'https://qaskills.sh',
            },
            blogPost: posts.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              datePublished: post.date,
              url: `https://qaskills.sh/blog/${post.slug}`,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: 'Home', url: 'https://qaskills.sh' },
              { name: 'Blog', url: 'https://qaskills.sh/blog' },
            ])
          ),
        }}
      />
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="mt-2 text-muted-foreground">QA testing insights, AI agent tips, and skill development guides</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-base">{post.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
