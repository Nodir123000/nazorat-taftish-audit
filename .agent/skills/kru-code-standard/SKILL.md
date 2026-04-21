---
name: kru-code-standard
description: Специфические стандарты написания кода для проекта АИС КРР. Включает паттерны для Next.js App Router, Prisma, UI-компонентов и обработки данных. Используй этот скилл для написания backend и frontend кода системы.
version: 1.1.0
triggers:
  - код
  - code
  - компонент
  - component
  - fetch
  - useSWR
  - Server Component
  - Server Action
  - Prisma
  - service layer
  - UniversalRegistry
  - Shadcn
  - стандарт
related:
  - nodejs-backend-patterns
  - security-guardian
  - code-quality-watchdog
  - reference-data-architecture
---

# Стандарт разработки АИС КРР (Antigravity Code Standard)

Этот навык содержит строгие правила и паттерны, которые мы выработали в ходе разработки системы. Следуй им при написании любого программного кода.

## 1. Backend & БД (Prisma)

### Правило "Sequential Fetch" (Критически важно!)
Из-за сложности схемы и возможных проблем с вложенными include, **никогда не используй глубокие вложения (более 2 уровней)**.
*   **Плохо:** `include: { orders: { include: { commission_members: { include: { personnel: true } } } } }`
*   **Хорошо:** Получи сначала `orders`, затем плоским списком `commission_members`, затем смапь их в коде. Это гарантирует отсутствие 500 ошибок Prisma.

### Слой сервисов (`lib/services/`)
Все взаимодействие с БД — только в сервисах. Компоненты никогда не импортируют `prisma`.
*   Имя файла: `audit-service.ts`, `violations-service.ts`.
*   Возвращаемый тип: Всегда возвращай чистые DTO (Data Transfer Objects), готовые для фронтенда.

---

## 2. Frontend (React / Next.js)

### Выполнение запросов
Используй кастомные хуки в `lib/hooks/` (напр. `use-audits.ts`), которые обращаются к API маршрутам.
*   Не делай `fetch` напрямую в компоненте.
*   Используй `useQuery` или встроенные обертки проекта.

### Архитектура компонентов
*   Разделяй логику и представление.
*   `Client-side` компоненты используй только там, где нужна интерактивность (формы, диалоги).
*   Для таблиц используй `UniversalRegistry` компонент — это наш внутренний стандарт.

### UI и Стили (Shadcn UI)
Мы используем Tailwind + Shadcn UI.
*   Цветовая схема: Преимущественно `slate` (серый) и `blue-900` (темно-синий, цвет МО).
*   Статусы нарушений должны быть раскрашены согласно `kru-inspection-expert/reference/violations-categories.md`.

---

## 3. Обработка данных

### Валидация (Zod)
Всегда валидируй входящие данные в API маршрутах через `zod`.
**Пример:**
```typescript
const AuditCreateSchema = z.object({
  unit_id: z.number(),
  start_date: z.string().datetime(),
  // ...
});
```

### Форматирование (Utility)
Используй общие утилиты для форматирования сумм (сумы) и дат (Узбекистан).
```typescript
// Формат: 1 250 000.00 сум
export const formatCurrency = (val: number) => { ... }
```

---

## 4. Безопасность

- **RBAC**: Проверяй роль пользователя через `getCurrentUser()` в начале каждого API маршрута.
- **ПИНФЛ**: На фронтенде маскируй ПИНФЛ (заменяй цифры на `*`), если пользователь не имеет роли `admin` или `chief_inspector`.
- **Логирование**: Каждое изменение данных должно сопровождаться записью в `audit_log`.
