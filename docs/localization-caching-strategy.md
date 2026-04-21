# Стратегия кэширования UI-переводов

Для обеспечения максимальной производительности (low-latency) при использовании динамических переводов, внедрена многоуровневая система кэширования:

## 1. Клиентский кэш (Browser/SWR)
- **Библиотека**: SWR (Vercel)
- **Конфигурация**: `dedupingInterval: 60000`, `revalidateOnFocus: false`.
- **Эффект**: Приложение запрашивает переводы не чаще одного раза в минуту или при явном обновлении. Переводы хранятся в памяти React-приложения.

## 2. HTTP Кэширование (Edge/CDN)
Для эндпоинта `GET /api/ui-translations` установлены заголовки:
`Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- **s-maxage**: CDN хранит копию 60 секунд.
- **SWR (Stale-While-Revalidate)**: Если кэш протух, CDN отдаст старое значение и фоново обновит его из БД.

## 3. Серверный кэш (Redis - опционально)
При росте нагрузки на БД Prisma, запросы в `route.ts` могут быть обернуты в Redis:
```typescript
const cached = await redis.get('translations:all');
if (!cached) {
  const data = await prisma.uIKey.findMany(...);
  await redis.set('translations:all', JSON.stringify(data), 'EX', 3600);
}
```

## 4. Инвалидация (Очистка кэша)
При выполнении `POST` (сохранение перевода) в админ-панели:
1. Выполняется `mutate()` в SWR для немедленного обновления у текущего админа.
2. (В будущем) Вызов Webhook для CDN (напр. Cloudflare Purge Cache) для сброса глобального кэша.

## 5. Fallback-стратегия
Если API недоступен:
1. Показывается ключ (напр. `dashboard.title`).
2. Используется `fallback` текст, переданный в функцию `ui(key, fallback)`.
3. Система пытается найти перевод на языке по умолчанию (RU), если текущий (UZ) отсутствует.
