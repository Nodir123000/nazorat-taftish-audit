import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"
import * as bcrypt from "bcryptjs"
import { logAudit } from "@/lib/server-audit"
import { getClientIp } from "@/lib/utils/request"

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") return null
  return user
}

// Поля, возвращаемые клиенту (без password_hash)
const USER_SELECT = {
  user_id: true,
  username: true,
  fullname: true,
  rank: true,
  position: true,
  role: true,
  email: true,
  phone: true,
  unit_id: true,
  is_active: true,
  specialization: true,
  created_at: true,
  updated_at: true,
} as const

export async function GET(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })

  const { searchParams } = req.nextUrl
  const search = searchParams.get("search") || ""
  const role = searchParams.get("role") || ""

  const where: any = {}
  if (role) where.role = role
  if (search) {
    where.OR = [
      { fullname: { contains: search, mode: "insensitive" } },
      { username: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  try {
    const users = await prisma.users.findMany({
      where,
      select: USER_SELECT,
      orderBy: { fullname: "asc" },
    })
    return NextResponse.json({ users })
  } catch (err) {
    console.error("[admin/users GET]", err)
    return NextResponse.json({ error: "Ошибка загрузки пользователей" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 })
  }

  const { username, password, fullname, rank, position, email, phone, role } = body

  if (!username?.trim() || !password || !fullname?.trim() || !role) {
    return NextResponse.json(
      { error: "Обязательные поля: username, password, fullname, role" },
      { status: 400 }
    )
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Пароль должен содержать минимум 8 символов" }, { status: 400 })
  }
  if (!["admin", "chief_inspector", "inspector", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Недопустимая роль" }, { status: 400 })
  }

  const cleanUsername = username.trim().toLowerCase()
  const existing = await prisma.users.findUnique({ where: { username: cleanUsername } })
  if (existing) {
    return NextResponse.json({ error: "Пользователь с таким именем уже существует" }, { status: 409 })
  }

  const password_hash = await bcrypt.hash(password, 12)

  try {
    const user = await prisma.users.create({
      data: {
        username: cleanUsername,
        password_hash,
        fullname: fullname.trim(),
        rank: rank?.trim() || null,
        position: position?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        role,
        is_active: true,
      },
      select: USER_SELECT,
    })

    await logAudit({
      userId: admin.user_id,
      action: "Создание пользователя",
      tableName: "users",
      recordId: user.user_id,
      newValue: { username: cleanUsername, fullname: fullname.trim(), role },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    console.error("[admin/users POST]", err)
    return NextResponse.json({ error: "Ошибка создания пользователя" }, { status: 500 })
  }
}
