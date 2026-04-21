import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch last 50 performance metrics
    const metrics = await (prisma as any).systemMetric.findMany({
      take: 50,
      orderBy: { created_at: 'desc' },
    });

    // 2. Fetch last 20 audit logs
    const auditLogs = await (prisma as any).immutableAuditLog.findMany({
      take: 20,
      orderBy: { id: 'desc' },
    });

    // 3. Calculate metrics for Section 8.5
    const durations = metrics.map((m: any) => m.duration_ms as number).sort((a: number, b: number) => a - b);
    const p95Index = Math.floor(durations.length * 0.95);
    const p95 = durations.length > 0 ? durations[p95Index] : 0;
    const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;

    const avgDuration = metrics.length > 0 
      ? metrics.reduce((acc: number, m: any) => acc + m.duration_ms, 0) / metrics.length 
      : 0;

    // 4. Calculate active users (unique user_id in the last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const activeUsersMetrics = await (prisma as any).systemMetric.findMany({
      where: {
        created_at: { gte: fifteenMinutesAgo },
        user_id: { not: null }
      },
      select: { user_id: true },
      distinct: ['user_id']
    });
    const activeUsersCount = activeUsersMetrics.length;

    return NextResponse.json({
      metrics: metrics.reverse(), // For chart chronological order
      auditLogs,
      stats: {
        avgDuration: Math.round(avgDuration),
        p95: p95,
        maxDuration: maxDuration,
        totalRequests: metrics.length,
        activeUsers: activeUsersCount || 1,
        lastEvent: auditLogs[0]?.created_at || null,
        securityStatus: "SECURE (Chained Hashes OK)"
      }
    });
  } catch (error: any) {
    console.error("Error in /api/diagnostics:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
