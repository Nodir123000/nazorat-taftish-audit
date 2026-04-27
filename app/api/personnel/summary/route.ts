import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
    try {
        const [total, active, officers, sergeants, soldiers] = await Promise.all([
            prisma.personnel.count(),
            prisma.personnel.count({ where: { status: 'active' } }),
            prisma.personnel.count({ where: { category: 'Офицер' } }),
            prisma.personnel.count({ where: { category: 'Сержант' } }),
            prisma.personnel.count({ where: { category: { in: ['Рядовой', 'Курсант'] } } }),
        ])

        return NextResponse.json({
            total,
            active,
            officers,
            sergeants,
            soldiers
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
