import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const [districts, directions, authorities, violations] = await Promise.all([
      prisma.ref_military_districts.findMany(),
      prisma.ref_control_directions.findMany(),
      prisma.ref_control_authorities.findMany(),
      prisma.ref_violations.findMany()
    ]);

    const normalize = (items: any[]) => items.map(item => ({
      ...item,
      nameRu: (item.name as any)?.ru || (typeof item.name === 'string' ? item.name : ''),
      nameUz: (item.name as any)?.uz || '',
      nameUzK: (item.name as any)?.uzk || '',
      abbreviation: (item.name as any)?.abbr_ru || item.short_name || '',
      abbreviation_uz_latn: (item.name as any)?.abbr_uz || item.short_name_uz_latn || '',
      abbreviation_uz_cyrl: (item.name as any)?.abbr_uzk || item.short_name_uz_cyrl || ''
    }));

    return NextResponse.json({
      districts: normalize(districts),
      directions: normalize(directions),
      authorities: normalize(authorities),
      violations: normalize(violations)
    });
  } catch (error: any) {
    console.error("[api-reference-all] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
