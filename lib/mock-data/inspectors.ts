import type { Inspector } from "@/lib/types/inspector"

// Mock data for inspectors
export const mockInspectors: Inspector[] = [
    {
        id: 361,
        pin: "31205850310025",
        source: "Ministry",
        licenseCount: 12,
        militaryRank: "Подполковник",
        militaryUnit: "45678",
        rank: "Подполковник",
        passportNumber: "AC1234567",
        dateOfBirth: "1980-05-15",
        fullName: "Каримов Алишер Рахимович",
        firstName: "Алишер",
        lastName: "Каримов",
        patronymic: "Рахимович",
        position: "Старший инспектор-ревизор",
        department: "Отдел контрольно-ревизионной работы",
        citizenship: "Узбекистан",
        placeOfBirth: "г. Ташкент",
        registrationAddress: "г. Ташкент, ул. Навои, д. 15, кв. 42",
        actualAddress: "г. Ташкент, ул. Навои, д. 15, кв. 42",
        maritalStatus: "Женат",
        gender: "Мужской",
        nationality: "Узбек",
        passportSeries: "AC",
        passportIssueDate: "2015-03-20",
        passportExpiryDate: "2025-03-20",
        passportIssuedBy: "МВД Республики Узбекистан",
        militaryID: "МБ-456789",
        militaryIDIssueDate: "2002-09-01",
        militaryIDExpiryDate: "2030-09-01",
        serviceNumber: "ВС-2002-456789",
        serviceStartDate: "2002-09-01",
        specialization: "Финансовые ревизии",
        clearanceLevel: "Секретно",
        contactPhone: "+998901234567",
        email: "a.karimov@mod.uz",
        emergencyContact: "Каримова Малика",
        emergencyPhone: "+998901234568",
        photo: "",

        // Служебные данные
        employmentDate: "2002-09-01",
        contractEndDate: "2027-09-01",
        certifications: [
            {
                id: "cert-1",
                name: "Сертификат аудитора",
                issueDate: "2020-06-15",
                expiryDate: "2025-06-15",
                issuedBy: "Министерство финансов",
                status: "active",
            },
            {
                id: "cert-2",
                name: "Квалификация ревизора",
                issueDate: "2018-03-10",
                expiryDate: "2024-03-10",
                issuedBy: "Министерство обороны",
                status: "expiring",
            },
        ],
        completedCourses: [
            {
                id: "course-1",
                name: "Финансовый контроль в вооруженных силах",
                completionDate: "2023-05-20",
                institution: "Академия МО",
                certificateNumber: "ФК-2023-0456",
            },
            {
                id: "course-2",
                name: "Противодействие коррупции",
                completionDate: "2022-11-15",
                institution: "Центр повышения квалификации",
                certificateNumber: "ПК-2022-1234",
            },
        ],

        // KPI инспектора
        auditsCompleted: 45,
        auditsInProgress: 3,
        auditsPlanned: 5,
        violationsFound: 127,
        totalDamageAmount: 856000000,
        kpiScore: 92,
        kpiRating: "excellent",

        // Категория инспектора
        inspectorCategory: "Старший инспектор",
        specializations: ["Финансовые ревизии", "Материальные ценности", "Кадровый учет"],

        // История ревизий
        auditHistory: [
            {
                id: "audit-1",
                auditNumber: "РВ-2024-0156",
                auditType: "Плановая ревизия",
                organizationName: "Воинская часть 12345",
                startDate: "2024-10-01",
                endDate: "2024-10-15",
                status: "completed",
                violationsFound: 8,
                damageAmount: 45000000,
            },
            {
                id: "audit-2",
                auditNumber: "РВ-2024-0189",
                auditType: "Внеплановая проверка",
                organizationName: "Воинская часть 67890",
                startDate: "2024-11-10",
                endDate: "",
                status: "in_progress",
                violationsFound: 3,
                damageAmount: 12000000,
            },
            {
                id: "audit-3",
                auditNumber: "РВ-2024-0234",
                auditType: "Плановая ревизия",
                organizationName: "Воинская часть 11111",
                startDate: "2024-12-20",
                endDate: "2025-01-10",
                status: "planned",
                violationsFound: 0,
                damageAmount: 0,
            },
        ],

        // Дополнительная информация
        workPhone: "+998712345678",
        personalPhone: "+998901234567",
        militaryDistrict: "Ташкентский военный округ",
        notes: "Опытный инспектор с высокими показателями эффективности",
    },
    {
        id: 362,
        pin: "31008750420036",
        source: "Ministry",
        licenseCount: 8,
        militaryRank: "Майор",
        militaryUnit: "34567",
        rank: "Майор",
        passportNumber: "AC2345678",
        dateOfBirth: "1985-08-22",
        fullName: "Юсупов Бахтиёр Тохирович",
        firstName: "Бахтиёр",
        lastName: "Юсупов",
        patronymic: "Тохирович",
        position: "Инспектор-ревизор",
        department: "Отдел контрольно-ревизионной работы",
        citizenship: "Узбекистан",
        placeOfBirth: "г. Самарканд",
        registrationAddress: "г. Ташкент, ул. Бунёдкор, д. 8, кв. 15",
        actualAddress: "г. Ташкент, ул. Бунёдкор, д. 8, кв. 15",
        maritalStatus: "Женат",
        gender: "Мужской",
        nationality: "Узбек",
        passportSeries: "AC",
        passportIssueDate: "2018-07-12",
        passportExpiryDate: "2028-07-12",
        passportIssuedBy: "МВД Республики Узбекистан",
        militaryID: "МБ-567890",
        militaryIDIssueDate: "2007-06-15",
        militaryIDExpiryDate: "2032-06-15",
        serviceNumber: "ВС-2007-567890",
        serviceStartDate: "2007-06-15",
        specialization: "Материальные ценности",
        clearanceLevel: "Для служебного пользования",
        contactPhone: "+998902345678",
        email: "b.yusupov@mod.uz",
        emergencyContact: "Юсупова Дилноза",
        emergencyPhone: "+998902345679",
        photo: "",

        // Служебные данные
        employmentDate: "2007-06-15",
        contractEndDate: "2028-06-15",
        certifications: [
            {
                id: "cert-3",
                name: "Сертификат ревизора",
                issueDate: "2021-04-20",
                expiryDate: "2026-04-20",
                issuedBy: "Министерство финансов",
                status: "active",
            },
        ],
        completedCourses: [
            {
                id: "course-3",
                name: "Учет материальных ценностей",
                completionDate: "2023-08-10",
                institution: "Академия МО",
                certificateNumber: "МЦ-2023-0789",
            },
        ],

        // KPI инспектора
        auditsCompleted: 28,
        auditsInProgress: 2,
        auditsPlanned: 3,
        violationsFound: 64,
        totalDamageAmount: 420000000,
        kpiScore: 78,
        kpiRating: "good",

        // Категория инспектора
        inspectorCategory: "Инспектор",
        specializations: ["Материальные ценности", "Инвентаризация"],

        // История ревизий
        auditHistory: [
            {
                id: "audit-4",
                auditNumber: "РВ-2024-0178",
                auditType: "Плановая ревизия",
                organizationName: "Воинская часть 22222",
                startDate: "2024-09-15",
                endDate: "2024-09-30",
                status: "completed",
                violationsFound: 5,
                damageAmount: 28000000,
            },
        ],

        // Дополнительная информация
        workPhone: "+998712345679",
        personalPhone: "+998902345678",
        militaryDistrict: "Самаркандский военный округ",
        notes: "",
    },
]

// Функция получения инспектора по ID
export function getInspectorById(id: number): Inspector | undefined {
    return mockInspectors.find((inspector) => inspector.id === id)
}

// Функция получения всех инспекторов
export function getAllInspectors(): Inspector[] {
    return mockInspectors
}
