export const classifiersData = [
    {
        id: 1, type: "inspection_status",
        values: [
            { id: 101, name: "Запланирована", name_uz_cyrl: "Режалаштирилган", name_uz_latn: "Rejalashtirilgan" },
            { id: 102, name: "В работе", name_uz_cyrl: "Жараёнда", name_uz_latn: "Jarayonda" },
            { id: 103, name: "Приостановлена", name_uz_cyrl: "Тўхтатилган", name_uz_latn: "To'xtatilgan" },
            { id: 104, name: "Завершена", name_uz_cyrl: "Якунланган", name_uz_latn: "Yakunlangan" },
            { id: 105, name: "Отменена", name_uz_cyrl: "Бекор қилинган", name_uz_latn: "Bekor qilingan" },
        ],
    },
    {
        id: 2, type: "audit_type",
        values: [
            { id: 201, name: "Финансовая", name_uz_cyrl: "Молиявий", name_uz_latn: "Moliyaviy" },
            { id: 202, name: "Хозяйственная", name_uz_cyrl: "Хўжалик", name_uz_latn: "Xo'jalik" },
            { id: 203, name: "Документальная", name_uz_cyrl: "Ҳужжатли", name_uz_latn: "Hujjatli" },
            { id: 204, name: "Комплексная", name_uz_cyrl: "Комплекс", name_uz_latn: "Kompleks" },
            { id: 205, name: "Тематическая", name_uz_cyrl: "Мавзуий", name_uz_latn: "Mavzuiy" },
            { id: 206, name: "Внеплановая", name_uz_cyrl: "Режадан ташқари", name_uz_latn: "Rejadan tashqari" },
        ],
    },
    {
        id: 3, type: "severity_level",
        values: [
            { id: 301, name: "Низкая", name_uz_cyrl: "Паст", name_uz_latn: "Past" },
            { id: 302, name: "Средняя", name_uz_cyrl: "Ўрта", name_uz_latn: "O'rta" },
            { id: 303, name: "Высокая", name_uz_cyrl: "Юқори", name_uz_latn: "Yuqori" },
            { id: 304, name: "Критическая", name_uz_cyrl: "Критик", name_uz_latn: "Kritik" },
        ],
    },
    {
        id: 4, type: "violation_status",
        values: [
            { id: 401, name: "Выявлено", name_uz_cyrl: "Аниқланган", name_uz_latn: "Aniqlangan" },
            { id: 402, name: "На рассмотрении", name_uz_cyrl: "Кўриб чиқилмоқда", name_uz_latn: "Ko'rib chiqilmoqda" },
            { id: 403, name: "Подтверждено", name_uz_cyrl: "Тасдиқланган", name_uz_latn: "Tasdiqlangan" },
            { id: 404, name: "Устранено", name_uz_cyrl: "Бартараф этилган", name_uz_latn: "Bartaraf etilgan" },
            { id: 405, name: "Не подтверждено", name_uz_cyrl: "Тасдиқланмаган", name_uz_latn: "Tasdiqlanmagan" },
        ],
    },
    {
        id: 5, type: "decision_status",
        values: [
            { id: 501, name: "Принято", name_uz_cyrl: "Қабул қилинган", name_uz_latn: "Qabul qilingan" },
            { id: 502, name: "В работе", name_uz_cyrl: "Жараёнда", name_uz_latn: "Jarayonda" },
            { id: 503, name: "Частично исполнено", name_uz_cyrl: "Қисман бажарилган", name_uz_latn: "Qisman bajarilgan" },
            { id: 504, name: "Исполнено", name_uz_cyrl: "Бажарилган", name_uz_latn: "Bajarilgan" },
            { id: 505, name: "Просрочено", name_uz_cyrl: "Муддати ўтган", name_uz_latn: "Muddati o'tgan" },
        ],
    },
    {
        id: 6, type: "military_rank",
        values: [
            { id: 601, name: "Рядовой", name_uz_cyrl: "Оддий аскар", name_uz_latn: "Oddiy askar", compositionId: 1101, type: "army" },
            { id: 602, name: "Матрос", name_uz_cyrl: "Матрос", name_uz_latn: "Matros", compositionId: 1101, type: "navy" },
            { id: 603, name: "Сержант III степени", name_uz_cyrl: "III даражали сержант", name_uz_latn: "III darajali serjant", compositionId: 1102, type: "army" },
            { id: 604, name: "Сержант II степени", name_uz_cyrl: "II даражали сержант", name_uz_latn: "II darajali serjant", compositionId: 1102, type: "army" },
            { id: 605, name: "Сержант I степени", name_uz_cyrl: "I даражали сержант", name_uz_latn: "I darajali serjant", compositionId: 1102, type: "army" },
            { id: 606, name: "Старший сержант", name_uz_cyrl: "Катта сержант", name_uz_latn: "Katta serjant", compositionId: 1102, type: "army" },
            { id: 607, name: "Старшина", name_uz_cyrl: "Старшина", name_uz_latn: "Starshina", compositionId: 1102, type: "navy" },
            { id: 613, name: "Лейтенант", name_uz_cyrl: "Лейтенант", name_uz_latn: "Leytenant", compositionId: 1103, type: "army" },
            { id: 614, name: "Старший лейтенант", name_uz_cyrl: "Катта лейтенант", name_uz_latn: "Katta leytenant", compositionId: 1103, type: "army" },
            { id: 615, name: "Капитан", name_uz_cyrl: "Капитан", name_uz_latn: "Kapitan", compositionId: 1103, type: "army" },
            { id: 616, name: "Капитан-лейтенант", name_uz_cyrl: "Капитан-лейтенант", name_uz_latn: "Kapitan-leytenant", compositionId: 1103, type: "navy" },
            { id: 617, name: "Майор", name_uz_cyrl: "Майор", name_uz_latn: "Mayor", compositionId: 1104, type: "army" },
            { id: 618, name: "Капитан 3-го ранга", name_uz_cyrl: "III ранг капитани", name_uz_latn: "III rang kapitani", compositionId: 1104, type: "navy" },
            { id: 619, name: "Подполковник", name_uz_cyrl: "Подполковник", name_uz_latn: "Podpolkovnik", compositionId: 1104, type: "army" },
            { id: 620, name: "Капитан 2-го ранга", name_uz_cyrl: "II ранг капитани", name_uz_latn: "II rang kapitani", compositionId: 1104, type: "navy" },
            { id: 621, name: "Полковник", name_uz_cyrl: "Полковник", name_uz_latn: "Polkovnik", compositionId: 1104, type: "army" },
            { id: 622, name: "Капитан 1-го ранга", name_uz_cyrl: "I ранг капитани", name_uz_latn: "I rang kapitani", compositionId: 1104, type: "navy" },
            { id: 625, name: "Генерал-майор", name_uz_cyrl: "Генерал-майор", name_uz_latn: "General-mayor", compositionId: 1105, type: "army" },
            { id: 626, name: "Контр-адмирал", name_uz_cyrl: "Контр-адмирал", name_uz_latn: "Kontr-admiral", compositionId: 1105, type: "navy" },
            { id: 627, name: "Генерал-лейтенант", name_uz_cyrl: "Генерал-лейтенант", name_uz_latn: "General-leytenant", compositionId: 1105, type: "army" },
            { id: 628, name: "Вице-адмирал", name_uz_cyrl: "Вице-адмирал", name_uz_latn: "Vitse-admiral", compositionId: 1105, type: "navy" },
            { id: 629, name: "Генерал-полковник", name_uz_cyrl: "Генерал-полковник", name_uz_latn: "General-polkovnik", compositionId: 1105, type: "army" },
            { id: 630, name: "Адмирал", name_uz_cyrl: "Адмирал", name_uz_latn: "Admiral", compositionId: 1105, type: "navy" },
            { id: 631, name: "Генерал армии", name_uz_cyrl: "Армия генерали", name_uz_latn: "Armiya generali", compositionId: 1105, type: "army" },
        ],
    },
    {
        id: 7, type: "unit_type",
        values: [
            { id: 701, name: "Бригада", name_uz_cyrl: "Бригада", name_uz_latn: "Brigada" },
            { id: 702, name: "Отдельный батальон", name_uz_cyrl: "Алоҳида батальон", name_uz_latn: "Alohida batalyon" },
            { id: 703, name: "Отдельный отряд", name_uz_cyrl: "Алоҳида отряд", name_uz_latn: "Alohida otryad" },
            { id: 704, name: "Учебный центр", name_uz_cyrl: "Ўқув маркази", name_uz_latn: "O'quv markazi" },
            { id: 705, name: "ВВОУ (Академия)", name_uz_cyrl: "ОҲҲЮ (Академия)", name_uz_latn: "O'HHYu (Akademiya)" },
            { id: 706, name: "Управление", name_uz_cyrl: "Бошқарма", name_uz_latn: "Boshqarma" },
        ],
    },
    {
        id: 8, type: "gender",
        values: [
            { id: 801, name: "Мужской", name_uz_cyrl: "Эркак", name_uz_latn: "Erkak" },
            { id: 802, name: "Женский", name_uz_cyrl: "Аёл", name_uz_latn: "Ayol" },
        ],
    },
    {
        id: 9, type: "nationality",
        values: [
            { id: 901, name: "Узбек", name_uz_cyrl: "Ўзбек", name_uz_latn: "O'zbek" },
            { id: 902, name: "Таджик", name_uz_cyrl: "Тожик", name_uz_latn: "Tojik" },
            { id: 903, name: "Казах", name_uz_cyrl: "Қозоқ", name_uz_latn: "Qozoq" },
            { id: 904, name: "Каракалпак", name_uz_cyrl: "Қoraqalpoq", name_uz_latn: "Qoraqalpoq" },
            { id: 905, name: "Русский", name_uz_cyrl: "Рус", name_uz_latn: "Rus" },
        ],
    },
    {
        id: 11, type: "personnel_composition",
        values: [
            { id: 1101, name: "Рядовой состав", name_uz_cyrl: "Оддий аскарлар таркиби", name_uz_latn: "Oddiy askarlar tarkibi" },
            { id: 1102, name: "Сержантский состав", name_uz_cyrl: "Сержантлар таркиби", name_uz_latn: "Serjantlar tarkibi" },
            { id: 1103, name: "Младший офицерский состав", name_uz_cyrl: "Кичик офицерлар таркиби", name_uz_latn: "Kichik ofitserlar tarkibi" },
            { id: 1104, name: "Старший офицерский состав", name_uz_cyrl: "Катта офицерлар таркиби", name_uz_latn: "Katta ofitserlar tarkibi" },
            { id: 1105, name: "Генеральский состав", name_uz_cyrl: "Генераллар таркиби", name_uz_latn: "Generallar tarkibi" },
        ],
    },
    {
        id: 13, type: "military_position",
        values: [
            { id: 1301, name: "Командир части", name_uz_cyrl: "Қисм командири", name_uz_latn: "Qism komandiri" },
            { id: 1302, name: "Начальник штаба", name_uz_cyrl: "Штаб бошлиғи", name_uz_latn: "Shtab boshlig'i" },
            { id: 1303, name: "Заместитель командира", name_uz_cyrl: "Командир ўринбосари", name_uz_latn: "Komandir o'rinbosari" },
            { id: 1309, name: "Инспектор", name_uz_cyrl: "Инспектор", name_uz_latn: "Inspektor" },
        ],
    },
    {
        id: 15, type: "funding_source",
        values: [
            { id: 1501, name: "Республиканский бюджет", name_uz_cyrl: "Республика бюджети", name_uz_latn: "Respublika byudjeti" },
            { id: 1502, name: "Внебюджетные средства", name_uz_cyrl: "Бюджетдан ташқари маблағлар", name_uz_latn: "Byudjetdan tashqari mablag'lar" },
        ],
    },
    {
        id: 16, type: "tmc_type",
        values: [
            { id: 1601, name: "Вооружение и техника", name_uz_cyrl: "Қурол-ярағ ва техника", name_uz_latn: "Qurol-yarag' va texnika" },
            { id: 1602, name: "ГСМ", name_uz_cyrl: "Ёнилғи-мойлаш материаллари", name_uz_latn: "Yonilg'i-moylash materiallari" },
            { id: 1603, name: "Продовольствие", name_uz_cyrl: "Озиқ-овқат таъминоти", name_uz_latn: "Oziq-ovqat ta'minoti" },
            { id: 1604, name: "Вещевое имущество", name_uz_cyrl: "Кийим-кечак мулки", name_uz_latn: "Kiyim-kechak mulki" },
        ],
    },
    {
        id: 22, type: "audit_object",
        values: [
            { id: 2201, name: "Финансовая деятельность", name_uz_cyrl: "Молиявий фаолият", name_uz_latn: "Moliyaviy faoliyat" },
            { id: 2202, name: "Хозяйственная деятельность", name_uz_cyrl: "Хўжалик фаолияти", name_uz_latn: "Xo'jalik faoliyati" },
            { id: 2203, name: "Капитальное строительство", name_uz_cyrl: "Капитал қурилиш", name_uz_latn: "Kapital qurilish" },
        ],
    },
    {
        id: 10, type: "specialization",
        values: [
            { id: 1001, name: "Общевойсковая", name_uz_cyrl: "Умумқўшин", name_uz_latn: "Umumqo'shin" },
            { id: 1002, name: "Танковая", name_uz_cyrl: "Танк", name_uz_latn: "Tank" },
            { id: 1003, name: "Артиллерийская", name_uz_cyrl: "Артиллерия", name_uz_latn: "Artilleriya" },
            { id: 1004, name: "Десантная", name_uz_cyrl: "Десант", name_uz_latn: "Desant" },
            { id: 1005, name: "Инженерная", name_uz_cyrl: "Муҳандислик", name_uz_latn: "Muhandislik" },
            { id: 1006, name: "Связи", name_uz_cyrl: "Алоқа", name_uz_latn: "Aloqa" },
            { id: 1007, name: "Медицинская", name_uz_cyrl: "Тиббиёт", name_uz_latn: "Tibbiyot" },
            { id: 1008, name: "Химическая", name_uz_cyrl: "Кимёвий", name_uz_latn: "Kimyoviy" },
        ],
    },
    {
        id: 17, type: "violation_cause",
        values: [
            { id: 1701, name: "Незнание нормативных актов", name_uz_cyrl: "Норматив ҳужжатларни билмаслик", name_uz_latn: "Normativ hujjatlarni bilmaslik" },
            { id: 1702, name: "Халатность", name_uz_cyrl: "Лоқайдлик", name_uz_latn: "Loqaydlik" },
            { id: 1703, name: "Злоупотребление", name_uz_cyrl: "Суиистеъмол қилиш", name_uz_latn: "Suiiste'mol qilish" },
            { id: 1704, name: "Ошибки учета", name_uz_cyrl: "Хисобдаги хатоликлар", name_uz_latn: "Hisobdagi xatoliklar" },
        ],
    },
    {
        id: 18, type: "education_level",
        values: [
            { id: 1801, name: "Среднее общее", name_uz_cyrl: "Умумий ўрта", name_uz_latn: "Umumiy o'rta" },
            { id: 1802, name: "Среднее специальное", name_uz_cyrl: "Ўрта махсус", name_uz_latn: "O'rta maxsus" },
            { id: 1803, name: "Высшее гражданское", name_uz_cyrl: "Олий фуқаролик", name_uz_latn: "Oliy fuqarolik" },
            { id: 1804, name: "Высшее военное", name_uz_cyrl: "Олий ҳарбий", name_uz_latn: "Oliy harbiy" },
            { id: 1805, name: "Академическое (послевузовское)", name_uz_cyrl: "Академик (Олийгоҳдан кейинги)", name_uz_latn: "Akademik (Oliygohdan keyingi)" },
        ],
    },
    {
        id: 19, type: "security_clearance",
        values: [
            { id: 1901, name: "Первая форма", name_uz_cyrl: "Биринчи шакл", name_uz_latn: "Birinchi shakl" },
            { id: 1902, name: "Вторая форма", name_uz_cyrl: "Иккинчи шакл", name_uz_latn: "Ikkinchi shakl" },
            { id: 1903, name: "Третья форма", name_uz_cyrl: "Учинчи шакл", name_uz_latn: "Uchinchi shakl" },
            { id: 1904, name: "Без допуска", name_uz_cyrl: "Рухсатномасиз", name_uz_latn: "Ruxsatnomasiz" },
        ],
    },
    {
        id: 12, type: "unit_name",
        values: [
            { id: 1201, name: "Командование", name_uz_cyrl: "Қўмондонлик", name_uz_latn: "Qo'mondonlik" },
            { id: 1202, name: "Штаб", name_uz_cyrl: "Штаб", name_uz_latn: "Shtab" },
            { id: 1203, name: "Батальон", name_uz_cyrl: "Батальон", name_uz_latn: "Batalyon" },
            { id: 1204, name: "Рота", name_uz_cyrl: "Рота", name_uz_latn: "Rota" },
            { id: 1205, name: "Взвод", name_uz_cyrl: "Взвод", name_uz_latn: "Vzvod" },
        ]
    },
    {
        id: 14, type: "vus",
        values: [
            { id: 140001, name: "Стрелок", name_uz_cyrl: "Ўқчи", name_uz_latn: "O'qchi" },
            { id: 140002, name: "Пулеметчик", name_uz_cyrl: "Пулеметчи", name_uz_latn: "Pulemetchi" },
            { id: 140003, name: "Снайпер", name_uz_cyrl: "Снайпер", name_uz_latn: "Snayper" },
            { id: 140004, name: "Разведчик", name_uz_cyrl: "Разведкачи", name_uz_latn: "Razvedkachi" },
            { id: 140005, name: "Сапер", name_uz_cyrl: "Сапер", name_uz_latn: "Saper" },
            { id: 140006, name: "Водитель", name_uz_cyrl: "Ҳайдовчи", name_uz_latn: "Haydovchi" },
            { id: 140007, name: "Механик", name_uz_cyrl: "Механик", name_uz_latn: "Mexanik" },
            { id: 140008, name: "Радиотелефонист", name_uz_cyrl: "Радиотелефонист", name_uz_latn: "Radiotelefonist" },
        ]
    },
    {
        id: 20, type: "fitness_category",
        values: [
            { id: 2001, name: "Годен (А)", name_uz_cyrl: "Яроқли (А)", name_uz_latn: "Yaroqli (A)" },
            { id: 2002, name: "Годен с ограничениями (Б)", name_uz_cyrl: "Чеклов билан яроқли (Б)", name_uz_latn: "Cheklov bilan yaroqli (B)" },
            { id: 2003, name: "Ограниченно годен (В)", name_uz_cyrl: "Чекланган ҳолда яроқли (В)", name_uz_latn: "Cheklangan holda yaroqli (V)" },
        ],
    },
    {
        id: 21, type: "conduct",
        values: [
            { id: 2101, name: "Выговор", name_uz_cyrl: "Ҳайфсан", name_uz_latn: "Hayfsan" },
            { id: 2102, name: "Строгий выговор", name_uz_cyrl: "Қаттиқ ҳайфсан", name_uz_latn: "Qattiq hayfsan" },
            { id: 2103, name: "Предупреждение", name_uz_cyrl: "Огоҳлантириш", name_uz_latn: "Ogohlantirish" },
            { id: 2104, name: "Понижение в должности", name_uz_cyrl: "Лавозимини пасайтириш", name_uz_latn: "Lavozimini pasaytirish" },
            { id: 2105, name: "Снижение звания", name_uz_cyrl: "Унвонини пасайтириш", name_uz_latn: "Unvonini pasaytirish" },
            { id: 2106, name: "Благодарность", name_uz_cyrl: "Миннатдорчилик", name_uz_latn: "Minnatdorchilik" },
            { id: 2107, name: "Грамота", name_uz_cyrl: "Фахрий ёрлиқ", name_uz_latn: "Faxriy yorliq" },
            { id: 2108, name: "Ценный подарок", name_uz_cyrl: "Қимматбаҳо совға", name_uz_latn: "Qimmatbaho sovg'a" },
            { id: 2109, name: "Досрочное звание", name_uz_cyrl: "Муддатидан олдин унвон", name_uz_latn: "Muddatidan oldin unvon" },
        ]
    },
    {
        id: 23, type: "inspection_type",
        values: [
            { id: 2301, name: "Камеральная проверка", name_uz_cyrl: "Камерал текширув", name_uz_latn: "Kameral tekshiruv" },
            { id: 2302, name: "Выездная проверка", name_uz_cyrl: "Сайёр текширув", name_uz_latn: "Sayyor tekshiruv" },
            { id: 2303, name: "Ревизия", name_uz_cyrl: "Тафтиш", name_uz_latn: "Taftish" },
            { id: 2304, name: "Инвентаризация", name_uz_cyrl: "Инвентаризация", name_uz_latn: "Inventarizatsiya" },
            { id: 2305, name: "Служебное расследование", name_uz_cyrl: "Хизмат текшируви", name_uz_latn: "Xizmat tekshiruvi" },
        ]
    },
    {
        id: 24, type: "control_type",
        values: [
            { id: 2401, name: "Предварительный контроль", name_uz_cyrl: "Дастлабки назорат", name_uz_latn: "Dastlabki nazorat" },
            { id: 2402, name: "Текущий контроль", name_uz_cyrl: "Жорий назорат", name_uz_latn: "Joriy nazorat" },
            { id: 2403, name: "Заключительный контроль", name_uz_cyrl: "Якуний назорат", name_uz_latn: "Yakuniy nazorat" },
            { id: 2404, name: "Внеплановый контроль", name_uz_cyrl: "Режадан ташқари назорат", name_uz_latn: "Rejadan tashqari nazorat" },
        ],
    },
    {
        id: 25, type: "document_type",
        values: [
            { id: 2501, name: "Приказ", name_uz_cyrl: "Буйруқ", name_uz_latn: "Buyruq" },
            { id: 2502, name: "Рапорт", name_uz_cyrl: "Билдирги", name_uz_latn: "Bildirgi" },
            { id: 2503, name: "Акт", name_uz_cyrl: "Далолатнома", name_uz_latn: "Dalolatnoma" },
            { id: 2504, name: "Протокол", name_uz_cyrl: "Баённома", name_uz_latn: "Bayonnoma" },
        ]
    },
    {
        id: 26, type: "inspection_kind",
        values: [
            { id: 2601, name: "Плановая", name_uz_cyrl: "Режали", name_uz_latn: "Rejali" },
            { id: 2602, name: "Внеплановая", name_uz_cyrl: "Режадан ташқари", name_uz_latn: "Rejadan tashqari" },
            { id: 2603, name: "Контрольная", name_uz_cyrl: "Назорат", name_uz_latn: "Nazorat" },
        ]
    },
    {
        id: 27, type: "budget_article",
        values: [
            { id: 2701, name: "Заработная плата", name_uz_cyrl: "Иш ҳақи", name_uz_latn: "Ish haqi" },
            { id: 2702, name: "Командировочные расходы", name_uz_cyrl: "Хизмат сафари харажатлари", name_uz_latn: "Xizmat safari xarajatlari" },
            { id: 2703, name: "Коммунальные услуги", name_uz_cyrl: "Коммунал тўловлар", name_uz_latn: "Kommunal to'lovlar" },
        ]
    },
    {
        id: 28, type: "control_direction",
        values: [
            { id: 2801, name: "Финансовый контроль", name_uz_cyrl: "Молиявий назорат", name_uz_latn: "Moliyaviy nazorat" },
            { id: 2802, name: "Тыловое обеспечение", name_uz_cyrl: "Орқа таъминот", name_uz_latn: "Orqa ta'minot" },
            { id: 2803, name: "Техническое обеспечение", name_uz_cyrl: "Техник таъминот", name_uz_latn: "Texnik ta'minot" },
        ]
    },
    {
        id: 29, type: "control_authority",
        values: [
            { id: 2901, name: "Министерство Обороны", name_uz_cyrl: "Мудофаа Вазирлиги", name_uz_latn: "Mudofaa Vazirligi" },
            { id: 2902, name: "Генеральная Прокуратура", name_uz_cyrl: "Бош Прокуратура", name_uz_latn: "Bosh Prokuratura" },
        ]
    },
    {
        id: 30, type: "violation_type", // For RefViolation table
        values: [
            { id: 3001, name: "Нецелевое использование средств", name_uz_cyrl: "Маблағлардан мақсадсиз фойдаланиш", name_uz_latn: "Mablag'lardan maqsadsiz foydalanish" },
            { id: 3002, name: "Недостача ТМЦ", name_uz_cyrl: "ТМБ камомади", name_uz_latn: "TMB kamomadi" },
            { id: 3003, name: "Нарушение порядка закупок", name_uz_cyrl: "Харид қилиш тартибини бузиш", name_uz_latn: "Xarid qilish tartibini buzish" },
        ]
    }
];
