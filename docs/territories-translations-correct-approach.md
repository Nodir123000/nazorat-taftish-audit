# Правильный подход к переводам в модуле Territories

## ❌ Неправильно (было)

```tsx
// Типы и статусы из ui_translations (фронтенд)
{item.type === "City" ? ui("ref.territories.type.city") : ui("ref.territories.type.district")}
{item.status === 'active' ? ui("ref.territories.status.active") : ui("ref.territories.status.inactive")}
```

## ✅ Правильно (должно быть)

### 1. Данные из БД (бэкенд) - используем `getLocalizedName()`

```tsx
// Названия территорий
{getLocalizedName(item.name)}
{getLocalizedName(item.region)}

// Типы территорий (из справочника ref_territory_types)
{getLocalizedName(item.typeData.name)}

// Статусы (из справочника ref_statuses)
{getLocalizedName(item.statusData.name)}
```

### 2. UI-тексты (фронтенд) - используем `ui()`

```tsx
// Заголовки, метки, кнопки
{ui("ref.territories.title")}
{ui("ref.territories.field.name")}
{ui("common.save")}
{ui("common.edit")}
```

## 📊 Структура данных

### Справочник типов территорий (`ref_territory_types`)

```sql
CREATE TABLE ref_territory_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name JSONB NOT NULL, -- {"ru": "Город", "uz_latn": "Shahar", "uz_cyrl": "Шаҳар"}
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Данные:**
| code | name |
|------|------|
| `region` | `{"ru": "Область", "uz_latn": "Viloyat", "uz_cyrl": "Вилоят"}` |
| `republic` | `{"ru": "Республика", "uz_latn": "Respublika", "uz_cyrl": "Республика"}` |
| `city` | `{"ru": "Город", "uz_latn": "Shahar", "uz_cyrl": "Шаҳар"}` |
| `district` | `{"ru": "Район", "uz_latn": "Tuman", "uz_cyrl": "Туман"}` |

### Справочник статусов (`ref_statuses`)

```sql
CREATE TABLE ref_statuses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name JSONB NOT NULL, -- {"ru": "Активен", "uz_latn": "Faol", "uz_cyrl": "Актив"}
  category VARCHAR(50), -- 'general', 'territory', etc.
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Данные:**
| code | name | category |
|------|------|----------|
| `active` | `{"ru": "Активен", "uz_latn": "Faol", "uz_cyrl": "Актив"}` | `general` |
| `inactive` | `{"ru": "Неактивен", "uz_latn": "Faol emas", "uz_cyrl": "Фаол эмас"}` | `general` |

## 🔄 Как должен работать бэкенд

### API эндпоинт `/api/territories`

```typescript
// Старый подход (неправильно)
{
  id: 1,
  name: {...},
  type: "City",  // ❌ просто строка
  status: "active"  // ❌ просто строка
}

// Новый подход (правильно)
{
  id: 1,
  name: {...},
  type: "city",  // код типа
  typeData: {  // ✅ полные данные типа
    code: "city",
    name: {
      ru: "Город",
      uz_latn: "Shahar",
      uz_cyrl: "Шаҳар"
    }
  },
  status: "active",  // код статуса
  statusData: {  // ✅ полные данные статуса
    code: "active",
    name: {
      ru: "Активен",
      uz_latn: "Faol",
      uz_cyrl: "Актив"
    }
  }
}
```

### Пример запроса с JOIN

```sql
SELECT 
  a.id,
  a.name,
  a.type,
  tt.name as type_data,
  a.status,
  s.name as status_data,
  r.name as region_data
FROM ref_areas a
LEFT JOIN ref_territory_types tt ON tt.code = a.type
LEFT JOIN ref_statuses s ON s.code = a.status
LEFT JOIN ref_regions r ON r.id = a.region_id
WHERE a.status = 'active';
```

## 🎯 Итоговое разделение

### Данные из БД (бэкенд)
- ✅ Названия территорий
- ✅ Типы территорий
- ✅ Статусы
- ✅ Любые справочные данные

### UI-тексты (фронтенд)
- ✅ Заголовки страниц
- ✅ Метки полей форм
- ✅ Кнопки
- ✅ Подсказки
- ✅ Сообщения об ошибках

## 📝 Следующие шаги

1. ✅ Создать таблицы `ref_territory_types` и `ref_statuses`
2. ✅ Заполнить их данными
3. ⏳ Обновить API для возврата полных данных типов и статусов
4. ⏳ Обновить фронтенд для использования `getLocalizedName()` вместо `ui()`
5. ⏳ Удалить ключи типов и статусов из `ui_translations`
