export const dynamic = "force-dynamic"
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

    const getLoc = (obj: any, lang: string = 'ru'): string => {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'object') {
        return obj[lang] || obj['ru'] || obj['uz'] || obj['uzk'] || '';
      }
      return '';
    };

    const normalize = (items: any[]) => items.map(item => {
      const name = item.name;
      const shortName = item.short_name;
      
      return {
        ...item,
        nameRu: getLoc(name, 'ru'),
        nameUz: getLoc(name, 'uz'),
        nameUzK: getLoc(name, 'uzk'),
        abbreviation: (name as any)?.abbr_ru || getLoc(shortName, 'ru') || (typeof shortName === 'string' ? shortName : '') || '',
        abbreviation_uz_latn: (name as any)?.abbr_uz || getLoc(shortName, 'uz') || '',
        abbreviation_uz_cyrl: (name as any)?.abbr_uzk || getLoc(shortName, 'uzk') || ''
      };
    });


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

