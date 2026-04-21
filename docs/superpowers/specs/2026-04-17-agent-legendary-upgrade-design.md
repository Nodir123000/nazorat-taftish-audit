# Design: .agent Legendary Upgrade
**Date:** 2026-04-17  
**Project:** АИС КРР — Nazorat-taftish  
**Status:** Approved

---

## Goal

Upgrade the `.agent/` skill system from current level (75/100) to legendary level (99-100) by closing critical gaps, improving existing skills, and adding an orchestration layer.

---

## Current State Assessment

| Skill | Current Level | Gap |
|-------|--------------|-----|
| `code-quality-watchdog` | Good | Detection only, no auto-fix, no trend analysis |
| `automated-reporting` | Weak | 1 of 5 scripts implemented |
| `deadline-watchdog` | Medium | No escalation logic, no notification patterns |
| `kru-inspection-expert` | Good | No decision trees for complex scenarios |
| `expert-personas` | Good | No security/compliance persona |
| `kru-code-standard` | Good | No frontmatter triggers |
| `nodejs-backend-patterns` | Good | No error scenario examples |
| `reference-data-architecture` | Good | Isolated, not linked to other skills |

**Critical Gaps (missing entirely):**
- No `security-guardian` skill (PINFL, RBAC, audit log, O'z DSt 2814:2014)
- No `testing-strategy` skill (Vitest, Playwright, role fixtures)
- No `i18n-localization` skill (ru/uzLatn/uzCyrl, UZS formatting)
- No `git-workflow` skill (branch naming, commit conventions, PR template)
- No `agent-orchestrator` skill (when to use which skill)
- No `MASTER.md` top-level index

---

## Architecture

```
D:\Nazorat-taftish-main\.agent\
├── MASTER.md                          ← NEW: Orchestration index
├── rules.md                           ← KEEP unchanged
├── last-audit-report.json             ← KEEP
└── skills/
    │
    ├── [IMPROVED EXISTING]
    ├── code-quality-watchdog/
    │   ├── SKILL.md                   ← + frontmatter, + auto-fix docs
    │   └── scripts/
    │       ├── quality-audit.ts       ← + --fix flag, + trend comparison
    │       └── pre-commit-hook.sh     ← NEW: git pre-commit integration
    │
    ├── automated-reporting/
    │   ├── SKILL.md                   ← + frontmatter
    │   └── scripts/
    │       ├── generate-audit-report.js    ← KEEP
    │       ├── violations-registry.js      ← NEW
    │       ├── kpi-report.js               ← NEW
    │       ├── summary-dashboard.js        ← NEW
    │       └── compliance-report.js        ← NEW
    │
    ├── deadline-watchdog/
    │   ├── SKILL.md                   ← + escalation patterns, + frontmatter
    │   └── scripts/
    │       └── check-overdue-decisions.js  ← + email/notification patterns
    │
    ├── kru-inspection-expert/
    │   ├── SKILL.md                   ← + frontmatter
    │   └── reference/
    │       ├── audit-lifecycle.md          ← KEEP
    │       ├── db-schema-quick-ref.md      ← KEEP
    │       ├── user-roles-matrix.md        ← KEEP
    │       ├── violations-categories.md    ← KEEP
    │       └── decision-trees.md           ← NEW: complex scenario flows
    │
    ├── expert-personas/
    │   ├── SKILL.md                   ← + frontmatter
    │   └── library/
    │       ├── general.md             ← KEEP
    │       ├── web-development.md     ← KEEP
    │       ├── backend-languages.md   ← KEEP
    │       ├── cloud-platforms.md     ← KEEP
    │       ├── ai-engineering.md      ← KEEP
    │       ├── frontend-performance.md← KEEP
    │       ├── mobile.md              ← KEEP
    │       ├── systems-devops.md      ← KEEP
    │       └── security-compliance.md ← NEW: МО/Uzbekistan compliance personas
    │
    ├── kru-code-standard/
    │   └── SKILL.md                   ← + frontmatter triggers
    │
    ├── nodejs-backend-patterns/
    │   └── SKILL.md                   ← + frontmatter, + error scenarios
    │
    ├── reference-data-architecture/
    │   └── SKILL.md                   ← + frontmatter, + cross-references
    │
    └── [NEW SKILLS]
        ├── security-guardian/
        │   ├── SKILL.md               ← Full security skill
        │   ├── scripts/
        │   │   └── security-scan.ts   ← Automated security scanner
        │   └── reference/
        │       ├── oz-dst-2814-checklist.md   ← O'z DSt 2814:2014 compliance
        │       └── rbac-audit-patterns.md     ← RBAC verification patterns
        │
        ├── testing-strategy/
        │   ├── SKILL.md               ← Testing guidance
        │   └── reference/
        │       ├── test-patterns.md   ← Vitest + Playwright patterns
        │       └── role-fixtures.md   ← Fixtures for 4 user roles
        │
        ├── i18n-localization/
        │   ├── SKILL.md               ← i18n guidance
        │   └── reference/
        │       ├── locale-conventions.md  ← Key naming, date/number formats
        │       └── uzb-legal-glossary.md  ← Uzbek legal terms glossary
        │
        ├── git-workflow/
        │   ├── SKILL.md               ← Git workflow guidance
        │   └── reference/
        │       ├── branch-naming.md   ← Branch convention: feature/PS-03-...
        │       ├── commit-conventions.md ← [PS-04] feat: description
        │       └── pr-template.md     ← PR checklist with security gate
        │
        └── agent-orchestrator/
            └── SKILL.md               ← Master orchestration logic
```

---

## Skill Format Standard

All SKILL.md files (new and updated) use this frontmatter:

```markdown
---
name: skill-name
description: One-line description of what this skill does
version: 1.0.0
triggers:
  - keyword1
  - keyword2
related:
  - other-skill-name
---
```

---

## New Skills Detail

### security-guardian
**Purpose:** Automated security verification for МО project with sensitive PINFL data.

**Covers:**
- PINFL masking verification (14-digit IDs must be masked for non-admin roles)
- RBAC audit: every `route.ts` and Server Action must call `getCurrentUser()`
- `audit_log` completeness: all data mutations must be logged
- O'z DSt 2814:2014 compliance checklist
- XSS prevention via Zod validation presence check
- Automatic severity scoring: CRITICAL/HIGH/MEDIUM/LOW

**Script:** `security-scan.ts` — runs like `npm run security-scan`

---

### testing-strategy
**Purpose:** Testing standards for АИС КРР ensuring correctness across all 4 user roles.

**Covers:**
- Unit tests: `lib/services/` with Vitest + Prisma mocks
- Integration tests: Server Actions with real DB (no mocks)
- E2E tests: Critical paths with Playwright (create order → audit → violation)
- Role fixtures: pre-configured test users for admin/chief_inspector/inspector/viewer
- Test naming conventions aligned with ПС subsystem codes

---

### i18n-localization
**Purpose:** Correct internationalization for ru/uzLatn/uzCyrl locales in Uzbekistan MoD context.

**Covers:**
- Translation key conventions: `violations.illegal_expense.label`
- Date formatting: "Январь 2025" / "Yanvar 2025" (locale-specific)
- UZS currency formatting: `1 234 567,00 сум`
- PINFL/passport display formats for Uzbekistan
- Uzbek legal terms glossary (Russian ↔ Uzbek Latin ↔ Uzbek Cyrillic)
- Locale fallback chain: uzLatn → ru → uzCyrl

---

### git-workflow
**Purpose:** Consistent git practices aligned with ПС subsystem structure.

**Covers:**
- Branch naming: `feature/PS-03-audit-lifecycle`, `fix/PS-04-violation-deadline`
- Commit format: `[PS-04] feat: add embezzlement auto-escalation`
- PR template with mandatory security checklist (RBAC, PINFL, audit_log)
- Merge strategy: squash for features, merge for releases
- Protected branches: `main` requires security-guardian passing

---

### agent-orchestrator
**Purpose:** Decision logic for which skill(s) to apply for any given task.

**Decision Matrix:**
| Task Type | Primary Skill | Supporting Skills |
|-----------|--------------|-------------------|
| Add new violation type | kru-inspection-expert | kru-code-standard, reference-data-architecture, testing-strategy |
| Fix security issue | security-guardian | nodejs-backend-patterns, kru-code-standard |
| Add new report | automated-reporting | kru-code-standard, i18n-localization |
| Refactor component | nodejs-backend-patterns | kru-code-standard, code-quality-watchdog |
| Add new user role | kru-inspection-expert | security-guardian, testing-strategy |
| Write ТЗ section | technical-spec-writer | kru-inspection-expert |
| Debug production issue | expert-personas (Debugger) | code-quality-watchdog, deadline-watchdog |

---

### MASTER.md
**Purpose:** Single entry point that maps tasks to skill combinations.

**Structure:**
- Quick reference table (task → skills)
- Skill inventory with one-line descriptions
- Skill dependency graph
- Version changelog

---

## Implementation Approach

5 parallel agents, each handling independent work:

| Agent | Responsibility |
|-------|---------------|
| A1 | `security-guardian` (SKILL.md + scripts + reference) |
| A2 | `testing-strategy` + `i18n-localization` |
| A3 | `git-workflow` + `agent-orchestrator` + `MASTER.md` |
| A4 | Improve existing: `code-quality-watchdog` (auto-fix, pre-commit) + `automated-reporting` (4 missing scripts) + `deadline-watchdog` (escalation) |
| A5 | Improve existing: `kru-inspection-expert` (decision-trees) + `expert-personas` (security-compliance) + frontmatter on all remaining skills |

---

## Success Criteria

- [ ] All 13 skills have frontmatter with triggers
- [ ] `security-guardian` covers PINFL + RBAC + audit_log + O'z DSt 2814
- [ ] `testing-strategy` has fixtures for all 4 roles
- [ ] `automated-reporting` has all 5 scripts implemented
- [ ] `agent-orchestrator` covers all common task types
- [ ] `MASTER.md` links all skills with one-liner descriptions
- [ ] `code-quality-watchdog` has `--fix` flag documented + pre-commit hook
- [ ] `kru-inspection-expert` has decision trees for CRITICAL violations
- [ ] `git-workflow` has PR template with security gate
