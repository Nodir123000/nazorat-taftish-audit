/**
 * Серверный помощник для записи в журнал аудита (таблица audit_log).
 * Используется в API-маршрутах при каждой операции изменения данных.
 */
import { prisma } from "@/lib/db/prisma"

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
  try {
    await prisma.audit_log.create({
      data: {
        user_id: params.userId ?? null,
        action: params.action,
        table_name: params.tableName ?? null,
        record_id: params.recordId ?? null,
        old_value: params.oldValue ? JSON.stringify(params.oldValue) : null,
        new_value: params.newValue ? JSON.stringify(params.newValue) : null,
        ip_address: params.ipAddress ?? null,
      },
    })
  } catch (err) {
    // Ошибка аудита не должна прерывать основную операцию
    console.error("[audit] Не удалось записать журнал аудита:", err)
  }
}
