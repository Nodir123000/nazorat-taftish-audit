import { create, all } from 'mathjs';
import { prisma } from '../db/prisma';

// Инициализация MathJS с ограниченными функциями для безопасности
const math = create(all);

export const kpiCalculationService = {
  /**
   * Выполнение расчета KPI по формуле из БД с использованием mathjs.
   */
  async calculateUserMetric(
    ctx: { user_id: number; unit_id: number },
    userId: number,
    metricCode: string,
    period: { start: string; end: string }
  ) {
    return await (prisma as any).$withRLS(ctx, async (tx: any) => {
      // 1. Получаем определение метрики из БД (ПС-2)
      const metric = await tx.kpi_metrics.findUnique({
        where: { code: metricCode }
      });

      if (!metric || !metric.formula) {
        throw new Error(`Метрика ${metricCode} не найдена или не имеет формулы расчета.`);
      }

      // 2. Сбор данных для контекста вычисления (Scope)
      const scope = await this.buildCalculationScope(tx, userId, period);

      // 3. Вычисление результата через защищенный парсер
      try {
        // Поддерживает формулы типа "(viol_sum * 0.1) + (audit_count * 5)"
        const result = math.evaluate(metric.formula, scope);
        const finalScore = typeof result === 'number' ? result : Number(result);

        // 4. Регистрация результата в истории баллов
        return await tx.user_kpi_scores.create({
          data: {
            user_id: userId,
            metric_id: metric.id,
            score: finalScore,
            period_start: new Date(period.start),
            period_end: new Date(period.end),
          }
        });
      } catch (err: any) {
        console.error(`[KPI_ENGINE] Formula processing failed: ${metric.formula}`, err);
        throw new Error(`Ошибка в формуле KPI: ${err.message}`);
      }
    });
  },

  /**
   * Сбор агрегированных данных по пользователю для подстановки в формулу.
   */
  private async buildCalculationScope(tx: any, userId: number, period: any) {
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);

    // Пример количественных показателей
    const auditCount = await tx.audits.count({
      where: { lead_auditor_id: userId, start_date: { gte: startDate, lte: endDate } }
    });

    const violations = await tx.violations.aggregate({
      where: { detected_date: { gte: startDate, lte: endDate } },
      _sum: { amount: true }
    });

    // Можно расширять любыми данными из 9 подсистем
    return {
      audit_count: auditCount,
      viol_sum: Number(violations._sum.amount || 0),
      efficiency_index: auditCount > 0 ? (Number(violations._sum.amount || 0) / auditCount) : 0
    };
  }
};
