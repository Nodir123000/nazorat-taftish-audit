import { z } from "zod";

export const DocumentTypeSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    category: z.string(),
    template: z.enum(["yes", "no"]),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"])
});

export type DocumentTypeDTO = z.infer<typeof DocumentTypeSchema>;
export type CreateDocumentTypeDTO = Omit<DocumentTypeDTO, "id">;

export const MilitaryUnitSchema = z.object({
    id: z.string(),
    stateId: z.string(),
    stateNumber: z.string(),
    name: z.string(),
    type: z.string(),
    location: z.string(),
    region: z.string(),
    district: z.string(),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"])
});

export type MilitaryUnitDTO = z.infer<typeof MilitaryUnitSchema>;
export type CreateMilitaryUnitDTO = Omit<MilitaryUnitDTO, "id">;

export const MilitaryDistrictSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    shortName: z.string().optional(),
    headquarters: z.string().optional(),
    region: z.string().optional(),
    district: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"])
});
export type CreateMilitaryDistrictDTO = Omit<MilitaryDistrictDTO, "id">;

export type MilitaryDistrictDTO = z.infer<typeof MilitaryDistrictSchema>;

export const ViolationTypeSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    category: z.string(),
    severity: z.string(),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"])
});

export type ViolationTypeDTO = z.infer<typeof ViolationTypeSchema>;

export const RegionSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["Region", "City", "Republic"]),
    districtsCount: z.number().optional()
});

export type RegionDTO = z.infer<typeof RegionSchema>;
export type CreateRegionDTO = Omit<RegionDTO, "id" | "districtsCount">;

export const AdministrativeDistrictSchema = z.object({
    id: z.string(),
    name: z.string(),
    region: z.string(),
    type: z.enum(["District", "City"])
});

export type AdministrativeDistrictDTO = z.infer<typeof AdministrativeDistrictSchema>;
export type CreateAdministrativeDistrictDTO = Omit<AdministrativeDistrictDTO, "id">;
