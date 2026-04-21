import { NextRequest, NextResponse } from "next/server"

/**
 * Next.js middleware (Edge Runtime).
 *
 * Задачи:
 * 1. Проверяет наличие и HMAC-подпись сессионной куки на всех защищённых маршрутах.
 * 2. Перенаправляет неаутентифицированных пользователей на /login.
 * 3. Для API-маршрутов возвращает 401 JSON вместо редиректа.
 * 4. Не допускает аутентифицированных пользователей на /login (редирект → /dashboard).
 */

const COOKIE_NAME = "auth_user"

// Маршруты, доступные без аутентификации
const PUBLIC_PREFIXES = [
  "/login",
  "/_next/",
  "/favicon.ico",
]

// Расширения статических файлов, которые всегда открыты
const STATIC_EXTENSIONS = /\.(svg|png|jpg|jpeg|gif|ico|webp|woff|woff2|ttf|otf|css|js|map)$/

function isPublicPath(pathname: string): boolean {
  if (STATIC_EXTENSIONS.test(pathname)) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

/**
 * Проверяет HMAC-SHA256 подпись куки через Web Crypto API (Edge Runtime).
 * Использует ту же схему, что и lib/auth.ts (Node.js crypto).
 */
async function verifyCookieSignature(signed: string, secret: string): Promise<boolean> {
  try {
    const lastDot = signed.lastIndexOf(".")
    if (lastDot === -1) return false

    const encoded = signed.substring(0, lastDot)
    const signature = signed.substring(lastDot + 1)
    if (!encoded || !signature) return false

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    // base64url → Uint8Array
    const b64 = signature.replace(/-/g, "+").replace(/_/g, "/")
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4)
    const sigBytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))

    return await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(encoded))
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропустить публичные пути
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get(COOKIE_NAME)
  const isAuthenticated = await isValidSession(authCookie?.value)

  // Редирект аутентифицированных пользователей с /login → /dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isAuthenticated) {
    // API: возвращаем 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(

        { error: "Не авторизован. Требуется вход в систему." },
        { status: 401 }
      )
    }
    // Страницы: редирект на /login
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

async function isValidSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false

  const secret = process.env.JWT_SECRET
  if (!secret || secret === "your-secret-key") {
    return false
  }

  return verifyCookieSignature(cookieValue, secret)
}

export const config = {
  matcher: [
    /*
     * Обрабатываем все пути, КРОМЕ:
     * - _next/static  (статические ресурсы Next.js)
     * - _next/image   (оптимизация изображений)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
