import type { Metadata } from 'next';
import Link from 'next/link';
import { generateBreadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'QA Skills by AI Agent',
  description:
    'Browse QA testing skills by AI coding agent. Find curated skills for Claude Code, Cursor, GitHub Copilot, Windsurf, Cline, and 30+ more agents.',
  alternates: { canonical: 'https://qaskills.sh/agents' },
};

const agents = [
  {
    name: 'Claude Code',
    slug: 'claude-code',
    description:
      "Anthropic's AI coding agent with terminal access and deep codebase understanding.",
  },
  {
    name: 'Cursor',
    slug: 'cursor',
    description: 'AI-first code editor with intelligent autocomplete and multi-file editing.',
  },
  {
    name: 'GitHub Copilot',
    slug: 'copilot',
    description: 'AI pair programmer integrated into VS Code, JetBrains, and GitHub.',
  },
  {
    name: 'Windsurf',
    slug: 'windsurf',
    description: 'AI-powered IDE by Codeium with Cascade flows and deep context.',
  },
  {
    name: 'Cline',
    slug: 'cline',
    description: 'Open-source AI coding assistant for VS Code with autonomous capabilities.',
  },
];

export default function AgentsIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: 'Home', url: 'https://qaskills.sh' },
              { name: 'Agents', url: 'https://qaskills.sh/agents' },
            ])
          ),
        }}
      />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">QA Skills by AI Agent</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        Find curated QA testing skills optimized for your AI coding agent. All skills use the open
        SKILL.md standard and install with a single command.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Link
            key={agent.slug}
            href={`/agents/${agent.slug}`}
            className="group rounded-lg border border-border p-6 transition-colors hover:border-primary"
          >
            <h2 className="text-xl font-semibold group-hover:text-primary">{agent.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{agent.description}</p>
            <span className="mt-3 inline-block text-sm text-primary">View skills &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
