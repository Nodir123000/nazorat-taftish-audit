/**
 * Серверный помощник для записи в журнал аудита (таблица audit_log).
 * Используется в API-маршрутах при каждой операции изменения данных.
 */
import { prisma } from "@/lib/db/prisma"

const SENSITIVE_KEYS = new Set([
  "pinfl", "passport_series", "passport_number", "passport_expiry_date",
  "password_hash", "password", "secret", "token",
])

function sanitizeForAudit(obj: object): object {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) =>
      SENSITIVE_KEYS.has(k.toLowerCase()) ? [k, "***REDACTED***"] : [k, v]
    )
  )
}

interface AuditParams {
  userId?: number
  action: string
  tableName?: string
  recordId?: number
  oldValue?: object | null
  newValue?: object | null
  ipAddress?: string | null
}

export async function logAudit(params: AuditParams): Promise<void> {
  const safeOld = params.oldValue ? sanitizeForAudit(params.oldValue) : null
  const safeNew = params.newValue ? sanitizeForAudit(params.newValue) : null

  try {
    await prisma.audit_log.create({
      data: {
        user_id: params.userId ?? null,
        action: params.action,
        table_name: params.tableName ?? null,
        record_id: params.recordId ?? null,
        old_value: safeOld ? JSON.stringify(safeOld) : null,
        new_value: safeNew ? JSON.stringify(safeNew) : null,
        ip_address: params.ipAddress ?? null,
      },
    })
  } catch (err) {
    // Не прерываем основную операцию, но фиксируем факт сбоя
    console.error("[audit] CRITICAL: audit write failed", {
      action: params.action,
      userId: params.userId,
      tableName: params.tableName,
      recordId: params.recordId,
      err,
    })
    // TODO: в production добавить отправку алерта в систему мониторинга
  }
}
