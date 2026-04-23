export const dynamic = "force-dynamic"
export const revalidate = 0
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

    const key = (await params).key

    try {
        await prisma.ui_translations.delete({
            where: { key }
        })
        return NextResponse.json({ ok: true })
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    const key = (await params).key

    try {
        const item = await prisma.ui_translations.findUnique({
            where: { key }
        })
        if (!item) return NextResponse.json({ ok: false, error: 'Key not found' }, { status: 404 })
        return NextResponse.json({ ok: true, data: item })
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
}
