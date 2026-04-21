export interface MilitaryPersonnel {
    id: number;
    personId: number;    // Связь с PhysicalPerson.id
    pnr: string;         // Личный номер (ПНР)
    rank: string;        // Воинское звание
    unitStateId: string; // Связь с MilitaryUnit.stateId
    position: string;    // Должность
    vus: string;         // ВУС (Военно-учетная специальность)
    status: "active" | "reserve" | "retired";
    category: "Офицер" | "Сержант" | "Рядовой";
}

export const militaryPersonnel: MilitaryPersonnel[] = [
    { id: 1, personId: 1, pnr: "Щ-851230", rank: "Полковник", unitStateId: "00015", position: "Командир части", vus: "010100", category: "Офицер", status: "active" },
    { id: 2, personId: 2, pnr: "ЕР-901122", rank: "Подполковник", unitStateId: "00011", position: "Заместитель командира", vus: "021000", category: "Офицер", status: "active" },
    { id: 3, personId: 3, pnr: "АС-780908", rank: "Майор", unitStateId: "00016", position: "Начальник штаба", vus: "030400", category: "Офицер", status: "active" },
    { id: 4, personId: 4, pnr: "Ю-920312", rank: "Капитан", unitStateId: "00006", position: "Командир батальона", vus: "040500", category: "Офицер", status: "active" },
    { id: 5, personId: 5, pnr: "Г-870720", rank: "Старший лейтенант", unitStateId: "00001", position: "Командир роты", vus: "050600", category: "Офицер", status: "active" },
    { id: 6, personId: 7, pnr: "К-820630", rank: "Подполковник", unitStateId: "00021", position: "Главный инженер", vus: "060700", category: "Офицер", status: "active" },
    { id: 7, personId: 8, pnr: "Х-980818", rank: "Лейтенант", unitStateId: "00002", position: "Командир взвода", vus: "070800", category: "Офицер", status: "active" },
    { id: 8, personId: 9, pnr: "Т-751228", rank: "Полковник", unitStateId: "00026", position: "Начальник управления", vus: "080900", category: "Офицер", status: "active" },
    { id: 9, personId: 2, pnr: "ЕР-901123", rank: "Майор", unitStateId: "00031", position: "Начальник охраны", vus: "091000", category: "Офицер", status: "active" },
    { id: 10, personId: 4, pnr: "Ю-920313", rank: "Капитан", unitStateId: "00007", position: "Старший офицер", vus: "101100", category: "Офицер", status: "active" },
    { id: 11, personId: 11, pnr: "И-950414", rank: "Капитан", unitStateId: "00031", position: "Инспектор", vus: "101100", category: "Офицер", status: "active" },
];

export const ranks = [
    // Высший офицерский состав (Генеральский)
    "Генерал армии",
    "Генерал-полковник",
    "Генерал-лейтенант",
    "Генерал-майор",

    // Старший офицерский состав
    "Полковник",
    "Подполковник",
    "Майор",
    "Капитан I ранга",
    "Капитан II ранга",
    "Капитан III ранга",

    // Младший офицерский состав
    "Капитан",
    "Старший лейтенант",
    "Лейтенант",
    "Младший лейтенант",
    "Капитан-лейтенант",

    // Сержантский состав
    "Старшина",
    "Старший сержант",
    "Сержант I степени",
    "Сержант II степени",
    "Сержант III степени",
    "Младший сержант",
    "Главный старшина",
    "Старшина I статьи",
    "Старшина II статьи",
    "Старшина III статьи",

    // Рядовой состав
    "Рядовой",
    "Матрос",
];

