---
name: agent-orchestrator
description: Decision logic — maps task types to the right skill combinations for АИС КРР development
version: 1.0.0
triggers:
  - какой скил
  - with which skill
  - как подойти
  - что использовать
  - план работы
  - с чего начать
  - не знаю как
related:
  - kru-inspection-expert
  - security-guardian
  - kru-code-standard
  - testing-strategy
---

# Agent Orchestrator — АИС КРР

Not sure which skill to use? Start here.

---

## Task → Skill Mapping

### Adding Features

| Task | Primary | Supporting | Order |
|------|---------|-----------|-------|
| Add new violation type | `kru-inspection-expert` | `reference-data-architecture` → `kru-code-standard` → `i18n-localization` → `testing-strategy` | 1→2→3→4→5 |
| Add new Excel report | `automated-reporting` | `kru-code-standard` → `i18n-localization` | 1→2→3 |
| Add new user role | `kru-inspection-expert` | `security-guardian` → `kru-code-standard` → `testing-strategy` | 1→2→3→4 |
| Add new reference table | `reference-data-architecture` | `kru-code-standard` → `i18n-localization` | 1→2→3 |
| Add new audit state | `kru-inspection-expert` | `kru-code-standard` → `security-guardian` | 1→2→3 |
| Add new ПС module | `kru-inspection-expert` | `nodejs-backend-patterns` → `security-guardian` → `testing-strategy` | 1→2→3→4 |

### Security & Compliance

| Task | Primary | Supporting |
|------|---------|-----------|
| Fix security vulnerability | `security-guardian` | `nodejs-backend-patterns` |
| Implement PINFL masking | `security-guardian` | `kru-code-standard` |
| Add audit logging | `security-guardian` | `nodejs-backend-patterns` |
| Review RBAC | `security-guardian` | `kru-inspection-expert` |
| Write ТЗ section | `technical-spec-writer` | `kru-inspection-expert` |

### Bug Fixes

| Task | Primary | Supporting |
|------|---------|-----------|
| Debug deadline calculation | `deadline-watchdog` | `kru-inspection-expert` |
| Fix Prisma query error | `nodejs-backend-patterns` | `kru-code-standard` |
| Fix UI data not showing | `kru-code-standard` | `nodejs-backend-patterns` |
| Debug auth/session | `security-guardian` | `kru-code-standard` |
| Fix Excel report format | `automated-reporting` | `i18n-localization` |

### Code Quality

| Task | Primary | Supporting |
|------|---------|-----------|
| Reduce fetch() warnings | `kru-code-standard` | `nodejs-backend-patterns` |
| Add missing created_at | `kru-code-standard` | — |
| Move DB logic to services | `nodejs-backend-patterns` | `kru-code-standard` |
| Full quality check | `code-quality-watchdog` | `security-guardian` |

### Testing & Localization

| Task | Primary | Supporting |
|------|---------|-----------|
| Write service unit tests | `testing-strategy` | `kru-code-standard` |
| Write E2E test | `testing-strategy` | `kru-inspection-expert` |
| Add Uzbek translations | `i18n-localization` | `kru-inspection-expert` |
| Format dates/currency | `i18n-localization` | — |

### Git Operations

| Task | Primary |
|------|---------|
| Name a branch | `git-workflow` |
| Write commit message | `git-workflow` |
| Prepare PR | `git-workflow` + run `npm run audit && npm run security-scan` |

---

## All Skills Quick Reference

| Skill | One-liner |
|-------|-----------|
| `agent-orchestrator` | THIS FILE — maps tasks to skills |
| `kru-inspection-expert` | КРУ domain: audit lifecycle, violations, RBAC matrix |
| `security-guardian` | PINFL masking, RBAC checks, audit_log, O'z DSt 2814 |
| `kru-code-standard` | Project conventions: service layer, no fetch, Shadcn UI |
| `nodejs-backend-patterns` | Service layer, Zod validation, error handling |
| `code-quality-watchdog` | Run `npm run audit`, interpret and fix warnings |
| `automated-reporting` | Excel generation: audit, violations, KPI, compliance |
| `deadline-watchdog` | Deadline monitoring, overdue detection, escalation |
| `testing-strategy` | Vitest + Playwright, role fixtures, coverage targets |
| `i18n-localization` | ru/uzLatn/uzCyrl keys, date/currency formatting |
| `git-workflow` | Branch names, commit format, PR template |
| `reference-data-architecture` | Store codes not text, localize in UI |
| `technical-spec-writer` | ТЗ per O'z DSt 1987:2018 |
| `expert-personas` | 40+ specialized AI personas |

---

## Conflict Resolution

When two skills give contradictory guidance:

1. `security-guardian` wins on security matters
2. `kru-inspection-expert` wins on domain/business rules
3. `kru-code-standard` wins on project-specific conventions
4. General skills (`nodejs-backend-patterns`) defer to project-specific ones

---

## New Task Checklist

Before writing any code:

1. **Domain** → `kru-inspection-expert` (what are the business rules?)
2. **Security** → `security-guardian` (touches PINFL, auth, or mutations?)
3. **Conventions** → `kru-code-standard` + `nodejs-backend-patterns`
4. **Tests** → `testing-strategy` (what needs testing?)
5. **Localization** → `i18n-localization` (any user-visible text?)
6. **Git** → `git-workflow` (branch name + commit format)
7. **Verify** → `npm run audit && npm run security-scan`
