
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Данные от пользователя для физических лиц
const physicalPersonsData = [
    {
        pinfl: "31204851230045",
        passportSeries: "AA",
        passportNumber: "1234567",
        lastName: "Абдуллаев",
        firstName: "Фарход",
        middleName: "Рустамович",
        birthDate: new Date("1985-05-15"),
        contactPhone: "+998 90 123-45-67",

        // Упрощаем привязки для сида - можно развить логику гео и национальности
        // Для примера привяжем всех к одному региону/полу если точных ID нет, 
        // или создадим их, но в рамках задач пользователя важнее само наличие людей.
        genderName: "Мужской",
        nationalityName: "Узбек",
        regionName: "г. Ташкент",
        address: "ул. Мустакиллик, д. 12",
    },
    {
        pinfl: "42510901230089",
        passportSeries: "AB",
        passportNumber: "9876543",
        lastName: "Каримова",
        firstName: "Нигора",
        middleName: "Бахтияровна",
        birthDate: new Date("1990-11-22"),
        contactPhone: "+998 93 987-65-43",
        genderName: "Женский",
        nationalityName: "Узбек",
        regionName: "Самаркандская область",
        address: "ул. Регистан, д. 45",
    },
    {
        pinfl: "30509781230012",
        passportSeries: "AC",
        passportNumber: "1122334",
        lastName: "Султанов",
        firstName: "Тимур",
        middleName: "Азизович",
        birthDate: new Date("1978-09-08"),
        contactPhone: "+998 94 111-22-33",
        genderName: "Мужской",
        nationalityName: "Узбек",
        regionName: "Бухарская область",
        address: "кв-л 5, д. 10, кв. 24",
    },
    {
        pinfl: "41103921230056",
        passportSeries: "AD",
        passportNumber: "5566778",
        lastName: "Ибрагимов",
        firstName: "Санжар",
        middleName: "Олимович",
        birthDate: new Date("1992-03-12"),
        contactPhone: "+998 97 555-66-77",
        genderName: "Мужской",
        nationalityName: "Узбек",
        regionName: "Ферганская область",
        address: "Ферганская ул., д. 8",
    },
    {
        pinfl: "32007871230090",
        passportSeries: "AE",
        passportNumber: "9900112",
        lastName: "Махмудов",
        firstName: "Алишер",
        middleName: "Ганиевич",
        birthDate: new Date("1987-07-20"),
        contactPhone: "+998 91 999-00-11",
        genderName: "Мужской",
        nationalityName: "Узбек", // Предположим, что "Узбек" - общее для национальности
        regionName: "Наманганская область",
        address: "проспект Навои, д. 21",
    },
    {
        pinfl: "40801951230023",
        passportSeries: "AF",
        passportNumber: "4433221",
        lastName: "Рахимова",
        firstName: "Дилором",
        middleName: "Усмановна",
        birthDate: new Date("1995-01-01"),
        contactPhone: "+998 95 444-33-22",
        genderName: "Женский",
        nationalityName: "Узбек",
        regionName: "Андижанская область",
        address: "Старый город, д. 5",
    },
    {
        pinfl: "31506821230077",
        passportSeries: "AG",
        passportNumber: "7788990",
        lastName: "Юсупов",
        firstName: "Жасур",
        middleName: "Кудратович",
        birthDate: new Date("1982-06-30"),
        contactPhone: "+998 99 777-88-99",
        genderName: "Мужской",
        nationalityName: "Узбек",
        regionName: "Республика Каракалпакстан",
        address: "ул. Темир йул, д. 14",
    },
    {
        pinfl: "41808981230034",
        passportSeries: "BC",
        passportNumber: "1122445",
        lastName: "Хайдаров",
        firstName: "Акмаль",
        middleName: "Шохрухович",
        birthDate: new Date("1998-08-18"),
        contactPhone: "+998 88 111-22-44",
        genderName: "Мужской",
        nationalityName: "Узбек",
        regionName: "Сурхандарьинская область",
        address: "Пограничная ул., д. 3",
    },
    {
        pinfl: "32812751230067",
        passportSeries: "BD",
        passportNumber: "6655443",
        lastName: "Мирзаев",
        firstName: "Ойбек",
        middleName: "Тулкунович",
        birthDate: new Date("1975-12-28"),
        contactPhone: "+998 90 666-55-44",
        genderName: "Мужской",
        nationalityName: "Узбек",
        regionName: "Сырдарьинская область",
        address: "3-й микрорайон, д. 22",
    },
    {
        pinfl: "40205941230011",
        passportSeries: "BE",
        passportNumber: "2233110",
        lastName: "Назарова",
        firstName: "Зухра",
        middleName: "Акрамовна",
        birthDate: new Date("1994-05-05"),
        contactPhone: "+998 91 222-33-11",
        genderName: "Женский",
        nationalityName: "Узбек",
        regionName: "Джизакская область",
        address: "ул. Шарафа Рашидова, д. 19",
    },
    {
        pinfl: "31102901230044",
        passportSeries: "AD",
        passportNumber: "1122334",
        lastName: "Иванов",
        firstName: "Сергей",
        middleName: "Сергеевич", // Исправлено "Сергеевич"
        birthDate: new Date("1990-02-11"),
        contactPhone: "+998 90 111-22-33",
        genderName: "Мужской",
        nationalityName: "Русский",
        regionName: "г. Ташкент",
        address: "квартал 19, д. 45",
    }
];

const ranks = [
    { title: "Рядовой", category: "Рядовой состав", level: 1 },
    { title: "Ефрейтор", category: "Рядовой состав", level: 2 },
    { title: "Младший сержант", category: "Сержантский состав", level: 3 },
    { title: "Сержант", category: "Сержантский состав", level: 4 },
    { title: "Старший сержант", category: "Сержантский состав", level: 5 },
    { title: "Лейтенант", category: "Офицерский состав", level: 6 },
    { title: "Старший лейтенант", category: "Офицерский состав", level: 7 },
    { title: "Капитан", category: "Офицерский состав", level: 8 },
    { title: "Майор", category: "Офицерский состав", level: 9 },
    { title: "Подполковник", category: "Офицерский состав", level: 10 },
    { title: "Полковник", category: "Офицерский состав", level: 11 },
    { title: "Генерал-майор", category: "Высший офицерский состав", level: 12 },
]

const positions = [
    { code: "CMD", name: "Командир части", nameUzLatn: "Qism komandiri", nameUzCyrl: "Қисм командири" },
    { code: "DEP_CMD", name: "Заместитель командира", nameUzLatn: "Komandir o'rinbosari", nameUzCyrl: "Командир ўринбосари" },
    { code: "CHIEF_STAFF", name: "Начальник штаба", nameUzLatn: "Shtab boshlig'i", nameUzCyrl: "Штаб бошлиғи" },
    { code: "FIN_HEAD", name: "Начальник финансовой службы", nameUzLatn: "Moliya xizmati boshlig'i", nameUzCyrl: "Молия хизмати бошлиғи" },
    { code: "HR_HEAD", name: "Начальник отдела кадров", nameUzLatn: "Kadrlar bo'limi boshlig'i", nameUzCyrl: "Кадрлар бўлими бошлиғи" },
    { code: "SPEC_AUDIT", name: "Главный аудитор", nameUzLatn: "Bosh auditor", nameUzCyrl: "Бош аудитор" },
    { code: "SPEC_INSP", name: "Старший инспектор", nameUzLatn: "Katta inspektor", nameUzCyrl: "Катта инспектор" },
]

const vusList = [
    { code: "010100", name: "Организация общевойсковой дисциплины" },
    { code: "020200", name: "Боевое применение мотострелковых подразделений" },
    { code: "090100", name: "Финансовое обеспечение" },
    { code: "090200", name: "Бухгалтерский учет" },
    { code: "850100", name: "Юрисконсультская работа" },
]


async function main() {
    console.log('--- SEEDING START ---')

    // 1. Seed Ranks
    console.log('Seeding Ranks...')
    for (const rank of ranks) {
        const existing = await prisma.refRank.findFirst({
            where: { title: rank.title }
        })

        if (!existing) {
            await prisma.refRank.create({
                data: rank
            })
        }
    }

    // 2. Seed Positions
    console.log('Seeding Positions...')
    for (const pos of positions) {
        await prisma.refPosition.upsert({
            where: { code: pos.code },
            update: {},
            create: pos
        })
    }

    // 3. Seed VUS (Specialties)
    console.log('Seeding VUS...')
    for (const vus of vusList) {
        await prisma.refVus.upsert({
            where: { code: vus.code },
            update: {},
            create: vus
        })
    }

    // 3. Seed Physical Persons
    console.log('Seeding Physical Persons (from user list)...')

    // Ensure basic gender/nationality exists (mocked for simplicity)
    // В реальном проекте тут должны быть четкие ID из справочников
    let genderM = await prisma.refGender.findFirst({ where: {} }) // Just grab any or null
    // If no gender, let's create simple ones? Maybe skipped for now, field is optional

    for (const p of physicalPersonsData) {
        // Try to find if exists
        const existing = await prisma.refPhysicalPerson.findUnique({
            where: { pinfl: p.pinfl }
        })

        if (!existing) {
            await prisma.refPhysicalPerson.create({
                data: {
                    pinfl: p.pinfl,
                    passportSeries: p.passportSeries,
                    passportNumber: p.passportNumber,
                    lastName: p.lastName,
                    firstName: p.firstName,
                    middleName: p.middleName,
                    birthDate: p.birthDate,
                    contactPhone: p.contactPhone,
                    address: p.address,
                    // genderId, nationalityId - skipping detailed lookup for brevity in this fix session
                }
            })
        }
    }

    console.log('--- SEEDING COMPLETE ---')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
