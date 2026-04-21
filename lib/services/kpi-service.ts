import { prisma } from "@/lib/db/prisma";

export interface KPIMetrics {
  r1: number; // Исполнительность (%)
  r2: number; // Объем выявления (сум)
  r3: number; // Эффективность возмещения (%)
  r4: number; // Дисциплина дедлайнов (%)
  r5: number; // Профессиональный индекс (кол-во тяжких)
}

export interface RegionalKPI extends KPIMetrics {
  regionName: string;
  auditCount: number;
}

/**
 * Сервис для расчета KPI и показателей эффективности (ПС-10)
 */
export async function getOverallKPIMetrics(year: number): Promise<KPIMetrics> {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  try {
    // 1. Расчет R1: Исполнительность
    const totalAudits = await prisma.audits.count({
      where: { start_date: { gte: startDate, lte: endDate } }
    });
    
    const completedOnTime = await prisma.audits.count({
      where: {
        start_date: { gte: startDate, lte: endDate },
        status: 'completed'
      }
    });

    const r1 = totalAudits > 0 ? (completedOnTime / totalAudits) * 100 : 0;

    // 2. Расчет R2 и R3
    const violations = await prisma.violations.aggregate({
      where: { detected_date: { gte: startDate, lte: endDate } },
      _sum: { amount: true }
    });

    const financialViolations = await prisma.financial_violations.aggregate({
      where: { created_at: { gte: startDate, lte: endDate } },
      _sum: { amount: true, recovered: true }
    });

    const totalAmount = Number(violations._sum.amount || 0) + Number(financialViolations._sum.amount || 0);
    const totalRecovered = Number(financialViolations._sum.recovered || 0);
    
    const r2 = totalAmount;
    const r3 = totalAmount > 0 ? (totalRecovered / totalAmount) * 100 : 0;

    // 3. Расчет R4: Дисциплина дедлайнов
    const totalDecisions = await prisma.decisions.count({
      where: { created_at: { gte: startDate, lte: endDate } }
    });
    
    const overdueDecisions = await prisma.decisions.count({
      where: {
        created_at: { gte: startDate, lte: endDate },
        status: 'overdue'
      }
    });

    const r4 = totalDecisions > 0 ? ((totalDecisions - overdueDecisions) / totalDecisions) * 100 : 100;

    // 4. Расчет R5: Профессиональный индекс
    const criticalViolations = await prisma.violations.count({
      where: {
        detected_date: { gte: startDate, lte: endDate },
        severity: { in: ['CRITICAL', 'HIGH'] }
      }
    });

    return {
      r1: Math.round(r1),
      r2: Math.round(r2),
      r3: Math.round(r3),
      r4: Math.round(r4),
      r5: criticalViolations
    };
  } catch (err) {
    console.error("Overall KPI calculation error:", err);
    throw err;
  }
}

/**
 * Получение KPI в разрезе регионов
 */
export async function getRegionalKPIMetrics(year: number): Promise<RegionalKPI[]> {
  try {
    const districts = await prisma.ref_military_districts.findMany({
        include: {
            ref_units: {
                include: {
                    audits: {
                        where: {
                            start_date: {
                                gte: new Date(year, 0, 1),
                                lte: new Date(year, 11, 31)
                            }
                        },
                        include: {
                            violations: true
                        }
                    }
                }
            }
        }
    });

    return districts.map(district => {
      let totalR2 = 0;
      let criticalCount = 0;
      let auditCount = 0;

      district.ref_units.forEach(unit => {
        unit.audits.forEach(audit => {
          auditCount++;
          audit.violations.forEach(v => {
            totalR2 += Number(v.amount || 0);
            if (['CRITICAL', 'HIGH'].includes(v.severity)) criticalCount++;
          });
        });
      });

      const nameObj = district.name as any;
      const regionName = nameObj?.ru || nameObj?.uz || "Неизвестно";

      return {
        regionName,
        auditCount,
        r1: 100,
        r2: Math.round(totalR2),
        r3: 0,
        r4: 100,
        r5: criticalCount
      };
    });
  } catch (err) {
    console.error("Regional KPI calculation error:", err);
    throw err;
  }
}
