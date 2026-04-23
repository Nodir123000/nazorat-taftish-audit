export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

function safeInt(v: any): number | null {
    if (v == null || v === "") return null
    const n = Number(v)
    return Number.isFinite(n) ? Math.trunc(n) : null
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params
    const id = safeInt(idStr)
    if (id === null) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    try {
        const unit = await prisma.ref_units.findUnique({
            where: { unit_id: id },
            include: {
                ref_military_districts: true,
                ref_areas: {
                    include: {
                        ref_regions: true
                    }
                }
            }
        })

        if (!unit) {
            return NextResponse.json({ error: "Unit not found" }, { status: 404 })
        }

        const districtObj = unit.ref_military_districts
            ? {
                districtId: unit.ref_military_districts.district_id,
                name: unit.ref_military_districts.name ?? unit.ref_military_districts.short_name ?? null,
                shortName: unit.ref_military_districts.short_name ?? null
            }
            : null

        const areaObj = unit.ref_areas
            ? {
                areaId: unit.ref_areas.id ?? null,
                name: unit.ref_areas.name ?? null,
                region: unit.ref_areas.ref_regions
                    ? { regionId: unit.ref_areas.ref_regions.id ?? null, name: unit.ref_areas.ref_regions.name ?? null }
                    : null
            }
            : null

        const mappedUnit = {
            unitId: unit.unit_id,
            unitNumber: unit.unit_code ?? null,
            militaryDistrictId: unit.military_district_id ?? null,
            areaId: unit.area_id ?? null,
            isActive: !!unit.is_active,
            commanderName: unit.commander_name ?? null,
            commanderRank: unit.commander_rank ?? null,
            district: districtObj,
            area: areaObj,
        }

        return NextResponse.json(mappedUnit)
    } catch (err) {
        console.error("GET /api/units/[id] error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id: idStr } = await params
    const id = safeInt(idStr)
    if (id === null) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    try {
        const body = await request.json()

        // Accept both shapes: { name: "string" } or { name: { ru, uz } }
        const { unitNumber, name, commander, commanderName, militaryDistrictId, areaId, isActive } = body

        // Ensure record exists
        const existing = await prisma.ref_units.findUnique({ where: { unit_id: id } })
        if (!existing) {
            return NextResponse.json({ error: "Unit not found" }, { status: 404 })
        }

        const updateData: any = {}

        if (unitNumber !== undefined) updateData.unit_code = String(unitNumber)
        // commander may be commander or commanderName
        if (commander !== undefined || commanderName !== undefined) updateData.commander_name = String(commander ?? commanderName)
        if (militaryDistrictId !== undefined) {
            const md = safeInt(militaryDistrictId)
            updateData.military_district_id = md
        }
        if (areaId !== undefined) {
            const ar = safeInt(areaId)
            updateData.area_id = ar
        }
        if (isActive !== undefined) updateData.is_active = !!isActive

        // name handling: accept both string and object
        if (name !== undefined) {
            if (typeof name === "string") {
                updateData.name = { ru: name, uz: name } // adjust according to DB column type
            } else {
                updateData.name = name
            }
        }

        const updatedUnit = await prisma.ref_units.update({
            where: { unit_id: id },
            data: updateData
        })

        return NextResponse.json({ success: true, data: updatedUnit })
    } catch (err: any) {
        console.error("PUT /api/units/[id] error:", err)
        return NextResponse.json({ success: false, error: err?.message ?? "Internal error" }, { status: 500 })
    }
}
