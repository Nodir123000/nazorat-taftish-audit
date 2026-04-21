"use server"

import { prisma } from "../db/prisma";

/**
 * Локализация: приведение к единому формату { ru, uz, uzk }
 */
function normalizeNameObj(name: any) {
    if (!name) return { ru: "", uz: "", uzk: "" }
    if (typeof name === "string") return { ru: name, uz: name, uzk: name }
    return {
        ru: name.ru ?? name?.name_ru ?? "",
        uz: name.uz ?? name?.uzLatn ?? name?.name_uz_latn ?? "",
        uzk: name.uzk ?? name?.uzCyrl ?? name?.name_uz_cyrl ?? ""
    }
}

/**
 * Карта соответствия типов и их первичных ключей в БД
 */
const idFieldMap: Record<string, string> = {
    RefRank: 'rank_id',
    RefMilitaryDistrict: 'district_id',
    RefBudgetArticle: 'article_id',
    RefControlDirection: 'direction_id',
    RefControlAuthority: 'authority_id',
    RefViolation: 'viol_type_id',
    RefSupplyDepartment: 'id'
};

/**
 * Универсальный маппинг типов на модели Prisma
 */
const getDelegates = () => ({
    RefUnitType: (prisma as any).ref_unit_types,
    RefSpecialization: (prisma as any).ref_specializations,
    RefVus: (prisma as any).ref_vus_list,
    RefPosition: (prisma as any).ref_positions,
    RefSubdivisionName: (prisma as any).ref_subdivision_names,
    RefDocumentType: (prisma as any).ref_document_types,
    RefControlType: (prisma as any).ref_control_types,
    RefFinancingSource: (prisma as any).ref_financing_sources,
    RefTmcType: (prisma as any).ref_tmc_types,
    RefViolationReason: (prisma as any).ref_violation_reasons,
    RefInspectionKind: (prisma as any).ref_inspection_kinds,
    RefAuditObject: (prisma as any).ref_audit_objects,
    RefInspectionStatus: (prisma as any).ref_inspection_statuses,
    RefInspectionType: (prisma as any).ref_inspection_types,
    RefViolationSeverity: (prisma as any).ref_violation_severities,
    RefViolationStatus: (prisma as any).ref_violation_statuses,
    RefDecisionStatus: (prisma as any).ref_decision_statuses,
    RefComposition: (prisma as any).ref_compositions,
    RefEducationLevel: (prisma as any).ref_education_levels,
    RefSecurityClearance: (prisma as any).ref_security_clearances,
    RefFitnessCategory: (prisma as any).ref_fitness_categories,
    RefAwardPenalty: (prisma as any).ref_award_penalties,
    RefGender: (prisma as any).ref_genders,
    RefNationality: (prisma as any).ref_nationalities,
    RefBudgetArticle: (prisma as any).ref_budget_articles,
    RefControlDirection: (prisma as any).ref_control_directions,
    RefControlAuthority: (prisma as any).ref_control_authorities,
    RefViolation: (prisma as any).ref_violations,
    RefRegion: (prisma as any).ref_regions,
    RefArea: (prisma as any).ref_areas,
    RefMilitaryDistrict: (prisma as any).ref_military_districts,
    RefSupplyDepartment: (prisma as any).refSupplyDepartment,
});

/**
 * Сервис для универсальных классификаторов
 */
export async function getClassifiersByType(type: string, options: { skip?: number, take?: number } = {}) {
    const delegates = getDelegates();
    const delegate = (delegates as any)[type];

    const orderField = idFieldMap[type] ?? 'id';

    if (delegate) {
        const data = await delegate.findMany({
            orderBy: { [orderField]: 'asc' },
            skip: options.skip,
            take: options.take ?? 1000,
        });

        return data.map((item: any) => {
            const nameObj = normalizeNameObj(item.name);
            const shortNameObj = normalizeNameObj(item.short_name || item.shortName);

            return {
                ...item,
                id: item[orderField] ?? item.id,
                name: nameObj.ru,
                nameRu: nameObj.ru,
                nameUzLatn: nameObj.uz,
                nameUzCyrl: nameObj.uzk,
                name_uz_latn: nameObj.uz,
                name_uz_cyrl: nameObj.uzk,
                short_name: shortNameObj.ru,
                short_name_uz_latn: shortNameObj.uz,
                short_name_uz_cyrl: shortNameObj.uzk,
                type: item.type || type,
                nameObj: nameObj,
                shortNameObj: shortNameObj,
                compositionId: item.compositionId || item.id,
                code: item.code || (item[orderField] ? item[orderField].toString() : ""),
                status: item.status ?? 'active'
            };
        });
    }

    // Fallback to RefClassifier (generic table)
    const genericItems = await prisma.ref_classifiers.findMany({
        where: { type },
        orderBy: { sort_order: 'asc' },
        skip: options.skip,
        take: options.take ?? 1000
    });

    return genericItems.map((item: any) => {
        const nameObj = normalizeNameObj(item.name);
        return {
            ...item,
            id: item.id,
            type,
            code: item.code,
            nameObj,
            nameRu: nameObj.ru,
            nameUzLatn: nameObj.uz,
            nameUzCyrl: nameObj.uzk,
            status: item.status ?? 'active'
        }
    })
}

export async function saveClassifier(type: string, data: any) {
    try {
        const delegates = getDelegates();
        const delegate = (delegates as any)[type];

        const nameJson = {
            ru: data.nameRu ?? data.name ?? data.name_ru ?? "",
            uz: data.nameUzLatn ?? data.name_uz_latn ?? "",
            uzk: data.nameUzCyrl ?? data.name_uz_cyrl ?? ""
        };

        if (!nameJson.ru && !nameJson.uz && !nameJson.uzk) {
            throw new Error("Name is required in at least one language");
        }

        const dbData: any = {
            code: data.code ?? null,
            name: nameJson,
            status: data.status ?? 'active'
        };

        if (delegate) {
            const idField = idFieldMap[type] ?? 'id';
            if (type === 'RefSupplyDepartment') {
                dbData.shortName = {
                    ru: data.shortName ?? data.short_name ?? "",
                    uz: data.shortNameUzLatn ?? data.short_name_uz_latn ?? "",
                    uzk: data.shortNameUzCyrl ?? data.short_name_uz_cyrl ?? ""
                };
            }

            const idValue = data.id ? parseInt(String(data.id), 10) : null;
            if (idValue && idValue > 0) {
                return await delegate.update({
                    where: { [idField]: idValue },
                    data: dbData
                });
            }
            return await delegate.create({ data: dbData });
        }

        // fallback to RefClassifier
        const idValue = data.id ? parseInt(String(data.id), 10) : null;
        const genericData = {
            type,
            code: data.code ?? null,
            name: nameJson,
            status: data.status ?? 'active'
        }

        if (idValue && idValue > 0) {
            return await prisma.ref_classifiers.update({
                where: { id: idValue },
                data: genericData
            });
        }
        return await prisma.ref_classifiers.create({
            data: genericData
        });
    } catch (error: any) {
        console.error(`Error saving classifier ${type}:`, error);
        throw new Error(error.message || "Failed to save database entry");
    }
}

export async function deleteClassifier(type: string, id: number) {
    try {
        const delegates = getDelegates();
        const delegate = (delegates as any)[type];

        if (delegate) {
            const idField = idFieldMap[type] ?? 'id';
            return await delegate.delete({ where: { [idField]: id } });
        }
        return await prisma.ref_classifiers.delete({ where: { id } });
    } catch (error: any) {
        console.error(`Error deleting classifier ${type}:`, error);
        throw new Error(error.message || "Failed to delete from database");
    }
}

// Specialized references

export async function getRanks() {
    return await prisma.ref_ranks.findMany({
        orderBy: { level: 'asc' }
    });
}

export async function getDistricts() {
    const data = await (prisma as any).ref_military_districts.findMany({
        include: { ref_areas: true },
        orderBy: { district_id: 'asc' }
    });
    return data.map((d: any) => {
        const nameObj = normalizeNameObj(d.name);
        const shortNameObj = normalizeNameObj(d.short_name || d.shortName);
        return {
            ...d,
            districtId: d.district_id,
            name: d.name,
            nameObj: nameObj,
            nameRu: nameObj.ru,
            name_uz_latn: nameObj.uz,
            name_uz_cyrl: nameObj.uzk,
            shortName: d.short_name || d.shortName,
            shortNameObj: shortNameObj,
            shortNameRu: shortNameObj.ru,
            shortName_uz_latn: shortNameObj.uz,
            shortName_uz_cyrl: shortNameObj.uzk,
            headquarters: d.ref_areas?.name?.ru || d.headquarters || ""
        };
    });
}

export async function saveDistrict(data: any) {
    const nameJson = {
        ru: data.name,
        uz: data.name_uz_latn,
        uzk: data.name_uz_cyrl
    };
    const shortNameJson = {
        ru: data.shortName,
        uz: data.shortName_uz_latn,
        uzk: data.shortName_uz_cyrl
    };

    const dbData = {
        code: data.code,
        status: data.status,
        name: nameJson,
        short_name: shortNameJson,
        // headquarters: string ignored, areaId needed but not passed from simple UI yet
        // If we want to save area_id, we need to map it properly, but for now matching existing logic
        // area_id: data.areaId
    };

    if (data.districtId) {
        return await (prisma as any).ref_military_districts.update({
            where: { district_id: data.districtId },
            data: dbData
        });
    }
    return await (prisma as any).ref_military_districts.create({ data: dbData });
}

export async function deleteDistrict(id: number) {
    return await prisma.ref_military_districts.delete({ where: { district_id: id } });
}

export async function getUnits(options: { skip?: number, take?: number, search?: string } = {}) {
    try {
        const where: any = {};
        if (options.search) {
            where.OR = [
                { unit_code: { contains: options.search, mode: 'insensitive' } },
                { commander_name: { contains: options.search, mode: 'insensitive' } },
                // JSON name search (requires careful logic in Prisma, simplified for now)
                //{ name: { path: ['ru'], string_contains: options.search } } 
            ];
        }

        const units = await prisma.ref_units.findMany({
            where,
            skip: options.skip,
            take: options.take ?? 50,
            include: {
                ref_areas: {
                    include: {
                        ref_regions: true
                    }
                },
                ref_military_districts: true
            },
            orderBy: { unit_id: 'asc' }
        });

        return units.map((u: any) => {
            const nameObj = normalizeNameObj(u.name);
            const districtNameObj = normalizeNameObj(u.ref_military_districts?.name);

            return {
                ...u,
                id: u.unit_id.toString(),
                unitId: u.unit_id,
                unitCode: u.unit_code,
                unitNumber: u.unit_code,
                name: u.name,
                nameRu: nameObj.ru,
                name_uz_latn: nameObj.uz,
                name_uz_cyrl: nameObj.uzk,
                nameObj: nameObj,
                commander: u.commander_name || "—",
                militaryDistrict: districtNameObj.ru || "—",
                militaryDistrictId: u.military_district_id,
                areaId: u.area_id,
                area: u.ref_areas ? {
                    ...u.ref_areas,
                    region: u.ref_areas.ref_regions
                } : null,
                region: u.ref_areas?.ref_regions?.name?.ru || u.ref_areas?.name?.ru || "—",
                city: u.ref_areas?.name?.ru || "—",
                district: u.ref_military_districts,
                isActive: u.is_active,
                status: u.is_active ? 'active' : 'inactive',
                auditsCount: u.audits?.length || 0,
                kpiScore: 0
            };
        });
    } catch (error) {
        console.error("Error fetching units:", error);
        return [];
    }
}

export async function getUnitsCount(options: { search?: string } = {}) {
    try {
        const where: any = {};
        if (options.search) {
            where.OR = [
                { unit_code: { contains: options.search, mode: 'insensitive' } },
                { commander_name: { contains: options.search, mode: 'insensitive' } }
                // Searching JSON name is complex in Prisma without raw queries, 
                // but we could look at the commander_name or unit_code.
            ];
        }
        return await prisma.ref_units.count({ where });
    } catch (error) {
        console.error("Error counting units:", error);
        return 0;
    }
}

export async function saveUnit(data: any) {
    try {
        const id = data.unitId ? parseInt(String(data.unitId), 10) : (data.id ? parseInt(String(data.id), 10) : null);

        const nameJson = normalizeNameObj({
            ru: data.name,
            uz: data.name_uz_latn,
            uzk: data.name_uz_cyrl
        });
        if (!nameJson.ru && !nameJson.uz && !nameJson.uzk) {
            throw new Error("Name is required in at least one language");
        }

        const dbData: any = {
            name: nameJson,
            unit_code: data.unitCode || data.stateId || data.unit_code,
            commander_name: data.commander || data.commander_name,
            commander_rank: data.commanderRank || data.commander_rank,
            unit_type_id: data.unit_type_id || 702,
            military_district_id: data.military_district_id || data.militaryDistrictId || null,
            area_id: data.area_id || data.areaId || null,
            is_active: data.isActive !== undefined ? data.isActive : true
        };

        if (id && id > 0) {
            return await prisma.ref_units.update({
                where: { unit_id: id },
                data: dbData
            });
        }
        return await prisma.ref_units.create({ data: dbData });
    } catch (error: any) {
        console.error("Error saving unit:", error);
        throw new Error(error.message || "Failed to save unit to database");
    }
}

export async function deleteUnit(id: number) {
    try {
        const uId = parseInt(String(id), 10);
        return await prisma.ref_units.delete({ where: { unit_id: uId } });
    } catch (error: any) {
        console.error("Error deleting unit:", error);
        throw new Error(error.message || "Failed to delete unit");
    }
}

// Regions & Areas

export async function getRegions() {
    return await prisma.ref_regions.findMany({
        where: { status: 'active' },
        orderBy: { id: 'asc' }
    });
}

export async function saveRegion(data: any) {
    const dbData = {
        code: data.code,
        name: data.name,
        type: data.type,
        status: data.status || 'active'
    };
    const id = data.id ? (typeof data.id === 'string' ? parseInt(data.id) : data.id) : null;
    if (id && id > 0) {
        return await prisma.ref_regions.update({ where: { id }, data: dbData });
    }
    return await prisma.ref_regions.create({ data: dbData });
}

export async function deleteRegion(id: number) {
    return await prisma.ref_regions.delete({ where: { id } });
}

export async function getAreas() {
    const data = await prisma.ref_areas.findMany({
        include: { ref_regions: true },
        where: { status: 'active' },
        orderBy: { id: 'asc' },
    });
    return data.map((a: any) => ({
        ...a,
        regionId: a.region_id,
        region: a.ref_regions
    }));
}

// New helper to fetch both regions and districts (areas) for the Territories UI
export async function getTerritories() {
    const regions = await prisma.ref_regions.findMany({
        orderBy: { id: 'asc' }
    });

    const areas = await prisma.ref_areas.findMany({
        include: { ref_regions: true },
        orderBy: { id: 'asc' },
    });

    // Normalize to a common structure
    const regionsMapped = regions.map((r: any) => {
        // Normalize status: some data might have Russian 'активный', some 'active'
        let status = r.status || 'active';
        if (status === 'активный') status = 'active';

        return {
            ...r,
            status,
            type: r.type || 'Region',
            parentId: null
        };
    });

    const areasMapped = areas.map((it: any) => {
        let status = it.status || 'active';
        if (status === 'активный') status = 'active';

        return {
            ...it,
            status,
            parentId: it.region_id ?? (it.ref_regions ? it.ref_regions.id : undefined),
        };
    });

    return [...regionsMapped, ...areasMapped];
}


export async function saveArea(data: any) {
    const dbData = {
        code: data.code,
        name: data.name,
        type: data.type,
        status: data.status || 'active',
        region_id: data.regionId ? (typeof data.regionId === 'string' ? parseInt(data.regionId) : data.regionId) : null
    };
    const id = data.id ? (typeof data.id === 'string' ? parseInt(data.id) : data.id) : null;
    if (id && id > 0) {
        return await prisma.ref_areas.update({ where: { id }, data: dbData });
    }
    return await prisma.ref_areas.create({ data: dbData });
}

export async function deleteArea(id: number) {
    return await prisma.ref_areas.delete({ where: { id } });
}



export async function saveTerritory(data: any) {
    if (data.type === 'Region') {
        return await saveRegion(data);
    } else {
        const areaData = {
            ...data,
            regionId: data.parentId || data.regionId
        };
        return await saveArea(areaData);
    }
}

export async function deleteTerritory(id: number) {
    try {
        return await deleteArea(id);
    } catch {
        return await deleteRegion(id);
    }
}

// Physical Persons & Personnel

export async function getPhysicalPersons(options: { skip?: number, take?: number, search?: string } = {}) {
    try {
        const where: any = {};
        if (options.search) {
            where.OR = [
                { pinfl: { contains: options.search } },
                { last_name: { contains: options.search, mode: 'insensitive' } },
                { first_name: { contains: options.search, mode: 'insensitive' } },
                { passport_series: { contains: options.search, mode: 'insensitive' } },
                { passport_number: { contains: options.search, mode: 'insensitive' } }
            ];
        }

        return await prisma.ref_physical_persons.findMany({
            where,
            skip: options.skip,
            take: options.take ?? 50,
            include: {
                ref_genders: true,
                ref_nationalities: true,
                ref_regions: true,
                ref_areas: true
            },
            orderBy: { last_name: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching physical persons:", error);
        return [];
    }
}

export async function getPhysicalPersonsCount(options: { search?: string } = {}) {
    try {
        const where: any = {};
        if (options.search) {
            where.OR = [
                { pinfl: { contains: options.search } },
                { last_name: { contains: options.search, mode: 'insensitive' } },
                { first_name: { contains: options.search, mode: 'insensitive' } },
                { passport_series: { contains: options.search, mode: 'insensitive' } },
                { passport_number: { contains: options.search, mode: 'insensitive' } }
            ];
        }
        return await prisma.ref_physical_persons.count({ where });
    } catch (error) {
        console.error("Error counting physical persons:", error);
        return 0;
    }
}

export async function savePhysicalPerson(data: any) {
    try {
        const id = data.id ? parseInt(String(data.id), 10) : null;

        const dbData = {
            pinfl: data.pinfl,
            last_name: data.lastName,
            first_name: data.firstName,
            middle_name: data.middleName,
            passport_series: data.passport?.substring(0, 2),
            passport_number: data.passport?.substring(2),
            birth_date: data.birthDate ? new Date(data.birthDate) : null,
            address: data.streetHouse,
            contact_phone: data.phone,
            gender_id: data.gender === 'Мужской' ? 801 : 802,
            region_id: data.regionId ? parseInt(String(data.regionId), 10) : null,
            district_id: data.districtId ? parseInt(String(data.districtId), 10) : null,
        };

        if (id && id > 0) {
            return await prisma.ref_physical_persons.update({
                where: { id },
                data: dbData
            });
        }
        return await prisma.ref_physical_persons.create({ data: dbData });
    } catch (error: any) {
        console.error("Error saving physical person:", error);
        throw new Error(error.message || "Failed to save physical person");
    }
}

export async function deletePhysicalPerson(id: number) {
    try {
        return await prisma.ref_physical_persons.delete({
            where: { id }
        });
    } catch (error: any) {
        console.error("Error deleting physical person:", error);
        throw new Error(error.message || "Failed to delete from database");
    }
}

export async function getPersonnel(options: { skip?: number, take?: number, search?: string, status?: string, unitId?: number, rankId?: number } = {}) {
    try {
        const where: any = {};
        if (options.search) {
            where.OR = [
                { pnr: { contains: options.search, mode: 'insensitive' } },
                {
                    ref_physical_persons: {
                        OR: [
                            { last_name: { contains: options.search, mode: 'insensitive' } },
                            { first_name: { contains: options.search, mode: 'insensitive' } },
                            { pinfl: { contains: options.search, mode: 'insensitive' } }
                        ]
                    }
                }
            ];
        }

        if (options.status && options.status !== 'all') where.status = options.status;
        if (options.unitId) where.unit_id = options.unitId;
        if (options.rankId) where.rank_id = options.rankId;

        return await prisma.personnel.findMany({
            where,
            skip: options.skip,
            take: options.take ?? 50,
            include: {
                ref_physical_persons: true,
                ref_ranks: true,
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
                ref_positions: true,
                ref_vus_list: true
            },
            orderBy: { id: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching personnel:", error);
        return [];
    }
}

export async function getPersonnelCount(options: { search?: string, status?: string, unitId?: number, rankId?: number } = {}) {
    try {
        const where: any = {};
        if (options.search) {
            where.OR = [
                { pnr: { contains: options.search, mode: 'insensitive' } },
                {
                    ref_physical_persons: {
                        OR: [
                            { last_name: { contains: options.search, mode: 'insensitive' } },
                            { first_name: { contains: options.search, mode: 'insensitive' } },
                            { pinfl: { contains: options.search, mode: 'insensitive' } }
                        ]
                    }
                }
            ];
        }
        if (options.status && options.status !== 'all') where.status = options.status;
        if (options.unitId) where.unit_id = Number(options.unitId);
        if (options.rankId) where.rank_id = Number(options.rankId);

        return await prisma.personnel.count({ where });
    } catch (error) {
        console.error("Error counting personnel:", error);
        return 0;
    }
}

export async function savePersonnel(data: any) {
    try {
        const id = data.id ? parseInt(String(data.id), 10) : null;
        const dbData: any = {
            pnr: data.pnr,
            physical_person_id: data.personId ? parseInt(String(data.personId), 10) : undefined,
            rank_id: data.rankId ? parseInt(String(data.rankId), 10) : undefined,
            unit_id: data.unitId ? parseInt(String(data.unitId), 10) : undefined,
            position_id: data.positionId ? parseInt(String(data.positionId), 10) : undefined,
            vus_id: data.vusId ? parseInt(String(data.vusId), 10) : undefined,
            category: data.category,
            status: data.status || 'active',
            service_start_date: data.serviceStartDate ? new Date(data.serviceStartDate) : undefined,
        };

        if (id && id > 0) {
            return await prisma.personnel.update({
                where: { id },
                data: dbData
            });
        }
        return await prisma.personnel.create({ data: dbData });
    } catch (error: any) {
        console.error("Error saving personnel:", error);
        throw new Error(error.message || "Failed to save personnel");
    }
}

export async function deletePersonnel(id: number) {
    try {
        const pId = parseInt(String(id), 10);
        return await prisma.personnel.delete({ where: { id: pId } });
    } catch (error: any) {
        console.error("Error deleting personnel:", error);
        throw new Error(error.message || "Failed to delete personnel");
    }
}
