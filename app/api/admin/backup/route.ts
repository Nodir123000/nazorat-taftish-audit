export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"
import { logAudit } from "@/lib/server-audit"
import { promises as fs } from "fs"
import path from "path"

const BACKUPS_DIR = path.join(process.cwd(), "backups")
const INDEX_FILE = path.join(BACKUPS_DIR, "index.json")

interface BackupMeta {
  backup_id: number
  backup_name: string
  backup_type: "full" | "incremental"
  size_mb: number
  created_at: string
  created_by: string
  status: "completed" | "failed"
  filename: string
  retention_days: number
  tables_count: number
}

async function ensureBackupsDir() {
  try {
    await fs.mkdir(BACKUPS_DIR, { recursive: true })
  } catch {}
}

async function readIndex(): Promise<BackupMeta[]> {
  try {
    const raw = await fs.readFile(INDEX_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeIndex(list: BackupMeta[]) {
  await fs.writeFile(INDEX_FILE, JSON.stringify(list, null, 2), "utf-8")
}

/** GET /api/admin/backup — список резервных копий */
export async function GET(_req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "admin" && user.role !== "chief_inspector")) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  await ensureBackupsDir()
  const backups = await readIndex()
  return NextResponse.json({ backups: backups.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )})
}

/** POST /api/admin/backup — создать резервную копию (JSON-экспорт ключевых таблиц) */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  let body: any = {}
  try { body = await req.json() } catch {}

  const backupType: "full" | "incremental" = body.backup_type === "incremental" ? "incremental" : "full"
  const retentionDays = Math.max(1, Math.min(365, parseInt(body.retention_days || "30", 10)))

  await ensureBackupsDir()

  const timestamp = Date.now()
  const filename = `backup_${backupType}_${timestamp}.json`
  const filepath = path.join(BACKUPS_DIR, filename)

  try {
    // Экспортируем ключевые таблицы
    const [units, ranks, positions, personnel, plans, audits, violations] = await Promise.all([
      prisma.ref_units.findMany(),
      prisma.ref_ranks.findMany(),
      prisma.ref_positions.findMany(),
      prisma.personnel.findMany(),
      prisma.rev_plan_year.findMany(),
      prisma.audits.findMany(),
      prisma.violations.findMany(),
    ])

    const exportData = {
      meta: {
        created_at: new Date().toISOString(),
        backup_type: backupType,
        created_by: user.username,
        version: "1.0",
      },
      data: {
        ref_units: units,
        ref_ranks: ranks,
        ref_positions: positions,
        personnel,
        rev_plan_year: plans,
        audits,
        violations,
      },
    }

    const json = JSON.stringify(exportData, null, 2)
    await fs.writeFile(filepath, json, "utf-8")

    const sizeMb = parseFloat((Buffer.byteLength(json, "utf-8") / (1024 * 1024)).toFixed(2))
    const tableCount = Object.keys(exportData.data).length

    const backupName = body.backup_name?.trim() ||
      `${backupType === "full" ? "Полная" : "Инкрементная"} копия ${new Date().toLocaleDateString("ru-RU")}`

    const meta: BackupMeta = {
      backup_id: timestamp,
      backup_name: backupName,
      backup_type: backupType,
      size_mb: sizeMb,
      created_at: new Date().toISOString(),
      created_by: user.username,
      status: "completed",
      filename,
      retention_days: retentionDays,
      tables_count: tableCount,
    }

    const index = await readIndex()
    index.push(meta)
    await writeIndex(index)

    await logAudit({
      userId: user.user_id,
      action: "Создание резервной копии",
      tableName: "backup",
      newValue: { backup_name: backupName, backup_type: backupType, size_mb: sizeMb },
      ipAddress: req.headers.get("x-forwarded-for"),
    })

    return NextResponse.json({ backup: meta }, { status: 201 })
  } catch (err) {
    console.error("[admin/backup POST]", err)
    return NextResponse.json({ error: "Ошибка создания резервной копии" }, { status: 500 })
  }
}

/** DELETE /api/admin/backup?filename=xxx — удалить резервную копию */
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  const filename = req.nextUrl.searchParams.get("filename")
  if (!filename || !/^[a-zA-Z0-9_.\-]+$/.test(filename)) {
    return NextResponse.json({ error: "Неверное имя файла" }, { status: 400 })
  }

  await ensureBackupsDir()
  const index = await readIndex()
  const entry = index.find((b) => b.filename === filename)
  if (!entry) return NextResponse.json({ error: "Резервная копия не найдена" }, { status: 404 })

  try {
    await fs.unlink(path.join(BACKUPS_DIR, filename)).catch(() => {})
    const updated = index.filter((b) => b.filename !== filename)
    await writeIndex(updated)

    await logAudit({
      userId: user.user_id,
      action: "Удаление резервной копии",
      tableName: "backup",
      oldValue: { backup_name: entry.backup_name },
      ipAddress: req.headers.get("x-forwarded-for"),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[admin/backup DELETE]", err)
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 })
  }
}

