import type { NextRequest } from "next/server"

export function getClientIp(req: NextRequest | Request): string | null {
  const headers = req.headers
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return headers.get("x-real-ip") ?? null
}
