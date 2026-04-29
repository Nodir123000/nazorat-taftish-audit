"use client"

import { useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { InspectorCard } from "@/components/personnel/inspector-card"
import type { Inspector } from "@/lib/types/inspector"
import type { EmployeeDTO } from "@/lib/types/personnel.dto"
import { Icons } from "@/components/icons"
import { useFinancialAudits, useAuditViolations } from "@/lib/hooks/use-audits"

interface PersonnelViewClientProps {
    id: string
    employee: EmployeeDTO | null
}

// Функция для преобразования EmployeeDTO в Inspector
function convertToInspector(dto: EmployeeDTO): Inspector {
    return {
        // Основные данные из DTO
        id: Number(dto.id),
        pin: dto.pin || "",
        source: dto.source || "System",
        licenseCount: dto.licenseCount || 0,
        militaryRank: dto.militaryRank || (typeof dto.rank === "string" ? dto.rank : ""),
        militaryUnit: dto.militaryUnit || "В/Ч-0000",
        rank: typeof dto.rank === "string" ? dto.rank : "",
        passportNumber: dto.passport?.number || dto.passportNumber || "",
        dateOfBirth: dto.dob || "",
        fullName: dto.fullName || `${dto.lastName || ""} ${dto.firstName || ""} ${dto.patronymic || ""}`.trim(),
        firstName: dto.firstName || "",
        lastName: dto.lastName || "",
        patronymic: dto.patronymic || "",
        position: dto.position,
        department: dto.department || "Управление финансового контроля",
        citizenship: "Узбекистан",
        placeOfBirth: dto.birthPlace || "",
        registrationAddress: dto.registrationAddress || "",
        actualAddress: dto.actualAddress || "",
        maritalStatus: dto.maritalStatus || "Женат",
        gender: dto.gender === "MALE" ? "MALE" : "FEMALE",
        nationality: dto.nationality || "Узбек",
        passportSeries: dto.passport?.series || "",
        passportIssueDate: dto.passport?.issueDate || "",
        passportExpiryDate: dto.passport?.expiryDate || "",
        passportIssuedBy: dto.passport?.issuedBy || "",
        militaryID: dto.serviceNumber || "",
        militaryIDIssueDate: "",
        militaryIDExpiryDate: "",
        serviceNumber: dto.serviceNumber || "",
        serviceStartDate: dto.serviceStartDate || "2020-01-01",
        specialization: dto.specialization || "",
        clearanceLevel: dto.clearanceLevel || "Форма 2",
        contactPhone: dto.contactPhone || "",
        email: dto.email || "",
        emergencyContact: dto.emergencyContact || "",
        emergencyPhone: dto.emergencyPhone || "",
        biography: dto.biography || "",

        // Служебные данные
        employmentDate: dto.serviceStartDate || "2020-01-01",
        contractEndDate: "2030-01-01",
        certifications: [],
        completedCourses: [],

        // KPI инспектора (will be updated with real data)
        auditsCompleted: dto.auditsCompleted || 0,
        auditsInProgress: dto.auditsInProgress || 0,
        auditsPlanned: dto.auditsPlanned || 0,
        violationsFound: dto.violationsFound || 0,
        totalDamageAmount: dto.totalDamageAmount || 0,
        kpiScore: dto.kpiScore || 75,
        kpiRating: dto.kpiRating || "satisfactory",

        // Категория инспектора
        inspectorCategory: (dto.inspectorCategory as any) || "Инспектор",
        specializations: [dto.specialization || ""],

        // История (подгружается динамически)
        auditHistory: [],
        inspectionResults: dto.inspectionResults || [],

        // Дополнительная информация
        workPhone: dto.workPhone || "",
        personalPhone: dto.personalPhone || "",
        militaryDistrict: dto.militaryDistrict || "Ташкентский военный округ",
        dislocation: dto.dislocation || "",
        notes: "",

        // История (будет подгружаться из БД)
        serviceHistory: [],
        contracts: []
    }
}

import { PersonnelEditDialog } from "@/components/reference/personnel-edit-dialog"
import { useState } from "react"

export default function PersonnelViewClient({ id, employee }: PersonnelViewClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mode = (searchParams?.get("mode") as "inspector" | "personnel") || "personnel"
    const action = searchParams?.get("action")
    const planId = searchParams?.get("planId")
    const [isEditOpen, setIsEditOpen] = useState(false)

    // Real-time statistical hooks
    const { data: audits = [] } = useFinancialAudits({ inspectorId: Number(id) })
    const { data: violations = [] } = useAuditViolations({ inspectorId: Number(id) })

    // Determine default section based on action
    const defaultSection = action === "fill-audit" ? "audits" : "personal"

    const inspector = useMemo(() => {
        if (!employee) return null
        const base = convertToInspector(employee)
        
        // Дополняем данными реального времени, сохраняя KPI с сервера
        const recoveredTotal = violations.reduce((sum: number, v: any) => sum + Number(v.recovered || 0), 0)
        const damageTotal = violations.reduce((sum: number, v: any) => sum + Number(v.amount || 0), 0)
        const recoveryRate = damageTotal > 0 ? (recoveredTotal / damageTotal) * 100 : 0
        const computedKpiScore = Math.round(recoveryRate)
        const kpiScore = computedKpiScore > 0 ? computedKpiScore : (base.kpiScore || 0)
        const kpiRating: Inspector["kpiRating"] =
            kpiScore >= 90 ? "excellent" :
            kpiScore >= 70 ? "good" :
            kpiScore >= 50 ? "satisfactory" :
            damageTotal > 0 ? "unsatisfactory" : (base.kpiRating || "satisfactory")

        return {
            ...base,
            auditsCompleted: audits.filter((a: any) => a.status === "completed").length,
            auditsInProgress: audits.filter((a: any) => a.status === "in_progress").length,
            auditsPlanned: audits.filter((a: any) => a.status === "planned").length,
            violationsFound: violations.length,
            totalDamageAmount: damageTotal,
            kpiScore,
            kpiRating,
        } as Inspector
    }, [employee, audits, violations])

    if (!inspector) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Icons.AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-4">Инспектор не найден</h1>
                <p className="text-muted-foreground mb-6">ID: {id || "не указан"}</p>
                <Button onClick={() => router.back()} className="bg-amber-600 hover:bg-amber-700">
                    Вернуться назад
                </Button>
            </div>
        )
    }

    return (
        <>
            <InspectorCard
                inspector={inspector}
                mode={mode}
                initialSection={defaultSection}
                action={action}
                planId={planId}
                onEdit={() => setIsEditOpen(true)}
            />
            <PersonnelEditDialog 
                isOpen={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                personnelId={Number(id)}
                onSuccess={() => router.refresh()}
            />
        </>
    )
}
