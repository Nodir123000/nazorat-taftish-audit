export interface MilitaryDistrict {
    id: number;
    code: string;
    name: string;
    name_uz_latn: string;
    name_uz_cyrl: string;
    shortName: string;
    shortName_uz_latn: string;
    shortName_uz_cyrl: string;
    headquarters: string;
    headquarters_uz_latn: string;
    headquarters_uz_cyrl: string;
    status: string;
}

export interface MilitaryUnit {
    id: number;
    stateId: string;
    stateNumber: string;
    name: string;
    name_uz_latn?: string;
    name_uz_cyrl?: string;
    type: string;
    type_uz_latn?: string;
    type_uz_cyrl?: string;
    location: string;
    location_uz_latn?: string;
    location_uz_cyrl?: string;
    district: string;
    district_uz_latn?: string;
    district_uz_cyrl?: string;
    description: string;
    description_uz_latn?: string;
    description_uz_cyrl?: string;
    specializationId: number;
    status: "active" | "inactive";
}

export interface ControlDirection {
    id: number;
    code: string;
    name: string;
    name_uz_latn?: string;
    name_uz_cyrl?: string;
    description?: string;
    description_uz_latn?: string;
    description_uz_cyrl?: string;
    status: "active" | "inactive";
}



export const militaryDistricts: MilitaryDistrict[] = [
    {
        id: 1,
        code: "ВО-ЮЗ",
        name: "Юго-Западный особый военный округ",
        name_uz_latn: "Janubi-g'arbiy maxsus harbiy okrugi",
        name_uz_cyrl: "Жануби-ғарбий махсус ҳарбий округи",
        shortName: "ЮЗОВО",
        shortName_uz_latn: "JGMHO",
        shortName_uz_cyrl: "ЖГМҲО",
        headquarters: "г. Карши",
        headquarters_uz_latn: "Qarshi sh.",
        headquarters_uz_cyrl: "Қарши ш.",
        status: "active"
    },
    {
        id: 2,
        code: "ВО-В",
        name: "Восточный военный округ",
        name_uz_latn: "Sharqiy harbiy okrugi",
        name_uz_cyrl: "Шарқий ҳарбий округи",
        shortName: "ВВО",
        shortName_uz_latn: "ShHO",
        shortName_uz_cyrl: "ШҲО",
        headquarters: "г. Маргилан",
        headquarters_uz_latn: "Marg'ilon sh.",
        headquarters_uz_cyrl: "Марғилон ш.",
        status: "active"
    },
    {
        id: 3,
        code: "ВО-Т",
        name: "Ташкентский военный округ",
        name_uz_latn: "Toshkent harbiy okrugi",
        name_uz_cyrl: "Тошкент ҳарбий округи",
        shortName: "ТВО",
        shortName_uz_latn: "THO",
        shortName_uz_cyrl: "ТҲО",
        headquarters: "г. Ташкент",
        headquarters_uz_latn: "Toshkent sh.",
        headquarters_uz_cyrl: "Тошкент ш.",
        status: "active"
    },
    {
        id: 4,
        code: "ВО-Ц",
        name: "Центральный военный округ",
        name_uz_latn: "Markaziy harbiy okrugi",
        name_uz_cyrl: "Марказий ҳарбий округи",
        shortName: "ЦВО",
        shortName_uz_latn: "MHO",
        shortName_uz_cyrl: "МҲО",
        headquarters: "г. Самарканд",
        headquarters_uz_latn: "Samarqand sh.",
        headquarters_uz_cyrl: "Самарқанд ш.",
        status: "active"
    },
    {
        id: 5,
        code: "ВО-СЗ",
        name: "Северо-Западный военный округ",
        name_uz_latn: "Shimoli-g'arbiy harbiy okrugi",
        name_uz_cyrl: "Шимоли-ғарбий ҳарбий округи",
        shortName: "СЗВО",
        shortName_uz_latn: "ShGMHO",
        shortName_uz_cyrl: "ШГМҲО",
        headquarters: "г. Нукус",
        headquarters_uz_latn: "Nukus sh.",
        headquarters_uz_cyrl: "Нукус ш.",
        status: "active"
    },
    {
        id: 6,
        code: "К-ПВО-ВВС",
        name: "Командование войск противовоздушной обороны и военно-воздушных сил",
        name_uz_latn: "Havo hujumidan mudofaa qo'shinlari va Harbiy havo kuchlari qo'mondonligi",
        name_uz_cyrl: "Ҳаво ҳужумидан мудофаа қўшинлари ва Ҳарбий ҳаво кучлари қўмондонлиги",
        shortName: "КВ ПВО и ВВС",
        shortName_uz_latn: "HHM va HHK",
        shortName_uz_cyrl: "ҲҲМ ва ҲҲК",
        headquarters: "г. Ташкент",
        headquarters_uz_latn: "Toshkent sh.",
        headquarters_uz_cyrl: "Тошкент ш.",
        status: "active"
    },
    {
        id: 7,
        code: "К-ОКО",
        name: "Командование войск по охране категорированных объектов",
        name_uz_latn: "Toifalangan obyektlarni qo'riqlash qo'shinlari qo'mondonligi",
        name_uz_cyrl: "Тоифаланган объектларни қўриқлаш қўшинлари қўмондонлиги",
        shortName: "КВ ОКО",
        shortName_uz_latn: "TOQQ",
        shortName_uz_cyrl: "ТОҚҚ",
        headquarters: "г. Ташкент",
        headquarters_uz_latn: "Toshkent sh.",
        headquarters_uz_cyrl: "Тошкент ш.",
        status: "active"
    },
];

export const militaryUnits: MilitaryUnit[] = [
    // Сектор ЮЗОВО
    {
        id: 1, stateId: "00001", stateNumber: "01/001",
        name: "Воинская часть 00001", name_uz_latn: "00001 harbiy qism", name_uz_cyrl: "00001 ҳарбий қисм",
        type: "Бригада", type_uz_latn: "Brigada", type_uz_cyrl: "Бригада",
        location: "г. Андижан, Андижанская область", location_uz_latn: "Andijon sh., Andijon viloyati", location_uz_cyrl: "Андижон ш., Андижон вилояти",
        district: "ВВО", district_uz_latn: "ShHO", district_uz_cyrl: "ШҲО",
        description: "Горнострелковая бригада", description_uz_latn: "Tog'li o'qchi brigada", description_uz_cyrl: "Тоғли ўқчи бригада",
        specializationId: 1001, status: "active"
    },
    {
        id: 2, stateId: "00002", stateNumber: "01/002",
        name: "Воинская часть 00002", name_uz_latn: "00002 harbiy qism", name_uz_cyrl: "00002 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Ханабад, Андижанская область", location_uz_latn: "Xonobod sh., Andijon viloyati", location_uz_cyrl: "Хонобод ш., Андижон вилояти",
        district: "ВВО", district_uz_latn: "ShHO", district_uz_cyrl: "ШҲО",
        description: "Разведывательный батальон", description_uz_latn: "Razvedka batalyoni", description_uz_cyrl: "Разведка батальони",
        specializationId: 1008, status: "active"
    },
    {
        id: 3, stateId: "00003", stateNumber: "01/003",
        name: "Воинская часть 00003", name_uz_latn: "00003 harbiy qism", name_uz_cyrl: "00003 ҳарбий қисм",
        type: "Бригада", type_uz_latn: "Brigada", type_uz_cyrl: "Бригада",
        location: "Алтынкульский район, Андижанская область", location_uz_latn: "Oltinko'l tumani, Andijon viloyati", location_uz_cyrl: "Олтинкўл тумани, Андижон вилояти",
        district: "ВВО", district_uz_latn: "ShHO", district_uz_cyrl: "ШҲО",
        description: "Мотострелковая бригада", description_uz_latn: "Motootqich brigada", description_uz_cyrl: "Мотоотқич бригада",
        specializationId: 1001, status: "active"
    },
    {
        id: 4, stateId: "00004", stateNumber: "01/004",
        name: "Воинская часть 00004", name_uz_latn: "00004 harbiy qism", name_uz_cyrl: "00004 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Карши, Кашкадарьинская область", location_uz_latn: "Qarshi sh., Qashqadaryo viloyati", location_uz_cyrl: "Қарши ш., Қашқадарё вилояти",
        district: "ЮЗОВО", district_uz_latn: "JGMHO", district_uz_cyrl: "ЖГМҲО",
        description: "Инженерный отряд", description_uz_latn: "Muhandislik otryadi", description_uz_cyrl: "Муҳандислик отряди",
        specializationId: 1006, status: "active"
    },
    {
        id: 5, stateId: "00005", stateNumber: "01/005",
        name: "Воинская часть 00005", name_uz_latn: "00005 harbiy qism", name_uz_cyrl: "00005 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Термез, Сурхандарьинская область", location_uz_latn: "Termiz sh., Surxondaryo viloyati", location_uz_cyrl: "Термиз ш., Сурхондарё вилояти",
        district: "ЮЗОВО", district_uz_latn: "JGMHO", district_uz_cyrl: "ЖГМҲО",
        description: "Батальон обеспечения", description_uz_latn: "Ta'minot batalyoni", description_uz_cyrl: "Таъминот батальони",
        specializationId: 1009, status: "active"
    },

    // Сектор ВВО
    {
        id: 6, stateId: "00006", stateNumber: "01/006",
        name: "Воинская часть 00006", name_uz_latn: "00006 harbiy qism", name_uz_cyrl: "00006 ҳарбий қисм",
        type: "Бригада", type_uz_latn: "Brigada", type_uz_cyrl: "Бригада",
        location: "г. Фергана, Ферганская область", location_uz_latn: "Farg'ona sh., Farg'ona viloyati", location_uz_cyrl: "Фарғона ш., Фарғона вилояти",
        district: "ВВО", district_uz_latn: "ShHO", district_uz_cyrl: "ШҲО",
        description: "Десантно-штурмовая бригада", description_uz_latn: "Desant-shturm brigadasi", description_uz_cyrl: "Десант-штурм бригадаси",
        specializationId: 1004, status: "active"
    },
    {
        id: 7, stateId: "00007", stateNumber: "01/007",
        name: "Воинская часть 00007", name_uz_latn: "00007 harbiy qism", name_uz_cyrl: "00007 ҳарбий қисм",
        type: "Бригада", type_uz_latn: "Brigada", type_uz_cyrl: "Бригада",
        location: "г. Андижан, Андижанская область", location_uz_latn: "Andijon sh., Andijon viloyati", location_uz_cyrl: "Андижон ш., Андижон вилояти",
        district: "ВВО", district_uz_latn: "ShHO", district_uz_cyrl: "ШҲО",
        description: "Мотострелковая бригада", description_uz_latn: "Motootqich brigada", description_uz_cyrl: "Мотоотқич бригада",
        specializationId: 1001, status: "active"
    },
    {
        id: 8, stateId: "00008", stateNumber: "01/008",
        name: "Воинская часть 00008", name_uz_latn: "00008 harbiy qism", name_uz_cyrl: "00008 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Наманган, Наманганская область", location_uz_latn: "Namangan sh., Namangan viloyati", location_uz_cyrl: "Наманган ш., Наманган вилояти",
        district: "ВВО", district_uz_latn: "ShHO", district_uz_cyrl: "ШҲО",
        description: "Артиллерийский батальон", description_uz_latn: "Artilleriya batalyoni", description_uz_cyrl: "Артиллерия батальони",
        specializationId: 1003, status: "active"
    },
    {
        id: 9, stateId: "00009", stateNumber: "01/009",
        name: "Воинская часть 00009", name_uz_latn: "00009 harbiy qism", name_uz_cyrl: "00009 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Фергана, Ферганская область", location_uz_latn: "Farg'ona sh., Farg'ona viloyati", location_uz_cyrl: "Фарғона ш., Фарғона вилояти",
        district: "ВВО", district_uz_latn: "ShHO", district_uz_cyrl: "ШҲО",
        description: "Зенитно-ракетный отряд", description_uz_latn: "Zenit-raketa otryadi", description_uz_cyrl: "Зенит-ракета отряди",
        specializationId: 1003, status: "active"
    },
    {
        id: 10, stateId: "00010", stateNumber: "01/010",
        name: "Воинская часть 00010", name_uz_latn: "00010 harbiy qism", name_uz_cyrl: "00010 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Андижан, Андижанская область", location_uz_latn: "Andijon sh., Andijon viloyati", location_uz_cyrl: "Андижон ш., Андижон вилояти",
        district: "ВВО", district_uz_latn: "ShHO", district_uz_cyrl: "ШҲО",
        description: "Батальон связи", description_uz_latn: "Aloqa batalyoni", description_uz_cyrl: "Алоқа батальони",
        specializationId: 1005, status: "active"
    },

    // Сектор ТВО
    {
        id: 11, stateId: "00011", stateNumber: "01/011",
        name: "Воинская часть 00011", name_uz_latn: "00011 harbiy qism", name_uz_cyrl: "00011 ҳарбий қисм",
        type: "Бригада", type_uz_latn: "Brigada", type_uz_cyrl: "Бригада",
        location: "г. Ташкент, г. Ташкент", location_uz_latn: "Toshkent sh., Toshkent sh.", location_uz_cyrl: "Тошкент ш., Тошкент ш.",
        district: "ТВО", district_uz_latn: "THO", district_uz_cyrl: "ТҲО",
        description: "Мотострелковая бригада (Гвардейская)", description_uz_latn: "Motootqich brigada (Gvardiyachi)", description_uz_cyrl: "Мотоотқич бригада (Гвардиячи)",
        specializationId: 1001, status: "active"
    },
    {
        id: 12, stateId: "00012", stateNumber: "01/012",
        name: "Воинская часть 00012", name_uz_latn: "00012 harbiy qism", name_uz_cyrl: "00012 ҳарбий қисм",
        type: "Бригада", type_uz_latn: "Brigada", type_uz_cyrl: "Бригада",
        location: "г. Чирчик, Ташкентская область", location_uz_latn: "Chirchiq sh., Toshkent viloyati", location_uz_cyrl: "Чирчиқ ш., Тошкент вилояти",
        district: "ТВО", district_uz_latn: "THO", district_uz_cyrl: "ТҲО",
        description: "Воздушно-десантная бригада", description_uz_latn: "Havo-desant brigadasi", description_uz_cyrl: "Ҳаво-десант бригадаси",
        specializationId: 1004, status: "active"
    },
    {
        id: 13, stateId: "00013", stateNumber: "01/013",
        name: "Воинская часть 00013", name_uz_latn: "00013 harbiy qism", name_uz_cyrl: "00013 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Гулистан, Сырдарьинская область", location_uz_latn: "Guliston sh., Sirdaryo viloyati", location_uz_cyrl: "Гулистон ш., Сирдарё вилояти",
        district: "ТВО", district_uz_latn: "THO", district_uz_cyrl: "ТҲО",
        description: "Батальон связи", description_uz_latn: "Aloqa batalyoni", description_uz_cyrl: "Алоқа батальони",
        specializationId: 1005, status: "active"
    },
    {
        id: 14, stateId: "00014", stateNumber: "01/014",
        name: "Воинская часть 00014", name_uz_latn: "00014 harbiy qism", name_uz_cyrl: "00014 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Ангрен, Ташкентская область", location_uz_latn: "Angren sh., Toshkent viloyati", location_uz_cyrl: "Ангрен ш., Тошкент вилояти",
        district: "ТВО", district_uz_latn: "THO", district_uz_cyrl: "ТҲО",
        description: "Горнострелковый отряд", description_uz_latn: "Tog'li o'qchi otryadi", description_uz_cyrl: "Тоғли ўқчи отряди",
        specializationId: 1001, status: "active"
    },
    {
        id: 15, stateId: "00015", stateNumber: "01/015",
        name: "Воинская часть 00015", name_uz_latn: "00015 harbiy qism", name_uz_cyrl: "00015 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Ташкент, г. Ташкент", location_uz_latn: "Toshkent sh., Toshkent sh.", location_uz_cyrl: "Тошкент ш., Тошкент ш.",
        district: "ТВО", district_uz_latn: "THO", district_uz_cyrl: "ТҲО",
        description: "Учебный батальон", description_uz_latn: "O'quv batalyoni", description_uz_cyrl: "Ўқув батальони",
        specializationId: 1009, status: "active"
    },

    // Сектор ЦВО
    {
        id: 16, stateId: "00016", stateNumber: "01/016",
        name: "Воинская часть 00016", name_uz_latn: "00016 harbiy qism", name_uz_cyrl: "00016 ҳарбий қисм",
        type: "Бригада", type_uz_latn: "Brigada", type_uz_cyrl: "Бригада",
        location: "г. Самарканд, Самаркандская область", location_uz_latn: "Samarqand sh., Samarqand viloyati", location_uz_cyrl: "Самарқанд ш., Самарқанд вилояти",
        district: "ЦВО", district_uz_latn: "MHO", district_uz_cyrl: "МҲО",
        description: "Мотострелковая бригада", description_uz_latn: "Motootqich brigada", description_uz_cyrl: "Мотоотқич бригада",
        specializationId: 1001, status: "active"
    },
    {
        id: 17, stateId: "00017", stateNumber: "01/017",
        name: "Воинская часть 00017", name_uz_latn: "00017 harbiy qism", name_uz_cyrl: "00017 ҳарбий қисм",
        type: "Бригада", type_uz_latn: "Brigada", type_uz_cyrl: "Бригада",
        location: "г. Джизак, Джизакская область", location_uz_latn: "Jizzax sh., Jizzax viloyati", location_uz_cyrl: "Жиззах ш., Жиззах вилояти",
        district: "ЦВО", district_uz_latn: "MHO", district_uz_cyrl: "МҲО",
        description: "Танковая бригада", description_uz_latn: "Tank brigadasi", description_uz_cyrl: "Танк бригадаси",
        specializationId: 1002, status: "active"
    },
    {
        id: 18, stateId: "00018", stateNumber: "01/018",
        name: "Воинская часть 00018", name_uz_latn: "00018 harbiy qism", name_uz_cyrl: "00018 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Самарканд, Самаркандская область", location_uz_latn: "Samarqand sh., Samarqand viloyati", location_uz_cyrl: "Самарқанд ш., Самарқанд вилояти",
        district: "ЦВО", district_uz_latn: "MHO", district_uz_cyrl: "МҲО",
        description: "Саперный батальон", description_uz_latn: "Sapyorlar batalyoni", description_uz_cyrl: "Сапёрлар батальони",
        specializationId: 1006, status: "active"
    },
    {
        id: 19, stateId: "00019", stateNumber: "01/019",
        name: "Воинская часть 00019", name_uz_latn: "00019 harbiy qism", name_uz_cyrl: "00019 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Каттакурган, Самаркандская область", location_uz_latn: "Kattaqo'rg'on sh., Samarqand viloyati", location_uz_cyrl: "Каттақўрғон ш., Самарқанд вилояти",
        district: "ЦВО", district_uz_latn: "MHO", district_uz_cyrl: "МҲО",
        description: "Разведывательный отряд", description_uz_latn: "Razvedka otryadi", description_uz_cyrl: "Разведка отряди",
        specializationId: 1008, status: "active"
    },
    {
        id: 20, stateId: "00020", stateNumber: "01/020",
        name: "Воинская часть 00020", name_uz_latn: "00020 harbiy qism", name_uz_cyrl: "00020 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Джизак, Джизакская область", location_uz_latn: "Jizzax sh., Jizzax viloyati", location_uz_cyrl: "Жиззах ш., Жиззах вилояти",
        district: "ЦВО", district_uz_latn: "MHO", district_uz_cyrl: "МҲО",
        description: "Рота спецназначения", description_uz_latn: "Maxsus vazifador rota", description_uz_cyrl: "Махсус вазифадор рота",
        specializationId: 1004, status: "active"
    },

    // Сектор СЗВО
    {
        id: 21, stateId: "00021", stateNumber: "01/021",
        name: "Воинская часть 00021", name_uz_latn: "00021 harbiy qism", name_uz_cyrl: "00021 ҳарбий қисм",
        type: "Бригада", type_uz_latn: "Brigada", type_uz_cyrl: "Бригада",
        location: "г. Нукус, Республика Каракалпакстан", location_uz_latn: "Nukus sh., Qoraqalpog'iston Respublikasi", location_uz_cyrl: "Нукус ш., Қорақалпоғистон Республикаси",
        district: "СЗВО", district_uz_latn: "ShGMHO", district_uz_cyrl: "ШГМҲО",
        description: "Мотострелковая бригада", description_uz_latn: "Motootqich brigada", description_uz_cyrl: "Мотоотқич бригада",
        specializationId: 1001, status: "active"
    },
    {
        id: 22, stateId: "00022", stateNumber: "01/022",
        name: "Воинская часть 00022", name_uz_latn: "00022 harbiy qism", name_uz_cyrl: "00022 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Ургенч, Хорезмская область", location_uz_latn: "Urganch sh., Xorazm viloyati", location_uz_cyrl: "Урганч ш., Хоразм вилояти",
        district: "СЗВО", district_uz_latn: "ShGMHO", district_uz_cyrl: "ШГМҲО",
        description: "Береговой батальон", description_uz_latn: "Sohil batalyoni", description_uz_cyrl: "Соҳил батальони",
        specializationId: 1001, status: "active"
    },
    {
        id: 23, stateId: "00023", stateNumber: "01/023",
        name: "Воинская часть 00023", name_uz_latn: "00023 harbiy qism", name_uz_cyrl: "00023 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Нукус, Республика Каракалпакстан", location_uz_latn: "Nukus sh., Qoraqalpog'iston Respublikasi", location_uz_cyrl: "Нукус ш., Қорақалпоғистон Республикаси",
        district: "СЗВО", district_uz_latn: "ShGMHO", district_uz_cyrl: "ШГМҲО",
        description: "Зенитный отряд", description_uz_latn: "Zenit otryadi", description_uz_cyrl: "Зенит отряди",
        specializationId: 1003, status: "active"
    },
    {
        id: 24, stateId: "00024", stateNumber: "01/024",
        name: "Воинская часть 00024", name_uz_latn: "00024 harbiy qism", name_uz_cyrl: "00024 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Муйнак, Республика Каракалпакстан", location_uz_latn: "Mo'ynoq sh., Qoraqalpog'iston Respublikasi", location_uz_cyrl: "Мўйноқ ш., Қорақалпоғистон Республикаси",
        district: "СЗВО", district_uz_latn: "ShGMHO", district_uz_cyrl: "ШГМҲО",
        description: "Пограничный батальон", description_uz_latn: "Chegara batalyoni", description_uz_cyrl: "Чегара батальони",
        specializationId: 1001, status: "active"
    },
    {
        id: 25, stateId: "00025", stateNumber: "01/025",
        name: "Воинская часть 00025", name_uz_latn: "00025 harbiy qism", name_uz_cyrl: "00025 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Ургенч, Хорезмская область", location_uz_latn: "Urganch sh., Xorazm viloyati", location_uz_cyrl: "Урганч ш., Хоразм вилояти",
        district: "СЗВО", district_uz_latn: "ShGMHO", district_uz_cyrl: "ШГМҲО",
        description: "Инженерный батальон", description_uz_latn: "Muhandislik batalyoni", description_uz_cyrl: "Муҳандислик батальони",
        specializationId: 1006, status: "active"
    },

    // Сектор КВ ПВО и ВВС
    {
        id: 26, stateId: "00026", stateNumber: "01/026",
        name: "Воинская часть 00026", name_uz_latn: "00026 harbiy qism", name_uz_cyrl: "00026 ҳарбий қисм",
        type: "Управление", type_uz_latn: "Boshqarma", type_uz_cyrl: "Бошқарма",
        location: "г. Ташкент", location_uz_latn: "Toshkent sh.", location_uz_cyrl: "Тошкент ш.",
        district: "КВ ПВО и ВВС", district_uz_latn: "HHM va HHK", district_uz_cyrl: "ҲҲМ ва ҲҲК",
        description: "Штаб командования", description_uz_latn: "Qo'mondonlik shtabi", description_uz_cyrl: "Қўмондонлик штаби",
        specializationId: 1009, status: "active"
    },
    {
        id: 27, stateId: "00027", stateNumber: "01/027",
        name: "Воинская часть 00027", name_uz_latn: "00027 harbiy qism", name_uz_cyrl: "00027 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Карши", location_uz_latn: "Qarshi sh.", location_uz_cyrl: "Қарши ш.",
        district: "КВ ПВО и ВВС", district_uz_latn: "HHM va HHK", district_uz_cyrl: "ҲҲМ ва ҲҲК",
        description: "Истребительный авиаотряд", description_uz_latn: "Qiruvchi aviaotryad", description_uz_cyrl: "Қирувчи авиаотряд",
        specializationId: 1010, status: "active"
    },
    {
        id: 28, stateId: "00028", stateNumber: "01/028",
        name: "Воинская часть 00028", name_uz_latn: "00028 harbiy qism", name_uz_cyrl: "00028 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Чирчик", location_uz_latn: "Chirchiq sh.", location_uz_cyrl: "Чирчиқ ш.",
        district: "КВ ПВО и ВВС", district_uz_latn: "HHM va HHK", district_uz_cyrl: "ҲҲМ ва ҲҲК",
        description: "Вертолетный отряд", description_uz_latn: "Vertolyotlar otryadi", description_uz_cyrl: "Вертолётлар отряди",
        specializationId: 1010, status: "active"
    },
    {
        id: 29, stateId: "00029", stateNumber: "01/029",
        name: "Воинская часть 00029", name_uz_latn: "00029 harbiy qism", name_uz_cyrl: "00029 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Фергана", location_uz_latn: "Farg'ona sh.", location_uz_cyrl: "Фарғона ш.",
        district: "КВ ПВО и ВВС", district_uz_latn: "HHM va HHK", district_uz_cyrl: "ҲҲМ ва ҲҲК",
        description: "Батальон РТВ", description_uz_latn: "RTM batalyoni", description_uz_cyrl: "РТМ батальони",
        specializationId: 1010, status: "active"
    },
    {
        id: 30, stateId: "00030", stateNumber: "01/030",
        name: "Воинская часть 00030", name_uz_latn: "00030 harbiy qism", name_uz_cyrl: "00030 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Нукус", location_uz_latn: "Nukus sh.", location_uz_cyrl: "Нукус ш.",
        district: "КВ ПВО и ВВС", district_uz_latn: "HHM va HHK", district_uz_cyrl: "ҲҲМ ва ҲҲК",
        description: "Зенитно-ракетный отряд", description_uz_latn: "Zenit-raketa otryadi", description_uz_cyrl: "Зенит-ракета отряди",
        specializationId: 1003, status: "active"
    },

    // Сектор КВ ОКО
    {
        id: 31, stateId: "00031", stateNumber: "01/031",
        name: "Воинская часть 00031", name_uz_latn: "00031 harbiy qism", name_uz_cyrl: "00031 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Навои", location_uz_latn: "Navoiy sh.", location_uz_cyrl: "Навоий ш.",
        district: "КВ ОКО", district_uz_latn: "TOQQ", district_uz_cyrl: "ТОҚҚ",
        description: "Отряд охраны НГМК", description_uz_latn: "NKMK qo'riqlash otryadi", description_uz_cyrl: "НКМК қўриқлаш отряди",
        specializationId: 1001, status: "active"
    },
    {
        id: 32, stateId: "00032", stateNumber: "01/032",
        name: "Воинская часть 00032", name_uz_latn: "00032 harbiy qism", name_uz_cyrl: "00032 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Бекабад", location_uz_latn: "Bekobod sh.", location_uz_cyrl: "Бекобод ш.",
        district: "КВ ОКО", district_uz_latn: "TOQQ", district_uz_cyrl: "ТОҚҚ",
        description: "Охрана металлургического комбината", description_uz_latn: "Metallurgiya kombinati qo'riqlovi", description_uz_cyrl: "Металлургия комбинати қўриқлови",
        specializationId: 1001, status: "active"
    },
    {
        id: 33, stateId: "00033", stateNumber: "01/033",
        name: "Воинская часть 00033", name_uz_latn: "00033 harbiy qism", name_uz_cyrl: "00033 ҳарбий қисм",
        type: "Отдельный батальон", type_uz_latn: "Alohida batalyon", type_uz_cyrl: "Алоҳида батальон",
        location: "г. Ташкент", location_uz_latn: "Toshkent sh.", location_uz_cyrl: "Тошкент ш.",
        district: "КВ ОКО", district_uz_latn: "TOQQ", district_uz_cyrl: "ТОҚҚ",
        description: "Столичный батальон охраны", description_uz_latn: "Poytaxt qo'riqlash batalyoni", description_uz_cyrl: "Пойтахт қўриқлаш батальони",
        specializationId: 1001, status: "active"
    },
    {
        id: 34, stateId: "00034", stateNumber: "01/034",
        name: "Воинская часть 00034", name_uz_latn: "00034 harbiy qism", name_uz_cyrl: "00034 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Ангрен", location_uz_latn: "Angren sh.", location_uz_cyrl: "Ангрен ш.",
        district: "КВ ОКО", district_uz_latn: "TOQQ", district_uz_cyrl: "ТОҚҚ",
        description: "Охрана энергетических объектов", description_uz_latn: "Energetika obyektlarini qo'riqlash", description_uz_cyrl: "Энергетика объектларини қўриқлаш",
        specializationId: 1001, status: "active"
    },
    {
        id: 35, stateId: "00035", stateNumber: "01/035",
        name: "Воинская часть 00035", name_uz_latn: "00035 harbiy qism", name_uz_cyrl: "00035 ҳарбий қисм",
        type: "Отдельный отряд", type_uz_latn: "Alohida otryad", type_uz_cyrl: "Алоҳида отряд",
        location: "г. Мубарек", location_uz_latn: "Muborak sh.", location_uz_cyrl: "Муборак ш.",
        district: "КВ ОКО", district_uz_latn: "TOQQ", district_uz_cyrl: "ТОҚҚ",
        description: "Охрана газовых месторождений", description_uz_latn: "Gaz konlarini qo'riqlash", description_uz_cyrl: "Газ конларини қўриқлаш",
        specializationId: 1001, status: "active"
    },
];

export const controlAuthorities = {
    "КРУ МО РУ": {
        name: "Контрольно-ревизионное управление МО РУ",
        name_uz_latn: "O'zR MV Nazorat-taftish boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Назорат-тафтиш бошқармаси",
        short_name_uz_latn: "O'zR MV NTB",
        short_name_uz_cyrl: "ЎзР МВ НТБ"
    },
    "ГУБП ГШ ВС РУ": {
        name: "Главное управление боевой подготовки ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Jangovar tayyorgarlik bosh boshqarmasi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Жанговар тайёргарлик бош бошқармаси",
        short_name_uz_latn: "O'zR QK BSh JTBB",
        short_name_uz_cyrl: "ЎзР ҚК БШ ЖТББ"
    },
    "ВОЙСКА ПВО К ВПВО И ВВС МО РУ": {
        name: "Войска противовоздушной обороны командования Войск ПВО и ВВС МО РУ",
        name_uz_latn: "O'zR MV HHM va HHK qo'mondonligining Havo hujumidan mudofaa qo'shinlari",
        name_uz_cyrl: "ЎзР МВ ҲҲМ ва ҲҲК қўмондонлигининг Ҳаво ҳужумидан мудофаа қўшинлари",
        short_name_uz_latn: "HHM qo'shinlari",
        short_name_uz_cyrl: "ҲҲМ қўшинлари"
    },
    "УВВС К ВПВО И ВВС МО РУ": {
        name: "Управление военно-воздушных сил командования Войск ПВО и ВВС МО РУ",
        name_uz_latn: "O'zR MV HHM va HHK qo'mondonligining Harbiy havo kuchlari boshqarmasi",
        name_uz_cyrl: "ЎзР МВ ҲҲМ ва ҲҲК қўмондонлигининг Ҳарбий ҳаво кучлари бошқармаси",
        short_name_uz_latn: "HHK Boshqarmasi",
        short_name_uz_cyrl: "ҲҲК Бошқармаси"
    },
    "ОФПИС ГУБП ГШ ВС РУ": {
        name: "Отдел физической подготовки и спорта ГУБП ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi JTBX jismoniy tayyorgarlik va sport bo'limi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби ЖТБХ жисмоний тайёргарлик ва спорт бўлими",
        short_name_uz_latn: "JTSB",
        short_name_uz_cyrl: "ЖТСБ"
    },
    "ОПВО СВ ГШ ВС РУ": {
        name: "Отдел противовоздушной обороны Сухопутных войск ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Quruqlikdagi qo'shinlar HHM bo'limi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Қуруқликдаги қўшинлар ҲҲМ бўлими",
        short_name_uz_latn: "QQ HHM bo'limi",
        short_name_uz_cyrl: "ҚҚ ҲҲМ бўлими"
    },
    "ОВДП УБП ГУБП ГШ ВС РУ": {
        name: "Отдел воздушно-десантной подготовки УБП ГУБП ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi JTBX JTB havo-desant tayyorgarligi bo'limi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби ЖТБХ ЖТБ ҳаво-десант тайёргарлиги бўлими",
        short_name_uz_latn: "HDT bo'limi",
        short_name_uz_cyrl: "ҲДТ бўлими"
    },
    "ГОМУ ГШ ВС РУ": {
        name: "Главное организационно-мобилизационное управление ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Bosh tashkiliy-safarbarlik boshqarmasi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Бош ташкилий-сафарбарлик бошқармаси",
        short_name_uz_latn: "BTSB",
        short_name_uz_cyrl: "БТСБ"
    },
    "8 УПРАВЛЕНИЕ ГШ ВС РУ": {
        name: "Восьмое управление ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Sakkizinchi boshqarmasi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Саккизинчи бошқармаси",
        short_name_uz_latn: "8-Boshqarma",
        short_name_uz_cyrl: "8-Бошқарма"
    },
    "ОТО ГШ ВС РУ": {
        name: "Отдел топографического обеспечения ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Topografik ta'minot bo'limi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Топографик таъминот бўлими",
        short_name_uz_latn: "Topografik ta'minot",
        short_name_uz_cyrl: "Топографик таъминот"
    },
    "В/Ч 29543": {
        name: "Войсковая часть 29543",
        name_uz_latn: "29543-sonli harbiy qism",
        name_uz_cyrl: "29543-сонли ҳарбий қисм",
        short_name_uz_latn: "29543-HQ",
        short_name_uz_cyrl: "29543-ҲҚ"
    },
    "УВП ГШ ВС РУ": {
        name: "Управление военного правопорядка ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Harbiy huquq-tartibot boshqarmasi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Ҳарбий ҳуқуқ-тартибот бошқармаси",
        short_name_uz_latn: "HqB",
        short_name_uz_cyrl: "ҲқБ"
    },
    "ГУВИР МО РУ": {
        name: "Главное управление воспитательной и идеологической работы МО РУ",
        name_uz_latn: "O'zR MV Tarbiyaviy va mafkuraviy ishlar bosh boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Тарбиявий ва мафкуравий ишлар бош бошқармаси",
        short_name_uz_latn: "TMIBB",
        short_name_uz_cyrl: "ТМИББ"
    },
    "ОВ РХБЗ ГШ ВС РУ": {
        name: "Отдел войск радиационной, химической и биологической защиты ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Radiatsion, kimyoviy va biologik muhofaza qo'shinlari bo'limi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Радиацион, кимёвий ва биологик муҳофаза қўшинлари бўлими",
        short_name_uz_latn: "RKB himoya",
        short_name_uz_cyrl: "РКБ ҳимоя"
    },
    "ГУСИТЗИ ГШ ВС РУ": {
        name: "Главное управление связи, информационных технологий и защиты информации ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Aloqa, axborot texnologiyalari va axborotni himoya qilish bosh boshqarmasi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Алоқа, ахборот технологиялари ва ахборотни ҳимоя қилиш бош бошқармаси",
        short_name_uz_latn: "AAT va AHQBB",
        short_name_uz_cyrl: "ААТ ва АҲҚББ"
    },
    "УАТ ГУВ МО РУ": {
        name: "Управление автомобильной техники ГУВ МО РУ",
        name_uz_latn: "O'zR MV QXBB Avtotransport texnikasi boshqarmasi",
        name_uz_cyrl: "ЎзР МВ ҚХББ Автотранспорт техникаси бошқармаси",
        short_name_uz_latn: "Avtotransport",
        short_name_uz_cyrl: "Автотранспорт"
    },
    "УРАВ ГУВ МО РУ": {
        name: "Управление ракетно-артиллерийского вооружения ГУВ МО РУ",
        name_uz_latn: "O'zR MV QXBB Raketa-artilleriya qurollanishi boshqarmasi",
        name_uz_cyrl: "ЎзР МВ ҚХББ Ракета-артиллерия қуролланиши бошқармаси",
        short_name_uz_latn: "RAQ",
        short_name_uz_cyrl: "РАҚ"
    },
    "УБТВТ ГУВ МО РУ": {
        name: "Управление бронетанкового вооружения и техники ГУВ МО РУ",
        name_uz_latn: "O'zR MV QXBB Zirhli tank qurollari va texnikasi boshqarmasi",
        name_uz_cyrl: "ЎзР МВ ҚХББ Зирҳли танк қуроллари ва техникаси бошқармаси",
        short_name_uz_latn: "ZTQ va T",
        short_name_uz_cyrl: "ЗТҚ ва Т"
    },
    "ОИВ ГШ ВС РУ": {
        name: "Отдел инженерных войск ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Muhandislik qo'shinlari bo'limi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Муҳандислик қўшинлари бўлими",
        short_name_uz_latn: "Muhandislik qo'shinlari",
        short_name_uz_cyrl: "Муҳандислик қўшинлари"
    },
    "ГФЭУ МО РУ": {
        name: "Главное финансово-экономическое управление МО РУ",
        name_uz_latn: "O'zR MV Bosh moliya-iqtisod boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Бош молия-иқтисод бошқармаси",
        short_name_uz_latn: "BMIB",
        short_name_uz_cyrl: "БМИБ"
    },
    "УПВК МО РУ": {
        name: "Управление подготовки военных кадров МО РУ",
        name_uz_latn: "O'zR MV Harbiy kadrlarni tayyorlash boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Ҳарбий кадрларни тайёрлаш бошқармаси",
        short_name_uz_latn: "HKTB",
        short_name_uz_cyrl: "ҲКТБ"
    },
    "ОСМС МО РУ": {
        name: "Отдел стандартизации, метрологии и сертификации МО РУ",
        name_uz_latn: "O'zR MV Standartlashtirish, metrologiya va sertifikatlashtirish bo'limi",
        name_uz_cyrl: "ЎзР МВ Стандартлаштириш, метрология ва сертификатлаштириш бўлими",
        short_name_uz_latn: "SMS bo'limi",
        short_name_uz_cyrl: "СМС бўлими"
    },
    "УО ГСМ ГУМТО МО РУ": {
        name: "Управление обеспечения ГСМ ГУМТО МО РУ",
        name_uz_latn: "O'zR MV MTBB YoMM ta'minoti boshqarmasi",
        name_uz_cyrl: "ЎзР МВ МТББ ЁММ таъминоти бошқармаси",
        short_name_uz_latn: "YoMM ta'minoti",
        short_name_uz_cyrl: "ЁММ таъминоти"
    },
    "УМО МО РУ": {
        name: "Управление медицинского обеспечения МО РУ",
        name_uz_latn: "O'zR MV Tibbiy ta'minot boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Тиббий таъминот бошқармаси",
        short_name_uz_latn: "Tibbiy ta'minot",
        short_name_uz_cyrl: "Тиббий таъминот"
    },
    "УПО ГУМТО МО РУ": {
        name: "Управление продовольственного обеспечения ГУМТО МО РУ",
        name_uz_latn: "O'zR MV MTBB Oziq-ovqat ta'minoti boshqarmasi",
        name_uz_cyrl: "ЎзР МВ МТББ Озиқ-овқат таъминоти бошқармаси",
        short_name_uz_latn: "Oziq-ovqat ta'minoti",
        short_name_uz_cyrl: "Озиқ-овқат таъминоти"
    },
    "УVO ГУМТО МО РУ": {
        name: "Управление вещевого обеспечения ГУМТО МО РУ",
        name_uz_latn: "O'zR MV MTBB Ashyoviy ta'minot boshqarmasi",
        name_uz_cyrl: "ЎзР МВ МТББ Ашёвий таъминоти бошқармаси",
        short_name_uz_latn: "Ashyoviy ta'minot",
        short_name_uz_cyrl: "Ашёвий таъминот"
    },
    "УВС МО РУ": {
        name: "Управление военных сообщений МО РУ",
        name_uz_latn: "O'zR MV Harbiy aloqa yo'llari boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Ҳарбий алоқа йўллари бошқармаси",
        short_name_uz_latn: "HAYB (VOSO)",
        short_name_uz_cyrl: "ҲАЙБ (ВОСО)"
    },
    "ВС ГУМТО МО РУ": {
        name: "Ветеринарная служба ГУМТО МО РУ",
        name_uz_latn: "O'zR MV MTBB Veterinariya xizmati",
        name_uz_cyrl: "ЎзР МВ МТББ Ветеринария хизмати",
        short_name_uz_latn: "Veterinariya",
        short_name_uz_cyrl: "Ветеринария"
    },
    "КЭУ ДО ЦА МО РУ": {
        name: "Квартирно-эксплуационное управление Департамента обеспечения (ЦА МО РУ)",
        name_uz_latn: "O'zR MV Ta'minot departamenti Uy-joydan foydalanish boshqarmasi",
        name_uz_cyrl: "ЎзР МВ Таъминот департаменти Уй-жойдан фойдаланиш бошқармаси",
        short_name_uz_latn: "KEO (UJFB)",
        short_name_uz_cyrl: "КЭО (УЖФБ)"
    },
    "ГЦИ ГШ ВС РУ": {
        name: "Главный центр информатизации ГШ ВС РУ",
        name_uz_latn: "O'zR QK Bosh shtabi Bosh axborotlashtirish markazi",
        name_uz_cyrl: "ЎзР ҚК Бош штаби Бош ахборотлаштириш маркази",
        short_name_uz_latn: "BAM",
        short_name_uz_cyrl: "БАМ"
    },
    "СЕЗ ДО ЦА МО РУ": {
        name: "Служба единого заказчика Департамента обеспечения (ЦА МО РУ)",
        name_uz_latn: "O'zR MV Ta'minot departamenti Yagona buyurtmachi xizmati",
        name_uz_cyrl: "ЎзР МВ Таъминот департаменти Ягона буюртмачи хизмати",
        short_name_uz_latn: "YBX",
        short_name_uz_cyrl: "ЯБХ"
    },
};

export const controlDirections: ControlDirection[] = [
    {
        id: 1,
        code: "FIN",
        name: "Финансово-хозяйственная деятельность",
        name_uz_latn: "Moliya-xo'jalik faoliyati",
        name_uz_cyrl: "Молия-хўжалик фаолияти",
        description: "Контроль финансовых операций и расходов",
        status: "active",
    },
    {
        id: 2,
        code: "SUP",
        name: "Материально-техническое обеспечение",
        name_uz_latn: "Moddiy-texnik ta'minot",
        name_uz_cyrl: "Моддий-техник таъминот",
        description: "Контроль снабжения",
        status: "active",
    },
    {
        id: 3,
        code: "PERS",
        name: "Кадровая работа и воспитательная деятельность",
        name_uz_latn: "Kadrlar bilan ishlash va tarbiyaviy faoliyat",
        name_uz_cyrl: "Кадрлар билан ишлаш ва тарбиявий фаолият",
        description: "Контроль кадровой работы",
        status: "active",
    },
    {
        id: 4,
        code: "IT",
        name: "Связь, ИТ и защита информации",
        name_uz_latn: "Aloqa, AT va axborotni himoya qilish",
        name_uz_cyrl: "Алоқа, АТ ва ахборотни ҳимоя қилиш",
        description: "Контроль связи и ИТ",
        status: "active",
    },
    {
        id: 5,
        code: "MED",
        name: "Медицинское обеспечение",
        name_uz_latn: "Tibbiy ta'minot",
        name_uz_cyrl: "Тиббий таъминот",
        status: "active",
    },
    {
        id: 6,
        code: "TRAIN",
        name: "Боевая и специальная подготовка",
        name_uz_latn: "Jangovar va maxsus tayyorgarlik",
        name_uz_cyrl: "Жанговар ва махсус тайёргарлик",
        status: "active",
    },
    {
        id: 7,
        code: "CORR",
        name: "Антикоррупционная деятельность",
        name_uz_latn: "Antikorrupsiya faoliyati",
        name_uz_cyrl: "Антикоррупция фаолияти",
        status: "active",
    },
    // Краткие версии для сопоставления с мок-данными
    {
        id: 8,
        code: "FIN_S",
        name: "Финансово-хозяйственная",
        name_uz_latn: "Moliya-xo'jalik",
        name_uz_cyrl: "Молия-хўжалик",
        status: "active",
    },
    {
        id: 9,
        code: "SUP_S",
        name: "Материально-техническая",
        name_uz_latn: "Moddiy-texnik",
        name_uz_cyrl: "Моддий-техник",
        status: "active",
    },
    {
        id: 10,
        code: "PERS_S",
        name: "Кадровая работа",
        name_uz_latn: "Kadrlar bilan ishlash",
        name_uz_cyrl: "Кадрлар билан ишлаш",
        status: "active",
    },
    {
        id: 11,
        code: "TRAIN_S",
        name: "Боевая подготовка",
        name_uz_latn: "Jangovar tayyorgarlik",
        name_uz_cyrl: "Жанговар тайёргарлик",
        status: "active",
    },
    {
        id: 12,
        code: "FIN_ACT",
        name: "Финансовая деятельность",
        name_uz_latn: "Moliyaviy faoliyat",
        name_uz_cyrl: "Молиявий фаолият",
        status: "active",
    },
    {
        id: 13,
        code: "FOOD",
        name: "Продовольственная",
        name_uz_latn: "Oziq-ovqat ta'minoti",
        name_uz_cyrl: "Озиқ-овқат таъминоти",
        description: "Продовольственное обеспечение",
        status: "active",
    },
    {
        id: 14,
        code: "CLOTH",
        name: "Вещевая",
        name_uz_latn: "Ashyoviy ta'minot",
        name_uz_cyrl: "Ашёвий таъминот",
        description: "Вещевое обеспечение",
        status: "active",
    },
    {
        id: 15,
        code: "AUTO",
        name: "Автомобильная",
        name_uz_latn: "Avtomobil texnikasi",
        name_uz_cyrl: "Автомобил техникаси",
        description: "Автомобильная техника",
        status: "active",
    },
    {
        id: 16,
        code: "WEAP",
        name: "Вооружение",
        name_uz_latn: "Qurollanish",
        name_uz_cyrl: "Қуролланиш",
        description: "Ракетно-артиллерийское вооружение",
        status: "active",
    },
    {
        id: 17,
        code: "ANTICOR",
        name: "Антикоррупционная",
        name_uz_latn: "Antikorrupsiya",
        name_uz_cyrl: "Антикоррупция",
        description: "Противодействие коррупции",
        status: "active",
    },
    {
        id: 18,
        code: "EDU",
        name: "Воспитательная",
        name_uz_latn: "Tarbiyaviy ish",
        name_uz_cyrl: "Тарбиявий иш",
        description: "Воспитательная работа",
        status: "active",
    },
    {
        id: 19,
        code: "INFOSEC",
        name: "СЗИ",
        name_uz_latn: "Axborot himoyasi",
        name_uz_cyrl: "Ахборот ҳимояси",
        description: "Защита информации",
        status: "active",
    },
    {
        id: 20,
        code: "BUDGET",
        name: "Бюджетная",
        name_uz_latn: "Byudjet ijrosi",
        name_uz_cyrl: "Бюджет ижроси",
        description: "Исполнение бюджета",
        status: "active",
    },
    {
        id: 21,
        code: "COMM",
        name: "Связь и ИТ",
        name_uz_latn: "Aloqa va AT",
        name_uz_cyrl: "Алоқа ва АТ",
        description: "Информационные технологии и защита информации",
        status: "active",
    },
    {
        id: 22,
        code: "MED_ACT",
        name: "Медицинская деятельность",
        name_uz_latn: "Tibbiy faoliyat",
        name_uz_cyrl: "Тиббий фаолият",
        description: "Медицинское обеспечение",
        status: "active",
    },
];
