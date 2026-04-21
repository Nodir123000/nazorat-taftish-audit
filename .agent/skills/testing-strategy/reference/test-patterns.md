# Test Patterns — АИС КРР

## Vitest Mock Helpers

```typescript
// tests/helpers/mock-session.ts
import { vi } from 'vitest';

export function mockGetCurrentUser(role: 'admin' | 'chief_inspector' | 'inspector' | 'viewer') {
  vi.mock('@/lib/auth/session', () => ({
    getCurrentUser: vi.fn().mockResolvedValue({
      id: 'test-user-id',
      role,
      personnel_id: 'test-personnel-id',
    }),
  }));
}
```

```typescript
// tests/helpers/mock-prisma.ts
import { vi } from 'vitest';

export const mockPrisma = {
  violation: { create: vi.fn(), findMany: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn(), delete: vi.fn() },
  audit: { create: vi.fn(), findMany: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn() },
  decision: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
  audit_log: { create: vi.fn() },
  commission_members: { findFirst: vi.fn(), findMany: vi.fn() },
  personnel: { findUniqueOrThrow: vi.fn(), findMany: vi.fn() },
};

vi.mock('@/lib/db/prisma', () => ({ prisma: mockPrisma }));
```

---

## Deadline Calculation Tests

```typescript
// tests/unit/ps05-decisions/deadline-calculation.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDeadline } from '@/lib/services/decisions-service';

describe('calculateDeadline', () => {
  it.each([
    ['CRITICAL', 10],
    ['HIGH', 20],
    ['MEDIUM', 30],
    ['LOW', 60],
  ] as const)('severity %s → %d work days', (severity, expectedDays) => {
    const base = new Date('2026-05-01');
    const deadline = calculateDeadline(severity, base);
    const diffDays = Math.round((deadline.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBeGreaterThanOrEqual(expectedDays);
  });
});
```

---

## RBAC Tests (All Roles)

```typescript
// tests/unit/ps04-violations/rbac.test.ts
import { describe, it, expect } from 'vitest';

const ROLES = ['admin', 'chief_inspector', 'inspector', 'viewer'] as const;

describe('createViolation RBAC', () => {
  for (const role of ['admin', 'chief_inspector', 'inspector'] as const) {
    it(`${role} can create violation`, async () => {
      mockGetCurrentUser(role);
      // should not throw FORBIDDEN
    });
  }

  it('viewer cannot create violation', async () => {
    mockGetCurrentUser('viewer');
    await expect(createViolationAction({ ... })).rejects.toThrow('FORBIDDEN');
  });
});
```

---

## Playwright Date Helper

```typescript
// tests/e2e/helpers/dates.ts
export function workDaysFromNow(days: number): string {
  const date = new Date();
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date.toISOString().split('T')[0];
}
```

---

## Violation Type Coverage Matrix

Test every violation type creates correct deadline period:

| type | severity | deadline_days |
|------|----------|---------------|
| `embezzlement` | CRITICAL | 10 |
| `cash_shortage` | CRITICAL | 10 |
| `corruption_risk` | CRITICAL | 10 |
| `illegal_expense` | HIGH | 20 |
| `misuse_of_funds` | HIGH | 20 |
| `property_shortage` | HIGH | 20 |
| `procurement_violation` | HIGH | 20 |
| `unlawful_writeoff` | HIGH | 20 |
| `overpayment` | MEDIUM | 30 |
| `improper_storage` | MEDIUM | 30 |
| `accounting_violation` | MEDIUM | 30 |
| `staffing_violation` | MEDIUM | 30 |
| `labor_violation` | LOW | 60 |
| `property_surplus` | LOW | 60 |
