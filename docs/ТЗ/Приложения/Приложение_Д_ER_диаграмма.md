### Приложение Д. Структура таблиц базы данных (ER-модель)

В рамках расширения системы до 9 подсистем в базу данных добавлены следующие сущности:

1.  **unplanned_audits (ПС-3)**: Реестр проверок по запросам сторонних ведомств. Содержит ссылку на зашифрованный объект в S3 (`document_s3_key`).
2.  **kpi_metrics & user_kpi_scores (ПС-2)**: Справочник формул и реестр рассчитанных баллов эффективности инспекторов.
3.  **inspector_profiles (ПС-5)**: Расширение профиля пользователя (допуск, специализация, статистика).
4.  **inspector_rotations (ПС-5)**: Реляционная история перемещений сотрудников по подразделениям.
5.  **i18n_keys & i18n_values (ПС-9)**: Глобальная система переводов интерфейса.

Все операции с данными таблицами защищены механизмом **RLS (PostgreSQL)** и журналируются в зашифрованном виде.

---

## Визуальная ER-диаграмма (mermaid)

```mermaid
erDiagram
    users {
        uuid id PK
        string login UK
        string email
        string role
        uuid unit_id FK
        timestamp created_at
        boolean is_active
    }

    units {
        uuid id PK
        string name
        string code UK
        uuid region_id FK
        timestamp created_at
    }

    unplanned_audits {
        uuid id PK
        uuid unit_id FK
        string request_source
        date audit_date
        string status
        text description
        string document_s3_key
        uuid created_by FK
        timestamp created_at
    }

    kpi_metrics {
        uuid id PK
        string metric_name
        string formula
        numeric weight
        boolean is_active
        timestamp created_at
    }

    user_kpi_scores {
        uuid id PK
        uuid user_id FK
        uuid metric_id FK
        numeric score_value
        date scoring_period
        timestamp created_at
    }

    inspector_profiles {
        uuid id PK
        uuid user_id FK UK
        string specialization
        string clearance_level
        numeric experience_years
        jsonb additional_data
        timestamp created_at
    }

    inspector_rotations {
        uuid id PK
        uuid inspector_id FK
        uuid from_unit_id FK
        uuid to_unit_id FK
        date rotation_date
        string reason
        uuid approved_by FK
        timestamp created_at
    }

    i18n_keys {
        uuid id PK
        string key UK
        string description
        timestamp created_at
    }

    i18n_values {
        uuid id PK
        uuid i18n_key_id FK
        string locale
        string value
        timestamp updated_at
    }

    audit_log {
        uuid id PK
        uuid user_id FK
        string action
        string table_name
        jsonb old_values
        jsonb new_values
        string ip_address
        timestamp created_at
    }

    users ||--o{ unplanned_audits : "создает"
    units ||--o{ unplanned_audits : "объект проверки"
    users ||--o| inspector_profiles : "профиль инспектора"
    users ||--o{ inspector_rotations : "ротация"
    users ||--o{ user_kpi_scores : "оценка KPI"
    kpi_metrics ||--o{ user_kpi_scores : "метрика"
    users ||--o{ audit_log : "журналирует"
    i18n_keys ||--o{ i18n_values : "переводы"
    units ||--o{ inspector_rotations : "исходное подразделение"
    units ||--o{ inspector_rotations : "новое подразделение"
```

---

### Описание сущностей

| Сущность | ПС | Описание | Ключевые атрибуты |
|----------|----|----------|--------------------|
| `users` | ПС-8 | Пользователи системы | id (PK), login (UK), email, role, unit_id (FK) |
| `units` | ПС-5 | Подразделения (воинские части) | id (PK), name, code (UK), region_id |
| `unplanned_audits` | ПС-3 | Внеплановые проверки | id (PK), unit_id (FK), request_source, audit_date, status, document_s3_key |
| `kpi_metrics` | ПС-2 | Справочник KPI-формул | id (PK), metric_name, formula, weight |
| `user_kpi_scores` | ПС-2 | Оценки KPI инспекторов | id (PK), user_id (FK), metric_id (FK), score_value, scoring_period |
| `inspector_profiles` | ПС-5 | Профили инспекторов | id (PK), user_id (UK), specialization, clearance_level |
| `inspector_rotations` | ПС-5 | История ротаций | id (PK), inspector_id, from_unit_id, to_unit_id, rotation_date |
| `i18n_keys` | ПС-9 | Ключи переводов | id (PK), key (UK) |
| `i18n_values` | ПС-9 | Значения переводов | id (PK), i18n_key_id (FK), locale, value |
| `audit_log` | ПС-8 | Журнал аудита (SHA-256 chaining) | id (PK), user_id (FK), action, table_name, old_values, new_values |

### Правила RLS

Все таблицы защищены политиками Row-Level Security:
- Инспекторы видят только данные своих подразделений
- Руководители видят данные подчинённых инспекторов
- Администраторы имеют полный доступ
