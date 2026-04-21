import { useQuery } from "@tanstack/react-query"

export interface CommissionAssignment {
    assignmentId: number
    planId: number | null
    planNumber: string
    controlObject: string
    controlObjectSubtitle: string
    role: string
    isResponsible: boolean
    orderNumber: string
    orderDate: string
    period: string
    status: string
    year: number | null
    inspectionDirection: string | null
    inspectionDirectionLabel: string | null
    briefingDate: string | null
    prescriptionNum: string | null
    prescriptionDate: string | null
}

async function fetchCommissionAssignments(personnelId: number): Promise<CommissionAssignment[]> {
    const res = await fetch(`/api/planning/commission-assignments?personnelId=${personnelId}`)
    if (!res.ok) throw new Error("Ошибка загрузки назначений")
    const json = await res.json()
    return json.data || []
}

export function useCommissionAssignments(personnelId: number | null) {
    return useQuery<CommissionAssignment[]>({
        queryKey: ["commission-assignments", personnelId],
        queryFn: () => fetchCommissionAssignments(personnelId!),
        enabled: !!personnelId && personnelId > 0,
        staleTime: 30_000,
    })
}
