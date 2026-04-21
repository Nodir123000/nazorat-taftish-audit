
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const districts = [
        {
            districtId: 1,
            code: "ТВО",
            name: { ru: "Ташкентский военный округ", uz: "Toshkent harbiy okrugi", uzk: "Тошкент ҳарбий округи" },
            shortName: { ru: "ТВО", uz: "THO", uzk: "ТҲО" }
        },
        {
            districtId: 2,
            code: "СЗВО",
            name: { ru: "Северо-западный военный округ", uz: "Shimoli-g'arbiy harbiy okrugi", uzk: "Шимоли-ғарбий ҳарбий округи" },
            shortName: { ru: "СЗВО", uz: "ShG'HO", uzk: "ШҒҲО" }
        },
        {
            districtId: 3,
            code: "ЮЗВО",
            name: { ru: "Юго-западный особый военный округ", uz: "Janubi-g'arbiy maxsus harbiy okrugi", uzk: "Жануби-ғарбий махсус ҳарбий округи" },
            shortName: { ru: "ЮЗВО", uz: "JG'MHO", uzk: "ЖҒМҲО" }
        },
        {
            districtId: 4,
            code: "ЦВО",
            name: { ru: "Центральный военный округ", uz: "Markaziy harbiy okrugi", uzk: "Марказий ҳарбий округи" },
            shortName: { ru: "ЦВО", uz: "MHO", uzk: "МҲО" }
        },
        {
            districtId: 5,
            code: "ВВО",
            name: { ru: "Восточный военный округ", uz: "Sharqiy harbiy okrugi", uzk: "Шарқий ҳарбий округи" },
            shortName: { ru: "ВВО", uz: "ShHO", uzk: "ШҲО" }
        }
    ]

    console.log('Seeding Military Districts...')
    for (const d of districts) {
        await (prisma as any).ref_military_districts.upsert({
            where: { district_id: d.districtId },
            update: {
                code: d.code,
                name: d.name,
                short_name: d.shortName,
            },
            create: {
                district_id: d.districtId,
                code: d.code,
                name: d.name,
                short_name: d.shortName,
            }
        })
    }
    console.log('✅ Military Districts seeded.')
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
