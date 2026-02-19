import type { BlogPost } from './index';

export const post: BlogPost = {
  title: 'Playwright Test Agents + Claude Code: Complete Setup Guide',
  description:
    'Learn how to set up Playwright test agents -- planner, generator, and healer -- with Claude Code for AI-powered self-healing test automation. Covers MCP setup, code examples, and CI/CD integration.',
  date: '2026-02-19',
  category: 'Tutorial',
  content: `
Playwright test agents represent a fundamental shift in how teams approach end-to-end test automation. Instead of manually writing every test file, maintaining brittle selectors, and debugging CI failures at 2 AM, you now have three specialized AI agents -- planner, generator, and healer -- that work together to create, execute, and repair your test suite automatically. Paired with Claude Code and the Model Context Protocol (MCP), this architecture turns test automation into a collaborative loop between human intent and machine execution. This guide walks you through the complete setup, from installation to CI/CD integration, with real TypeScript examples you can use today.

## Key Takeaways

- Playwright ships with three built-in test agents -- planner, generator, and healer -- that form an agentic testing loop
- The planner agent explores your application and produces a structured Markdown test plan from high-level goals
- The generator agent transforms those plans into executable Playwright test files with proper selectors and assertions
- The healer agent monitors test failures, analyzes traces and DOM snapshots, and automatically patches broken selectors or assertions
- Claude Code integrates with Playwright agents via MCP, giving you a CLI-first workflow for AI-driven test automation
- QASkills.sh skills like [playwright-e2e](/skills) and [playwright-api](/skills) layer expert testing patterns on top of the agent architecture

---

## What Are Playwright Test Agents

Playwright test agents are a set of three specialized AI subagents that ship with Playwright. Each agent handles a distinct phase of the test automation lifecycle, and they can be used independently or chained together in sequence. The key insight behind the architecture is that writing good tests involves three separate cognitive tasks -- planning what to test, translating plans into code, and maintaining tests as the application evolves -- and each task benefits from a purpose-built agent.

### The Planner Agent

The planner agent takes a high-level goal like "test the checkout flow" and explores your application's current UI to produce a structured Markdown test plan. It navigates pages, identifies user flows, catalogs interactive elements, and outlines test scenarios including edge cases and expected results.

The output is a human-readable Markdown document stored in a \`specs/\` directory. This is intentional -- test plans are meant to be reviewed, edited, and versioned alongside your code. A senior QA engineer can refine the planner's output before handing it to the generator, creating a feedback loop where human expertise shapes agent behavior.

### The Generator Agent

The generator agent reads the Markdown test plan and translates it into executable Playwright test scripts in TypeScript. It identifies the right selectors (preferring semantic locators like \`getByRole\` and \`getByLabel\`), adds proper assertions, sets up fixtures, and organizes test files by feature.

The generator validates its selectors against a live browser session, which means the code it produces actually works against your running application -- not just in theory. This is a significant improvement over generic AI code generation, where selectors are often guessed from documentation or screenshots.

### The Healer Agent

The healer agent is where Playwright test agents truly differentiate themselves from traditional test automation. When tests fail due to UI changes -- a button label changes from "Search" to "Find", a placeholder text gets updated, a layout shifts elements around -- the healer analyzes failure traces, DOM snapshots, and error logs to identify what broke. It then patches the test code with updated selectors or assertions and reruns the test to confirm the fix.

This is not a generic retry mechanism. The healer understands the semantic intent of the original test and finds the correct new locator or assertion. If the healer determines the failure is caused by an actual bug in the application (rather than a non-functional UI change), it marks the test as failing and reports the issue instead of trying to "fix" it.

For a deeper look at how self-healing patterns prevent flaky tests, see our [guide to fixing flaky tests](/blog/fix-flaky-tests-guide).

---

## Prerequisites and Setup

Before setting up Playwright test agents with Claude Code, make sure you have the following:

- **Node.js 18 or later** -- Required for Playwright and the CLI tooling
- **A Playwright project** -- Either existing or freshly initialized
- **Claude Code** -- Anthropic's CLI agent, installed and authenticated
- **Playwright v1.56+** -- Agents were introduced in this version

If you are new to Playwright, start with our [Playwright tutorial for beginners](/blog/playwright-tutorial-beginners-2026) to get the basics in place first.

### Step 1: Initialize a Playwright Project

If you do not already have Playwright set up, create a new project:

\`\`\`bash
npm init playwright@latest
\`\`\`

This creates your \`playwright.config.ts\`, a \`tests/\` directory, and example spec files. Select TypeScript when prompted.

### Step 2: Initialize Playwright Test Agents for Claude Code

Run the agent initialization command with the Claude Code loop:

\`\`\`bash
npx playwright init-agents --loop=claude
\`\`\`

This command generates the agent definition files in your project. The resulting structure looks like this:

\`\`\`bash
your-project/
  .claude/
    agents/
      planner.md        # Planner agent instructions + MCP tool definitions
      generator.md      # Generator agent instructions
      healer.md         # Healer agent instructions
  specs/                # Test plans produced by the planner
  tests/
    seed.spec.ts        # Seed test for environment validation
  playwright.config.ts
\`\`\`

The agent definition files are Markdown documents containing instructions and MCP tool configurations. Because they are plain text, you can customize them -- adjusting the planner's exploration strategy, changing the generator's code style preferences, or tuning the healer's tolerance for UI drift.

### Step 3: Install Claude Code (If Needed)

If you have not already installed Claude Code:

\`\`\`bash
npm install -g @anthropic-ai/claude-code
\`\`\`

Verify the installation:

\`\`\`bash
claude --version
\`\`\`

### Step 4: Configure MCP for Playwright

The Model Context Protocol (MCP) is the communication layer between Claude Code and Playwright's browser automation capabilities. MCP structures commands so that AI agents interact with the test runner through a well-defined interface rather than executing arbitrary code.

The \`init-agents\` command configures MCP automatically. To verify the setup, check that your \`.claude/\` directory contains the agent definitions with the Playwright MCP server references. If you need to manually configure the MCP server, add the following to your Claude Code MCP configuration:

\`\`\`json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
\`\`\`

This gives Claude Code access to Playwright's browser automation tools -- navigating pages, clicking elements, filling forms, taking screenshots, and reading accessibility snapshots.

---

## Planner Agent Walkthrough

The planner agent is your starting point. Give it a high-level goal and let it explore your application to build a test plan.

### Running the Planner

From your project root, invoke the planner through Claude Code:

\`\`\`bash
claude "Use the planner agent to create a test plan for the user registration flow"
\`\`\`

The planner will:

1. Launch a browser and navigate to your application
2. Explore the registration page, identifying all form fields, buttons, and interactive elements
3. Map out the happy path (successful registration)
4. Identify edge cases (invalid email, weak password, duplicate account)
5. Document expected outcomes for each scenario
6. Write the complete plan to a Markdown file in \`specs/\`

### Example Planner Output

The planner produces a structured Markdown document like this:

\`\`\`bash
# Test Plan: User Registration

## Overview
Test the user registration flow including form validation,
successful account creation, and error handling.

## Scenarios

### Scenario 1: Successful Registration
- Navigate to /register
- Fill in "Full Name" with "Jane Doe"
- Fill in "Email" with a unique email address
- Fill in "Password" with "SecurePass123!"
- Fill in "Confirm Password" with "SecurePass123!"
- Click the "Create Account" button
- Expect redirect to /welcome
- Expect welcome message containing user name

### Scenario 2: Duplicate Email
- Navigate to /register
- Fill in form with an already-registered email
- Click "Create Account"
- Expect error message: "An account with this email already exists"
- Expect user remains on /register

### Scenario 3: Password Validation
- Navigate to /register
- Fill in "Password" with "123"
- Expect inline validation error about password requirements
- Fill in "Password" with "SecurePass123!"
- Fill in "Confirm Password" with "DifferentPass456!"
- Click "Create Account"
- Expect error about passwords not matching

### Scenario 4: Required Field Validation
- Navigate to /register
- Click "Create Account" without filling any fields
- Expect validation errors on all required fields
\`\`\`

This plan is human-readable and version-controlled. You can review it, add scenarios the planner missed, remove ones that are out of scope, and then pass it to the generator.

---

## Generator Agent: Turning Plans into Executable Tests

The generator agent reads a Markdown test plan and produces working Playwright test files. It validates selectors against a live browser, which means the generated code is tested against your actual application before being written to disk.

### Running the Generator

\`\`\`bash
claude "Use the generator agent to create tests from specs/user-registration.md"
\`\`\`

### Example Generated Test Code

The generator produces properly structured TypeScript test files. Here is what the output typically looks like for the registration plan above:

\`\`\`typescript
// tests/registration/user-registration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should register a new user successfully', async ({ page }) => {
    const uniqueEmail = 'test-' + Date.now() + '@example.com';

    await page.getByLabel('Full Name').fill('Jane Doe');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByLabel('Confirm Password').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page).toHaveURL('/welcome');
    await expect(
      page.getByText('Welcome, Jane Doe')
    ).toBeVisible();
  });

  test('should show error for duplicate email', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Jane Doe');
    await page.getByLabel('Email').fill('existing@example.com');
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByLabel('Confirm Password').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(
      page.getByText('An account with this email already exists')
    ).toBeVisible();
    await expect(page).toHaveURL('/register');
  });

  test('should validate password requirements', async ({ page }) => {
    await page.getByLabel('Password').fill('123');
    await page.getByLabel('Password').blur();

    await expect(
      page.getByText(/password must be at least/i)
    ).toBeVisible();
  });

  test('should validate passwords match', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Jane Doe');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByLabel('Confirm Password').fill('DifferentPass456!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(
      page.getByText(/passwords do not match/i)
    ).toBeVisible();
  });

  test('should show required field errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByLabel('Full Name')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await expect(page.getByLabel('Email')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});
\`\`\`

Notice several important patterns the generator follows:

- **Semantic locators** -- \`getByLabel\`, \`getByRole\`, and \`getByText\` instead of CSS selectors
- **Auto-waiting assertions** -- \`expect(...).toBeVisible()\` instead of manual waits or \`waitForTimeout\`
- **Unique test data** -- \`Date.now()\` for email uniqueness to prevent test interference
- **Test isolation** -- Each test starts fresh with \`beforeEach\` navigating to the registration page

### Generator with Page Object Model

For larger applications, you can instruct the generator to use the Page Object Model pattern. Customize the generator agent definition to prefer POM:

\`\`\`typescript
// tests/pages/registration.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class RegistrationPage {
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.fullNameInput = page.getByLabel('Full Name');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.confirmPasswordInput = page.getByLabel('Confirm Password');
    this.submitButton = page.getByRole('button', { name: 'Create Account' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ): Promise<void> {
    await this.fullNameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword ?? password);
    await this.submitButton.click();
  }

  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
\`\`\`

This is the same Page Object Model pattern covered in our [complete Playwright E2E guide](/blog/playwright-e2e-complete-guide). The generator agent can produce these page objects automatically when configured to do so.

---

## Healer Agent: Self-Healing Tests in Practice

The healer agent is the component that addresses the most painful part of test automation -- maintenance. When your application's UI changes, tests break. Traditionally, a developer or QA engineer has to manually identify the broken selector, find the new element, update the test, and verify it passes. The healer agent automates this entire cycle.

### How the Healer Works

When a test fails, the healer agent:

1. **Reads the failure output** -- Parses the error message, stack trace, and failure type
2. **Analyzes the trace file** -- Playwright's trace viewer captures a complete record of what happened during the test, including DOM snapshots, network requests, and screenshots
3. **Identifies the root cause** -- Determines whether the failure is from a stale selector, changed assertion text, a layout shift, or an actual application bug
4. **Patches the test** -- If the failure is caused by a non-functional UI change, the healer updates the test code with the correct new selector or assertion
5. **Re-runs the test** -- Executes the patched test to confirm the fix works
6. **Reports or skips** -- If the healer believes the application itself is broken (not just the test), it marks the test as failing and does not attempt a fix

### Running the Healer

\`\`\`bash
claude "Use the healer agent to fix failing tests in tests/registration/"
\`\`\`

Or heal your entire suite:

\`\`\`bash
claude "Use the healer agent to run and fix all failing tests"
\`\`\`

### Real-World Healing Example

Consider this scenario. Your application's designer updates the registration page. The "Create Account" button now reads "Sign Up", and the password field placeholder changes from "Enter your password" to "Choose a password". Your existing tests fail immediately.

**Before healing (failing test):**

\`\`\`typescript
await page.getByRole('button', { name: 'Create Account' }).click();
\`\`\`

**Error output:**

\`\`\`bash
Error: locator.click: Error: strict mode violation:
  getByRole('button', { name: 'Create Account' }) resolved to 0 elements
\`\`\`

**After healing (passing test):**

\`\`\`typescript
await page.getByRole('button', { name: 'Sign Up' }).click();
\`\`\`

The healer reads the accessibility snapshot of the current page, finds the button that semantically matches the original intent (a submit button on the registration form), and updates the locator. It does not blindly search for any button -- it understands the test's purpose and finds the correct replacement.

### Healer vs. Retry

It is important to distinguish the healer agent from simple test retries. A retry runs the exact same test again, hoping for a different result. This addresses flakiness caused by timing issues but does nothing for tests broken by UI changes.

The healer rewrites the test code itself. The change is permanent -- once healed, the test passes on subsequent runs without further intervention. This is genuine self-healing, not a bandaid.

For a comprehensive breakdown of flaky test root causes and when healing vs. retries is appropriate, read our [flaky test guide](/blog/fix-flaky-tests-guide).

---

## Supercharging Agents with QASkills

Playwright test agents provide the automation loop -- plan, generate, heal. But the quality of the generated tests depends on the knowledge available to the underlying AI model. This is where QASkills skills make a significant difference.

### Installing Playwright Skills

The [playwright-e2e](/skills) skill encodes expert patterns for end-to-end testing:

\`\`\`bash
npx @qaskills/cli add playwright-e2e
\`\`\`

This gives your AI agent deep knowledge of:

- Page Object Model architecture and when to use it
- Locator strategy priority (getByRole > getByLabel > getByTestId > CSS)
- Fixture-based setup for authentication and test data
- Cross-browser configuration patterns
- Visual regression testing techniques

For API testing alongside your E2E suite, add the API skill:

\`\`\`bash
npx @qaskills/cli add playwright-api
\`\`\`

This covers Playwright's \`request\` context for API testing, request/response validation patterns, API mocking with \`page.route()\`, and contract testing between frontend and backend.

### How Skills Improve Agent Output

Without skills, AI test generation produces functional but generic tests. With QASkills installed, the generator agent applies patterns that experienced QA engineers use in production:

**Without skills -- generic output:**

\`\`\`typescript
test('login test', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.locator('#email').fill('user@test.com');
  await page.locator('#password').fill('password');
  await page.locator('#submit').click();
  await page.waitForURL('**/dashboard');
});
\`\`\`

**With playwright-e2e skill -- production-grade output:**

\`\`\`typescript
test('should authenticate with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@test.com', 'SecurePass123!');

  await expect(page).toHaveURL('/dashboard');
  await expect(
    page.getByRole('heading', { name: /welcome/i })
  ).toBeVisible();
});
\`\`\`

The skilled output uses the Page Object Model, semantic locators, proper assertions, and meaningful test names. These patterns make the healer agent's job easier too -- semantic locators are far more resilient to UI changes than CSS selectors like \`#submit\`.

Browse the full catalog of testing skills at [qaskills.sh/skills](/skills).

---

## CI/CD Integration and Best Practices

Playwright test agents are most powerful when integrated into your CI/CD pipeline. The planner and generator are typically run during development, while the healer can be triggered automatically when tests fail in CI.

### GitHub Actions Configuration

Here is a production-ready GitHub Actions workflow that runs your Playwright tests with healer support:

\`\`\`yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test --shard=\${{ matrix.shard }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-\${{ strategy.job-index }}
          path: playwright-report/
          retention-days: 14

      - name: Upload traces for failed tests
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-traces-\${{ strategy.job-index }}
          path: test-results/
          retention-days: 7
\`\`\`

### Healer in CI

You can configure the healer to run automatically when tests fail, creating a pull request with the fixes:

\`\`\`bash
# In your CI script, after test failure
if [ \$? -ne 0 ]; then
  claude "Use the healer agent to fix all failing tests, then commit the changes"
fi
\`\`\`

This approach works well for non-functional UI changes (copy updates, redesigns) but should always be gated behind a human review. The healer creates a PR with the changes, and a QA engineer reviews and merges.

### Best Practices for Agent-Driven Testing

**1. Version control your test plans.** The \`specs/\` directory should be committed to your repository. Test plans are documentation of what your team considers important to test.

**2. Review generated tests before merging.** The generator produces good code, but human review catches logic errors and missing edge cases. Treat generated tests like any other code contribution.

**3. Run the healer on a schedule.** Set up a nightly CI job that runs your full test suite and triggers the healer on failures. Review the healer's PRs each morning.

**4. Keep agent definitions up to date.** When you upgrade Playwright, regenerate agent definitions:

\`\`\`bash
npx playwright init-agents --loop=claude
\`\`\`

This picks up new tools and instructions from the latest Playwright version.

**5. Use skills to encode your team's standards.** Install QASkills for your testing frameworks so the generator produces tests that match your team's conventions from the start:

\`\`\`bash
npx @qaskills/cli add playwright-e2e
npx @qaskills/cli add playwright-api
\`\`\`

**6. Separate agent tests from manual tests.** Use Playwright's project configuration to organize agent-generated tests separately, making it easy to track coverage and quality metrics for each source.

**7. Monitor healer activity.** Track how often the healer runs and what it changes. Frequent healing on the same test file suggests the underlying page is unstable or the selectors need a fundamentally different approach.

**8. Leverage the accessibility tree.** The most reliable Playwright test agents use the Accessibility Object Model for element identification. An agent targeting \`Role: button, Name: Checkout\` is significantly more stable than one using \`div.checkout-btn-v3\`. Configure your generator to prefer accessibility-based locators.

### Playwright Configuration for Agent Workflows

Ensure your \`playwright.config.ts\` is optimized for agent-driven testing:

\`\`\`typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
\`\`\`

Key settings for agent workflows:

- **\`trace: 'on-first-retry'\`** -- Produces trace files that the healer agent needs to diagnose failures
- **\`screenshot: 'only-on-failure'\`** -- Gives the healer visual context for what went wrong
- **\`retries: 2\`** -- Allows Playwright to retry before invoking the healer, handling genuine flakiness first
- **JSON reporter** -- Produces machine-readable results that agents can parse

---

## Conclusion

Playwright test agents -- planner, generator, and healer -- represent the most significant advancement in test automation since the introduction of auto-waiting locators. The planner turns business requirements into structured test plans. The generator turns plans into production-quality TypeScript tests. The healer keeps those tests passing as your application evolves. Combined with Claude Code and MCP, you get a CLI-first workflow where AI handles the repetitive mechanics of test creation and maintenance while humans focus on strategy, edge cases, and quality standards.

The setup is straightforward: initialize Playwright, run \`npx playwright init-agents --loop=claude\`, and start giving your agents high-level testing goals. Layer on QASkills to encode your team's testing standards, and integrate the healer into CI/CD for continuous test maintenance.

If you are just getting started with Playwright, begin with our [beginner tutorial](/blog/playwright-tutorial-beginners-2026) and then come back here to add agents. If you already have a mature Playwright suite, the healer agent alone can save hours of weekly maintenance time.

Install the skills your agents need to produce expert-level tests:

\`\`\`bash
npx @qaskills/cli add playwright-e2e
npx @qaskills/cli add playwright-api
\`\`\`

Browse all available testing skills at [qaskills.sh/skills](/skills).

---

*Written by [Pramod Dutta](https://thetestingacademy.com), founder of The Testing Academy and QASkills.sh.*
`,
};
