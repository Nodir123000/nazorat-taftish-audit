
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Expanded list of specializations (approx 100 entries)
const specializations = [
    // 1. LAND FORCES - COMBAT ARMS
    { code: '1001', ru: 'Мотострелковая', uz: "Motoo'qchi", uzk: 'Мотоўқчи' },
    { code: '1002', ru: 'Танковая', uz: 'Tank', uzk: 'Танк' },
    { code: '1003', ru: 'Артиллерийская', uz: 'Artilleriya', uzk: 'Артиллерия' },
    { code: '1004', ru: 'Ракетная', uz: 'Raketa', uzk: 'Ракета' },
    { code: '1005', ru: 'Зенитная', uz: 'Zenit', uzk: 'Зенит' },
    { code: '1006', ru: 'Противовоздушная оборона (ПВО)', uz: 'Havo hujumidan mudofaa', uzk: 'Ҳаво ҳужумидан мудофаа' },
    { code: '1007', ru: 'Минометная', uz: 'Minomyot', uzk: 'Миномёт' },
    { code: '1008', ru: 'Противотанковая', uz: 'Tankka qarshi', uzk: 'Танкка қарши' },
    { code: '1009', ru: 'Снайперская', uz: 'Snayperlik', uzk: 'Снайперлик' },
    { code: '1010', ru: 'Пулеметная', uz: 'Pulemyot', uzk: 'Пулемёт' },
    { code: '1011', ru: 'Гранатометная', uz: 'Granatomyot', uzk: 'Гранатомёт' },

    // 2. SPECIAL FORCES & RECON
    { code: '1101', ru: 'Разведывательная', uz: 'Razvedka', uzk: 'Разведка' },
    { code: '1102', ru: 'Специального назначения (Спецназ)', uz: 'Maxsus vazifali (Specnaz)', uzk: 'Махсус вазифали (Спецназ)' },
    { code: '1103', ru: 'Воздушно-десантная', uz: 'Havo-desant', uzk: 'Ҳаво-десант' },
    { code: '1104', ru: 'Десантно-штурмовая', uz: 'Desant-hujum', uzk: 'Десант-ҳужум' },
    { code: '1105', ru: 'Горно-стрелковая', uz: 'Tog\' o\'qchi', uzk: 'Тоғ ўқчи' },
    { code: '1106', ru: 'Диверсионно-разведывательная', uz: 'Diversiya-razvedka', uzk: 'Диверсия-разведка' },
    { code: '1107', ru: 'Радиоэлектронной разведки', uz: 'Radioelektron razvedka', uzk: 'Радиоэлектрон разведка' },

    // 3. COMBAT SUPPORT
    { code: '1201', ru: 'Инженерная', uz: 'Muhandislik', uzk: 'Муҳандислик' },
    { code: '1202', ru: 'Саперная', uz: 'Sapyorlik', uzk: 'Сапёрлик' },
    { code: '1203', ru: 'Понтонно-мостовая', uz: 'Ponton-ko\'prik', uzk: 'Понтон-кўприк' },
    { code: '1204', ru: 'Радиационной, химической и биологической защиты (РХБЗ)', uz: 'Radiatsion, kimyoviy va biologik himoya', uzk: 'Радиацион, кимёвий ва биологик ҳимоя' },
    { code: '1205', ru: 'Связи', uz: 'Aloqa', uzk: 'Алоқа' },
    { code: '1206', ru: 'Радиоэлектронной борьбы (РЭБ)', uz: 'Radioelektron kurash', uzk: 'Радиоэлектрон кураш' },
    { code: '1207', ru: 'Топогеодезическая', uz: 'Topogeodezik', uzk: 'Топогеодезик' },
    { code: '1208', ru: 'Картографическая', uz: 'Kartografik', uzk: 'Картографик' },
    { code: '1209', ru: 'Гидрометеорологическая', uz: 'Gidrometeorologik', uzk: 'Гидрометеорологик' },
    { code: '1210', ru: 'Радиолокационная', uz: 'Radiolokatsion', uzk: 'Радиолокацион' },
    { code: '1211', ru: 'Поисково-спасательная', uz: 'Qidiruv-qutqaruv', uzk: 'Қидирув-қутқарув' },

    // 4. AVIATION
    { code: '1301', ru: 'Военно-воздушная', uz: 'Harbiy-havo', uzk: 'Ҳарбий-ҳаво' },
    { code: '1302', ru: 'Истребительная авиация', uz: 'Qiruvchi aviatsiya', uzk: 'Қирувчи авиация' },
    { code: '1303', ru: 'Бомбардировочная авиация', uz: 'Bombardimonchi aviatsiya', uzk: 'Бомбардимончи авиация' },
    { code: '1304', ru: 'Штурмовая авиация', uz: 'Hujumchi aviatsiya', uzk: 'Ҳужумчи авиация' },
    { code: '1305', ru: 'Транспортная авиация', uz: 'Transport aviatsiyasi', uzk: 'Транспорт авиацияси' },
    { code: '1306', ru: 'Армейская авиация (вертолетная)', uz: 'Armiya aviatsiyasi (vertolyot)', uzk: 'Армия авиацияси (вертолёт)' },
    { code: '1307', ru: 'Беспилотной авиации (БПЛА)', uz: 'Uchuvchisiz aviatsiya', uzk: 'Учувчисиз авиация' },
    { code: '1308', ru: 'Инженерно-авиационная', uz: 'Muhandislik-aviatsiya', uzk: 'Муҳандислик-авиация' },

    // 5. TECHNICAL & MAINTENANCE
    { code: '1401', ru: 'Автомобильная', uz: 'Avtomobil', uzk: 'Автомобиль' },
    { code: '1402', ru: 'Ремонтно-восстановительная', uz: 'Ta\'mirlash-tiklash', uzk: 'Таъмирлаш-тиклаш' },
    { code: '1403', ru: 'Метрологическая', uz: 'Metrologik', uzk: 'Метрологик' },
    { code: '1404', ru: 'Электротехническая', uz: 'Elektrotexnika', uzk: 'Электротехника' },
    { code: '1405', ru: 'Служба горючего (ГСМ)', uz: 'Yoqilg\'i xizmati', uzk: 'Ёқилғи хизмати' },
    { code: '1406', ru: 'Ракетно-артиллерийского вооружения (РАВ)', uz: 'Raketa-artilleriya qurollanishi', uzk: 'Ракета-артиллерия қуролланиши' },
    { code: '1407', ru: 'Бронетанковой службы', uz: 'Zirhli tank xizmati', uzk: 'Зирҳли танк хизмати' },
    { code: '1408', ru: 'Эксплуатации аэродромов', uz: 'Aerodromlardan foydalanish', uzk: 'Аэродромлардан фойдаланиш' },

    // 6. LOGISTICS & REAR SERVICES
    { code: '1501', ru: 'Тылового обеспечения', uz: "Orqa ta'minot", uzk: 'Орқа таъминот' },
    { code: '1502', ru: 'Материально-технического обеспечения (МТО)', uz: 'Moddiy-texnik ta\'minot', uzk: 'Моддий-техник таъминот' },
    { code: '1503', ru: 'Продовольственная', uz: 'Oziq-ovqat', uzk: 'Озиқ-овқат' },
    { code: '1504', ru: 'Вещевая', uz: 'Kiyim-kechak', uzk: 'Кийим-кечак' },
    { code: '1505', ru: 'Квартирно-эксплуатационная', uz: 'Kvartira-foydalanish', uzk: 'Квартира-фойдаланиш' },
    { code: '1506', ru: 'Торгово-бытовая', uz: 'Savdo-maishiy', uzk: 'Савдо-маиший' },
    { code: '1507', ru: 'Пожарная охрана', uz: 'Yong\'in havfsizligi', uzk: 'Ёнғин ҳавфсизлиги' },
    { code: '1508', ru: 'Экологическая', uz: 'Ekologik', uzk: 'Экологик' },
    { code: '1509', ru: 'Ветеринарная', uz: 'Veterinariya', uzk: 'Ветеринария' },

    // 7. MEDICAL
    { code: '1601', ru: 'Медицинская', uz: 'Tibbiy', uzk: 'Тиббий' },
    { code: '1602', ru: 'Хирургическая', uz: 'Xirurgik', uzk: 'Хирургик' },
    { code: '1603', ru: 'Терапевтическая', uz: 'Terapevtik', uzk: 'Терапевтик' },
    { code: '1604', ru: 'Санитарно-эпидемиологическая', uz: 'Sanitariya-epidemiologiya', uzk: 'Санитария-эпидемиология' },
    { code: '1605', ru: 'Военно-врачебная экспертиза', uz: 'Harbiy-tibbiy ekspertiza', uzk: 'Ҳарбий-тиббий экспертиза' },
    { code: '1606', ru: 'Стоматологическая', uz: 'Stomatologik', uzk: 'Стоматологик' },
    { code: '1607', ru: 'Фармацевтическая', uz: 'Farmatsevtik', uzk: 'Фармацевтик' },

    // 8. LEGAL, FINANCE, HR
    { code: '1701', ru: 'Юридическая', uz: 'Yuridik', uzk: 'Юридик' },
    { code: '1702', ru: 'Финансовая', uz: 'Moliya', uzk: 'Молия' },
    { code: '1703', ru: 'Кадровая', uz: 'Kadrlar', uzk: 'Кадрлар' },
    { code: '1704', ru: 'Военно-социальная', uz: 'Harbiy-ijtimoiy', uzk: 'Ҳарбий-ижтимоий' },
    { code: '1705', ru: 'Психологическая', uz: 'Psixologik', uzk: 'Психологик' },
    { code: '1706', ru: 'Воспитательная и идеологическая', uz: 'Tarbiyaviy va mafkuraviy', uzk: 'Тарбиявий ва мафкуравий' },
    { code: '1707', ru: 'Культурно-досуговая', uz: 'Madaniy-hordiq', uzk: 'Маданий-ҳордиқ' },
    { code: '1708', ru: 'Военно-дирижерская (Музыкальная)', uz: 'Harbiy-dirijyorlik', uzk: 'Ҳарбий-дирижёрлик' },
    { code: '1709', ru: 'Физическая подготовка и спорт', uz: 'Jismoniy tayyorgarlik va sport', uzk: 'Жисмоний тайёргарлик ва спорт' },

    // 9. COMMAND & CONTROL & SECURITY
    { code: '1801', ru: 'Командно-штабная', uz: 'Qo\'mondonlik-shtab', uzk: 'Қўмондонлик-штаб' },
    { code: '1802', ru: 'Организационно-мобилизационная', uz: 'Tashkiliy-safarbarlik', uzk: 'Ташкилий-сафарбарлик' },
    { code: '1803', ru: 'Защита государственных секретов', uz: 'Davlat sirlarini muhofaza qilish', uzk: 'Давлат сирларини муҳофаза қилиш' },
    { code: '1804', ru: 'Шифровальная', uz: 'Shifrlash', uzk: 'Шифрлаш' },
    { code: '1805', ru: 'Комендантская', uz: 'Komendantlik', uzk: 'Комендантлик' },
    { code: '1806', ru: 'Военная полиция', uz: 'Harbiy politsiya', uzk: 'Ҳарбий полиция' },
    { code: '1807', ru: 'Караульная', uz: 'Qorovullik', uzk: 'Қоровуллик' },
    { code: '1808', ru: 'Пропускной режим', uz: 'O\'tkazish rejimi', uzk: 'Ўтказиш режими' },

    // 10. IT & CYBER
    { code: '1901', ru: 'Информационные технологии', uz: 'Axborot texnologiyalari', uzk: 'Ахборот технологиялари' },
    { code: '1902', ru: 'Кибербезопасность', uz: 'Kiberxavfsizlik', uzk: 'Киберхавфсизлик' },
    { code: '1903', ru: 'Автоматизированные системы управления', uz: 'Avtomatlashtirilgan boshqaruv tizimlari', uzk: 'Автоматлаштирилган бошқарув тизимлари' },
    { code: '1904', ru: 'Программирование', uz: 'Dasturlash', uzk: 'Дастурлаш' },
    { code: '1905', ru: 'Системное администрирование', uz: 'Tizim ma\'murligi', uzk: 'Тизим маъмурлиги' },

    // 11. EDUCATION & SCIENCE
    { code: '2001', ru: 'Научно-исследовательская', uz: 'Ilmiy-tadqiqot', uzk: 'Илмий-тадқиқот' },
    { code: '2002', ru: 'Педагогическая', uz: 'Pedagogik', uzk: 'Педагогик' },
    { code: '2003', ru: 'Переводческая (Лингвистическая)', uz: 'Tarjimonlik', uzk: 'Таржимонлик' },
    { code: '2004', ru: 'Историческая', uz: 'Tarixiy', uzk: 'Тарихий' }
]

async function main() {
    console.log(`Starting expanded seeding of specializations... Total entries: ${specializations.length}`)

    for (const spec of specializations) {
        const existing = await prisma.refSpecialization.findUnique({
            where: { code: spec.code }
        })

        const nameJson = {
            ru: spec.ru,
            uz: spec.uz,
            uzk: spec.uzk
        }

        if (existing) {
            await prisma.refSpecialization.update({
                where: { code: spec.code },
                data: {
                    name: nameJson
                }
            })
            // console.log(`Updated: ${spec.ru}`)
        } else {
            await prisma.refSpecialization.create({
                data: {
                    code: spec.code,
                    name: nameJson,
                    status: 'active'
                }
            })
            // console.log(`Created: ${spec.ru}`)
        }
    }

    console.log('Seeding finished successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
