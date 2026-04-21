// Типы данных для модуля "Приказы"

export type OrderStatus = "Черновик" | "На подписи" | "Действует" | "Завершён" | "Отменён" | "Планируется"
export type PrescriptionStatus = "Действует" | "Завершено"
export type CommissionRole = "Председатель комиссии" | "Член комиссии" | "Секретарь комиссии" | "Привлечённый специалист"

export interface Order {
    id: number
    orderNum: string
    date: string
    unit: string
    commander: string
    period: string
    status: OrderStatus
    annualPlanId?: number  // ID из реестра годовых планов
}

export interface CommissionMember {
    id: number
    orderNum: string
    orderId?: number
    role: CommissionRole
    name: string
    rank: string
    position: string
    unit: string
    personnelId?: number | null
    userId?: number | null
}

export interface Prescription {
    id: number
    prescriptionNum: string
    date: string
    leader: string
    deputy: string
    organization: string
    period: string
    status: PrescriptionStatus
}

export interface BriefingTopic {
    id: number
    topic: string
    duration: string
    completed: boolean
    notes: string
    conductedDate?: string
    plannedDate?: string
}

// Типы для фильтров
export interface OrdersFilters {
    search: string
    status: string
    dateFrom: string
}

export interface CommissionFilters {
    search: string
    role: string
    orderNum: string
}

export interface PrescriptionsFilters {
    search: string
    status: string
    dateFrom: string
}

export interface BriefingFilters {
    search: string
    status: string
    date: string
}

// Типы для статистических карточек
export interface StatsCardData {
    title: string
    value: number | string
    subtitle: string
    icon: React.ComponentType<{ className?: string }>
    colorScheme: "blue" | "green" | "orange" | "purple" | "emerald" | "indigo" | "rose" | "amber" | "cyan" | "teal" | "violet" | "pink" | "lime"
}

// Утилитарные функции
export function getOrderStatusVariant(status: OrderStatus): "default" | "secondary" {
    return status === "Действует" ? "default" : "secondary"
}

export function getPrescriptionStatusVariant(status: PrescriptionStatus): "default" | "secondary" {
    return status === "Действует" ? "default" : "secondary"
}

export function getRoleVariant(role: CommissionRole): "default" | "outline" {
    return role === "Председатель комиссии" ? "default" : "outline"
}
