import type { Metadata } from 'next';
import Link from 'next/link';
import { generateBreadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'QA Skills by Testing Type',
  description:
    'Browse QA testing skills by category. E2E testing, unit testing, API testing, performance testing, and accessibility testing skills for AI agents.',
  alternates: { canonical: 'https://qaskills.sh/categories' },
};

const categories = [
  {
    name: 'E2E Testing',
    slug: 'e2e-testing',
    description:
      'End-to-end testing with Playwright, Cypress, Selenium, and browser automation frameworks.',
  },
  {
    name: 'Unit Testing',
    slug: 'unit-testing',
    description: 'Unit testing with Jest, Vitest, pytest, and test-driven development practices.',
  },
  {
    name: 'API Testing',
    slug: 'api-testing',
    description: 'REST and GraphQL API testing, contract testing, and HTTP automation.',
  },
  {
    name: 'Performance Testing',
    slug: 'performance-testing',
    description: 'Load testing, performance monitoring, Lighthouse audits, and Core Web Vitals.',
  },
  {
    name: 'Accessibility Testing',
    slug: 'accessibility-testing',
    description: 'WCAG compliance, axe-core integration, and inclusive design testing.',
  },
];

export default function CategoriesIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: 'Home', url: 'https://qaskills.sh' },
              { name: 'Categories', url: 'https://qaskills.sh/categories' },
            ])
          ),
        }}
      />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        QA Skills by Testing Type
      </h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        Explore curated QA testing skills organized by testing methodology. Each category contains
        expert-curated skills you can install with a single command.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group rounded-lg border border-border p-6 transition-colors hover:border-primary"
          >
            <h2 className="text-xl font-semibold group-hover:text-primary">{cat.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{cat.description}</p>
            <span className="mt-3 inline-block text-sm text-primary">View skills &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
