// TypeScript types for АИС КРР

export interface User {
  user_id: number
  username: string
  fullname: string
  rank?: string
  position?: string
  role: "admin" | "chief_inspector" | "inspector" | "viewer" | "financial_head"
  email?: string
  phone?: string
  unit_id?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Unit {
  unit_id: number
  name: string
  unit_code: string
  subordination?: string
  location?: string
  commander_name?: string
  commander_rank?: string
  unit_type?: string
  is_active: boolean
}

export interface AuditPlan {
  plan_id: number
  year: number
  plan_number?: string
  start_date: string
  end_date: string
  unit_id?: number
  responsible_id?: number
  status: "draft" | "approved" | "in_progress" | "completed" | "cancelled"
  description?: string
  unit?: Unit
  responsible?: User
  period_type: "annual" | "quarterly" | "monthly" | "unplanned"
  period_value?: number // Quarter number (1-4) or month number (1-12)
  planned_audits_count?: number
  completed_audits_count?: number
  approval_date?: string
  approved_by_id?: number
  parent_plan_id?: number // Link to parent annual plan for quarterly/monthly
}

export interface AuditOrder {
  order_id: number
  order_num: string
  order_date: string
  unit_id?: number
  commander_id?: number
  plan_id?: number // Link to audit plan
  audit_type?: string
  start_date?: string
  end_date?: string
  status: "active" | "completed" | "cancelled"
  order_text?: string
  sent_date?: string
  received_date?: string
  delivery_status?: "sent" | "received" | "acknowledged"
  unit?: Unit
  commander?: User
  plan?: AuditPlan
}

export interface Violation {
  viol_id: number
  rev_id?: number
  viol_type_id?: number
  viol_date?: string
  amount?: number
  description?: string
  status: "registered" | "under_investigation" | "resolved" | "closed"
  viol_type?: ViolationType
}

export interface ViolationType {
  viol_type_id: number
  name: string
  code: string
  category: string
  severity: "Низкая" | "Средняя" | "Высокая" | "Критическая"
  description?: string
}

export interface ViolationPerson {
  person_id: number
  viol_id: number
  fullname: string
  rank?: string
  position?: string
  unit_id?: number
  responsibility_level?: string
}

export interface Decision {
  decision_id: number
  person_id?: number
  amount?: number
  date?: string
  decision_type?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
}

export interface Report {
  report_id: number
  rev_id?: number
  report_date?: string
  status: "draft" | "submitted" | "approved"
  total_violations?: number
  total_amount?: number
}

export interface AuditTask {
  task_id: number
  plan_id: number
  audit_subject: string
  audit_type: "preliminary" | "current" | "final" | "social_protection" | "deficiency_check"
  scheduled_date: string
  responsible_id?: number
  status: "planned" | "in_progress" | "completed" | "cancelled"
  description?: string
  plan?: AuditPlan
  responsible?: User
}

export interface CommissionMember {
  member_id: number
  order_id: number
  employee_id: number
  role: "chairman" | "member" | "secretary" | "expert"
  employee?: Employee
}

export interface Employee {
  employee_id: number
  fullname: string
  rank?: string
  position?: string
  specialization?: string
  unit_id?: number
  role: "admin" | "chief_inspector" | "inspector" | "viewer" | "financial_head"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuditResult {
  result_id: number
  task_id: number
  order_id?: number
  audit_date: string
  findings_count: number
  violations_count: number
  total_amount?: number
  report_text?: string
  status: "draft" | "submitted" | "approved"
  created_at: string
  updated_at: string
  task?: AuditTask
}

export type ModuleType =
  | "planning"
  | "execution"
  | "violations"
  | "decisions"
  | "reports"
  | "reference"
  | "admin"
  | "services"
  | "integration"

// Control Directions (направления контроля)
export interface ControlDirection {
  direction_id: number
  code: string
  name: string // Finance, Supply, Quartering, Medical, Mobilization, Communications, etc.
  description?: string
  is_active: boolean
}

// Control Types (виды контроля)
export interface ControlType {
  control_type_id: number
  name: string // Preliminary, Current, Final, Unplanned
  description?: string
  is_active: boolean
}

// Extended Unit with hierarchy support
export interface UnitExtended extends Unit {
  parent_unit_id?: number
  district_id?: number
  unit_type?: "ArmyUnit" | "HQ" | "Directorate" | "MilitaryDistrict"
  contact_person?: string
  contact_phone?: string
}

// Extended Employee with security clearance
export interface EmployeeExtended extends Employee {
  security_clearance?: "Top Secret" | "Secret" | "Confidential" | "Unclassified"
  current_workload?: number
  available_from?: string
  available_to?: string
}

// Extended AuditPlan with full КРР2 support
export interface AuditPlanExtended extends AuditPlan {
  plan_type: "Year" | "Quarter" | "Month" | "Consolidated"
  parent_plan_id?: number
  unit_scope?: string // JSON or comma-separated unit IDs
  planned_audit_count?: number
  approval_document_id?: number
  approved_date?: string
  approved_by_id?: number
  plan_status: "Draft" | "Submitted" | "Approved" | "Cancelled"
  created_by_id?: number
  updated_by_id?: number
}

// Audit Task (ревизионная проверка/мероприятие)
export interface AuditTaskExtended extends AuditTask {
  task_number: string
  unit_id: number
  control_type_id: number
  is_unplanned: boolean
  is_emergency: boolean
  directions?: number[] // Array of ControlDirection IDs
  planned_period_type: "Quarter" | "Month"
  planned_period_value: number
  estimated_inspectors_count?: number
  linked_order_id?: number
  task_status: "Planned" | "InProgress" | "Completed" | "Cancelled"
  created_by_id?: number
  updated_by_id?: number
}

// Order (приказ на проведение ревизии)
export interface Order {
  order_id: number
  order_number: string
  order_date: string
  issuer_id: number
  linked_plan_id?: number
  linked_task_id?: number
  order_type: "General" | "Specific"
  document_id?: number
  order_status: "Issued" | "Withdrawn"
  created_by_id?: number
  created_at: string
  updated_at: string
  issuer?: Employee
  document?: Document
}

// Commission Member (состав комиссии)
export interface CommissionMemberExtended extends CommissionMember {
  commission_id: number
  order_id: number
  employee_id: number
  role: "chairman" | "member" | "secretary" | "expert"
  is_responsible: boolean
  assigned_from?: string
  assigned_to?: string
  employee?: EmployeeExtended
}

// Order Delivery Log (журнал уведомлений/доставки)
export interface OrderDeliveryLog {
  log_id: number
  order_id: number
  unit_id: number
  sent_date: string
  received_date?: string
  delivery_status: "Sent" | "Delivered" | "Acknowledged" | "NotReceived"
  comments?: string
  created_at: string
  updated_at: string
}

// Audit Report (итоговый отчёт по проверке)
export interface AuditReport {
  report_id: number
  task_id: number
  order_id?: number
  report_date: string
  inspector_summary?: string
  final_status: "Accepted" | "RequiresAction"
  document_id?: number
  created_by_id?: number
  created_at: string
  updated_at: string
  task?: AuditTaskExtended
  document?: Document
}

// Finding (выявленные нарушения/предписания)
export interface Finding {
  finding_id: number
  report_id: number
  description: string
  severity: "Low" | "Medium" | "High"
  responsible_unit_id: number
  due_date: string
  finding_status: "Open" | "InProgress" | "Closed"
  closure_date?: string
  related_document_id?: number
  created_by_id?: number
  created_at: string
  updated_at: string
  report?: AuditReport
  responsible_unit?: Unit
}

// Plan Change Log (корректировки/история плана)
export interface PlanChangeLog {
  change_id: number
  plan_id: number
  change_type: "AddTask" | "RemoveTask" | "Reschedule" | "AdjustCount"
  description: string
  changed_by_id: number
  changed_at: string
  approved_by_id?: number
  approved_at?: string
  plan?: AuditPlanExtended
}

// Document (реестр файлов)
export interface Document {
  document_id: number
  file_name: string
  file_type: string
  uploaded_by_id: number
  uploaded_at: string
  storage_path: string
  checksum?: string
  file_size?: number
  description?: string
}

// Plan Execution Summary (аггрегат по кварталам/округам)
export interface PlanExecutionSummary {
  summary_id: number
  plan_id: number
  quarter?: number
  unit_id?: number
  planned_count: number
  completed_count: number
  in_progress_count: number
  percent_complete: number
  created_at: string
  updated_at: string
}

// Subordinate Unit on Allowance (воинская часть на финансовом довольствии)
export interface SubordinateUnitOnAllowance {
  unitCode: string // например "12346"
  unitName: string // например "Воинская часть 12346"
  allowanceType: "full" | "partial" // полное или частичное довольствие
  notes?: string // примечания
}

// Finding Action (исполнение предписаний)
export interface FindingAction {
  action_id: number
  finding_id: number
  action_date: string
  action_description: string
  responsible_id: number
  action_status: "Pending" | "InProgress" | "Completed"
  evidence_document_id?: number
  created_by_id?: number
  created_at: string
  updated_at: string
  finding?: Finding
  responsible?: Employee
}
