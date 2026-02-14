import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';
import { generateBlogPostJsonLd, generateBreadcrumbJsonLd } from '@/lib/json-ld';
import { posts } from '../posts';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: 'Post Not Found' };

  const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | QASkills.sh`,
      description: post.description,
      url: `https://qaskills.sh/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
    alternates: { canonical: `https://qaskills.sh/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBlogPostJsonLd({
              title: post.title,
              description: post.description,
              date: post.date,
              slug,
              image: `https://qaskills.sh/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}`,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: 'Home', url: 'https://qaskills.sh' },
              { name: 'Blog', url: 'https://qaskills.sh/blog' },
              { name: post.title, url: `https://qaskills.sh/blog/${slug}` },
            ])
          ),
        }}
      />

      <Link href="/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <article>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-muted-foreground">{post.date}</span>
          </div>
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          {post.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={i}>{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={i}>{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('```')) {
              const lines = paragraph.split('\n');
              const code = lines.slice(1, -1).join('\n');
              return <pre key={i}><code>{code}</code></pre>;
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={i}>
                  {paragraph.split('\n').map((li, j) => (
                    <li key={j}>{li.replace(/^- \*\*(.+?)\*\*: /, '$1: ').replace(/^- \*\*(.+?)\*\*/, '$1').replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
            }
            if (paragraph.startsWith('| ')) {
              const rows = paragraph.split('\n').filter(r => r.trim());
              if (rows.length < 2) return <p key={i}>{paragraph}</p>;
              const headers = rows[0].split('|').filter(c => c.trim()).map(c => c.trim());
              const dataRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));
              return (
                <div key={i} className="overflow-x-auto">
                  <table>
                    <thead>
                      <tr>{headers.map((h, hi) => <th key={hi}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, ri) => (
                        <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            if (paragraph.startsWith('---')) {
              return <hr key={i} />;
            }
            if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ')) {
              return (
                <ol key={i}>
                  {paragraph.split('\n').map((li, j) => (
                    <li key={j}>{li.replace(/^\d+\.\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1')}</li>
                  ))}
                </ol>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </div>
      </article>
    </div>
  );
}
