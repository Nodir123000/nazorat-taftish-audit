import type { Order, CommissionMember, Prescription, BriefingTopic } from "@/lib/types/orders"
import { mockApprovedPlans } from "./annual-plans"

// Mock данные для приказов
export const mockOrders: Order[] = [
    {
        id: 1,
        orderNum: "№ 15",
        date: "2025-01-10",
        unit: "1", // Воинская часть 00001
        commander: "1",
        period: "15.01.2025 - 25.01.2025",
        status: "Действует",
        annualPlanId: 5,  // ГП-2023-010 (в/ч 00001)
    },
    {
        id: 2,
        orderNum: "№ 23",
        date: "2025-02-01",
        unit: "6", // Воинская часть 00006
        commander: "1",
        period: "05.02.2025 - 15.02.2025",
        status: "Действует",
        annualPlanId: 3,  // ГП-2023-008 (в/ч 00006)
    },
    {
        id: 3,
        orderNum: "№ 31",
        date: "2025-03-05",
        unit: "11", // Воинская часть 00011
        commander: "1",
        period: "10.03.2025 - 20.03.2025",
        status: "Завершён",
        annualPlanId: 1,  // ГП-2025-001 (в/ч 00011)
    },
    {
        id: 4,
        orderNum: "№ 42",
        date: "2025-04-12",
        unit: "2", // Воинская часть 00002
        commander: "2",
        period: "15.04.2025 - 30.04.2025",
        status: "Действует",
        annualPlanId: 2,  // ГП-2024-012 (в/ч 00016)
    },
    {
        id: 5,
        orderNum: "№ 55",
        date: "2025-05-20",
        unit: "4", // Воинская часть 00004
        commander: "3",
        period: "25.05.2025 - 10.06.2025",
        status: "Завершён",
        annualPlanId: 4,  // ГП-2023-009 (в/ч 00021)
    },
    {
        id: 6,
        orderNum: "№ 61",
        date: "2025-06-05",
        unit: "5", // Воинская часть 00005
        commander: "2",
        period: "10.06.2025 - 20.06.2025",
        status: "Планируется",
        annualPlanId: 6,  // ГП-2023-011 (в/ч 00026)
    },
    {
        id: 7,
        orderNum: "№ 18",
        date: "2025-01-25",
        unit: "7", // Воинская часть 00007
        commander: "3",
        period: "01.02.2025 - 10.02.2025",
        status: "Завершён",
        annualPlanId: 13,  // ГП-2025-007 (в/ч 00007)
    },
    {
        id: 8,
        orderNum: "№ 33",
        date: "2025-03-15",
        unit: "8", // Воинская часть 00008
        commander: "4",
        period: "20.03.2025 - 05.04.2025",
        status: "Действует",
        annualPlanId: 15,  // ГП-2025-009 (в/ч 00008)
    },
    {
        id: 9,
        orderNum: "№ 44",
        date: "2025-04-20",
        unit: "9", // Воинская часть 00009
        commander: "4",
        period: "01.05.2025 - 15.05.2025",
        status: "Планируется",
        annualPlanId: 9,  // ГП-2025-003 (в/ч 00003)
    },
    {
        id: 10,
        orderNum: "№ 29",
        date: "2025-02-18",
        unit: "10", // Воинская часть 00010
        commander: "5",
        period: "25.02.2025 - 10.03.2025",
        status: "Завершён",
        annualPlanId: 1,  // ГП-2025-001 (в/ч 00011)
    },
    {
        id: 11,
        orderNum: "№ 51",
        date: "2025-05-10",
        unit: "12", // Воинская часть 00012
        commander: "5",
        period: "15.05.2025 - 30.05.2025",
        status: "Действует",
        annualPlanId: 8,  // ГП-2025-002 (в/ч 00012)
    },
    {
        id: 12,
        orderNum: "№ 58",
        date: "2025-05-28",
        unit: "13", // Воинская часть 00013
        commander: "6",
        period: "01.06.2025 - 15.06.2025",
        status: "Планируется",
        annualPlanId: 1,  // ГП-2025-001 (в/ч 00011)
    },
    {
        id: 13,
        orderNum: "№ 63",
        date: "2025-06-12",
        unit: "14", // Воинская часть 00014
        commander: "6",
        period: "20.06.2025 - 05.07.2025",
        status: "Планируется",
        annualPlanId: 2,  // ГП-2024-012 (в/ч 00016)
    },
    {
        id: 14,
        orderNum: "№ 21",
        date: "2025-02-05",
        unit: "15", // Воинская часть 00015
        commander: "7",
        period: "10.02.2025 - 20.02.2025",
        status: "Завершён",
        annualPlanId: 2,  // ГП-2024-012 (в/ч 00016)
    },
    {
        id: 15,
        orderNum: "№ 67",
        date: "2025-06-25",
        unit: "3", // Воинская часть 00003
        commander: "8",
        period: "01.07.2025 - 15.07.2025",
        status: "Планируется",
        annualPlanId: 9,  // ГП-2025-003 (в/ч 00003)
    },
]

// Mock данные для состава комиссии
export const mockCommissionMembers: CommissionMember[] = [
    {
        id: 1,
        orderNum: "№ 15",
        orderId: 1,
        role: "Председатель комиссии",
        name: "1",
        rank: "Полковник",
        position: "Начальник КРУ",
        unit: "1",
    },
    {
        id: 2,
        orderNum: "№ 15",
        orderId: 1,
        role: "Член комиссии",
        name: "2",
        rank: "Подполковник",
        position: "Старший инспектор",
        unit: "1",
    },
    {
        id: 3,
        orderNum: "№ 15",
        orderId: 1,
        role: "Член комиссии",
        name: "3",
        rank: "Майор",
        position: "Инспектор",
        unit: "1",
    },
    {
        id: 4,
        orderNum: "№ 23",
        orderId: 2,
        role: "Председатель комиссии",
        name: "8",
        rank: "Полковник",
        position: "Заместитель начальника КРУ",
        unit: "6",
    },
    {
        id: 5,
        orderNum: "№ 23",
        orderId: 2,
        role: "Член комиссии",
        name: "9",
        rank: "Майор",
        position: "Инспектор",
        unit: "6",
    },
]

// Mock данные для предписаний
export const mockPrescriptions: Prescription[] = [
    {
        id: 1,
        prescriptionNum: "№ 1",
        date: "2025-01-15",
        leader: "6",
        deputy: "9",
        organization: "31",
        period: "06.10.2025 - 30.10.2025",
        status: "Действует",
    },
    {
        id: 2,
        prescriptionNum: "№ 2",
        date: "2025-02-10",
        leader: "1",
        deputy: "2",
        organization: "1",
        period: "15.02.2025 - 28.02.2025",
        status: "Действует",
    },
    {
        id: 3,
        prescriptionNum: "№ 3",
        date: "2025-03-05",
        leader: "1",
        deputy: "3",
        organization: "6",
        period: "10.03.2025 - 25.03.2025",
        status: "Завершено",
    },
    {
        id: 4,
        prescriptionNum: "№ 4",
        date: "2025-04-18",
        leader: "6",
        deputy: "2",
        organization: "11",
        period: "20.04.2025 - 15.05.2025",
        status: "Действует",
    },
]

// Mock данные для тем инструктажа
export const mockBriefingTopics: BriefingTopic[] = []

// Вспомогательные функции
export function getOrderById(id: number): Order | undefined {
    return mockOrders.find((order) => order.id === id)
}

export function getAnnualPlanById(id: number) {
    return mockApprovedPlans.find(plan => plan.id === id)
}

export function getCommissionMembersByOrderId(orderId: number): CommissionMember[] {
    return mockCommissionMembers.filter((member) => member.orderId === orderId)
}

export function getAllOrders(): Order[] {
    return mockOrders
}

export function getAllCommissionMembers(): CommissionMember[] {
    return mockCommissionMembers
}

export function getAllPrescriptions(): Prescription[] {
    return mockPrescriptions
}

export function getAllBriefingTopics(): BriefingTopic[] {
    return mockBriefingTopics
}

// Статистика
export function getOrdersStats() {
    return {
        total: mockOrders.length,
        active: mockOrders.filter((o) => o.status === "Действует").length,
        completed: mockOrders.filter((o) => o.status === "Завершён").length,
        lastOrder: mockOrders[mockOrders.length - 1]?.orderNum || "—",
    }
}

export function getCommissionStats() {
    return {
        total: mockCommissionMembers.length,
        chairmen: mockCommissionMembers.filter((m) => m.role === "Председатель комиссии").length,
        members: mockCommissionMembers.filter((m) => m.role === "Член комиссии").length,
        activeCommissions: new Set(mockCommissionMembers.map((m) => m.orderNum)).size,
    }
}

export function getPrescriptionsStats() {
    return {
        total: mockPrescriptions.length,
        active: mockPrescriptions.filter((p) => p.status === "Действует").length,
        completed: mockPrescriptions.filter((p) => p.status === "Завершено").length,
        lastPrescription: mockPrescriptions[mockPrescriptions.length - 1]?.prescriptionNum || "—",
    }
}

export function getBriefingStats() {
    const totalMinutes = mockBriefingTopics.reduce((sum, t) => {
        const minutes = parseInt(t.duration.replace(" мин", ""), 10) || 0
        return sum + minutes
    }, 0)

    return {
        total: mockBriefingTopics.length,
        completed: mockBriefingTopics.filter((t) => t.completed).length,
        planned: mockBriefingTopics.filter((t) => !t.completed).length,
        totalMinutes,
    }
}
