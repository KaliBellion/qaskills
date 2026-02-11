import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { skills, categories, skillPacks, skillPackItems } from './schema';
import { TESTING_TYPES, FRAMEWORKS, LANGUAGES, DOMAINS } from '@qaskills/shared';

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not set, skipping seed');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log('Seeding categories...');

  // Seed categories
  const allCategories = [
    ...TESTING_TYPES.map((t) => ({ name: t.name, slug: t.slug, description: t.description, type: 'testingType' as const, icon: t.icon, color: t.color })),
    ...FRAMEWORKS.map((f) => ({ name: f.name, slug: f.slug, description: f.description, type: 'framework' as const, icon: f.icon, color: f.color })),
    ...LANGUAGES.map((l) => ({ name: l.name, slug: l.slug, description: '', type: 'language' as const, icon: l.icon, color: l.color })),
    ...DOMAINS.map((d) => ({ name: d.name, slug: d.slug, description: d.description, type: 'domain' as const, icon: d.icon, color: d.color })),
  ];

  for (const cat of allCategories) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  console.log(`Seeded ${allCategories.length} categories`);

  // Seed skills
  console.log('Seeding skills...');

  const seedSkills = [
    { name: 'Playwright E2E Testing', slug: 'playwright-e2e', description: 'Comprehensive Playwright end-to-end testing patterns with Page Object Model, fixtures, and best practices', authorName: 'thetestingacademy', qualityScore: 92, installCount: 86, weeklyInstalls: 86, testingTypes: ['e2e', 'visual'], frameworks: ['playwright'], languages: ['typescript', 'javascript'], domains: ['web'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: true, verified: true },
    { name: 'Playwright API Testing', slug: 'playwright-api', description: 'API testing with Playwright APIRequestContext for REST and GraphQL endpoints', authorName: 'thetestingacademy', qualityScore: 88, installCount: 32, weeklyInstalls: 32, testingTypes: ['api'], frameworks: ['playwright'], languages: ['typescript'], domains: ['api'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Cypress E2E Testing', slug: 'cypress-e2e', description: 'Cypress end-to-end testing with custom commands, intercepts, and component testing', authorName: 'thetestingacademy', qualityScore: 90, installCount: 58, weeklyInstalls: 58, testingTypes: ['e2e'], frameworks: ['cypress'], languages: ['javascript', 'typescript'], domains: ['web'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: true, verified: true },
    { name: 'Selenium Java Testing', slug: 'selenium-java', description: 'Selenium WebDriver with Java using Page Object Model and TestNG', authorName: 'thetestingacademy', qualityScore: 85, installCount: 22, weeklyInstalls: 22, testingTypes: ['e2e'], frameworks: ['selenium'], languages: ['java'], domains: ['web'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'k6 Performance Testing', slug: 'k6-performance', description: 'Modern load testing with k6 including thresholds, scenarios, and custom metrics', authorName: 'thetestingacademy', qualityScore: 87, installCount: 35, weeklyInstalls: 35, testingTypes: ['performance', 'load'], frameworks: ['k6'], languages: ['javascript'], domains: ['api', 'web'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: true, verified: true },
    { name: 'JMeter Load Testing', slug: 'jmeter-load', description: 'Apache JMeter load testing with thread groups, assertions, and distributed testing', authorName: 'thetestingacademy', qualityScore: 82, installCount: 15, weeklyInstalls: 15, testingTypes: ['load', 'performance'], frameworks: ['jmeter'], languages: ['java'], domains: ['api', 'web'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'OWASP Security Testing', slug: 'owasp-security', description: 'OWASP Top 10 security testing patterns and vulnerability scanning', authorName: 'thetestingacademy', qualityScore: 89, installCount: 26, weeklyInstalls: 26, testingTypes: ['security'], frameworks: [], languages: ['typescript', 'python'], domains: ['web', 'api'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: true, verified: true },
    { name: 'Appium Mobile Testing', slug: 'appium-mobile', description: 'Mobile app testing automation for iOS and Android with Appium', authorName: 'thetestingacademy', qualityScore: 84, installCount: 11, weeklyInstalls: 11, testingTypes: ['mobile', 'e2e'], frameworks: ['appium'], languages: ['java', 'typescript'], domains: ['mobile'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Axe-core Accessibility', slug: 'axe-accessibility', description: 'Automated accessibility testing with axe-core and WCAG 2.1 compliance', authorName: 'thetestingacademy', qualityScore: 86, installCount: 14, weeklyInstalls: 14, testingTypes: ['accessibility'], frameworks: ['axe-core'], languages: ['typescript'], domains: ['web'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Test Data Generation', slug: 'test-data-generation', description: 'Test data strategies using Faker.js, factories, builders, and database seeding', authorName: 'thetestingacademy', qualityScore: 83, installCount: 18, weeklyInstalls: 18, testingTypes: ['unit', 'integration', 'e2e'], frameworks: [], languages: ['typescript', 'python', 'java'], domains: ['web', 'api'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'REST Assured API Testing', slug: 'rest-assured-api', description: 'Java REST API testing with REST Assured including JSON schema validation', authorName: 'thetestingacademy', qualityScore: 85, installCount: 13, weeklyInstalls: 13, testingTypes: ['api'], frameworks: ['rest-assured'], languages: ['java'], domains: ['api'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Jest Unit Testing', slug: 'jest-unit', description: 'Jest unit testing patterns with mocking, spies, snapshots, and async testing', authorName: 'thetestingacademy', qualityScore: 91, installCount: 64, weeklyInstalls: 64, testingTypes: ['unit'], frameworks: ['jest'], languages: ['typescript', 'javascript'], domains: ['web'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: true, verified: true },
    { name: 'Pytest Patterns', slug: 'pytest-patterns', description: 'Python testing with pytest fixtures, parametrize, markers, and plugins', authorName: 'thetestingacademy', qualityScore: 88, installCount: 41, weeklyInstalls: 41, testingTypes: ['unit', 'integration'], frameworks: ['pytest'], languages: ['python'], domains: ['api', 'web'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Postman API Testing', slug: 'postman-api', description: 'Postman collections, environments, pre-request scripts, and Newman CI', authorName: 'thetestingacademy', qualityScore: 84, installCount: 19, weeklyInstalls: 19, testingTypes: ['api'], frameworks: ['postman'], languages: ['javascript'], domains: ['api'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'BDD/Cucumber Patterns', slug: 'bdd-cucumber', description: 'Behavior-driven development with Cucumber, Gherkin, and step definitions', authorName: 'thetestingacademy', qualityScore: 82, installCount: 9, weeklyInstalls: 9, testingTypes: ['bdd', 'e2e'], frameworks: ['cucumber'], languages: ['typescript', 'java'], domains: ['web', 'api'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Test Plan Generation', slug: 'test-plan-generation', description: 'Generate comprehensive test plans with coverage matrices and risk-based testing', authorName: 'thetestingacademy', qualityScore: 80, installCount: 8, weeklyInstalls: 8, testingTypes: ['e2e', 'integration', 'unit'], frameworks: [], languages: ['typescript'], domains: ['web', 'api'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Bug Report Writing', slug: 'bug-report-writing', description: 'Write clear bug reports with reproduction steps and severity classification', authorName: 'thetestingacademy', qualityScore: 78, installCount: 6, weeklyInstalls: 6, testingTypes: [], frameworks: [], languages: [], domains: ['web', 'api', 'mobile'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'CI/CD Pipeline Config', slug: 'cicd-pipeline', description: 'Configure testing in CI/CD pipelines for GitHub Actions, Jenkins, and GitLab CI', authorName: 'thetestingacademy', qualityScore: 85, installCount: 28, weeklyInstalls: 28, testingTypes: ['integration'], frameworks: [], languages: ['typescript'], domains: ['devops'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Visual Regression Testing', slug: 'visual-regression', description: 'Visual regression testing with Playwright screenshots and diff comparison', authorName: 'thetestingacademy', qualityScore: 86, installCount: 16, weeklyInstalls: 16, testingTypes: ['visual', 'e2e'], frameworks: ['playwright'], languages: ['typescript'], domains: ['web'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Contract Testing (Pact)', slug: 'contract-testing-pact', description: 'Consumer-driven contract testing with Pact and Pact Broker', authorName: 'thetestingacademy', qualityScore: 84, installCount: 7, weeklyInstalls: 7, testingTypes: ['contract', 'api'], frameworks: ['pact'], languages: ['typescript', 'java'], domains: ['api'], agents: ['claude-code', 'cursor', 'github-copilot', 'windsurf', 'codex', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: false, verified: true },
    { name: 'Vibe Check - Browser Automation', slug: 'vibe-check', description: 'Automate Chrome browser interactions via CLI with persistent daemon mode. Navigate pages, extract content, click elements, type text, manage tabs, and take screenshots.', authorName: 'vibiumdev', qualityScore: 88, installCount: 24, weeklyInstalls: 24, testingTypes: ['e2e', 'visual'], frameworks: ['playwright'], languages: ['typescript', 'javascript'], domains: ['web'], agents: ['claude-code', 'cursor', 'github-copilot', 'opencode', 'gemini-cli', 'codex', 'amp'], featured: true, verified: true, githubUrl: 'https://github.com/vibiumdev/vibium' },
    { name: 'Agent Browser', slug: 'agent-browser', description: 'Browser automation tool by Vercel Labs enabling programmatic web interaction. Navigate URLs, capture interactive elements with refs, fill forms, take screenshots, generate PDFs, and run parallel sessions.', authorName: 'vercel-labs', qualityScore: 95, installCount: 47, weeklyInstalls: 47, testingTypes: ['e2e', 'visual', 'accessibility'], frameworks: ['playwright'], languages: ['typescript', 'javascript'], domains: ['web', 'mobile'], agents: ['claude-code', 'cursor', 'github-copilot', 'opencode', 'gemini-cli', 'codex', 'amp', 'windsurf', 'aider', 'continue', 'cline', 'zed', 'bolt'], featured: true, verified: true, githubUrl: 'https://github.com/vercel-labs/agent-browser' },
  ];

  for (const skill of seedSkills) {
    await db.insert(skills).values(skill).onConflictDoUpdate({
      target: skills.slug,
      set: { installCount: skill.installCount, weeklyInstalls: skill.weeklyInstalls, qualityScore: skill.qualityScore },
    });
  }

  console.log(`Seeded ${seedSkills.length} skills`);

  // Seed skill packs
  console.log('Seeding skill packs...');

  const seedPacks = [
    {
      name: 'Complete Playwright Suite',
      slug: 'playwright-suite',
      description: 'Everything you need for Playwright testing — E2E, API, visual regression, and accessibility.',
      featured: true,
      installCount: 38,
      skillSlugs: ['playwright-e2e', 'playwright-api', 'visual-regression', 'axe-accessibility'],
    },
    {
      name: 'API Testing Toolkit',
      slug: 'api-testing-toolkit',
      description: 'Comprehensive API testing with REST, GraphQL, contract testing, and performance.',
      featured: true,
      installCount: 21,
      skillSlugs: ['playwright-api', 'rest-assured-api', 'postman-api', 'contract-testing-pact', 'k6-performance'],
    },
    {
      name: 'Performance & Load Testing',
      slug: 'performance-suite',
      description: 'Load test your applications with k6 and JMeter, plus CI/CD integration.',
      featured: false,
      installCount: 12,
      skillSlugs: ['k6-performance', 'jmeter-load', 'cicd-pipeline'],
    },
    {
      name: 'Security & Compliance',
      slug: 'security-compliance',
      description: 'OWASP security testing and accessibility compliance in one pack.',
      featured: false,
      installCount: 9,
      skillSlugs: ['owasp-security', 'axe-accessibility'],
    },
    {
      name: 'Mobile Testing Kit',
      slug: 'mobile-testing-kit',
      description: 'Mobile app testing automation for iOS and Android with Appium and cross-platform tools.',
      featured: false,
      installCount: 5,
      skillSlugs: ['appium-mobile', 'bug-report-writing'],
    },
    {
      name: 'Full Stack QA',
      slug: 'full-stack-qa',
      description: 'A curated mix of the best featured QA skills across all testing types.',
      featured: true,
      installCount: 31,
      skillSlugs: ['playwright-e2e', 'cypress-e2e', 'k6-performance', 'owasp-security', 'jest-unit', 'pytest-patterns', 'cicd-pipeline', 'test-data-generation'],
    },
  ];

  for (const pack of seedPacks) {
    const { skillSlugs, ...packData } = pack;

    // Insert the pack
    await db.insert(skillPacks).values(packData).onConflictDoNothing();

    // Look up the pack ID by slug
    const [insertedPack] = await db
      .select({ id: skillPacks.id })
      .from(skillPacks)
      .where(eq(skillPacks.slug, pack.slug))
      .limit(1);

    if (!insertedPack) continue;

    // Link skills to pack
    for (let i = 0; i < skillSlugs.length; i++) {
      const [skill] = await db
        .select({ id: skills.id })
        .from(skills)
        .where(eq(skills.slug, skillSlugs[i]))
        .limit(1);

      if (skill) {
        await db
          .insert(skillPackItems)
          .values({
            packId: insertedPack.id,
            skillId: skill.id,
            order: i,
          })
          .onConflictDoNothing();
      }
    }
  }

  console.log(`Seeded ${seedPacks.length} skill packs with items`);
  console.log('Seed complete!');
}

seed().catch(console.error);
