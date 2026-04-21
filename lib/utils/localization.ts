import { controlAuthorities, militaryDistricts, controlDirections, militaryUnits } from "@/lib/data/military-data"
import { classifiers } from "@/components/reference/classifiers"

export type Locale = "ru" | "uzLatn" | "uzCyrl"

export const getStatusLabel = (statusId: string | number | undefined | null, locale: Locale) => {
    if (statusId === undefined || statusId === null) return ""
    const classifier = classifiers.find(c => c.id === 1)
    
    // Map English status strings to IDs if necessary
    let idToSearch = statusId.toString();
    const englishMap: Record<string, string> = {
        "draft": "101",
        "approved": "101",
        "in_progress": "102",
        "completed": "104"
    };
    if (englishMap[idToSearch.toLowerCase()]) {
        idToSearch = englishMap[idToSearch.toLowerCase()];
    }

    const value = classifier?.values.find(v => v.id?.toString() === idToSearch || v.name === idToSearch)
    if (!value) return String(statusId)
    
    let result = ""
    if (locale === "uzLatn") result = value.name_uz_latn || value.name
    else if (locale === "uzCyrl") result = value.name_uz_cyrl || value.name
    else result = value.name

    return typeof result === 'object' ? (result as any).ru || String(statusId) : String(result)
}

export const getInspectionTypeLabel = (typeId: string | number | undefined | null, locale: Locale) => {
    if (typeId === undefined || typeId === null) return ""
    const classifier = classifiers.find(c => c.id === 23) || classifiers.find(c => c.id === 2)
    const value = classifier?.values.find(v => v.id?.toString() === typeId.toString() || v.name === typeId || (v as any).name?.toLowerCase() === typeId.toString().toLowerCase())
    if (!value) return String(typeId)

    let result = ""
    if (locale === "uzLatn") result = value.name_uz_latn || value.name
    else if (locale === "uzCyrl") result = value.name_uz_cyrl || value.name
    else result = value.name

    return typeof result === 'object' ? (result as any).ru || String(typeId) : String(result)
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
    if (locale === "uzLatn") return unit.name_uz_latn || unit.name
    if (locale === "uzCyrl") return unit.name_uz_cyrl || unit.name
    return unit.name
}

export const getLocalizedDistrictName = (name: any, locale: Locale, full: boolean = false) => {
    if (!name) return ""

    let searchName = ""
    if (typeof name === 'object') {
        const langKey = locale === "uzLatn" ? "uz" : (locale === "uzCyrl" ? "uzk" : "ru")
        searchName = name[langKey] || name["ru"] || ""
    } else {
        searchName = String(name)
    }

    const district = militaryDistricts.find(d =>
        d.name === searchName ||
        d.shortName === searchName ||
        d.name_uz_latn === searchName ||
        d.shortName_uz_latn === searchName ||
        d.shortName_uz_cyrl === searchName
    )

    if (!district) return String(searchName)

    let result = ""
    if (full) {
        if (locale === "uzLatn") result = district.name_uz_latn || district.name
        else if (locale === "uzCyrl") result = district.name_uz_cyrl || district.name
        else result = district.name
    } else {
        if (locale === "uzLatn") result = district.shortName_uz_latn || district.shortName
        else if (locale === "uzCyrl") result = district.shortName_uz_cyrl || district.shortName
        else result = district.shortName
    }

    return typeof result === 'object' ? (result as any).ru || String(searchName) : String(result)
}

export const getLocalizedAuthorityName = (code: string, locale: Locale, supplyDepartments: any[] = [], mode: 'short' | 'full' = 'full') => {
    if (!code) return ""

    // 1. Try to find in fetched supply departments from DB first
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
            if (locale === "uzLatn") return String(shortName.uz || dept.short_name_uz_latn || dept.code)
            if (locale === "uzCyrl") return String(shortName.uzk || dept.short_name_uz_cyrl || dept.code)
            return String(shortName.ru || dept.short_name || dept.code)
        }
        const nameData = typeof dept.name === 'object' ? dept.name : { ru: dept.name_ru, uz: dept.name_uz_latn, uzk: dept.name_uz_cyrl }
        let result = ""
        if (locale === "uzLatn") result = nameData.uz || dept.name_uz_latn || nameData.ru || ""
        else if (locale === "uzCyrl") result = nameData.uzk || dept.name_uz_cyrl || nameData.ru || ""
        else result = nameData.ru || dept.name_ru || ""
        
        return result || String(dept.code)
    }

    // 2. Fallback to static controlAuthorities
    let key = code
    let auth = (controlAuthorities as any)[code]

    if (!auth) {
        // Try to find by code field in values if it's an object structure, though controlAuthorities is Record<string, any>
        // But maybe we iterate?
        const entry = Object.entries(controlAuthorities).find(([k, a]: [string, any]) =>
            k === code || // key matches code
            a.code === code || // value has code property
            a.name === code || a.name_uz_latn === code || a.name_uz_cyrl === code
        )
        if (entry) {
            key = entry[0]
            auth = entry[1]
        }
    }

    if (!auth) return code

    if (mode === 'short') {
        if (locale === "ru") return key
        if (locale === "uzLatn") return auth.short_name_uz_latn || auth.name_uz_latn || key
        if (locale === "uzCyrl") return auth.short_name_uz_cyrl || auth.name_uz_cyrl || key
        return key
    }

    if (locale === "uzLatn") return auth.name_uz_latn || auth.name
    if (locale === "uzCyrl") return auth.name_uz_cyrl || auth.name
    return auth.name
}

export const getLocalizedDirectionName = (directionId: string | number | undefined | null, locale: Locale) => {
    if (directionId === undefined || directionId === null) return ""
    const dir = controlDirections.find(d =>
        d.id?.toString() === directionId.toString() ||
        d.code === directionId || // Added check for code
        d.name === directionId ||
        d.name_uz_latn === directionId ||
        d.name_uz_cyrl === directionId
    )
    if (!dir) return directionId.toString()
    if (locale === "uzLatn") return dir.name_uz_latn || dir.name
    if (locale === "uzCyrl") return dir.name_uz_cyrl || dir.name
    return dir.name
}

export const getPersonnelName = (personId: any, militaryPersonnel: any[] = [], physicalPersons: any[] = []) => {
    if (!personId) return "—"
    const p = militaryPersonnel.find(mp => mp.id.toString() === personId.toString())
    if (!p) return personId
    const phys = physicalPersons.find(pp => pp.id === p.personId)
    return phys ? `${phys.lastName} ${phys.firstName} ${phys.middleName || ""}` : personId
}
