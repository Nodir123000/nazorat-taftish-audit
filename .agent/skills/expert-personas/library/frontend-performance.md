# Frontend Performance & Optimization Patterns

## React Advanced Hook Patterns

### 1. Store Event Handlers in Refs

Use `useRef` to store callbacks that are used in `useEffect` but shouldn't trigger re-subscriptions.
**Why:** Prevents re-subscribing on every render if the handler is regenerated.
**Example:**

```tsx
const handlerRef = useRef(handler);
useEffect(() => { handlerRef.current = handler; });
useEffect(() => {
  const listener = (e) => handlerRef.current(e);
  window.addEventListener('event', listener);
  return () => window.removeEventListener('event', listener);
}, []); // Empty dependency array = stable subscription
```

### 2. useLatest for Stable Callback Refs

Access the latest value inside a callback/effect without adding it to the dependency array.
**Why:** Avoids stale closures while keeping dependencies minimal.

## Bundle Optimization

### 1. Avoid Barrel File Imports

Import directly from source files instead of barrel files (`index.ts`).
**Why:** Prevent loading unused modules and maximize tree-shaking.
**Bad:** `import { Button } from '@/components'` (loads all components).
**Good:** `import { Button } from '@/components/Button'`.

### 2. Conditional Module Loading

Lazy load heavy modules only when needed (e.g., on click or visibility).
**Example:** `const module = await import('./heavy-lib')` inside an event handler.

### 3. Defer Non-Critical Third-Party Libraries

Load analytics, chat widgets, etc., after hydration or on interaction using `next/script` (`strategy="lazyOnload"`).

## React Performance (Re-renders)

### 1. Defer State Reads to Usage Point

Don't read context/searchParams in a parent component just to pass it down if only a child needs it. Push the hook usage down.

### 2. Narrow Effect Dependencies

Use primitives (`id`) instead of objects (`user`) in dependency arrays.
**Bad:** `useEffect(..., [user])` (runs on any user field change).
**Good:** `useEffect(..., [user.id])`.

### 3. Subscribe to Derived State

If a component only needs a boolean derived from a frequent update (e.g., scroll position), calculate it inside the hook/store selector, not in the component render body.
**Example:** `useWindowWidth() > 768` -> `useIsMobile()`.

## JavaScript Optimization

### 1. Batch DOM CSS Changes

Group CSS writes (e.g., via classes) to avoid layout thrashing (Reflow).

### 2. Cache Repeated Function Calls & Property Access

Avoid repeated property lookups in loops. Extract to a variable.

### 3. Use Set/Map for O(1) Lookups

Replace `array.includes()` in loops with `Set.has()`.

## API Routes & Async Patterns

### 1. Prevent Waterfall Chains

Start independent async operations immediately using `Promise.all` or parallel execution.

### 2. Defer Await Until Needed

Don't await a promise at the top of a function if the result is only needed later. Let it run in parallel with other logic.
