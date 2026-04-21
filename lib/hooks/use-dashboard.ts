import { useQuery } from "@tanstack/react-query"

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            // Mock data
            return {
                totalAudits: 125,
                plannedAudits: 45,
                unplannedAudits: 80,
                totalViolations: 342,
                recoveredAmount: 1450000000,
                pendingAmount: 230000000,
                activeInspectors: 12,
                efficiencyRate: 85,
                departmentBreakdown: [
                    { name: "Департамент 1", value: 45 },
                    { name: "Департамент 2", value: 30 },
                    { name: "Департамент 3", value: 25 },
                ]
            }
        }
    })
}

export function useRecentActivity() {
    return useQuery({
        queryKey: ["recent-activity"],
        queryFn: async () => {
            // Mock data
            return [
                {
                    id: "1",
                    type: "audit_created",
                    title: "Создана новая проверка",
                    description: "Финансовая проверка в войсковой части 12345",
                    timestamp: new Date().toISOString(),
                    user: "Иванов И.И."
                },
                {
                    id: "2",
                    type: "violation_registered",
                    title: "Зарегистрировано нарушение",
                    description: "Нецелевое использование средств в размере 50,000,000 сум",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    user: "Петров П.П."
                },
                {
                    id: "3",
                    type: "report_submitted",
                    title: "Отчет представлен",
                    description: "Годовой отчет по контрольно-ревизионной работе",
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    user: "Сидоров С.С."
                }
            ]
        }
    })
}
