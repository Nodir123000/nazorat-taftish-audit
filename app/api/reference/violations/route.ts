export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const violations = await prisma.ref_violations.findMany({
      orderBy: [
        { category: 'asc' },
        { description: 'asc' },
        { viol_type_id: 'asc' }
      ]
    })

    // Группировка данных на стороне сервера для уменьшения нагрузки на фронтенд
    const grouped = violations.reduce((acc: any, curr: any) => {
      const sectionName = curr.category || "Прочее"
      const kindName = curr.description || "Общее"

      let section = acc.find((s: any) => s.section === sectionName)
      if (!section) {
        section = { section: sectionName, kinds: [] }
        acc.push(section)
      }

      let kind = section.kinds.find((k: any) => k.kind === kindName)
      if (!kind) {
        kind = { kind: kindName, details: [] }
        section.kinds.push(kind)
      }

      kind.details.push({
        id: curr.viol_type_id,
        name: (curr.name as any)?.ru || curr.name,
        code: curr.code
      })

      return acc
    }, [])

    return NextResponse.json(grouped)
  } catch (error: any) {
    console.error("[api-reference-violations] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

