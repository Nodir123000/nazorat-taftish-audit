import { PersonnelMember } from "@/lib/types/personnel";
import { EmployeeDTO } from "@/lib/types/personnel.dto";

export function mapToDTO(personnel: PersonnelMember): EmployeeDTO {
    return {
        id: personnel.id.toString(),
        pin: personnel.pin,
        firstName: personnel.firstName,
        lastName: personnel.lastName,
        patronymic: personnel.patronymic,
        fullName: personnel.fullName,
        rank: personnel.militaryRank,
        position: personnel.position,
        department: personnel.department,
        militaryUnit: personnel.militaryUnit,
        militaryDistrict: personnel.militaryDistrict,
        dob: personnel.dateOfBirth,
        gender: personnel.gender === "Мужской" ? "MALE" : (personnel.gender === "Женский" ? "FEMALE" : undefined),
        nationality: personnel.nationality,
        militaryRank: personnel.militaryRank,
        passportNumber: personnel.passportNumber,
        specialization: personnel.specialization,
        passport: {
            series: personnel.passportSeries || "",
            number: personnel.passportNumber || "",
            issueDate: personnel.passportIssueDate || "",
            expiryDate: personnel.passportExpiryDate || "",
            issuedBy: personnel.passportIssuedBy || "МВД",
        },
        contacts: [
            { type: "PHONE", value: personnel.contactPhone || "", isPrimary: true },
            { type: "EMAIL", value: personnel.email || "", isPrimary: false },
        ].filter(c => c.value),
        licenseCount: typeof personnel.licenseCount === 'string'
            ? parseInt(personnel.licenseCount.includes('/') ? personnel.licenseCount.split('/')[1] : personnel.licenseCount)
            : personnel.licenseCount,
        auditCount: personnel.auditCount || 0,
        inspectorCategory: personnel.inspectorCategory,
        totalDamageAmount: personnel.totalDamageAmount || 0,
        kpiRating: personnel.kpiRating,
        serviceStartDate: personnel.serviceStartDate,
        violationsFound: personnel.violationsFound || 0,
        serviceNumber: personnel.serviceNumber,
        source: personnel.source,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}
