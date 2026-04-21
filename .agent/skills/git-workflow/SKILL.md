---
name: git-workflow
description: Git conventions for АИС КРР — branch naming with ПС codes, commit format, PR template with security gate
version: 1.0.0
triggers:
  - git
  - ветка
  - branch
  - commit
  - коммит
  - PR
  - pull request
  - merge
  - релиз
  - deploy
related:
  - kru-code-standard
  - security-guardian
  - code-quality-watchdog
---

# Git Workflow — АИС КРР

---

## Branch Naming

Format: `<type>/<PS-code>-<short-description>`

### Types

| Type | When |
|------|------|
| `feature/` | New functionality |
| `fix/` | Bug fix |
| `refactor/` | Code restructuring (no behavior change) |
| `hotfix/` | Critical production fix |
| `chore/` | Dependencies, config, tooling |
| `test/` | Tests only |
| `docs/` | Documentation only |

### ПС Codes

| Code | Module |
|------|--------|
| PS-01 | Auth & Users |
| PS-02 | Annual Planning |
| PS-03 | Audits |
| PS-04 | Violations |
| PS-05 | Decisions |
| PS-06 | Reports |
| PS-07 | Personnel |
| PS-08 | Audit Log |
| PS-09 | Reference Data |
| PS-10 | Admin Panel |
| PS-00 | Cross-cutting / no module |

### Examples

```
feature/PS-04-embezzlement-auto-escalation
fix/PS-03-audit-status-transition-bug
refactor/PS-05-decisions-service-layer
hotfix/PS-01-session-timeout-not-working
chore/PS-00-update-prisma-6.2
test/PS-03-audit-lifecycle-e2e
docs/PS-04-violation-types-decision-tree
```

### Rules
- All lowercase, hyphens only
- Max 60 characters
- Always include ПС code
- Delete branch after merge

---

## Commit Message Format

Format: `[PS-XX] <type>: <description>`

### Types

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Refactoring |
| `test` | Tests only |
| `docs` | Docs only |
| `chore` | Build, deps, config |
| `security` | Security fix |
| `perf` | Performance improvement |

### Examples

```
[PS-04] feat: add embezzlement criminal_referral auto-flag
[PS-03] fix: audit status transition from suspended to in_progress
[PS-05] feat: auto-mark decisions overdue via deadline-watchdog
[PS-07] security: mask PINFL for inspector and viewer roles
[PS-02] refactor: move plan approval logic to planning-service.ts
[PS-00] chore: update Prisma to 6.2, regenerate client types
[PS-06] feat: add violations-registry Excel report
[PS-04] test: add e2e tests for audit lifecycle
```

### Rules
- Present tense: "add" not "added"
- No period at end of subject
- Subject max 72 characters
- Reference issue numbers: `Closes #47`

---

## PR Template

Save to `.github/pull_request_template.md`:

```markdown
## Summary
- 
- 

## ПС Module
- [ ] PS-01 Auth  - [ ] PS-02 Planning  - [ ] PS-03 Audits
- [ ] PS-04 Violations  - [ ] PS-05 Decisions  - [ ] PS-06 Reports
- [ ] PS-07 Personnel  - [ ] PS-08 Audit Log  - [ ] PS-09 Reference

## Security Checklist (required for PS-03, 04, 05, 07)
- [ ] `getCurrentUser()` in all new/modified routes and Server Actions
- [ ] PINFL masked for non-admin/non-chief_inspector roles
- [ ] All mutations write to `audit_log`
- [ ] Zod validation on all new inputs
- [ ] No `new PrismaClient()` instantiation
- [ ] No sensitive data in logs or error messages

## Code Quality
- [ ] `npm run audit` — no new CRITICAL/WARNING
- [ ] `npm run security-scan` — no CRITICAL
- [ ] No direct `fetch()` in client components
- [ ] All DB queries in `lib/services/`

## Testing
- [ ] Unit tests added for new service functions
- [ ] E2E test added for new user-facing flows
- [ ] Tested with all affected roles

## DB Changes
- [ ] No breaking schema changes (or migration provided)
- [ ] New models include `created_at DateTime @default(now())`
- [ ] No nested Prisma includes > 2 levels
```

---

## Merge Strategy

| Branch | Strategy | Delete after |
|--------|----------|-------------|
| `feature/` | Squash merge | Yes |
| `fix/` | Squash merge | Yes |
| `hotfix/` | Merge commit | Yes |
| `chore/` | Squash merge | Yes |

---

## Release Tags

Format: `v<MAJOR>.<MINOR>.<PATCH>`

```bash
git tag -a v1.2.0 -m "Release v1.2.0: violations registry, PINFL masking"
git push origin v1.2.0
```

See `reference/branch-naming.md` for quick reference examples.
