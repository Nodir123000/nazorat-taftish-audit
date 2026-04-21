/**
 * Unified Report Data Aggregation
 * Функции для агрегации данных из всех модулей системы
 */

import {
    ALL_SHORTAGES,
    ALL_THEFTS,
    ALL_EXPENSES,
    ALL_OVERPAYMENTS,
    ALL_UNDERPAYMENTS
} from './financial-mock-data'

// ==================== MOCK DATA ====================

// Данные планирования (из planning/annual/page.tsx)
export const MOCK_ANNUAL_PLANS = [
    { id: 1, year: 2025, district: "Ташкентский военный округ", objects: 45, fsCount: 18, status: "Утверждён" },
    { id: 2, year: 2025, district: "Войска ПВО", objects: 20, fsCount: 8, status: "На рассмотрении" },
    { id: 3, year: 2025, district: "Категорированные объекты", objects: 15, fsCount: 6, status: "Черновик" },
    { id: 4, year: 2025, district: "Центральный военный округ", objects: 35, fsCount: 15, status: "Черновик" },
    { id: 5, year: 2025, district: "Восточный военный округ", objects: 28, fsCount: 12, status: "Черновик" },
    { id: 6, year: 2025, district: "Юго-Западный особый военный округ", objects: 12, fsCount: 6, status: "Черновик" },
    { id: 7, year: 2025, district: "Северо-Западный военный округ", objects: 12, fsCount: 6, status: "Черновик" },
]

// Данные приказов (из planning/orders/page.tsx)
export const MOCK_ORDERS = [
    { id: 1, number: "№ 15", date: "2025-01-10", unit: "Воинская часть 12345", status: "Действует" },
    { id: 2, number: "№ 23", date: "2025-01-08", unit: "Воинская часть 54321", status: "Действует" },
    { id: 3, number: "№ 42", date: "2024-12-15", unit: "Воинская часть 11111", status: "Завершён" },
    { id: 4, number: "№ 51", date: "2024-12-01", unit: "Воинская часть 22222", status: "Завершён" },
    { id: 5, number: "№ 55", date: "2024-11-20", unit: "Воинская часть 33333", status: "Действует" },
]

// Данные аудитов (из audits/financial-activity/page.tsx)
export const MOCK_AUDITS = [
    { id: 1, type: "Ревизия", unit: "ФС Ташкентского ВО", period: "01.01.2025 - 31.01.2025", status: "Проверено", violations: 3, amount: 1500000, recovered: 800000 },
    { id: 2, type: "Проверка", unit: "ФС ЦВО", period: "15.01.2025 - 28.02.2025", status: "Проверено", violations: 5, amount: 2500000, recovered: 1200000 },
    { id: 3, type: "Ревизия", unit: "ФС ВВО", period: "01.02.2025 - 28.02.2025", status: "В процессе", violations: 2, amount: 800000, recovered: 0 },
    { id: 4, type: "Проверка", unit: "ФС ЮЗВО", period: "10.02.2025 - 15.03.2025", status: "В процессе", violations: 0, amount: 0, recovered: 0 },
    { id: 5, type: "Ревизия", unit: "ФС СЗВО", period: "20.02.2025 - 20.03.2025", status: "Проверено", violations: 4, amount: 1800000, recovered: 900000 },
]

// Данные KPI (из kpi/analytics/page.tsx)
export const MOCK_KPI_DATA = {
    averageKPI: 84,
    totalEmployees: 3,
    excellentCount: 1,
    goodCount: 2,
    satisfactoryCount: 0,
    unsatisfactoryCount: 0,
    attestation: 95,
    workload: 120,
    employees: [
        { name: "Иванов И.И.", kpi: 91, rating: "Отлично" },
        { name: "Петров П.П.", kpi: 84, rating: "Хорошо" },
        { name: "Сидоров С.С.", kpi: 78, rating: "Хорошо" },
    ]
}

// ==================== AGGREGATION FUNCTIONS ====================

/**
 * Статистика по планированию
 */
export function getPlanningStats() {
    const plans = MOCK_ANNUAL_PLANS
    const orders = MOCK_ORDERS

    return {
        totalPlans: plans.length,
        approvedPlans: plans.filter(p => p.status === "Утверждён").length,
        pendingPlans: plans.filter(p => p.status === "На рассмотрении").length,
        draftPlans: plans.filter(p => p.status === "Черновик").length,
        totalObjects: plans.reduce((sum, p) => sum + p.objects, 0),
        totalFS: plans.reduce((sum, p) => sum + p.fsCount, 0),
        totalOrders: orders.length,
        activeOrders: orders.filter(o => o.status === "Действует").length,
        completedOrders: orders.filter(o => o.status === "Завершён").length,
    }
}

/**
 * Статистика по аудитам/ревизиям
 */
export function getAuditStats() {
    const audits = MOCK_AUDITS

    return {
        totalAudits: audits.length,
        completedAudits: audits.filter(a => a.status === "Проверено").length,
        inProgressAudits: audits.filter(a => a.status === "В процессе").length,
        totalViolations: audits.reduce((sum, a) => sum + a.violations, 0),
        totalAmount: audits.reduce((sum, a) => sum + a.amount, 0),
        totalRecovered: audits.reduce((sum, a) => sum + a.recovered, 0),
    }
}

/**
 * Статистика по нарушениям
 */
export function getViolationStats() {
    const shortages = ALL_SHORTAGES
    const thefts = ALL_THEFTS
    const expenses = ALL_EXPENSES
    const overpayments = ALL_OVERPAYMENTS
    const underpayments = ALL_UNDERPAYMENTS

    // Имущественные нарушения
    const assetViolations = {
        count: shortages.length,
        detected: shortages.reduce((sum, s) => sum + s.amountDetected, 0),
        recovered: shortages.reduce((sum, s) => sum + s.amountCompensated, 0),
    }

    // Финансовые нарушения (переплаты + недоплаты + хищения + расходы)
    const financialViolations = {
        overpayments: {
            count: overpayments.length,
            detected: overpayments.reduce((sum, o) => sum + o.amountDetected, 0),
            recovered: overpayments.reduce((sum, o) => sum + o.amountCompensated, 0),
        },
        thefts: {
            count: thefts.length,
            detected: thefts.reduce((sum, t) => sum + t.amountDetected, 0),
            recovered: thefts.reduce((sum, t) => sum + t.amountCompensated, 0),
        },
        expenses: {
            count: expenses.length,
            detected: expenses.reduce((sum, e) => sum + e.identifiedAmount, 0),
            recovered: expenses.reduce((sum, e) => sum + e.reimbursedAmount, 0),
        },
        underpayments: {
            count: underpayments.length,
            detected: underpayments.reduce((sum, u) => sum + u.amountDetected, 0),
            recovered: underpayments.reduce((sum, u) => sum + u.amountCompensated, 0),
        },
    }

    // Общие итоги
    const totalCount =
        assetViolations.count +
        financialViolations.overpayments.count +
        financialViolations.thefts.count +
        financialViolations.expenses.count +
        financialViolations.underpayments.count

    const totalDetected =
        assetViolations.detected +
        financialViolations.overpayments.detected +
        financialViolations.thefts.detected +
        financialViolations.expenses.detected +
        financialViolations.underpayments.detected

    const totalRecovered =
        assetViolations.recovered +
        financialViolations.overpayments.recovered +
        financialViolations.thefts.recovered +
        financialViolations.expenses.recovered +
        financialViolations.underpayments.recovered

    return {
        asset: assetViolations,
        financial: financialViolations,
        total: {
            count: totalCount,
            detected: totalDetected,
            recovered: totalRecovered,
            remainder: totalDetected - totalRecovered,
            efficiency: totalDetected > 0 ? Math.round((totalRecovered / totalDetected) * 100) : 0,
        }
    }
}

/**
 * Статистика по KPI
 */
export function getKpiStats() {
    return MOCK_KPI_DATA
}

/**
 * Сводная статистика для Executive Summary
 */
export function getUnifiedSummary() {
    const planning = getPlanningStats()
    const audits = getAuditStats()
    const violations = getViolationStats()
    const kpi = getKpiStats()

    return {
        planning,
        audits,
        violations,
        kpi,
        // Ключевые метрики для карточек
        cards: [
            {
                title: "Планов КРР",
                value: planning.totalPlans,
                subtitle: `${planning.approvedPlans} утверждено`,
                color: "blue"
            },
            {
                title: "Проверок",
                value: audits.totalAudits,
                subtitle: `${audits.completedAudits} завершено`,
                color: "green"
            },
            {
                title: "Нарушений",
                value: violations.total.count,
                subtitle: "выявлено",
                color: "orange"
            },
            {
                title: "Выявлено",
                value: violations.total.detected,
                subtitle: "сум",
                color: "red",
                format: "currency"
            },
            {
                title: "Возмещено",
                value: violations.total.recovered,
                subtitle: "сум",
                color: "emerald",
                format: "currency"
            },
            {
                title: "Эффективность",
                value: violations.total.efficiency,
                subtitle: "возмещения",
                color: "purple",
                format: "percent"
            },
        ]
    }
}

/**
 * Топ подразделений по нарушениям
 */
export function getTopViolationUnits() {
    const allItems = [
        ...ALL_SHORTAGES.map(s => ({ unit: s.unit, amount: s.amountDetected })),
        ...ALL_OVERPAYMENTS.map(o => ({ unit: o.unit, amount: o.amountDetected })),
        ...ALL_THEFTS.map(t => ({ unit: t.unit, amount: t.amountDetected })),
        ...ALL_EXPENSES.map(e => ({ unit: e.unit, amount: e.identifiedAmount })),
    ]

    // Группировка по подразделениям
    const grouped: Record<string, number> = {}
    allItems.forEach(item => {
        grouped[item.unit] = (grouped[item.unit] || 0) + item.amount
    })

    // Сортировка и топ-5
    return Object.entries(grouped)
        .map(([unit, amount]) => ({ unit, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
}
