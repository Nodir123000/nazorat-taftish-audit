
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const controlAuthorities = {
    "КРУ МО РУ": {
        name: "Контрольно-ревизионное управление МО РУ",
        name_uz_latn: "O'zR MV Nazorat-taftish boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Назорат-тафтиш бошқармаси"
    },
    "ГУБП ГШ ВС РУ": {
        name: "Главное управление боевой подготовки ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Jangovar tayyorgarlik bosh boshqarmasi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Жанговар тайёргарлик бош бошқармаси"
    },
    "К ВПВО И ВВС": {
        name: "Войска противовоздушной обороны командования Войск ПВО и ВВС МО РУ",
        name_uz_latn: "O'zR MV HHM va HHK qo'mondonligining Havo hujumidan mudofaa qo'shinlari",
        name_uz_cyrl: "ЎзР МВ ҲҲМ ва ҲҲК қўмондонлигининг Ҳаво ҳужумидан мудофаа қўшинлари"
    },
    "УВВС К ВПВО И ВВС МО РУ": {
        name: "Управление военно-воздушных сил командования Войск ПВО и ВВС МО РУ",
        name_uz_latn: "O'zR MV HHM va HHK qo'mondonligining Harbiy havo kuchlari boshqarmasi",
        name_uz_cyrl: "ЎзР МВ ҲҲМ ва ҲҲК қўмондонлигининг Ҳарбий ҳаво кучлари бошқармаси"
    },
    "ГФЭУ МО РУ": {
        name: "Главное финансово-экономическое управление МО РУ",
        name_uz_latn: "O'zR MV Bosh moliya-iqtisod boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Бош молия-иқтисод бошқармаси"
    },
    "ГУВ МО РУ": {
        name: "Главное управление вооружения МО РУ",
        name_uz_latn: "O'zR MV Qurol-aslaha bosh boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Қурол-аслаҳа бош бошқармаси"
    }
    // ... add more if needed
};

async function main() {
    console.log('Seeding Control Authorities...');

    for (const [code, data] of Object.entries(controlAuthorities)) {
        await prisma.refControlAuthority.upsert({
            where: { code: code },
            update: {
                name: {
                    ru: data.name,
                    uz: data.name_uz_latn,
                    uzk: data.name_uz_cyrl
                }
            },
            create: {
                code: code,
                name: {
                    ru: data.name,
                    uz: data.name_uz_latn,
                    uzk: data.name_uz_cyrl
                }
            }
        });
        console.log(`Upserted: ${code}`);
    }

    console.log('Done.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
