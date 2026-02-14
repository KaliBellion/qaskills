import type { Metadata } from 'next';
import Link from 'next/link';
import { generateBreadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Compare QA Tools & Skills',
  description:
    'Compare QA testing tools, frameworks, and AI agent skill directories. Detailed comparisons to help you choose the right testing stack.',
  alternates: { canonical: 'https://qaskills.sh/compare' },
};

const comparisons = [
  {
    title: 'QASkills vs SkillsMP',
    slug: 'qaskills-vs-skillsmp',
    description:
      'Compare QA-focused curation vs general-purpose skill marketplace for AI agents.',
  },
  {
    title: 'Playwright vs Cypress Skills',
    slug: 'playwright-vs-cypress-skills',
    description: 'Compare Playwright and Cypress testing skills for AI coding agents.',
  },
];

export default function CompareIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: 'Home', url: 'https://qaskills.sh' },
              { name: 'Compare', url: 'https://qaskills.sh/compare' },
            ])
          ),
        }}
      />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Compare QA Tools &amp; Skills
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Detailed comparisons to help you choose the right QA testing tools and AI agent skills.
      </p>
      <div className="mt-8 space-y-4">
        {comparisons.map((comp) => (
          <Link
            key={comp.slug}
            href={`/compare/${comp.slug}`}
            className="group block rounded-lg border border-border p-6 transition-colors hover:border-primary"
          >
            <h2 className="text-xl font-semibold group-hover:text-primary">{comp.title}</h2>
            <p className="mt-2 text-muted-foreground">{comp.description}</p>
            <span className="mt-2 inline-block text-sm text-primary">
              Read comparison &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
