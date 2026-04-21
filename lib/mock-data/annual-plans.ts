export const mockApprovedPlans = [
    {
        id: 1,
        planNumber: "ГП-2025-001",
        year: 2025,
        approvedBy: "Генерал-майор Кузнецов В.П.",
        approvedDate: "II квартал 2024",
        totalAudits: 45,
        document: "Приказ №125 от 15.12.2024",
        controlObject: "Воинская часть 00011",
        controlObjectSubtitle: "Ташкентский военный округ",
        controlAuthority: "ГФЭУ МО РУ",
        inspectionDirection: 8, // Финансово-хозяйственная (FIN_S)
        inspectionDirectionSubtitle: "Главное финансово-экономическое управление МО РУ",
        inspectionType: 2301, // Плановая
        status: 101, // Запланирована
        periodCoveredStart: "2024-01-01",
        periodCoveredEnd: "2024-12-31",
        subordinateUnitsOnAllowance: [
            { unitCode: "00013", unitName: "Воинская часть 00013", allowanceType: "full" },
            { unitCode: "00015", unitName: "Воинская часть 00015", allowanceType: "full" },
        ],
    },
    {
        id: 2,
        planNumber: "ГП-2024-012",
        year: 2024,
        approvedBy: "Генерал-майор Кузнецов В.П.",
        approvedDate: "III квартал 2024",
        totalAudits: 42,
        document: "Приказ №118 от 20.12.2023",
        controlObject: "Воинская часть 00016",
        controlObjectSubtitle: "Центральный военный округ",
        controlAuthority: "УВО ГУМТО МО РУ",
        inspectionDirection: 9, // Материально-техническая (SUP_S)
        inspectionDirectionSubtitle: "Управление материально-технического снабжения",
        inspectionType: 2301, // Плановая
        status: 101, // Запланирована
        periodCoveredStart: "2023-07-01",
        periodCoveredEnd: "2024-06-30",
        subordinateUnitsOnAllowance: []
    },
    {
        id: 3,
        planNumber: "ГП-2023-008",
        year: 2023,
        approvedBy: "Генерал-лейтенант Морозов А.А.",
        approvedDate: "IV квартал 2024",
        totalAudits: 38,
        document: "Приказ №112 от 18.12.2022",
        controlObject: "Воинская часть 00006",
        controlObjectSubtitle: "Восточный военный округ",
        controlAuthority: "УПВК МО РУ",
        inspectionDirection: 10, // Кадровая работа (PERS_S)
        inspectionDirectionSubtitle: "Управление кадров и воспитательной работы",
        inspectionType: 2302, // Внеплановая
        status: 104, // Завершена
        periodCoveredStart: "2022-01-01",
        periodCoveredEnd: "2023-12-31",
        subordinateUnitsOnAllowance: []
    },
    {
        id: 4,
        planNumber: "ГП-2023-009",
        year: 2023,
        approvedBy: "Генерал-лейтенант Морозов А.А.",
        approvedDate: "I квартал 2024",
        totalAudits: 38,
        document: "Приказ №112 от 18.12.2022",
        controlObject: "Воинская часть 00021",
        controlObjectSubtitle: "Северо-Западный военный округ",
        controlAuthority: "ГУБП ГШ ВС РУ",
        inspectionDirection: 11, // Боевая подготовка (TRAIN_S)
        inspectionDirectionSubtitle: "Главное управление боевой подготовки",
        inspectionType: 2301, // Плановая
        status: 104, // Завершена
        periodCoveredStart: "2023-01-01",
        periodCoveredEnd: "2023-06-30",
        subordinateUnitsOnAllowance: []
    },
    {
        id: 5,
        planNumber: "ГП-2023-010",
        year: 2023,
        approvedBy: "Генерал-лейтенант Морозов А.А.",
        approvedDate: "II квартал 2024",
        totalAudits: 38,
        document: "Приказ №112 от 18.12.2022",
        controlObject: "Воинская часть 00001",
        controlObjectSubtitle: "Юго-Западный особый военный округ",
        controlAuthority: "КРУ МО РУ",
        inspectionDirection: 12, // Финансовая деятельность (FIN_ACT)
        inspectionDirectionSubtitle: "Проверка финансовой отчетности",
        inspectionType: 2301, // Плановая
        status: 104, // Завершена
        periodCoveredStart: "2023-07-01",
        periodCoveredEnd: "2023-12-31",
        subordinateUnitsOnAllowance: []
    },
    {
        id: 6,
        planNumber: "ГП-2023-011",
        year: 2023,
        approvedBy: "Генерал-лейтенант Морозов А.А.",
        approvedDate: "III квартал 2024",
        totalAudits: 38,
        document: "Приказ №112 от 18.12.2022",
        controlObject: "Воинская часть 00026",
        controlObjectSubtitle: "КВ ПВО и ВВС",
        controlAuthority: "ГУСИТЗИ ГШ ВС РУ",
        inspectionDirection: 21, // Связь и ИТ (COMM)
        inspectionDirectionSubtitle: "Информационные технологии и защита информации",
        inspectionType: 2302, // Внеплановая
        status: 104, // Завершена
        periodCoveredStart: "2024-01-01",
        periodCoveredEnd: "2024-03-31",
        subordinateUnitsOnAllowance: []
    },
    {
        id: 7,
        planNumber: "ГП-2023-012",
        year: 2023,
        approvedBy: "Генерал-лейтенант Морозов А.А.",
        approvedDate: "IV квартал 2024",
        totalAudits: 38,
        document: "Приказ №112 от 18.12.2022",
        controlObject: "Воинская часть 00027",
        controlObjectSubtitle: "КВ ПВО и ВВС",
        controlAuthority: "УМО МО РУ",
        inspectionDirection: 22, // Медицинская деятельность (MED_ACT)
        inspectionDirectionSubtitle: "Медицинское обеспечение",
        inspectionType: 2301, // Плановая
        status: 104, // Завершена
        periodCoveredStart: "2024-04-01",
        periodCoveredEnd: "2024-09-30",
        subordinateUnitsOnAllowance: []
    },
    { id: 8, planNumber: "ГП-2025-002", year: 2025, approvedBy: "Генерал-майор Кузнецов В.П.", approvedDate: "I квартал 2025", totalAudits: 15, document: "Приказ №10 от 10.01.2025", controlObject: "Воинская часть 00012", controlObjectSubtitle: "Ташкентский военный округ", controlAuthority: "УПО ГУМТО МО РУ", inspectionDirection: 13, inspectionDirectionSubtitle: "Продовольственное обеспечение", inspectionType: 2301, status: 101, periodCoveredStart: "2025-01-01", periodCoveredEnd: "2025-12-31", subordinateUnitsOnAllowance: [] },
    { id: 9, planNumber: "ГП-2025-003", year: 2025, approvedBy: "Генерал-майор Кузнецов В.П.", approvedDate: "II квартал 2025", totalAudits: 12, document: "Приказ №15 от 15.01.2025", controlObject: "Воинская часть 00003", controlObjectSubtitle: "ЮЗОВО", controlAuthority: "УВО ГУМТО МО РУ", inspectionDirection: 14, inspectionDirectionSubtitle: "Вещевое обеспечение", inspectionType: 2301, status: 101, periodCoveredStart: "2025-01-01", periodCoveredEnd: "2025-12-31", subordinateUnitsOnAllowance: [] },
    { id: 10, planNumber: "ГП-2025-004", year: 2025, approvedBy: "Генерал-майор Кузнецов В.П.", approvedDate: "III квартал 2025", totalAudits: 20, document: "Приказ №20 от 20.01.2025", controlObject: "Воинская часть 00017", controlObjectSubtitle: "ЦВО", controlAuthority: "УАТ ГУВ МО РУ", inspectionDirection: 15, inspectionDirectionSubtitle: "Автомобильная техника", inspectionType: 2302, status: 101, periodCoveredStart: "2025-01-01", periodCoveredEnd: "2025-03-31", subordinateUnitsOnAllowance: [] },
    { id: 11, planNumber: "ГП-2025-005", year: 2025, approvedBy: "Генерал-майор Кузнецов В.П.", approvedDate: "IV квартал 2025", totalAudits: 18, document: "Приказ №25 от 25.01.2025", controlObject: "Воинская часть 00022", controlObjectSubtitle: "СЗВО", controlAuthority: "УРАВ ГУВ МО РУ", inspectionDirection: 16, inspectionDirectionSubtitle: "Ракетно-артиллерийское вооружение", inspectionType: 2301, status: 101, periodCoveredStart: "2025-01-01", periodCoveredEnd: "2025-12-31", subordinateUnitsOnAllowance: [] },
    { id: 12, planNumber: "ГП-2025-006", year: 2025, approvedBy: "Генерал-майор Кузнецов В.П.", approvedDate: "I квартал 2025", totalAudits: 10, document: "Приказ №30 от 30.01.2025", controlObject: "Воинская часть 00031", controlObjectSubtitle: "КВ ОКО", controlAuthority: "КРУ МО РУ", inspectionDirection: 17, inspectionDirectionSubtitle: "Противодействие коррупции", inspectionType: 2301, status: 101, periodCoveredStart: "2025-01-01", periodCoveredEnd: "2025-06-30", subordinateUnitsOnAllowance: [] },
    { id: 13, planNumber: "ГП-2025-007", year: 2025, approvedBy: "Генерал-майор Кузнецов В.П.", approvedDate: "II квартал 2025", totalAudits: 14, document: "Приказ №35 от 05.02.2025", controlObject: "Воинская часть 00007", controlObjectSubtitle: "ВВО", controlAuthority: "УПВК МО РУ", inspectionDirection: 18, inspectionDirectionSubtitle: "Воспитательная работа", inspectionType: 2302, status: 101, periodCoveredStart: "2025-01-01", periodCoveredEnd: "2025-12-31", subordinateUnitsOnAllowance: [] },
    { id: 14, planNumber: "ГП-2025-008", year: 2025, approvedBy: "Генерал-майор Кузнецов В.П.", approvedDate: "III квартал 2025", totalAudits: 22, document: "Приказ №40 от 10.02.2025", controlObject: "Воинская часть 00032", controlObjectSubtitle: "КВ ОКО", controlAuthority: "ГУСИТЗИ ГШ ВС РУ", inspectionDirection: 19, inspectionDirectionSubtitle: "Защита информации", inspectionType: 2301, status: 101, periodCoveredStart: "2025-01-01", periodCoveredEnd: "2025-06-30", subordinateUnitsOnAllowance: [] },
    { id: 15, planNumber: "ГП-2025-009", year: 2025, approvedBy: "Генерал-майор Кузнецов В.П.", approvedDate: "IV квартал 2025", totalAudits: 16, document: "Приказ №45 от 15.02.2025", controlObject: "Воинская часть 00008", controlObjectSubtitle: "ВВО", controlAuthority: "ГФЭУ МО РУ", inspectionDirection: 20, inspectionDirectionSubtitle: "Исполнение бюджета", inspectionType: 2301, status: 101, periodCoveredStart: "2025-01-01", periodCoveredEnd: "2025-12-31", subordinateUnitsOnAllowance: [] },
];

export const getAllAnnualPlans = () => mockApprovedPlans;
