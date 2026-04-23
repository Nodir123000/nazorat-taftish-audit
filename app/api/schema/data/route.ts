export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

/**
 * Whitelist безопасных таблиц для просмотра схемы.
 * Исключены: users (содержит password_hash), audit_log (IP-адреса).
 */
const TABLE_HANDLERS: Record<string, () => Promise<unknown[]>> = {
  ref_units:              () => prisma.ref_units.findMany({ take: 10 }),
  ref_ranks:              () => prisma.ref_ranks.findMany({ take: 10 }),
  ref_positions:          () => prisma.ref_positions.findMany({ take: 10 }),
  ref_areas:              () => prisma.ref_areas.findMany({ take: 10 }),
  ref_regions:            () => prisma.ref_regions.findMany({ take: 10 }),
  ref_military_districts: () => prisma.ref_military_districts.findMany({ take: 10 }),
  ref_vus_list:           () => prisma.ref_vus_list.findMany({ take: 10 }),
  ref_compositions:       () => prisma.ref_compositions.findMany({ take: 10 }),
  ref_control_types:      () => prisma.ref_control_types.findMany({ take: 10 }),
  ref_control_directions: () => prisma.ref_control_directions.findMany({ take: 10 }),
  ref_control_authorities:() => prisma.ref_control_authorities.findMany({ take: 10 }),
  ref_inspection_kinds:   () => prisma.ref_inspection_kinds.findMany({ take: 10 }),
  ref_violation_reasons:  () => prisma.ref_violation_reasons.findMany({ take: 10 }),
  ref_violation_severities:()=> prisma.ref_violation_severities.findMany({ take: 10 }),
  ref_violation_statuses: () => prisma.ref_violation_statuses.findMany({ take: 10 }),
  ref_statuses:           () => prisma.ref_statuses.findMany({ take: 10 }),
  ref_genders:            () => prisma.ref_genders.findMany({ take: 10 }),
  ref_nationalities:      () => prisma.ref_nationalities.findMany({ take: 10 }),
  ref_classifiers:        () => prisma.ref_classifiers.findMany({ take: 10 }),
  ref_unit_types:         () => prisma.ref_unit_types.findMany({ take: 10 }),
  personnel:              () => prisma.personnel.findMany({ take: 10 }),
  quarterly_plans:        () => prisma.quarterly_plans.findMany({ take: 10 }),
  monthly_plans:          () => prisma.monthly_plans.findMany({ take: 10 }),
  findings:               () => prisma.findings.findMany({ take: 10 }),
  commission_members:     () => prisma.commission_members.findMany({ take: 10 }),
  ui_translations:        () => prisma.ui_translations.findMany({ take: 10 }),
}

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "admin" && user.role !== "chief_inspector")) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const tableName = searchParams.get("table")

  if (!tableName) {
    return NextResponse.json({ error: "Укажите имя таблицы" }, { status: 400 })
  }

  const handler = TABLE_HANDLERS[tableName]
  if (!handler) {
    return NextResponse.json(
      { error: `Таблица '${tableName}' недоступна для просмотра` },
      { status: 403 }
    )
  }

  try {
    const data = await handler()
    return NextResponse.json({ data })
  } catch (error: any) {
    console.error(`[schema/data] Ошибка запроса таблицы ${tableName}:`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

