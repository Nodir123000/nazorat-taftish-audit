# 🚀 Прогресс интеграции справочников для Territories

## ✅ Что уже сделано

### 1. База данных
- ✅ Создана таблица `ref_territory_types` (типы территорий)
- ✅ Создана таблица `ref_statuses` (статусы)
- ✅ Заполнены данными (City, District, Region, Republic, Active, Inactive)
- ✅ Добавлены модели в `schema.prisma`

### 2. Типы TypeScript
- ✅ Добавлен интерфейс `ReferenceData`
- ✅ Обновлены `Region` и `District` с полями `typeData` и `statusData`

### 3. API
- ✅ Создан эндпоинт `/api/reference/territory-references`
- ✅ Возвращает справочники типов и статусов

### 4. Хуки
- ✅ Создан `useTerritoryReferences` для загрузки справочников
- ✅ Обновлен `useTerritories` для обогащения данных

## ⏳ Что нужно сделать

### Шаг 1: Сгенерировать Prisma клиент

```bash
npx prisma generate
```

**Проблема:** Сейчас Prisma не знает о новых моделях `RefTerritoryType` и `RefStatus`.  
**Решение:** После генерации клиента ошибки в API исчезнут.

### Шаг 2: Обновить компоненты для использования справочников

#### DistrictRow.tsx

**Было:**
```tsx
{item.type === "City" ? ui("ref.territories.type.city") : ui("ref.territories.type.district")}
{item.status === 'active' ? ui("ref.territories.status.active") : ui("ref.territories.status.inactive")}
```

**Должно быть:**
```tsx
{item.typeData ? getLocalizedName(item.typeData.name) : item.type}
{item.statusData ? getLocalizedName(item.statusData.name) : item.status}
```

#### RegionRow.tsx

**Было:**
```tsx
{item.type === "City" ? ui("ref.territories.type.city") :
    item.type === "Republic" ? ui("ref.territories.type.republic") :
        ui("ref.territories.type.region")}
{item.status === 'active' ? ui("ref.territories.status.active") : ui("ref.territories.status.inactive")}
```

**Должно быть:**
```tsx
{item.typeData ? getLocalizedName(item.typeData.name) : item.type}
{item.statusData ? getLocalizedName(item.statusData.name) : item.status}
```

#### Формы (RegionForm.tsx, DistrictForm.tsx)

В формах нужно загружать справочники и использовать их в Select:

```tsx
import { useTerritoryReferences } from "../../hooks/useTerritoryReferences"

export function RegionForm({ ... }) {
  const { references } = useTerritoryReferences()
  
  return (
    <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {references.types
          .filter(t => ['region', 'republic', 'city'].includes(t.code))
          .map(type => (
            <SelectItem key={type.code} value={type.code}>
              {getLocalizedName(type.name)}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
```

### Шаг 3: Удалить лишние ключи из ui_translations

После обновления компонентов удалить:
- `ref.territories.type.city`
- `ref.territories.type.district`
- `ref.territories.type.region`
- `ref.territories.type.republic`
- `ref.territories.status.active`
- `ref.territories.status.inactive`

```sql
DELETE FROM ui_translations 
WHERE key LIKE 'ref.territories.type.%' 
   OR key LIKE 'ref.territories.status.%';
```

## 📋 Список файлов для обновления

- [ ] `components/reference/territories/components/DistrictRow.tsx`
- [ ] `components/reference/territories/components/RegionRow.tsx`
- [ ] `components/reference/territories/components/forms/DistrictForm.tsx`
- [ ] `components/reference/territories/components/forms/RegionForm.tsx`

## 🎯 Ожидаемый результат

После всех изменений:

1. **Типы и статусы** будут браться из БД (`ref_territory_types`, `ref_statuses`)
2. **UI-тексты** (заголовки, кнопки) останутся в `ui_translations`
3. **Переводы** будут работать через `getLocalizedName()` для данных и `ui()` для UI
4. **Централизованное управление** справочниками через БД

## 🔧 Команды для выполнения

```bash
# 1. Сгенерировать Prisma клиент
npx prisma generate

# 2. Проверить, что таблицы созданы
npx prisma studio

# 3. Запустить приложение
npm run dev

# 4. Проверить API
curl http://localhost:3000/api/reference/territory-references
```

## 📝 Примечания

- Поля `typeData` и `statusData` опциональные (`?`), чтобы не сломать существующий код
- Fallback на `item.type` и `item.status` если справочные данные не загружены
- Справочники кэшируются в хуке `useTerritoryReferences`

---

**Статус:** 🟡 В процессе (60% готово)  
**Следующий шаг:** Сгенерировать Prisma клиент
