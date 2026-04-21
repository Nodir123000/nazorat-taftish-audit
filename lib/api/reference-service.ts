import { classifiers } from "@/components/reference/classifiers";

type Locale = "ru" | "uzCyrl" | "uzLatn";

export type Personnel = {
    id: number;
    personId: number;
    // rank and position now refer to classifier IDs or localized labels
    rank: Record<Locale, string>;
    position: Record<Locale, string>;
};

export type PhysicalPerson = {
    id: number;
    lastName: string;
    firstName: string;
    middleName?: string;
};

// -------------------- Helper to get localized classifier value --------------------
const getClassifierValue = (classifierId: number, valueId: number, locale: Locale): string => {
    const classifier = classifiers.find(c => c.id === classifierId);
    if (!classifier) return "";
    const value = classifier.values.find(v => v.id === valueId);
    if (!value) return "";

    if (locale === "uzLatn") return value.name_uz_latn || value.name;
    if (locale === "uzCyrl") return value.name_uz_cyrl || value.name;
    return value.name;
};

// -------------------- Mock data --------------------
const militaryPersonnelData = [
    { id: 1, personId: 1, rankId: 621, positionId: 1301 }, // Полковник, Командир части
    { id: 2, personId: 2, rankId: 620, positionId: 1307 }, // Подполковник, Старший офицер
    { id: 3, personId: 3, rankId: 619, positionId: 1309 }, // Майор, Инспектор
    { id: 11, personId: 11, rankId: 615, positionId: 1309 }, // Капитан, Инспектор
];

const getLocalPersonnel = (locale: Locale): Personnel[] => {
    return militaryPersonnelData.map(p => ({
        id: p.id,
        personId: p.personId,
        rank: {
            ru: getClassifierValue(6, p.rankId, "ru"),
            uzLatn: getClassifierValue(6, p.rankId, "uzLatn"),
            uzCyrl: getClassifierValue(6, p.rankId, "uzCyrl"),
        },
        position: {
            ru: getClassifierValue(13, p.positionId, "ru"),
            uzLatn: getClassifierValue(13, p.positionId, "uzLatn"),
            uzCyrl: getClassifierValue(13, p.positionId, "uzCyrl"),
        }
    }));
};

const physicalPersons: PhysicalPerson[] = [
    { id: 1, lastName: "Абдуллаев", firstName: "Фарход", middleName: "Рашидович" },
    { id: 2, lastName: "Каримова", firstName: "Нурислам", middleName: "Бахтиёрович" },
    { id: 3, lastName: "Султанов", firstName: "Тимур", middleName: "Алексеевич" },
    { id: 11, lastName: "Иванов", firstName: "Сергей", middleName: "Сергеевич" },
];

export const loadMilitaryPersonnel = (locale: Locale): Promise<Personnel[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getLocalPersonnel(locale));
        }, 100);
    });
};

export const loadPhysicalPersons = (): Promise<PhysicalPerson[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(physicalPersons), 100);
    });
};

export const loadSupplyDepartments = async (): Promise<any[]> => {
    try {
        const response = await fetch('/api/supply-departments');
        if (!response.ok) throw new Error('Failed to fetch supply departments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching supply departments:', error);
        return [];
    }
};
