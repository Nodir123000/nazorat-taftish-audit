import type { PersonnelMember } from "./personnel"
export interface Contract {
  id: string
  seriesAndNumber: string
  startDate: string
  endDate: string
}

export interface Certification {
  id: string
  name: string
  issueDate: string
  expiryDate: string
  issuedBy: string
  status: "active" | "expired" | "expiring"
}

export interface CompletedCourse {
  id: string
  name: string
  completionDate: string
  institution: string
  certificateNumber: string
}

export interface ServiceHistoryEntry {
  id: string
  startDate: string
  endDate?: string
  position: string
  unit: string
  rank: string
  militaryDistrict?: string
  shdk?: string
  actualRank?: string
  personnelOrderAppointmentDate?: string
  personnelOrderExclusionDate?: string
  dailyOrderEnrollmentDate?: string
  dailyOrderExclusionDate?: string
  subdivision?: string
  reasonForChange?: string
}

export interface AuditRecord {
  id: string
  // New fields for updated UI (all optional for backward compatibility)
  planId?: string
  controlObject?: string
  controlObjectSubtext?: string
  unitsOnAllowance?: string
  inspectionDirection?: string
  inspectionSubtext?: string
  periodStart?: string
  periodEnd?: string
  orderNumber?: string
  orderDate?: string
  briefingStatus?: "conducted" | "not_conducted"
  prescriptions?: string
  groupComposition?: string
  status: "active" | "completed" | "in_progress" | "planned"

  // Legacy fields (kept for compatibility if needed, but UI will use new ones)
  auditNumber?: string
  auditType?: string
  organizationName?: string
  startDate?: string
  endDate?: string
  violationsFound?: number
  damageAmount?: number
}

export interface InspectionViolation {
  id: string
  violationType: string
  violationSubtype: string
  source: string
  amount: number
  recoveredAmount: number
  quantityStats: string
  responsiblePerson: string
}

export interface InspectionResult {
  id: string
  planId: string
  actNumber: string
  actDate: string
  controlAuthority: string
  controlObject: string
  controlObjectRegion: string
  inspectionDirection: string
  inspectionDepartment: string
  inspectionType: "planned" | "unplanned"
  totalAmount: number
  recoveredAmount: number
  quantityStats: string
  responsiblePerson: string
  status: "checked" | "in_progress"
  violations: InspectionViolation[]
}

export interface Inspector extends PersonnelMember {
  // Служебные данные
  employmentDate: string
  contractEndDate: string
  certifications: Certification[]
  completedCourses: CompletedCourse[]

  // KPI инспектора
  auditsCompleted: number
  auditsInProgress: number
  auditsPlanned: number
  violationsFound: number
  totalDamageAmount: number
  kpiScore: number
  kpiRating: "excellent" | "good" | "satisfactory" | "unsatisfactory"

  // Категория инспектора
  inspectorCategory: "Младший инспектор" | "Инспектор" | "Старший инспектор" | "Главный инспектор"
  specializations: string[]

  // История ревизий
  auditHistory: AuditRecord[]
  inspectionResults?: InspectionResult[] // Результаты проверок
  serviceHistory?: ServiceHistoryEntry[] // История военной службы
  contracts?: Contract[] // Список контрактов

  // Дополнительная информация
  workPhone: string
  personalPhone: string
  militaryDistrict: string
  dislocation?: string
  notes: string
}

// Функция получения цвета категории инспектора
export function getInspectorCategoryColor(category: Inspector["inspectorCategory"]): string {
  switch (category) {
    case "Главный инспектор":
      return "bg-purple-500/20 text-purple-700 border-purple-500/50"
    case "Старший инспектор":
      return "bg-blue-500/20 text-blue-700 border-blue-500/50"
    case "Инспектор":
      return "bg-emerald-500/20 text-emerald-700 border-emerald-500/50"
    case "Младший инспектор":
      return "bg-amber-500/20 text-amber-700 border-amber-500/50"
    default:
      return "bg-gray-500/20 text-gray-700 border-gray-500/50"
  }
}

// Функция получения цвета KPI рейтинга
export function getKpiRatingColor(rating: Inspector["kpiRating"]): string {
  switch (rating) {
    case "excellent":
      return "bg-green-500/20 text-green-700 border-green-500/50"
    case "good":
      return "bg-blue-500/20 text-blue-700 border-blue-500/50"
    case "satisfactory":
      return "bg-amber-500/20 text-amber-700 border-amber-500/50"
    case "unsatisfactory":
      return "bg-red-500/20 text-red-700 border-red-500/50"
    default:
      return "bg-gray-500/20 text-gray-700 border-gray-500/50"
  }
}

// Функция получения текста KPI рейтинга
export function getKpiRatingText(rating: Inspector["kpiRating"]): string {
  switch (rating) {
    case "excellent":
      return "Отлично"
    case "good":
      return "Хорошо"
    case "satisfactory":
      return "Удовлетворительно"
    case "unsatisfactory":
      return "Неудовлетворительно"
    default:
      return "Не определено"
  }
}
