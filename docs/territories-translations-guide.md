# Инструкция по работе с переводами UI для модуля Territories

## ✅ Что уже сделано

1. **Создан JSON-файл** с переводами: `prisma/ui_translations_territories.json`
   - Содержит 40 ключей переводов
   - Покрывает все UI-элементы модуля Territories

2. **Создан скрипт импорта**: `prisma/import-ui-translations.ts`
   - Автоматически загружает переводы из JSON в базу данных
   - Обновляет существующие и создает новые записи

3. **Выполнен импорт в базу данных**
   - Создано: 2 новых перевода
   - Обновлено: 38 существующих переводов
   - Всего обработано: 40 переводов

## 📋 Структура переводов

Каждый перевод содержит:
- `key` - уникальный ключ (например, `ref.territories.title`)
- `ru` - текст на русском
- `uz_cyrl` - текст на узбекском (кириллица)
- `uz_latn` - текст на узбекском (латиница)
- `tags` - теги для группировки
- `description` - описание (опционально)

## 🔄 Как добавить новые переводы

### Вариант 1: Через JSON-файл

1. Откройте `prisma/ui_translations_territories.json`
2. Добавьте новую запись:
```json
{
  "key": "ref.territories.new_field",
  "ru": "Новое поле",
  "uz_cyrl": "Янги майдон",
  "uz_latn": "Yangi maydon",
  "tags": ["reference", "territories"]
}
```
3. Запустите импорт:
```bash
npx tsx prisma/import-ui-translations.ts
```

### Вариант 2: Через UI на http://localhost:3000/translation-management

1. Откройте страницу управления переводами
2. Добавьте новый перевод через интерфейс
3. Переводы автоматически сохранятся в таблицу `ui_translations`

## 💻 Как использовать переводы в коде

В компонентах Territories уже интегрирован хук `useUITranslations`:

```tsx
import { useUITranslations } from "@/lib/hooks/use-ui-translations"

export function MyComponent() {
  const { ui } = useUITranslations()
  
  return (
    <div>
      {ui("ref.territories.title", t("Административные единицы", "Ma'muriy birliklar", "Маъмурий бирликлар"))}
    </div>
  )
}
```

Функция `ui()` принимает:
- Первый параметр: ключ перевода
- Второй параметр: fallback-текст (через функцию `t`)

## 📊 Список всех ключей для Territories

### Основные
- `ref.territories.title` - Заголовок страницы
- `ref.territories.description` - Описание
- `ref.territories.search_placeholder` - Подсказка поиска

### Вкладки
- `ref.territories.tab_regions` - Вкладка "Области"
- `ref.territories.tab_districts` - Вкладка "Районы"

### Заголовки диалогов
- `ref.territories.create_region_title` - Создание области
- `ref.territories.edit_region_title` - Редактирование области
- `ref.territories.create_district_title` - Создание района
- `ref.territories.edit_district_title` - Редактирование района

### Поля форм
- `ref.territories.field.name` - Наименование
- `ref.territories.field.ru` - На русском
- `ref.territories.field.uz_latn` - O'zbekcha (Lotin)
- `ref.territories.field.uz_cyrl` - Ўзбекча (Кирилл)
- `ref.territories.field.type` - Тип
- `ref.territories.field.status` - Статус
- `ref.territories.field.region` - Область
- `ref.territories.field.link` - Привязка
- `ref.territories.field.params` - Параметры

### Типы территорий
- `ref.territories.type.region` - Область
- `ref.territories.type.republic` - Республика
- `ref.territories.type.city` - Город
- `ref.territories.type.district` - Район

### Статусы
- `ref.territories.status.active` - Активен
- `ref.territories.status.inactive` - Неактивен

### Подсказки
- `ref.territories.placeholder.name` - Введите название...
- `ref.territories.placeholder.select_region` - Выберите область...
- `ref.territories.placeholder.search_region` - Поиск области...
- `ref.territories.not_found_region` - Область не найдена

### Кнопки
- `ref.territories.add_region` - Добавить область
- `ref.territories.add_district` - Добавить район

### Общие ключи
- `common.save` - Сохранить
- `common.cancel` - Отмена
- `common.loading` - Загрузка...
- `common.nothing_found` - Ничего не найдено
- `common.actions` - Действия
- `common.manage` - Управление
- `common.edit` - Редактировать
- `common.delete` - Удалить
- `common.unit_short` - ед.
- `common.fill_form` - Заполните форму ниже

## 🔍 Проверка переводов

Чтобы убедиться, что переводы работают:

1. Откройте http://localhost:3000/reference/territories
2. Переключите язык в интерфейсе
3. Все тексты должны меняться в соответствии с выбранным языком

## 📝 Примечания

- Все переводы хранятся в таблице `ui_translations` в формате JSON
- Поле `name` содержит объект с ключами `ru`, `uz_latn`, `uz_cyrl`
- Функция `ui()` автоматически выбирает нужный язык на основе текущей локали пользователя
- Если перевод не найден, используется fallback-текст из функции `t()`
