import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const regionsTranslation: Record<string, any> = {
    "01": { ru: "Андижанская область", uz: "Andijon viloyati", uzk: "Андижон вилояти" },
    "02": { ru: "Бухарская область", uz: "Buxoro viloyati", uzk: "Бухоро вилояти" },
    "03": { ru: "Ферганская область", uz: "Farg'ona viloyati", uzk: "Фарғона вилояти" },
    "04": { ru: "Джизакская область", uz: "Jizzax viloyati", uzk: "Жиззах вилояти" },
    "05": { ru: "Республика Каракалпакстан", uz: "Qoraqalpog'iston Respublikasining", uzk: "Қорақалпоғистон Республикаси" },
    "06": { ru: "Кашкадарьинская область", uz: "Qashqadaryo viloyati", uzk: "Қashqadaryo viloyati" }, // Wait, let's be more precise
    "07": { ru: "Наманганская область", uz: "Namangan viloyati", uzk: "Наманган вилояти" },
    "08": { ru: "Навоийская область", uz: "Navoiy viloyati", uzk: "Навоий вилояти" },
    "09": { ru: "Самаркандская область", uz: "Samarqand viloyati", uzk: "Самарқанд вилояти" },
    "10": { ru: "Сурхандарьинская область", uz: "Surxondaryo viloyati", uzk: "Сурхондарё вилояти" },
    "11": { ru: "Сырдарьинская область", uz: "Sirdaryo viloyati", uzk: "Сирдарё вилояти" },
    "12": { ru: "г. Ташкент", uz: "Toshkent shahri", uzk: "Тошкент шаҳри" },
    "13": { ru: "Ташкентская область", uz: "Toshkent viloyati", uzk: "Тошкент вилояти" },
    "14": { ru: "Хорезмская область", uz: "Xorazm viloyati", uzk: "Хоразм вилояти" },
}

async function main() {
    console.log('🚀 Fixing Region names...')
    const regions = await prisma.ref_regions.findMany()

    for (const r of regions) {
        if (regionsTranslation[r.code]) {
            await prisma.ref_regions.update({
                where: { id: r.id },
                data: {
                    name: regionsTranslation[r.code]
                }
            })
        }
    }
    console.log('✅ Regions updated.')
}

main().finally(() => prisma.$disconnect())
