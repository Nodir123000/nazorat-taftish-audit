
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const controlDirections = [
    {
        id: 1,
        code: "FIN",
        name: { ru: "Финансово-хозяйственная деятельность", uz: "Moliya-xo'jalik faoliyati", uzk: "Молия-хўжалик фаолияти" },
        abbreviation: "ФХД",
        abbreviation_uz_latn: "MXF",
        abbreviation_uz_cyrl: "МХФ",
        status: "active",
    },
    {
        id: 2,
        code: "SUP",
        name: { ru: "Материально-техническое обеспечение", uz: "Moddiy-texnik ta'minot", uzk: "Моддий-техник таъминот" },
        abbreviation: "МТО",
        abbreviation_uz_latn: "MTT",
        abbreviation_uz_cyrl: "МТТ",
        status: "active",
    },
    {
        id: 3,
        code: "PERS",
        name: { ru: "Кадровая работа и воспитательная деятельность", uz: "Kadrlar bilan ишлаш ва тарбиявий фаолият", uzk: "Кадровая работа и воспитательная деятельность" },
        abbreviation: "Кадры",
        abbreviation_uz_latn: "Kadrlar",
        abbreviation_uz_cyrl: "Кадрлар",
        status: "active",
    },
    {
        id: 4,
        code: "IT",
        name: { ru: "Связь, ИТ и защита информации", uz: "Aloqa, AT va axborotni himoya qilish", uzk: "Алоқа, АТ ва ахборотни ҳимоя қилиш" },
        abbreviation: "ИТ",
        abbreviation_uz_latn: "AT",
        abbreviation_uz_cyrl: "АТ",
        status: "active",
    },
    {
        id: 5,
        code: "MED",
        name: { ru: "Медицинское обеспечение", uz: "Tibbiy ta'minot", uzk: "Тиббий таъминот" },
        abbreviation: "Мед",
        abbreviation_uz_latn: "Tibbiy",
        abbreviation_uz_cyrl: "Тиббий",
        status: "active",
    },
    {
        id: 6,
        code: "TRAIN",
        name: { ru: "Боевая и специальная подготовка", uz: "Jangovar va maxsus tayyorgarlik", uzk: "Жанговар ва махсус тайёргарлик" },
        abbreviation: "БП",
        abbreviation_uz_latn: "JT",
        abbreviation_uz_cyrl: "ЖТ",
        status: "active",
    },
    {
        id: 7,
        code: "CORR",
        name: { ru: "Антикоррупционная деятельность", uz: "Antikorrupsiya faoliyati", uzk: "Антикоррупция фаолияти" },
        abbreviation: "АК",
        abbreviation_uz_latn: "AK",
        abbreviation_uz_cyrl: "АК",
        status: "active",
    }
];

async function main() {
    console.log('Syncing control directions (JS)...');

    for (const dir of controlDirections) {
        console.log(`Updating ${dir.code}...`);
        try {
            await prisma.ref_control_directions.upsert({
                where: { direction_id: dir.id },
                update: {
                    code: dir.code,
                    name: dir.name,
                    abbreviation: dir.abbreviation,
                    abbreviation_uz_latn: dir.abbreviation_uz_latn,
                    abbreviation_uz_cyrl: dir.abbreviation_uz_cyrl,
                    status: dir.status
                },
                create: {
                    direction_id: dir.id,
                    code: dir.code,
                    name: dir.name,
                    abbreviation: dir.abbreviation,
                    abbreviation_uz_latn: dir.abbreviation_uz_latn,
                    abbreviation_uz_cyrl: dir.abbreviation_uz_cyrl,
                    status: dir.status
                }
            });
        } catch (err) {
            console.error(`Failed to update ${dir.code}:`, err.message);
        }
    }

    console.log('Done!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
