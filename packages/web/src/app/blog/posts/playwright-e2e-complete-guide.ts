import type { BlogPost } from './index';

export const post: BlogPost = {
  title: 'Complete Guide: Setting Up Playwright E2E Testing with AI Skills',
  description:
    'A step-by-step guide to building a production-grade Playwright E2E test suite with AI agent skills. Covers Page Object Model, fixtures, locators, CI/CD, and common mistakes.',
  date: '2026-02-13',
  category: 'Tutorial',
  content: `
This is the definitive playwright e2e testing guide for developers using AI coding agents in 2026. Whether you are setting up Playwright for the first time or upgrading an existing test suite, this guide walks you through every step -- from installation to CI/CD integration -- with the patterns that experienced QA engineers use in production.

## What You'll Learn

- How to install and configure Playwright for a production project
- How the playwright-e2e skill from QASkills.sh supercharges your AI agent's test output
- The Page Object Model pattern with complete TypeScript examples
- Playwright's auto-waiting locator strategies and when to use each
- Fixture-based test setup for authentication and test isolation
- Cross-browser and mobile testing configuration
- Visual regression testing with screenshot comparison
- CI/CD integration with GitHub Actions including sharding
- The 10 most common Playwright mistakes and how to avoid them

---

## Prerequisites

Before starting, ensure you have Node.js 18 or later and a web application to test. This guide uses TypeScript, but the patterns apply to JavaScript projects as well.

---

## Why Playwright for E2E Testing in 2026

Playwright has established itself as the leading E2E testing framework for several compelling reasons. It supports all major browsers (Chromium, Firefox, WebKit) with a single API. Its auto-waiting mechanism eliminates the most common source of test flakiness. The fixture system enforces test isolation by design. Trace viewer provides complete debugging capability for CI failures. And native TypeScript support with strong typing catches errors at compile time.

---

## Setting Up Playwright

\`\`\`bash
npm init playwright@latest
\`\`\`

This creates your project structure including \`playwright.config.ts\`, \`tests/\` directory, and example specs. For AI agent users, the next critical step is installing the Playwright E2E skill:

\`\`\`bash
npx @qaskills/cli add playwright-e2e
\`\`\`

This installs expert Playwright knowledge into your AI agent. From this point forward, every test your agent generates follows production-grade patterns. Visit the [Claude Code agent page](/agents/claude-code) to see how skills integrate with different agents.

---

## Page Object Model Pattern

The Page Object Model is the foundation of maintainable E2E tests. Every page in your application gets its own class that encapsulates selectors and actions.

### Base Page Class

\`\`\`bash
// tests/pages/base.page.ts
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: \`screenshots/\${name}.png\` });
  }
}
\`\`\`

### Login Page Object

\`\`\`bash
// tests/pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
  }
}
\`\`\`

Notice how every locator uses semantic selectors -- \`getByRole\`, \`getByLabel\` -- instead of CSS selectors. This is the pattern the [playwright-e2e skill](/skills) enforces.

---

## Writing Your First E2E Test

\`\`\`bash
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('Login functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login('user@example.com', 'SecurePass123!');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login('user@example.com', 'wrongpassword');
    await loginPage.expectErrorMessage('Invalid email or password');
  });
});
\`\`\`

---

## Auto-Waiting Locator Strategies

Choosing the right locator strategy is the most important decision in E2E testing. The wrong selectors cause 80% of test flakiness. Always follow this priority order:

1. **getByRole** -- Queries the accessibility tree. The gold standard.
2. **getByLabel** -- For form inputs with associated labels.
3. **getByPlaceholder** -- When no label exists.
4. **getByText** -- For non-interactive elements with visible text.
5. **getByTestId** -- When semantic selectors are not feasible.
6. **CSS/XPath** -- Absolute last resort. Document why.

Each locator auto-waits for the element to be attached, visible, stable, and enabled before performing an action.

---

## Fixture-Based Test Setup

Fixtures replace ad-hoc beforeEach blocks with a composable, type-safe system:

\`\`\`bash
// tests/fixtures/index.ts
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type TestFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
\`\`\`

### Authentication State Reuse

Save auth state once and reuse across all tests -- this alone can cut suite execution time by 40%:

\`\`\`bash
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('AdminPass123!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
\`\`\`

---

## Cross-Browser Testing Configuration

A production-ready \`playwright.config.ts\` configures desktop browsers, mobile viewports, proper reporters, trace capture, and screenshots on failure. Use the \`devices\` import for pre-configured profiles of dozens of devices.

\`\`\`bash
npx playwright test --project=chromium
npx playwright test --project=mobile-safari
npx playwright test  # all browsers
\`\`\`

---

## Visual Regression Testing

Playwright includes built-in screenshot comparison:

\`\`\`bash
test('homepage matches baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
\`\`\`

Update baselines with \`npx playwright test --update-snapshots\`.

---

## CI/CD Integration with GitHub Actions

Use sharding to split your suite across parallel runners, cutting CI time by 75%. Configure \`retries: 2\` with \`trace: 'on-first-retry'\` so failing tests always produce debugging data. Set \`fail-fast: false\` to get the full picture of test health.

For advanced CI/CD patterns, install the [cicd-pipeline skill](/skills) from QASkills.

---

## Common Mistakes and How to Avoid Them

1. **Using waitForTimeout()** -- Use auto-waiting assertions instead
2. **CSS selectors over semantic locators** -- Use getByRole, getByLabel first
3. **Sharing state between tests** -- Each test must be independent
4. **Testing implementation details** -- Test what the user sees, not DOM structure
5. **Not using baseURL** -- Configure once in playwright.config.ts
6. **Giant test files** -- Split by feature, keep under 200 lines
7. **Not using test.describe** -- Group tests by feature with shared setup
8. **Ignoring soft assertions** -- Use expect.soft() for multi-check tests
9. **Not tagging tests** -- Use @smoke, @critical for selective execution
10. **Not using Trace Viewer** -- \`npx playwright show-trace trace.zip\` for CI debugging

---

## Next Steps

Install additional skills to cover your full testing strategy:

- [playwright-api](/skills) -- API testing with Playwright's request context
- [visual-regression](/skills) -- Advanced visual comparison patterns
- [k6-performance](/skills) -- Performance testing to complement E2E
- [accessibility-axe](/skills) -- Accessibility testing in your E2E suite

Browse the full catalog at [qaskills.sh/skills](/skills). Each AI agent has unique capabilities: [Claude Code](/agents/claude-code) for complex scenarios, [Cursor](/agents/cursor) for IDE integration, [Copilot](/agents/copilot) for context-aware suggestions.

\`\`\`bash
npx @qaskills/cli add playwright-e2e
\`\`\`

---

*Written by [Pramod Dutta](https://thetestingacademy.com), founder of The Testing Academy and QASkills.sh.*
`,
};
