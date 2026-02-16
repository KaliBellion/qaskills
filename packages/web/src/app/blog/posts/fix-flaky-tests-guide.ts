import type { BlogPost } from './index';

export const post: BlogPost = {
  title: 'How to Fix Flaky Tests \u2014 A Practical Guide for 2026',
  description:
    'Learn how to fix flaky tests with this practical guide covering the 6 root causes of test flakiness, diagnostic techniques, and proven code patterns to eliminate flaky tests in CI/CD pipelines.',
  date: '2026-02-16',
  category: 'Guide',
  content: `
Flaky tests are the silent killers of developer productivity. A test that passes on your machine but fails randomly in CI erodes trust in the entire test suite. Teams start ignoring failures, re-running pipelines hoping for green, and eventually stop writing tests altogether. In 2026, with AI agents generating more tests than ever, the flaky test problem has become even more urgent. This guide gives you a systematic approach to diagnose, fix, and prevent flaky tests across any testing framework.

## Key Takeaways

- Flaky tests have six root causes: timing issues, shared state, network dependencies, selector fragility, environment differences, and order dependency
- Every flaky test can be traced to one of these root causes with a systematic diagnostic approach
- Fixing flaky tests requires understanding the root cause first -- applying the wrong fix makes things worse
- Prevention is cheaper than cure -- design patterns and CI configuration eliminate flakiness before it starts
- QA skills from [QASkills.sh](/skills) encode anti-flakiness patterns directly into your AI agent's workflow

---

## What Makes Tests Flaky

A flaky test is any test that produces different results (pass or fail) without any change to the code under test. The defining characteristic is non-determinism: the same test, same code, different outcome. This is fundamentally different from a broken test, which fails consistently because the code is wrong.

Flaky tests are dangerous because they create a boy-who-cried-wolf effect. When the test suite contains known flaky tests, developers begin to distrust all failures. They retry the pipeline, skip the failing test, or mark it with a skip annotation and move on. Over time, the test suite loses its ability to catch real regressions. Studies from Google and Microsoft have shown that flaky tests account for up to 16% of all test failures in large codebases, and engineering teams spend an estimated 5-10 hours per week dealing with flaky test failures.

The cost is not just developer time. Flaky tests slow down CI/CD pipelines because teams add retries and longer timeouts. They delay deployments because a flaky failure blocks the merge queue. They reduce confidence in automated testing, which leads to more manual QA and slower release cycles.

---

## The 6 Root Causes of Flaky Tests

Every flaky test traces back to one of these six root causes. Understanding which cause is at play determines which fix to apply.

### 1. Timing Issues and Race Conditions

Timing issues are the most common source of flakiness, especially in end-to-end and integration tests. They occur when a test assumes something will happen within a certain timeframe, but the actual execution speed varies between runs.

**Common symptoms:**
- Tests pass locally but fail in CI (CI machines are slower)
- Tests fail more often under heavy load
- Adding a \`sleep()\` or increasing a timeout makes the failure go away (temporarily)

**Bad pattern -- hardcoded waits:**

\`\`\`bash
// BAD: Hardcoded sleep is fragile and slow
await page.click('#submit-button');
await page.waitForTimeout(3000); // hopes 3 seconds is enough
const message = await page.textContent('.success-message');
expect(message).toBe('Form submitted');
\`\`\`

**Good pattern -- explicit wait for condition:**

\`\`\`bash
// GOOD: Wait for the actual condition, not an arbitrary time
await page.click('#submit-button');
await expect(page.locator('.success-message')).toHaveText('Form submitted', {
  timeout: 10000
});
\`\`\`

The difference is critical. The bad pattern waits 3 seconds regardless of whether the action completed in 100ms or 5 seconds. The good pattern waits only as long as necessary, up to a maximum. It is both faster and more reliable.

Race conditions in asynchronous code follow the same principle. When two operations happen concurrently and the test assumes a specific order, any variation in execution speed causes flakiness.

### 2. Shared State Between Tests

Shared state is the second most common source of flakiness. When tests share a database, a file system, a global variable, or an in-memory cache, one test's side effects can affect another test's outcome.

**Common symptoms:**
- Tests pass when run individually but fail when run together
- Test failures change depending on which other tests ran first
- Adding or removing an unrelated test causes a different test to fail

**Bad pattern -- shared database state:**

\`\`\`bash
// BAD: Tests share database state
describe('User API', () => {
  it('should create a user', async () => {
    const res = await api.post('/users', { name: 'Alice' });
    expect(res.status).toBe(201);
  });

  it('should list all users', async () => {
    const res = await api.get('/users');
    // This fails if the create test ran first in a previous suite
    // and the DB was not cleaned up
    expect(res.body.users).toHaveLength(1);
  });
});
\`\`\`

**Good pattern -- isolated test state:**

\`\`\`bash
// GOOD: Each test manages its own state
describe('User API', () => {
  beforeEach(async () => {
    await db.query('DELETE FROM users');
  });

  it('should create a user', async () => {
    const res = await api.post('/users', { name: 'Alice' });
    expect(res.status).toBe(201);
  });

  it('should list all users', async () => {
    await api.post('/users', { name: 'Bob' });
    const res = await api.get('/users');
    expect(res.body.users).toHaveLength(1);
  });
});
\`\`\`

The improved version ensures each test starts with a clean state and sets up exactly what it needs. No test depends on the side effects of another.

### 3. Network Dependencies

Tests that depend on external services -- third-party APIs, CDNs, microservices in other repositories -- are inherently flaky because those services can be slow, unavailable, or return different data at different times.

**Common symptoms:**
- Tests fail with timeout errors or connection refused
- Tests fail at specific times of day (when external services are under load)
- Tests return different data on different runs

**Bad pattern -- hitting real external APIs:**

\`\`\`bash
// BAD: Depends on external weather API availability
it('should display weather data', async () => {
  const response = await fetch('https://api.weather.com/current?city=NYC');
  const data = await response.json();
  expect(data.temperature).toBeDefined();
  expect(data.city).toBe('NYC');
});
\`\`\`

**Good pattern -- mock external dependencies:**

\`\`\`bash
// GOOD: Mock the external dependency
it('should display weather data', async () => {
  const mockWeatherData = {
    temperature: 72,
    city: 'NYC',
    conditions: 'Sunny'
  };

  vi.spyOn(global, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockWeatherData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  );

  const result = await getWeatherDisplay('NYC');
  expect(result.temperature).toBe(72);
  expect(result.city).toBe('NYC');
});
\`\`\`

For E2E tests where you need to test the full integration, use Playwright's route interception to mock at the network level:

\`\`\`bash
// GOOD: Intercept network requests in E2E tests
await page.route('**/api/weather/**', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ temperature: 72, city: 'NYC' })
  });
});
await page.goto('/weather');
await expect(page.locator('.temperature')).toHaveText('72');
\`\`\`

### 4. Selector Fragility

UI tests that rely on implementation details of the DOM -- auto-generated class names, deeply nested CSS paths, or positional selectors -- break whenever the UI structure changes, even when the user-visible behavior is identical.

**Common symptoms:**
- Tests break after UI library updates (Tailwind version bump, component library update)
- Tests fail when a CSS class name changes but the UI looks the same
- Tests reference elements by \`nth-child\` or deeply nested paths

**Bad pattern -- brittle selectors:**

\`\`\`bash
// BAD: Fragile CSS selector tied to DOM structure
await page.click('div.MuiGrid-root > div:nth-child(3) > button.MuiButton-root');
const text = await page.textContent('div.MuiGrid-root > div:nth-child(3) > span');
\`\`\`

**Good pattern -- semantic selectors:**

\`\`\`bash
// GOOD: Test IDs and accessible roles are stable
await page.getByRole('button', { name: 'Add to cart' }).click();
await expect(page.getByTestId('cart-count')).toHaveText('1');
\`\`\`

The Playwright team explicitly recommends using \`getByRole\`, \`getByText\`, \`getByLabel\`, and \`getByTestId\` over CSS selectors. These locators are resilient to DOM restructuring because they target user-visible or explicitly stable attributes.

### 5. Environment Differences

Tests that work on a developer's machine but fail in CI often suffer from environment differences: different operating systems, different installed software versions, different timezone settings, different file system behavior, or different available resources (memory, CPU, screen resolution).

**Common symptoms:**
- Tests pass on macOS but fail on Linux CI runners
- Tests fail with "file not found" in CI but work locally
- Screenshot comparison tests fail due to font rendering differences
- Date/time assertions fail depending on server timezone

**Bad pattern -- environment-dependent assertions:**

\`\`\`bash
// BAD: Timezone-dependent date formatting
it('should display today date', () => {
  const result = formatDate(new Date());
  expect(result).toBe('February 16, 2026'); // Fails in UTC timezone
});
\`\`\`

**Good pattern -- control the environment:**

\`\`\`bash
// GOOD: Use a fixed date and explicit timezone
it('should display formatted date', () => {
  const fixedDate = new Date('2026-02-16T12:00:00Z');
  const result = formatDate(fixedDate, { timeZone: 'UTC' });
  expect(result).toBe('February 16, 2026');
});
\`\`\`

For visual regression tests, use Docker containers or Playwright's built-in \`--update-snapshots\` with platform-specific snapshot directories to handle cross-platform font rendering differences.

### 6. Test Order Dependency

Order-dependent tests assume they will execute in a specific sequence. When a test runner randomizes execution order (as many do by default for good reason), or when tests run in parallel, these dependencies cause failures.

**Common symptoms:**
- Tests pass when run sequentially but fail when run in parallel
- Reordering test files causes failures
- A test only passes when another specific test runs before it

**Bad pattern -- implicit ordering:**

\`\`\`bash
// BAD: test-b.spec.ts depends on test-a.spec.ts having run
// test-a.spec.ts
it('should create the admin user', async () => {
  await createUser({ name: 'Admin', role: 'admin' });
});

// test-b.spec.ts
it('should allow admin to access dashboard', async () => {
  // Assumes admin user exists from test-a
  await login('Admin');
  await expect(page.locator('.dashboard')).toBeVisible();
});
\`\`\`

**Good pattern -- self-contained tests:**

\`\`\`bash
// GOOD: Each test file sets up its own preconditions
// test-b.spec.ts
it('should allow admin to access dashboard', async () => {
  // Arrange: create what this test needs
  await createUser({ name: 'Admin', role: 'admin' });

  // Act
  await login('Admin');

  // Assert
  await expect(page.locator('.dashboard')).toBeVisible();
});
\`\`\`

---

## Diagnosing Flaky Tests

Before you can fix a flaky test, you need to identify which root cause is at play. Here is a diagnostic checklist to work through systematically.

### Diagnostic Checklist Table

| Question | If Yes, Likely Cause | Suggested Fix |
|----------|---------------------|---------------|
| Does the test involve waiting for UI elements or async operations? | Timing / Race Condition | Replace hardcoded waits with explicit condition waits |
| Does the test fail when run with other tests but pass alone? | Shared State | Add proper setup/teardown, isolate test data |
| Does the test call external APIs or services? | Network Dependency | Mock external calls, use service virtualization |
| Does the test use CSS selectors or XPath? | Selector Fragility | Switch to \`getByRole\`, \`getByTestId\`, or \`getByText\` |
| Does the test pass locally but fail in CI? | Environment Difference | Pin versions, use containers, control timezone/locale |
| Does the test depend on data created by another test? | Order Dependency | Make each test self-contained with own setup |
| Does the test involve date/time calculations? | Environment / Timing | Use fixed dates, mock \`Date.now()\`, set explicit timezone |
| Does the test use random or generated data? | Shared State / Timing | Seed random generators, use deterministic factories |
| Does the test interact with file system? | Environment / Shared State | Use temp directories, clean up in afterEach |
| Does the test fail intermittently with timeout errors? | Timing / Network | Increase timeouts, add retry logic, mock slow dependencies |

### Step-by-Step Diagnosis Process

**Step 1: Reproduce the flakiness.** Run the test in a loop to confirm it is truly flaky and measure the failure rate. Most frameworks support this:

\`\`\`bash
# Playwright: repeat test 50 times
npx playwright test --repeat-each=50 tests/checkout.spec.ts

# Jest: run test file 50 times in a loop
for i in {1..50}; do npx jest tests/checkout.test.ts || echo "FAILED on run $i"; done

# pytest: use pytest-repeat
pytest --count=50 tests/test_checkout.py
\`\`\`

**Step 2: Check the failure pattern.** A test that fails 1 out of 50 times has a different root cause than one that fails 25 out of 50 times. Low failure rates typically indicate timing issues. High failure rates suggest environment or state problems.

**Step 3: Isolate the test.** Run the failing test alone. If it passes alone but fails with other tests, the cause is shared state or order dependency. If it fails even alone, the cause is timing, network, environment, or selector fragility.

**Step 4: Check CI vs local.** If the test fails only in CI, compare the environments: OS, Node version, browser version, available memory, screen resolution, timezone, and locale settings.

**Step 5: Read the failure message carefully.** Timeout errors point to timing issues. "Element not found" points to selector fragility or timing. Unexpected data values point to shared state or network issues. Platform-specific errors point to environment differences.

---

## Fixing Each Root Cause

### Fixing Timing Issues

The universal principle is: never wait for time, wait for conditions. Every modern testing framework provides tools for condition-based waiting.

**In Playwright:**

\`\`\`bash
// Wait for network to be idle after navigation
await page.goto('/dashboard', { waitUntil: 'networkidle' });

// Wait for a specific API response before asserting
const responsePromise = page.waitForResponse('**/api/data');
await page.click('#load-data');
const response = await responsePromise;
expect(response.status()).toBe(200);

// Use auto-retrying assertions
await expect(page.locator('.data-table tbody tr')).toHaveCount(10, {
  timeout: 15000
});
\`\`\`

**In Cypress:**

\`\`\`bash
// Cypress has built-in retry on assertions
cy.get('.data-table tbody tr').should('have.length', 10);

// Intercept and wait for specific API calls
cy.intercept('GET', '/api/data').as('loadData');
cy.get('#load-data').click();
cy.wait('@loadData');
cy.get('.data-table tbody tr').should('have.length', 10);
\`\`\`

**In pytest with Selenium:**

\`\`\`bash
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

# Wait for element to be clickable, not just present
wait = WebDriverWait(driver, 10)
button = wait.until(EC.element_to_be_clickable((By.ID, "submit")))
button.click()

# Wait for specific text to appear
wait.until(EC.text_to_be_present_in_element(
    (By.CLASS_NAME, "success-message"),
    "Form submitted"
))
\`\`\`

### Fixing Shared State

The fix depends on what state is being shared.

**Database state:** Use transactions that roll back after each test, or truncate tables in \`beforeEach\`. For Playwright, use Playwright's fixtures to create isolated database states:

\`\`\`bash
// Playwright fixture for database isolation
import { test as base } from '@playwright/test';
import { db } from './test-db';

export const test = base.extend({
  cleanDb: [async ({}, use) => {
    // Setup: clean state before test
    await db.query('BEGIN');
    await use();
    // Teardown: rollback after test
    await db.query('ROLLBACK');
  }, { auto: true }]
});
\`\`\`

**Global variables and singletons:** Reset them in \`beforeEach\`:

\`\`\`bash
beforeEach(() => {
  // Reset singleton state
  UserCache.getInstance().clear();
  // Reset module-level variables
  vi.resetModules();
});
\`\`\`

**File system state:** Use unique temporary directories per test:

\`\`\`bash
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let testDir: string;

beforeEach(async () => {
  testDir = await mkdtemp(join(tmpdir(), 'test-'));
});

afterEach(async () => {
  await rm(testDir, { recursive: true, force: true });
});
\`\`\`

### Fixing Network Dependencies

**For unit and integration tests:** Mock at the HTTP client level using your framework's mocking tools (\`vi.mock\`, \`jest.mock\`, \`unittest.mock.patch\`).

**For E2E tests:** Use network interception to control responses without changing application code:

\`\`\`bash
// Playwright: mock an unreliable third-party API
await page.route('https://api.stripe.com/**', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      id: 'pi_test_123',
      status: 'succeeded',
      amount: 2000
    })
  });
});
\`\`\`

**For integration tests that need real network calls:** Use retry logic with exponential backoff in your test helper, and set generous timeouts. But prefer mocking whenever possible.

### Fixing Selector Fragility

Establish a selector strategy for your team and enforce it consistently:

1. **First choice:** \`getByRole\` -- accessible and resilient
2. **Second choice:** \`getByText\` or \`getByLabel\` -- user-visible text
3. **Third choice:** \`getByTestId\` -- explicit test hooks
4. **Last resort:** CSS selectors -- only for truly unique, stable attributes

Add \`data-testid\` attributes to components that have no accessible role or unique text:

\`\`\`bash
// Component code
<div data-testid="order-summary">
  <span data-testid="order-total">{total}</span>
</div>

// Test code
await expect(page.getByTestId('order-total')).toHaveText('$42.00');
\`\`\`

### Fixing Environment Differences

**Pin all tool versions.** Use \`.tool-versions\`, \`.nvmrc\`, or \`package.json\` engines field to ensure consistent Node.js versions. Use lockfiles (\`pnpm-lock.yaml\`, \`package-lock.json\`) to pin dependency versions.

**Use containers for CI.** Docker images with pre-installed browsers and fonts eliminate rendering differences:

\`\`\`bash
# .github/workflows/tests.yml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.50.0-noble
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test
\`\`\`

**Control timezone and locale in tests:**

\`\`\`bash
// playwright.config.ts
export default defineConfig({
  use: {
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },
});
\`\`\`

### Fixing Order Dependency

**Enable parallel execution.** If tests are truly independent, running them in parallel exposes hidden dependencies quickly. In Playwright, tests in different files already run in parallel by default. In Jest, use \`--runInBand\` only when debugging -- parallel should be the default.

**Randomize test order.** In pytest, use \`pytest-randomly\` to shuffle test order on every run:

\`\`\`bash
pip install pytest-randomly
pytest --randomly-seed=12345  # reproducible random order
\`\`\`

**Apply the Arrange-Act-Assert pattern rigorously.** Every test should arrange its own preconditions, act on the system, and assert the result. No test should depend on state arranged by a previous test.

---

## Prevention Strategies

Fixing flaky tests is important, but preventing them is far more effective. These strategies eliminate entire categories of flakiness before tests are even written.

### 1. Establish Testing Standards

Document your team's testing patterns: which selectors to use, how to handle async operations, how to manage test data. Better yet, encode these standards into your AI agent using QA skills so every generated test follows the patterns automatically.

### 2. Use Test Isolation by Default

Configure your test runner for maximum isolation:

\`\`\`bash
// playwright.config.ts -- isolation settings
export default defineConfig({
  fullyParallel: true,
  forbidOnly: true, // prevent .only in CI
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  use: {
    trace: 'on-first-retry', // capture traces for debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
\`\`\`

### 3. Implement Smart Retries

Retries are not a fix for flaky tests -- they are a safety net while you fix the root cause. But smart retries can prevent pipeline blockages:

\`\`\`bash
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  // Combined with trace-on-first-retry, you get
  // debugging data for the flaky failure
});
\`\`\`

**Important:** Track retried tests. A test that consistently needs retries to pass is flaky and should be fixed. Use your CI dashboard to monitor retry rates.

### 4. Monitor and Track Flakiness

Set up dashboards that track:
- Which tests are retried most often
- Which tests have the highest failure rates
- How long tests take (increasing duration often precedes flakiness)
- Which test categories (E2E, integration, unit) are flakiest

Playwright's built-in HTML reporter and CI integrations like Allure or ReportPortal make this straightforward.

### 5. Use Quarantine for Known Flaky Tests

When a flaky test is identified but the fix is not immediate, quarantine it rather than skipping it. A quarantine runs the test but does not block the pipeline:

\`\`\`bash
// Tag flaky tests for quarantine tracking
test('checkout flow @flaky', async ({ page }) => {
  // ... test code
});
\`\`\`

\`\`\`bash
# Run quarantined tests separately, non-blocking
npx playwright test --grep @flaky || true
npx playwright test --grep-invert @flaky
\`\`\`

This keeps the test running (so you know when it starts passing consistently) without blocking deployments.

### 6. Shift Flaky-Prone Tests Left

Many tests that are flaky as E2E tests would be perfectly stable as integration or unit tests. A test that verifies an API response format does not need a browser. A test that checks business logic does not need a database. Push tests down the testing pyramid wherever possible.

---

## How QA Skills Help

QA skills from [QASkills.sh](/skills) encode anti-flakiness patterns directly into your AI agent's test generation workflow. When you install a QA skill, your agent learns to write tests that avoid the common pitfalls described in this guide.

### playwright-e2e Skill

The \`playwright-e2e\` skill teaches your AI agent to use Playwright's auto-waiting locators, the Page Object Model, and fixture-based test isolation by default. Every test your agent generates uses \`getByRole\` and \`getByTestId\` instead of CSS selectors, explicit condition waits instead of \`waitForTimeout\`, and proper test fixtures for setup and teardown.

\`\`\`bash
npx @qaskills/cli add playwright-e2e
\`\`\`

Read the complete Playwright setup guide at [our Playwright E2E tutorial](/blog/playwright-e2e-complete-guide).

### cypress-e2e Skill

The \`cypress-e2e\` skill brings the same anti-flakiness discipline to Cypress projects. It teaches your agent to use Cypress's built-in retry-ability, \`cy.intercept\` for network mocking, and proper \`beforeEach\` patterns for state isolation.

\`\`\`bash
npx @qaskills/cli add cypress-e2e
\`\`\`

### pytest-patterns Skill

For Python testing with pytest, the \`pytest-patterns\` skill teaches your agent to use fixtures for dependency injection, \`conftest.py\` for shared test infrastructure, parametrize decorators for data-driven tests, and proper mocking with \`unittest.mock\` and \`pytest-mock\`.

\`\`\`bash
npx @qaskills/cli add pytest-patterns
\`\`\`

Browse the full catalog of QA skills at [QASkills.sh/skills](/skills) to find skills for your testing stack. New to QASkills? Check out the [getting started guide](/getting-started) to install your first skill in under a minute.

---

## Building a Flaky Test Culture

Technical fixes are necessary but not sufficient. Eliminating flaky tests requires a team culture that treats flakiness as a first-class bug.

**Set a zero-tolerance policy.** When a flaky test is detected, create a ticket immediately. Do not let flaky tests accumulate. The longer a flaky test stays in the suite, the more it erodes trust and encourages others to ignore failures.

**Assign ownership.** Every test file should have an owner (a team or individual) responsible for maintaining it. When a test becomes flaky, the owner is responsible for diagnosing and fixing it within a defined SLA.

**Celebrate stability.** Track your test suite's reliability rate (percentage of CI runs that pass on first attempt without retries) and make it visible. A reliability rate above 99% is a meaningful achievement that protects deployment velocity.

**Review generated tests.** When AI agents generate tests, review them for flakiness patterns before merging. Check for hardcoded waits, brittle selectors, shared state assumptions, and external dependencies. QA skills reduce the frequency of these patterns but human review remains valuable.

---

## Conclusion

Flaky tests are a solvable problem. Every flaky test has a root cause, and every root cause has a known fix. The key is to approach flakiness systematically: diagnose the root cause using the checklist in this guide, apply the appropriate fix from the corresponding section, and put prevention strategies in place so new flaky tests do not enter the suite.

In 2026, AI coding agents are writing more tests than ever. This makes test reliability even more critical -- and it makes tools like QA skills even more valuable. By encoding anti-flakiness patterns into your agent's workflow with skills like \`playwright-e2e\`, \`cypress-e2e\`, and \`pytest-patterns\`, you ensure that every generated test follows the patterns that experienced QA engineers have developed over years of battling flakiness.

Start by auditing your current test suite for the six root causes described in this guide. Fix the worst offenders first. Install the relevant QA skills to prevent new flakiness. And build a team culture that treats test reliability as a feature, not an afterthought.

Browse all available QA skills at [QASkills.sh/skills](/skills), or read more guides on the [QASkills blog](/blog).

---

*Written by [Pramod Dutta](https://thetestingacademy.com), founder of The Testing Academy and QASkills.sh.*
`,
};
