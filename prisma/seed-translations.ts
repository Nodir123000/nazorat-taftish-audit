import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const mockTranslations = [
        {
            key: "system.name",
            ru: "АИС КРУ МО РУз",
            uz_cyrl: "ЎР МВ НТБ ААТ",
            uz_latn: "O'zR MV NTB AAT",
            tags: ["system"],
            description: "Название системы (сокращенно)",
        },
        {
            key: "system.full-name",
            ru: "Автоматизированная информационная система\nКонтрольно-ревизионного управления\nМинистерства обороны Республики Узбекистан",
            uz_cyrl: "Автоматлаштирилган ахборот тизими\nНазорат-тафтиш бошқармаси\nЎзбекистон Республикаси Мудофаа вазирлиги",
            uz_latn: "Avtomatlashtirilgan axborot tizimi\nNazorat-taftish boshqarmasi\nO'zbekiston Respublikasi Mudofaa vazirligi",
            tags: ["system"],
            description: "Полное название системы",
        },
        {
            key: "common.save",
            ru: "Сохранить",
            uz_cyrl: "Сақлаш",
            uz_latn: "Saqlash",
            tags: ["common"],
            description: "Кнопка сохранения",
        },
        {
            key: "common.cancel",
            ru: "Отмена",
            uz_cyrl: "Бекор қилиш",
            uz_latn: "Bekor qilish",
            tags: ["common"],
            description: "Кнопка отмены",
        },
        {
            key: "dashboard.title",
            ru: "Главная панель",
            uz_cyrl: "Асосий панель",
            uz_latn: "Asosiy panel",
            tags: ["dashboard"],
            description: "Название модуля",
        },
        {
            key: "ref.territories.title",
            ru: "Регионы и районы",
            uz_cyrl: "Вилоятлар ва туманлар",
            uz_latn: "Viloyatlar va tumanlar",
            tags: ["reference"],
            description: "Заголовок страницы территорий",
        },
        {
            key: "ref.territories.description",
            ru: "Управление списком областей, районов и городов Узбекистана",
            uz_cyrl: "Ўзбекистон вилоятлари, туманлари ва шаҳарлари рўйхатини бошқариш",
            uz_latn: "O'zbekiston viloyatlari, tumanlari va shaharlari ro'yxatini boshqarish",
            tags: ["reference"],
            description: "Описание страницы территорий",
        },
        {
            key: "ref.territories.add_region",
            ru: "Добавить регион",
            uz_cyrl: "Вилоят қўшиш",
            uz_latn: "Viloyat qo'shish",
            tags: ["reference"],
            description: "Кнопка добавления области",
        },
        {
            key: "ref.territories.add_district",
            ru: "Добавить район",
            uz_cyrl: "Туман қўшиш",
            uz_latn: "Tuman qo'shish",
            tags: ["reference"],
            description: "Кнопка добавления района",
        },
        {
            key: "ref.territories.tab_regions",
            ru: "Регионы",
            uz_cyrl: "Вилоятлар",
            uz_latn: "Viloyatlar",
            tags: ["reference"],
            description: "Вкладка областей",
        },
        {
            key: "ref.territories.tab_districts",
            ru: "Районы",
            uz_cyrl: "Туманлар",
            uz_latn: "Tumanlar",
            tags: ["reference"],
            description: "Вкладка районов",
        },
        {
            key: "ref.territories.search_placeholder",
            ru: "Поиск...",
            uz_cyrl: "Қидириш...",
            uz_latn: "Qidirish...",
            tags: ["reference"],
            description: "Плейсхолдер поиска",
        },
        {
            key: "ref.territories.field.name",
            ru: "Наименование",
            uz_cyrl: "Номи",
            uz_latn: "Nomi",
            tags: ["reference"],
            description: "Поле названия",
        },
        {
            key: "ref.territories.field.ru",
            ru: "На русском",
            uz_cyrl: "Рус тилида",
            uz_latn: "Rus tilida",
            tags: ["reference"],
            description: "Лейбл для русского языка",
        },
        {
            key: "ref.territories.placeholder.name",
            ru: "Введите название...",
            uz_cyrl: "Номини киритинг...",
            uz_latn: "Nomini kiriting...",
            tags: ["reference"],
            description: "Плейсхолдер названия",
        },
        {
            key: "ref.territories.field.region",
            ru: "Регион",
            uz_cyrl: "Вилоят",
            uz_latn: "Viloyat",
            tags: ["reference"],
            description: "Поле области",
        },
        {
            key: "ref.territories.field.type",
            ru: "Тип",
            uz_cyrl: "Тури",
            uz_latn: "Turi",
            tags: ["reference"],
            description: "Поле типа",
        },
        {
            key: "ref.territories.field.status",
            ru: "Статус",
            uz_cyrl: "Ҳолати",
            uz_latn: "Holati",
            tags: ["reference"],
            description: "Поле статуса",
        },
        {
            key: "ref.territories.field.link",
            ru: "Привязка",
            uz_cyrl: "Боғланиш",
            uz_latn: "Bog'lanish",
            tags: ["reference"],
            description: "Секция привязки в форме",
        },
        {
            key: "ref.territories.type.district",
            ru: "Район",
            uz_cyrl: "Туман",
            uz_latn: "Tuman",
            tags: ["reference"],
            description: "Тип: Район",
        },
        {
            key: "ref.territories.type.city",
            ru: "Город",
            uz_cyrl: "Шаҳар",
            uz_latn: "Shahar",
            tags: ["reference"],
            description: "Тип: Город",
        },
        {
            key: "ref.territories.status.active",
            ru: "Активен",
            uz_cyrl: "Актив",
            uz_latn: "Faol",
            tags: ["reference"],
            description: "Статус: Активен",
        },
        {
            key: "ref.territories.status.inactive",
            ru: "Неактивен",
            uz_cyrl: "Фаол эмас",
            uz_latn: "Faol emas",
            tags: ["reference"],
            description: "Статус: Неактивен",
        },
        {
            key: "ref.territories.edit_region_title",
            ru: "Редактирование региона",
            uz_cyrl: "Вилоятни таҳрирлаш",
            uz_latn: "Viloyatni tahrirlash",
            tags: ["reference"],
        },
        {
            key: "ref.territories.edit_district_title",
            ru: "Редактирование района",
            uz_cyrl: "Туманни таҳрирлаш",
            uz_latn: "Tumanni tahrirlash",
            tags: ["reference"],
        },
        {
            key: "ref.territories.create_region_title",
            ru: "Создание региона",
            uz_cyrl: "Вилоят яратиш",
            uz_latn: "Viloyat yaratish",
            tags: ["reference"],
        },
        {
            key: "ref.territories.create_district_title",
            ru: "Создание района",
            uz_cyrl: "Туман яратиш",
            uz_latn: "Tuman yaratish",
            tags: ["reference"],
        },
        {
            key: "ref.territories.placeholder.select_region",
            ru: "Выберите регион...",
            uz_cyrl: "Вилоятни танланг...",
            uz_latn: "Viloyatni tanlang...",
            tags: ["reference"],
        },
        {
            key: "ref.territories.placeholder.search_region",
            ru: "Поиск региона...",
            uz_cyrl: "Вилоятни қидириш...",
            uz_latn: "Viloyatni qidirish...",
            tags: ["reference"],
        },
        {
            key: "ref.territories.not_found_region",
            ru: "Регион не найден.",
            uz_cyrl: "Вилоят топилмади.",
            uz_latn: "Viloyat topilmadi.",
            tags: ["reference"],
        },
        {
            key: "ref.territories.field.params",
            ru: "Параметры",
            uz_cyrl: "Параметрлар",
            uz_latn: "Parametrlar",
            tags: ["reference"],
        },
        {
            key: "ref.territories.type.region",
            ru: "Регион",
            uz_cyrl: "Вилоят",
            uz_latn: "Viloyat",
            tags: ["reference"],
        },
        {
            key: "ref.territories.type.republic",
            ru: "Республика",
            uz_cyrl: "Республика",
            uz_latn: "Respublika",
            tags: ["reference"],
        },
        {
            key: "common.fill_form",
            ru: "Заполните форму ниже",
            uz_cyrl: "Қуйидаги шаклни тўлдиринг",
            uz_latn: "Quyidagi shaklni to'ldiring",
            tags: ["common"],
        },
        {
            key: "common.cancel",
            ru: "Отмена",
            uz_cyrl: "Бекор қилиш",
            uz_latn: "Bekor qilish",
            tags: ["common"],
        },
        {
            key: "common.save",
            ru: "Сохранить",
            uz_cyrl: "Сақлаш",
            uz_latn: "Saqlash",
            tags: ["common"],
        },
        {
            key: "common.loading",
            ru: "Загрузка...",
            uz_cyrl: "Юкланмоқда...",
            uz_latn: "Yuklanmoqda...",
            tags: ["common"],
        },
        {
            key: "common.nothing_found",
            ru: "Ничего не найдено",
            uz_cyrl: "Ҳеч нарса топилмади",
            uz_latn: "Hech narsa topilmadi",
            tags: ["common"],
        },
        {
            key: "common.actions",
            ru: "Действия",
            uz_cyrl: "Ҳаракатлар",
            uz_latn: "Harakatlar",
            tags: ["common"],
        },
        {
            key: "common.unit_short",
            ru: "ед.",
            uz_cyrl: "бирлик",
            uz_latn: "birlik",
            tags: ["common"],
        },
        {
            key: "common.manage",
            ru: "Управление",
            uz_cyrl: "Бошқариш",
            uz_latn: "Boshqarish",
            tags: ["common"],
        },
        {
            key: "common.edit",
            ru: "Редактировать",
            uz_cyrl: "Таҳрирлаш",
            uz_latn: "Tahrirlash",
            tags: ["common"],
        },
        {
            key: "common.delete",
            ru: "Удалить",
            uz_cyrl: "Ўчириш",
            uz_latn: "O'chirish",
            tags: ["common"],
        },
        {
            key: "ref.territories.type.republic",
            ru: "Республика",
            uz_cyrl: "Республика",
            uz_latn: "Respublika",
            tags: ["reference"],
        }
    ]

    console.log('Start seeding UI translations (JSON mode)...')

    for (const item of mockTranslations) {
        await prisma.uITranslation.upsert({
            where: { key: item.key },
            update: {
                name: {
                    ru: item.ru,
                    uz_latn: item.uz_latn,
                    uz_cyrl: item.uz_cyrl
                },
                description: item.description,
                tags: item.tags,
            },
            create: {
                key: item.key,
                name: {
                    ru: item.ru,
                    uz_latn: item.uz_latn,
                    uz_cyrl: item.uz_cyrl
                },
                description: item.description,
                tags: item.tags,
            },
        })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
