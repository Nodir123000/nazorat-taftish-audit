import { Suspense } from "react"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageSkeleton } from "@/components/loading-skeleton"
import PersonnelViewClient from "./personnel-view-client"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

const ALLOWED_ROLES = ["admin", "chief_inspector", "inspector"]

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (!ALLOWED_ROLES.includes(user.role)) redirect("/dashboard")

  const { id: idStr } = await params
  const id = Number.parseInt(idStr)

  // Показывать ПИНФЛ и паспортные данные только admin/chief_inspector
  const canViewSensitiveData = user.role === "admin" || user.role === "chief_inspector"

  let employee = null

  if (!isNaN(id)) {
    const item = await prisma.personnel.findUnique({
      where: { id },
      include: {
        ref_physical_persons: {
          select: {
            id: true,
            // ПИНФЛ передаётся только привилегированным ролям
            pinfl: canViewSensitiveData,
            passport_series: canViewSensitiveData,
            passport_number: canViewSensitiveData,
            passport_issued_by: true,
            passport_expiry_date: true,
            last_name: true,
            first_name: true,
            middle_name: true,
            birth_date: true,
            birth_place: true,
            address: true,
            actual_address: true,
            contact_phone: true,
            email: true,
            biography: true,
            gender_id: true,
            nationality_id: true,
            ref_genders: { select: { code: true } },
            ref_nationalities: { select: { name: true } },
          }
        },
        ref_ranks: true,
        ref_positions: true,
        ref_vus_list: true,
        ref_units: {
          include: {
            ref_military_districts: true,
            ref_areas: {
              include: {
                ref_regions: true
              }
            }
          }
        },
        financial_audits: {
          include: { financial_violations: true }
        }
      }
    })

    if (item) {
      // Аудиты уже включены через include выше — без второго запроса
      const audits = item.financial_audits || []

      const auditsCompleted = audits.filter((a: any) => a.status === 'completed').length
      const auditsInProgress = audits.filter((a: any) => a.status === 'in_progress' || a.status === 'draft').length
      const auditsPlanned = audits.filter((a: any) => a.status === 'planned').length

      let totalDamageAmount = 0
      let violationsFound = 0
      let totalRecovered = 0

      audits.forEach((a: any) => {
        const violations = a.financial_violations || []
        violationsFound += violations.length
        violations.forEach((v: any) => {
          totalDamageAmount += Number(v.amount || 0)
          totalRecovered += Number(v.recovered || 0)
        })
      })

      const recoveryRate = totalDamageAmount > 0 ? (totalRecovered / totalDamageAmount) * 100 : 0
      const kpiScore = Math.round(recoveryRate)

      let kpiRating: "excellent" | "good" | "satisfactory" | "unsatisfactory" = "good"
      if (kpiScore >= 90) kpiRating = "excellent"
      else if (kpiScore >= 70) kpiRating = "good"
      else if (kpiScore >= 50) kpiRating = "satisfactory"
      else if (totalDamageAmount > 0) kpiRating = "unsatisfactory"

      const inspectionResults = audits.map((a: any) => ({
        id: a.id.toString(),
        planId: a.prescription_id?.toString() || "",
        actNumber: a.act_number || a.id.toString(),
        actDate: a.date ? a.date.toISOString().split('T')[0] : "",
        controlAuthority: a.control_body || "КРУ МО",
        controlObject: a.unit || "",
        controlObjectRegion: a.unit_subtitle || "",
        inspectionDirection: a.inspection_direction || "",
        inspectionDepartment: "Финансовый",
        inspectionType: (a.inspection_type?.toLowerCase().includes("план") ? "planned" : "unplanned") as "planned" | "unplanned",
        totalAmount: a.financial_violations?.reduce((sum: number, v: any) => sum + Number(v.amount || 0), 0) || 0,
        recoveredAmount: a.financial_violations?.reduce((sum: number, v: any) => sum + Number(v.recovered || 0), 0) || 0,
        quantityStats: `${a.financial_violations?.length || 0} (0)`,
        responsiblePerson: a.cashier || "",
        status: (a.status === 'completed' ? 'checked' : 'in_progress') as "checked" | "in_progress",
        violations: a.financial_violations?.map((v: any) => ({
          id: v.id.toString(),
          violationType: v.type || "Финансовое",
          violationSubtype: v.category || "",
          source: v.source || "",
          amount: Number(v.amount || 0),
          recoveredAmount: Number(v.recovered || 0),
          quantityStats: "1 (0)",
          responsiblePerson: v.responsible || ""
        })) || []
      }))

      const getLoc = (obj: any, loc: string = 'ru'): string => {
        if (!obj) return ""
        if (typeof obj === 'string') return obj
        if (obj.name && typeof obj.name === 'object') return obj.name[loc] || obj.name['ru'] || ""
        return obj[loc] || obj['ru'] || ""
      }

      const p = item.ref_physical_persons

      // Пол из кода справочника (не магическое число)
      const genderCode = p?.ref_genders?.code?.toUpperCase()
      const gender = genderCode === 'M' || genderCode === 'MALE' ? "MALE" : "FEMALE"

      // Национальность из справочника
      const nationality = getLoc(p?.ref_nationalities) || ""

      // Дислокация — только из реальных связанных данных
      const dislocation = item.ref_units?.ref_areas
        ? `${getLoc(item.ref_units.ref_areas.name)}, ${getLoc(item.ref_units.ref_areas.ref_regions?.name ? item.ref_units.ref_areas.ref_regions : null)}`
        : ""

      employee = {
        id: item.id.toString(),
        pin: canViewSensitiveData ? (p?.pinfl || "") : "***",
        firstName: p?.first_name || "",
        lastName: p?.last_name || "",
        patronymic: p?.middle_name || "",
        fullName: `${p?.last_name || ""} ${p?.first_name || ""} ${p?.middle_name || ""}`.trim(),

        rank: getLoc(item.ref_ranks),
        militaryRank: getLoc(item.ref_ranks),
        position: getLoc(item.ref_positions),
        department: getLoc(item.ref_units),
        militaryUnit: getLoc(item.ref_units),
        militaryDistrict: item.ref_units?.ref_military_districts
          ? getLoc(item.ref_units.ref_military_districts.short_name || item.ref_units.ref_military_districts.name)
          : "",
        dislocation,

        dob: p?.birth_date?.toISOString() || "",
        gender: gender as "MALE" | "FEMALE",
        nationality,
        citizenship: "Узбекистан",
        maritalStatus: "",

        passportNumber: canViewSensitiveData ? `${p?.passport_series || ""}${p?.passport_number || ""}` : "***",
        passport: {
          series: canViewSensitiveData ? (p?.passport_series || "") : "***",
          number: canViewSensitiveData ? (p?.passport_number || "") : "***",
          issueDate: "",
          expiryDate: p?.passport_expiry_date?.toISOString() || "",
          issuedBy: p?.passport_issued_by || ""
        },
        passportIssuedBy: p?.passport_issued_by || "",
        passportExpiryDate: p?.passport_expiry_date?.toISOString() || "",
        birthPlace: p?.birth_place || "",
        actualAddress: p?.actual_address || "",
        registrationAddress: p?.address || "",
        biography: p?.biography || "",
        email: p?.email || "",
        contactPhone: p?.contact_phone || "",
        personalPhone: p?.contact_phone || "",
        workPhone: item.emergency_phone || "",
        emergencyContact: item.emergency_contact || "",
        emergencyPhone: item.emergency_phone || "",

        specialization: item.ref_vus_list?.code || "",

        inspectorCategory: item.category || "Инспектор",
        totalDamageAmount,
        kpiScore,
        kpiRating,
        serviceStartDate: item.service_start_date?.toISOString() || "",
        violationsFound: violationsFound,
        serviceNumber: item.service_number || "",
        clearanceLevel: item.clearance_level || "Нет данных",
        licenseCount: 0,
        auditCount: audits.length,
        auditsCompleted,
        auditsInProgress,
        auditsPlanned,
        
        inspectionResults: inspectionResults,

        createdAt: item.created_at?.toISOString() || new Date().toISOString(),
        updatedAt: item.updated_at?.toISOString() || new Date().toISOString(),
      };
    }
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <PersonnelViewClient employee={employee as any} id={idStr} />
      </Suspense>
    </ErrorBoundary>
  )
}
