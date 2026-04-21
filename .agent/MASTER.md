# .agent Master Index — АИС КРР

Central reference. Start here. Not sure which skill? → `skills/agent-orchestrator/SKILL.md`

---

## Skill Inventory

| Skill | Description | Use when... |
|-------|-------------|-------------|
| [agent-orchestrator](skills/agent-orchestrator/SKILL.md) | Maps tasks to skill combinations | You don't know which skill to use |
| [kru-inspection-expert](skills/kru-inspection-expert/SKILL.md) | КРУ domain: audit lifecycle, violations, RBAC | Adding/changing audit or violation logic |
| [security-guardian](skills/security-guardian/SKILL.md) | PINFL masking, RBAC, audit_log, O'z DSt 2814 | Any security-sensitive code |
| [kru-code-standard](skills/kru-code-standard/SKILL.md) | Project conventions: service layer, Shadcn UI | All development on this project |
| [nodejs-backend-patterns](skills/nodejs-backend-patterns/SKILL.md) | Service layer, error handling, Zod | Backend/API work |
| [code-quality-watchdog](skills/code-quality-watchdog/SKILL.md) | Automated code quality scanner | Before PRs, after major changes |
| [automated-reporting](skills/automated-reporting/SKILL.md) | Excel reports (XLSX) | Adding or modifying reports |
| [deadline-watchdog](skills/deadline-watchdog/SKILL.md) | Deadline monitoring and escalation | Decision deadline features |
| [testing-strategy](skills/testing-strategy/SKILL.md) | Vitest + Playwright, role fixtures | Writing any tests |
| [i18n-localization](skills/i18n-localization/SKILL.md) | ru/uzLatn/uzCyrl, UZS, dates | Any user-visible text |
| [git-workflow](skills/git-workflow/SKILL.md) | Branch naming, commit format, PR template | Before git operations |
| [reference-data-architecture](skills/reference-data-architecture/SKILL.md) | Store codes not text, localize in UI | Reference data tables |
| [technical-spec-writer](skills/technical-spec-writer/SKILL.md) | ТЗ per O'z DSt 1987:2018 | Writing technical specs |
| [expert-personas](skills/expert-personas/SKILL.md) | 40+ specialized AI personas | Deep domain-specific work |

---

## Most Common Tasks

```
Add violation type      → kru-inspection-expert → reference-data-architecture → i18n-localization
Fix security issue      → security-guardian → nodejs-backend-patterns
Add Excel report        → automated-reporting → i18n-localization
Debug Prisma error      → nodejs-backend-patterns → kru-code-standard
Write ТЗ section        → technical-spec-writer → kru-inspection-expert
Run quality check       → code-quality-watchdog → security-guardian
Write tests             → testing-strategy → kru-inspection-expert
Name a branch           → git-workflow
```

---

## Automated Tools

| Command | What it does | Skill |
|---------|-------------|-------|
| `npm run audit` | Code quality scan | code-quality-watchdog |
| `npm run security-scan` | Security vulnerability scan | security-guardian |
| `npm run generate:audit-report` | Audit Excel report | automated-reporting |
| `npm run generate:violations-registry` | Violations registry Excel | automated-reporting |
| `npm run generate:kpi-report` | KPI metrics Excel | automated-reporting |
| `npm run generate:compliance-report` | O'z DSt 2814 compliance report | automated-reporting |
| `npm test` | Vitest unit + integration | testing-strategy |
| `npm run test:e2e` | Playwright E2E | testing-strategy |

---

## Project Context

- **System:** АИС КРР — Automated Inspection System, Ministry of Defense, Uzbekistan
- **Stack:** Next.js 14 App Router · Prisma · TypeScript · Tailwind · Shadcn UI
- **Database:** PostgreSQL via Prisma
- **Auth:** next-auth — 4 roles: admin, chief_inspector, inspector, viewer
- **Locales:** ru (primary), uzLatn, uzCyrl
- **Security:** КЗ-2 classification · PINFL personal data · O'z DSt 2814:2014
- **Quality:** 531 files · 55 warnings (51× fetch in components, 4× missing created_at)

---

## Skill Dependency Graph

```
agent-orchestrator
├── kru-inspection-expert ──→ audit-lifecycle, violations-categories, db-schema, user-roles, decision-trees
├── security-guardian ──────→ oz-dst-2814-checklist, rbac-audit-patterns, security-scan.ts
├── kru-code-standard
├── nodejs-backend-patterns
├── code-quality-watchdog ──→ quality-audit.ts, pre-commit-hook.sh
├── automated-reporting ───→ 5 Excel scripts
├── deadline-watchdog ──────→ check-overdue-decisions.js
├── testing-strategy ───────→ test-patterns, role-fixtures
├── i18n-localization ──────→ locale-conventions, uzb-legal-glossary
├── git-workflow ───────────→ branch-naming, pr-template
├── reference-data-architecture
├── technical-spec-writer
└── expert-personas ────────→ 9 persona libraries incl. security-compliance
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-04-17 | Legendary upgrade: +security-guardian, +testing-strategy, +i18n-localization, +git-workflow, +agent-orchestrator, +decision-trees, +frontmatter on all skills |
| 1.0.0 | 2026-01-01 | Initial skill set |
