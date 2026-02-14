export function GET() {
  const content = `# QASkills.sh

> The curated QA skills directory for AI coding agents

## About
QASkills.sh is a free, open-source directory of QA testing skills for AI coding agents. Built by The Testing Academy (189K+ YouTube subscribers), it provides curated, quality-scored skills that can be installed into Claude Code, Cursor, GitHub Copilot, Windsurf, and 30+ other AI coding agents with a single command.

## Key Features
- 48+ curated QA testing skills with quality scores (0-100)
- One-command installation via CLI: npx qaskills add <skill-name>
- Supports 30+ AI coding agents
- Free and open source
- Skill Packs for bundled installations
- Community publishing support

## Content Structure
- /skills — Browse all QA skills with search and filtering
- /skills/[author]/[slug] — Individual skill detail pages
- /packs — Curated skill bundles
- /leaderboard — Top skills by installs, quality, and trending
- /blog — QA testing articles and guides
- /getting-started — Installation guide
- /how-to-publish — Skill publishing guide
- /pricing — Free and open source
- /faq — Frequently asked questions

## API
- GET /api/skills — Search and list skills (public, JSON)
- GET /api/skills/[id] — Skill details (public, JSON)
- GET /api/skills/[id]/content — Full SKILL.md content (public, text/markdown)
- GET /api/categories — List categories (public, JSON)
- GET /api/leaderboard — Leaderboard data (public, JSON)

## Contact
- Website: https://qaskills.sh
- GitHub: https://github.com/PramodDutta/qaskills
- YouTube: https://youtube.com/@TheTestingAcademy
- Author: Pramod Dutta

## Documentation
- Getting Started: https://qaskills.sh/getting-started
- How to Publish: https://qaskills.sh/how-to-publish
- FAQ: https://qaskills.sh/faq
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
