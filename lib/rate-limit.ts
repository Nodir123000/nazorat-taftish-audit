/**
 * Серверный ограничитель частоты запросов (in-memory rate limiter).
 * Используется для защиты точки входа /login от брутфорс-атак.
 * Хранит данные в памяти процесса — подходит для одноузловых развёртываний.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const MAX_ATTEMPTS = 50          // максимум попыток в окне
const WINDOW_MS = 15 * 60 * 1000 // окно: 15 минут

// Фоновая очистка устаревших записей каждую минуту
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 60_000).unref?.()

/**
 * Проверяет, разрешён ли вход для данного идентификатора (username или IP).
 * Возвращает { allowed, remaining, resetIn }
 */
export function checkLoginRateLimit(identifier: string): {
  allowed: boolean
  remaining: number
  resetIn: number
} {
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: WINDOW_MS }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now }
  }

  entry.count++
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, resetIn: entry.resetAt - now }
}

/**
 * Сбрасывает счётчик после успешного входа.
 */
export function resetLoginRateLimit(identifier: string): void {
  store.delete(identifier)
}
