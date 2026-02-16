import type { BlogPost } from './index';

export const post: BlogPost = {
  title: 'Security Testing for AI-Generated Code — OWASP Top 10 Automation Guide',
  description:
    'Complete guide to security testing AI-generated code. Covers OWASP Top 10 automation, SQL injection, XSS, CSRF testing, SAST/DAST tools, and CI/CD integration for vulnerability detection.',
  date: '2026-02-16',
  category: 'Security',
  content: `
AI coding agents generate code at extraordinary speed. A developer using Claude Code or Cursor can scaffold an entire API in minutes, complete with database queries, authentication handlers, and frontend forms. But speed creates a dangerous illusion of correctness. AI-generated code often introduces subtle security vulnerabilities that pass functional tests while leaving applications wide open to attack. SQL injection through unsanitized inputs, cross-site scripting via unescaped output, broken authentication flows, insecure direct object references -- these are not hypothetical risks. They appear routinely in code produced by every major AI agent.

This guide shows you how to systematically test AI-generated code for security vulnerabilities, automate OWASP Top 10 detection, and integrate security testing into your CI/CD pipeline so vulnerabilities are caught before they reach production.

## Key Takeaways

- AI-generated code introduces security vulnerabilities at a higher rate than manually written code because agents optimize for functionality, not security
- The OWASP Top 10 provides a structured framework for testing the most critical web application security risks
- Automated security testing with SAST, DAST, and dependency scanning catches the majority of common vulnerabilities
- SQL injection, XSS, and broken authentication are the three most frequent vulnerability categories in AI-generated code
- QA skills like \`security-testing\` and \`owasp-top-10\` embed security testing knowledge directly into your AI agent's workflow
- Security testing must be integrated into CI/CD pipelines to prevent vulnerable code from being deployed

---

## The AI Code Security Problem

AI coding agents are trained on vast repositories of public code, including code with known vulnerabilities. When an agent generates a database query, it draws on patterns it has seen -- and many of those patterns use string concatenation instead of parameterized queries. When it builds an authentication system, it may store passwords with weak hashing or skip token expiration entirely.

The core problem is that AI agents optimize for making code work, not for making code secure. A function that queries the database and returns results is functionally correct even if it is vulnerable to SQL injection. The tests pass. The feature works. The vulnerability ships.

### Why AI-Generated Code Is Especially Vulnerable

**Pattern replication from training data.** AI models learn from public repositories where insecure patterns are common. Code using \`eval()\`, string-concatenated SQL, innerHTML assignment, and hardcoded secrets appears frequently in training data and gets replicated in generated output.

**Missing threat modeling.** Human developers with security training think adversarially -- "What if someone passes a malicious string here?" AI agents do not perform threat modeling unless explicitly instructed. They write the happy path and move on.

**Context blindness.** An AI agent generating a single function does not see the full application security posture. It does not know whether the input has already been sanitized upstream or whether the output will be rendered in a context where XSS is possible.

**Dependency trust.** AI agents frequently suggest third-party packages without evaluating their security posture. They recommend whatever package has the most usage in their training data, not whatever package has the fewest CVEs.

### The Scale of the Problem

A 2025 study by Stanford researchers found that developers using AI coding assistants produced code with 40% more security vulnerabilities compared to developers coding manually. The developers using AI assistants were also more likely to believe their code was secure. This confidence gap is the real danger -- teams ship AI-generated code faster, with less security review, because the code looks clean and professional.

---

## OWASP Top 10 for AI-Generated Code

The OWASP Top 10 is the standard reference for web application security risks. Each category maps to specific testing approaches that can be automated. Here is how each risk applies to AI-generated code and how to test for it.

| # | OWASP Risk | AI Agent Pattern | Testing Approach |
|---|---|---|---|
| A01 | Broken Access Control | Missing authorization checks on API endpoints | Role-based E2E tests, IDOR fuzzing |
| A02 | Cryptographic Failures | Weak hashing (MD5/SHA1), hardcoded secrets, missing TLS | Static analysis, secret scanning |
| A03 | Injection | String-concatenated SQL/NoSQL, unescaped template literals | Parameterized input fuzzing, SAST rules |
| A04 | Insecure Design | Missing rate limiting, no input validation schemas | Architecture review, threat modeling |
| A05 | Security Misconfiguration | Default credentials, verbose error messages, open CORS | Configuration scanning, header analysis |
| A06 | Vulnerable Components | Outdated dependencies with known CVEs | \`npm audit\`, Snyk, Dependabot |
| A07 | Authentication Failures | Weak password policies, missing MFA, session fixation | Authentication flow testing, brute force simulation |
| A08 | Data Integrity Failures | Unsigned JWTs, unverified updates, insecure deserialization | Token manipulation tests, integrity checks |
| A09 | Logging Failures | Missing audit logs, sensitive data in logs, no alerting | Log analysis, PII detection scanning |
| A10 | SSRF | Unvalidated URL inputs, internal network access | URL fuzzing, internal IP blocking tests |

Install the OWASP Top 10 skill to teach your AI agent these patterns:

\`\`\`bash
npx @qaskills/cli add owasp-top-10
\`\`\`

---

## SQL Injection Testing

SQL injection remains the most dangerous and most common vulnerability in AI-generated code. AI agents routinely produce code like this:

### Vulnerable Pattern: String Concatenation

\`\`\`bash
// VULNERABLE: AI-generated code using string concatenation
app.get('/api/users', async (req, res) => {
  const name = req.query.name;
  const result = await db.query(
    "SELECT * FROM users WHERE name = '" + name + "'"
  );
  res.json(result.rows);
});
\`\`\`

An attacker passing \`name=' OR '1'='1\` retrieves every user in the database. Passing \`name='; DROP TABLE users; --\` destroys the table entirely.

### Secure Pattern: Parameterized Queries

\`\`\`bash
// SECURE: Parameterized query prevents injection
app.get('/api/users', async (req, res) => {
  const name = req.query.name;
  const result = await db.query(
    'SELECT * FROM users WHERE name = $1',
    [name]
  );
  res.json(result.rows);
});
\`\`\`

### Automated SQL Injection Testing

Write tests that submit known injection payloads and verify the application handles them safely:

\`\`\`bash
// security/sql-injection.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

const SQL_INJECTION_PAYLOADS = [
  "' OR '1'='1",
  "'; DROP TABLE users; --",
  "' UNION SELECT username, password FROM users --",
  "1; WAITFOR DELAY '0:0:5'--",
  "' OR 1=1--",
  "admin'--",
  "1' ORDER BY 1--",
  "' AND (SELECT COUNT(*) FROM users) > 0 --",
];

describe('SQL Injection Prevention', () => {
  SQL_INJECTION_PAYLOADS.forEach((payload) => {
    it('should safely handle injection payload: ' + payload.slice(0, 30), async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ name: payload });

      // Should not return all records (injection success indicator)
      expect(response.status).not.toBe(500);
      expect(response.body.length).toBeLessThan(100);

      // Response time should be normal (no time-based injection)
      expect(response.headers['x-response-time']).toBeDefined();
    });
  });

  it('should return empty results for non-existent user', async () => {
    const response = await request(app)
      .get('/api/users')
      .query({ name: "nonexistent_user_12345" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});
\`\`\`

### Using sqlmap for Deep Testing

For more thorough SQL injection testing, use sqlmap against your staging environment:

\`\`\`bash
# Install sqlmap
pip install sqlmap

# Test a specific endpoint
sqlmap -u "http://localhost:3000/api/users?name=test" --batch --level=3

# Test POST parameters
sqlmap -u "http://localhost:3000/api/login" --data="username=test&password=test" --batch

# Generate a report
sqlmap -u "http://localhost:3000/api/users?name=test" --batch --output-dir=./reports
\`\`\`

---

## XSS Prevention Testing

Cross-site scripting vulnerabilities appear when AI agents render user input without proper escaping. This is especially common in server-rendered templates and React applications where agents use \`dangerouslySetInnerHTML\`.

### Vulnerable Pattern: Unescaped Output

\`\`\`bash
// VULNERABLE: AI-generated code rendering user input directly
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send('<h1>Results for: ' + query + '</h1>');
});

// VULNERABLE: React component using dangerouslySetInnerHTML
function Comment({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}
\`\`\`

### Secure Pattern: Proper Escaping and Sanitization

\`\`\`bash
// SECURE: Using a templating engine with auto-escaping
import DOMPurify from 'dompurify';

function Comment({ text }) {
  const sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href'],
  });
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
\`\`\`

### Automated XSS Testing with Playwright

Use Playwright to test for reflected and stored XSS:

\`\`\`bash
// security/xss-prevention.spec.ts
import { test, expect } from '@playwright/test';

const XSS_PAYLOADS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
  'javascript:alert("XSS")',
  '<iframe src="javascript:alert(1)">',
  '"><script>alert(1)</script>',
  "'-alert(1)-'",
  '<body onload=alert("XSS")>',
];

test.describe('XSS Prevention', () => {
  XSS_PAYLOADS.forEach((payload) => {
    test('should sanitize payload in search: ' + payload.slice(0, 25), async ({ page }) => {
      await page.goto('/search?q=' + encodeURIComponent(payload));

      // Verify no script execution by checking for alert dialogs
      let alertTriggered = false;
      page.on('dialog', () => {
        alertTriggered = true;
      });

      await page.waitForTimeout(1000);
      expect(alertTriggered).toBe(false);

      // Verify payload is escaped in the DOM
      const content = await page.content();
      expect(content).not.toContain('<script>alert');
      expect(content).not.toContain('onerror=alert');
    });
  });

  test('should set security headers', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response.headers();

    expect(headers['content-security-policy']).toBeDefined();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
  });
});
\`\`\`

Install the Playwright skill for security test automation:

\`\`\`bash
npx @qaskills/cli add playwright-e2e
\`\`\`

---

## Authentication and Session Testing

AI agents frequently generate authentication systems with critical flaws: passwords stored in plaintext or with weak hashing, tokens that never expire, missing brute-force protection, and session fixation vulnerabilities.

### Common Vulnerabilities in AI-Generated Auth Code

**Weak password hashing.** AI agents sometimes use MD5 or SHA-256 without salting. Both are trivially breakable with rainbow tables.

\`\`\`bash
// VULNERABLE: AI-generated password hashing
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update(password).digest('hex');

// SECURE: Using bcrypt with salt rounds
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;
const hash = await bcrypt.hash(password, SALT_ROUNDS);
\`\`\`

**Missing token expiration.** AI agents generate JWTs without expiration claims, creating tokens that are valid forever.

\`\`\`bash
// VULNERABLE: JWT without expiration
const token = jwt.sign({ userId: user.id }, SECRET);

// SECURE: JWT with expiration and proper claims
const token = jwt.sign(
  { userId: user.id, iss: 'qaskills.sh', aud: 'api' },
  SECRET,
  { expiresIn: '1h' }
);
\`\`\`

### Automated Authentication Tests

\`\`\`bash
// security/auth-testing.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Authentication Security', () => {
  it('should enforce password complexity', async () => {
    const weakPasswords = ['123456', 'password', 'qwerty', 'abc', ''];

    for (const password of weakPasswords) {
      const response = await request(app)
        .post('/api/register')
        .send({ email: 'test@example.com', password });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('password');
    }
  });

  it('should rate-limit login attempts', async () => {
    const attempts = Array.from({ length: 15 }, () =>
      request(app)
        .post('/api/login')
        .send({ email: 'admin@example.com', password: 'wrong' })
    );

    const responses = await Promise.all(attempts);
    const rateLimited = responses.filter((r) => r.status === 429);

    // After 10 attempts, should start rate-limiting
    expect(rateLimited.length).toBeGreaterThan(0);
  });

  it('should not reveal user existence on login failure', async () => {
    const existingUser = await request(app)
      .post('/api/login')
      .send({ email: 'admin@example.com', password: 'wrong' });

    const nonExistingUser = await request(app)
      .post('/api/login')
      .send({ email: 'nobody@example.com', password: 'wrong' });

    // Same error message regardless of whether user exists
    expect(existingUser.body.error).toBe(nonExistingUser.body.error);
    expect(existingUser.status).toBe(nonExistingUser.status);
  });

  it('should invalidate tokens on password change', async () => {
    // Login and get token
    const login = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'OldPassword1!' });
    const oldToken = login.body.token;

    // Change password
    await request(app)
      .post('/api/change-password')
      .set('Authorization', 'Bearer ' + oldToken)
      .send({ oldPassword: 'OldPassword1!', newPassword: 'NewPassword2!' });

    // Old token should be invalid
    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', 'Bearer ' + oldToken);

    expect(response.status).toBe(401);
  });

  it('should set secure cookie attributes', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'ValidPass1!' });

    const cookies = response.headers['set-cookie'];
    if (cookies) {
      const sessionCookie = cookies.find((c) => c.includes('session'));
      expect(sessionCookie).toContain('HttpOnly');
      expect(sessionCookie).toContain('Secure');
      expect(sessionCookie).toContain('SameSite');
    }
  });

  it('should reject expired JWT tokens', async () => {
    const jwt = require('jsonwebtoken');
    const expiredToken = jwt.sign(
      { userId: '123' },
      process.env.JWT_SECRET,
      { expiresIn: '-1h' }
    );

    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', 'Bearer ' + expiredToken);

    expect(response.status).toBe(401);
  });
});
\`\`\`

### CSRF Protection Testing

AI agents often forget to implement CSRF protection on state-changing endpoints:

\`\`\`bash
// security/csrf-testing.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('CSRF Protection', () => {
  it('should reject POST requests without CSRF token', async () => {
    const response = await request(app)
      .post('/api/transfer')
      .send({ to: 'attacker', amount: 1000 });

    expect(response.status).toBe(403);
  });

  it('should reject requests with invalid CSRF token', async () => {
    const response = await request(app)
      .post('/api/transfer')
      .set('X-CSRF-Token', 'invalid-token')
      .send({ to: 'attacker', amount: 1000 });

    expect(response.status).toBe(403);
  });

  it('should accept requests with valid CSRF token', async () => {
    // First get a valid session and CSRF token
    const session = await request(app).get('/api/csrf-token');
    const csrfToken = session.body.token;
    const cookies = session.headers['set-cookie'];

    const response = await request(app)
      .post('/api/transfer')
      .set('X-CSRF-Token', csrfToken)
      .set('Cookie', cookies)
      .send({ to: 'legitimate-user', amount: 100 });

    expect(response.status).not.toBe(403);
  });
});
\`\`\`

---

## Dependency Vulnerability Scanning

AI agents suggest packages without evaluating their security posture. A single vulnerable dependency can compromise your entire application. Automated dependency scanning catches known vulnerabilities before they reach production.

### npm audit and Snyk

\`\`\`bash
# Built-in npm audit
npm audit
npm audit --audit-level=high

# Snyk for deeper analysis
npx snyk test
npx snyk monitor  # Continuous monitoring

# For Python projects
pip-audit
safety check
\`\`\`

### Automated Dependency Check in Tests

\`\`\`bash
// security/dependency-audit.test.ts
import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('Dependency Security', () => {
  it('should have no high or critical vulnerabilities', () => {
    try {
      execSync('npm audit --audit-level=high --json', {
        encoding: 'utf-8',
      });
    } catch (error) {
      const audit = JSON.parse(error.stdout);
      const critical = audit.metadata.vulnerabilities.critical || 0;
      const high = audit.metadata.vulnerabilities.high || 0;

      expect(critical).toBe(0);
      expect(high).toBe(0);
    }
  });

  it('should not use packages with known security issues', () => {
    const pkg = require('../package.json');
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    // Blocklist of packages with known security concerns
    const blocklist = [
      'event-stream',    // Known supply chain attack
      'ua-parser-js',    // Compromised versions exist
      'colors',          // Sabotaged by maintainer
      'faker',           // Sabotaged by maintainer
      'node-ipc',        // Protestware incident
    ];

    blocklist.forEach((pkg) => {
      expect(allDeps).not.toHaveProperty(pkg);
    });
  });
});
\`\`\`

### License and Supply Chain Verification

\`\`\`bash
# Check for problematic licenses
npx license-checker --failOn "GPL-3.0;AGPL-3.0"

# Verify package integrity
npm audit signatures

# Generate SBOM (Software Bill of Materials)
npx @cyclonedx/cyclonedx-npm --output-file sbom.json
\`\`\`

---

## SAST and DAST Integration

Static Application Security Testing (SAST) analyzes source code without executing it. Dynamic Application Security Testing (DAST) tests the running application. Both are essential for comprehensive security coverage.

### SAST Tools

**Semgrep** is the most effective open-source SAST tool for AI-generated code. It supports custom rules and has extensive built-in rulesets:

\`\`\`bash
# Install Semgrep
pip install semgrep

# Run with OWASP rules
semgrep --config p/owasp-top-ten ./src

# Run with JavaScript-specific security rules
semgrep --config p/javascript ./src

# Run with TypeScript rules
semgrep --config p/typescript ./src

# Custom rule for detecting string-concatenated SQL
# Save as .semgrep/sql-injection.yml
# rules:
#   - id: sql-string-concat
#     patterns:
#       - pattern: |
#           db.query("..." + $VAR + "...")
#     message: "Potential SQL injection via string concatenation"
#     severity: ERROR
#     languages: [javascript, typescript]

semgrep --config .semgrep/ ./src
\`\`\`

**ESLint Security Plugins** catch common vulnerability patterns during development:

\`\`\`bash
# Install security linting
npm install --save-dev eslint-plugin-security eslint-plugin-no-unsanitized

# Add to .eslintrc
# {
#   "plugins": ["security", "no-unsanitized"],
#   "extends": ["plugin:security/recommended"],
#   "rules": {
#     "security/detect-object-injection": "error",
#     "security/detect-non-literal-regexp": "warn",
#     "security/detect-unsafe-regex": "error",
#     "security/detect-eval-with-expression": "error",
#     "no-unsanitized/method": "error",
#     "no-unsanitized/property": "error"
#   }
# }
\`\`\`

### DAST Tools

**OWASP ZAP** is the standard open-source DAST scanner:

\`\`\`bash
# Run ZAP baseline scan against your staging server
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \\
  -t http://localhost:3000 \\
  -r zap-report.html

# Full scan with active testing (use only on staging/test environments)
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py \\
  -t http://localhost:3000 \\
  -r zap-full-report.html

# API scan for REST endpoints
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py \\
  -t http://localhost:3000/api/openapi.json \\
  -f openapi \\
  -r zap-api-report.html
\`\`\`

**Nuclei** provides template-based vulnerability scanning:

\`\`\`bash
# Install Nuclei
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Run with default templates
nuclei -u http://localhost:3000 -t cves/ -t vulnerabilities/

# Run OWASP-specific checks
nuclei -u http://localhost:3000 -t owasp/
\`\`\`

---

## Security Testing in CI/CD

Security testing must be automated in your CI/CD pipeline. Manual security reviews do not scale, especially when AI agents generate code faster than humans can review it.

### GitHub Actions Security Pipeline

\`\`\`bash
# .github/workflows/security.yml
name: Security Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sast:
    name: Static Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Semgrep
        uses: semgrep/semgrep-action@v1
        with:
          config: p/owasp-top-ten p/javascript p/typescript

      - name: Run ESLint Security
        run: npx eslint --ext .ts,.tsx src/ --rule 'security/*: error'

  dependency-scan:
    name: Dependency Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm audit --audit-level=high

      - name: Snyk Security Check
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: secrets.SNYK_TOKEN

  dast:
    name: Dynamic Testing
    runs-on: ubuntu-latest
    needs: [sast]
    steps:
      - uses: actions/checkout@v4

      - name: Start Application
        run: |
          npm ci
          npm run build
          npm start &
          sleep 10

      - name: OWASP ZAP Scan
        uses: zaproxy/action-baseline@v0.12.0
        with:
          target: http://localhost:3000
          rules_file_name: .zap/rules.tsv
          fail_action: true

  security-tests:
    name: Security Test Suite
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm run test:security
\`\`\`

### Pre-Commit Security Hooks

Catch vulnerabilities before they even reach the CI pipeline:

\`\`\`bash
# Install pre-commit hooks
npm install --save-dev husky

# Add security checks to pre-commit
npx husky add .husky/pre-commit "npx semgrep --config p/owasp-top-ten --error ./src"
npx husky add .husky/pre-commit "npx eslint --ext .ts src/ --rule 'security/*: error'"

# Secret detection with gitleaks
brew install gitleaks  # macOS
gitleaks detect --source . --verbose
\`\`\`

### Security Testing Strategy by Environment

| Environment | Tests | Frequency | Tools |
|---|---|---|---|
| Local (pre-commit) | SAST, secret detection | Every commit | Semgrep, gitleaks |
| CI (pull request) | SAST, dependency audit, unit security tests | Every PR | Semgrep, npm audit, Vitest |
| Staging | DAST, penetration testing, full security suite | Every deploy | ZAP, Nuclei, Playwright |
| Production | Monitoring, header checks, certificate validation | Continuous | Observatory, SecurityHeaders.com |

---

## How QA Skills Help

Security testing requires deep domain knowledge -- OWASP categories, attack vectors, tool configurations, and testing patterns that most developers do not have memorized. QA skills embed this knowledge directly into your AI agent so it writes secure code and security tests by default.

### Install Security Testing Skills

\`\`\`bash
# Core security testing knowledge
npx @qaskills/cli add security-testing

# OWASP Top 10 specific patterns and tests
npx @qaskills/cli add owasp-top-10

# Playwright for automated security E2E tests
npx @qaskills/cli add playwright-e2e

# Verify installed skills
npx @qaskills/cli list
\`\`\`

### What the Security Skills Teach Your Agent

The \`security-testing\` skill instructs your AI agent to:

- **Validate all inputs** at the boundary layer using Zod schemas or similar validation libraries
- **Use parameterized queries** for every database interaction, never string concatenation
- **Escape all output** based on the rendering context (HTML, JavaScript, URL, CSS)
- **Implement proper authentication** with bcrypt hashing, JWT expiration, and token rotation
- **Set security headers** including Content-Security-Policy, X-Frame-Options, and Strict-Transport-Security
- **Write security tests** alongside functional tests for every endpoint that handles user input

The \`owasp-top-10\` skill provides specific patterns for testing each OWASP category with code examples and automation scripts. Combined with \`playwright-e2e\` for browser-based security testing, your agent has comprehensive security testing capability.

### Browse and Discover More Skills

Explore all available security and testing skills at the [QASkills.sh skills directory](/skills). Check which [AI coding agents](/agents) are compatible with QA skills, or follow the [getting started guide](/getting-started) to install your first skill in under two minutes.

---

## Building a Security Testing Culture

Automated tools catch known vulnerability patterns, but building truly secure applications requires a security-first mindset across the entire development team. Here are practices that complement automated security testing:

**Threat modeling sessions.** Before building a new feature, spend 30 minutes identifying potential attack vectors. Document them as security test cases that must pass before the feature ships.

**Security champions.** Designate one developer on each team as the security champion. They review AI-generated code with a security lens and maintain the team's security testing skills.

**Vulnerability disclosure process.** Establish a clear process for handling reported vulnerabilities. Automated scanning will find issues -- have a workflow for triaging, patching, and verifying fixes.

**Regular penetration testing.** Automated DAST scans cover common patterns but miss business logic vulnerabilities. Schedule quarterly penetration tests by security professionals who think like attackers.

**Dependency review policy.** Before adding any new package that an AI agent suggests, check its security track record. Use \`npm audit\`, review the package's GitHub issues for security reports, and verify the maintainer's reputation.

---

## Conclusion

AI coding agents are powerful tools that dramatically accelerate development. But without explicit security testing, they introduce vulnerabilities at scale. The combination of SAST tools like Semgrep, DAST tools like OWASP ZAP, dependency scanning with npm audit and Snyk, and custom security test suites catches the vast majority of vulnerabilities before they reach production.

The key is automation. Security testing that depends on manual review will always fall behind the speed of AI-generated code. By integrating security checks into pre-commit hooks, CI pipelines, and staging deployments, you create a layered defense that catches vulnerabilities at every stage.

Start with the OWASP Top 10 as your framework. Install the \`security-testing\` and \`owasp-top-10\` QA skills to give your AI agent security awareness. Add \`playwright-e2e\` for browser-based security test automation. Then build your security test suite incrementally, starting with SQL injection and XSS prevention and expanding to cover authentication, CSRF, dependency scanning, and infrastructure security.

Security testing is not a one-time activity. It is a continuous practice that evolves with your application, your dependencies, and the threat landscape. With the right tools, skills, and automation, AI-generated code can be just as secure as manually written code -- and delivered much faster.

\`\`\`bash
# Get started with security testing today
npx @qaskills/cli add security-testing
npx @qaskills/cli add owasp-top-10
npx @qaskills/cli add playwright-e2e
\`\`\`

Browse all QA skills at [qaskills.sh/skills](/skills).

---

*Written by [Pramod Dutta](https://thetestingacademy.com), founder of The Testing Academy and QASkills.sh.*
`,
};
