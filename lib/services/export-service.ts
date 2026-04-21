import type { AnnualPlan, QuarterlyPlan, MonthlyPlan } from "./planning-service"
import type { AuditFilters } from "./audit-service"
import type { ViolationFilters } from "./violation-service"
import type { DecisionFilters } from "./decision-service"
type Audit = any
type Violation = any
type Decision = any
import { formatDataForExport } from "@/lib/utils/export"

export const exportService = {
  // Format annual plans for export
  formatAnnualPlans(plans: AnnualPlan[]) {
    return formatDataForExport(plans, {
      year: "Год",
      status: "Статус",
      total_audits: "Всего ревизий",
      approved_by: "Утвердил",
      approved_date: "Дата утверждения",
      created_at: "Дата создания",
    })
  },

  // Format quarterly plans for export
  formatQuarterlyPlans(plans: QuarterlyPlan[]) {
    return formatDataForExport(plans, {
      year: "Год",
      quarter: "Квартал",
      status: "Статус",
      planned_audits: "Запланировано ревизий",
      created_at: "Дата создания",
    })
  },

  // Format monthly plans for export
  formatMonthlyPlans(plans: MonthlyPlan[]) {
    return formatDataForExport(plans, {
      year: "Год",
      month: "Месяц",
      status: "Статус",
      planned_audits: "Запланировано ревизий",
      created_at: "Дата создания",
    })
  },

  // Format audits for export
  formatAudits(audits: Audit[]) {
    return formatDataForExport(audits, {
      audit_number: "Номер ревизии",
      audit_type: "Тип ревизии",
      unit_name: "Подразделение",
      start_date: "Дата начала",
      end_date: "Дата окончания",
      status: "Статус",
      lead_auditor_name: "Руководитель",
      team_size: "Состав группы",
    })
  },

  // Format violations for export
  formatViolations(violations: Violation[]) {
    return formatDataForExport(violations, {
      violation_number: "Номер нарушения",
      category: "Категория",
      description: "Описание",
      amount: "Сумма (руб.)",
      severity: "Серьезность",
      status: "Статус",
      responsible_person: "Ответственное лицо",
      detected_date: "Дата выявления",
    })
  },

  // Format decisions for export
  formatDecisions(decisions: Decision[]) {
    return formatDataForExport(decisions, {
      decision_number: "Номер решения",
      decision_type: "Тип решения",
      description: "Описание",
      responsible_executor: "Ответственный исполнитель",
      deadline: "Срок исполнения",
      status: "Статус",
      issued_date: "Дата принятия",
    })
  },
}
