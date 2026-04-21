/**
 * Next.js configuration with HTTP security headers.
 * All headers are applied to every response.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  distDir: ".next_new",
  // Disable Turbopack — use Webpack (required due to inaccessible (dashboard) dir on this system)
  experimental: {},

  async headers() {
    return [
      {
        // Применяем ко всем маршрутам
        source: "/(.*)",
        headers: [
          // Предотвращает кликджекинг — страница не может быть встроена в iframe
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Запрещает браузеру угадывать тип контента (MIME sniffing)
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Политика Referrer — не передаём URL при переходе на внешний ресурс
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // HSTS — принудительный HTTPS на 2 года (включается только в production)
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
          // Ограничение доступа к браузерным API
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          // Content Security Policy
          // unsafe-inline / unsafe-eval нужны для Next.js + Tailwind + MUI в текущей конфигурации.
          // В будущем заменить на nonce-based CSP после аудита inline-скриптов.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // Отключаем DNS prefetch в целях конфиденциальности
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
        ],
      },
    ]
  },
}

export default nextConfig
