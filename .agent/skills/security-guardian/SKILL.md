---
name: security-guardian
description: Security verification for АИС КРР — PINFL masking, RBAC checks, audit_log completeness, O'z DSt 2814:2014 compliance
version: 1.0.0
triggers:
  - security
  - PINFL
  - персональные данные
  - RBAC
  - getCurrentUser
  - audit_log
  - уязвимость
  - доступ
  - роль
  - permission
  - O'z DSt 2814
related:
  - kru-inspection-expert
  - kru-code-standard
  - nodejs-backend-patterns
---

# Security Guardian

Automated security verification for АИС КРР. МО project with PINFL personal data requires maximum protection per O'z DSt 2814:2014.

## Run Security Scan

```bash
npx tsx .agent/skills/security-guardian/scripts/security-scan.ts
# or after adding to package.json:
npm run security-scan
```

Add to `package.json`:
```json
"security-scan": "npx tsx .agent/skills/security-guardian/scripts/security-scan.ts"
```

---

## Rule 1: PINFL Masking (CRITICAL)

PINFL is a 14-digit personal identifier. MUST be masked for all roles except `admin` and `chief_inspector`.

### Correct pattern — mask in service layer:
```typescript
// lib/services/personnel-service.ts
function maskPinfl(pinfl: string, role: string): string {
  if (role === 'admin' || role === 'chief_inspector') return pinfl;
  return pinfl.replace(/(\d{6})\d{6}(\d{2})/, '$1******$2');
}

export async function getPersonnelById(id: string, requestingUserRole: string) {
  const person = await prisma.personnel.findUniqueOrThrow({ where: { id } });
  return {
    ...person,
    pinfl: maskPinfl(person.pinfl, requestingUserRole),
    passport_number: requestingUserRole === 'admin' || requestingUserRole === 'chief_inspector'
      ? person.passport_number
      : '***** ***',
  };
}
```

### Violation pattern — never do this:
```typescript
// ❌ WRONG: returning raw PINFL to client
return NextResponse.json(await prisma.personnel.findMany());

// ❌ WRONG: masking in component (too late — data already exposed in network)
{user.role !== 'admin' ? maskPinfl(person.pinfl) : person.pinfl}
```

---

## Rule 2: RBAC — Every Route Must Check Role (CRITICAL)

Every `route.ts` and every Server Action that reads or writes data MUST call `getCurrentUser()` at the top.

### Correct pattern:
```typescript
// app/api/violations/route.ts
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role === 'viewer') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // rest of handler
}
```

### Server Action pattern:
```typescript
'use server';
import { getCurrentUser } from '@/lib/auth/session';

export async function createViolation(data: CreateViolationDto) {
  const user = await getCurrentUser();
  if (!user || user.role === 'viewer') throw new Error('FORBIDDEN');
  return violationsService.create(data, user.id);
}
```

---

## Rule 3: Audit Log — All Mutations Must Be Logged (HIGH)

Every CREATE, UPDATE, DELETE on sensitive tables must write to `audit_log`.

### Sensitive tables:
`users`, `personnel`, `audits`, `violations`, `decisions`, `orders`, `commission_members`

### Correct pattern:
```typescript
export async function createViolation(data: CreateViolationDto, userId: string) {
  const violation = await prisma.violation.create({ data });
  await prisma.audit_log.create({
    data: {
      user_id: userId,
      action: 'CREATE',
      table_name: 'violations',
      record_id: violation.id,
      new_values: JSON.stringify(data),
    },
  });
  return violation;
}
```

---

## Rule 4: Zod Validation at Every Boundary (HIGH)

```typescript
import { z } from 'zod';

const CreateViolationSchema = z.object({
  audit_id: z.string().uuid(),
  type: z.enum(['illegal_expense','overpayment','cash_shortage','embezzlement',
    'misuse_of_funds','property_shortage','property_surplus','improper_storage',
    'unlawful_writeoff','accounting_violation','procurement_violation',
    'labor_violation','staffing_violation','corruption_risk','other']),
  amount: z.number().positive().optional(),
  description: z.string().min(10).max(2000),
  severity: z.enum(['CRITICAL','HIGH','MEDIUM','LOW']),
});

export async function createViolation(rawData: unknown, userId: string) {
  const data = CreateViolationSchema.parse(rawData);
  // ...
}
```

---

## Rule 5: No Direct Prisma in Client Components (CRITICAL)

`@prisma/client` must never be imported in files with `'use client'`. All data must flow through API routes or Server Components.

---

## O'z DSt 2814:2014 Key Requirements for АИС КРР

- **КЗ-2** classification (Confidential) for PINFL data
- All access logged: timestamp + user_id + IP
- Session timeout: 30 minutes inactivity
- Password: min 8 chars, uppercase + lowercase + digit
- Data transmission: HTTPS only
- Backups: encrypted, separate storage

Full checklist → `reference/oz-dst-2814-checklist.md`

---

## Security Severity Levels

| Level | Color | Examples |
|-------|-------|---------|
| CRITICAL | 🔴 | PINFL exposed, no auth check |
| HIGH | 🟠 | Missing audit_log, no Zod validation |
| MEDIUM | 🟡 | Weak session config, verbose errors |
| LOW | 🔵 | Missing rate limiting |

---

## CI Integration

```bash
# Fail build on CRITICAL security issues
npx tsx .agent/skills/security-guardian/scripts/security-scan.ts
# exits with code 1 if CRITICAL found
```
