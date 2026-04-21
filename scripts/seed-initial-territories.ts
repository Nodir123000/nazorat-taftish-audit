
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const regions = [
    {
        name: { ru: "г. Ташкент", uz: "Toshkent sh.", uzk: "Тошкент ш." },
        type: "City",
        areas: [
            { name: { ru: "Юнусабадский район", uz: "Yunusobod tumani", uzk: "Юнусобод тумани" }, type: "District" },
            { name: { ru: "Мирзо-Улугбекский район", uz: "Mirzo Ulugbek tumani", uzk: "Мирзо Улуғбек тумани" }, type: "District" },
            { name: { ru: "Чиланзарский район", uz: "Chilonzor tumani", uzk: "Чилонзор тумани" }, type: "District" },
            { name: { ru: "Яшнабадский район", uz: "Yashnobod tumani", uzk: "Яшнобод тумани" }, type: "District" },
            { name: { ru: "Яккасарайский район", uz: "Yakkasaroy tumani", uzk: "Яккасарой тумани" }, type: "District" },
            { name: { ru: "Шайхантахурский район", uz: "Shayxontohur tumani", uzk: "Шайхонтоҳур тумани" }, type: "District" },
            { name: { ru: "Учтепинский район", uz: "Uchtepa tumani", uzk: "Учтепа тумани" }, type: "District" },
            { name: { ru: "Сергелийский район", uz: "Sergeli tumani", uzk: "Сергели тумани" }, type: "District" },
            { name: { ru: "Алмазарский район", uz: "Olmazor tumani", uzk: "Олмазор тумани" }, type: "District" },
            { name: { ru: "Мирабадский район", uz: "Mirobod tumani", uzk: "Миробод тумани" }, type: "District" },
            { name: { ru: "Бектемирский район", uz: "Bektemir tumani", uzk: "Бектемир тумани" }, type: "District" },
            { name: { ru: "Янгихаётский район", uz: "Yangihayot tumani", uzk: "Янгиҳаёт тумани" }, type: "District" }
        ]
    },
    {
        name: { ru: "Республика Каракалпакстан", uz: "Qoraqalpogʻiston Respublikasi", uzk: "Қорақалпоғистон Республикаси" },
        type: "Republic",
        areas: [
            { name: { ru: "Нукус", uz: "Nukus", uzk: "Нукус" }, type: "City" },
        ]
    },
    {
        name: { ru: "Андижанская область", uz: "Andijon viloyati", uzk: "Андижон вилояти" },
        type: "Region",
        areas: [
            { name: { ru: "Андижан", uz: "Andijon", uzk: "Андижон" }, type: "City" },
        ]
    },
    {
        name: { ru: "Бухарская область", uz: "Buxoro viloyati", uzk: "Бухоро вилояти" },
        type: "Region",
        areas: []
    },
    {
        name: { ru: "Джизакская область", uz: "Jizzax viloyati", uzk: "Жиззах вилояти" },
        type: "Region",
        areas: []
    },
    {
        name: { ru: "Кашкадарьинская область", uz: "Qashqadaryo viloyati", uzk: "Қашқадарё вилояти" },
        type: "Region",
        areas: []
    },
    {
        name: { ru: "Навоийская область", uz: "Navoiy viloyati", uzk: "Навоий вилояти" },
        type: "Region",
        areas: []
    },
    {
        name: { ru: "Наманганская область", uz: "Namangan viloyati", uzk: "Наманган вилояти" },
        type: "Region",
        areas: []
    },
    {
        name: { ru: "Самаркандская область", uz: "Samarqand viloyati", uzk: "Самарқанд вилояти" },
        type: "Region",
        areas: [
            { name: { ru: "Самарканд", uz: "Samarqand", uzk: "Самарқанд" }, type: "City" }
        ]
    },
    {
        name: { ru: "Сурхандарьинская область", uz: "Surxondaryo viloyati", uzk: "Сурхондарё вилояти" },
        type: "Region",
        areas: []
    },
    {
        name: { ru: "Сырдарьинская область", uz: "Sirdaryo viloyati", uzk: "Сирдарё вилояти" },
        type: "Region",
        areas: []
    },
    {
        name: { ru: "Ташкентская область", uz: "Toshkent viloyati", uzk: "Тошкент вилояти" },
        type: "Region",
        areas: [
            { name: { ru: "Кибрайский район", uz: "Qibray tumani", uzk: "Қибрай тумани" }, type: "District" },
            { name: { ru: "Паркентский район", uz: "Parkent tumani", uzk: "Паркент тумани" }, type: "District" },
            { name: { ru: "Бостанлыкский район", uz: "Bo'stonliq tumani", uzk: "Бўстонлиқ тумани" }, type: "District" }
        ]
    },
    {
        name: { ru: "Ферганская область", uz: "Fargʻona viloyati", uzk: "Фарғона вилояти" },
        type: "Region",
        areas: []
    },
    {
        name: { ru: "Хорезмская область", uz: "Xorazm viloyati", uzk: "Хоразм вилояти" },
        type: "Region",
        areas: [
            { name: { ru: "Ургенч", uz: "Urganch", uzk: "Урганч" }, type: "City" }
        ]
    },
]

async function main() {
    console.log('Seeding territories via Raw SQL...')

    for (const reg of regions) {
        // Check existence by name.ru inside JSON using PostgreSQL JSONB query
        const existing: any[] = await prisma.$queryRaw`
        SELECT id FROM "ref_regions" 
        WHERE name->>'ru' = ${reg.name.ru}
        LIMIT 1
     `;

        let regionId;

        if (existing.length > 0) {
            regionId = existing[0].id;
        } else {
            const inserted: any[] = await prisma.$queryRaw`
             INSERT INTO "ref_regions" ("name", "type", "status", "created_at")
             VALUES (${reg.name}::jsonb, ${reg.type}, 'active', NOW())
             RETURNING id
         `;
            if (inserted.length > 0) {
                regionId = inserted[0].id;
                console.log(`Created Region: ${reg.name.ru}`);
            }
        }

        if (regionId) {
            for (const area of reg.areas) {
                const existingArea: any[] = await prisma.$queryRaw`
                 SELECT id FROM "ref_areas"
                 WHERE region_id = ${regionId} AND name->>'ru' = ${area.name.ru}
                 LIMIT 1
             `;

                if (existingArea.length === 0) {
                    await prisma.$executeRaw`
                     INSERT INTO "ref_areas" ("region_id", "name", "type", "status", "created_at")
                     VALUES (${regionId}, ${area.name}::jsonb, ${area.type}, 'active', NOW())
                 `;
                    console.log(`  -> Created Area: ${area.name.ru}`);
                }
            }
        }
    }
    console.log('Seeding complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
