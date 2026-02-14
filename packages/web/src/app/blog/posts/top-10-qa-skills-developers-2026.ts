import type { BlogPost } from './index';

export const post: BlogPost = {
  title: 'Top 10 QA Skills Every Developer Should Install in 2026',
  description:
    'The definitive ranked list of the best QA testing skills for AI coding agents. Covers E2E, unit, API, performance, accessibility, visual, contract testing, and more.',
  date: '2026-02-11',
  category: 'Guide',
  content: `
Finding the best QA skills in 2026 can feel overwhelming. AI coding agents like [Claude Code](/agents/claude-code), [Cursor](/agents/cursor), and [GitHub Copilot](/agents/copilot) are remarkably capable at writing application code, but they often struggle with the nuanced craft of software testing. That is exactly why we built [QASkills.sh](/skills) -- the first curated directory of QA testing skills purpose-built for AI agents.

This guide ranks the top 10 QA skills every developer should have, based on real-world impact, framework adoption, community demand, and testing coverage breadth.

## At a Glance: The Top 10 Compared

| Rank | Skill | Slug | Type | Language | Best For |
|------|-------|------|------|----------|----------|
| 1 | Playwright E2E | \`playwright-e2e\` | E2E, Visual | TypeScript/JS | Web app E2E testing |
| 2 | Jest Unit Testing | \`jest-unit\` | Unit | TypeScript/JS | JavaScript unit tests |
| 3 | Pytest Patterns | \`pytest-patterns\` | Unit, Integration | Python | Python testing |
| 4 | API Testing REST Assured | \`api-testing-rest-assured\` | API | Java | Java API validation |
| 5 | Cypress E2E | \`cypress-e2e\` | E2E | JS/TS | Developer-friendly E2E |
| 6 | k6 Performance | \`k6-performance\` | Performance | JavaScript | Load testing |
| 7 | Accessibility Axe | \`accessibility-axe\` | Accessibility | TypeScript | WCAG compliance |
| 8 | Visual Regression | \`visual-regression\` | Visual | TypeScript | Catching visual bugs |
| 9 | Contract Testing Pact | \`contract-testing-pact\` | Contract | TS/Java | Microservice contracts |
| 10 | Selenium Advanced POM | \`selenium-advanced-pom\` | E2E | Java | Enterprise Selenium |

---

## 1. Playwright E2E -- The Gold Standard

The most installed skill on QASkills.sh. Teaches your AI agent Page Object Model, auto-waiting locator priority (\`getByRole\` > \`getByLabel\` > \`getByTestId\`), custom fixtures, auth state reuse, network interception, cross-browser config, trace viewer debugging. If you install only one skill, make it this one.

\`\`\`bash
npx @qaskills/cli add playwright-e2e
\`\`\`

---

## 2. Jest Unit Testing -- JavaScript Testing Foundation

Covers Arrange-Act-Assert, module mocking, manual mocks, spying, fake timers, snapshot testing, custom matchers, async patterns, and 80% coverage thresholds. Tests behavior not implementation.

\`\`\`bash
npx @qaskills/cli add jest-unit
\`\`\`

---

## 3. Pytest Patterns -- Python Testing Powerhouse

Fixtures with scopes, fixture factories, yield teardown, \`@pytest.mark.parametrize\`, custom markers, conftest organization, pytest-mock, coverage via pyproject.toml. Makes every test idiomatic pytest.

\`\`\`bash
npx @qaskills/cli add pytest-patterns
\`\`\`

---

## 4. API Testing REST Assured -- Java API Validation

REST Assured's BDD-style Given-When-Then syntax, reusable request/response specifications, POJO serialization, JSON schema validation, authentication flows, and comprehensive negative testing.

\`\`\`bash
npx @qaskills/cli add api-testing-rest-assured
\`\`\`

---

## 5. Cypress E2E -- Developer-Friendly E2E

Custom commands (\`cy.login()\`), network intercept (\`cy.intercept\`), fixture-based test data, \`cy.session\` for auth caching, component testing patterns. Interactive test runner with time-travel debugging.

\`\`\`bash
npx @qaskills/cli add cypress-e2e
\`\`\`

---

## 6. k6 Performance -- Load and Stress Testing

Five test types (smoke, load, stress, spike, soak), threshold-based pass/fail, scenario modeling with multiple VU groups, custom metrics (Trend, Rate, Counter, Gauge), data-driven testing, CI integration with exit codes.

\`\`\`bash
npx @qaskills/cli add k6-performance
\`\`\`

---

## 7. Accessibility Axe -- WCAG Compliance

axe-core integration with Playwright, WCAG 2.1 Level A and AA rules, page-level and component-level scanning, severity categorization, custom rule configuration, CI-friendly reporting. Accessibility is no longer optional in 2026.

\`\`\`bash
npx @qaskills/cli add accessibility-axe
\`\`\`

---

## 8. Visual Regression -- Catching Visual Bugs

Playwright's \`toHaveScreenshot\`, visual diff thresholds, responsive testing across viewports, baseline management, dynamic content masking, animation handling. Catches CSS regressions functional tests miss.

\`\`\`bash
npx @qaskills/cli add visual-regression
\`\`\`

---

## 9. Contract Testing Pact -- Microservice Contracts

Consumer-driven contracts, Pact Broker integration, provider verification, "can I deploy?" checks, webhook-triggered verification, multi-language support. Prevents integration bugs without slow E2E suites.

\`\`\`bash
npx @qaskills/cli add contract-testing-pact
\`\`\`

---

## 10. Selenium Advanced POM -- Enterprise Selenium

Three POM patterns (Basic, Improved, Page Factory), retry mechanisms, Allure reporting with screenshots, Apache POI Excel data-driven testing, TestNG configuration, Selenoid grid for parallel containerized execution.

\`\`\`bash
npx @qaskills/cli add selenium-advanced-pom
\`\`\`

---

## How to Choose the Right Skills

### Start With Your Language

- **JavaScript/TypeScript**: Playwright E2E + Jest Unit
- **Python**: Pytest Patterns
- **Java**: REST Assured + Selenium Advanced POM

### Layer Your Testing Pyramid

- **Unit tests (base)**: Jest, Pytest -- fast, isolated logic verification
- **API/Integration (middle)**: REST Assured, Contract Testing Pact
- **E2E tests (top)**: Playwright, Cypress -- critical user flows
- **Cross-cutting**: Performance, accessibility, visual regression

### Consider Your Domain

- **Public-facing web app?** Accessibility Axe is essential
- **Microservices?** Contract Testing Pact prevents integration nightmares
- **Preparing for launch?** k6 Performance validates capacity
- **Design-heavy product?** Visual Regression catches CSS bugs

### Install Multiple Skills

\`\`\`bash
npx @qaskills/cli add playwright-e2e
npx @qaskills/cli add jest-unit
npx @qaskills/cli add k6-performance
npx @qaskills/cli add accessibility-axe
\`\`\`

Browse and search with \`npx @qaskills/cli search\` or visit [qaskills.sh/skills](/skills). Filter by [category](/categories/e2e-testing) or explore by agent: [Claude Code](/agents/claude-code), [Cursor](/agents/cursor), [Copilot](/agents/copilot), and [25+ more](/agents).

---

## Get Started Today

Every skill installs in seconds with a single command. No configuration, no API keys, no subscription. Install your first skill now:

\`\`\`bash
npx @qaskills/cli add playwright-e2e
\`\`\`

Then explore the full directory at [qaskills.sh/skills](/skills). Your AI agent -- and your test coverage -- will thank you.

---

*Written by [Pramod Dutta](https://thetestingacademy.com), founder of The Testing Academy and QASkills.sh.*
`,
};
