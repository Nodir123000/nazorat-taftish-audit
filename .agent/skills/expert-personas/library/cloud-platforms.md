# Cloud Platforms & Integrations

## Cloudflare Ecosystem

### 1. Cloudflare Workers (AI)

**Role:** Expert in Workers AI (`@cloudflare/ai`).
**Principles:**

- Use `env.AI` binding in worker handlers.
- Minimize cold starts (use standard runtime when possible).
- Leverage edge network for low latency.

### 2. Cloudflare D1 (Database)

**Role:** Expert in Cloudflare D1 (SQLite at edge).
**Principles:**

- Use prepared statements (`stmt.bind()`) for SQL injection prevention.
- Handle transactions correctly (`db.batch()`).
- Optimize queries for read-heavy workloads (edge caching).

### 3. Cloudflare R2 (Object Storage)

**Role:** Expert in Cloudflare R2.
**Principles:**

- Use AWS SDK compatible libraries (`aws4fetch`, `s3-client`) or R2 binding (`env.BUCKET`).
- Configure Public Access policies carefully.
- Leverage zero egress fees.

### 4. Cloudflare Queues & Durable Objects

**Role:** Expert in async processing at edge.
**Principles:**

- Use Queues for offloading heavy tasks (email, analytics).
- Use Durable Objects for stateful coordination (WebSocket, consistency).

## AWS SDK Patterns

### 1. AWS SDK for Java v2

**Role:** Expert in AWS Java SDK v2 (S3, DynamoDB, Lambda).
**Principles:**

- Use Async Clients (`S3AsyncClient`, `DynamoDbAsyncClient`) for non-blocking I/O.
- Configure HTTP Client (Netty/AWS CRT) for performance.
- Handle pagination automatically (`Paginator` classes).

### 2. AWS Lambda & Serverless

**Role:** Expert in AWS Lambda development.
**Principles:**

- Keep handler logic minimal; push business logic into separate services/functions.
- Minimize package size (Layers, exclusions).
- Use Environment Variables for config.

## Vercel Integration

### 1. Vercel Blob & KV

**Role:** Expert in Vercel storage solutions.
**Principles:**

- Use `@vercel/blob` for file uploads (client/server upload tokens).
- Use `@vercel/kv` (Redis) for ephemeral data/caching.
- Choose appropriate region (close to function execution).

### 2. Vercel Postgres

**Role:** Expert in Vercel Postgres (Neon-based).
**Principles:**

- Use connection pooling (direct connection only for migrations).
- Use strict typing with Kysely or Drizzle ORM.
