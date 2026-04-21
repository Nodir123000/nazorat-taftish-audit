"use server"

import { revalidateTag } from "next/cache"
import { planningService } from "@/lib/services/planning-service"

export async function getAnnualPlans(filters?: any) {
  try {
    const plans = await planningService.getAnnualPlans(filters)
    return { success: true, data: plans }
  } catch (error) {
    console.error("Error fetching annual plans:", error)
    return { success: false, error: "Failed to fetch plans" }
  }
}

/** Статус плана считается «Утверждён», если значение равно 101 (из классификатора) или строке "approved" */
function isApprovedStatus(status: any): boolean {
  return status === 101 || status === "101" || status === "approved"
}

export async function createAnnualPlan(formData: {
  year: number
  unit: string
  startDate: string
  endDate: string
  responsible: string
  incomingNumber: string
  incomingDate: string
  objectsTotal?: number
  objectsFs?: number
  objectsOs?: number
  expenseClassification?: string
  supplyDepartment?: string
  controlAuthority?: string
  controlObject?: string
  inspectionDirection?: number
  inspectionType?: number
  periodCoveredStart?: string
  periodCoveredEnd?: string
  periodConducted?: string
  subordinateUnitsOnAllowance?: any[]
  status?: any
  planNumber?: string
}) {
  try {
    const newPlan = await planningService.createAnnualPlan(formData)

    // Авто-создание приказа при утверждении плана
    if (isApprovedStatus(formData.status ?? 101)) {
      try {
        await planningService.createOrder({
          planId: newPlan.planId ?? (newPlan as any).id,
          unitId: Number(formData.unit) || null,
          orderNumber: `Пр-${formData.planNumber || newPlan.planId || Date.now()}`,
          orderDate: new Date().toISOString(),
          orderType: "revision",
          status: "draft",
          orderText: null,
          // issuerId не передаём — createOrder сам найдёт активного пользователя
        })
      } catch (orderErr) {
        // Не блокируем создание плана из-за ошибки приказа — просто логируем
        console.warn("[createAnnualPlan] Не удалось авто-создать приказ:", orderErr)
      }
    }

    revalidateTag("annual-plans", "default")

    return {
      success: true,
      data: newPlan,
      message: "Годовой план успешно создан",
    }
  } catch (error) {
    console.error("Error creating annual plan:", error)
    return {
      success: false,
      error: `Ошибка при создании плана: ${(error as Error).message || String(error)}`,
    }
  }
}

export async function updateAnnualPlan(
  id: number,
  formData: {
    year?: number
    unit?: string
    startDate?: string
    endDate?: string
    responsible?: string
    status?: any
    incomingNumber?: string
    incomingDate?: string
    objectsTotal?: number
    objectsFs?: number
    objectsOs?: number
    expenseClassification?: string
    supplyDepartment?: string
    controlAuthority?: string
    controlObject?: string
    inspectionDirection?: number
    inspectionType?: number
    periodCoveredStart?: string
    periodCoveredEnd?: string
    periodConducted?: string
    subordinateUnitsOnAllowance?: any[]
    planNumber?: string
  },
) {
  try {
    const updatedPlan = await planningService.updateAnnualPlan(id, formData)

    // Авто-создание приказа при утверждении плана (только если ещё нет ни одного приказа)
    if (isApprovedStatus(formData.status)) {
      try {
        const existing = await planningService.getOrders({ plan_id: id })
        if (!existing || existing.total === 0) {
          await planningService.createOrder({
            planId: id,
            unitId: formData.unit ? Number(formData.unit) : null,
            orderNumber: `Пр-${formData.planNumber || id}`,
            orderDate: new Date().toISOString(),
            orderType: "revision",
            status: "draft",
            orderText: null,
          })
        }
      } catch (orderErr) {
        console.warn("[updateAnnualPlan] Не удалось авто-создать приказ:", orderErr)
      }
    }

    revalidateTag("annual-plans", "default")

    return {
      success: true,
      data: updatedPlan,
      message: "Годовой план успешно обновлен",
    }
  } catch (error) {
    console.error("Error updating annual plan:", error)
    return {
      success: false,
      error: "Ошибка при обновлении плана",
    }
  }
}

export async function deleteAnnualPlan(id: number) {
  try {
    await planningService.deleteAnnualPlan(id.toString())
    revalidateTag("annual-plans", "default")

    return {
      success: true,
      message: "Годовой план успешно удален",
    }
  } catch (error) {
    console.error("Error deleting annual plan:", error)
    return {
      success: false,
      error: "Ошибка при удалении плана",
    }
  }
}

export async function approvePlan(id: number, approverNotes?: string) {
  try {
    // TODO: Connect to database and update approval status
    console.log("[v0] Approving plan:", id, approverNotes)

    revalidateTag("annual-plans", "default")
    revalidateTag("approved-plans", "default")

    return {
      success: true,
      message: "Plan approved successfully",
    }
  } catch (error) {
    console.error("[v0] Error approving plan:", error)
    return {
      success: false,
      error: "Failed to approve plan",
    }
  }
}

export async function assignInspector(formData: {
  planNumber: string
  inspector: string
  role: string
  startDate: string
  endDate: string
  conflictOfInterest: string
}) {
  try {
    // TODO: Connect to database and create assignment
    console.log("[v0] Assigning inspector:", formData)

    const newAssignment = {
      id: Math.random(),
      recordId: `ИН-${new Date().getFullYear()}-${Math.random().toString().slice(2, 5)}`,
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    revalidateTag("inspector-assignments", "default")

    return {
      success: true,
      data: newAssignment,
      message: "Inspector assigned successfully",
    }
  } catch (error) {
    console.error("[v0] Error assigning inspector:", error)
    return {
      success: false,
      error: "Failed to assign inspector",
    }
  }
}

export async function updateExecutionStatus(
  executionId: number,
  completedAudits: number,
  inProgressAudits: number,
  notes?: string,
) {
  try {
    // TODO: Connect to database and update execution status
    console.log("[v0] Updating execution status:", executionId, {
      completedAudits,
      inProgressAudits,
      notes,
    })

    revalidateTag("execution-control", "default")

    return {
      success: true,
      message: "Execution status updated successfully",
    }
  } catch (error) {
    console.error("[v0] Error updating execution status:", error)
    return {
      success: false,
      error: "Failed to update execution status",
    }
  }
}

export async function exportPlansToCSV(plans: any[]) {
  try {
    const headers = ["ID", "Год", "Воинская часть", "Дата начала", "Дата окончания", "Ответственный", "Статус"]
    const rows = plans.map((plan) => [
      plan.id,
      plan.year,
      plan.unit,
      plan.startDate,
      plan.endDate,
      plan.responsible,
      plan.status,
    ])

    let csv = headers.join(",") + "\n"
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n"
    })

    return {
      success: true,
      data: csv,
      filename: `annual_plans_${new Date().toISOString().split("T")[0]}.csv`,
    }
  } catch (error) {
    console.error("[v0] Error exporting plans:", error)
    return {
      success: false,
      error: "Failed to export plans",
    }
  }
}
