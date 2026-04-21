import { Locale } from "@/lib/i18n/context"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons } from "@/components/reference/physical-persons-data"

export interface OrderFormData {
    // Header
    location: string
    orderDate: string
    orderNumber: string

    // Section 1: Appointment of responsible persons
    groupLeader: string
    groupLeaderRank: string
    groupLeaderPosition: string
    deputyLeader: string
    deputyLeaderRank: string
    deputyLeaderPosition: string
    groupMembers: string

    // Section 2: Control measures details
    startDate: string
    endDate: string
    unit: string
    unitCommander: string
    controlMeasuresDescription: string

    // Section 3: Group leader responsibilities
    instructionDate: string
    instructionDetails: string
    safetyMeasures: string

    // Section 4: Additional provisions
    specialistInvolvement: string
    transportRestrictions: string
    aviationTransport: string

    // Section 5: Control and notification
    controlNotes: string

    // Signatory
    signerName: string
    signerRank: string
    signerPosition: string

    // Plan details from DB
    planYear?: number
    incomingNumber?: string
    incomingDate?: string
    planBasis?: string
    planNumber?: string
    planDate?: string
    requirements?: string

    // Internal state for list management
    groupMembersList: string[]
}

const getMonthName = (dateStr: string, locale: Locale) => {
    if (!dateStr) return "___"
    const date = new Date(dateStr)
    let lang = "ru-RU"
    if (locale === "uzCyrl") lang = "uz-Cyrl-UZ"
    if (locale === "uzLatn") lang = "uz-Latn-UZ"
    return date.toLocaleString(lang, { month: "long" })
}

const getPersonnelName = (id: string, withRank: boolean = false) => {
    const mp = militaryPersonnel.find((p) => p.id.toString() === id)
    if (!mp) return id
    const person = physicalPersons.find((p) => p.id === mp.personId)
    const name = person
        ? `${person.lastName} ${person.firstName.charAt(0)}.${person.middleName ? person.middleName.charAt(0) + "." : ""}`
        : id
    return withRank ? `${mp.rank} ${name}` : name
}

/**
 * Renders a template by replacing placeholder tags with actual data
 * @param templateContent - Template string with {{tag}} placeholders
 * @param formData - Form data containing order information
 * @param locale - Current locale for date formatting
 * @returns Rendered template with replaced tags
 */
export const renderTemplate = (
    templateContent: string,
    formData: OrderFormData,
    locale: Locale
): string => {
    if (!templateContent) return ""

    // Prepare group composition text
    const groupComposition = formData.groupMembersList.length > 0
        ? formData.groupMembersList.map((id, idx) => {
            const mp = militaryPersonnel.find(p => p.id.toString() === id)
            const person = physicalPersons.find(p => p.id === mp?.personId)
            const fullName = person
                ? `${person.lastName} ${person.firstName.charAt(0)}.${person.middleName ? person.middleName.charAt(0) + "." : ""}`
                : id
            return `${idx + 1}. ${mp?.rank || ""} ${fullName} (${mp?.position || ""})`
        }).join("\n")
        : (formData.groupMembers || "согласно приложению № 1 (плану)")

    // Format dates based on locale
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "«__» __________ 2025 " + (locale === "ru" ? "г." : "y.")
        const parts = dateStr.split("-")
        const day = parts[2]
        const month = getMonthName(dateStr, locale)
        const year = parts[0]
        return `«${day}» ${month} ${year} ${locale === "ru" ? "г." : "y."}`
    }

    // Tag replacement map
    const tags: Record<string, string> = {
        order_number: formData.orderNumber || "_______",
        order_date: formatDate(formData.orderDate),
        location: formData.location || (locale === "ru" ? "г. Ташкент" : "Toshkent sh."),

        start_date: formatDate(formData.startDate),
        end_date: formatDate(formData.endDate),

        unit: formData.unit || "_______",
        object: formData.unit || "_______", // Alias

        direction: formData.controlMeasuresDescription || "_______",
        subject: formData.controlMeasuresDescription || "_______", // Alias

        unit_commander: formData.unitCommander || "_______",

        group_composition: groupComposition,
        briefing_date: formatDate(formData.instructionDate),

        leader_name: formData.groupLeader ? getPersonnelName(formData.groupLeader) : "_______",
        leader_rank: formData.groupLeaderRank || "_______",
        leader_position: formData.groupLeaderPosition || "_______",

        deputy_name: formData.deputyLeader ? getPersonnelName(formData.deputyLeader) : "_______",
        deputy_rank: formData.deputyLeaderRank || "_______",
        deputy_position: formData.deputyLeaderPosition || "_______",

        controller: formData.controlNotes || "###########",

        signer_name: formData.signerName ? getPersonnelName(formData.signerName) : "###########",
        signer_rank: formData.signerRank || "###########",
        signer_position: formData.signerPosition || "###########",

        plan_year: formData.planYear?.toString() || "______",
        incoming_number: formData.incomingNumber || "______",
        incoming_date: formData.incomingDate ? formatDate(formData.incomingDate) : "«__» __________ ______ г.",

        plan_basis: formData.planBasis || "_______",
        instruction_details: formData.instructionDetails || "_______",
        safety_measures: formData.safetyMeasures || "_______",

        plan_number: formData.planNumber || "_______",
        plan_date: formData.planDate ? formatDate(formData.planDate) : "«__» __________ ______ г.",
        requirements: formData.requirements || "_______",

        issuer: formData.signerName ? getPersonnelName(formData.signerName, true) : "###########", // Legacy compat
    }

    // Replace all tags
    let result = templateContent
    Object.entries(tags).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
        result = result.replace(regex, value)
    })

    return result
}
