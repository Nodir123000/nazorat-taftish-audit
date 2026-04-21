---
name: nodejs-backend-patterns
description: Comprehensive guidance for building scalable, maintainable, and production-ready Node.js backend applications with modern frameworks, architectural patterns, and best practices.
version: 1.1.0
triggers:
  - backend
  - service layer
  - error handling
  - validation
  - Zod
  - API route
  - route.ts
  - middleware
  - NextResponse
  - try catch
  - паттерн
related:
  - kru-code-standard
  - security-guardian
  - reference-data-architecture
---

# Node.js Backend Patterns

This skill file provides guidelines for building scalable, maintainable, and production-ready backend systems within the Next.js environment (specifically for server actions and API routes).

## Architectural Patterns

### 1. Service Layer Pattern (Separation of Concerns)
**Goal:** Decouple business logic from the presentation layer (UI components) and data access layers.

*   **Structure:**
    *   `lib/services/`: Contains pure business logic and DB interactions.
    *   `components/` & `app/`: Only call service functions, do *not* access `prisma` directly.
*   **Rule:** Components should never import `prisma` directly. They should import functions from `lib/services`.

**Example:**
```typescript
// ❌ BAD: Component accessing DB directly
const users = await prisma.user.findMany();

// ✅ GOOD: Component calling a service
import { getUsers } from "@/lib/services/user-service";
const users = await getUsers();
```

### 2. Centralized Error Handling
**Goal:** Ensure consistent error responses and logging across the application.

*   **Pattern:** Wrap Server Actions in a standard error handler.
*   **Rule:** Service functions should throw typed errors. The calling layer (Server Action or API route) should catch them and format the response to the UI (e.g., using `toast` compatible messages).

### 3. Input Validation with Zod
**Goal:** Validate all incoming data before it touches the database.

*   **Tool:** `zod`
*   **Pattern:** Define schemas for all creation/update operations.
*   **Rule:** Validate arguments in the Service Layer before passing them to Prisma.

```typescript
// Example Zod schema
const UserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
});

export async function createUser(data: unknown) {
  const parsed = UserSchema.parse(data); // Auto-throws if invalid
  return await prisma.user.create({ data: parsed });
}
```

### 4. Type Safety with Prisma
**Goal:** Leverage Prisma's generated types on the frontend.

*   **Rule:** Do not manually redeclare interfaces that duplicate Prisma models. Import them from `@prisma/client` or infer them from service return types.

## Implementation Workflow

1.  **Define Model:** Update `schema.prisma` and run `npx prisma generate`.
2.  **Create/Update Service:** In `lib/services/`, write the function to handle the logic. Apply validation here.
3.  **Consume in UI:** In the React component, call the service function inside `useEffect` (for fetching) or an event handler (for mutations).

## Security Best Practices

*   **Sanitization:** Zod handles most sanitization automatically.
*   **Authorization:** Always check user roles/permissions at the top of every sensitive Service function.
