import { prisma } from '@/lib/db/prisma'
import crypto from 'crypto'
import os from 'os'

/**
 * Service for reporting system metrics and metrological assurance.
 */
export const DiagnosticsService = {
  /**
   * Log a performance metric for an operation.
   */
  async logMetric(data: {
    path: string
    method: string
    durationMs: number
    statusCode: number
    userId?: number
  }) {
    try {
      // Get basic OS metrics for reporting
      const cpuLoad = os.loadavg()[0] // 1 minute avg
      const memoryUsed = process.memoryUsage().heapUsed

      await (prisma as any).systemMetric.create({
        data: {
          path: data.path,
          method: data.method,
          duration_ms: data.durationMs,
          status_code: data.statusCode,
          user_id: data.userId,
          cpu_usage: cpuLoad,
          memory_usage: BigInt(memoryUsed),
        },
      })
    } catch (error) {
      console.error('Failed to log system metric:', error)
    }
  },

  /**
   * Create an immutable audit log entry with chaining hash.
   */
  async logImmutableEvent(data: {
    eventType: string
    entityType: string
    entityId?: number
    userId: number
    oldValue?: any
    newValue?: any
    ipAddress?: string
    userAgent?: string
  }) {
    try {
      // 1. Get the last record to chain the hash
      const lastEntry = await (prisma as any).immutableAuditLog.findFirst({
        orderBy: { id: 'desc' },
      })

      const previousHash = lastEntry ? lastEntry.current_hash : '0000000000000000000000000000000000000000000000000000000000000000'

      // 2. Prepare content for hashing
      const contentToHash = JSON.stringify({
        previousHash,
        eventType: data.eventType,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
        newValue: data.newValue,
        timestamp: new Date().toISOString()
      })

      // 3. Create SHA-256 hash
      const currentHash = crypto
        .createHash('sha256')
        .update(contentToHash)
        .digest('hex')

      // 4. Save to DB
      return await (prisma as any).immutableAuditLog.create({
        data: {
          event_type: data.eventType,
          entity_type: data.entityType,
          entity_id: data.entityId,
          user_id: data.userId,
          old_value: data.oldValue,
          new_value: data.newValue,
          ip_address: data.ipAddress,
          user_agent: data.userAgent,
          previous_hash: previousHash,
          current_hash: currentHash,
        },
      })
    } catch (error) {
      console.error('Failed to create immutable audit log:', error)
    }
  }
}
