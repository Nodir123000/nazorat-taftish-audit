import { MilitaryUnit } from "@/lib/types/military-unit";

export const mockMilitaryUnits: MilitaryUnit[] = [
    {
        id: "1",
        unitNumber: "00001",
        name: "123-я Мотострелковая Бригада",
        type: "Бригада",
        militaryDistrict: "Восточный военный округ",
        region: "Андижанская область",
        city: "город Андижан",
        address: "ул. Бобура, 12",
        commander: "Полковник Абдуллаев А.А.",
        staffCount: 450,
        auditsCount: 2,
        kpiScore: 92,
        status: "active",
        lastAuditDate: "2024-02-15"
    },
    {
        id: "2",
        unitNumber: "00002",
        name: "2-я Горно-стрелковая Бригада",
        type: "Бригада",
        militaryDistrict: "Восточный военный округ",
        region: "Андижанская область",
        city: "город Ханабад",
        address: "ул. Мустакиллик, 5",
        commander: "Подполковник Каримов Б.Б.",
        staffCount: 320,
        auditsCount: 1,
        kpiScore: 88,
        status: "active",
        lastAuditDate: "2023-11-20"
    },
    {
        id: "3",
        unitNumber: "00003",
        name: "34-й Артиллерийский Полк",
        type: "Полк",
        militaryDistrict: "Восточный военный округ",
        region: "Андижанская область",
        city: "Алтынкульский район",
        address: "пос. Ойбек, в/ч 00003",
        commander: "Майор Юсупов С.С.",
        staffCount: 210,
        auditsCount: 0,
        kpiScore: 75,
        status: "active",
    },
    {
        id: "4",
        unitNumber: "00004",
        name: "Отдельный Батальон Связи",
        type: "Батальон",
        militaryDistrict: "Ташкентский военный округ",
        region: "Ташкентская область",
        city: "г. Чирчик",
        address: "ул. А. Темура, 45",
        commander: "Подполковник Смирнов В.В.",
        staffCount: 150,
        auditsCount: 3,
        kpiScore: 95,
        status: "active",
        lastAuditDate: "2024-01-10"
    },
    {
        id: "5",
        unitNumber: "00005",
        name: "Центральный Военный Госпиталь",
        type: "Госпиталь",
        militaryDistrict: "Ташкентский военный округ",
        region: "г. Ташкент",
        city: "Мирзо-Улугбекский район",
        address: "ул. Паркентская, 22",
        commander: "Полковник мед. службы Алиев Р.Р.",
        staffCount: 500,
        auditsCount: 4,
        kpiScore: 98,
        status: "active",
        lastAuditDate: "2024-03-01"
    }
];

export const getMilitaryUnitById = (id: string): MilitaryUnit | undefined => {
    return mockMilitaryUnits.find(unit => unit.id === id);
};
