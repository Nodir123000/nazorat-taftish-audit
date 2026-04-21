# Suggestions for Text Improvement: Nazorat-Taftish System

This document outlines suggested changes to the system's text (labels, descriptions, titles, and messages) to enhance professionalism, clarity, and alignment with Ministry of Defense (MoD) standards.

## 1. Core Module Terminology

| Current Text | Suggested Replacement | Context / Rationale |
| :--- | :--- | :--- |
| **Проведение ревизии** | **Контрольно-ревизионная деятельность** | Formal term from official documentation. |
| **KPI Сотрудников** | **Показатели эффективности (KPI)** | "Efficiency indicators" is more descriptive. |
| **Планирование КРР** | **Реестр планирования и учета КРМ** | KRM (Controlled Revision Measures) is the technical term. |
| **Реестр приказов** | **Реестр приказов и распоряжений** | Includes broader document types often found in the system. |

## 2. Dashboard & Navigation

| Key / Location | Current (RU) | Suggested (RU) | Rationale |
| :--- | :--- | :--- | :--- |
| `sidebar.audits` | Проведение ревизии | Контрольно-ревизионная работа | More comprehensive. |
| `dashboard.modules.planningDesc` | Годовое планирование... | Автоматизация и мониторинг годового планирования КРМ. | Higher impact. |
| `dashboard.modules.executionDesc` | Учёт и контроль... | Мониторинг хода и результатов контрольно-ревизионных мероприятий. | Precision. |

## 3. Audits & Results (Execution)

| Current Text | Suggested Replacement | Rationale |
| :--- | :--- | :--- |
| **Объект контроля** | **Подконтрольное подразделение** | Standard military/auditing term. |
| **Направление проверки** | **Отрасль (сфера) контроля** | "Field of control" is more accurate for Finance/Personnel/MTO. |
| **ID Акта** | **Регистрационный № акта** | Avoids technical jargon ("ID"). |
| **Акт подписан** | **Завершен (подписан акт)** | Status should reflect the process stage. |

## 4. Personnel & Specialized Labels

| Current Text | Suggested Replacement | Rationale |
| :--- | :--- | :--- |
| **Принять на службу** | **Назначить в распоряжение** | More specific to the KRU unit management. |
| **Уволить** (Button) | **Освободить от должности** | Professionally neutral terminology. |
| **Личный номер (ПНР)** | **Личный номер (ПНР/PIN)** | Clarifies to include digital identity. |

## 5. Violation Registries

| Section | Current | Suggested |
| :--- | :--- | :--- |
| **Недостачи** | **Учет и взыскание недостач** | Emphasizes the recovery process. |
| **Растраты и хищения** | **Факты хищений и незаконного использования** | More precise legal terminology. |
| **Переплаты** | **Излишние (сверхнормативные) выплаты** | Descriptive and clear. |

## 6. Uzbek Localization Refinement (Uz-Latn)

Localization should ensure that terminology is not just translated literally but adapted:

* Audit: `Taftish` or `Nazorat tadbiri`.
* Violation: `Qonunbuzarlik` (more formal) vs `Xatolik` (too weak).
* Order: `Buyruq`.
* District: `Harbiy okrug`.

---

> [!TIP]
> **Implementation Strategy:**
> For bulk updates, modify the `lib/i18n/translations.ts` file directly. For dynamic data labels (like inspection types), update the entsprechenden entries in the Prisma database seeds or reference tables.
