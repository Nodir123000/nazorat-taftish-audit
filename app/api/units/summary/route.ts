import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
    try {
        const [total, active, inctive] = await Promise.all([
            prisma.ref_units.count(),
            prisma.ref_units.count({ where: { is_active: true } }),
            prisma.ref_units.count({ where: { is_active: false } })
        ])

        // Group by district
        const districts = await prisma.ref_military_districts.findMany({
            include: {
                _count: {
                    select: { ref_units: true }
                }
            }
        })

        const byDistrict = districts.reduce((acc: any, d: any) => {
            acc[d.district_id] = d._count.ref_units
            return acc
        }, {})

        return NextResponse.json({
            total,
            active,
            inactive: inctive,
            byDistrict
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
