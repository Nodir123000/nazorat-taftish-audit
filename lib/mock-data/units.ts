export interface MilitaryUnit {
    id: number
    unitCode: string
    name: string
    fullName: string
    commanderName: string
    commanderRank: string
    district: string
    region: string
    city: string
    address: string
    type: string
    specialization: string
    status: 'active' | 'inactive'
    personnelCount: number
    lastAuditDate?: string
    lastAuditStatus?: string
    contactPhone?: string
    email?: string
}

export const mockUnitsData: MilitaryUnit[] = [
    {
        id: 1,
        unitCode: "12345",
        name: "В/Ч 12345",
        fullName: "123-я Мотострелковая Бригада",
        commanderName: "Абдуллаев Олим Ходжаевич",
        commanderRank: "Полковник",
        district: "Ташкентский военный округ",
        region: "Ташкентская область",
        city: "г. Ташкент",
        address: "ул. Мукими, 45",
        type: "Линейная часть",
        specialization: "Мотострелковые войска",
        status: 'active',
        personnelCount: 450,
        lastAuditDate: "15.12.2023",
        lastAuditStatus: "Завершено без замечаний",
        contactPhone: "+998 71 234 56 78",
        email: "unit12345@military.uz"
    },
    {
        id: 2,
        unitCode: "67890",
        name: "В/Ч 67890",
        fullName: "45-й Отдельный Разведывательный Батальон",
        commanderName: "Сафаров Ярослав Богданович",
        commanderRank: "Майор",
        district: "Центральный военный округ",
        region: "Самаркандская область",
        city: "г. Самарканд",
        address: "ул. Дагбитская, 12",
        type: "Специальная часть",
        specialization: "Разведка",
        status: 'active',
        personnelCount: 220,
        lastAuditDate: "10.01.2024",
        lastAuditStatus: "В процессе",
        contactPhone: "+998 66 123 45 67",
        email: "unit67890@military.uz"
    },
    {
        id: 3,
        unitCode: "11111",
        name: "В/Ч 11111",
        fullName: "77-й Полк Связи",
        commanderName: "Иванов Сергей Петрович",
        commanderRank: "Подполковник",
        district: "Восточный военный округ",
        region: "Ферганская область",
        city: "г. Фергана",
        address: "ул. Маърифат, 5",
        type: "Часть обеспечения",
        specialization: "Связь",
        status: 'active',
        personnelCount: 310,
        lastAuditDate: "05.11.2023",
        lastAuditStatus: "Выявлены нарушения",
        contactPhone: "+998 73 987 65 43",
        email: "unit11111@military.uz"
    }
]
