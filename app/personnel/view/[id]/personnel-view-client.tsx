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
        placeOfBirth: "",
        registrationAddress: "",
        actualAddress: "",
        maritalStatus: "Женат",
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
        clearanceLevel: "Форма 2",
        contactPhone: dto.contacts?.[0]?.value || "",
        email: dto.contacts?.find(c => c.type === "EMAIL")?.value || "",
        emergencyContact: "",
        emergencyPhone: "",

        // Служебные данные
        employmentDate: dto.serviceStartDate || "2020-01-01",
        contractEndDate: "2030-01-01",
        certifications: [],
        completedCourses: [],

        // KPI инспектора (will be updated with real data)
        auditsCompleted: 0,
        auditsInProgress: 0,
        auditsPlanned: 0,
        violationsFound: 0,
        totalDamageAmount: 0,
        kpiScore: 75,
        kpiRating: "satisfactory",

        // Категория инспектора
        inspectorCategory: (dto.inspectorCategory as any) || "Инспектор",
        specializations: [dto.specialization || ""],

        // История (подгружается динамически)
        auditHistory: [],
        inspectionResults: [],

        // Дополнительная информация
        workPhone: dto.contacts?.find(c => c.type === "PHONE")?.value || "",
        personalPhone: dto.contacts?.[0]?.value || "",
        militaryDistrict: dto.militaryDistrict || "Ташкентский военный округ",
        dislocation: dto.dislocation || "",
        notes: "",

        // История (будет подгружаться из БД)
        serviceHistory: [],
        contracts: []
    }
}

export default function PersonnelViewClient({ id, employee }: PersonnelViewClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mode = (searchParams?.get("mode") as "inspector" | "personnel") || "personnel"
    const action = searchParams?.get("action")
    const planId = searchParams?.get("planId")

    // Real-time statistical hooks
    const { data: audits = [] } = useFinancialAudits({ inspectorId: Number(id) })
    const { data: violations = [] } = useAuditViolations({ inspectorId: Number(id) })

    // Determine default section based on action
    const defaultSection = action === "fill-audit" ? "audits" : "personal"

    const inspector = useMemo(() => {
        if (!employee) return null
        const base = convertToInspector(employee)
        
        // Populate with real-time stats
        return {
            ...base,
            auditsCompleted: audits.filter(a => a.status === "completed").length,
            auditsInProgress: audits.filter(a => a.status === "in_progress").length,
            auditsPlanned: audits.filter(a => a.status === "planned").length,
            violationsFound: violations.length,
            totalDamageAmount: violations.reduce((sum: number, v: any) => sum + Number(v.amount || 0), 0),
            kpiScore: audits.length > 2 ? 88 : 75,
            kpiRating: audits.length > 2 ? "good" : "satisfactory"
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

    return <InspectorCard
        inspector={inspector}
        mode={mode}
        initialSection={defaultSection}
        action={action}
        planId={planId}
    />
}
