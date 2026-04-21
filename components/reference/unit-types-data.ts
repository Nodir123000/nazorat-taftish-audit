export interface UnitType {
    id: string;
    name: string;
}

export const unitTypes: UnitType[] = [
    { id: "brigade", name: "Бригада" },
    { id: "battalion", name: "Отдельный батальон" },
    { id: "detachment", name: "Отдельный отряд" },
    { id: "center", name: "Учебный центр" },
    { id: "academy", name: "ВВОУ (Академия)" },
    { id: "management", name: "Управление" },
];
