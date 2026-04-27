import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
        address: "проспект Навои, д. 21",
    }
];

async function main() {
    console.log('--- SEEDING PHYSICAL PERSONS START ---')
    for (const p of physicalPersonsData) {
        await (prisma as any).ref_physical_persons.upsert({
            where: { pinfl: p.pinfl },
            update: {
                last_name: p.lastName,
                first_name: p.firstName,
                middle_name: p.middleName,
                birth_date: p.birthDate,
                contact_phone: p.contactPhone,
                address: p.address
            },
            create: {
                pinfl: p.pinfl,
                passport_series: p.passportSeries,
                passport_number: p.passportNumber,
                last_name: p.lastName,
                first_name: p.firstName,
                middle_name: p.middleName,
                birth_date: p.birthDate,
                contact_phone: p.contactPhone,
                address: p.address
            }
        })
    }
    console.log('--- SEEDING COMPLETE ---')
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
