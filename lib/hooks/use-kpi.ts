import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { KPIEmployeeDTO } from "@/lib/types/kpi.dto"

export function useKpiDashboard(year: string, period: string) {
    return useQuery({
        queryKey: ["kpi-dashboard", year, period],
        queryFn: async () => {
            // Mock data for KPI Dashboard
            return {
                totalKpi: 88.5,
                targetMet: 92,
                improvement: +5.4,
                stats: [
                    { name: "Предотвращение нарушений", value: 85, weight: 20 },
                    { name: "Удаленный контроль", value: 92, weight: 20 },
                    { name: "Выполнение годового плана", value: 88, weight: 20 },
                    { name: "Исполнение предложений", value: 95, weight: 10 },
                    { name: "Устранение нарушений", value: 82, weight: 10 },
                    { name: "Соблюдение сроков", value: 90, weight: 20 },
                ],
                trends: [
                    { month: "Янв", value: 82 },
                    { month: "Фев", value: 84 },
                    { month: "Мар", value: 88 },
                ]
            }
        }
    })
}

export function useKpiEmployees(params: { page: number; limit: number; search?: string }) {
    return useQuery({
        queryKey: ["kpi-employees", params],
        queryFn: async () => {
            // Mock employees data
            const items: KPIEmployeeDTO[] = [
                {
                    id: "1",
                    fullName: "Абдуллаев Олим Ходжаевич",
                    rank: "Полковник",
                    position: "Начальник отдела",
                    department: "Оперативный отдел",
                    employmentDate: "2010-01-01",
                    personnelNumber: "P-001",
                    status: "active"
                },
                {
                    id: "2",
                    fullName: "Сафаров Ярослав Богданович",
                    rank: "Майор",
                    position: "Старший офицер",
                    department: "Разведывательный отдел",
                    employmentDate: "2015-09-01",
                    personnelNumber: "P-002",
                    status: "active"
                }
            ]

            const filtered = params.search
                ? items.filter(e => e.fullName.toLowerCase().includes(params.search!.toLowerCase()))
                : items

            return {
                items: filtered,
                total: filtered.length
            }
        }
    })
}

export function useCreateKpiEmployee() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: any) => {
            console.log("Creating employee:", data)
            return { id: Math.random().toString(), ...data }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kpi-employees"] })
        }
    })
}

export function useUpdateKpiEmployee() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            console.log("Updating employee:", id, data)
            return { id, ...data }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kpi-employees"] })
        }
    })
}

export function useDeleteKpiEmployee() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            console.log("Deleting employee:", id)
            return { success: true }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kpi-employees"] })
        }
    })
}
