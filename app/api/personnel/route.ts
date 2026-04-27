import { NextResponse } from "next/server";
import { getPersonnel, getPersonnelCount } from "@/lib/services/reference-db-service";
import { DiagnosticsService } from "@/lib/services/diagnostics-service";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

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

    const options: any = {
      skip,
      take: limit,
      search,
      status,
      rankId: rankId && !isNaN(rankId) ? rankId : undefined,
      unitId: unitId && !isNaN(unitId) ? unitId : undefined
    };

    const isInspectorFilter = searchParams.get("isInspector") === "true";
    if (isInspectorFilter && !unitId) {
      options.unitId = [208, 20801, 20802, 20803, 20804];
    }

    console.log(`[API Personnel] Options:`, JSON.stringify(options));
    const [data, total, allUsers, kruSummaryRaw] = await Promise.all([
      getPersonnel(options),
      getPersonnelCount(options),
      prisma.users.findMany({ select: { fullname: true } }),
      prisma.personnel.groupBy({
        by: ['unit_id'],
        where: { unit_id: { in: [208, 20801, 20802, 20803, 20804] } },
        _count: { id: true }
      })
    ]);

    console.log(`[API Personnel] Found ${data.length} records. Total: ${total}`);
    console.log(`[API Personnel] KRU Summary Raw:`, JSON.stringify(kruSummaryRaw));

    const kruSummary: Record<number, number> = {};
    kruSummaryRaw.forEach((s: any) => {
      if (s.unit_id) {
        kruSummary[s.unit_id] = s._count.id;
      }
    });

    const userNames = new Set(allUsers.map(u => u.fullname));

    const getLocalized = (obj: any) => {
      if (!obj) return "";
      if (typeof obj === 'string') return obj;
      if (obj.name && typeof obj.name === 'object') {
        return obj.name.ru || obj.name.uz || obj.name.uzk || "";
      }
      return obj.nameRu || obj.name_ru || obj.ru || obj.name || "";
    };

    // ... existing transform logic ...
    let items = data.map((item: any) => {
      const p = item.ref_physical_persons;
      const fullName = `${p?.last_name || ""} ${p?.first_name || ""} ${p?.middle_name || ""}`.trim();
      return {
        id: item.id.toString(),
        pin: p?.pinfl || "",
        firstName: p?.first_name || "",
        lastName: p?.last_name || "",
        patronymic: p?.middle_name || "",
        fullName: fullName,
        pnr: item.pnr,
        rank: getLocalized(item.ref_ranks),
        position: getLocalized(item.ref_positions),
        department: getLocalized(item.ref_units),
        militaryUnit: getLocalized(item.ref_units),
        militaryDistrict: item.ref_units?.ref_military_districts?.short_name?.ru || item.ref_units?.ref_military_districts?.short_name || "",
        serviceStartDate: item.service_start_date?.toISOString() || "",
        status: item.status,
        isInspector: userNames.has(fullName) || [208, 20801, 20802, 20803, 20804].includes(item.unit_id)
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
      kruSummary,
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
