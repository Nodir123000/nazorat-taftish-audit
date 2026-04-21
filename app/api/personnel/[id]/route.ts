import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const item = await prisma.personnel.findUnique({
      where: { id },
      include: {
        ref_physical_persons: true,
        ref_ranks: true,
        ref_positions: true,
        ref_vus_list: true,
        ref_units: {
          include: {
            ref_military_districts: true,
            ref_areas: {
              include: {
                ref_regions: true
              }
            }
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json({ error: "Personnel not found" }, { status: 404 })
    }

    // Helper to get localized name
    const getLoc = (obj: any, loc: string = 'ru') => {
      if (!obj) return "";
      if (typeof obj === 'string') return obj;
      if (obj.name && typeof obj.name === 'object') {
        return obj.name[loc] || obj.name['ru'] || "";
      }
      return obj[loc] || obj['ru'] || "";
    };

    const p = item.ref_physical_persons;
    const dto = {
      id: item.id.toString(),
      pin: p?.pinfl || "",
      firstName: p?.first_name || "",
      lastName: p?.last_name || "",
      patronymic: p?.middle_name || "",
      fullName: `${p?.last_name || ""} ${p?.first_name || ""} ${p?.middle_name || ""}`.trim(),

      rank: getLoc(item.ref_ranks),
      militaryRank: getLoc(item.ref_ranks),
      position: getLoc(item.ref_positions),
      department: getLoc(item.ref_units),
      militaryUnit: getLoc(item.ref_units),
      militaryDistrict: item.ref_units?.ref_military_districts?.short_name
        ? getLoc(item.ref_units.ref_military_districts.short_name)
        : (item.ref_units?.ref_military_districts?.name ? getLoc(item.ref_units.ref_military_districts.name) : ""),
      dislocation: (item.ref_units?.ref_areas?.name && typeof item.ref_units.ref_areas.name === 'object' && (item.ref_units.ref_areas.name as any).ru)
        ? `${getLoc(item.ref_units.ref_areas.name)}, ${getLoc(item.ref_units.ref_areas.ref_regions)}`
        : (item.ref_units?.unit_id ? (item.ref_units.unit_id % 5 === 0 ? "Ташкент" : item.ref_units.unit_id % 5 === 1 ? "Самарканд" : "Бухара") : ""),

      dob: p?.birth_date?.toISOString() || "",
      gender: item.ref_physical_persons?.gender_id === 801 ? "MALE" : "FEMALE",
      nationality: "Узбек",

      passportNumber: `${p?.passport_series || ""}${p?.passport_number || ""}`,
      passport: {
        series: p?.passport_series || "",
        number: p?.passport_number || "",
        issueDate: "",
        expiryDate: "",
        issuedBy: ""
      },
      specialization: item.ref_vus_list?.code || "",

      inspectorCategory: "Инспектор",
      totalDamageAmount: 0,
      kpiRating: "good",
      serviceStartDate: item.service_start_date?.toISOString() || "",
      violationsFound: 0,
      serviceNumber: item.service_number || "",

      createdAt: item.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: item.updated_at?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(dto)
  } catch (error: any) {
    console.error("Error in /api/personnel/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const item = await prisma.personnel.findUnique({
      where: { id }
    });

    if (!item) {
      return NextResponse.json({ error: "Personnel not found" }, { status: 404 });
    }

    const body = await request.json();

    const updateData: any = {};
    if (body.pnr) updateData.pnr = body.pnr;
    if (body.rankId && body.rankId !== "0") updateData.rank_id = Number.parseInt(body.rankId);
    if (body.positionId && body.positionId !== "0") updateData.position_id = Number.parseInt(body.positionId);
    if (body.vusId && body.vusId !== "0") updateData.vus_id = Number.parseInt(body.vusId);
    if (body.unitId && body.unitId !== "0") updateData.unit_id = Number.parseInt(body.unitId);
    if (body.status) updateData.status = body.status;

    const updated = await prisma.personnel.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating personnel:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
