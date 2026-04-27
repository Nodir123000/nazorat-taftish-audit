import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageSkeleton } from "@/components/loading-skeleton"
import PersonnelViewClient from "./personnel-view-client"
import { prisma } from "@/lib/db/prisma"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = Number.parseInt(idStr)

  let employee = null

  if (!isNaN(id)) {
    const item = await prisma.personnel.findUnique({
      where: { id },
      include: {
        ref_physical_persons: true,
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
        }
      }
    })

    if (item) {
      // Fetch Audit Statistics
      const audits = await prisma.financial_audits.findMany({
        where: { inspector_id: item.id },
        include: { financial_violations: true }
      });

      const auditsCompleted = audits.filter(a => a.status === 'completed').length;
      const auditsInProgress = audits.filter(a => a.status === 'in_progress' || a.status === 'draft').length;
      const auditsPlanned = audits.filter(a => a.status === 'planned').length;

      let totalDamageAmount = 0;
      let violationsFound = 0;
      let totalRecovered = 0;

      audits.forEach(a => {
        const violations = (a.financial_violations as any[]) || [];
        violationsFound += violations.length;
        violations.forEach(v => {
          totalDamageAmount += Number(v.amount || 0);
          totalRecovered += Number(v.recovered || 0);
        });
      });

      // KPI Calculation: Based on recovery rate (simple version)
      const recoveryRate = totalDamageAmount > 0 ? (totalRecovered / totalDamageAmount) * 100 : 0;
      const kpiScore = Math.round(recoveryRate);
      
      let kpiRating: "excellent" | "good" | "satisfactory" | "unsatisfactory" = "satisfactory";
      if (kpiScore >= 90) kpiRating = "excellent";
      else if (kpiScore >= 70) kpiRating = "good";
      else if (kpiScore >= 50) kpiRating = "satisfactory";
      else if (totalDamageAmount > 0) kpiRating = "unsatisfactory";
      else kpiRating = "good"; // Default for new inspectors

      // Map audits to InspectionResult for the UI
      const inspectionResults = audits.map(a => ({
        id: a.id.toString(),
        planId: (a as any).prescription_id?.toString() || "",
        actNumber: (a as any).act_number || a.id.toString(),
        actDate: a.date ? a.date.toISOString().split('T')[0] : "",
        controlAuthority: a.control_body || "КРУ МО",
        controlObject: a.unit || "",
        controlObjectRegion: a.unit_subtitle || "",
        inspectionDirection: a.inspection_direction || "",
        inspectionDepartment: "Финансовый",
        inspectionType: (a.inspection_type?.toLowerCase().includes("план") ? "planned" : "unplanned") as "planned" | "unplanned",
        totalAmount: (a.financial_violations as any[])?.reduce((sum, v) => sum + Number(v.amount || 0), 0) || 0,
        recoveredAmount: (a.financial_violations as any[])?.reduce((sum, v) => sum + Number(v.recovered || 0), 0) || 0,
        quantityStats: `${(a.financial_violations as any[])?.length || 0} (0)`,
        responsiblePerson: a.cashier || "",
        status: (a.status === 'completed' ? 'checked' : 'in_progress') as "checked" | "in_progress",
        violations: (a.financial_violations as any[])?.map(v => ({
            id: v.id.toString(),
            violationType: v.type || "Финансовое",
            violationSubtype: v.category || "",
            source: v.source || "",
            amount: Number(v.amount || 0),
            recoveredAmount: Number(v.recovered || 0),
            quantityStats: "1 (0)",
            responsiblePerson: v.responsible || ""
        })) || []
      }));

      // Helper to get localized name
      const getLoc = (obj: any, loc: string = 'ru') => {
        if (!obj) return "";
        if (typeof obj === 'string') return obj;
        if (obj.name && typeof obj.name === 'object') {
          return obj.name[loc] || obj.name['ru'] || "";
        }
        return obj[loc] || obj['ru'] || "";
      };

      const p = item.ref_physical_persons;
      employee = {
        id: item.id.toString(),
        pin: p?.pinfl || "",
        firstName: p?.first_name || "",
        lastName: p?.last_name || "",
        patronymic: p?.middle_name || "",
        fullName: `${p?.last_name || ""} ${p?.first_name || ""} ${p?.middle_name || ""}`.trim(),

        rank: getLoc(item.ref_ranks),
        militaryRank: getLoc(item.ref_ranks),
        position: getLoc(item.ref_positions),
        department: getLoc(item.ref_units),
        militaryUnit: getLoc(item.ref_units),
        militaryDistrict: item.ref_units?.ref_military_districts?.short_name
          ? getLoc(item.ref_units.ref_military_districts.short_name)
          : (item.ref_units?.ref_military_districts?.name ? getLoc(item.ref_units.ref_military_districts.name) : ""),
        dislocation: (item.ref_units?.ref_areas?.name && typeof item.ref_units.ref_areas.name === 'object' && (item.ref_units.ref_areas.name as any).ru)
          ? `${getLoc(item.ref_units.ref_areas.name)}, ${getLoc(item.ref_units.ref_areas.ref_regions)}`
          : (item.ref_units?.unit_id ? (item.ref_units.unit_id % 5 === 0 ? "Ташкент" : item.ref_units.unit_id % 5 === 1 ? "Самарканд" : "Бухара") : ""),

        dob: p?.birth_date?.toISOString() || "",
        gender: (item.ref_physical_persons?.gender_id === 801 ? "MALE" : "FEMALE") as "MALE" | "FEMALE",
        nationality: "Узбек",
        citizenship: "Узбекистан",
        maritalStatus: "Женат",

        passportNumber: `${p?.passport_series || ""}${p?.passport_number || ""}`,
        passport: {
          series: p?.passport_series || "",
          number: p?.passport_number || "",
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
        totalDamageAmount: totalDamageAmount,
        kpiScore: kpiScore,
        kpiRating: kpiRating,
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
