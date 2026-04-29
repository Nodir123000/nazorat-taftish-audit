export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "admin" && user.role !== "chief_inspector")) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)))
  const search = searchParams.get("search") || ""
  const action = searchParams.get("action") || ""
  const dateFilter = searchParams.get("date") || "all"

  const where: Prisma.audit_logWhereInput = {}

  // Фильтр по типу действия
  if (action && action !== "all") {
    where.action = { contains: action, mode: "insensitive" }
  }

  // Фильтр по дате
  if (dateFilter !== "all") {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (dateFilter === "today") {
      where.created_at = { gte: today }
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      where.created_at = { gte: yesterday, lt: today }
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      where.created_at = { gte: weekAgo }
    }
  }

  // Полнотекстовый поиск
  if (search) {
    where.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { table_name: { contains: search, mode: "insensitive" } },
      { users: { fullname: { contains: search, mode: "insensitive" } } },
      { users: { username: { contains: search, mode: "insensitive" } } },
    ]
  }

  try {
    const [total, logs] = await Promise.all([
      prisma.audit_log.count({ where }),
      prisma.audit_log.findMany({
        where,
        include: {
          users: {
            select: { username: true, fullname: true },
          },
        },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    return NextResponse.json({
      logs: logs.map((l: any) => ({
        log_id: l.log_id,
        user_id: l.user_id,
        username: l.users?.username ?? "—",
        fullname: l.users?.fullname ?? "Система",
        action: l.action,
        table_name: l.table_name,
        record_id: l.record_id,
        old_value: l.old_value,
        new_value: l.new_value,
        ip_address: l.ip_address,
        created_at: l.created_at?.toISOString() ?? null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error("[admin/audit-logs GET]", err)
    return NextResponse.json({ error: "Ошибка загрузки журнала аудита" }, { status: 500 })
  }
}

