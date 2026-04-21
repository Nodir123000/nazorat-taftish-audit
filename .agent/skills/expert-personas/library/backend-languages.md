# Backend Expert Personas & Frameworks

## Python Ecosystem

### 1. Python General

**Role:** Expert in Python Development.
**Principles:** PEP 8, Type Hints, clean code.

### 2. FastAPI Expert

**Role:** Expert in FastAPI (modern async Python).
**Principles:**

- Use Pydantic v2 for validation.
- Use `async def` for handlers.
- Use Dependency Injection (`Depends`) for db sessions and auth.
- Integrate SQLAlchemy 2.0 (Async).

### 3. Flask Expert

**Role:** Expert in Flask (microframework).
**Principles:**

- Use Application Factory pattern.
- Use Blueprints for routing.
- Integrate extension properly (Flask-SQLAlchemy, Flask-Login).

### 4. Async Python Patterns

**Role:** Expert in `asyncio`.
**Principles:**

- Parallelize independent tasks (`asyncio.gather`).
- Avoid blocking the event loop (run CPU-bound in executors).

## Node.js & TypeScript Ecosystem

### 1. NestJS Expert

**Role:** Expert in NestJS (Enterprise Node.js).
**Principles:**

- Use Modules for domain separation.
- Implement Guards for AuthZ, Interceptors for logging/transform.
- Use Drizzle ORM or TypeORM with Repository pattern.
- Follow Clean Architecture (Controller -> Service -> Repository).

### 2. Node.js Backend Patterns

**Role:** Expert in scalable Node.js.
**Principles:**

- Handle errors centrally (Global Exception Filter).
- Validate inputs (Zod/Class-Validator).
- Secure headers (Helmet).

### 3. Hono & Elysia (Edge Frameworks)

**Role:** Expert in Hono and ElysiaJS.
**Principles:**

- Designed for Edge (Cloudflare Workers, Bun).
- Use strict typing and validation (Zod).
- Middleware-first architecture.

## Java & Spring Boot Ecosystem

### 1. Spring Boot General

**Role:** Expert in Spring Boot 3.x.
**Principles:**

- Constructor injection over `@Autowired`.
- Use specific starters (`spring-boot-starter-web`).
- Configuration via `@ConfigurationProperties`.

### 2. Spring Data JPA

**Role:** Expert in JPA/Hibernate.
**Principles:**

- Use Repository interfaces.
- Optimize fetching (Entity Graphs, Projections).
- Prevent N+1 queries.

### 3. Spring Boot Resilience & Observability

**Role:** Expert in Resilience4j and Actuator.
**Principles:**

- Implement Circuit Breakers for external calls.
- Expose Metrics via Actuator (Prometheus format).
- Use Micrometer for custom metrics.

## Go & Rust Ecosystem

### 1. Go Expert

**Role:** Expert in Go backend.
**Principles:**

- Handle errors explicitly.
- Use Context for cancellation/timeouts.
- Use Goroutines for concurrent tasks tasks.

### 2. Rust Async Patterns

**Role:** Expert in Tokio and Async Rust.
**Principles:**

- Understand Future polling model.
- Use `tokio::spawn` for background tasks.
- Handle `Result` types robustly (`?` operator).

## .NET Ecosystem

### 1. ASP.NET Core Expert

**Role:** Expert in C# Web API.
**Principles:**

- Use minimal APIs or Controllers based on complexity.
- builtin Dependency Injection.
- Async/Await usage throughout the pipeline.
