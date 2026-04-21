"use server"

import { cookies } from "next/headers"
import { prisma } from "./db/prisma"
import * as bcrypt from "bcryptjs"
import { createHmac, timingSafeEqual } from "crypto"
import type { User } from "./types"
import { checkLoginRateLimit, resetLoginRateLimit } from "./rate-limit"

const COOKIE_NAME = "auth_user"
const SESSION_MAX_AGE = 60 * 60 * 8 // 8 часов

// ---------------------------------------------------------------------------
// HMAC-подпись куки
// ---------------------------------------------------------------------------

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret === "your-secret-key" || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[SECURITY] JWT_SECRET должен быть задан и содержать не менее 32 символов в production-среде"
      )
    }
    console.warn(
      "[SECURITY] JWT_SECRET не задан или слишком короткий. Используется небезопасное значение — только для разработки!"
    )
    return "dev-only-insecure-fallback-32-chars!!"
  }
  return secret
}

/** Подписывает строку данных и возвращает `encoded.signature` */
function signData(data: string): string {
  const secret = getSecret()
  const encoded = Buffer.from(data).toString("base64url")
  const hmac = createHmac("sha256", secret)
  hmac.update(encoded)
  const signature = hmac.digest("base64url")
  return `${encoded}.${signature}`
}

/**
 * Проверяет HMAC-подпись и возвращает исходные данные.
 * При неверной подписи возвращает null (защита от подделки куки).
 */
function verifyAndDecode(signed: string): string | null {
  if (!signed) return null
  const lastDot = signed.lastIndexOf(".")
  if (lastDot === -1) return null

  const encoded = signed.substring(0, lastDot)
  const signature = signed.substring(lastDot + 1)
  if (!encoded || !signature) return null

  try {
    const secret = getSecret()
    const hmac = createHmac("sha256", secret)
    hmac.update(encoded)
    const expected = hmac.digest("base64url")

    const sigBuf = Buffer.from(signature, "base64url")
    const expBuf = Buffer.from(expected, "base64url")
    if (sigBuf.length !== expBuf.length) return null
    if (!timingSafeEqual(sigBuf, expBuf)) return null

    return Buffer.from(encoded, "base64url").toString("utf-8")
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Публичный API
// ---------------------------------------------------------------------------

export interface LoginResult {
  success: boolean
  user?: User
  error?: string
  retryAfterMs?: number
}

/**
 * Вход в систему.
 * — Rate limiting: 5 попыток / 15 минут на логин.
 * — Нормализованные ошибки: не сообщаем, существует ли пользователь.
 * — Куки подписаны HMAC-SHA256 и хранят только user_id + iat.
 */
export async function login(
  username: string,
  password: string,
): Promise<LoginResult> {
  try {
    const cleanUsername = username.trim().toLowerCase().slice(0, 100)
    if (!cleanUsername) {
      return { success: false, error: "Введите имя пользователя" }
    }

    // Rate limiting
    const rateCheck = checkLoginRateLimit(cleanUsername)
    if (!rateCheck.allowed) {
      const secs = Math.ceil(rateCheck.resetIn / 1000)
      return {
        success: false,
        error: `Слишком много неудачных попыток. Повторите через ${secs} с.`,
        retryAfterMs: rateCheck.resetIn,
      }
    }

    const userRecord = await prisma.users.findUnique({
      where: { username: cleanUsername },
    })

    // Намеренно одинаковое сообщение при отсутствии пользователя и неверном пароле
    const GENERIC_ERROR = "Неверное имя пользователя или пароль"

    if (!userRecord) {
      return { success: false, error: GENERIC_ERROR }
    }

    if (!userRecord.is_active) {
      return { success: false, error: "Учётная запись деактивирована. Обратитесь к администратору." }
    }

    const isPasswordValid = await bcrypt.compare(password, userRecord.password_hash)
    if (!isPasswordValid) {
      return { success: false, error: GENERIC_ERROR }
    }

    // Успешный вход — сбросить счётчик
    resetLoginRateLimit(cleanUsername)

    // Сессионный токен: только user_id + iat
    const sessionPayload = JSON.stringify({
      user_id: userRecord.user_id,
      iat: Date.now(),
    })

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, signData(sessionPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    })

    const user: User = {
      user_id: userRecord.user_id,
      username: userRecord.username,
      fullname: userRecord.fullname,
      rank: userRecord.rank || undefined,
      position: userRecord.position || undefined,
      role: userRecord.role as User["role"],
      email: userRecord.email || undefined,
      phone: userRecord.phone || undefined,
      unit_id: userRecord.unit_id || undefined,
      is_active: userRecord.is_active ?? true,
      created_at: userRecord.created_at?.toISOString() || new Date().toISOString(),
      updated_at: userRecord.updated_at?.toISOString() || new Date().toISOString(),
    }

    return { success: true, user }
  } catch (error) {
    console.error("[auth] login error:", error)
    return { success: false, error: "Ошибка сервера. Попробуйте позже." }
  }
}

/**
 * Выход из системы — удаляет сессионную куки.
 */
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Возвращает текущего пользователя из подписанной сессионной куки.
 *
 * ВАЖНО: всегда выполняет повторную проверку в БД, чтобы:
 * — обнаружить деактивированных пользователей со старыми куки;
 * — применить изменения роли немедленно.
 *
 * Возвращает null (НЕ фиктивного admin!) если сессия отсутствует или недействительна.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get(COOKIE_NAME)

    if (!authCookie?.value) {
      return null
    }

    const decoded = verifyAndDecode(authCookie.value)
    if (!decoded) {
      // Недействительная или подделанная куки — немедленно удалить
      cookieStore.delete(COOKIE_NAME)
      return null
    }

    let sessionData: { user_id: number; iat: number }
    try {
      sessionData = JSON.parse(decoded)
    } catch {
      cookieStore.delete(COOKIE_NAME)
      return null
    }

    if (!sessionData.user_id) {
      cookieStore.delete(COOKIE_NAME)
      return null
    }

    // Повторная проверка в БД
    const userRecord = await prisma.users.findFirst({
      where: { user_id: sessionData.user_id, is_active: true },
    })

    if (!userRecord) {
      cookieStore.delete(COOKIE_NAME)
      return null
    }

    return {
      user_id: userRecord.user_id,
      username: userRecord.username,
      fullname: userRecord.fullname,
      rank: userRecord.rank || undefined,
      position: userRecord.position || undefined,
      role: userRecord.role as User["role"],
      email: userRecord.email || undefined,
      phone: userRecord.phone || undefined,
      unit_id: userRecord.unit_id || undefined,
      is_active: userRecord.is_active ?? true,
      created_at: userRecord.created_at?.toISOString() || new Date().toISOString(),
      updated_at: userRecord.updated_at?.toISOString() || new Date().toISOString(),
    }
  } catch (error) {
    console.error("[auth] getCurrentUser error:", error)
    return null
  }
}
