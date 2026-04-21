import { Lang } from "@/lib/types/i18n"
export { Lang }
import { z } from "zod"

// --- Domain Types ---

export type LocalizedContent = {
    [Lang.RU]: string
    [Lang.UZ_LATN]?: string
    [Lang.UZ_CYRL]?: string
}

// Справочные данные
export interface ReferenceData {
    code: string
    name: LocalizedContent
}

export type RegionType = "Region" | "City" | "Republic"
export type DistrictType = "District" | "City"

export interface TerritoryBase {
    id: number
    name: LocalizedContent
    status: string
    statusData?: ReferenceData  // Данные статуса из справочника
}

export interface Region extends TerritoryBase {
    type: RegionType
    typeData?: ReferenceData  // Данные типа из справочника
    districtsCount: number
}

export interface District extends TerritoryBase {
    type: DistrictType
    typeData?: ReferenceData  // Данные типа из справочника
    region: LocalizedContent // Helper for display name
    regionId?: number | null // Helper for edit form (relation)
    parentId?: number | null // Original data field
}

// --- Validation Schemas ---

export const localizedStringSchema = z.object({
    [Lang.RU]: z.string().min(3, { message: "Наименование (RU) обязательно" }),
    [Lang.UZ_LATN]: z.string().optional(),
    [Lang.UZ_CYRL]: z.string().optional(),
})

export const regionSchema = z.object({
    name: localizedStringSchema,
    type: z.enum(["Region", "City", "Republic"]),
    status: z.enum(["active", "inactive"]),
})

export const districtSchema = z.object({
    name: localizedStringSchema,
    region: z.string().min(1, { message: "Выберите область" }),
    type: z.enum(["District", "City"]),
    status: z.enum(["active", "inactive"]),
})

export type RegionFormData = {
    id: string
    name: LocalizedContent
    type: RegionType
    districtsCount: number
    status: string
}

export type DistrictFormData = {
    id: string
    name: LocalizedContent
    region: string // ID as string for Select
    type: DistrictType
    status: string
}
