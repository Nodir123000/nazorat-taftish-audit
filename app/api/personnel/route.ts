import { NextResponse } from "next/server";
import { getPersonnel, getPersonnelCount } from "@/lib/services/reference-db-service";
import { DiagnosticsService } from "@/lib/services/diagnostics-service";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const rankId = searchParams.get("rankId") ? parseInt(searchParams.get("rankId")!, 10) : undefined;
    const unitId = searchParams.get("unitId") ? parseInt(searchParams.get("unitId")!, 10) : undefined;

    const options = {
      skip,
      take: limit,
      search,
      status,
      rankId: rankId && !isNaN(rankId) ? rankId : undefined,
      unitId: unitId && !isNaN(unitId) ? unitId : undefined
    };

    const [data, total] = await Promise.all([
      getPersonnel(options),
      getPersonnelCount(options)
    ]);

    // ... existing transform logic ...
    const items = data.map((item: any) => {
      const p = item.ref_physical_persons;
      return {
        id: item.id.toString(),
        pin: p?.pinfl || "",
        firstName: p?.first_name || "",
        lastName: p?.last_name || "",
        patronymic: p?.middle_name || "",
        fullName: `${p?.last_name || ""} ${p?.first_name || ""} ${p?.middle_name || ""}`.trim(),
        pnr: item.pnr,
        rank: (item.ref_ranks?.name as any)?.['ru'] || item.ref_ranks?.name || "",
        position: (item.ref_positions?.name as any)?.['ru'] || item.ref_positions?.name || "",
        department: (item.ref_units?.name as any)?.['ru'] || item.ref_units?.name || "",
        militaryUnit: (item.ref_units?.name as any)?.['ru'] || item.ref_units?.name || "",
        militaryDistrict: item.ref_units?.ref_military_districts?.short_name || "",
        serviceStartDate: item.service_start_date?.toISOString() || "",
        status: item.status
      };
    });

    // LOG METRIC for metrological assurance
    await DiagnosticsService.logMetric({
      path: "/api/personnel",
      method: "GET",
      durationMs: Date.now() - startTime,
      statusCode: 200,
    });

    return NextResponse.json({
      items,
      data,
      total,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error("Error in /api/personnel:", error);
    
    // LOG ERROR METRIC
    await DiagnosticsService.logMetric({
      path: "/api/personnel",
      method: "GET",
      durationMs: Date.now() - startTime,
      statusCode: 500,
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
