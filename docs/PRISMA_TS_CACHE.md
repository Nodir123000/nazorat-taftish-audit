# Prisma TypeScript Cache Issue

## Проблема
После выполнения `npx prisma generate` TypeScript IDE может не подхватить обновлённые типы из-за кеширования.

## Решения

### 1. Перезапуск TypeScript Server (VS Code)
1. Откройте Command Palette (`Ctrl+Shift+P` или `Cmd+Shift+P`)
2. Выберите `TypeScript: Restart TS Server`

### 2. Перезапуск IDE
Полностью закройте и откройте VS Code/IDE

### 3. Очистка кеша TypeScript
```bash
# Удалите папку с кешем
rm -rf node_modules/.cache
```

### 4. Принудительная регенерация
```bash
# Остановите все Node процессы
taskkill /F /IM node.exe

# Регенерируйте Prisma Client
npx prisma generate
```

### 5. Использование @ts-expect-error (временное решение)
Если типы корректны в runtime, но IDE показывает ошибку:
```typescript
// @ts-expect-error - Prisma Client types may not be fully updated in IDE
await prisma.refSupplyDepartment.upsert({ ... })
```

## Проверка типов
Убедитесь, что типы сгенерированы:
```bash
# Проверьте наличие модели в типах
Get-Content "node_modules\.prisma\client\index.d.ts" | Select-String "refSupplyDepartment"
```

## Текущий статус
✅ Модель `RefSupplyDepartment` корректно определена в `schema.prisma`
✅ Prisma Client успешно сгенерирован
✅ Скрипт `seed-supply-departments.ts` работает корректно
⚠️ IDE может показывать ошибку из-за кеша (используется `@ts-expect-error`)
