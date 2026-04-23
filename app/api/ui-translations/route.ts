export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'

const upsertSchema = z.object({
    key: z.string().min(1),
    name: z.record(z.string(), z.string()), // { "ru": "...", "uz": "..." }
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.string().optional(),
})

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')
    const module = searchParams.get('module')

    try {
        const translations = await prisma.ui_translations.findMany({
            where: {
                AND: [
                    module && module !== 'all' ? { tags: { has: module } } : {},
                    query ? {
                        OR: [
                            { key: { contains: query, mode: 'insensitive' } },
                            { description: { contains: query, mode: 'insensitive' } },
                        ]
                    } : {}
                ]
            },
            orderBy: { key: 'asc' }
        })

        return NextResponse.json({ ok: true, data: translations })
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

    try {
        const body = await req.json()
        const parsed = upsertSchema.parse(body)

        const result = await prisma.ui_translations.upsert({
            where: { key: parsed.key },
            update: {
                name: parsed.name,
                description: parsed.description,
                tags: parsed.tags,
                status: parsed.status,
            },
            create: {
                id: crypto.randomUUID(), // Add ID for create
                key: parsed.key,
                name: parsed.name,
                description: parsed.description,
                tags: parsed.tags,
                status: parsed.status || 'active',
                created_at: new Date(),
                updated_at: new Date()
            },
        })

        return NextResponse.json({ ok: true, data: result })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ ok: false, error: error.errors }, { status: 400 })
        }
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
}

