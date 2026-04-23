import { controlAuthorities, militaryDistricts, controlDirections, militaryUnits } from "@/lib/data/military-data"
import { classifiers } from "@/components/reference/classifiers"

export type Locale = "ru" | "uzLatn" | "uzCyrl"

// Вспомогательная функция для безопасного извлечения строки из потенциально локализованного объекта
export const toSafeString = (val: any, locale: Locale): string => {
    if (val === undefined || val === null) return ""
    if (typeof val === 'string') return val
    if (typeof val === 'number') return String(val)
    
    if (typeof val === 'object') {
        const langKey = locale === "uzLatn" ? "uz" : (locale === "uzCyrl" ? "uzk" : "ru")
        const result = val[langKey] || val["ru"] || val["uz"] || val["uzk"] || ""
        return typeof result === 'object' ? JSON.stringify(result) : String(result)
    }
    
    return String(val)
}

export const getStatusLabel = (statusId: string | number | undefined | null, locale: Locale) => {
    if (statusId === undefined || statusId === null) return ""
    const classifier = classifiers.find(c => c.id === 1)
    
    let idToSearch = statusId.toString();
    const englishMap: Record<string, string> = {
        "draft": "106",
        "approved": "101",
        "in_progress": "102",
        "completed": "104"
    };
    if (englishMap[idToSearch.toLowerCase()]) {
        idToSearch = englishMap[idToSearch.toLowerCase()];
    }

    const value = classifier?.values.find(v => v.id?.toString() === idToSearch || v.name === idToSearch)
    if (!value) return String(statusId)
    
    let result: any = ""
    if (locale === "uzLatn") result = value.name_uz_latn || value.name
    else if (locale === "uzCyrl") result = value.name_uz_cyrl || value.name
    else result = value.name

    return toSafeString(result, locale)
}

export const getInspectionTypeLabel = (typeId: string | number | undefined | null, locale: Locale) => {
    if (typeId === undefined || typeId === null) return ""
    
    // Search in both classifiers 2 and 23
    const c2 = classifiers.find(c => c.id === 2)
    const c23 = classifiers.find(c => c.id === 23)
    const allValues = [...(c2?.values || []), ...(c23?.values || [])]
    
    const value = allValues.find(v => 
        v.id?.toString() === typeId.toString() || 
        v.name === typeId || 
        (v as any).name?.toLowerCase() === typeId.toString().toLowerCase()
    )
    
    if (!value) return String(typeId)

    let result: any = ""
    if (locale === "uzLatn") result = value.name_uz_latn || value.name
    else if (locale === "uzCyrl") result = value.name_uz_cyrl || value.name
    else result = value.name

    return toSafeString(result, locale)
}

export const getLocalizedUnitName = (name: string | number | undefined | null, locale: Locale) => {
    if (!name) return ""
    const unit = militaryUnits.find(u =>
        u.name === name ||
        u.name_uz_latn === name ||
        u.name_uz_cyrl === name ||
        u.stateNumber === name ||
        u.id?.toString() === name.toString()
    )
    if (!unit) return name.toString()
    
    let result: any = ""
    if (locale === "uzLatn") result = unit.name_uz_latn || unit.name
    else if (locale === "uzCyrl") result = unit.name_uz_cyrl || unit.name
    else result = unit.name

    return toSafeString(result, locale)
}

export const getLocalizedDistrictName = (name: any, locale: Locale, full: boolean = false) => {
    if (!name) return ""

    let searchName = toSafeString(name, "ru")

    const district = militaryDistricts.find(d =>
        d.name?.toLowerCase().trim() === searchName.toLowerCase().trim() ||
        d.shortName?.toLowerCase().trim() === searchName.toLowerCase().trim() ||
        d.name_uz_latn?.toLowerCase().trim() === searchName.toLowerCase().trim() ||
        d.shortName_uz_latn?.toLowerCase().trim() === searchName.toLowerCase().trim() ||
        d.shortName_uz_cyrl?.toLowerCase().trim() === searchName.toLowerCase().trim() ||
        d.code?.toLowerCase().trim() === searchName.toLowerCase().trim()
    )

    if (!district) return String(searchName)

    let result: any = ""
    if (full) {
        if (locale === "uzLatn") result = district.name_uz_latn || district.name
        else if (locale === "uzCyrl") result = district.name_uz_cyrl || district.name
        else result = district.name
    } else {
        if (locale === "uzLatn") result = district.shortName_uz_latn || district.shortName
        else if (locale === "uzCyrl") result = district.shortName_uz_cyrl || district.shortName
        else result = district.shortName
    }

    return toSafeString(result, locale)
}

export const getLocalizedAuthorityName = (code: string, locale: Locale, supplyDepartments: any[] = [], mode: 'short' | 'full' = 'full') => {
    if (!code) return ""

    const dept = supplyDepartments.find(d =>
        d.code === code ||
        d.nameRu === code || d.name_ru === code ||
        d.nameUzLatn === code || d.name_uz_latn === code ||
        d.nameUzCyrl === code || d.name_uz_cyrl === code ||
        (typeof d.name === 'object' && (d.name.ru === code || d.name.uz === code || d.name.uzk === code))
    )

    if (dept) {
        if (mode === 'short') {
            const shortName = typeof dept.shortName === 'object' ? dept.shortName : (dept.short_name || {})
            return toSafeString(shortName, locale) || String(dept.code)
        }
        const nameData = typeof dept.name === 'object' ? dept.name : { ru: dept.name_ru, uz: dept.name_uz_latn, uzk: dept.name_uz_cyrl }
        return toSafeString(nameData, locale) || String(dept.code)
    }

    let auth = (controlAuthorities as any)[code]
    if (!auth) {
        const entry = Object.entries(controlAuthorities).find(([k, a]: [string, any]) =>
            k === code || a.code === code || a.name === code || a.name_uz_latn === code || a.name_uz_cyrl === code
        )
        if (entry) auth = entry[1]
    }

    if (!auth) return code

    if (mode === 'short') {
        let result: any = ""
        if (locale === "uzLatn") result = auth.short_name_uz_latn || auth.name_uz_latn || code
        else if (locale === "uzCyrl") result = auth.short_name_uz_cyrl || auth.name_uz_cyrl || code
        else result = auth.short_name || code
        return toSafeString(result, locale)
    }

    let result: any = ""
    if (locale === "uzLatn") result = auth.name_uz_latn || auth.name
    else if (locale === "uzCyrl") result = auth.name_uz_cyrl || auth.name
    else result = auth.name

    return toSafeString(result, locale)
}

export const getLocalizedDirectionName = (directionId: string | number | undefined | null, locale: Locale) => {
    if (directionId === undefined || directionId === null) return ""
    const dir = controlDirections.find(d =>
        d.id?.toString() === directionId.toString() ||
        d.code === directionId ||
        d.name === directionId ||
        d.name_uz_latn === directionId ||
        d.name_uz_cyrl === directionId
    )
    if (!dir) return directionId.toString()
    
    let result: any = ""
    if (locale === "uzLatn") result = dir.name_uz_latn || dir.name
    else if (locale === "uzCyrl") result = dir.name_uz_cyrl || dir.name
    else result = dir.name

    return toSafeString(result, locale)
}

export const getPersonnelName = (personId: any, militaryPersonnel: any[] = [], physicalPersons: any[] = []) => {
    if (!personId) return "—"
    const p = militaryPersonnel.find(mp => mp.id.toString() === personId.toString())
    if (!p) return personId
    const phys = physicalPersons.find(pp => pp.id === p.personId)
    return phys ? `${phys.lastName} ${phys.firstName} ${phys.middleName || ""}` : personId
}
