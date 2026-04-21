# CLAUDE.md — Project Standards & Guidelines

This file serves as the definitive guide for AI agents (Antigravity/Claude) working on the **Nazorat-Taftish (AIS KRR)** project. Adherence to these standards is mandatory for all development tasks.

## 🛠 Build & Development
- **Dev Server**: `npm run dev` (Default: localhost:3000)
- **Production Build**: `npm run build`
- **Linting**: `npm run lint`
- **Database**: Prisma used for ORM. Schema at `prisma/schema.prisma`.

## 🚀 Feature Development Workflow (7-Phase)
For all non-trivial features, follow this structured approach:
1. **Discovery**: Clarify goals and constraints.
2. **Exploration**: Deeply analyze existing patterns in the codebase using `code-explorer` logic.
3. **Clarification**: Ask the user all necessary questions before designing.
4. **Architecture**: Invoke `code-architect` or `backend-architect` to propose a comprehensive blueprint. Wait for approval.
5. **Implementation**: Build according to approved architecture.
6. **Quality Review**: Launch parallel internal reviewers (using `code-reviewer` logic) for performance, quality, and standards.
7. **Summary**: Document the final implementation using `technical-spec-writer` if a ТЗ is required.

## 🎨 Legendary UI Standards (`DESIGN.md` compliance)
- **Intentionality**: Choose a BOLD aesthetic (Refined Military Precision) and execute it consistently.
- **No AI-Slop**: Avoid generic fonts (Inter/Arial) and overused gradients.
- **Premium Details**: Focus on typography, micro-animations, and high-impact staggared reveals.
- **Vanilla CSS**: Prefer vanilla CSS for flexibility unless Tailwind is explicitly requested.

## 🔍 Code Review & Quality
- **Confidence Scoring**: Only propose code changes with a confidence score ≥ 80/100.
- **Self-Review**: Perform a multi-perspective audit for DRYness, elegance, and correctness.
- **Consistency**: Follow `kru-code-standard` for Next.js App Router and Prisma patterns.

## 🛡 Security & Compliance (O'z DSt 2814:2014)
- **PINFL Masking**: Always protect personal identification data in views.
- **Input Sanitization**: No `dangerouslySetInnerHTML` without DOMPurify or equivalent.
- **Injection Prevention**: Use Prisma's parameterized queries; never use `eval()` or `new Function()`.
- **Command Safety**: Prefer `execFile` over `exec` to prevent shell injection.

## 🌐 Localization (i18n)
- Support **ru**, **uzLatn**, **uzCyrl**.
- Ensure all UI strings are translated and accessible via `useTranslation`.
- Currency formatting: UZS (Sum).
- Date formats: DD.MM.YYYY.
