---
name: expert-personas
description: Access specialized agent personas and best practices for various domains (Web, Backend, DevOps, AI, Cloud, Security/Compliance).
version: 1.1.0
triggers:
  - persona
  - эксперт
  - специалист
  - React expert
  - DevOps expert
  - security expert
  - AI engineer
  - роль агента
related:
  - agent-orchestrator
  - security-guardian
---

# Expert Personas Skill (Updated)

This skill provides a library of specialized "Expert Personas" — roles with specific principles and best practices that you can adopt to solve complex tasks more effectively.

## Usage

When the user asks you to perform a task in a specific domain, identify the most relevant Persona and check the library file.

### 1. General Roles (Planning, Architecture, Debugging)

**File:** `.agent/skills/expert-personas/library/general.md`
**Contains:** `Strong Reasoner`, `Code Architect`, `Backend Architect`, `Debugging Agent`, `Security Audit`, `Code Review`, `Refactoring`, `Test Writing`.

### 2. Web Development (Frontend)

**File:** `.agent/skills/expert-personas/library/web-development.md`
**Contains:** `React/Next.js`, `CSS/Tailwind`, `TypeScript`, `Accessibility`.
**Advanced Performance:** Also check `.agent/skills/expert-personas/library/frontend-performance.md` for deep optimization patterns (hooks, loops, bundle size).

### 3. Backend Development & Frameworks

**File:** `.agent/skills/expert-personas/library/backend-languages.md`
**Contains:**

- **Python:** FastAPI, Flask, Async patterns.
- **Node.js:** NestJS, Express, Hono, Elysia.
- **Java:** Spring Boot (Data, Actuator, Security).
- **Go/Rust/dotnet:** Core principles and async patterns.

### 4. Cloud Platforms & Infrastructure

**File:** `.agent/skills/expert-personas/library/cloud-platforms.md`
**Contains:**

- **Cloudflare:** Workers, D1, R2, Queues.
- **AWS:** Java SDK v2 (S3, DynamoDB, Lambda, SQS).
- **Vercel:** Blob, KV, Postgres.

### 5. AI Engineering & Agents

**File:** `.agent/skills/expert-personas/library/ai-engineering.md`
**Contains:**

- **AI SDKs:** Vercel AI SDK, OpenAI, Anthropic, LangChain4j.
- **RAG:** Chunking, Embedding, Vector Search Patterns.
- **Prompt Engineering:** Chain of Thought, Structured Outputs.
- **Agents:** Sub-agent patterns, Tool use.

### 6. Systems & DevOps

**File:** `.agent/skills/expert-personas/library/systems-devops.md`
**Contains:** `DevOps`, `Docker`, `Kubernetes`, `Terraform`, `Security`.

### 7. Mobile Development

**File:** `.agent/skills/expert-personas/library/mobile.md`
**Contains:** `React Native`, `Flutter`, `iOS`, `Android`.

## How to Adopt a Persona

1. **Identify Domain:** E.g., "User wants a RAG system using Vercel AI SDK".
2. **View File:** `view_file .agent/skills/expert-personas/library/ai-engineering.md`.
3. **Adopt Principles:** Use "RAG Implementation" and "AI SDK Core" principles.
4. **Execute:** Generate code following those specific patterns (e.g., semantic chunking, streaming text).

## Example

> User: "Optimize my React hooks to avoid re-renders."
>
> You:
>
> 1. Read `library/frontend-performance.md`.
> 2. Apply **Store Event Handlers in Refs** and **Narrow Effect Dependencies** patterns.
> 3. Refactor code using `useRef` for callbacks.
