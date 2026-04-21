import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Сидирование шаблонов документов...")

    const templates = [
        {
            id: "order_uz_cy",
            type: "order",
            title: "Буйруқ (Ўзбек)",
            locale: "uz_cy",
            content: `ЎЗБЕКИСТОН РЕСПУБЛИКАСИ МУДОФАА ВАЗИРЛИГИ
НАЗОРАТ-ТАФТИШ БОШҚАРМАСИ БОШЛИҒИНИНГ

{{location}}                                          {{order_date}}
№ {{order_number}}

Б У Й Р У Қ

Мудофаа вазирлиги тизимидаги айрим ҳарбий қисмлар ва муассасаларнинг молия-хўжалик фаолиятида назорат тадбирларини ўтказиш тўғрисида

Ўзбекистон Республикаси Мудофаа вазири томонидан тасдиқланган «{{plan_year}} йилга мўлжалланган назорат-тафтиш ишлари режаси»га ({{plan_date}} даги {{plan_number}}-сонли кириш №) ҳамда Назорат-тафтиш бошқармаси тўғрисидаги Низомга мувофиқ

Б У Й У Р А М А Н:

1. {{start_date}} дан {{end_date}} гача бўлган давр мобайнида айрим ҳарбий қисм ва муассасаларнинг молия-хўжалик фаолиятида назорат тадбирлари ўтказилсин.

2. Назорат тадбирларини ўтказиш учун қуйидаги таркибда масъул шахслар тайинлансин:
гуруҳ раҳбари – {{leader_rank}} {{leader_name}};
гуруҳ раҳбари ўринбосари – {{deputy_rank}} {{deputy_name}};
гуруҳ аъзолари – 1-иловага (режага) мувофиқ.

3. Гуруҳ раҳбарига:
назорат тадбирларини раҳбарий ҳужжатлар талабларига мувофиқ ташкил этиш ва ўтказиш юклатилсин.

4. Мазкур буйруқнинг ижросини назорат қилиш {{controller}} зиммасига юклатилсин.

{{signer_position}}

{{signer_rank}}                                     {{signer_name}}`
        },
        {
            id: "order_uz_lt",
            type: "order",
            title: "Буйруқ (Ўзбек)",
            locale: "uz_lt",
            content: `O'ZBEKISTON RESPUBLIKASI MUDOFAA VAZIRLIGI
NAZORAT-TAFTISH BOSHQARMASI BOSHLIG'INING

{{location}}                                          {{order_date}}
№ {{order_number}}

B U Y R U Q

Mudofaa vazirligi tizimidagi ayrim harbiy qismlar va muassasalarning moliya-xo'jalik faoliyatida nazorat tadbirlarini o'tkazish to'g'risida

{{plan_year}}-yilga mo'ljallangan nazorat-taftish ishlari rejasiga muvofiq hamda byudjet mablag'laridan maqsadli va samarali foydalanishni ta'minlash, shuningdek qo'shinlarda moliyaviy intizimni mustahkamlash maqsadida

B U Y U R A M A N:

1. **{{object}}**da moliya-xo'jalik faoliyati bo'yicha **{{start_date}}** dan **{{end_date}}** gacha bo'lgan davr uchun taftish o'tkazilsin.

2. Taftish o'tkazish uchun quyidagi tarkibda ishchi guruh tayinlansin:
Guruh rahbari: {{leader_rank}} {{leader_name}};
Rahbar o'rinbosari: {{deputy_rank}} {{deputy_name}};
Guruh a'zolari: {{group_composition}}.

3. Ishchi guruh rahbariga taftishni ruxsat etuvchi hujjatlar talablariga qat'iy rioya qilgan holda tashkil etish yuklatilsin. Taftish natijalari bo'yicha dalolatnoma rasmiylashtirilsin.

4. Mazkur buyruqning ijrosini nazorat qilish {{controller}} zimmasiga yuklatilsin.

{{signer_position}}

{{signer_rank}}                                     {{signer_name}}`
        }
    ]

    for (const template of templates) {
        // @ts-ignore
        await prisma.document_templates.upsert({
            where: { id: template.id },
            update: template,
            create: template,
        })
        console.log(`✅ Обработан шаблон: ${template.id} (${template.title})`)
    }

    console.log("✨ Сидирование завершено успешно!")
}

main()
    .catch((e) => {
        console.error("❌ Ошибка при сидировании:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
