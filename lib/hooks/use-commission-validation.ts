/**
 * use-commission-validation.ts
 * Hook for validating commission member assignments.
 * 
 * Business rules:
 * - SPECIALIST / MEMBER: Can only be assigned to ONE unit at a time per period.
 * - CHAIRMAN: Can be assigned to MULTIPLE units simultaneously.
 */
import { useState, useCallback } from "react"

export interface ConflictInfo {
    hasConflict: boolean
    conflictingUnit?: string
    conflictingOrder?: string
    conflictingPeriod?: string
    isChairman?: boolean
}

export interface CommissionValidationResult {
    isValid: boolean
    isWarning: boolean // Warning for chairman multi-assignment (allowed but informational)
    conflict: ConflictInfo | null
    message: string
}

const CHAIRMAN_ROLES = ["председатель", "chairman", "главный ревизор"]

function isChairmanRole(role: string): boolean {
    return CHAIRMAN_ROLES.some((r) => role.toLowerCase().includes(r))
}

/**
 * Fetches existing assignments for a given personnelId and checks for conflicts.
 */
export async function checkMemberAvailability(
    personnelId: number,
    role: string,
    periodStart: string,
    periodEnd: string,
    currentOrderId?: number
): Promise<CommissionValidationResult> {
    if (!personnelId || !periodStart || !periodEnd) {
        return { isValid: true, isWarning: false, conflict: null, message: "" }
    }

    try {
        const res = await fetch(
            `/api/planning/commission-assignments?personnelId=${personnelId}`
        )
        const data = await res.json()

        if (!data.success || !data.data?.length) {
            return { isValid: true, isWarning: false, conflict: null, message: "" }
        }

        const assignments: any[] = data.data

        // Find overlapping assignments within the period
        const start = new Date(periodStart).getTime()
        const end = new Date(periodEnd).getTime()

        for (const a of assignments) {
            // Skip the current order (for edit mode)
            if (currentOrderId && a.orderId === currentOrderId) continue

            // Skip assignments without periods
            if (!a.period) continue

            // Parse period "DD.MM.YYYY – DD.MM.YYYY"
            const parts = a.period.split("–").map((s: string) => s.trim())
            if (parts.length < 2) continue

            const [d1, m1, y1] = parts[0].split(".")
            const [d2, m2, y2] = parts[1].split(".")

            const aStart = new Date(`${y1}-${m1}-${d1}`).getTime()
            const aEnd = new Date(`${y2}-${m2}-${d2}`).getTime()

            const overlaps = start <= aEnd && end >= aStart

            if (overlaps) {
                const chairman = isChairmanRole(role)
                if (chairman) {
                    // Chairman: allowed but inform
                    return {
                        isValid: true,
                        isWarning: true,
                        conflict: {
                            hasConflict: false,
                            isChairman: true,
                            conflictingUnit: a.controlObject,
                            conflictingOrder: a.orderNumber,
                            conflictingPeriod: a.period,
                        },
                        message: `Председатель уже назначен в "${a.controlObject}" (${a.orderNumber}) на этот период. Это допустимо для председателя.`,
                    }
                } else {
                    // Specialist/Member: BLOCK
                    return {
                        isValid: false,
                        isWarning: false,
                        conflict: {
                            hasConflict: true,
                            isChairman: false,
                            conflictingUnit: a.controlObject,
                            conflictingOrder: a.orderNumber,
                            conflictingPeriod: a.period,
                        },
                        message: `⛔ Специалист уже направлен в "${a.controlObject}" на период ${a.period}. В один период специалист направляется только в одну воинскую часть.`,
                    }
                }
            }
        }

        return { isValid: true, isWarning: false, conflict: null, message: "" }
    } catch (err) {
        console.error("[use-commission-validation] Error:", err)
        return { isValid: true, isWarning: false, conflict: null, message: "" }
    }
}

/**
 * React hook that provides commission validation with loading state.
 */
export function useCommissionValidation() {
    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<CommissionValidationResult | null>(null)

    const validate = useCallback(
        async (
            personnelId: number,
            role: string,
            periodStart: string,
            periodEnd: string,
            currentOrderId?: number
        ) => {
            if (!personnelId) {
                setResult(null)
                return null
            }
            setIsChecking(true)
            try {
                const res = await checkMemberAvailability(
                    personnelId,
                    role,
                    periodStart,
                    periodEnd,
                    currentOrderId
                )
                setResult(res)
                return res
            } finally {
                setIsChecking(false)
            }
        },
        []
    )

    const reset = useCallback(() => {
        setResult(null)
    }, [])

    return { validate, reset, isChecking, result }
}
