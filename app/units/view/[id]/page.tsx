import UnitsViewClient from "./unit-view-client"
import { prisma } from "@/lib/db/prisma"
import { mockUnitsData } from "@/lib/mock-data/units"

function safeInt(v: any): number | null {
    if (v == null || v === "") return null
    const n = Number(v)
    return Number.isFinite(n) ? Math.trunc(n) : null
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params
    const id = safeInt(idStr)
    
    if (id === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 py-20 px-4 text-center">
                <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Неверный ID</h1>
            </div>
        )
    }

    try {
        const unit = await prisma.ref_units.findUnique({
            where: { unit_id: id },
            include: {
                ref_military_districts: true,
                ref_areas: {
                    include: {
                        ref_regions: true
                    }
                }
            }
        })

        const mockUnit = mockUnitsData.find((u) => u.id === id)

        if (!unit && !mockUnit) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 py-20 px-4 text-center">
                    <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Воинская часть не найдена</h1>
                    <p className="text-slate-500 max-w-md mb-8 font-medium">
                        К сожалению, запрашиваемая воинская часть не найдена в базе данных или произошла ошибка при загрузке.
                    </p>
                </div>
            )
        }

        const districtObj = unit?.ref_military_districts
            ? {
                districtId: unit.ref_military_districts.district_id,
                name: unit.ref_military_districts.name ?? unit.ref_military_districts.short_name ?? null,
                shortName: unit.ref_military_districts.short_name ?? null
            }
            : mockUnit
                ? { name: mockUnit.district }
                : null

        const areaObj = unit?.ref_areas
            ? {
                areaId: unit.ref_areas.id ?? null,
                name: unit.ref_areas.name ?? null,
                region: unit.ref_areas.ref_regions ? { regionId: unit.ref_areas.ref_regions.id ?? null, name: unit.ref_areas.ref_regions.name ?? null } : null
            }
            : mockUnit
                ? { name: mockUnit.city, region: { name: mockUnit.region } }
                : null

        const unitData = {
            ...(unit ? { ...unit } : {}),
            unitId: unit?.unit_id ?? mockUnit?.id,
            unitNumber: unit?.unit_code ?? (mockUnit as any)?.unitCode ?? null,
            militaryDistrictId: unit?.military_district_id ?? null,
            areaId: unit?.area_id ?? null,
            district: districtObj,
            area: areaObj,
            isActive: unit ? !!unit.is_active : (mockUnit?.status === "active"),
            commanderName: mockUnit?.commanderName ?? `Полковник ${id % 2 === 0 ? "Иванов" : "Смирнов"} ${id % 3 === 0 ? "А.Б." : "С.Д."}`,
            commanderRank: mockUnit?.commanderRank ?? (id % 5 === 0 ? "Генерал-майор" : id % 3 === 0 ? "Подполковник" : "Полковник"),
            personnelCount: mockUnit?.personnelCount ?? (100 + (id * 7) % 800),
            lastAuditDate: mockUnit?.lastAuditDate ?? `${((id % 28) + 1).toString().padStart(2, "0")}.${(((id % 12) + 1).toString()).padStart(2, "0")}.2024`,
            lastAuditStatus: mockUnit?.lastAuditStatus ?? (id % 4 === 0 ? "Отлично" : id % 4 === 1 ? "Хорошо" : "Удовлетворительно"),
            email: mockUnit?.email ?? `unit${id}@mod.gov.uz`,
            contactPhone: mockUnit?.contactPhone ?? `+998 71 234-56-${(id % 100).toString().padStart(2, "0")}`,
            type: mockUnit?.type ?? (id % 3 === 0 ? "Линейная часть" : id % 3 === 1 ? "Учебный центр" : "Орган обеспечения"),
            specialization: mockUnit?.specialization ?? (id % 3 === 0 ? "Мотострелковая" : id % 3 === 1 ? "Танковая" : "Артиллерия"),
            address: mockUnit?.address ?? `ул. Победы, дом ${id}`,
            city: mockUnit?.city ?? (id % 5 === 0 ? "Ташкент" : id % 5 === 1 ? "Самарканд" : "Бухара"),
            region: mockUnit?.region ?? (id % 5 === 0 ? "Ташкентская обл." : id % 5 === 1 ? "Самаркандская обл." : "Бухарская обл."),
            fullName: mockUnit?.fullName ?? `В/Ч ${id.toString().padStart(5, "0")} имени ${(id % 2 === 0 ? "Амира Темура" : "Джалолиддина Мангуберди")}`,
        }

        return <UnitsViewClient unitData={unitData} id={idStr} />
    } catch (error) {
        console.error("Error fetching unit data:", error)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 py-20 px-4 text-center">
                <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Ошибка сервера</h1>
                <p className="text-slate-500 max-w-md mb-8 font-medium">Не удалось загрузить данные.</p>
            </div>
        )
    }
}
