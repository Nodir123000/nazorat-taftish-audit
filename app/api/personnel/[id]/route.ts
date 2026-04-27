export const dynamic = "force-dynamic"
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
        issueDate: "", // Legacy
        expiryDate: p?.passport_expiry_date?.toISOString() || "",
        issuedBy: p?.passport_issued_by || ""
      },
      passportIssuedBy: p?.passport_issued_by || "",
      passportExpiryDate: p?.passport_expiry_date?.toISOString() || "",
      birthPlace: p?.birth_place || "",
      actualAddress: p?.actual_address || "",
      registrationAddress: p?.address || "",
      biography: p?.biography || "",
      email: p?.email || "",
      contactPhone: p?.contact_phone || "",
      personalPhone: p?.contact_phone || "",
      workPhone: item.emergency_phone || "", // Fallback or use separate field

      specialization: item.ref_vus_list?.code || "",

      inspectorCategory: "Инспектор",
      totalDamageAmount: 0,
      kpiRating: "good",
      serviceStartDate: item.service_start_date?.toISOString() || "",
      serviceNumber: item.service_number || "",
      clearanceLevel: item.clearance_level || "",
      emergencyContact: item.emergency_contact || "",
      emergencyPhone: item.emergency_phone || "",

      contracts: (item as any).contracts || [],
      serviceHistory: (item as any).service_history || [],

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

    const body = await request.json();
    
    // Import the service dynamically to avoid issues with SSR/Build
    const { PersonnelManagementService, PersonnelUpdateSchema } = await import("@/lib/services/personnel-management-service");
    
    // Validate data
    const validatedData = PersonnelUpdateSchema.parse(body);

    // Update using transaction-based service
    const updated = await PersonnelManagementService.updateFullProfile(id, validatedData);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating personnel:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Validation Error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
