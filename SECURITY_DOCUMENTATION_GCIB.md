# Техническая документация по информационной безопасности системы «Nazorat-Taftish»
## Для предоставления в ГЦОИБ Республики Узбекистан

### 1. Архитектурная концепция
Система «Nazorat-Taftish» спроектирована с учетом требований ЗРУ-547 «О персональных данных» и ПКМ №702. Основной задачей является обеспечение конфиденциальности, целостности и доступности данных реестра личного состава.

---

### 2. Схема информационных потоков (Data Flow Diagram - DFD)

```mermaid
graph TB
    subgraph External_Zone ["Внешний контур (Интернет)"]
        User(("Пользователь / Инспектор"))
        Browser["Frontend Application (React/Next.js)"]
    end

    subgraph DMZ_Zone ["Сегмент приложений (DMZ / Middleware)"]
        API_Handler["Next.js API Handler (/api/personnel)"]
        Validation["Слой валидации (Zod / TS)"]
        Transformation["Слой трансформации данных (DTO)"]
    end

    subgraph Internal_Zone ["Внутренний (Защищённый) контур"]
        ORM["Prisma ORM Layer"]
        DB[("PostgreSQL Database (Encrypted)")]
        LogServ["DiagnosticsService (Logging)"]
    end

    %% Flow
    User --> Browser
    Browser -- "HTTPS TLS 1.3 / JSON JWT" --> API_Handler
    API_Handler --> Validation
    Validation --> ORM
    ORM -- "Encrypted TCP/IP" --> DB
    DB --> ORM
    ORM --> Transformation
    Transformation --> Browser
    API_Handler -.-> LogServ

    %% Styles
    style External_Zone fill:#f9f9f9,stroke:#333,stroke-dasharray: 5 5
    style DMZ_Zone fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Internal_Zone fill:#e8f5e9,stroke:#2e7d32,stroke-width:3px
```

#### Описание DFD
Архитектура системы построена на **принципе эшелонированной защиты (Defense in Depth)**. Ключевым элементом является **изоляция уровней**: внешнее окружение не имеет прямого доступа к базе данных. Все запросы проходят через слой API и валидацию. Реализация концепции **Privacy by Design** гарантирует, что персональные данные обрабатываются только в объеме, необходимом для конкретной задачи. Использование **параметризации запросов (ORM)** исключает SQL-инъекции. Данная модель полностью соответствует Статьям 27 и 28 ЗРУ-547.

---

### 3. Схема управления доступом (RBAC)

```mermaid
graph LR
    Request(["Входящий запрос"]) --> AuthMiddleware{"Auth Middleware"}
    
    AuthMiddleware -- "401 Unauthorized" --> Stop1["Останов запроса"]
    AuthMiddleware -- "ОК" --> RBACGuard{"Guard (RBAC)"}
    
    RBACGuard -- "403 Forbidden" --> Stop2["Отказ в доступе"]
    RBACGuard -- "Права подтверждены" --> ServiceLayer["Service Layer / API Logic"]
    
    ServiceLayer --> DB[("Database")]
    ServiceLayer -.-> Logging["Log Attempt"]

    style AuthMiddleware fill:#e3f2fd,stroke:#1565c0
    style RBACGuard fill:#e3f2fd,stroke:#1565c0
```

#### Описание реализации RBAC
В системе реализована строгая ролевая модель доступа. Анонимный доступ запрещен. Каждое действие проверяется на соответствие полномочиям пользователя (Инспектор, Менеджер, Администратор). Соблюдается **принцип наименьших привилегий**: в API-ответах возвращаются только разрешенные для данной роли поля. Все попытки доступа, включая ошибки авторизации, логируются сервисом диагностики для последующего аудита.

---

### 4. Меры соответствия законодательству (ЗРУ-547 и ПКМ №702)
1. **Шифрование**: Весь трафик защищен TLS 1.3. Пароли хранятся в виде защищенных хешей.
2. **Аудит**: Логирование действий пользователей в `audit_log`.
3. **Безопасность кода**: Использование типизированного кода (TypeScript) и валидации схем (Zod) для предотвращения переполнения буфера или инъекций.
