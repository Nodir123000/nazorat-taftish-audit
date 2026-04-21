# Матрица прав доступа RBAC — АИС КРР

## Роли

| Роль | Код | Описание |
| :--- | :--- | :--- |
| Администратор | `admin` | Полный доступ ко всем функциям |
| Главный инспектор | `chief_inspector` | Управление планами, просмотр всего |
| Инспектор | `inspector` | Работа в рамках своих ревизий |
| Наблюдатель | `viewer` | Только чтение |

---

## Доступ по модулям

### ПС-01: Аутентификация
| Действие | admin | chief_inspector | inspector | viewer |
| :--- | :---: | :---: | :---: | :---: |
| Вход в систему | ✅ | ✅ | ✅ | ✅ |
| Управление пользователями | ✅ | ❌ | ❌ | ❌ |
| Сброс пароля | ✅ | ❌ | ❌ | ❌ |

### ПС-02: Планирование
| Действие | admin | chief_inspector | inspector | viewer |
| :--- | :---: | :---: | :---: | :---: |
| Создание годового плана | ✅ | ✅ | ❌ | ❌ |
| Утверждение плана | ✅ | ✅ | ❌ | ❌ |
| Просмотр плана | ✅ | ✅ | ✅ | ✅ |
| Создание приказа | ✅ | ✅ | ❌ | ❌ |

### ПС-03: Ревизии
| Действие | admin | chief_inspector | inspector | viewer |
| :--- | :---: | :---: | :---: | :---: |
| Создание ревизии | ✅ | ✅ | ✅ | ❌ |
| Добавление нарушений | ✅ | ✅ | Только свои | ❌ |
| Завершение ревизии | ✅ | ✅ | ❌ | ❌ |
| Просмотр ревизии | ✅ | ✅ | ✅ | ✅ |

### ПС-04: Нарушения
| Действие | admin | chief_inspector | inspector | viewer |
| :--- | :---: | :---: | :---: | :---: |
| Создание нарушения | ✅ | ✅ | Только свои | ❌ |
| Редактирование нарушения | ✅ | ✅ | Только свои | ❌ |
| Удаление нарушения | ✅ | ❌ | ❌ | ❌ |

### ПС-07: Персонал
| Действие | admin | chief_inspector | inspector | viewer |
| :--- | :---: | :---: | :---: | :---: |
| Просмотр ФИО, звания | ✅ | ✅ | ✅ | ✅ |
| Просмотр ПИНФЛ | ✅ | ✅ | ❌ | ❌ |
| Просмотр паспортных данных | ✅ | ✅ | ❌ | ❌ |
| Создание записи | ✅ | ❌ | ❌ | ❌ |

---

## Правила в коде

```typescript
// Проверка доступа к ПИНФЛ
function canViewPinfl(role: UserRole): boolean {
  return role === 'admin' || role === 'chief_inspector'
}

// Проверка права на создание нарушения
function canCreateViolation(role: UserRole, auditLeadId: number, userId: number): boolean {
  if (role === 'admin' || role === 'chief_inspector') return true
  if (role === 'inspector' && auditLeadId === userId) return true
  return false
}
```

---

## Коды ролей в middleware

```typescript
// middleware.ts — защита маршрутов
const PROTECTED_ROUTES = {
  '/admin': ['admin'],
  '/planning/annual': ['admin', 'chief_inspector'],
  '/audits': ['admin', 'chief_inspector', 'inspector'],
  '/reports': ['admin', 'chief_inspector', 'viewer'],
}
```
