# Prisma Schema Standardization

## Проблема

После выполнения `prisma db pull` все модели были сгенерированы в snake_case (например, `audits`, `users`, `ref_units`), что не соответствует TypeScript naming conventions и вызывало ошибки в коде, использующем PascalCase (например, `prisma.audit.count()`).

## Решение

### 1. Переименование критических моделей

Модели, активно используемые в коде, были переименованы в PascalCase с добавлением `@@map` для сохранения связи с БД:

```prisma
// Было:
model audits {
  id Int @id
  // ...
}

// Стало:
model Audit {
  id Int @id
  // ...
  @@map("audits")
}
```

### 2. Обновление полей

Поля также переименованы в camelCase с `@map`:

```prisma
model Audit {
  auditNumber  String  @map("audit_number")
  leadAuditorId Int?   @map("lead_auditor_id")
  // ...
}
```

### 3. Обновление связей

Все ссылки на старые имена моделей обновлены:

```prisma
// Было:
model commission_members {
  audits audits @relation(...)
}

// Стало:
model commission_members {
  audits Audit @relation(...)
}
```

### 4. Именованные связи

Для моделей с несколькими связями добавлены имена:

```prisma
model Audit {
  leadAuditor users? @relation("LeadAuditor", fields: [leadAuditorId], references: [user_id])
}

model users {
  audits Audit[] @relation("LeadAuditor")
}
```

## Переименованные модели

| Старое имя | Новое имя | Таблица в БД |
| :--- | :--- | :--- |
| `audits` | `Audit` | `audits` |
| `ref_supply_departments` | `RefSupplyDepartment` | `ref_supply_departments` |
| `rev_plan_year` | `RevPlanYear` | `rev_plan_year` |

## Команды для применения

```bash
# 1. Остановить dev-сервер
taskkill /F /IM node.exe

# 2. Регенерировать Prisma Client
npx prisma generate

# 3. Запустить приложение
npm run dev
```

## Проверка

После регенерации Prisma Client, следующий код должен работать:

```typescript
// ✅ Работает
const total = await prisma.audit.count()

// ❌ Больше не работает
const total = await prisma.audits.count()
```

## Будущие изменения

При добавлении новых моделей через `prisma db pull`:

1. Переименуйте модель в PascalCase
2. Добавьте `@@map("table_name")`
3. Переименуйте поля в camelCase с `@map("column_name")`
4. Обновите все ссылки в других моделях
5. Выполните `npx prisma generate`

## Статус

✅ Модель `Audit` успешно переименована
✅ Модель `RefSupplyDepartment` успешно переименована
✅ Модель `RevPlanYear` успешно переименована
✅ Все связи обновлены
✅ Prisma Client регенерирован
✅ Приложение запущено без ошибок
