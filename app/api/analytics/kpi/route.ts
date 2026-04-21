import { NextResponse } from "next/server";
import { getOverallKPIMetrics, getRegionalKPIMetrics } from "@/lib/services/kpi-service";

/**
 * API эндпоинт для получения аналитики KPI (ПС-10)
 * GET /api/analytics/kpi?year=2026
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

    // Получаем общие показатели
    const overall = await getOverallKPIMetrics(year);
    
    // Получаем региональную аналитику
    const regional = await getRegionalKPIMetrics(year);

    return NextResponse.json({
      success: true,
      data: {
        overall,
        regional,
        year
      }
    });
  } catch (error) {
    console.error("KPI API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
