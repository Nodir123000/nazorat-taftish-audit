export interface PhysicalPerson {
    id: number;
    pinfl: string;
    passport: string;
    lastName: string;
    firstName: string;
    middleName?: string;
    gender: string;
    nationality: string;
    birthDate: string;
    region: string;
    district: string;
    streetHouse: string;
    phone: string;
    status: "active" | "inactive";
}

export const physicalPersons: PhysicalPerson[] = [
    {
        id: 1,
        pinfl: "12345678901234",
        passport: "AA1234567",
        lastName: "Иванов",
        firstName: "Иван",
        middleName: "Иванович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "01.01.1985",
        region: "Ташкент",
        district: "Мирзо-Улугбекский",
        streetHouse: "ул. Мустакиллик, д. 5, кв. 22",
        phone: "+998 90 123-45-67",
        status: "active"
    },
    {
        id: 2,
        pinfl: "23456789012345",
        passport: "AB2345678",
        lastName: "Петров",
        firstName: "Петр",
        middleName: "Петрович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "15.05.1990",
        region: "Ташкент",
        district: "Яккасарайский",
        streetHouse: "ул. Бабура, д. 10, кв. 5",
        phone: "+998 91 234-56-78",
        status: "active"
    },
    {
        id: 3,
        pinfl: "34567890123456",
        passport: "AC3456789",
        lastName: "Сидоров",
        firstName: "Сидор",
        middleName: "Сидорович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "20.08.1978",
        region: "Ташкент",
        district: "Учтепинский",
        streetHouse: "ул. Навои, д. 25, кв. 12",
        phone: "+998 93 345-67-89",
        status: "active"
    },
    {
        id: 4,
        pinfl: "45678901234567",
        passport: "AD4567890",
        lastName: "Алиев",
        firstName: "Алишер",
        middleName: "Рахимович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "10.03.1992",
        region: "Ташкент",
        district: "Сергелийский",
        streetHouse: "ул. Амира Темура, д. 8, кв. 3",
        phone: "+998 94 456-78-90",
        status: "active"
    },
    {
        id: 5,
        pinfl: "56789012345678",
        passport: "AE5678901",
        lastName: "Каримов",
        firstName: "Карим",
        middleName: "Азизович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "25.07.1987",
        region: "Ташкент",
        district: "Шайхантахурский",
        streetHouse: "ул. Чиланзар, д. 15, кв. 7",
        phone: "+998 95 567-89-01",
        status: "active"
    },
    {
        id: 6,
        pinfl: "67890123456789",
        passport: "AF6789012",
        lastName: "Усманов",
        firstName: "Усман",
        middleName: "Бахтиярович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "05.12.1995",
        region: "Самарканд",
        district: "Самаркандский",
        streetHouse: "ул. Регистан, д. 20, кв. 9",
        phone: "+998 97 678-90-12",
        status: "active"
    },
    {
        id: 7,
        pinfl: "78901234567890",
        passport: "AG7890123",
        lastName: "Рахимов",
        firstName: "Рахим",
        middleName: "Шавкатович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "30.06.1982",
        region: "Бухара",
        district: "Бухарский",
        streetHouse: "ул. Ляби-Хауз, д. 12, кв. 4",
        phone: "+998 98 789-01-23",
        status: "active"
    },
    {
        id: 8,
        pinfl: "89012345678901",
        passport: "AH8901234",
        lastName: "Мирзаев",
        firstName: "Мирзо",
        middleName: "Абдуллаевич",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "18.08.1998",
        region: "Ташкент",
        district: "Юнусабадский",
        streetHouse: "ул. Юнусабад, д. 30, кв. 15",
        phone: "+998 99 890-12-34",
        status: "active"
    },
    {
        id: 9,
        pinfl: "90123456789012",
        passport: "AI9012345",
        lastName: "Хасанов",
        firstName: "Хасан",
        middleName: "Тулкинович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "12.12.1975",
        region: "Андижан",
        district: "Андижанский",
        streetHouse: "ул. Бабур, д. 5, кв. 2",
        phone: "+998 90 901-23-45",
        status: "active"
    },
    {
        id: 10,
        pinfl: "01234567890123",
        passport: "AJ0123456",
        lastName: "Абдуллаев",
        firstName: "Абдулла",
        middleName: "Искандарович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "22.04.1988",
        region: "Фергана",
        district: "Ферганский",
        streetHouse: "ул. Навои, д. 18, кв. 6",
        phone: "+998 91 012-34-56",
        status: "active"
    },
    {
        id: 11,
        pinfl: "11234567890124",
        passport: "AK1123457",
        lastName: "Юсупов",
        firstName: "Юсуп",
        middleName: "Рустамович",
        gender: "Мужской",
        nationality: "Узбек",
        birthDate: "14.04.1995",
        region: "Ташкент",
        district: "Яшнабадский",
        streetHouse: "ул. Яшнабад, д. 22, кв. 11",
        phone: "+998 93 112-34-57",
        status: "active"
    }
];
