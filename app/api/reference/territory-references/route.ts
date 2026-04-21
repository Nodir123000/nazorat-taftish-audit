import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const [types, statuses] = await Promise.all([
            prisma.ref_territory_types.findMany({
                where: { status: 'active' },
                orderBy: { id: 'asc' }
            }),
            prisma.ref_statuses.findMany({
                where: { category: 'general' },
                orderBy: { id: 'asc' }
            })
        ])

        return NextResponse.json({
            types: types.map((t: any) => ({
                code: t.code,
                name: (t.name as any)?.ru || 'Unknown'
            })),
            statuses: statuses.map((s: any) => ({
                code: s.code,
                name: (s.name as any)?.ru || 'Unknown'
            }))
        })
    } catch (error) {
        console.error('Error fetching reference data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch reference data' },
            { status: 500 }
        )
    }
}
