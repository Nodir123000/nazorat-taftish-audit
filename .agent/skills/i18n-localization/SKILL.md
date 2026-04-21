---
name: i18n-localization
description: Internationalization for АИС КРР — ru/uzLatn/uzCyrl locales, UZS currency, Uzbekistan date formats, legal term glossary
version: 1.0.0
triggers:
  - i18n
  - localization
  - перевод
  - locale
  - язык
  - русский
  - узбекский
  - uzLatn
  - uzCyrl
  - сум
  - UZS
  - дата форматирование
  - translation
related:
  - kru-code-standard
  - reference-data-architecture
  - kru-inspection-expert
---

# i18n Localization — АИС КРР

Three locales: Russian (`ru`), Uzbek Latin (`uzLatn`), Uzbek Cyrillic (`uzCyrl`).
Fallback chain: `uzLatn → ru → uzCyrl`

---

## Translation Key Convention

Format: `module.entity.property`

```
violations.illegal_expense.label     → "Незаконные расходы"
violations.illegal_expense.short     → "Незак. расходы"
violations.severity.CRITICAL         → "Критический"
decisions.status.overdue             → "Просрочено"
audits.status.in_progress            → "В процессе"
roles.chief_inspector                → "Главный инспектор"
common.save                          → "Сохранить"
```

### File structure:
```
public/locales/
  ru/common.json
  ru/violations.json
  ru/decisions.json
  ru/audits.json
  uzLatn/common.json
  uzLatn/violations.json
  uzCyrl/common.json
```

---

## Date Formatting

**Store:** ISO-8601 `YYYY-MM-DD` or `Date` object  
**Display:** formatted string in UI only — never in DB

```typescript
// lib/utils/date-format.ts
type Locale = 'ru' | 'uzLatn' | 'uzCyrl';

const MONTHS: Record<Locale, string[]> = {
  ru:      ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  uzLatn:  ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
  uzCyrl:  ['Январ','Феврал','Март','Апрел','Май','Июн','Июл','Август','Сентябр','Октябр','Ноябр','Декабр'],
};

export function formatDate(date: Date | string, locale: Locale = 'ru'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getDate().toString().padStart(2,'0')}.${(d.getMonth()+1).toString().padStart(2,'0')}.${d.getFullYear()}`;
}

export function formatMonthYear(date: Date | string, locale: Locale = 'ru'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`;
}

export function formatQuarter(date: Date | string, locale: Locale = 'ru'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const q = Math.ceil((d.getMonth() + 1) / 3);
  const roman = ['I','II','III','IV'][q - 1];
  if (locale === 'ru') return `${roman} квартал ${d.getFullYear()}`;
  return `${q}-chorak ${d.getFullYear()}`;
}
```

---

## Currency Formatting (UZS)

```typescript
// lib/utils/currency-format.ts
type Locale = 'ru' | 'uzLatn' | 'uzCyrl';

export function formatUZS(amount: number | string, locale: Locale = 'ru'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  const suffix = { ru: 'сум', uzLatn: "so'm", uzCyrl: 'сўм' }[locale];
  return `${formatted} ${suffix}`;
}

// formatUZS(1234567.89, 'ru')     → "1 234 567,89 сум"
// formatUZS(1234567.89, 'uzLatn') → "1 234 567,89 so'm"
// formatUZS(1234567.89, 'uzCyrl') → "1 234 567,89 сўм"

export function formatMillions(amount: number, locale: Locale = 'ru'): string {
  const suffix = { ru: 'млн сум', uzLatn: "mln so'm", uzCyrl: 'млн сўм' }[locale];
  return `${(amount / 1_000_000).toFixed(2)} ${suffix}`;
}
```

---

## PINFL / Passport Display

```typescript
// lib/utils/personal-data-format.ts
export function formatPinfl(pinfl: string, role: string): string {
  if (role === 'admin' || role === 'chief_inspector') {
    return pinfl.replace(/(\d{2})(\d{3})(\d{3})(\d{6})/, '$1 $2 $3 $4');
  }
  return pinfl.replace(/(\d{6})\d{6}(\d{2})/, '$1 ****** $2');
}

export function formatPassport(series: string, number: string, role: string): string {
  if (role === 'admin' || role === 'chief_inspector') return `${series} ${number}`;
  return `${series} *******`;
}
```

---

## Reference Data Localization

```typescript
// lib/utils/reference-localize.ts
type Locale = 'ru' | 'uzLatn' | 'uzCyrl';

const DIRECTION_NAMES: Record<string, Record<Locale, string>> = {
  FIN:  { ru: 'Финансово-хозяйственная деятельность', uzLatn: "Moliyaviy-xo'jalik faoliyati", uzCyrl: 'Молиявий-хўжалик фаолияти' },
  PROP: { ru: 'Имущественно-вещевое обеспечение', uzLatn: "Mulkiy-moddiy ta'minot", uzCyrl: 'Мулкий-моддий таъминот' },
  PROC: { ru: 'Закупочная деятельность', uzLatn: 'Xarid faoliyati', uzCyrl: 'Харид фаолияти' },
};

export function getDirectionName(code: string, locale: Locale): string {
  return DIRECTION_NAMES[code]?.[locale] ?? DIRECTION_NAMES[code]?.ru ?? code;
}
```

---

## Common Mistakes

```typescript
// ❌ WRONG: hardcoded text in service
return { label: 'Незаконные расходы' };

// ❌ WRONG: storing translated text in DB
prisma.violation.create({ data: { type_name: 'Незаконные расходы' } });

// ✅ CORRECT: store code, translate in UI
prisma.violation.create({ data: { type: 'illegal_expense' } });
// In component: t('violations.illegal_expense.label')

// ❌ WRONG: inline date
<span>{new Date(audit.start_date).toLocaleDateString()}</span>

// ✅ CORRECT
<span>{formatDate(audit.start_date, locale)}</span>
```

---

See `reference/locale-conventions.md` for full translation tables and `reference/uzb-legal-glossary.md` for Uzbek legal terms.
