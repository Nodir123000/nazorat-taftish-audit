import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditsService } from "@/lib/services/audits-service";
import { PaginationParams } from "@/lib/types/api";
import { AuditResultDTO, AuditSummaryStatsDTO, CreateAuditResultDTO, AuditViolationDTO, FinancialAuditDTO, CreateFinancialAuditDTO, LawEnforcementCaseDTO, ServiceInvestigationDTO, CashCheckDTO, ServiceCheckDTO, StorageNormDTO, RepaymentDTO, CreateRepaymentDTO } from "@/lib/types/audits.dto";

// --- MOCK DATA ---

const MOCK_AUDITS: FinancialAuditDTO[] = [
    {
        id: 1,
        unit: "Воинская часть 00001",
        unitSubtitle: "Ташкентский военный округ",
        controlBody: "КРУ МО РУ",
        inspectionDirection: "Финансово-хозяйственной деятельности",
        inspectionDirectionSubtitle: "Главное финансово-экономическое управление МО РУ",
        inspectionType: "плановые",
        date: "15.01.2025",
        cashier: "подполконик Иванов А.С",
        cashierRole: "Командир войсковой часть 00001",
        balance: 125000,
        status: "Проверено",
        violations: 5,
        financialAmount: 5000000,
        propertyAmount: 3888888,
        recoveredAmount: 4250000,
        resolvedViolations: 3,
    },
    {
        id: 2,
        unit: "Воинская часть 00002",
        unitSubtitle: "Центральный военный округ",
        controlBody: "ВО МО РУ",
        inspectionDirection: "Материально-технического обеспечения",
        inspectionDirectionSubtitle: "Управление материально-технического снабжения",
        inspectionType: "плановые",
        date: "20.01.2025",
        cashier: "полковник Петров А.В",
        cashierRole: "Командир войсковой часть 00002",
        balance: 89000,
        status: "В процессе",
        violations: 2,
        financialAmount: 1200000,
        propertyAmount: 0,
        recoveredAmount: 350000,
        resolvedViolations: 1,
    },
    {
        id: 3,
        unit: "Воинская часть 00003",
        unitSubtitle: "Восточный военный округ",
        controlBody: "Прокуратура РУ",
        inspectionDirection: "Кадровой работы",
        inspectionDirectionSubtitle: "Управление кадров и воспитательной работы",
        inspectionType: "внеплановые",
        date: "05.02.2025",
        cashier: "майор Сидоров Г.Г",
        cashierRole: "Командир войсковой часть 00003",
        balance: 156000,
        status: "Проверено",
        violations: 3,
        financialAmount: 750000,
        propertyAmount: 420000,
        recoveredAmount: 680000,
        resolvedViolations: 2,
    },
    {
        id: 4,
        unit: "Воинская часть 00004",
        unitSubtitle: "Ташкентский военный округ",
        controlBody: "СНБ РУ",
        inspectionDirection: "Финансово-хозяйственной деятельности",
        inspectionDirectionSubtitle: "Главное финансово-экономическое управление МО РУ",
        inspectionType: "плановые",
        date: "15.01.2025",
        cashier: "подполконик Иванов А.С",
        cashierRole: "Командир войсковой часть 00004",
        balance: 125000,
        status: "Проверено",
        violations: 4,
        financialAmount: 1850000,
        propertyAmount: 950000,
        recoveredAmount: 1580000,
        resolvedViolations: 2,
    },
    {
        id: 5,
        unit: "Воинская часть 00005",
        unitSubtitle: "Центральный военный округ",
        controlBody: "МО РУ",
        inspectionDirection: "Материально-технического обеспечения",
        inspectionDirectionSubtitle: "Управление материально-технического снабжения",
        inspectionType: "плановые",
        date: "20.01.2025",
        cashier: "полковник Петров А.В",
        cashierRole: "Командир войсковой часть 00005",
        balance: 89000,
        status: "В процессе",
        violations: 2,
        financialAmount: 300000,
        propertyAmount: 150000,
        recoveredAmount: 125000,
        resolvedViolations: 1,
    },
    {
        id: 6,
        unit: "Воинская часть 00006",
        unitSubtitle: "Восточный военный округ",
        controlBody: "Соединение МО РУ",
        inspectionDirection: "Кадровой работы",
        inspectionDirectionSubtitle: "Управление кадров и воспитательной работы",
        inspectionType: "внеплановые",
        date: "05.02.2025",
        cashier: "майор Сидоров Г.Г",
        cashierRole: "Командир войсковой часть 00006",
        balance: 156000,
        status: "Проверено",
        violations: 2,
        financialAmount: 620000,
        propertyAmount: 280000,
        recoveredAmount: 520000,
        resolvedViolations: 1,
    },
    {
        id: 7,
        unit: "Воинская часть 00007",
        unitSubtitle: "Ташкентский военный округ",
        controlBody: "КРУ МО РУ",
        inspectionDirection: "Финансово-хозяйственной деятельности",
        inspectionDirectionSubtitle: "Главное финансово-экономическое управление МО РУ",
        inspectionType: "плановые",
        date: "15.01.2025",
        cashier: "подполконик Иванов А.С",
        cashierRole: "Командир войсковой часть 00007",
        balance: 125000,
        status: "Проверено",
        violations: 5,
        financialAmount: 2100000,
        propertyAmount: 1350000,
        recoveredAmount: 1890000,
        resolvedViolations: 3,
    },
    {
        id: 8,
        unit: "Воинская часть 00008",
        unitSubtitle: "Центральный военный округ",
        controlBody: "Объединение МО РУ",
        inspectionDirection: "Материально-технического обеспечения",
        inspectionDirectionSubtitle: "Управление материально-технического снабжения",
        inspectionType: "плановые",
        date: "20.01.2025",
        cashier: "полковник Петров А.В",
        cashierRole: "Командир войсковой часть 00008",
        balance: 89000,
        status: "В процессе",
        violations: 2,
        financialAmount: 500000,
        propertyAmount: 0,
        recoveredAmount: 180000,
        resolvedViolations: 1,
    },
    {
        id: 9,
        unit: "Воинская часть 00009",
        unitSubtitle: "Восточный военный округ",
        controlBody: "В/Ч МО РУ",
        inspectionDirection: "Кадровой работы",
        inspectionDirectionSubtitle: "Управление кадров и воспитательной работы",
        inspectionType: "внеплановые",
        date: "05.02.2025",
        cashier: "майор Сидоров Г.Г",
        cashierRole: "Командир войсковой часть 00009",
        balance: 156000,
        status: "Проверено",
        violations: 1,
        financialAmount: 450000,
        propertyAmount: 180000,
        recoveredAmount: 450000,
        resolvedViolations: 1,
    },
    {
        id: 10,
        unit: "Воинская часть 00010",
        unitSubtitle: "Ташкентский военный округ",
        controlBody: "КРУ МО РУ",
        inspectionDirection: "Финансово-хозяйственной деятельности",
        inspectionDirectionSubtitle: "Главное финансово-экономическое управление МО РУ",
        inspectionType: "плановые",
        date: "15.01.2025",
        cashier: "подполконик Иванов А.С",
        cashierRole: "Командир войсковой часть 00010",
        balance: 125000,
        status: "Проверено",
        violations: 3,
        financialAmount: 980000,
        propertyAmount: 560000,
        recoveredAmount: 890000,
        resolvedViolations: 2,
    },
    {
        id: 11,
        unit: "Воинская часть 00011",
        unitSubtitle: "Центральный военный округ",
        controlBody: "ВО МО РУ",
        inspectionDirection: "Материально-технического обеспечения",
        inspectionDirectionSubtitle: "Управление материально-технического снабжения",
        inspectionType: "плановые",
        date: "20.01.2025",
        cashier: "полковник Петров А.В",
        cashierRole: "Командир войсковой часть 00011",
        balance: 89000,
        status: "В процессе",
        violations: 2,
        financialAmount: 850000,
        propertyAmount: 100000,
        recoveredAmount: 450000,
        resolvedViolations: 1,
    },
    {
        id: 12,
        unit: "Воинская часть 00012",
        unitSubtitle: "Восточный военный округ",
        controlBody: "КРУ МО РУ",
        inspectionDirection: "Кадровой работы",
        inspectionDirectionSubtitle: "Управление кадров и воспитательной работы",
        inspectionType: "внеплановые",
        date: "05.02.2025",
        cashier: "майор Сидоров Г.Г",
        cashierRole: "Командир войсковой часть 00012",
        balance: 156000,
        status: "Проверено",
        violations: 2,
        financialAmount: 730000,
        propertyAmount: 390000,
        recoveredAmount: 780000,
        resolvedViolations: 1,
    },
    {
        id: 13,
        unit: "Воинская часть 00013",
        unitSubtitle: "Западный военный округ",
        controlBody: "МО РУ",
        inspectionDirection: "Медицинское обеспечение",
        inspectionDirectionSubtitle: "Главное военно-медицинское управление",
        inspectionType: "плановые",
        date: "10.02.2025",
        cashier: "полковник Ахмедов С.М.",
        cashierRole: "Начальник медслужбы",
        balance: 210000,
        status: "Проверено",
        violations: 3,
        financialAmount: 1540000,
        propertyAmount: 320000,
        recoveredAmount: 1120000,
        resolvedViolations: 2,
    },
    {
        id: 14,
        unit: "Воинская часть 00014",
        unitSubtitle: "Юго-Западный особый военный округ",
        controlBody: "ВО МО РУ",
        inspectionDirection: "Техническое обеспечение",
        inspectionDirectionSubtitle: "Управление вооружения",
        inspectionType: "внеплановые",
        date: "12.02.2025",
        cashier: "майор Ким В.Е.",
        cashierRole: "Зампотех",
        balance: 55000,
        status: "В процессе",
        violations: 7,
        financialAmount: 0,
        propertyAmount: 8500000,
        recoveredAmount: 2350000,
        resolvedViolations: 3,
    },
    {
        id: 15,
        unit: "Воинская часть 00015",
        unitSubtitle: "Ташкентский военный округ",
        controlBody: "КРУ МО РУ",
        inspectionDirection: "Продовольственная служба",
        inspectionDirectionSubtitle: "Управление тылового обеспечения",
        inspectionType: "плановые",
        date: "18.02.2025",
        cashier: "капитан Умаров Д.К.",
        cashierRole: "Начальник продслужбы",
        balance: 18000,
        status: "Назначено",
        violations: 4,
        financialAmount: 1250000,
        propertyAmount: 680000,
        recoveredAmount: 920000,
        resolvedViolations: 2,
    },
    {
        id: 16,
        unit: "Воинская часть 00016",
        unitSubtitle: "Северо-Западный военный округ",
        controlBody: "ВО МО РУ",
        inspectionDirection: "Финансово-хозяйственной деятельности",
        inspectionDirectionSubtitle: "Управление финансов округа",
        inspectionType: "плановые",
        date: "25.02.2025",
        cashier: "майор Яковлев П.Р.",
        cashierRole: "Начальник финчасти",
        balance: 450000,
        status: "В процессе",
        violations: 1,
        financialAmount: 120000,
        propertyAmount: 0,
        recoveredAmount: 45000,
        resolvedViolations: 0,
    },
    {
        id: 17,
        unit: "Воинская часть 00017",
        unitSubtitle: "Центральный военный округ",
        controlBody: "КРУ МО РУ",
        inspectionDirection: "Вещевая служба",
        inspectionDirectionSubtitle: "Управление вещевого снабжения",
        inspectionType: "внеплановые",
        date: "01.03.2025",
        cashier: "лейтенант Каримов Б.Т.",
        cashierRole: "Начвещ",
        balance: 32000,
        status: "Проверено",
        violations: 4,
        financialAmount: 0,
        propertyAmount: 4500000,
        recoveredAmount: 2850000,
        resolvedViolations: 2,
    },
    {
        id: 18,
        unit: "Воинская часть 00018",
        unitSubtitle: "Восточный военный округ",
        controlBody: "Соединение МО РУ",
        inspectionDirection: "Квартирно-эксплуатационная служба",
        inspectionDirectionSubtitle: "КЭУ Округа",
        inspectionType: "плановые",
        date: "05.03.2025",
        cashier: "служащий Рахимов А.А.",
        cashierRole: "Начальник КЭЧ района",
        balance: 0,
        status: "Назначено",
        violations: 3,
        financialAmount: 890000,
        propertyAmount: 520000,
        recoveredAmount: 650000,
        resolvedViolations: 1,
    },
    {
        id: 19,
        unit: "Воинская часть 00019",
        unitSubtitle: "Ташкентский военный округ",
        controlBody: "Прокуратура РУ",
        inspectionDirection: "Финансово-хозяйственной деятельности",
        inspectionDirectionSubtitle: "Главное финансово-экономическое управление",
        inspectionType: "внеплановые",
        date: "10.03.2025",
        cashier: "полковник Ли С.В.",
        cashierRole: "Командир части",
        balance: 9800000,
        status: "Проверено",
        violations: 12,
        financialAmount: 15300000,
        propertyAmount: 5600000,
        recoveredAmount: 12450000,
        resolvedViolations: 7,
    },
    {
        id: 20,
        unit: "Воинская часть 00020",
        unitSubtitle: "Юго-Западный особый военный округ",
        controlBody: "МО РУ",
        inspectionDirection: "Служба ГСМ",
        inspectionDirectionSubtitle: "Служба горючего",
        inspectionType: "плановые",
        date: "15.03.2025",
        cashier: "майор Турсунов Э.Ш.",
        cashierRole: "Начальник службы ГСМ",
        balance: 45000,
        status: "В процессе",
        violations: 1,
        financialAmount: 0,
        propertyAmount: 780000,
        recoveredAmount: 320000,
        resolvedViolations: 0,
    },
    {
        id: 21,
        unit: "Воинская часть 00021",
        unitSubtitle: "Западный военный округ",
        controlBody: "ВО МО РУ",
        inspectionDirection: "Войсковое хозяйство",
        inspectionDirectionSubtitle: "Тыловая служба",
        inspectionType: "плановые",
        date: "20.03.2025",
        cashier: "подполковник Назаров Р.Д.",
        cashierRole: "Зам по тылу",
        balance: 12000,
        status: "Проверено",
        violations: 2,
        financialAmount: 550000,
        propertyAmount: 310000,
        recoveredAmount: 480000,
        resolvedViolations: 1,
    },
    {
        id: 22,
        unit: "Воинская часть 00022",
        unitSubtitle: "Центральный военный округ",
        controlBody: "Объединение МО РУ",
        inspectionDirection: "Медицинское обеспечение",
        inspectionDirectionSubtitle: "Медслужба округа",
        inspectionType: "внеплановые",
        date: "25.03.2025",
        cashier: "капитан медслужбы Алиева З.Ф.",
        cashierRole: "Начальник лазарета",
        balance: 560000,
        status: "Назначено",
        violations: 5,
        financialAmount: 1680000,
        propertyAmount: 920000,
        recoveredAmount: 1250000,
        resolvedViolations: 2,
    },
    {
        id: 23,
        unit: "Воинская часть 00023",
        unitSubtitle: "Ташкентский военный округ",
        controlBody: "В/Ч МО РУ",
        inspectionDirection: "Служба РАВ",
        inspectionDirectionSubtitle: "Служба ракетно-артиллерийского вооружения",
        inspectionType: "плановые",
        date: "01.04.2025",
        cashier: "майор Громов И.И.",
        cashierRole: "Начальник службы РАВ",
        balance: 0,
        status: "Проверено",
        violations: 6,
        financialAmount: 0,
        propertyAmount: 12500000,
        recoveredAmount: 7800000,
        resolvedViolations: 4,
    },
    {
        id: 24,
        unit: "Воинская часть 00024",
        unitSubtitle: "Восточный военный округ",
        controlBody: "СНБ РУ",
        inspectionDirection: "Пожарная безопасность",
        inspectionDirectionSubtitle: "Инспекция пожарной безопасности",
        inspectionType: "плановые",
        date: "05.04.2025",
        cashier: "капитан Хасанов М.М.",
        cashierRole: "Начальник пожарной команды",
        balance: 15000,
        status: "В процессе",
        violations: 2,
        financialAmount: 150000,
        propertyAmount: 450000,
        recoveredAmount: 280000,
        resolvedViolations: 1,
    },
    {
        id: 25,
        unit: "Воинская часть 00025",
        unitSubtitle: "Северо-Западный военный округ",
        controlBody: "ВО МО РУ",
        inspectionDirection: "Экологическая безопасность",
        inspectionDirectionSubtitle: "Экологическая служба",
        inspectionType: "плановые",
        date: "10.04.2025",
        cashier: "служащий Юсупов Б.К.",
        cashierRole: "Эколог",
        balance: 8000,
        status: "Проверено",
        violations: 1,
        financialAmount: 500000,
        propertyAmount: 0,
        recoveredAmount: 350000,
        resolvedViolations: 1,
    },
];

const MOCK_VIOLATIONS: AuditViolationDTO[] = [
    { id: 1, auditId: 1, kind: "Финансовое", type: "Недостача", source: "бюджет", amount: 5000000, recovered: 2500000, count: 3, responsible: "подполконик Иванов А.С\nКомандир войсковой часть 00001" },
    { id: 2, auditId: 1, kind: "Имущественное", type: "Излишки", source: "внебюджет", amount: 3888888, recovered: 1750000, count: 2, responsible: "майор Петров П.П.\nНачальник службы" },
    { id: 3, auditId: 2, kind: "Финансовое", type: "Переплата", source: "бюджет", amount: 1200000, recovered: 350000, count: 2, responsible: "полковник Петров А.В\nКомандир войсковой часть 00002" },
    { id: 4, auditId: 3, kind: "Финансовое", type: "Нецелевое использование", source: "бюджет", amount: 750000, recovered: 680000, count: 2, responsible: "майор Сидоров Г.Г\nКомандир войсковой часть 00003" },
    { id: 5, auditId: 3, kind: "Имущественное", type: "Недостача", source: "бюджет", amount: 420000, recovered: 0, count: 1, responsible: "капитан Орлов К.К.\nНачальник склада" },
    { id: 6, auditId: 4, kind: "Финансовое", type: "Незаконные выплаты", source: "бюджет", amount: 1850000, recovered: 1580000, count: 2, responsible: "подполконик Иванов А.С\nКомандир войсковой часть 00004" },
    { id: 7, auditId: 4, kind: "Имущественное", type: "Излишки", source: "внебюджет", amount: 950000, recovered: 0, count: 2, responsible: "майор Козлов В.В.\nНачальник хозчасти" },
    { id: 8, auditId: 5, kind: "Финансовое", type: "Переплата", source: "бюджет", amount: 300000, recovered: 125000, count: 1, responsible: "полковник Петров А.В\nКомандир войсковой часть 00005" },
    { id: 9, auditId: 5, kind: "Имущественное", type: "Порча имущества", source: "бюджет", amount: 150000, recovered: 0, count: 1, responsible: "лейтенант Смирнов А.А.\nНачальник склада" },
    { id: 10, auditId: 6, kind: "Финансовое", type: "Недостача", source: "бюджет", amount: 620000, recovered: 520000, count: 1, responsible: "майор Сидоров Г.Г\nКомандир войсковой часть 00006" },
    { id: 11, auditId: 6, kind: "Имущественное", type: "Недостача", source: "бюджет", amount: 280000, recovered: 0, count: 1, responsible: "капитан Волков Д.Д.\nЗампотех" },
    { id: 12, auditId: 7, kind: "Финансовое", type: "Нецелевое использование", source: "бюджет", amount: 2100000, recovered: 1890000, count: 3, responsible: "подполконик Иванов А.С\nКомандир войсковой часть 00007" },
    { id: 13, auditId: 7, kind: "Имущественное", type: "Хищение", source: "бюджет", amount: 1350000, recovered: 0, count: 2, responsible: "майор Николаев Е.Е.\nНачальник склада" },
    { id: 14, auditId: 8, kind: "Финансовое", type: "Переплата", source: "бюджет", amount: 500000, recovered: 180000, count: 2, responsible: "полковник Петров А.В\nКомандир войсковой часть 00008" },
    { id: 15, auditId: 9, kind: "Финансовое", type: "Недостача", source: "бюджет", amount: 450000, recovered: 450000, count: 1, responsible: "майор Сидоров Г.Г\nКомандир войсковой часть 00009" },
    { id: 16, auditId: 9, kind: "Имущественное", type: "Порча", source: "внебюджет", amount: 180000, recovered: 180000, count: 0, responsible: "капитан Федоров И.И.\nЗампотех" },
    { id: 17, auditId: 10, kind: "Финансовое", type: "Незаконные выплаты", source: "бюджет", amount: 980000, recovered: 890000, count: 2, responsible: "подполконик Иванов А.С\nКомандир войсковой часть 00010" },
    { id: 18, auditId: 10, kind: "Имущественное", type: "Недостача", source: "бюджет", amount: 560000, recovered: 0, count: 1, responsible: "майор Кузнецов Л.Л.\nНачальник хозчасти" },
    { id: 19, auditId: 11, kind: "Финансовое", type: "Переплата", source: "бюджет", amount: 850000, recovered: 450000, count: 1, responsible: "полковник Петров А.В\nКомандир войсковой часть 00011" },
    { id: 20, auditId: 11, kind: "Имущественное", type: "Излишки", source: "внебюджет", amount: 100000, recovered: 0, count: 1, responsible: "капитан Соколов М.М.\nНачальник склада" },
    { id: 21, auditId: 12, kind: "Финансовое", type: "Недостача", source: "бюджет", amount: 730000, recovered: 730000, count: 1, responsible: "майор Сидоров Г.Г\nКомандир войсковой часть 00012" },
    { id: 22, auditId: 12, kind: "Имущественное", type: "Порча", source: "бюджет", amount: 390000, recovered: 50000, count: 1, responsible: "лейтенант Морозов Н.Н.\nЗампотех" },
    { id: 23, auditId: 13, kind: "Финансовое", type: "Нецелевое использование", source: "бюджет", amount: 1540000, recovered: 1120000, count: 2, responsible: "полковник Ахмедов С.М.\nНачальник медслужбы" },
    { id: 24, auditId: 13, kind: "Имущественное", type: "Недостача", source: "бюджет", amount: 320000, recovered: 0, count: 1, responsible: "капитан Павлов О.О.\nНачальник склада" },
    { id: 25, auditId: 14, kind: "Имущественное", type: "Хищение", source: "бюджет", amount: 8500000, recovered: 2350000, count: 5, responsible: "майор Ким В.Е.\nЗампотех" },
    { id: 26, auditId: 14, kind: "Имущественное", type: "Порча", source: "бюджет", amount: 0, recovered: 0, count: 2, responsible: "лейтенант Романов П.П.\nНачальник автопарка" },
    { id: 27, auditId: 15, kind: "Финансовое", type: "Переплата", source: "бюджет", amount: 1250000, recovered: 920000, count: 3, responsible: "капитан Умаров Д.К.\nНачальник продслужбы" },
    { id: 28, auditId: 15, kind: "Имущественное", type: "Порча продовольствия", source: "бюджет", amount: 680000, recovered: 0, count: 1, responsible: "лейтенант Егоров Р.Р.\nНачальник склада" },
    { id: 29, auditId: 16, kind: "Финансовое", type: "Недостача", source: "бюджет", amount: 120000, recovered: 45000, count: 1, responsible: "майор Яковлев П.Р.\nНачальник финчасти" },
    { id: 30, auditId: 17, kind: "Имущественное", type: "Недостача вещевого имущества", source: "бюджет", amount: 4500000, recovered: 2850000, count: 3, responsible: "лейтенант Каримов Б.Т.\nНачвещ" },
    { id: 31, auditId: 17, kind: "Имущественное", type: "Порча", source: "бюджет", amount: 0, recovered: 0, count: 1, responsible: "сержант Власов С.С.\nСтаршина роты" },
    { id: 32, auditId: 18, kind: "Финансовое", type: "Нецелевое использование", source: "бюджет", amount: 890000, recovered: 650000, count: 2, responsible: "служащий Рахимов А.А.\nНачальник КЭЧ района" },
    { id: 33, auditId: 18, kind: "Имущественное", type: "Порча", source: "бюджет", amount: 520000, recovered: 0, count: 1, responsible: "рабочий Тимофеев Т.Т.\nМастер участка" },
    { id: 34, auditId: 19, kind: "Финансовое", type: "Хищение", source: "бюджет", amount: 15300000, recovered: 12450000, count: 8, responsible: "полковник Ли С.В.\nКомандир части" },
    { id: 35, auditId: 19, kind: "Имущественное", type: "Недостача", source: "бюджет", amount: 5600000, recovered: 0, count: 4, responsible: "майор Чернов У.У.\nЗам по тылу" },
    { id: 36, auditId: 20, kind: "Имущественное", type: "Недостача ГСМ", source: "бюджет", amount: 780000, recovered: 320000, count: 1, responsible: "майор Турсунов Э.Ш.\nНачальник службы ГСМ" },
    { id: 37, auditId: 21, kind: "Финансовое", type: "Переплата", source: "бюджет", amount: 550000, recovered: 480000, count: 1, responsible: "подполковник Назаров Р.Д.\nЗам по тылу" },
    { id: 38, auditId: 21, kind: "Имущественное", type: "Излишки", source: "внебюджет", amount: 310000, recovered: 0, count: 1, responsible: "капитан Белов Ф.Ф.\nНачальник склада" },
    { id: 39, auditId: 22, kind: "Финансовое", type: "Нецелевое использование", source: "бюджет", amount: 1680000, recovered: 1250000, count: 3, responsible: "капитан медслужбы Алиева З.Ф.\nНачальник лазарета" },
    { id: 40, auditId: 22, kind: "Имущественное", type: "Недостача медикаментов", source: "бюджет", amount: 920000, recovered: 0, count: 2, responsible: "лейтенант Новиков Х.Х.\nФармацевт" },
    { id: 41, auditId: 23, kind: "Имущественное", type: "Недостача вооружения", source: "бюджет", amount: 12500000, recovered: 7800000, count: 4, responsible: "майор Громов И.И.\nНачальник службы РАВ" },
    { id: 42, auditId: 23, kind: "Имущественное", type: "Порча", source: "бюджет", amount: 0, recovered: 0, count: 2, responsible: "капитан Лебедев Ц.Ц.\nНачальник склада" },
    { id: 43, auditId: 24, kind: "Финансовое", type: "Переплата", source: "бюджет", amount: 150000, recovered: 150000, count: 1, responsible: "капитан Хасанов М.М.\nНачальник пожарной команды" },
    { id: 44, auditId: 24, kind: "Имущественное", type: "Недостача", source: "бюджет", amount: 450000, recovered: 130000, count: 1, responsible: "лейтенант Борисов Ч.Ч.\nНачальник ПХЗ" },
    { id: 45, auditId: 25, kind: "Финансовое", type: "Недостача", source: "бюджет", amount: 500000, recovered: 350000, count: 1, responsible: "служащий Юсупов Б.К.\nЭколог" },
];

const MOCK_CASH_CHECKS: CashCheckDTO[] = [
    { check_id: 1, check_date: "2025-02-10", cash_type: "Наличные (УЗС)", expected_amount: 1000000, actual_amount: 1000000, discrepancy: 0, status: "ok" },
    { check_id: 2, check_date: "2025-02-12", cash_type: "Валюта (USD)", expected_amount: 500, actual_amount: 500, discrepancy: 0, status: "ok" }
];

const MOCK_SERVICE_CHECKS: ServiceCheckDTO[] = [
    { id: 1, service: "Продовольственная служба", items_checked: 45, violations: 0, status: "ok" },
    { id: 2, service: "Вещевая служба", items_checked: 120, violations: 2, status: "discrepancy" }
];

const MOCK_STORAGE_NORMS: StorageNormDTO[] = [
    { id: 1, item: "Дизельное топливо", norm: 10000, actual: 9500, unit: "л", status: "low" },
    { id: 2, item: "Продовольствие (крупы)", norm: 5000, actual: 5200, unit: "кг", status: "ok" }
];

const MOCK_LAW_ENFORCEMENT_CASES: LawEnforcementCaseDTO[] = [
    {
        id: "1",
        violationId: "В-2024-001",
        unitName: "Воинская часть 00001",
        type: "Хищение ГСМ",
        outgoingNumber: "№123/45",
        outgoingDate: "10.01.2025",
        recipientOrg: "Военная прокуратура",
        amount: 45000000,
        status: "Возбуждено УД",
        caseNumber: "УД-2025-012",
        decision: "Передано в суд"
    },
    {
        id: "2",
        violationId: "В-2024-005",
        unitName: "Воинская часть 00005",
        type: "Нецелевое использование",
        outgoingNumber: "№128/12",
        outgoingDate: "15.01.2025",
        recipientOrg: "СГБ",
        amount: 12500000,
        status: "На рассмотрении"
    }
];

const MOCK_SERVICE_INVESTIGATIONS: ServiceInvestigationDTO[] = [
    {
        id: "1",
        prescriptionNum: "ПР-2024-085",
        unitName: "Воинская часть 00001",
        violationSummary: "Недостача ГСМ в размере 1500 литров",
        assignmentOrder: "№12 от 15.11.2024",
        responsiblePerson: "капитан Сидоров А.П.",
        result: "Вина установлена",
        punishmentOrder: "№845 от 10.12.2024",
        amountToRecover: 15400000,
        deadline: "2024-12-01",
        status: "Завершено"
    },
    {
        id: "2",
        prescriptionNum: "ПР-2024-092",
        unitName: "Воинская часть 00005",
        violationSummary: "Нарушение порядка ведения кассовых операций",
        assignmentOrder: "№88 от 01.12.2024",
        responsiblePerson: "майор Иванов И.И.",
        result: "В процессе",
        punishmentOrder: "",
        amountToRecover: 0,
        deadline: "2025-01-15",
        status: "В процессе"
    }
];

const MOCK_AUDIT_RESULTS: AuditResultDTO[] = [
    {
        result_id: 1,
        audit_date: "2025-01-15",
        findings_count: 5,
        violations_count: 8,
        total_amount: 8888888,
        report_text: "Выявлены нарушения в ведении первичной документации и учёте материальных средств...",
        status: "approved"
    },
    {
        result_id: 2,
        audit_date: "2025-01-20",
        findings_count: 2,
        violations_count: 4,
        total_amount: 1200000,
        report_text: "Несоблюдение норм хранения ТМЦ в складских помещениях службы обеспечения...",
        status: "submitted"
    },
    {
        result_id: 3,
        audit_date: "2025-02-05",
        findings_count: 4,
        violations_count: 4,
        total_amount: 4420000,
        report_text: "Обнаружены переплаты денежного довольствия личному составу за отчетный период...",
        status: "approved"
    }
];

const MOCK_AUDIT_STATS: AuditSummaryStatsDTO = {
    totalAudits: 12,
    totalFindings: 45,
    totalViolations: 16,
    totalAmount: 14500000,
    approvedReports: 8
};

// --- QUERY KEYS ---

export const AUDIT_KEYS = {
    all: ['audits'] as const,
    results: () => [...AUDIT_KEYS.all, 'results'] as const,
    resultsLists: () => [...AUDIT_KEYS.results(), 'list'] as const,
    resultsList: (params: Record<string, any>) => [...AUDIT_KEYS.resultsLists(), params] as const,
    resultsDetail: (id: number) => [...AUDIT_KEYS.results(), 'detail', id] as const,
    stats: () => [...AUDIT_KEYS.all, 'stats'] as const,
    summaryStats: () => [...AUDIT_KEYS.stats(), 'summary'] as const,
    cashChecks: () => [...AUDIT_KEYS.all, 'cash-checks'] as const,
    serviceChecks: () => [...AUDIT_KEYS.all, 'service-checks'] as const,
    storageNorms: () => [...AUDIT_KEYS.all, 'storage-norms'] as const,
    lawEnforcement: () => [...AUDIT_KEYS.all, 'law-enforcement'] as const,
    serviceInvestigations: () => [...AUDIT_KEYS.all, 'service-investigations'] as const,
    activeAudits: () => [...AUDIT_KEYS.all, 'active'] as const,
    reports: () => [...AUDIT_KEYS.all, 'reports'] as const,
    preparationChecklist: (auditId: string) => [...AUDIT_KEYS.all, 'preparation-checklist', auditId] as const,
    sourceDocuments: (auditId: string) => [...AUDIT_KEYS.all, 'source-documents', auditId] as const,
    documents: (auditId: string) => [...AUDIT_KEYS.all, 'documents', auditId] as const,
    evidence: (auditId: string) => [...AUDIT_KEYS.all, 'evidence', auditId] as const,
    violations: () => [...AUDIT_KEYS.all, 'violations'] as const,
    financialAudits: () => [...AUDIT_KEYS.all, 'financial-audits'] as const,
    repayments: (violationId: number) => [...AUDIT_KEYS.all, 'repayments', violationId] as const,
    financialAuditDetail: (id: number) => [...AUDIT_KEYS.all, 'financial-audits', id] as const,
};

// --- HOOKS ---

export function useAuditResults(params: PaginationParams & { status?: string, search?: string }) {
    return useQuery({
        queryKey: AUDIT_KEYS.resultsList(params),
        queryFn: () => Promise.resolve({
            items: MOCK_AUDIT_RESULTS,
            total: MOCK_AUDIT_RESULTS.length,
            page: 1,
            size: 10,
            pages: 1
        }),
    });
}

export function useAuditResult(id: number) {
    return useQuery({
        queryKey: AUDIT_KEYS.resultsDetail(id),
        queryFn: () => auditsService.getResult(id),
        enabled: !!id,
    });
}

export function useCreateAuditResult() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateAuditResultDTO) => auditsService.createResult(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.resultsLists() });
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.summaryStats() });
        },
    });
}

export function useUpdateAuditResult() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateAuditResultDTO> }) => auditsService.updateResult(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.resultsDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.resultsLists() });
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.summaryStats() });
        },
    });
}

export function useAuditSummaryStats() {
    return useQuery({
        queryKey: AUDIT_KEYS.summaryStats(),
        queryFn: () => Promise.resolve(MOCK_AUDIT_STATS),
    });
}

export function useCashChecks() {
    return useQuery({
        queryKey: AUDIT_KEYS.cashChecks(),
        queryFn: () => Promise.resolve(MOCK_CASH_CHECKS),
    });
}

export function useServiceChecks() {
    return useQuery({
        queryKey: AUDIT_KEYS.serviceChecks(),
        queryFn: () => Promise.resolve(MOCK_SERVICE_CHECKS),
    });
}

export function useStorageNorms() {
    return useQuery({
        queryKey: AUDIT_KEYS.storageNorms(),
        queryFn: () => Promise.resolve(MOCK_STORAGE_NORMS),
    });
}

export function useLawEnforcementCases() {
    return useQuery({
        queryKey: AUDIT_KEYS.lawEnforcement(),
        queryFn: () => Promise.resolve(MOCK_LAW_ENFORCEMENT_CASES),
    });
}

export function useCreateLawEnforcementCase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<LawEnforcementCaseDTO>) => auditsService.createLawEnforcementCase(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.lawEnforcement() });
        },
    });
}

export function useUpdateLawEnforcementCase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<LawEnforcementCaseDTO> }) => auditsService.updateLawEnforcementCase(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.lawEnforcement() });
        },
    });
}

export function useDeleteLawEnforcementCase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => auditsService.deleteLawEnforcementCase(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.lawEnforcement() });
        },
    });
}

export function useServiceInvestigations() {
    return useQuery({
        queryKey: AUDIT_KEYS.serviceInvestigations(),
        queryFn: () => Promise.resolve(MOCK_SERVICE_INVESTIGATIONS),
    });
}

export function useCreateServiceInvestigation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<ServiceInvestigationDTO>) => auditsService.createServiceInvestigation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.serviceInvestigations() });
        },
    });
}

export function useUpdateServiceInvestigation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<ServiceInvestigationDTO> }) => auditsService.updateServiceInvestigation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.serviceInvestigations() });
        },
    });
}

export function useDeleteServiceInvestigation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => auditsService.deleteServiceInvestigation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.serviceInvestigations() });
        },
    });
}

export function useActiveAudits() {
    return useQuery({
        queryKey: AUDIT_KEYS.activeAudits(),
        queryFn: () => auditsService.getActiveAudits(),
    });
}

export function useAuditReports() {
    return useQuery({
        queryKey: AUDIT_KEYS.reports(),
        queryFn: () => auditsService.getReports(),
    });
}

export function usePreparationChecklist(auditId: string) {
    return useQuery({
        queryKey: AUDIT_KEYS.preparationChecklist(auditId),
        queryFn: () => auditsService.getPreparationChecklist(auditId),
        enabled: !!auditId,
    });
}

export function useSourceDocuments(auditId: string) {
    return useQuery({
        queryKey: AUDIT_KEYS.sourceDocuments(auditId),
        queryFn: () => auditsService.getSourceDocuments(auditId),
        enabled: !!auditId,
    });
}

export function useAuditDocuments(auditId: string) {
    return useQuery({
        queryKey: AUDIT_KEYS.documents(auditId),
        queryFn: () => auditsService.getDocuments(auditId),
        enabled: !!auditId,
    });
}

export function useAuditEvidence(auditId: string) {
    return useQuery({
        queryKey: AUDIT_KEYS.evidence(auditId),
        queryFn: () => auditsService.getEvidence(auditId),
        enabled: !!auditId,
    });
}

export function useAuditViolations<T = AuditViolationDTO[]>(params?: { inspectorId?: number }) {
    return useQuery({
        queryKey: [...AUDIT_KEYS.violations(), params],
        queryFn: () => auditsService.getViolations(params) as unknown as Promise<T>,
    });
}

export function useCreateAuditViolation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<AuditViolationDTO>) => auditsService.createViolation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.violations() });
        },
    });
}

export function useUpdateAuditViolation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<AuditViolationDTO> }) => auditsService.updateViolation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.violations() });
        },
    });
}

export function useDeleteAuditViolation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => auditsService.deleteViolation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.violations() });
        },
    });
}

// --- Financial Audits ---

export function useFinancialAudits(params?: { inspectorId?: string | number; unitName?: string }) {
    return useQuery({
        queryKey: params ? [...AUDIT_KEYS.financialAudits(), params] : AUDIT_KEYS.financialAudits(),
        queryFn: async () => {
            const result = await auditsService.getFinancialAudits(params);
            // API returns { items, total, page, limit }
            if (result && typeof result === 'object' && 'items' in result) {
                return (result as any).items as FinancialAuditDTO[];
            }
            return result as FinancialAuditDTO[];
        },
    });
}

export function useFinancialAudit(id: number) {
    return useQuery({
        queryKey: AUDIT_KEYS.financialAuditDetail(id),
        queryFn: () => auditsService.getFinancialAudit(id),
        enabled: !!id,
    })
}

export function useCreateFinancialAudit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateFinancialAuditDTO) => auditsService.createFinancialAudit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.financialAudits() });
        },
    });
}

export function useUpdateFinancialAudit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateFinancialAuditDTO> }) => auditsService.updateFinancialAudit(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.financialAuditDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.financialAudits() });
        },
    });
}

export function useDeleteFinancialAudit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => auditsService.deleteFinancialAudit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.financialAudits() });
        },
    });
}

// --- Repayment History ---

export function useRepayments(violationId: number | null) {
    return useQuery<RepaymentDTO[]>({
        queryKey: AUDIT_KEYS.repayments(violationId ?? 0),
        queryFn: () => auditsService.getRepayments(violationId!),
        enabled: !!violationId,
    });
}

export function useCreateRepayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRepaymentDTO) => auditsService.createRepayment(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.repayments(variables.violation_id) });
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.financialAudits() });
        },
    });
}
