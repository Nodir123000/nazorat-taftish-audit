# Role Fixtures — АИС КРР

Pre-configured test users for all 4 roles. Use in integration and E2E tests.

---

## TypeScript Fixtures

```typescript
// tests/fixtures/role-fixtures.ts
import { prisma } from '@/lib/db/prisma';

export const ROLE_FIXTURES = {
  async createAdmin() {
    return prisma.user.upsert({
      where: { username: 'test_admin' },
      update: {},
      create: {
        username: 'test_admin',
        password_hash: '$2b$12$testhashadmin000000000',
        role: 'admin',
        is_active: true,
        personnel: {
          create: { full_name: 'Тест Администратор', rank: 'Полковник', position: 'Системный администратор' },
        },
      },
      include: { personnel: true },
    });
  },

  async createChiefInspector() {
    return prisma.user.upsert({
      where: { username: 'test_chief' },
      update: {},
      create: {
        username: 'test_chief',
        password_hash: '$2b$12$testhaschchief00000000',
        role: 'chief_inspector',
        is_active: true,
        personnel: {
          create: { full_name: 'Тест Главный Инспектор', rank: 'Подполковник', position: 'Главный инспектор КРУ' },
        },
      },
      include: { personnel: true },
    });
  },

  async createInspector() {
    return prisma.user.upsert({
      where: { username: 'test_inspector' },
      update: {},
      create: {
        username: 'test_inspector',
        password_hash: '$2b$12$testhashinspr000000000',
        role: 'inspector',
        is_active: true,
        personnel: {
          create: { full_name: 'Тест Инспектор', rank: 'Майор', position: 'Инспектор КРУ' },
        },
      },
      include: { personnel: true },
    });
  },

  async createViewer() {
    return prisma.user.upsert({
      where: { username: 'test_viewer' },
      update: {},
      create: {
        username: 'test_viewer',
        password_hash: '$2b$12$testhashhviewr00000000',
        role: 'viewer',
        is_active: true,
        personnel: {
          create: { full_name: 'Тест Наблюдатель', rank: 'Капитан', position: 'Наблюдатель' },
        },
      },
      include: { personnel: true },
    });
  },

  async setupInspectorWithAudit() {
    const inspector = await ROLE_FIXTURES.createInspector();

    const unit = await prisma.ref_units.upsert({
      where: { code: 'TEST-001' },
      update: {},
      create: { code: 'TEST-001', name: 'Войсковая часть TEST-001', military_district: 'Ташкентский' },
    });

    const plan = await prisma.rev_plan_year.create({
      data: { year: 2026, status: 'active', approved_by: inspector.id },
    });

    const order = await prisma.order.create({
      data: {
        plan_id: plan.id,
        unit_id: unit.id,
        start_date: new Date('2026-05-01'),
        end_date: new Date('2026-05-15'),
        status: 'in_progress',
        commission_members: {
          create: { personnel_id: inspector.personnel!.id, is_responsible: true },
        },
      },
    });

    const audit = await prisma.audit.create({
      data: {
        order_id: order.id,
        unit_id: unit.id,
        status: 'in_progress',
        start_date: new Date('2026-05-01'),
        end_date: new Date('2026-05-15'),
      },
    });

    return { inspector, unit, plan, order, audit, auditId: audit.id };
  },

  async cleanup() {
    await prisma.user.deleteMany({ where: { username: { startsWith: 'test_' } } });
  },
};
```

---

## Playwright Auth Storage

```typescript
// tests/e2e/global-setup.ts
import { chromium } from '@playwright/test';

const CREDS = {
  admin: { u: 'test_admin', p: 'TestAdmin123!' },
  chief_inspector: { u: 'test_chief', p: 'TestChief123!' },
  inspector: { u: 'test_inspector', p: 'TestInspector123!' },
  viewer: { u: 'test_viewer', p: 'TestViewer123!' },
};

export default async function globalSetup() {
  const browser = await chromium.launch();
  for (const [role, creds] of Object.entries(CREDS)) {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('[name="username"]', creds.u);
    await page.fill('[name="password"]', creds.p);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await page.context().storageState({ path: `tests/e2e/.auth/${role}.json` });
    await page.close();
  }
  await browser.close();
}
```

```typescript
// playwright.config.ts projects section:
projects: [
  { name: 'admin',    use: { storageState: 'tests/e2e/.auth/admin.json' } },
  { name: 'chief',    use: { storageState: 'tests/e2e/.auth/chief_inspector.json' } },
  { name: 'inspector',use: { storageState: 'tests/e2e/.auth/inspector.json' } },
  { name: 'viewer',   use: { storageState: 'tests/e2e/.auth/viewer.json' } },
]
```

---

## Auth Helper

```typescript
// tests/e2e/helpers/auth.ts
import { Page } from '@playwright/test';

export async function loginAs(page: Page, role: 'admin' | 'chief_inspector' | 'inspector' | 'viewer') {
  const creds = {
    admin: { u: 'test_admin', p: 'TestAdmin123!' },
    chief_inspector: { u: 'test_chief', p: 'TestChief123!' },
    inspector: { u: 'test_inspector', p: 'TestInspector123!' },
    viewer: { u: 'test_viewer', p: 'TestViewer123!' },
  };
  await page.goto('/auth/login');
  await page.fill('[name="username"]', creds[role].u);
  await page.fill('[name="password"]', creds[role].p);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}
```
