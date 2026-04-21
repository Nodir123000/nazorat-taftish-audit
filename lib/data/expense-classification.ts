// Справочник классификации расходов по смете МО РУз

export interface ExpenseElement {
  code: string
  name: string
}

export interface ExpenseArticle {
  code: string
  name: string
  elements: ExpenseElement[]
}

export interface ExpenseCategory {
  code: string
  name: string
  articles: ExpenseArticle[]
}

export interface ExpenseGroup {
  id: string
  name: string
  color: string
  categories: ExpenseCategory[]
}

export interface SupplyDepartment {
  code: string
  name: string
  name_uz_latn: string
  name_uz_cyrl: string
  short_name: string
  short_name_uz_latn: string
  short_name_uz_cyrl: string
}

// Довольствующие управления МО РУз
export const supplyDepartments: SupplyDepartment[] = [
  {
    code: "002",
    name: "Главное управление боевой подготовки ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi Jangovar tayyorgarlik bosh boshqarmasi",
    name_uz_cyrl: "ЎзР ҚК БШ Жанговар тайёргарлик бош бошқармаси",
    short_name: "ГУБП ГШ ВС",
    short_name_uz_latn: "JTBB",
    short_name_uz_cyrl: "ЖТББ"
  },
  {
    code: "003",
    name: "Войска противовоздушной обороны командования Войск ПВО и ВВС МО РУ",
    name_uz_latn: "O'zR MV HHMQ va HHK qo'mondonligi havo hujumidan mudofaa qo'shinlari boshqarmasi",
    name_uz_cyrl: "ЎзР МВ ҲҲМҚ ва ҲҲК қўмондонлиги ҳаво ҳужумидан мудофаа қўшинлари бошқармаси",
    short_name: "ВПВО",
    short_name_uz_latn: "HHMQB",
    short_name_uz_cyrl: "ҲҲМҚБ"
  },
  {
    code: "004",
    name: "Управление военно-воздушных сил командования Войск ПВО и ВВС МО РУ",
    name_uz_latn: "O'zR MV HHMQ va HHK qo'mondonligi harbiy havo kuchlari boshqarmasi",
    name_uz_cyrl: "ЎзР МВ ҲҲМҚ ва ҲҲК қўмондонлиги ҳарбий ҳаво кучлари бошқармаси",
    short_name: "УВВС",
    short_name_uz_latn: "HHKB",
    short_name_uz_cyrl: "ҲҲКБ"
  },
  {
    code: "005",
    name: "Отдел физической подготовки и спорта ГУБП ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi JTBB Jismoniy tayyorgarlik va sport bo'limi",
    name_uz_cyrl: "ЎзР ҚК БШ ЖТББ Жисмоний тайёргарлик ва спорт бўлими",
    short_name: "ОФПиС",
    short_name_uz_latn: "JTSB",
    short_name_uz_cyrl: "ЖТСБ"
  },
  {
    code: "006",
    name: "Отдел противовоздушной обороны Сухопутных войск ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi Quruqlikdagi qo'shinlarni havo hujumidan mudofaa qilish bo'limi",
    name_uz_cyrl: "ЎзР ҚК БШ Қуруқликдаги қўшинларни ҳаво ҳужумидан мудофаа қилиш бўлими",
    short_name: "ОПВО СВ",
    short_name_uz_latn: "QQ HHMQB",
    short_name_uz_cyrl: "ҚҚ ҲҲМҚБ"
  },
  {
    code: "007",
    name: "Отдел воздушно-десантной подготовки УБП ГУБП ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi JTBB JTB Havo-desant tayyorgarligi bo'limi",
    name_uz_cyrl: "ЎзР ҚК БШ ЖТББ ЖТБ Ҳаво-десант тайёргарлиги бўлими",
    short_name: "ОВДП",
    short_name_uz_latn: "HDTB",
    short_name_uz_cyrl: "ҲДТБ"
  },
  {
    code: "009",
    name: "Главное организационно-мобилизационное управление ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi Tashkiliy-safarbarlik bosh boshqarmasi",
    name_uz_cyrl: "ЎзР ҚК БШ Ташкилий-сafarbarlik бош бошқармаси",
    short_name: "ГОМУ",
    short_name_uz_latn: "TSBB",
    short_name_uz_cyrl: "ТСББ"
  },
  {
    code: "011",
    name: "8 управление ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi 8-boshqarmasi",
    name_uz_cyrl: "ЎзР ҚК БШ 8-бошқармаси",
    short_name: "8-е упр. ГШ",
    short_name_uz_latn: "8-boshqarma",
    short_name_uz_cyrl: "8-бошқарма"
  },
  {
    code: "012",
    name: "Отдел топографического обеспечения ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi Navigatsiya-geoaxborotlashtirish ta'minoti boshqarmasi",
    name_uz_cyrl: "ЎзР ҚК БШ Навигация-геоахборотлаштириш таъминоти бошқармаси",
    short_name: "ВТС",
    short_name_uz_latn: "NGT Boshqarmasi",
    short_name_uz_cyrl: "НГТ бошқармаси"
  },
  {
    code: "014",
    name: "Управление военного правопорядка ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi Qo'shinlar xizmati bo'limi",
    name_uz_cyrl: "ЎзР ҚК БШ Қўшинлар хизмати бўлими",
    short_name: "УВП",
    short_name_uz_latn: "QXB",
    short_name_uz_cyrl: "ҚХБ"
  },
  {
    code: "015",
    name: "Главное управление воспитательной и идеологической работы МО РУ",
    name_uz_latn: "O'zR MV Tarbiyaviy va mafkuraviy ishlar bosh boshqarmasi",
    name_uz_cyrl: "ЎзР МВ Тарбиявий ва мафкуравий ишлар бош бошқармаси",
    short_name: "ГУВИР",
    short_name_uz_latn: "TMIBB",
    short_name_uz_cyrl: "ТМИББ"
  },
  {
    code: "017",
    name: "Отдел войск радиационной, химической, биологической защиты ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi Radiatsion, kimyoviy, biologik muhofaza qo'shinlari bo'limi",
    name_uz_cyrl: "ЎзР ҚК БШ Радиацион, кимёвий, биологик муҳофаза қўшинлари бўлими",
    short_name: "РХБЗ",
    short_name_uz_latn: "RKBQB",
    short_name_uz_cyrl: "РКБҚБ"
  },
  {
    code: "018",
    name: "Главное управление связи, информационных технологий и защиты информации ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi Aloqa, axborot texnologiyalari va axborotlarni himoyalash bosh boshqarmasi",
    name_uz_cyrl: "ЎзР ҚК БШ Алоқа, ахборот технологиялари ва ахборотларни ҳимоялаш бош бошқармаси",
    short_name: "ГУС",
    short_name_uz_latn: "AATI HBB",
    short_name_uz_cyrl: "ААТИ ҲББ"
  },
  {
    code: "019",
    name: "Управление автомобильной техники ГУВ МО РУ",
    name_uz_latn: "O'zR MV QB Boshqarmasi Avtomobil texnikalar boshqarmasi",
    name_uz_cyrl: "ЎзР МВ ҚББ Автомобиль техникалар бошқармаси",
    short_name: "УАТ",
    short_name_uz_latn: "ATB",
    short_name_uz_cyrl: "АТБ"
  },
  {
    code: "020",
    name: "Управление ракетно-артиллерийского вооружения ГУВ МО РУ",
    name_uz_latn: "O'zR MV QB Boshqarmasi Raketa-artilleriya qurol-aslahalari boshqarmasi",
    name_uz_cyrl: "ЎзР МВ ҚББ Ракета-артиллерия қурол-аслаҳалари бошқармаси",
    short_name: "УРАВ",
    short_name_uz_latn: "RAQB",
    short_name_uz_cyrl: "РАҚБ"
  },
  {
    code: "021",
    name: "Управление бронетанкового вооружения и техники ГУВ МО РУ",
    name_uz_latn: "O'zR MV QB Boshqarmasi Zirhli tank qurol-aslaha va texnikalari boshqarmasi",
    name_uz_cyrl: "ЎзР МВ ҚББ Зирҳли танк қурол-аслаҳа ва техникалари бошқармаси",
    short_name: "УБТВТ",
    short_name_uz_latn: "ZTQATB",
    short_name_uz_cyrl: "ЗТҚАТБ"
  },
  {
    code: "022",
    name: "Отдел инженерных войск ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi Muhandislik qo'shinlari bo'limi",
    name_uz_cyrl: "ЎзР ҚК БШ Муҳандислик қўшинлари бўлими",
    short_name: "ОИВ",
    short_name_uz_latn: "MQB",
    short_name_uz_cyrl: "МҚБ"
  },
  {
    code: "023",
    name: "Главное финансово-экономическое управление МО РУ",
    name_uz_latn: "O'zR MV Moliya-iqtisod bosh boshqarmasi",
    name_uz_cyrl: "ЎзР МВ Молия-иқтисод бош бошқармаси",
    short_name: "ГФЭУ",
    short_name_uz_latn: "MIBB",
    short_name_uz_cyrl: "МИББ"
  },
  {
    code: "024",
    name: "Управление подготовки военных кадров МО РУ",
    name_uz_latn: "O'zR MV Harbiy kadrlarni tayyorlash boshqarmasi",
    name_uz_cyrl: "ЎзР МВ Ҳарбий кадрларни тайёрлаш бошқармаси",
    short_name: "УПВК",
    short_name_uz_latn: "HKTB",
    short_name_uz_cyrl: "ҲКТБ"
  },
  {
    code: "025",
    name: "Отдел стандартизации, метрологии и сертификации МО РУ",
    name_uz_latn: "O'zR MV Standartlashtirish, metrologiya va sertifikatlash bo'limi",
    name_uz_cyrl: "ЎзР МВ Стандартлаштириш, метрология ва сертификатлаш бўлими",
    short_name: "ОСМС",
    short_name_uz_latn: "SMSB",
    short_name_uz_cyrl: "СМСБ"
  },
  {
    code: "028",
    name: "Управление обеспечения ГСМ ГУМТО МО РУ",
    name_uz_latn: "O'zR MV MTTBB YoMM Ta'minoti boshqarmasi",
    name_uz_cyrl: "ЎзР МВ МТТББ ЁММ Таъминоти бошқармаси",
    short_name: "УГСМ",
    short_name_uz_latn: "YoMMTB",
    short_name_uz_cyrl: "ЁММТБ"
  },
  {
    code: "029",
    name: "Управление медицинского обеспечения МО РУ",
    name_uz_latn: "O'zR MV Tibbiy ta'minot boshqarmasi",
    name_uz_cyrl: "ЎзР МВ Тиббий таъминот бошқармаси",
    short_name: "УмедО",
    short_name_uz_latn: "TTB",
    short_name_uz_cyrl: "ТТБ"
  },
  {
    code: "030",
    name: "Управление продовольственного обеспечения ГУМТО МО РУ",
    name_uz_latn: "O'zR MV MTTBB Oziq-ovqat ta'minoti boshqarmasi",
    name_uz_cyrl: "ЎзР МВ МТТББ Озиқ-овқат таъминоти бошқармаси",
    short_name: "УпродО",
    short_name_uz_latn: "OOTB",
    short_name_uz_cyrl: "ООТБ"
  },
  {
    code: "031",
    name: "Управление вещевого обеспечения ГУМТО МО РУ",
    name_uz_latn: "O'zR MV MTTBB Kiyim-kechak ta'minoti boshqarmasi",
    name_uz_cyrl: "ЎзР МВ МТТББ Кийим-кечак таъминоти бошқармаси",
    short_name: "УвещО",
    short_name_uz_latn: "KKTB",
    short_name_uz_cyrl: "ККТБ"
  },
  {
    code: "032",
    name: "Управление военных сообщений МО РУ",
    name_uz_latn: "O'zR MV Harbiy harakatlar boshqarmasi",
    name_uz_cyrl: "ЎзР МВ Ҳарбий ҳаракатлар бошқармаси",
    short_name: "УВОСО",
    short_name_uz_latn: "HHB",
    short_name_uz_cyrl: "ҲҲБ"
  },
  {
    code: "035",
    name: "Ветеринарная служба ГУМТО МО РУ",
    name_uz_latn: "O'zR MV MTTBB Veterinariya xizmati",
    name_uz_cyrl: "ЎзР МВ МТТББ Ветеринария хизмати",
    short_name: "ВетС",
    short_name_uz_latn: "VX",
    short_name_uz_cyrl: "ВХ"
  },
  {
    code: "041",
    name: "Квартирно-эксплуатационное управление Департамента обеспечения (ЦА МО РУ)",
    name_uz_latn: "O'zR MV TD Uy-joydan foydalanish boshqarmasi",
    name_uz_cyrl: "ЎзР МВ ТД Уй-жойдан фойдаланиш бошқармаси",
    short_name: "КЭУ",
    short_name_uz_latn: "UJFB",
    short_name_uz_cyrl: "УЖФБ"
  },
  {
    code: "042",
    name: "Главный центр информатизации ГШ ВС РУ",
    name_uz_latn: "O'zR QK Bosh shtabi Axborotlashtirish bosh markazi",
    name_uz_cyrl: "ЎзР ҚК БШ Ахборотлаштириш бош маркази",
    short_name: "ГЦИ",
    short_name_uz_latn: "ABM",
    short_name_uz_cyrl: "АБМ"
  },
  {
    code: "043",
    name: "Служба единого заказчика Департамента обеспечения (ЦА МО РУ)",
    name_uz_latn: "O'zR MV TD Yagona buyurtmachi xizmati",
    name_uz_cyrl: "ЎзР МВ ТД Ягона буюртмачи хизмати",
    short_name: "СЕЗ",
    short_name_uz_latn: "YBX",
    short_name_uz_cyrl: "ЯБХ"
  },
  {
    code: "045",
    name: "Отдел управления ресурсами",
    name_uz_latn: "Resurslarni boshqarish bo'limi",
    name_uz_cyrl: "Ресурсларни бошқариш бўлими",
    short_name: "ОУР",
    short_name_uz_latn: "RBB",
    short_name_uz_cyrl: "РББ"
  },
]

// Группы расходов
export const expenseGroups: ExpenseGroup[] = [
  {
    id: "I",
    name: "Заработная плата и приравненные к ней платежи",
    color: "bg-blue-500",
    categories: [
      {
        code: "41",
        name: "Заработная плата в денежной форме",
        articles: [
          {
            code: "41 11 101",
            name: "Денежное довольствие военнослужащих",
            elements: [
              { code: "023/01", name: "Оклады по воинским званиям" },
              { code: "023/02", name: "Должностные оклады" },
              { code: "023/03", name: "Процентная надбавка за выслугу лет" },
              { code: "023/04", name: "Надбавка за службу в местностях с тяжелыми климатическими условиями" },
              { code: "023/05", name: "Денежное вознаграждение за классную квалификацию" },
              { code: "023/06", name: "Надбавка за особые условия службы" },
              { code: "023/07", name: "Надбавка за прохождение службы в составе батально-тактической группы" },
              {
                code: "023/08",
                name: "Надбавки за особые условия службы военнослужащим военно-медицинских учреждений",
              },
              { code: "023/09", name: "Процентная надбавка за ученое звание и ученую степень" },
              { code: "023/10", name: "Надбавка за командование воинскими подразделениями" },
              { code: "023/11", name: "Надбавка за знание и использование иностранных языков" },
              { code: "023/37", name: "Денежное вознаграждение за прыжки с парашютом" },
              { code: "023/38", name: "Денежное вознаграждение за выполнение водолазных работ" },
              { code: "023/40", name: "Материальная помощь" },
              { code: "023/41", name: "Единовременное денежное вознаграждение за непрерывную военную службу" },
              { code: "023/45", name: "Единовременное пособие при увольнении с военной службы" },
              { code: "023/56", name: "Подъемное пособие" },
              { code: "023/57", name: "Суточные деньги при назначениях и перемещениях" },
              { code: "023/58", name: "Полевые деньги" },
            ],
          },
          {
            code: "41 11 102",
            name: "Денежная компенсация взамен продовольственного пайка",
            elements: [
              { code: "030/1", name: "Денежная компенсация взамен продовольственного пайка" },
              { code: "030/2", name: "Продовольственно-путевые деньги военнослужащим" },
            ],
          },
          {
            code: "41 11 105",
            name: "Заработная плата штатных рабочих и служащих",
            elements: [
              { code: "023/1", name: "Должностные оклады и ставки заработной платы" },
              { code: "023/2", name: "Повышение должностных окладов" },
              { code: "023/3", name: "Повышение должностных окладов за секретность" },
              { code: "023/4", name: "Процентная надбавка за стаж работы" },
              { code: "023/16", name: "Премии, предусмотренные законодательством" },
              { code: "023/17", name: "Доплата за совмещение профессий" },
              { code: "023/24", name: "Выходное пособие при увольнении" },
            ],
          },
        ],
      },
      {
        code: "47",
        name: "Пособия по социальному обеспечению",
        articles: [
          {
            code: "47 11 120",
            name: "Пособие по временной нетрудоспособности",
            elements: [],
          },
          {
            code: "47 11 150",
            name: "Пособие по беременности и родам",
            elements: [],
          },
          {
            code: "47 11 400",
            name: "Пенсии пенсионерам МО РУ",
            elements: [
              { code: "023/410", name: "Досрочные пенсии" },
              { code: "023/420", name: "Пенсии не работающим пенсионерам" },
              { code: "023/430", name: "Пенсии работающим пенсионерам" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "II",
    name: "Начисления на заработную плату",
    color: "bg-green-500",
    categories: [
      {
        code: "42",
        name: "Отчисления в государственные целевые фонды",
        articles: [
          {
            code: "42 11 100",
            name: "Единый социальный платеж",
            elements: [
              { code: "023/100", name: "Единый социальный платеж от ФОТ военнослужащих" },
              { code: "023/101", name: "Единый социальный платеж от ФОТ гражданского персонала" },
            ],
          },
          {
            code: "42 11 200",
            name: "Страховые взносы граждан",
            elements: [{ code: "023/200", name: "Обязательные страховые взносы" }],
          },
        ],
      },
    ],
  },
  {
    id: "III",
    name: "Капитальные вложения",
    color: "bg-purple-500",
    categories: [
      {
        code: "60",
        name: "Капитальное строительство",
        articles: [
          {
            code: "60 11 100",
            name: "Строительство объектов",
            elements: [
              { code: "041/1", name: "Строительство жилых зданий" },
              { code: "041/2", name: "Строительство казарменного фонда" },
              { code: "041/3", name: "Строительство объектов специального назначения" },
            ],
          },
          {
            code: "60 11 200",
            name: "Реконструкция объектов",
            elements: [
              { code: "041/10", name: "Реконструкция жилых зданий" },
              { code: "041/11", name: "Реконструкция казарменного фонда" },
            ],
          },
        ],
      },
      {
        code: "61",
        name: "Приобретение основных средств",
        articles: [
          {
            code: "61 11 100",
            name: "Приобретение вооружения и военной техники",
            elements: [
              { code: "020/1", name: "Ракетно-артиллерийское вооружение" },
              { code: "021/1", name: "Бронетанковая техника" },
              { code: "004/1", name: "Авиационная техника" },
            ],
          },
          {
            code: "61 11 200",
            name: "Приобретение автомобильной техники",
            elements: [
              { code: "019/1", name: "Грузовые автомобили" },
              { code: "019/2", name: "Легковые автомобили" },
              { code: "019/3", name: "Специальные автомобили" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "IV",
    name: "Другие расходы",
    color: "bg-orange-500",
    categories: [
      {
        code: "44",
        name: "Продовольственное обеспечение",
        articles: [
          {
            code: "44 11 101",
            name: "Продовольствие для личного состава",
            elements: [
              { code: "030/101", name: "Продовольственный паек военнослужащих" },
              { code: "030/102", name: "Дополнительное питание" },
              { code: "030/103", name: "Лечебное питание" },
            ],
          },
        ],
      },
      {
        code: "45",
        name: "Вещевое обеспечение",
        articles: [
          {
            code: "45 11 101",
            name: "Вещевое имущество военнослужащих",
            elements: [
              { code: "031/1", name: "Повседневная форма одежды" },
              { code: "031/2", name: "Полевая форма одежды" },
              { code: "031/3", name: "Парадная форма одежды" },
              { code: "031/4", name: "Специальная одежда" },
            ],
          },
        ],
      },
      {
        code: "46",
        name: "ГСМ и топливо",
        articles: [
          {
            code: "46 11 101",
            name: "Горюче-смазочные материалы",
            elements: [
              { code: "028/1", name: "Автомобильный бензин" },
              { code: "028/2", name: "Дизельное топливо" },
              { code: "028/3", name: "Авиационное топливо" },
              { code: "028/4", name: "Смазочные материалы" },
            ],
          },
        ],
      },
      {
        code: "48",
        name: "Медицинское обеспечение",
        articles: [
          {
            code: "48 11 101",
            name: "Медикаменты и медицинское имущество",
            elements: [
              { code: "029/1", name: "Лекарственные препараты" },
              { code: "029/2", name: "Медицинское оборудование" },
              { code: "029/3", name: "Расходные медицинские материалы" },
            ],
          },
        ],
      },
      {
        code: "49",
        name: "Коммунальные услуги",
        articles: [
          {
            code: "49 11 101",
            name: "Оплата коммунальных услуг",
            elements: [
              { code: "041/101", name: "Электроэнергия" },
              { code: "041/102", name: "Газоснабжение" },
              { code: "041/103", name: "Водоснабжение" },
              { code: "041/104", name: "Теплоснабжение" },
            ],
          },
        ],
      },
      {
        code: "50",
        name: "Транспортные расходы",
        articles: [
          {
            code: "50 11 101",
            name: "Транспортные услуги",
            elements: [
              { code: "032/1", name: "Железнодорожные перевозки" },
              { code: "032/2", name: "Автомобильные перевозки" },
              { code: "032/3", name: "Авиаперевозки" },
            ],
          },
        ],
      },
      {
        code: "51",
        name: "Командировочные расходы",
        articles: [
          {
            code: "51 11 101",
            name: "Служебные командировки",
            elements: [
              { code: "023/501", name: "Суточные расходы" },
              { code: "023/502", name: "Расходы на проживание" },
              { code: "023/503", name: "Транспортные расходы" },
            ],
          },
        ],
      },
      {
        code: "52",
        name: "Связь",
        articles: [
          {
            code: "52 11 101",
            name: "Услуги связи",
            elements: [
              { code: "018/1", name: "Телефонная связь" },
              { code: "018/2", name: "Интернет" },
              { code: "018/3", name: "Специальная связь" },
            ],
          },
        ],
      },
    ],
  },
]

// Функция для получения полного названия статьи по коду
export function getExpenseArticleByCode(code: string): ExpenseArticle | null {
  for (const group of expenseGroups) {
    for (const category of group.categories) {
      for (const article of category.articles) {
        if (article.code === code) {
          return article
        }
      }
    }
  }
  return null
}

// Функция для получения группы по ID
export function getExpenseGroupById(id: string): ExpenseGroup | null {
  return expenseGroups.find((g) => g.id === id) || null
}

// Функция для получения довольствующего управления по коду
export function getSupplyDepartmentByCode(code: string): SupplyDepartment | null {
  return supplyDepartments.find((d) => d.code === code) || null
}

// Функция для получения всех статей расходов (плоский список)
export function getAllExpenseArticles(): {
  groupId: string
  groupName: string
  categoryCode: string
  categoryName: string
  article: ExpenseArticle
}[] {
  const result: {
    groupId: string
    groupName: string
    categoryCode: string
    categoryName: string
    article: ExpenseArticle
  }[] = []

  for (const group of expenseGroups) {
    for (const category of group.categories) {
      for (const article of category.articles) {
        result.push({
          groupId: group.id,
          groupName: group.name,
          categoryCode: category.code,
          categoryName: category.name,
          article,
        })
      }
    }
  }

  return result
}
