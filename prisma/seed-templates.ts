import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedTemplates() {
    console.log("🌱 Seeding document templates...")

    // Шаблон приказа на русском
    const orderTemplateRu = {
        id: "order_general_ru",
        type: "order",
        title: "Общий приказ на ревизию",
        locale: "ru",
        is_active: true,
        content: `ПРИКАЗ
НАЧАЛЬНИКА КОНТРОЛЬНО-РЕВИЗИОННОГО УПРАВЛЕНИЯ
МИНИСТЕРСТВА ОБОРОНЫ РЕСПУБЛИКА УЗБЕКИСТАН

№ {{order_number}}

{{location}}                                            {{order_date}}

О проведении контрольных мероприятий в финансово-хозяйственной деятельности отдельных воинских частей и учреждений, подведомственных Министерству обороны

В соответствии с утверждённым Министром обороны Республики Узбекистан «Планом проведения контрольных и ревизионных мероприятий на {{plan_year}} год» (входящий № {{incoming_number}} от {{incoming_date}}), а также Положением об Управлении контроля и ревизии Министерства обороны,

ПРИКАЗЫВАЮ:

1. В период с {{start_date}} по {{end_date}} провести контрольные мероприятия в финансово-хозяйственной деятельности отдельных воинских частей и учреждений, подведомственных Министерству обороны.
2. Для проведения контрольных мероприятий назначить ответственных лиц в следующем составе:
руководитель группы – {{leader_rank}} {{leader_name}};
заместитель руководителя группы – {{deputy_rank}} {{deputy_name}};
члены группы – {{group_composition}}.
3. Руководителю группы:
   - организовать и провести контрольные мероприятия в соответствии с требованиями приказа Министра обороны от 4 июля 2025 г. № 688;
   - {{briefing_date}} провести инструктаж с составом контрольной группы в установленном порядке согласно приложению № 2;
   - осуществлять контроль за повседневной деятельностью личного состава, обеспечением безопасности и дисциплины при выездах и возвращении с мест дислокации воинских частей;
   - по согласованию с должностными лицами отделов, служб и структурных подразделений военного округа (командования) дополнительно привлекать специалистов к проведению контрольных мероприятий;
   - строго запретить выезды в командировки и возвращение из них на личном автотранспорте;
   - разрешить использование авиатранспорта «Uzbekiston havo yo‘llari» для командировок в Республику Каракалпакстан и Хорезмскую область и обратно.
4. Контроль за исполнением настоящего приказа оставляю за собой.
5. Настоящий приказ довести до сведения всех должностных лиц по принадлежности.


{{signer_position}}                                     {{signer_name}}`,
    }

    // Шаблон приказа на узбекском (кириллица)
    const orderTemplateUzCy = {
        id: "order_general_uz_cy",
        type: "order",
        title: "Умумий тафтиш буйруғи",
        locale: "uz_cy",
        is_active: true,
        content: `БУЙРУҚ
ЎЗБЕКИСТОН РЕСПУБЛИКАСИ МУДОФАА ВАЗИРЛИГИ
НАЗОРАТ-ТАФТИШ БОШҚАРМАСИ БОШЛИҒИ

№ {{order_number}}

{{location}}                                            {{order_date}}

Мудофаа вазирлигига бўйсунувчи айрим ҳарбий қисм ва муассасаларнинг молиявий-хўжалик фаолиятида назорат тадбирларини ўтказиш тўғрисида

Ўзбекистон Республикаси Мудофаа вазири томонидан тасдиқланган «{{plan_year}} йил учун назорат ва тафтиш тадбирларини ўтказиш режаси»га (кириш № {{incoming_number}}, {{incoming_date}} йилдаги), шунингдек Мудофаа вазирлиги Назорат-тафтиш бошқармаси тўғрисидаги Низомга мувофиқ,

БУЙРУҚ БЕРАМАН:

1. {{start_date}} дан {{end_date}} гача бўлган давр мобайнида Мудофаа вазирлигига бўйсунувчи айрим ҳарбий қисм ва муассасаларнинг молиявий-хўжалик фаолиятида назорат тадбирларини ўтказилсин.
2. Назорат тадбирларини ўтказиш учун қуйидаги таркибда масъул шахслар тайинлансин:
гуруҳ раҳбари – {{leader_rank}} {{leader_name}};
гуруҳ раҳбари ўринбосари – {{deputy_rank}} {{deputy_name}};
гуруҳ аъзолари – {{group_composition}}.
3. Гуруҳ раҳбарига:
   - назорат тадбирларини Мудофаа вазирининг 2025 йил 4 июлдаги 688-сонли буйруғи талабларига мувофиқ ташкил этсин ва ўтказсин;
   - {{briefing_date}} назорат гуруҳи таркиби билан белгиланган тартибда 2-иловага мувофиқ йўриқнома (инструктаж) ўтказсин;
   - шахсий таркибнинг кундалик фаолияти, ҳарбий қисмлар дислокация жойларига бориш ва қайтишда хавфсизлик ва интизомни таъминлаш устидан назоратни амалга оширсин;
   - ҳарбий округ (қўмондонлик) бўлимлари, хизматлари ва таркибий бўлинмалари мансабдор шахслари билан келишилган ҳолда назорат тадбирларини ўтказишга қўшимча мутахассисларни жалб этсин;
   - шахсий автотранспортда хизмат сафарига чиқиш ва ундан қайтишни қатъиян ман этсин;
   - Қорақалпоғистон Республикаси ва Хоразм вилоятига хизмат сафарлари учун «Uzbekistan havo yo‘llari» авиация транспортидан фойдаланишга рухсат берилсин.
4. Мазкур буйруқ ижросини назорат қилишни ўз зиммамда қолдираман.
5. Мазкур буйруқ тегишлилиги бўйича барча мансабдор шахсларга етказилсин.


{{signer_position}}                                     {{signer_name}}`,
    }

    // Шаблон приказа на узбекском (латиница)
    const orderTemplateUzLt = {
        id: "order_general_uz_lt",
        type: "order",
        title: "Umumiy taftish buyrug'i",
        locale: "uz_lt",
        is_active: true,
        content: `BUYRUQ
O'ZBEKISTON RESPUBLIKASI MUDOFAA VAZIRLIGI
NAZORAT-TAFTISH BOSHQARMASI BOSHLIG'I

№ {{order_number}}

{{location}}                                            {{order_date}}

Mudofaa vazirligiga bo'ysunuvchi ayrim harbiy qism va muassasalarning moliyaviy-xo'jalik faoliyatida nazorat tadbirlarini o'tkazish to'g'risida

O'zbekiston Respublikasi Mudofaa vaziri tomonidan tasdiqlangan «{{plan_year}} yil uchun nazorat va taftish tadbirlarini o'tkazish rejasi»ga (kirish № {{incoming_number}}, {{incoming_date}} yildagi), shuningdek Mudofaa vazirligi Nazorat-taftish boshqarmasi to'g'risidagi Nizomga muvofiq,

BUYRUQ BERAMAN:

1. {{start_date}} dan {{end_date}} gacha bo'lgan davr mobaynida Mudofaa vazirligiga bo'ysunuvchi ayrim harbiy qism va muassasalarning moliyaviy-xo'jalik faoliyatida nazorat tadbirlarini o'tkazilsin.
2. Nazorat tadbirlarini o'tkazish uchun quyidagi tarkibda mas'ul shaxslar tayinlansin:
guruh rahbari – {{leader_rank}} {{leader_name}};
guruh rahbari o'rinbosari – {{deputy_rank}} {{deputy_name}};
guruh a'zolari – {{group_composition}}.
3. Guruh rahbariga:
   - nazorat tadbirlarini Mudofaa vazirining 2025-yil 4-iyuldagi 688-sonli buyrug'i talablariga muvofiq tashkil etsin va o'tkazsin;
   - {{briefing_date}} nazorat guruh tarkibi bilan belgilangan tartibda 2-ilovaga muvofiq yo'riqnoma (instruktaj) o'tkazsin;
   - shaxsiy tarkibning kundalik faoliyati, harbiy qismlar dislokatsiya joylariga borish va qaytishda xavfsizlik va intizomni ta'minlash ustidan nazoratni amalga oshirsin;
   - harbiy okrug (qo'mondonlik) bo'limlari, xizmatlari va tarkibiy bo'linmalari mansabdor shaxslari bilan kelishilgan holda nazorat tadbirlarini o'tkazishga qo'shimcha mutaxassislarni jalb etsin;
   - shaxsiy avtotransportda xizmat safariga chiqish va undan qaytishni qat'iyan man etsin;
   - Qoraqalpog'iston Respublikasi va Xorazm viloyatiga xizmat safarlari uchun «Uzbekistan havo yo'llari» aviatsiya transportidan foydalanishga ruxsat berilsin.
4. Mazkur buyruq ijrosini nazorat qilishni o'z zimmamda qoldiraman.
5. Mazkur buyruq tegishliligi bo'yicha barcha mansabdor shaxslarga yetkazilsin.


{{signer_position}}                                     {{signer_name}}`,
    }

    // Шаблон инструктажа (RU)
    const briefingTemplateRu = {
        id: "briefing_general_ru",
        type: "briefing",
        title: "Лист инструктажа (Общий)",
        locale: "ru",
        is_active: true,
        content: `ЛИСТ ИНСТРУКТАЖА
(Приложение к Плану {{plan_basis}})

Мной, {{signer_rank}} {{signer_name}} ({{signer_position}}), проведен инструктаж с личным составом ревизионной группы, убывающей для проведения проверки в {{unit}}.

Состав группы (Инструктируемые):
{{group_composition}}

1. Порядок проведения проверки (тема инструктажа):
{{instruction_details}}

2. Меры безопасности:
{{safety_measures}}

Инструктирующий:

{{signer_position}}                                     {{signer_name}}`,
    }

    // Шаблон инструктажа (UZ_CY)
    const briefingTemplateUzCy = {
        id: "briefing_general_uz_cy",
        type: "briefing",
        title: "Йўриқнома варақаси (Умумий)",
        locale: "uz_cy",
        is_active: true,
        content: `ЙЎРИҚНОМА ВАРАҚАСИ
({{plan_basis}}-сонли Режага илова)

Мен, {{signer_rank}} {{signer_name}} ({{signer_position}}), {{unit}}да назорат тадбирини ўтказиш учун кетаётган ревизия гуруҳи шахсий таркиби билан йўриқнома (инструктаж) ўтказдим.

Гуруҳ таркиби (Йўриқнома берилганлар):
{{group_composition}}

1. Назорат тадбирида ишлаш тартиби (йўриқнома мавзуси):
{{instruction_details}}

2. Хавфсизлик чоралари:
{{safety_measures}}

Йўриқномани ўтказувчи:

{{signer_position}}                                     {{signer_name}}`,
    }

    // Шаблон инструктажа (UZ_LT)
    const briefingTemplateUzLt = {
        id: "briefing_general_uz_lt",
        type: "briefing",
        title: "Yo'riqnoma varaqasi (Umumiy)",
        locale: "uz_lt",
        is_active: true,
        content: `YO'RIQNOMA VARAQASI
({{plan_basis}}-sonli Rejaga ilova)

Men, {{signer_rank}} {{signer_name}} ({{signer_position}}), {{unit}}da nazorat tadbirini o'tkazish uchun ketayotgan reviziya guruhi shaxsiy tarkibi bilan yo'riqnoma (instruktaj) o'tkazdim.

Guruh tarkibi (Yo'riqnoma berilganlar):
{{group_composition}}

1. Nazorat tadbirida ishlash tartibi (yo'riqnoma mavzuси):
{{instruction_details}}

2. Xavfsizlik choralari:
{{safety_measures}}

Yo'riqnomani o'tkazuvchi:

{{signer_position}}                                     {{signer_name}}`,
    }

    // Шаблон предписания (RU)
    const prescriptionTemplateRu = {
        id: "prescription_general_ru",
        type: "prescription",
        title: "Предписание на ревизию (Общее)",
        locale: "ru",
        is_active: true,
        content: `П Р Е Д П И С А Н И Е

{{leader_rank}} {{leader_name}}
({{leader_position}})
(руководитель группы)

{{deputy_rank}} {{deputy_name}}
({{deputy_position}})

Специалисты:
{{group_composition}}

На основании "Плана контрольных мероприятий" Главного управления контроля и ревизий Министерства обороны Республики Узбекистан на {{plan_year}} год (утверждённого {{plan_date}} г. за № {{plan_number}}), в период с {{start_date}} по {{end_date}} провести контрольные мероприятия в финансово-хозяйственной деятельности {{unit}}.

В соответствии с требованиями приказа Министра обороны Республики Узбекистан № 688 от 4 июля 2025 года, по итогам проведённых контрольных мероприятий ревизорами оформляется акт проверки в установленном порядке. Один экземпляр акта (с приложениями) представить начальнику управления, второй — начальнику Главного управления контроля и ревизий Министерства обороны Республики Узбекистан.

Начальнику {{unit}}:
{{requirements}}

Начальник Контрольно-ревизионного управления
Министерства обороны Республики Узбекистан

{{signer_rank}}                                     {{signer_name}}`,
    }

    // Шаблон предписания (UZ_CY)
    const prescriptionTemplateUzCy = {
        id: "prescription_general_uz_cy",
        type: "prescription",
        title: "Тафтиш ўтказиш учун йўлланма (Умумий)",
        locale: "uz_cy",
        is_active: true,
        content: `Й Ў Л Л А Н М А

{{leader_rank}} {{leader_name}}
({{leader_position}})
(гуруҳ раҳбари)

{{deputy_rank}} {{deputy_name}}
({{deputy_position}})

Мутахассислар:
{{group_composition}}

Ўзбекистон Республикаси Мудофаа вазирлиги Назорат-тафтиш бош бошқармасининг {{plan_year}} йил учун "Назорат тадбирлари режаси" асосида ({{plan_date}} йилдаги № {{plan_number}} билан тасдиқланган), {{start_date}} дан {{end_date}} гача бўлган даврда {{unit}}нинг молиявий-хўжалик фаолиятида назорат тадбирлари ўтказилсин.

Ўзбекистон Республикаси Мудофаа вазирининг 2025 йил 4 июлдаги 688-сонли буйруғи талабларига мувофиқ, ўтказилган назорат тадбирлари якунлари бўйича ревизорлар томонидан белгиланган тартибда текширув далолатномаси расмийлаштирилади. Далолатноманинг бир нусхасини (иловалари билан) бошқарма бошлиғига, иккинчисини — Ўзбекистон Республикаси Мудофаа вазирлиги Назорат-тафтиш бош бошқармаси бошлиғига тақдим этилсин.

{{unit}} бошлиғига:
{{requirements}}

Ўзбекистон Республикаси Мудофаа вазирлиги
Назорат-тафтиш бошқармаси бошлиғи

{{signer_rank}}                                     {{signer_name}}`,
    }

    // Шаблон предписания (UZ_LT)
    const prescriptionTemplateUzLt = {
        id: "prescription_general_uz_lt",
        type: "prescription",
        title: "Taftish o'tkazish uchun yo'llanma (Umumiy)",
        locale: "uz_lt",
        is_active: true,
        content: `Y O' L L A N M A

{{leader_rank}} {{leader_name}}
({{leader_position}})
(guruh rahbari)

{{deputy_rank}} {{deputy_name}}
({{deputy_position}})

Mutaxassislar:
{{group_composition}}

O'zbekiston Respublikasi Mudofaa vazirligi Nazorat-taftish bosh boshqarmasining {{plan_year}} yil uchun "Nazorat tadbirlari rejasi" asosida ({{plan_date}} yildagi № {{plan_number}} bilan tasdiqlangan), {{start_date}} dan {{end_date}} gacha bo'lgan davrda {{unit}}ning moliyaviy-xo'jalik faoliyati nazorat tadbirlari o'tkazilsin.

O'zbekiston Respublikasi Mudofaa vazirining 2025-yil 4-iyuldagi 688-sonli buyrug'i talablariga muvofiq, o'tkazilgan nazorat tadbirlari yakunlari bo'yicha revizorlar tomonidan belgilangan tartibda tekshiruv dalolatnomasi rasmiylashtiriladi. Dalolatnomaning bir nusxasini (ilovalari bilan) boshqarma boshlig'iga, ikkinchisini — O'zbekiston Respublikasi Mudofaa vazirligi Nazorat-taftish bosh boshqarmasi boshlig'iga taqdim etilsin.

{{unit}} boshlig'iga:
{{requirements}}

O'zbekiston Respublikasi Mudofaa vazirligi
Nazorat-taftish boshqarmasi boshlig'i

{{signer_rank}}                                     {{signer_name}}`,
    }

    // Создаем или обновляем шаблоны
    // --- ACT TEMPLATES ---
    const actTemplateRu = {
        id: "act_general_ru",
        type: "act",
        title: "Акт ревизии (Общий)",
        locale: "ru",
        is_active: true,
        content: `АКТ РЕВИЗИИ № {{order_number}}
финансово-хозяйственной деятельности {{unit}}

г. {{location}}                                     «__» __________ 20__ г.

В соответствии с приказом {{signer_position}} от {{order_date}} № {{order_number}}, комиссией в составе:
Председатель: {{leader_rank}} {{leader_name}}
Члены комиссии: {{group_composition}}

в период с {{start_date}} по {{end_date}} проведена ревизия в {{unit}}.

В ходе ревизии установлено следующее:
{{requirements}}

Председатель комиссии: _________________ {{leader_name}}
Члены комиссии: _________________`,
    }

    // --- PROTOCOL TEMPLATES ---
    const protocolTemplateRu = {
        id: "protocol_general_ru",
        type: "protocol",
        title: "Протокол заседания (Общий)",
        locale: "ru",
        is_active: true,
        content: `ПРОТОКОЛ № {{order_number}}
заседания комиссии по результатам проверки в {{unit}}

г. {{location}}                                     «__» __________ 20__ г.

Присутствовали:
Председатель: {{leader_name}}
Члены комиссии: {{group_composition}}

ПОВЕСТКА ДНЯ:
1. Распосмотрение результатов ревизии {{unit}}.
2. Принятие решения по выявленным нарушениям.

ПОСТАНОВИЛИ:
{{requirements}}

Председатель: _________________ {{leader_name}}
Секретарь: _________________`,
    }

    const allTemplates = [
        orderTemplateRu,
        orderTemplateUzCy,
        orderTemplateUzLt,
        briefingTemplateRu,
        briefingTemplateUzCy,
        briefingTemplateUzLt,
        prescriptionTemplateRu,
        prescriptionTemplateUzCy,
        prescriptionTemplateUzLt,
        actTemplateRu,
        protocolTemplateRu
    ]

    console.log("Seeding templates...")
    for (const template of allTemplates) {
        await prisma.document_templates.upsert({
            where: { id: template.id },
            update: template,
            create: template,
        })
    }

    // --- SEED REGULATORY DOCUMENTS ---
    console.log("Seeding regulatory documents...")
    const sampleRegulations = [
        {
            num: "Приказ №120",
            type: "regulation",
            name: "Положение о порядке проведения финансовых ревизий",
            date: new Date("2023-01-15"),
            direction: "Финансовое",
            status: "active"
        },
        {
            num: "Инструкция №45",
            type: "instruction",
            name: "Инструкция по учету материальных средств",
            date: new Date("2023-05-20"),
            direction: "Тыл",
            status: "active"
        }
    ]

    for (const reg of sampleRegulations) {
        await prisma.regulatory_documents.upsert({
            where: { num: reg.num },
            update: reg,
            create: reg,
        })
    }

    console.log("Seeding completed successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
