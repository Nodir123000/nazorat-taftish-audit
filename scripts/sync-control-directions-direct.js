
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const controlDirections = [
    {
        id: 1,
        code: "FIN",
        name: { ru: "Финансово-хозяйственная деятельность", uz: "Moliya-xo'jalik faoliyati", uzk: "Молия-хўжалик фаолияти" },
        abbreviation: "ФХД",
        abbreviation_uz_latn: "MXF",
        abbreviation_uz_cyrl: "МХФ",
    },
    {
        id: 2,
        code: "SUP",
        name: { ru: "Материально-техническое обеспечение", uz: "Moddiy-texnik ta'minot", uzk: "Моддий-техник таъминот" },
        abbreviation: "МТО",
        abbreviation_uz_latn: "MTT",
        abbreviation_uz_cyrl: "МТТ",
    },
    {
        id: 3,
        code: "PERS",
        name: { ru: "Кадровая работа и воспитательная деятельность", uz: "Kadrlar bilan ishlash va tarbiyaviy faoliyat", uzk: "Кадрлар билан ишлаш ва тарбиявий фаолият" },
        abbreviation: "Кадры",
        abbreviation_uz_latn: "Kadrlar",
        abbreviation_uz_cyrl: "Кадрлар",
    },
    {
        id: 4,
        code: "IT",
        name: { ru: "Связь, ИТ и защита информации", uz: "Aloqa, AT va axborotni himoya qilish", uzk: "Алоқа, АТ ва ахборотни ҳимоя қилиш" },
        abbreviation: "ИТ",
        abbreviation_uz_latn: "AT",
        abbreviation_uz_cyrl: "АТ",
    },
    {
        id: 5,
        code: "MED",
        name: { ru: "Медицинское обеспечение", uz: "Tibbiy ta'minot", uzk: "Тиббий таъминот" },
        abbreviation: "Мед",
        abbreviation_uz_latn: "Tibbiy",
        abbreviation_uz_cyrl: "Тиббий",
    },
    {
        id: 6,
        code: "TRAIN",
        name: { ru: "Боевая и специальная подготовка", uz: "Jangovar va maxsus tayyorgarlik", uzk: "Жанговар ва махсус тайёргарлик" },
        abbreviation: "БП",
        abbreviation_uz_latn: "JT",
        abbreviation_uz_cyrl: "ЖТ",
    },
    {
        id: 7,
        code: "CORR",
        name: { ru: "Антикоррупционная деятельность", uz: "Antikorrupsiya faoliyati", uzk: "Антикоррупция фаолияти" },
        abbreviation: "АК",
        abbreviation_uz_latn: "AK",
        abbreviation_uz_cyrl: "АК",
    }
];

async function main() {
    console.log('Syncing control directions via PG...');
    const client = await pool.connect();
    try {
        for (const dir of controlDirections) {
            console.log(`Updating ${dir.code}...`);
            await client.query(
                `UPDATE ref_control_directions 
                 SET abbreviation = $1, abbreviation_uz_latn = $2, abbreviation_uz_cyrl = $3, name = $4
                 WHERE direction_id = $5`,
                [dir.abbreviation, dir.abbreviation_uz_latn, dir.abbreviation_uz_cyrl, JSON.stringify(dir.name), dir.id]
            );
        }
        console.log('Done!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
