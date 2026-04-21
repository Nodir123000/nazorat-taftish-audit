# RBAC Audit Patterns — АИС КРР

## Role Hierarchy

```
admin → chief_inspector → inspector → viewer (read-only)
```

## Module Access Matrix

| Module | admin | chief_inspector | inspector | viewer |
|--------|-------|----------------|-----------|--------|
| ПС-01 Users | R/W/D | R | — | — |
| ПС-02 Planning | R/W | R/W | R | R |
| ПС-03 Audits | R/W | R/W | R/W (own) | R |
| ПС-04 Violations | R/W | R/W | R/W (own) | R |
| ПС-05 Decisions | R/W | R/W | R/W (own) | R |
| ПС-06 Reports | R/W | R/W | R | R |
| ПС-07 Personnel | R/W + PINFL | R/W + PINFL | R (masked) | R (masked) |
| ПС-08 Audit Log | R | — | — | — |

---

## Pattern 1: Route-level auth check

```typescript
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // module-specific role check below
}
```

## Pattern 2: Ownership check for inspector

```typescript
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const audit = await prisma.audit.findUniqueOrThrow({ where: { id: params.id } });

  if (user.role === 'inspector') {
    const isMember = await prisma.commission_members.findFirst({
      where: { order_id: audit.order_id, personnel_id: user.personnel_id }
    });
    if (!isMember) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
```

## Pattern 3: Server Action with ownership

```typescript
'use server';
export async function updateViolation(id: string, data: UpdateViolationDto) {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  if (user.role === 'viewer') throw new Error('FORBIDDEN');

  if (user.role === 'inspector') {
    const violation = await prisma.violation.findUniqueOrThrow({ where: { id } });
    const audit = await prisma.audit.findUniqueOrThrow({ where: { id: violation.audit_id } });
    const isMember = await prisma.commission_members.findFirst({
      where: { order_id: audit.order_id, personnel_id: user.personnel_id }
    });
    if (!isMember) throw new Error('FORBIDDEN');
  }

  return violationsService.update(id, data, user.id);
}
```

## Pattern 4: UI role guard component

```typescript
// components/role-guard.tsx
'use client';
import { useSession } from 'next-auth/react';

interface RoleGuardProps {
  allowedRoles: ('admin' | 'chief_inspector' | 'inspector' | 'viewer')[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { data: session } = useSession();
  if (!session?.user?.role || !allowedRoles.includes(session.user.role as any)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}

// Usage:
// <RoleGuard allowedRoles={['admin', 'chief_inspector']}>
//   <PINFLField value={person.pinfl} />
// </RoleGuard>
```

## Common Mistakes

1. **Frontend-only guards** — always enforce on server too
2. **Missing ownership check** — inspector A cannot see inspector B's audits
3. **Role check after DB query** — check role BEFORE fetching sensitive data
4. **viewer can POST** — all write endpoints must block viewer
5. **Audit log after response** — log BEFORE returning (prevents log loss on error)
