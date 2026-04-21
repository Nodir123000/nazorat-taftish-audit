
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Expanded list of unit types (approx 100 entries)
const unitTypes = [
    // 1. COMBAT & COMMAND HIERARCHY (Standard)
    { code: '7001', ru: 'Фронт', uz: 'Front', uzk: 'Фронт' },
    { code: '7002', ru: 'Армия', uz: 'Armiya', uzk: 'Армия' },
    { code: '7003', ru: 'Корпус', uz: 'Korpus', uzk: 'Корпус' },
    { code: '7004', ru: 'Дивизия', uz: 'Diviziya', uzk: 'Дивизия' },
    { code: '7005', ru: 'Бригада', uz: 'Brigada', uzk: 'Бригада' },
    { code: '7006', ru: 'Полк', uz: 'Polk', uzk: 'Полк' },
    { code: '7007', ru: 'Батальон', uz: 'Batalyon', uzk: 'Батальон' },
    { code: '7008', ru: 'Дивизион', uz: 'Divizion', uzk: 'Дивизион' },
    { code: '7009', ru: 'Рота', uz: 'Rota', uzk: 'Рота' },
    { code: '7010', ru: 'Батарея', uz: 'Batareya', uzk: 'Батарея' },
    { code: '7011', ru: 'Эскадрилья', uz: 'Eskadrilya', uzk: 'Эскадрилья' },
    { code: '7012', ru: 'Взвод', uz: 'Vzvod', uzk: 'Взвод' },
    { code: '7013', ru: 'Отделение', uz: 'Bo\'linma', uzk: 'Бўлинма' },
    { code: '7014', ru: 'Расчет', uz: 'Hisob', uzk: 'Ҳисоб' },
    { code: '7015', ru: 'Экипаж', uz: 'Ekipaj', uzk: 'Экипаж' },
    { code: '7016', ru: 'Группа', uz: 'Guruh', uzk: 'Гуруҳ' },
    { code: '7017', ru: 'Отряд', uz: 'Otryad', uzk: 'Отряд' },

    // 2. SPECIALIZED TYPES (Prefix "Separate/Independent")
    { code: '7101', ru: 'Отдельная бригада', uz: 'Alohida brigada', uzk: 'Алоҳида бригада' },
    { code: '7102', ru: 'Отдельный полк', uz: 'Alohida polk', uzk: 'Алоҳида полк' },
    { code: '7103', ru: 'Отдельный батальон', uz: 'Alohida batalyon', uzk: 'Алоҳида батальон' },
    { code: '7104', ru: 'Отдельный дивизион', uz: 'Alohida divizion', uzk: 'Алоҳида дивизион' },
    { code: '7105', ru: 'Отдельная рота', uz: 'Alohida rota', uzk: 'Алоҳида рота' },
    { code: '7106', ru: 'Отдельный отряд', uz: 'Alohida otryad', uzk: 'Алоҳида отряд' },
    { code: '7107', ru: 'Сводный отряд', uz: 'Yig\'ma otryad', uzk: 'Йиғма отряд' },

    // 3. ADMINISTRATIVE / HQ
    { code: '7201', ru: 'Управление', uz: 'Boshqarma', uzk: 'Бошқарма' },
    { code: '7202', ru: 'Штаб', uz: 'Shtab', uzk: 'Штаб' },
    { code: '7203', ru: 'Департамент', uz: 'Departament', uzk: 'Департамент' },
    { code: '7204', ru: 'Отдел', uz: 'Bo\'lim', uzk: 'Бўлим' },
    { code: '7205', ru: 'Служба', uz: 'Xizmat', uzk: 'Хизмат' },
    { code: '7206', ru: 'Сектор', uz: 'Sektor', uzk: 'Сектор' },
    { code: '7207', ru: 'Инспекция', uz: 'Inspeksiya', uzk: 'Инспекция' },
    { code: '7208', ru: 'Комиссия', uz: 'Komissiya', uzk: 'Комиссия' },
    { code: '7209', ru: 'Комитет', uz: 'Qo\'mita', uzk: 'Қўмита' },
    { code: '7210', ru: 'Секретариат', uz: 'Kotibiyat', uzk: 'Котибият' },
    { code: '7211', ru: 'Канцелярия', uz: 'Devonxona', uzk: 'Девонхона' },

    // 4. EDUCATION & TRAINING
    { code: '7301', ru: 'Академия', uz: 'Akademiya', uzk: 'Академия' },
    { code: '7302', ru: 'Университет', uz: 'Universitet', uzk: 'Университет' },
    { code: '7303', ru: 'Институт', uz: 'Institut', uzk: 'Институт' },
    { code: '7304', ru: 'Училище', uz: 'Bilim yurti', uzk: 'Билим юрти' },
    { code: '7305', ru: 'Лицей', uz: 'Litsey', uzk: 'Лицей' },
    { code: '7306', ru: 'Колледж', uz: 'Kollej', uzk: 'Коллеж' },
    { code: '7307', ru: 'Школа сержантов', uz: 'Serjantlar maktabi', uzk: 'Сержантлар мактаби' },
    { code: '7308', ru: 'Учебный центр', uz: 'O\'quv markazi', uzk: 'Ўқув маркази' },
    { code: '7309', ru: 'Кафедра', uz: 'Kafedra', uzk: 'Кафедра' },
    { code: '7310', ru: 'Факультет', uz: 'Fakultet', uzk: 'Факультет' },
    { code: '7311', ru: 'Полигон', uz: 'Poligon', uzk: 'Полигон' },
    { code: '7312', ru: 'Стрельбище', uz: 'Otishma maydoni', uzk: 'Отишма майдони' },
    { code: '7313', ru: 'Тренировочный лагерь', uz: 'Mashg\'ulot lageri', uzk: 'Машғулот лагери' },

    // 5. MEDICAL
    { code: '7401', ru: 'Госпиталь', uz: 'Gospital', uzk: 'Госпиталь' },
    { code: '7402', ru: 'Поликлиника', uz: 'Poliklinika', uzk: 'Поликлиника' },
    { code: '7403', ru: 'Санаторий', uz: 'Sanatoriy', uzk: 'Санаторий' },
    { code: '7404', ru: 'Лазарет', uz: 'Lazaret', uzk: 'Лазарет' },
    { code: '7405', ru: 'Медпункт', uz: 'Tibbiyot punkti', uzk: 'Тиббиёт пункти' },
    { code: '7406', ru: 'Санитарная часть', uz: 'Sanitar qism', uzk: 'Санитар қисм' },
    { code: '7407', ru: 'Лаборатория', uz: 'Laboratoriya', uzk: 'Лаборатория' },
    { code: '7408', ru: 'Центр санэпиднадзора', uz: 'Davlat sanitariya-epidemiologiya nazorati markazi', uzk: 'Давлат санитария-эпидемиология назорати маркази' },

    // 6. LOGISTICS & SUPPORT (Warehouses, Bases)
    { code: '7501', ru: 'База', uz: 'Baza', uzk: 'База' },
    { code: '7502', ru: 'Арсенал', uz: 'Arsenal', uzk: 'Арсенал' },
    { code: '7503', ru: 'Склад', uz: 'Ombor', uzk: 'Омбор' },
    { code: '7504', ru: 'Хранилище', uz: 'Saqlash joyi', uzk: 'Сақлаш жойи' },
    { code: '7505', ru: 'Парк', uz: 'Park', uzk: 'Парк' },
    { code: '7506', ru: 'Гараж', uz: 'Garaj', uzk: 'Гараж' },
    { code: '7507', ru: 'Мастерская', uz: 'Ustaqxona', uzk: 'Устақхона' },
    { code: '7508', ru: 'Завод', uz: 'Zavod', uzk: 'Завод' },
    { code: '7509', ru: 'Комбинат', uz: 'Kombinat', uzk: 'Комбинат' },
    { code: '7510', ru: 'Хлебозавод', uz: 'Non zavodi', uzk: 'Нон заводи' },
    { code: '7511', ru: 'Столовая', uz: 'Oshxona', uzk: 'Ошхона' },
    { code: '7512', ru: 'Банно-прачечный комбинат', uz: 'Hammom-kir yuvish kombinati', uzk: 'Ҳаммом-кир ювиш комбинати' },
    { code: '7513', ru: 'Ателье', uz: 'Atelye', uzk: 'Ателье' },
    { code: '7514', ru: 'Хозяйственный двор', uz: 'Xo\'jalik hovlisi', uzk: 'Хўжалик ҳовлиси' },

    // 7. INFRASTRUCTURE & GUARD
    { code: '7601', ru: 'Комендатура', uz: 'Komendatura', uzk: 'Комендатура' },
    { code: '7602', ru: 'Гауптвахта', uz: 'Gauptvaxta', uzk: 'Гауптвахта' },
    { code: '7603', ru: 'Пост', uz: 'Post', uzk: 'Пост' },
    { code: '7604', ru: 'КПП (Контрольно-пропускной пункт)', uz: 'Nazorat-o\'tkazish punkti', uzk: 'Назорат-ўтказиш пункти' },
    { code: '7605', ru: 'Караул', uz: 'Qorovul', uzk: 'Қоровул' },
    { code: '7606', ru: 'Узел', uz: 'Tugun', uzk: 'Тугун' },
    { code: '7607', ru: 'Станция', uz: 'Stansiya', uzk: 'Станция' },
    { code: '7608', ru: 'Аэродром', uz: 'Aerodrom', uzk: 'Аэродром' },
    { code: '7609', ru: 'Порт', uz: 'Port', uzk: 'Порт' },
    { code: '7610', ru: 'Причал', uz: 'Parchal', uzk: 'Парчал' }, // or Prichal

    // 8. LEGAL & POLICE
    { code: '7701', ru: 'Военная прокуратура', uz: 'Harbiy prokuratura', uzk: 'Ҳарбий прокуратура' },
    { code: '7702', ru: 'Военный суд', uz: 'Harbiy sud', uzk: 'Ҳарбий суд' },
    { code: '7703', ru: 'Следственный отдел', uz: 'Tergov bo\'limi', uzk: 'Тергов бўлими' },
    { code: '7704', ru: 'Юридическая служба', uz: 'Yuridik xizmat', uzk: 'Юридик хизмат' },

    // 9. CULTURE & SCIENCE
    { code: '7801', ru: 'Дом офицеров', uz: 'Ofitserlar uyi', uzk: 'Офицерлар уйи' },
    { code: '7802', ru: 'Клуб', uz: 'Klub', uzk: 'Клуб' },
    { code: '7803', ru: 'Музей', uz: 'Muzey', uzk: 'Музей' },
    { code: '7804', ru: 'Библиотека', uz: 'Kutubxona', uzk: 'Кутубхона' },
    { code: '7805', ru: 'Ансамбль', uz: 'Ansambl', uzk: 'Ансамбль' },
    { code: '7806', ru: 'Оркестр', uz: 'Orkestr', uzk: 'Оркестр' },
    { code: '7807', ru: 'Типография', uz: 'Bosmaxona', uzk: 'Босмахона' },
    { code: '7808', ru: 'Редакция', uz: 'Tahririyat', uzk: 'Таҳририят' },
    { code: '7809', ru: 'Архив', uz: 'Arxiv', uzk: 'Архив' },
    { code: '7810', ru: 'Научно-исследовательский институт', uz: 'Ilmiy-tadqiqot instituti', uzk: 'Илмий-тадқиқот институти' },
    { code: '7811', ru: 'Вычислительный центр', uz: 'Hisoblash markazi', uzk: 'Ҳисоблаш маркази' },

    // 10. SPECIALIZED FUNCTIONAL
    { code: '7901', ru: 'Узел связи', uz: 'Aloqa tuguni', uzk: 'Алоқа тугуни' },
    { code: '7902', ru: 'Метеостанция', uz: 'Meteostansiya', uzk: 'Метеостанция' },
    { code: '7903', ru: 'Топогеодезический отряд', uz: 'Topogeodezik otryad', uzk: 'Топогеодезик отряд' },
    { code: '7904', ru: 'Ветеринарная лаборатория', uz: 'Veterinariya laboratoriyasi', uzk: 'Ветеринария лабораторияси' },
    { code: '7905', ru: 'Кинологический центр', uz: 'Kinologiya markazi', uzk: 'Кинология маркази' },
    { code: '7906', ru: 'Спортивный клуб', uz: 'Sport klubi', uzk: 'Спорт клуби' },
    { code: '7907', ru: 'Пожарная команда', uz: 'Yong\'in o\'chirish jamoasi', uzk: 'Ёнғин ўчириш жамоаси' },
]

async function main() {
    console.log(`Starting expanded seeding... Total entries: ${unitTypes.length}`)

    for (const type of unitTypes) {
        const existing = await prisma.refUnitType.findUnique({
            where: { code: type.code }
        })

        const nameJson = {
            ru: type.ru,
            uz: type.uz,
            uzk: type.uzk
        }

        if (existing) {
            await prisma.refUnitType.update({
                where: { code: type.code },
                data: {
                    name: nameJson
                }
            })
            // console.log(`Updated: ${type.ru}`)
        } else {
            await prisma.refUnitType.create({
                data: {
                    code: type.code,
                    name: nameJson,
                    status: 'active'
                }
            })
            // console.log(`Created: ${type.ru}`)
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
