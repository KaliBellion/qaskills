import type { BlogPost } from './index';

export const post: BlogPost = {
  title: 'API Testing Complete Guide — REST, GraphQL, and Contract Testing in 2026',
  description:
    'A comprehensive guide to API testing in 2026 covering REST API testing with Playwright and REST Assured, GraphQL testing, contract testing with Pact, schema validation, and API performance testing for QA engineers and AI agents.',
  date: '2026-02-16',
  category: 'Tutorial',
  content: `
API testing is the backbone of modern software quality assurance. As microservices architectures grow more complex and frontend-backend boundaries become more defined, testing APIs directly has become the single most impactful investment a QA team can make. This guide covers everything you need to know about API testing in 2026 -- from REST fundamentals to GraphQL testing, contract testing with Pact, schema validation, and API performance testing -- with practical code examples you can use today.

## Key Takeaways

- API tests run 10-50x faster than E2E tests and catch 80% of backend bugs
- REST and GraphQL require fundamentally different testing strategies
- Contract testing with Pact prevents integration failures before they reach staging
- Schema validation catches breaking changes automatically in CI/CD pipelines
- AI coding agents with QA skills can generate production-grade API tests from OpenAPI specs
- Combining Playwright API testing, REST Assured, and Pact gives you a comprehensive API testing strategy

---

## Why API Testing Matters in 2026

The testing pyramid has evolved. In 2026, the most effective QA teams are shifting their investment toward API-level testing for several compelling reasons.

**Speed**: API tests execute in milliseconds, not seconds. A suite of 500 API tests runs in under 30 seconds, while the same coverage in E2E tests would take 20+ minutes.

**Stability**: No browser rendering, no flaky selectors, no timing issues. API tests either pass or fail deterministically.

**Coverage**: APIs are the contract between services. Testing at this layer catches serialization bugs, validation errors, authentication flaws, and business logic issues that unit tests miss.

**Shift-left impact**: API tests can run on every commit without slowing down your CI pipeline, catching regressions before they reach integration environments.

According to the 2026 State of Testing report, teams that invest more than 40% of their test effort at the API layer report 3x fewer production incidents than those relying primarily on UI-level testing. If you are building your QA strategy with AI agents, start by installing an API testing skill:

\`\`\`bash
npx @qaskills/cli add api-testing-rest-assured
\`\`\`

Browse all available testing skills at [qaskills.sh/skills](/skills).

---

## REST API Testing Fundamentals

REST APIs follow a predictable pattern: HTTP methods (GET, POST, PUT, PATCH, DELETE) operate on resources identified by URLs. Testing REST APIs means validating that each endpoint returns the correct status code, response body, headers, and side effects for every combination of input.

### What to Test in Every REST Endpoint

For every REST endpoint, you should verify:

- **Status codes**: 200 for success, 201 for creation, 400 for bad input, 401 for unauthorized, 404 for not found, 500 for server errors
- **Response body structure**: JSON schema matches the documented contract
- **Response data correctness**: Values are accurate, not just structurally valid
- **Headers**: Content-Type, caching headers, CORS headers, rate-limit headers
- **Side effects**: POST creates a resource, DELETE removes it, PATCH updates only specified fields
- **Idempotency**: PUT and DELETE produce the same result when called multiple times

### REST API Testing with Playwright APIRequestContext

Playwright is not just for browser testing. Its \`APIRequestContext\` provides a first-class HTTP client that shares cookies, headers, and authentication state with your browser tests. This makes it ideal for hybrid test scenarios.

\`\`\`bash
// tests/api/users.api.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  const baseURL = 'https://api.example.com/v1';

  test('GET /users returns a paginated list', async ({ request }) => {
    const response = await request.get(\`\${baseURL}/users?page=1&limit=10\`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeLessThanOrEqual(10);
    expect(body.pagination).toEqual(
      expect.objectContaining({
        page: 1,
        limit: 10,
        total: expect.any(Number),
      })
    );
  });

  test('POST /users creates a new user', async ({ request }) => {
    const newUser = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'editor',
    };

    const response = await request.post(\`\${baseURL}/users\`, {
      data: newUser,
    });

    expect(response.status()).toBe(201);

    const created = await response.json();
    expect(created.id).toBeDefined();
    expect(created.name).toBe(newUser.name);
    expect(created.email).toBe(newUser.email);
    expect(created.createdAt).toBeDefined();

    // Verify the user was actually persisted
    const getResponse = await request.get(\`\${baseURL}/users/\${created.id}\`);
    expect(getResponse.status()).toBe(200);
    const fetched = await getResponse.json();
    expect(fetched.email).toBe(newUser.email);
  });

  test('PUT /users/:id updates the full resource', async ({ request }) => {
    const updatedUser = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      role: 'admin',
    };

    const response = await request.put(\`\${baseURL}/users/1\`, {
      data: updatedUser,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('Jane Doe');
    expect(body.role).toBe('admin');
  });

  test('DELETE /users/:id removes the resource', async ({ request }) => {
    const response = await request.delete(\`\${baseURL}/users/99\`);
    expect(response.status()).toBe(204);

    // Verify deletion
    const getResponse = await request.get(\`\${baseURL}/users/99\`);
    expect(getResponse.status()).toBe(404);
  });
});
\`\`\`

Install the Playwright API skill to teach your AI agent these patterns automatically:

\`\`\`bash
npx @qaskills/cli add playwright-api
\`\`\`

### REST API Testing with REST Assured (Java)

For Java-based teams, REST Assured remains the gold standard for API testing. Its fluent DSL makes tests readable and concise.

\`\`\`bash
// src/test/java/com/example/api/UsersApiTest.java
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Order;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class UsersApiTest {

    @BeforeAll
    static void setup() {
        RestAssured.baseURI = "https://api.example.com";
        RestAssured.basePath = "/v1";
    }

    @Test
    @Order(1)
    void shouldReturnPaginatedUserList() {
        given()
            .queryParam("page", 1)
            .queryParam("limit", 10)
        .when()
            .get("/users")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("data.size()", lessThanOrEqualTo(10))
            .body("pagination.page", equalTo(1))
            .body("pagination.total", greaterThan(0));
    }

    @Test
    @Order(2)
    void shouldCreateNewUser() {
        String requestBody = """
            {
                "name": "Jane Smith",
                "email": "jane.smith@example.com",
                "role": "editor"
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("/users")
        .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("name", equalTo("Jane Smith"))
            .body("email", equalTo("jane.smith@example.com"))
            .body("createdAt", notNullValue());
    }

    @Test
    @Order(3)
    void shouldReturn404ForNonExistentUser() {
        given()
        .when()
            .get("/users/999999")
        .then()
            .statusCode(404)
            .body("error", equalTo("User not found"));
    }

    @Test
    @Order(4)
    void shouldValidateRequiredFields() {
        String invalidBody = """
            {
                "name": ""
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(invalidBody)
        .when()
            .post("/users")
        .then()
            .statusCode(400)
            .body("errors.size()", greaterThan(0))
            .body("errors[0].field", equalTo("email"))
            .body("errors[0].message", containsString("required"));
    }
}
\`\`\`

Install the REST Assured skill for comprehensive Java API testing patterns:

\`\`\`bash
npx @qaskills/cli add api-testing-rest-assured
\`\`\`

---

## GraphQL Testing

GraphQL presents unique testing challenges compared to REST. Instead of many endpoints with fixed response shapes, GraphQL exposes a single endpoint where clients define exactly what data they need. This flexibility means your testing strategy must adapt.

### Key Differences from REST Testing

- **Single endpoint**: All queries and mutations go to \`/graphql\`, so you cannot rely on URL-based routing for test organization
- **Client-defined responses**: The client's query determines the response shape, so you must test various query structures
- **Over-fetching and under-fetching**: GraphQL solves these problems but introduces query complexity and depth limits
- **N+1 query risk**: Nested resolvers can cause performance issues that only surface under specific query patterns
- **Error handling**: GraphQL returns 200 even for errors, embedding them in an \`errors\` array alongside partial \`data\`

### GraphQL Test Examples

\`\`\`bash
// tests/api/graphql.spec.ts
import { test, expect } from '@playwright/test';

const GRAPHQL_URL = 'https://api.example.com/graphql';

function graphqlRequest(request: any, query: string, variables?: object) {
  return request.post(GRAPHQL_URL, {
    data: { query, variables },
    headers: { 'Content-Type': 'application/json' },
  });
}

test.describe('GraphQL Users API', () => {

  test('query users with selected fields', async ({ request }) => {
    const query = \`
      query GetUsers($limit: Int!) {
        users(limit: $limit) {
          id
          name
          email
          role
        }
      }
    \`;

    const response = await graphqlRequest(request, query, { limit: 5 });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.users).toHaveLength(5);
    expect(body.data.users[0]).toHaveProperty('id');
    expect(body.data.users[0]).toHaveProperty('name');
    expect(body.data.users[0]).toHaveProperty('email');
  });

  test('mutation creates user and returns selected fields', async ({ request }) => {
    const mutation = \`
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          name
          email
        }
      }
    \`;

    const variables = {
      input: {
        name: 'GraphQL User',
        email: 'graphql@example.com',
        role: 'viewer',
      },
    };

    const response = await graphqlRequest(request, mutation, variables);
    const body = await response.json();

    expect(body.errors).toBeUndefined();
    expect(body.data.createUser.id).toBeDefined();
    expect(body.data.createUser.name).toBe('GraphQL User');
  });

  test('returns error for invalid query depth', async ({ request }) => {
    const deepQuery = \`
      query DeepNested {
        users(limit: 1) {
          posts {
            comments {
              author {
                posts {
                  comments {
                    text
                  }
                }
              }
            }
          }
        }
      }
    \`;

    const response = await graphqlRequest(request, deepQuery);
    const body = await response.json();

    expect(body.errors).toBeDefined();
    expect(body.errors[0].message).toContain('depth');
  });

  test('handles partial data with errors', async ({ request }) => {
    const query = \`
      query {
        user(id: "valid-id") { name }
        deletedUser: user(id: "deleted-id") { name }
      }
    \`;

    const response = await graphqlRequest(request, query);
    const body = await response.json();

    // GraphQL can return partial data with errors
    expect(response.status()).toBe(200);
    expect(body.data.user).toBeDefined();
    expect(body.data.deletedUser).toBeNull();
    expect(body.errors).toBeDefined();
  });
});
\`\`\`

---

## Authentication and Authorization Testing

Authentication and authorization bugs are among the most critical defects in any application. API testing must thoroughly cover these scenarios because the API layer is where access control is enforced.

### Authentication Test Patterns

\`\`\`bash
// tests/api/auth.spec.ts
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.example.com/v1';

test.describe('Authentication', () => {
  test('rejects requests without auth token', async ({ request }) => {
    const response = await request.get(\`\${BASE_URL}/users/me\`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Authentication required');
  });

  test('rejects expired JWT tokens', async ({ request }) => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.expired';

    const response = await request.get(\`\${BASE_URL}/users/me\`, {
      headers: { Authorization: \`Bearer \${expiredToken}\` },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toContain('expired');
  });

  test('rejects malformed tokens', async ({ request }) => {
    const response = await request.get(\`\${BASE_URL}/users/me\`, {
      headers: { Authorization: 'Bearer not-a-real-token' },
    });
    expect(response.status()).toBe(401);
  });

  test('allows valid token and returns user data', async ({ request }) => {
    // Obtain a valid token first
    const loginResponse = await request.post(\`\${BASE_URL}/auth/login\`, {
      data: { email: 'test@example.com', password: 'SecurePass123!' },
    });
    const { accessToken } = await loginResponse.json();

    const response = await request.get(\`\${BASE_URL}/users/me\`, {
      headers: { Authorization: \`Bearer \${accessToken}\` },
    });
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user.email).toBe('test@example.com');
  });
});

test.describe('Authorization - Role-Based Access', () => {
  test('regular user cannot access admin endpoints', async ({ request }) => {
    const loginResponse = await request.post(\`\${BASE_URL}/auth/login\`, {
      data: { email: 'user@example.com', password: 'UserPass123!' },
    });
    const { accessToken } = await loginResponse.json();

    const response = await request.get(\`\${BASE_URL}/admin/users\`, {
      headers: { Authorization: \`Bearer \${accessToken}\` },
    });
    expect(response.status()).toBe(403);
  });

  test('user cannot access another users private data', async ({ request }) => {
    const loginResponse = await request.post(\`\${BASE_URL}/auth/login\`, {
      data: { email: 'user-a@example.com', password: 'UserAPass123!' },
    });
    const { accessToken } = await loginResponse.json();

    const response = await request.get(\`\${BASE_URL}/users/user-b-id/private\`, {
      headers: { Authorization: \`Bearer \${accessToken}\` },
    });
    expect(response.status()).toBe(403);
  });
});
\`\`\`

Authentication testing is a core competency that every QA engineer should master. Learn about all the [must-have QA skills for AI agents](/blog/must-have-qa-skills-claude-code-2026).

---

## Negative Testing and Edge Cases

Positive testing verifies that things work correctly. Negative testing verifies that things fail correctly. Both are essential, but negative testing is where most bugs hide.

### What to Cover in Negative Testing

- **Missing required fields**: Omit each required field one at a time
- **Invalid data types**: Send a string where a number is expected, an array where an object is expected
- **Boundary values**: Empty strings, zero, negative numbers, maximum-length strings, integers at MAX_SAFE_INTEGER
- **Special characters**: SQL injection attempts, XSS payloads, Unicode edge cases, null bytes
- **Malformed requests**: Invalid JSON, wrong Content-Type, empty body for POST
- **Rate limiting**: Verify rate limits return 429 with Retry-After headers
- **Concurrency**: Send parallel requests to test race conditions

### Negative Testing Example

\`\`\`bash
// tests/api/negative.spec.ts
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.example.com/v1';

test.describe('Negative Testing - User Creation', () => {
  test('rejects empty name', async ({ request }) => {
    const response = await request.post(\`\${BASE_URL}/users\`, {
      data: { name: '', email: 'valid@example.com', role: 'editor' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'name' }),
      ])
    );
  });

  test('rejects invalid email format', async ({ request }) => {
    const response = await request.post(\`\${BASE_URL}/users\`, {
      data: { name: 'Test User', email: 'not-an-email', role: 'editor' },
    });
    expect(response.status()).toBe(400);
  });

  test('rejects duplicate email', async ({ request }) => {
    const response = await request.post(\`\${BASE_URL}/users\`, {
      data: { name: 'Duplicate', email: 'existing@example.com', role: 'editor' },
    });
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.error).toContain('already exists');
  });

  test('rejects SQL injection in query parameters', async ({ request }) => {
    const response = await request.get(
      \`\${BASE_URL}/users?search='; DROP TABLE users; --\`
    );
    expect(response.status()).not.toBe(500);
    // Should either sanitize the input or return 400
    expect([200, 400]).toContain(response.status());
  });

  test('rejects oversized request body', async ({ request }) => {
    const largePayload = {
      name: 'A'.repeat(100000),
      email: 'large@example.com',
      role: 'editor',
    };
    const response = await request.post(\`\${BASE_URL}/users\`, {
      data: largePayload,
    });
    expect([400, 413]).toContain(response.status());
  });

  test('handles concurrent duplicate creation', async ({ request }) => {
    const userData = {
      name: 'Concurrent User',
      email: 'concurrent-test@example.com',
      role: 'editor',
    };

    const results = await Promise.all([
      request.post(\`\${BASE_URL}/users\`, { data: userData }),
      request.post(\`\${BASE_URL}/users\`, { data: userData }),
    ]);

    const statuses = results.map((r) => r.status());
    // One should succeed, the other should get a conflict
    expect(statuses).toContain(201);
    expect(statuses).toContain(409);
  });
});
\`\`\`

---

## Contract Testing with Pact

Contract testing ensures that a consumer (frontend, mobile app, or another service) and a provider (API) agree on the interface between them. Unlike integration tests that require both services running, contract tests run independently against a shared contract.

### Why Contract Testing Matters

In a microservices architecture, a single API change can break multiple consumers. Contract testing catches these breaking changes at build time rather than in staging or production. The workflow is:

1. **Consumer** writes a Pact test defining expected requests and responses
2. **Pact broker** stores the contract (Pactflow or self-hosted)
3. **Provider** verifies it can fulfill every consumer contract
4. **CI pipeline** blocks deployment if contracts are broken

### Consumer-Side Pact Test (TypeScript)

\`\`\`bash
// tests/contract/user-consumer.pact.spec.ts
import { PactV4, MatchersV3 } from '@pact-foundation/pact';
import { resolve } from 'path';

const { like, eachLike, string, integer, iso8601DateTimeWithMillis } = MatchersV3;

const provider = new PactV4({
  consumer: 'WebApp',
  provider: 'UserService',
  dir: resolve(process.cwd(), 'pacts'),
});

describe('User Service Contract', () => {
  it('returns a list of users', async () => {
    await provider
      .addInteraction()
      .given('users exist')
      .uponReceiving('a request for the user list')
      .withRequest('GET', '/api/v1/users', (builder) => {
        builder.query({ page: '1', limit: '10' });
      })
      .willRespondWith(200, (builder) => {
        builder
          .headers({ 'Content-Type': 'application/json' })
          .jsonBody({
            data: eachLike({
              id: integer(1),
              name: string('Jane Smith'),
              email: string('jane@example.com'),
              role: string('editor'),
              createdAt: iso8601DateTimeWithMillis('2026-01-15T10:30:00.000Z'),
            }),
            pagination: like({
              page: integer(1),
              limit: integer(10),
              total: integer(50),
            }),
          });
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(
          \`\${mockServer.url}/api/v1/users?page=1&limit=10\`
        );
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data[0]).toHaveProperty('id');
        expect(body.data[0]).toHaveProperty('name');
        expect(body.pagination.page).toBe(1);
      });
  });

  it('creates a new user', async () => {
    await provider
      .addInteraction()
      .given('no user with email new@example.com exists')
      .uponReceiving('a request to create a user')
      .withRequest('POST', '/api/v1/users', (builder) => {
        builder
          .headers({ 'Content-Type': 'application/json' })
          .jsonBody({
            name: 'New User',
            email: 'new@example.com',
            role: 'viewer',
          });
      })
      .willRespondWith(201, (builder) => {
        builder.jsonBody({
          id: integer(42),
          name: string('New User'),
          email: string('new@example.com'),
          role: string('viewer'),
          createdAt: iso8601DateTimeWithMillis(),
        });
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(\`\${mockServer.url}/api/v1/users\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'New User',
            email: 'new@example.com',
            role: 'viewer',
          }),
        });
        const body = await response.json();

        expect(response.status).toBe(201);
        expect(body.id).toBeDefined();
        expect(body.name).toBe('New User');
      });
  });
});
\`\`\`

### Provider Verification

On the provider side, Pact verifies that the real API satisfies the consumer contracts:

\`\`\`bash
// tests/contract/user-provider.verify.spec.ts
import { Verifier } from '@pact-foundation/pact';
import { resolve } from 'path';

describe('User Service Provider Verification', () => {
  it('validates the consumer contract', async () => {
    const verifier = new Verifier({
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: [
        resolve(process.cwd(), 'pacts/WebApp-UserService.json'),
      ],
      stateHandlers: {
        'users exist': async () => {
          // Seed the database with test users
          await seedTestUsers();
        },
        'no user with email new@example.com exists': async () => {
          // Ensure this email is not in the database
          await deleteUserByEmail('new@example.com');
        },
      },
    });

    await verifier.verifyProvider();
  });
});
\`\`\`

Contract testing is especially valuable when your frontend and backend teams work on different release cycles. It gives both teams confidence that their changes are compatible.

---

## Schema Validation

Schema validation ensures that API responses match their documented structure. This catches type changes, missing fields, and structural regressions automatically.

### JSON Schema Validation with Ajv

\`\`\`bash
// tests/api/schema-validation.spec.ts
import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const userSchema = {
  type: 'object',
  required: ['id', 'name', 'email', 'role', 'createdAt'],
  properties: {
    id: { type: 'integer', minimum: 1 },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['admin', 'editor', 'viewer'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
};

const userListSchema = {
  type: 'object',
  required: ['data', 'pagination'],
  properties: {
    data: {
      type: 'array',
      items: userSchema,
    },
    pagination: {
      type: 'object',
      required: ['page', 'limit', 'total'],
      properties: {
        page: { type: 'integer', minimum: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
        total: { type: 'integer', minimum: 0 },
      },
    },
  },
};

test.describe('Schema Validation', () => {
  test('GET /users response matches schema', async ({ request }) => {
    const response = await request.get('https://api.example.com/v1/users');
    const body = await response.json();

    const validate = ajv.compile(userListSchema);
    const valid = validate(body);

    if (!valid) {
      console.error('Schema validation errors:', validate.errors);
    }
    expect(valid).toBe(true);
  });

  test('GET /users/:id response matches schema', async ({ request }) => {
    const response = await request.get('https://api.example.com/v1/users/1');
    const body = await response.json();

    const validate = ajv.compile(userSchema);
    const valid = validate(body);
    expect(valid).toBe(true);
  });
});
\`\`\`

### OpenAPI Specification Validation

For teams with OpenAPI (Swagger) specs, you can validate responses directly against the spec:

\`\`\`bash
npm install openapi-response-validator
\`\`\`

This approach ensures your API never drifts from its documentation, which is critical for teams publishing public APIs.

---

## API Performance Testing

Functional correctness is necessary but not sufficient. APIs must also respond within acceptable time limits under realistic load. Performance testing at the API layer catches bottlenecks early.

### Key Metrics to Track

- **Response time** (p50, p95, p99): What latency do most users experience?
- **Throughput**: How many requests per second can the API handle?
- **Error rate under load**: Do errors increase as traffic grows?
- **Resource utilization**: CPU, memory, database connections during load

### Performance Assertions in Playwright

\`\`\`bash
// tests/api/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Performance Baselines', () => {
  test('GET /users responds within 200ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('https://api.example.com/v1/users');
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(200);
  });

  test('POST /users responds within 500ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.post('https://api.example.com/v1/users', {
      data: {
        name: 'Perf Test User',
        email: 'perf-test@example.com',
        role: 'viewer',
      },
    });
    const duration = Date.now() - start;

    expect(response.status()).toBe(201);
    expect(duration).toBeLessThan(500);
  });

  test('search endpoint handles large result sets efficiently', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(
      'https://api.example.com/v1/users?search=a&limit=100'
    );
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(500);
  });
});
\`\`\`

### Load Testing with k6

For real load testing, use a dedicated tool like k6 that can simulate hundreds or thousands of concurrent users:

\`\`\`bash
// load-test.js (k6 script)
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // ramp up
    { duration: '3m', target: 50 },   // sustained load
    { duration: '1m', target: 200 },  // spike
    { duration: '2m', target: 200 },  // sustained spike
    { duration: '1m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://api.example.com/v1/users');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
    'has correct content-type': (r) =>
      r.headers['Content-Type'].includes('application/json'),
  });

  sleep(1);
}
\`\`\`

Run with:

\`\`\`bash
k6 run load-test.js
\`\`\`

For comprehensive performance testing patterns, install the k6 performance skill from [qaskills.sh/skills](/skills).

---

## API Testing Tools Comparison

| Tool / Approach | Language | Best For | REST | GraphQL | Contract | Performance | CI/CD Integration |
|---|---|---|---|---|---|---|---|
| **Playwright APIRequestContext** | TypeScript/JS | Full-stack teams already using Playwright | Yes | Yes | No | Basic timing | Excellent |
| **REST Assured** | Java | Java/Spring teams, detailed validation | Yes | Partial | No | No | Excellent |
| **Pact** | Multi-language | Microservices contract testing | Yes | Yes | Yes | No | Excellent |
| **Postman/Newman** | JavaScript | Quick manual + automated testing | Yes | Yes | No | Basic | Good |
| **k6** | JavaScript | Load and performance testing | Yes | Yes | No | Yes | Excellent |
| **Supertest** | TypeScript/JS | Node.js unit/integration testing | Yes | Yes | No | No | Excellent |
| **Karate** | Java/Gherkin | BDD-style API testing | Yes | Yes | No | Yes (Gatling) | Good |
| **Hurl** | CLI/Plain text | Lightweight HTTP testing | Yes | Yes | No | No | Excellent |
| **Bruno** | JavaScript | Open-source Postman alternative | Yes | Yes | No | No | Good |

### Choosing the Right Tool

- **Already using Playwright for E2E?** Add \`playwright-api\` skill and use \`APIRequestContext\` for API tests alongside your UI tests
- **Java/Spring ecosystem?** REST Assured with the \`api-testing-rest-assured\` skill gives you the most expressive API testing DSL available
- **Microservices with many consumers?** Add Pact for contract testing between services
- **Need load testing?** k6 for scripted load tests, or Artillery for YAML-based scenarios
- **Quick exploration?** Bruno or Postman for manual testing, then export to automated scripts

---

## How QA Skills Help with API Testing

AI coding agents are excellent at generating boilerplate test code, but they need expert guidance to produce production-grade API tests. QA skills from [QASkills.sh](/skills) encode the patterns, anti-patterns, and best practices that experienced QA engineers use daily.

### Install API Testing Skills

\`\`\`bash
# REST Assured patterns for Java teams
npx @qaskills/cli add api-testing-rest-assured

# Playwright API testing (APIRequestContext patterns)
npx @qaskills/cli add playwright-api

# Full Playwright E2E + API hybrid testing
npx @qaskills/cli add playwright-e2e
\`\`\`

### What Skills Teach Your AI Agent

When you install the \`api-testing-rest-assured\` skill, your AI agent learns:

- **Given/When/Then fluent DSL** patterns for readable REST Assured tests
- **Response validation** with Hamcrest matchers and JsonPath assertions
- **Authentication helpers** for OAuth2, API keys, and JWT tokens
- **Request/response logging** for debugging test failures
- **Data-driven testing** with parameterized tests and CSV/JSON data sources

When you install the \`playwright-api\` skill, your agent learns:

- **APIRequestContext** lifecycle management and configuration
- **Hybrid testing** patterns that combine API setup with UI verification
- **Parallel API requests** for performance baseline assertions
- **Cookie and header management** for authenticated API flows
- **Response parsing** and assertion patterns for complex JSON structures

Each skill is compatible with multiple AI agents. Check the [agents page](/agents) to see which agents support your workflow, or read our [getting started guide](/getting-started) to install your first skill in under 60 seconds.

---

## Conclusion

API testing in 2026 is not a single tool or technique -- it is a layered strategy. Start with REST and GraphQL functional tests to verify correctness. Add contract testing with Pact to prevent integration failures. Layer on schema validation to catch structural regressions. And cap it with performance testing to ensure your APIs can handle real-world traffic.

The most effective approach combines multiple tools:

1. **Playwright APIRequestContext** or **REST Assured** for functional API tests
2. **Pact** for consumer-driven contract testing
3. **JSON Schema validation** for structural regression prevention
4. **k6** for load and performance testing
5. **QA skills** to teach your AI agent all of the above patterns

The key insight is that API testing should not replace other testing layers -- it should form the thick middle of your testing strategy, catching the majority of bugs faster and more reliably than E2E tests while providing more integration confidence than unit tests.

Start building your API testing suite today:

\`\`\`bash
npx @qaskills/cli add api-testing-rest-assured
npx @qaskills/cli add playwright-api
\`\`\`

Browse all available QA skills at [qaskills.sh/skills](/skills) and read more about building a complete testing strategy in our [must-have QA skills guide](/blog/must-have-qa-skills-claude-code-2026).

---

*Written by [Pramod Dutta](https://thetestingacademy.com), founder of The Testing Academy and QASkills.sh.*
`,
};
