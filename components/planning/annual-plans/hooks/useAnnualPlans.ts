"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { loadMilitaryPersonnel, loadPhysicalPersons, loadSupplyDepartments } from "@/lib/api/reference-service"
import { createAnnualPlan, updateAnnualPlan, deleteAnnualPlan } from "@/lib/actions/planning-actions"

export type Plan = {
    id: string | number
    planId?: number
    planNumber: string
    year: number
    controlObject: string
    controlObjectSubtitle: string
    controlAuthority: string
    inspectionDirection: string | number
    inspectionType: string | number
    status: string | number
    periodCoveredStart: string
    periodCoveredEnd: string
    periodConducted: string
    subordinateUnitsOnAllowance: any[]
    objectsTotal?: number
    objectsFs?: number
    objectsOs?: number
    [key: string]: any
}

interface UseAnnualPlansProps {
    initialPlans?: any[]
    locale: "ru" | "uzLatn" | "uzCyrl"
}

export function useAnnualPlans({ initialPlans = [], locale }: UseAnnualPlansProps) {
    const router = useRouter()
    const [plans, setPlans] = useState<any[]>(initialPlans)
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // References
    const [militaryPersonnel, setMilitaryPersonnel] = useState<any[]>([])
    const [physicalPersons, setPhysicalPersons] = useState<any[]>([])
    const [supplyDepartments, setSupplyDepartments] = useState<any[]>([])

    // Selection states (for dialogs)
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    // Filter states
    const [filters, setFilters] = useState({
        search: "",
        year: "",
        status: "",
        period: "",
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Load references
    useEffect(() => {
        let active = true
        const fetchRefs = async () => {
            try {
                const [mp, pp, sd] = await Promise.all([
                    loadMilitaryPersonnel(locale),
                    loadPhysicalPersons(),
                    loadSupplyDepartments()
                ])
                if (active) {
                    setMilitaryPersonnel(mp)
                    setPhysicalPersons(pp)
                    setSupplyDepartments(sd)
                }
            } catch (error) {
                console.error("Error loading references:", error)
            }
        }
        fetchRefs()
        return () => { active = false }
    }, [locale])

    // Actions
    const handleCreatePlan = useCallback(async (data: any) => {
        setIsSubmitting(true)
        try {
            const res = await createAnnualPlan(data)
            if (res.success) {
                toast.success(
                    locale === "ru" ? "План успешно создан" : "Reja muvaffaqiyatli yaratildi",
                    { description: locale === "ru" ? `Запись №${data.planNumber || "---"} добавлена в реестр` : `Yozuv №${data.planNumber || "---"} reyestrga qo'shildi` }
                )
                router.refresh()
                return { success: true }
            } else {
                toast.error(locale === "ru" ? "Ошибка при создании" : "Yaratishda xatolik", {
                    description: res.error
                })
                return { success: false, error: res.error }
            }
        } catch (error) {
            toast.error(locale === "ru" ? "Произошла ошибка" : "Xatolik yuz berdi")
            return { success: false, error }
        } finally {
            setIsSubmitting(false)
        }
    }, [router, locale])

    const handleUpdatePlan = useCallback(async (id: string | number, data: any) => {
        setIsSubmitting(true)
        try {
            const res = await updateAnnualPlan(Number(id), data)
            if (res.success) {
                toast.success(
                    locale === "ru" ? "План обновлен" : "Reja yangilandi",
                    { description: locale === "ru" ? "Изменения успешно сохранены" : "O'zgarishlar saqlandi" }
                )
                router.refresh()
                return { success: true }
            } else {
                toast.error(locale === "ru" ? "Ошибка обновления" : "Yangilashda xatolik", {
                    description: res.error
                })
                return { success: false, error: res.error }
            }
        } catch (error) {
            toast.error(locale === "ru" ? "Произошла ошибка" : "Xatolik yuz berdi")
            return { success: false, error }
        } finally {
            setIsSubmitting(false)
        }
    }, [router, locale])

    const handleDeletePlan = useCallback(async (id: string | number) => {
        setIsSubmitting(true)
        try {
            const res = await deleteAnnualPlan(Number(id))
            if (res.success) {
                toast.success(
                    locale === "ru" ? "План удален" : "Reja o'chirildi",
                    { description: locale === "ru" ? "Запись успешно исключена из реестра" : "Yozuv reyestrdan o'chirildi" }
                )
                router.refresh()
                return { success: true }
            } else {
                toast.error(locale === "ru" ? "Ошибка удаления" : "O'chirishda xatolik", {
                    description: res.error
                })
                return { success: false, error: res.error }
            }
        } catch (error) {
            toast.error(locale === "ru" ? "Произошла ошибка" : "Xatolik yuz berdi")
            return { success: false, error }
        } finally {
            setIsSubmitting(false)
        }
    }, [router, locale])

    const handleBulkCreatePlans = useCallback(async (plans: any[]) => {
        setIsSubmitting(true)
        try {
            const { bulkCreateAnnualPlans } = await import("@/lib/actions/planning-actions")
            const res = await bulkCreateAnnualPlans(plans)
            if (res.success) {
                toast.success(
                    locale === "ru" ? "Массовое создание завершено" : "Ommaviy yaratish yakunlandi",
                    { description: locale === "ru" ? `Успешно сформировано ${res.count} планов` : `${res.count} ta reja yaratildi` }
                )
                router.refresh()
                return { success: true }
            } else {
                toast.error(locale === "ru" ? "Ошибка массового создания" : "Ommaviy yaratishda xatolik", {
                    description: res.error
                })
                return { success: false, error: res.error }
            }
        } catch (error) {
            toast.error(locale === "ru" ? "Произошла ошибка" : "Xatolik yuz berdi")
            return { success: false, error }
        } finally {
            setIsSubmitting(false)
        }
    }, [router, locale])

    return {
        // Data
        plans,
        militaryPersonnel,
        physicalPersons,
        supplyDepartments,
        loading,
        isSubmitting,

        // Selection
        selectedPlan,
        setSelectedPlan,
        isEditing,
        setIsEditing,

        // Filters & Pagination
        filters,
        setFilters,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,

        // CRUD
        handleCreatePlan,
        handleUpdatePlan,
        handleDeletePlan,
        handleBulkCreatePlans,
    }
}
