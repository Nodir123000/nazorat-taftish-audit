# Краткий справочник схемы БД — АИС КРР

## Ключевые таблицы и их связи

### Ядро системы

```
users                           - Пользователи (логин/пароль/роль)
  ├── personnel                 - Детальный профиль сотрудника (ФИО, ПИНФЛ, паспорт)
  └── audit_log                 - Журнал всех действий

ref_units                       - Воинские части/подразделения
  └── ref_military_districts    - Военные округа (région)
```

### Планирование

```
rev_plan_year                   - Годовой план ревизий
  ├── ref_units                 - Объект проверки
  ├── ref_control_authorities   - Орган контроля
  ├── ref_control_directions    - Направление контроля
  └── orders                   - Приказы о проведении ревизий
        └── commission_members  - Члены комиссии
              ├── users         - Пользователь (инспектор)
              └── personnel     - Сотрудник (привлекаемый специалист)
```

### Ревизии и нарушения

```
audits                          - Ревизии
  ├── monthly_plans             - Привязка к месячному плану
  ├── orders                   - Привязка к приказу
  ├── ref_units                 - Проверяемое подразделение
  ├── violations               - Нарушения в рамках ревизии
  │     ├── decisions          - Решения по нарушениям
  │     └── findings           - Замечания (findings)
  └── audit_reports            - Итоговые акты ревизии
```

### Справочники

```
ref_ranks                       - Воинские звания
ref_positions                   - Должности  
ref_vus_list                    - ВУС (военно-учётные специальности)
ref_control_directions          - Направления контроля
ref_control_authorities         - Органы контроля
ref_inspection_types            - Виды проверок
```

---

## Важные поля и их типы

| Таблица | Поле | Тип | Заметка |
| :--- | :--- | :--- | :--- |
| `personnel` | `pinfl` | String(14) | Только admin/chief_inspector |
| `violations` | `amount` | Decimal(18,2) | В узбекских сумах |
| `violations` | `recovered` | Decimal(18,2) | Возмещено |
| `decisions` | `deadline` | Date | Срок исполнения |
| `decisions` | `status` | String | planned/in_progress/completed/overdue |
| `orders` | `order_date` | Date | Дата приказа |
| `rev_plan_year` | `year` | Int | Год плана |

---

## Часто используемые Prisma запросы (проверенные)

### Получить назначения инспектора
```typescript
// commission_members не имеет глубокого вложения — использовать sequential fetch!
const memberships = await prisma.commission_members.findMany({
  where: { OR: [{ user_id: userId }, { personnel_id: personnelId }] }
})
// Затем отдельно:
const orders = await prisma.orders.findMany({
  where: { id: { in: memberships.map(m => m.order_id) } },
  include: { rev_plan_year: true }
})
```

### Получить нарушения с суммой по подразделению
```typescript
const violations = await prisma.violations.findMany({
  where: { audits: { unit_id: unitId } },
  select: { 
    id: true, 
    amount: true, 
    recovered: true,
    violation_type: true,
    status: true 
  }
})
```

### Получить просроченные решения
```typescript
const overdue = await prisma.decisions.findMany({
  where: {
    deadline: { lt: new Date() },
    status: { notIn: ['completed', 'cancelled'] }
  },
  include: { violations: { include: { audits: true } } }
})
```
