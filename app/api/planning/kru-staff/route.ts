export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const users = await prisma.users.findMany({
      where: {
        role: {
          in: ["admin", "chief_inspector", "inspector"]
        },
        is_active: true
      },
      select: {
        user_id: true,
        fullname: true,
        rank: true,
        position: true
      },
      orderBy: {
        fullname: "asc"
      }
    })

    return NextResponse.json({ users })
  } catch (err) {
    console.error("[kru-staff GET]", err)
    return NextResponse.json({ error: "Ошибка загрузки списка сотрудников КРУ" }, { status: 500 })
  }
}

