---
name: testing-strategy
description: Testing standards for АИС КРР — Vitest unit tests, integration tests with real DB, Playwright E2E, role fixtures for all 4 roles
version: 1.0.0
triggers:
  - тест
  - test
  - vitest
  - playwright
  - unit test
  - integration test
  - e2e
  - fixture
  - mock
  - покрытие
  - coverage
related:
  - kru-code-standard
  - security-guardian
  - kru-inspection-expert
---

# Testing Strategy — АИС КРР

## Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit | Vitest | `lib/services/` business logic with Prisma mocks |
| Integration | Vitest + real DB | Server Actions, service layer with actual DB |
| E2E | Playwright | Critical user flows across all 4 roles |
| Fixtures | Custom helpers | Pre-configured test users for admin/chief/inspector/viewer |

---

## Setup

```bash
npm install -D vitest @vitejs/plugin-react playwright @playwright/test
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
```

Add to `package.json`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:coverage": "vitest run --coverage"
```

---

## Unit Tests — lib/services/

Mock Prisma. Test business logic only.

```typescript
// tests/unit/services/violations-service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createViolation } from '@/lib/services/violations-service';

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    violation: { create: vi.fn() },
    audit_log: { create: vi.fn() },
  },
}));

import { prisma } from '@/lib/db/prisma';

describe('violations-service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates violation and writes audit log', async () => {
    const mockViolation = { id: 'v-001', type: 'illegal_expense', audit_id: 'a-001' };
    vi.mocked(prisma.violation.create).mockResolvedValue(mockViolation as any);
    vi.mocked(prisma.audit_log.create).mockResolvedValue({} as any);

    const result = await createViolation(
      { audit_id: 'a-001', type: 'illegal_expense', description: 'Unauthorized fuel expenses', severity: 'HIGH' },
      'user-001'
    );

    expect(prisma.violation.create).toHaveBeenCalledOnce();
    expect(prisma.audit_log.create).toHaveBeenCalledOnce();
    expect(result.id).toBe('v-001');
  });

  it('sets criminal_referral=true for embezzlement', async () => {
    const mockViolation = { id: 'v-002', type: 'embezzlement', criminal_referral: true };
    vi.mocked(prisma.violation.create).mockResolvedValue(mockViolation as any);
    vi.mocked(prisma.audit_log.create).mockResolvedValue({} as any);

    const result = await createViolation(
      { audit_id: 'a-001', type: 'embezzlement', description: 'Cash stolen from unit fund', severity: 'CRITICAL' },
      'user-001'
    );

    expect(result.criminal_referral).toBe(true);
  });
});
```

---

## Integration Tests — Real DB

No mocks. Catches real Prisma issues.

```typescript
// tests/setup.ts
import { prisma } from '@/lib/db/prisma';
import { afterAll } from 'vitest';
afterAll(async () => { await prisma.$disconnect(); });
```

```typescript
// tests/integration/ps04-violations/create-violation.test.ts
import { describe, it, expect } from 'vitest';
import { ROLE_FIXTURES } from '../fixtures/role-fixtures';

describe('createViolation integration', () => {
  it('inspector creates violation on own audit', async () => {
    const { auditId } = await ROLE_FIXTURES.setupInspectorWithAudit();
    // test actual service call with real DB
  });

  it('viewer cannot create violation', async () => {
    await expect(
      createViolationAction({ audit_id: 'any', type: 'other', description: 'test desc here', severity: 'LOW' })
    ).rejects.toThrow('FORBIDDEN');
  });
});
```

---

## E2E Tests — Playwright Critical Paths

### 5 mandatory paths:

1. **Auth**: Login → Dashboard → Logout (all 4 roles)
2. **Create order**: Plan → New Order → Add commission → Submit
3. **Audit lifecycle**: Draft → Planned → In Progress → Add violation → Complete
4. **Violation → Decision**: Register violation → Create decision → Set deadline
5. **Report**: Select audit → Export Excel → Verify download

```typescript
// tests/e2e/ps03-audit-lifecycle.spec.ts
import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Audit Lifecycle — Inspector', () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, 'inspector'); });

  test('inspector can add violation to own audit', async ({ page }) => {
    await page.goto('/audits');
    await page.click('[data-testid="audit-row"]:first-child');
    await page.click('button:has-text("Добавить нарушение")');
    await page.selectOption('[name="type"]', 'accounting_violation');
    await page.fill('[name="description"]', 'Missing receipts for Q1 expenses');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="violation-list"]')).toContainText('accounting_violation');
  });

  test('viewer cannot add violation', async ({ page }) => {
    await loginAs(page, 'viewer');
    await page.goto('/audits');
    await expect(page.locator('button:has-text("Добавить нарушение")')).not.toBeVisible();
  });
});
```

---

## Test File Organization

```
tests/
  unit/
    ps03-audits/
    ps04-violations/
    ps05-decisions/
  integration/
    fixtures/
      role-fixtures.ts
    ps03-audits/
    ps04-violations/
  e2e/
    helpers/
      auth.ts
    .auth/          ← saved session states
    ps01-auth/
    ps03-audit-lifecycle/
    ps04-violations/
    ps06-reports/
```

---

## Deadline Calculation Test Matrix

| Severity | Expected work days | Test |
|----------|-------------------|------|
| CRITICAL | 10 | `embezzlement`, `cash_shortage`, `corruption_risk` |
| HIGH | 20 | `illegal_expense`, `procurement_violation` |
| MEDIUM | 30 | `accounting_violation`, `staffing_violation` |
| LOW | 60 | `labor_violation`, `property_surplus` |

---

## Coverage Targets

| Layer | Minimum | Target |
|-------|---------|--------|
| Services (`lib/services/`) | 80% | 95% |
| Server Actions | 70% | 90% |
| E2E critical paths | 5 paths | All critical paths |

---

See `reference/role-fixtures.md` for pre-configured test users and `reference/test-patterns.md` for Vitest/Playwright patterns.
