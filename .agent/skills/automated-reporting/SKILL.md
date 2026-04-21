---
name: automated-reporting
description: Генерация официальных отчётов и документов КРУ МО РУз в формате Excel. Используй этот скилл когда пользователь просит сформировать акт ревизии, реестр нарушений, отчёт по КПЭ или любой экспорт данных в XLSX формат.
version: 1.1.0
triggers:
  - отчёт
  - report
  - Excel
  - XLSX
  - экспорт
  - export
  - реестр нарушений
  - КПЭ
  - KPI
  - акт ревизии
  - compliance report
related:
  - kru-inspection-expert
  - i18n-localization
  - kru-code-standard
---

# Скилл: Автоматическая генерация отчётов (Excel)

## Назначение

Этот навык обеспечивает формирование официальных документов КРУ МО в формате Excel (`.xlsx`) с использованием исполняемых скриптов Node.js. Все шаблоны находятся в папке `templates/`, скрипты в `scripts/`.

## Доступные отчёты

### 1. Акт ревизии
**Скрипт:** `scripts/generate-audit-report.js`
**Параметры:** `auditId` (ID ревизии)
**Выходной файл:** `audit_report_{auditId}_{date}.xlsx`

**Как запустить:**
```bash
node .agent/skills/automated-reporting/scripts/generate-audit-report.js --auditId=123
```

### 2. Реестр нарушений
**Скрипт:** `scripts/generate-violations-registry.js`
**Параметры:** `unitId` (подразделение), `year`, `month` (опционально)
**Выходной файл:** `violations_registry_{unitId}_{year}.xlsx`

**Как запустить:**
```bash
node .agent/skills/automated-reporting/scripts/generate-violations-registry.js --unitId=5 --year=2026
```

### 3. КПЭ Инспекторов
**Скрипт:** `scripts/generate-kpi-report.js`
**Параметры:** `year`, `quarter` (1-4, опционально)
**Выходной файл:** `kpi_report_{year}_Q{quarter}.xlsx`

### 4. Сводный отчёт для руководства
**Скрипт:** `scripts/generate-summary-report.js`
**Параметры:** `year`, `period` (`annual|quarterly|monthly`)

---

## Алгоритм работы

1. **Получить данные**: Выполнить запрос к БД через Prisma (использовать паттерны из скилла `kru-inspection-expert`).
2. **Запустить скрипт**: Вызвать нужный скрипт через `run_command`.
3. **Проверить результат**: Убедиться, что файл создан в директории `public/reports/` или `tmp/`.
4. **Сообщить пользователю**: Дать ссылку на скачивание файла.

---

## Стандарт форматирования Excel

- **Шрифт**: Times New Roman, 12pt
- **Заголовки**: Жирный, 14pt, по центру, цвет фона `#1E3A5F` (тёмно-синий), белый текст
- **Строки данных**: Чередование белый/светло-серый (`#F5F5F5`)
- **Итоговые строки**: Жирный, цвет фона `#E8F0FE`
- **Суммы**: Формат числа `# ##0.00 "сум"` (пример: `1 250 000.00 сум`)
- **Даты**: Формат `ДД.ММ.ГГГГ`
- **Шапка документа**: Логотип МО (если есть), название документа, дата формирования, подпись

---

## Зависимости (уже установлены в проекте)

- `exceljs` — основная библиотека для создания XLSX
- `@prisma/client` — доступ к данным БД

---

## Справочник шаблонов

**Папка:** `.agent/skills/automated-reporting/templates/`
- `audit-report-template.json` — структура листов акта ревизии
- `violations-registry-template.json` — структура реестра нарушений
- `kpi-template.json` — структура КПЭ-отчёта
