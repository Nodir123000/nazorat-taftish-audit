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

const USER_SELECT = {
  user_id: true, username: true, fullname: true, rank: true,
  position: true, role: true, email: true, phone: true,
  unit_id: true, is_active: true, specialization: true,
  created_at: true, updated_at: true,
} as const

/** PUT /api/admin/users/:id — обновление данных пользователя */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })

  const { id } = await params
  const userId = parseInt(id)
  if (isNaN(userId)) return NextResponse.json({ error: "Неверный ID" }, { status: 400 })

  const existing = await prisma.users.findUnique({ where: { user_id: userId } })
  if (!existing) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 })
  }

  const { fullname, rank, position, email, phone, role, password } = body

  if (role && !["admin", "chief_inspector", "inspector", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Недопустимая роль" }, { status: 400 })
  }

  const updateData: any = { updated_at: new Date() }
  if (fullname?.trim()) updateData.fullname = fullname.trim()
  if (rank !== undefined) updateData.rank = rank?.trim() || null
  if (position !== undefined) updateData.position = position?.trim() || null
  if (email !== undefined) updateData.email = email?.trim() || null
  if (phone !== undefined) updateData.phone = phone?.trim() || null
  if (role) updateData.role = role
  if (password) {
    if (password.length < 8)
      return NextResponse.json({ error: "Пароль должен содержать минимум 8 символов" }, { status: 400 })
    updateData.password_hash = await bcrypt.hash(password, 12)
  }

  try {
    const updated = await prisma.users.update({
      where: { user_id: userId },
      data: updateData,
      select: USER_SELECT,
    })

    await logAudit({
      userId: admin.user_id,
      action: "Обновление пользователя",
      tableName: "users",
      recordId: userId,
      oldValue: { fullname: existing.fullname, role: existing.role },
      newValue: { fullname: updated.fullname, role: updated.role },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error("[admin/users PUT]", err)
    return NextResponse.json({ error: "Ошибка обновления пользователя" }, { status: 500 })
  }
}

/** PATCH /api/admin/users/:id — переключение статуса активности */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })

  const { id } = await params
  const userId = parseInt(id)
  if (isNaN(userId)) return NextResponse.json({ error: "Неверный ID" }, { status: 400 })

  if (userId === admin.user_id)
    return NextResponse.json({ error: "Нельзя изменить статус своей учётной записи" }, { status: 400 })

  const existing = await prisma.users.findUnique({ where: { user_id: userId } })
  if (!existing) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })

  const newStatus = !existing.is_active

  try {
    await prisma.users.update({
      where: { user_id: userId },
      data: { is_active: newStatus, updated_at: new Date() },
    })

    await logAudit({
      userId: admin.user_id,
      action: newStatus ? "Активация пользователя" : "Деактивация пользователя",
      tableName: "users",
      recordId: userId,
      oldValue: { is_active: existing.is_active },
      newValue: { is_active: newStatus },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true, is_active: newStatus })
  } catch (err) {
    console.error("[admin/users PATCH]", err)
    return NextResponse.json({ error: "Ошибка обновления статуса" }, { status: 500 })
  }
}

/** DELETE /api/admin/users/:id — мягкое удаление (деактивация) */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })

  const { id } = await params
  const userId = parseInt(id)
  if (isNaN(userId)) return NextResponse.json({ error: "Неверный ID" }, { status: 400 })

  if (userId === admin.user_id)
    return NextResponse.json({ error: "Нельзя удалить собственную учётную запись" }, { status: 400 })

  const existing = await prisma.users.findUnique({ where: { user_id: userId } })
  if (!existing) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })

  try {
    // Мягкое удаление — деактивируем вместо физического удаления
    await prisma.users.update({
      where: { user_id: userId },
      data: { is_active: false, updated_at: new Date() },
    })

    await logAudit({
      userId: admin.user_id,
      action: "Удаление пользователя",
      tableName: "users",
      recordId: userId,
      oldValue: { username: existing.username, fullname: existing.fullname, role: existing.role },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[admin/users DELETE]", err)
    return NextResponse.json({ error: "Ошибка удаления пользователя" }, { status: 500 })
  }
}
