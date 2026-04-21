import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const subdivisions = [
        {
            id: 1211,
            code: "1211",
            name: {
                ru: "Контрольно-ревизионное управление",
                uz: "Nazorat-taftish boshqarmasi",
                uzk: "Назорат-тафтиш бошқармаси"
            }
        },
        {
            id: 1212,
            code: "1212",
            name: {
                ru: "Организационно-методический отдел",
                uz: "Tashkiliy-uslubiy bo'lim",
                uzk: "Ташкилий-услубий бўлим"
            }
        },
        {
            id: 1213,
            code: "1213",
            name: {
                ru: "Отдел внутреннего аудита",
                uz: "Ichki audit bo'limi",
                uzk: "Ички аудит бўлими"
            }
        },
        {
            id: 1214,
            code: "1214",
            name: {
                ru: "Отдел финансовой инспекции",
                uz: "Moliyaviy inspektsiya bo'limi",
                uzk: "Молиявий инспекция бўлими"
            }
        },
        {
            id: 1215,
            code: "1215",
            name: {
                ru: "Отдел инспекции материального-технического обеспечения",
                uz: "Moddiy-texnik ta'minot inspektsiyasi bo'limi",
                uzk: "Моддий-техник таъминот инспекцияси бўлими"
            }
        },
    ]

    console.log('Seeding new subdivisions...')

    for (const sub of subdivisions) {
        await (prisma as any).ref_subdivision_names.upsert({
            where: { code: sub.code },
            update: {
                name: sub.name,
                status: 'active'
            },
            create: {
                id: sub.id,
                code: sub.code,
                name: sub.name,
                status: 'active'
            }
        })
        console.log(`Added/Updated: ${sub.name.ru}`)
    }

    console.log('Subdivisions seeding finished successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
