# Antigravity Rules for Nazorat Taftish

## 1. Next.js App Router Best Practices
- **Server Components by Default:** All components are Server Components unless explicitly marked with `'use client'`. Use Client Components only for interactivity (`useState`, `useEffect`, event listeners).
- **Data Fetching:** Fetch data directly in Server Components using async/await. Do not use `useEffect` for initial data loading.
- **Layouts:** Use `layout.tsx` for shared UI (headers, sidebars) that persists across navigation.

## 2. Server Actions & Mutations
- **No API Routes for Mutations:** Use Server Actions (`'use server'`) for form submissions and data updates instead of creating `/api/...` endpoints.
- **Type Safety:** Ensure Server Actions accept and return strongly typed data.
- **Error Handling:** Wrap Server Actions in try/catch blocks and return standardized error objects (e.g., `{ success: false, message: string }`) to the client.
- **Revalidation:** Use `revalidatePath` or `revalidateTag` after successful mutations to update the UI cache.

## 3. Database Integration (Prisma)
- **Global Prisma Instance:** Always import the shared `prisma` instance from `lib/db/prisma.ts` (or similar) to prevent connection exhaustion during development.
- **Service Layer:** Do not call `prisma` directly in UI components. Encapsulate DB logic in `lib/services/`.
- **Type Safety:** Use Prisma-generated types (`Prisma.UserCreateInput`, etc.) instead of manually defining interfaces that mirror the DB schema.

## 4. TypeScript Strict Mode & Safety
- **Avoid `any`:** Do not use `any`. Use `unknown` if the type is truly uncertain, or define a proper interface.
- **Prop Validation:** Always define a type/interface for React Component props.
- **Null Handling:** Explicitly handle `null` and `undefined` cases, especially when dealing with database relations that might be missing.

## 5. UI & Styling (Tailwind CSS)
- **Utility First:** Use Tailwind utility classes directly in `className`.
- **Shadcn UI:** strictly follow the existing patterns when using Shadcn UI components.
- **Responsiveness:** Ensure all layouts work on mobile (`md:`, `lg:` prefixes).
