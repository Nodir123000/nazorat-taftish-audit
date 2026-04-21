
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { regions, districts } from "@/components/reference/territories-data"

export interface ApiConfig {
    baseURL?: string;
    headers?: Record<string, string>;
}

export class HttpClient {
    public instance: AxiosInstance;

    constructor(config: ApiConfig = {}) {
        this.instance = axios.create(config);

        // Mocking the adapter for local development/testing
        this.instance.defaults.adapter = async (config) => {
            const url = config.url || "";
            let data: any = [];

            if (url.includes('stats/summary')) {
                data = {
                    totalAudits: 24,
                    totalFindings: 156,
                    totalViolations: 84,
                    totalAmount: 4500000000,
                    approvedReports: 18
                };
            } else if (url.includes('reference/personnel/')) {
                // Handling detail view
                const id = parseInt(url.split('/').pop() || "0");
                data = {
                    id: id || 361,
                    personId: 1,
                    pnr: "Щ-851230",
                    rank: "Полковник",
                    unitStateId: "00015",
                    position: "Командир части",
                    vus: "010100",
                    category: "Офицер",
                    status: "active",
                    person: {
                        id: 1,
                        firstName: "Фарход",
                        lastName: "Абдуллаев",
                        middleName: "Рустамович",
                        pinfl: "31204851230045",
                        passport: "AA1234567",
                        birthDate: "15.05.1985",
                        gender: "Мужской",
                        nationality: "Узбек",
                        phone: "+998 90 123-45-67"
                    }
                };
            } else if (url.includes('reference/personnel')) {
                data = {
                    items: [
                        { id: 1, personId: 1, pnr: "Щ-851230", rank: "Полковник", unitStateId: "00015", position: "Командир части", vus: "010100", category: "Офицер", status: "active", person: { id: 1, firstName: "Фарход", lastName: "Абдуллаев", middleName: "Рустамович", pinfl: "31204851230045" } },
                        { id: 2, personId: 2, pnr: "ЕР-901122", rank: "Подполковник", unitStateId: "00011", position: "Заместитель командира", vus: "021000", category: "Офицер", status: "active", person: { id: 2, firstName: "Нигора", lastName: "Каримова", middleName: "Бахтияровна", pinfl: "42510901230089" } },
                    ],
                    total: 2
                };
            } else if (url.includes('reference/document-types')) {
                data = {
                    items: [
                        { id: "1", code: "AKT-01", name: "Акт ревизии", category: "Отчетные", template: "yes", description: "Основной документ по результатам проверки", status: "active" },
                        { id: "2", code: "ORD-01", name: "Приказ о назначении", category: "Распорядительные", template: "yes", description: "Основание для проведения проверки", status: "active" },
                        { id: "3", code: "REQ-01", name: "Запрос данных", category: "Дополнительные", template: "no", description: "Запрос информации у объекта контроля", status: "active" },
                    ],
                    total: 3
                };
            } else if (url.includes('reference/units')) {
                data = {
                    items: [
                        { id: "1", stateId: "00001", stateNumber: "01/001", name: "Воинская часть 00001", type: "Боевая часть", location: "Ташкент", region: "Ташкент", district: "ТВО", description: "Гвардейская бригада", status: "active" },
                        { id: "2", stateId: "00002", stateNumber: "01/002", name: "Воинская часть 00002", type: "Учебный центр", location: "Чирчик", region: "Ташкентская область", district: "ТВО", description: "Учебный центр подготовки специалистов", status: "active" },
                    ],
                    total: 2
                };
            } else if (url.includes('reference/regions')) {
                data = {
                    items: regions,
                    total: regions.length
                };
            } else if (url.includes('reference/districts')) {
                data = {
                    items: districts,
                    total: districts.length
                };
            } else if (url.includes('reference/military-districts')) {
                data = {
                    items: [
                        { id: "1", code: "TBO", name: "Ташкентский военный округ", shortName: "ТВО", headquarters: "Ташкент", status: "active", region: "Ташкент", district: "Юнусабадский район" },
                        { id: "2", code: "SBO", name: "Северо-западный военный округ", shortName: "СЗВО", headquarters: "Нукус", status: "active", region: "Республика Каракалпакстан", district: "Нукус" },
                        { id: "3", code: "BBO", name: "Восточный военный округ", shortName: "ВВО", headquarters: "Фергана", status: "active", region: "Ферганская область", district: "Фергана" },
                        { id: "4", code: "JBO", name: "Юго-западный особый военный округ", shortName: "ЮЗОВО", headquarters: "Карши", status: "active", region: "Кашкадарьинская область", district: "Карши" },
                        { id: "5", code: "MBO", name: "Центральный военный округ", shortName: "ЦВО", headquarters: "Джизак", status: "active", region: "Джизакская область", district: "Джизак" },
                    ],
                    total: 5
                };
            } else if (url.includes('violations')) {
                data = [
                    { id: 1, auditId: 1, kind: "Финансовое", type: "Недостача", source: "бюджет", amount: 5000000, recovered: 2500000, count: 3, responsible: "подполковник Иванов А.С\nКомандир войсковой части 00001" },
                    { id: 2, auditId: 1, kind: "Имущественное", type: "Излишки", source: "внебюджет", amount: 3888888, recovered: 1750000, count: 2, responsible: "майор Петров П.П.\nНачальник службы" },
                    { id: 3, auditId: 2, kind: "Финансовое", type: "Переплата", source: "бюджет", amount: 1200000, recovered: 350000, count: 2, responsible: "полковник Петров А.В\nКомандир войсковой части 00002" },
                    { id: 4, auditId: 3, kind: "Финансовое", type: "Нецелевое использование", source: "бюджет", amount: 750000, recovered: 680000, count: 2, responsible: "майор Сидоров Г.Г\nКомандир войсковой части 00003" },
                    { id: 5, auditId: 3, kind: "Имущественное", type: "Недостача", source: "бюджет", amount: 420000, recovered: 0, count: 1, responsible: "капитан Орлов К.К.\nНачальник склада" },
                ];
            } else if (url.includes('active')) {
                data = [
                    {
                        audit_id: 1,
                        order_num: "№123-К/2025",
                        unit_name: "Воинская часть 00001",
                        unit_code: "12345",
                        audit_type: "ФХД",
                        start_date: "2025-01-01",
                        end_date: "2025-02-01",
                        progress: 75,
                        status: "in_progress",
                        chairman: "полковник Сидоров",
                        members_count: 5,
                        violations_count: 12
                    }
                ];
            } else if (url.includes('financial-audits')) {
            } else if (url.includes('reference/physical-persons')) {
                data = {
                    items: [
                        { id: 1, firstName: "Фарход", lastName: "Абдуллаев", middleName: "Рустамович", pinfl: "31204851230045", passport: "AA1234567", birthDate: "15.05.1985", gender: "Мужской", phone: "+998 90 123-45-67", status: "active" },
                        { id: 2, firstName: "Нигора", lastName: "Каримова", middleName: "Бахтияровна", pinfl: "42510901230089", passport: "AB9876543", birthDate: "22.11.1990", gender: "Женский", phone: "+998 93 987-65-43", status: "active" },
                    ],
                    total: 2
                };
            } else if (url.includes('law-enforcement/cases')) {
                data = [
                    {
                        id: 1,
                        violationId: "V-2025-001",
                        sourceViolationId: "REF-001",
                        type: "Хищение денежных средств из кассы",
                        recipientOrg: "Военная прокуратура Ташкентского гарнизона",
                        outgoingNumber: "№ 12-05/124",
                        outgoingDate: "20.01.2025",
                        amount: 450000000,
                        recoveredAmount: 125000000,
                        status: "Возбуждено УД",
                        caseNumber: "12/25-44",
                        decision: "Ведется следствие",
                    },
                    {
                        id: 2,
                        violationId: "V-2025-002",
                        sourceViolationId: "REF-002",
                        type: "Недостача материальных ценностей на складе ГСМ",
                        recipientOrg: "Служба государственной безопасности (СГБ)",
                        outgoingNumber: "№ 12-05/135",
                        outgoingDate: "25.01.2025",
                        amount: 1250000000,
                        recoveredAmount: 0,
                        status: "На рассмотрении",
                        caseNumber: "",
                        decision: "В процессе изучения",
                    },
                    {
                        id: 3,
                        violationId: "V-2025-003",
                        type: "Злоупотребление должностными полномочиями",
                        recipientOrg: "Военная прокуратура РУ",
                        outgoingNumber: "№ 12-05/142",
                        outgoingDate: "02.02.2025",
                        amount: 75000000,
                        recoveredAmount: 75000000,
                        status: "Отказ в возбуждении УД",
                        caseNumber: "Отказ № 115",
                        decision: "Дисциплинарное взыскание",
                    }
                ];
            } else if (url.includes('planning/annual')) {
                data = {
                    items: [
                        { id: 1, year: 2025, status: "APPROVED", planNumber: "ГП-2025-001", unit: "Воинская часть 00001", startDate: "01.01.2025", endDate: "31.12.2025", creationDate: "10.12.2024", totalAudits: 5 },
                        { id: 2, year: 2025, status: "APPROVED", planNumber: "ГП-2025-002", unit: "Воинская часть 00002", startDate: "01.01.2025", endDate: "31.12.2025", creationDate: "15.12.2024", totalAudits: 3 },
                        { id: 3, year: 2025, status: "DRAFT", planNumber: "ГП-2025-003", unit: "Воинская часть 00003", startDate: "01.01.2025", endDate: "31.12.2025", creationDate: "20.01.2025", totalAudits: 2 },
                    ],
                    total: 3
                };
            } else if (url.includes('planning/orders')) {
                data = {
                    items: [
                        { id: 1, orderNum: "№ 15/2025", date: "10.01.2025", unit: "1", commander: "1", period: "15.01.2025 - 25.01.2025", status: "Действует" },
                        { id: 2, orderNum: "№ 18/2025", date: "15.01.2025", unit: "2", commander: "2", period: "20.01.2025 - 30.01.2025", status: "Действует" },
                        { id: 3, orderNum: "№ 20/2025", date: "18.01.2025", unit: "3", commander: "1", period: "01.02.2025 - 10.02.2025", status: "Проект" },
                        { id: 4, orderNum: "№ 10/2025", date: "05.01.2025", unit: "4", commander: "3", period: "05.01.2025 - 15.01.2025", status: "Завершено" },
                        { id: 5, orderNum: "№ 22/2025", date: "25.01.2025", unit: "5", commander: "2", period: "01.03.2025 - 10.03.2025", status: "Проект" },
                    ],
                    total: 5
                };
            } else if (url.includes('planning/commission-members')) {
                data = [
                    { id: 1, orderId: 1, role: "Председатель комиссии", name: "1", rank: "Полковник", position: "Начальник отдела", unit: "КРУ" },
                    { id: 2, orderId: 1, role: "Член комиссии", name: "2", rank: "Майор", position: "Инспектор", unit: "КРУ" },
                    { id: 3, orderId: 2, role: "Председатель комиссии", name: "3", rank: "Подполковник", position: "Зам. начальника", unit: "КРУ" },
                    { id: 4, orderId: 2, role: "Член комиссии", name: "4", rank: "Капитан", position: "Инспектор", unit: "КРУ" },
                    { id: 5, orderId: 4, role: "Председатель комиссии", name: "1", rank: "Полковник", position: "Начальник отдела", unit: "КРУ" },
                ];
            } else if (url.includes('planning/prescriptions')) {
                data = [
                    { id: 1, prescriptionNum: "ПР-001", date: "12.01.2025", leader: "1", deputy: "2", organization: "1", period: "15.01.2025 - 25.01.2025", status: "Выдано" },
                    { id: 2, prescriptionNum: "ПР-002", date: "16.01.2025", leader: "3", deputy: "4", organization: "2", period: "20.01.2025 - 30.01.2025", status: "Выдано" },
                    { id: 3, prescriptionNum: "ПР-003", date: "06.01.2025", leader: "3", deputy: "1", organization: "4", period: "05.01.2025 - 15.01.2025", status: "Исполнено" },
                ];
            } else if (url.includes('planning/briefings')) {
                data = [
                    { id: 1, topic: "Инструктаж по проверке финансовой деятельности", duration: "45 мин", completed: true, conductedDate: "14.01.2025", plannedDate: "14.01.2025", notes: "Проведен в полном объеме" },
                    { id: 2, topic: "Инструктаж по безопасности", duration: "30 мин", completed: true, conductedDate: "19.01.2025", plannedDate: "19.01.2025", notes: "Все члены комиссии присутствовали" },
                    { id: 3, topic: "Инструктаж по работе с секретными документами", duration: "60 мин", completed: false, conductedDate: "", plannedDate: "30.01.2025", notes: "Запланирован" },
                ];
                data = [
                    {
                        id: 1,
                        prescriptionNum: "№ 44/2025",
                        unitName: "в/ч 00001",
                        violationSummary: "Нарушение порядка ведения кассовых операций (превышение лимита)",
                        assignmentOrder: "Приказ № 15 от 10.01.2025",
                        responsiblePerson: "подполковник Иванов А.С.",
                        result: "Вина установлена",
                        punishmentOrder: "Выговор, Приказ № 22",
                        amountToRecover: 1200000,
                        deadline: "15.02.2025",
                        status: "Завершено",
                        sourceViolationId: "V-001"
                    },
                    {
                        id: 2,
                        prescriptionNum: "№ 48/2025",
                        unitName: "в/ч 00002",
                        violationSummary: "Недостача инвентаря в столовой (посуда, столовые приборы)",
                        assignmentOrder: "Приказ № 18 от 15.01.2025",
                        responsiblePerson: "капитан Петров И.И.",
                        result: "Полная мат. ответственность",
                        punishmentOrder: "Взыскать 5 000 000 UZS",
                        amountToRecover: 50000000,
                        deadline: "20.02.2025",
                        status: "В процессе",
                        sourceViolationId: "V-002"
                    },
                    {
                        id: 3,
                        prescriptionNum: "№ 52/2025",
                        unitName: "в/ч 00003",
                        violationSummary: "Несвоевременная сдача отчетности в ГФЭУ",
                        assignmentOrder: "Приказ № 20 от 18.01.2025",
                        responsiblePerson: "майор Сидоров С.С.",
                        result: "В процессе",
                        punishmentOrder: "",
                        amountToRecover: 0,
                        deadline: "01.02.2025",
                        status: "Просрочено",
                    }
                ];
            }

            return {
                data,
                status: 200,
                statusText: 'OK',
                headers: {},
                config,
            };
        };
    }

    public get = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await this.instance.get<T>(url, config);
        return response as T;
    }

    public post = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
        const response = await this.instance.post<T>(url, data, config);
        return response as T;
    }

    public put = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
        const response = await this.instance.put<T>(url, data, config);
        return response as T;
    }

    public delete = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await this.instance.delete<T>(url, config);
        return response as T;
    }
}

export class Api<SecurityDataType = unknown> {
    constructor(private httpClient: HttpClient) { }

    public planning = {
        annual: {
            list: (params?: any) => this.httpClient.instance.get('/planning/annual', { params }),
            get: (id: string) => this.httpClient.instance.get(`/planning/annual/${id}`),
        },
        orders: {
            list: (params?: any) => this.httpClient.instance.get('/planning/orders', { params }),
            get: (id: string) => this.httpClient.instance.get(`/planning/orders/${id}`),
        }
    };

    public reference = {
        documentTypes: {
            list: (params?: any) => this.httpClient.get('/reference/document-types', { params }),
            create: (data: any) => this.httpClient.post('/reference/document-types', data),
            update: (id: string, data: any) => this.httpClient.put(`/reference/document-types/${id}`, data),
            delete: (id: string) => this.httpClient.delete(`/reference/document-types/${id}`),
        },
        units: {
            list: (params?: any) => this.httpClient.get('/reference/units', { params }),
            create: (data: any) => this.httpClient.post('/reference/units', data),
            update: (id: string, data: any) => this.httpClient.put(`/reference/units/${id}`, data),
            delete: (id: string) => this.httpClient.delete(`/reference/units/${id}`),
        },
        regions: {
            list: (params?: any) => this.httpClient.get('/reference/regions', { params }),
            create: (data: any) => this.httpClient.post('/reference/regions', data),
            update: (id: string, data: any) => this.httpClient.put(`/reference/regions/${id}`, data),
            delete: (id: string) => this.httpClient.delete(`/reference/regions/${id}`),
        },
        districts: {
            list: (params?: any) => this.httpClient.get('/reference/districts', { params }),
            create: (data: any) => this.httpClient.post('/reference/districts', data),
            update: (id: string, data: any) => this.httpClient.put(`/reference/districts/${id}`, data),
            delete: (id: string) => this.httpClient.delete(`/reference/districts/${id}`),
        },
        militaryDistricts: {
            list: (params?: any) => this.httpClient.get('/reference/military-districts', { params }),
            create: (data: any) => this.httpClient.post('/reference/military-districts', data),
            update: (id: string, data: any) => this.httpClient.put(`/reference/military-districts/${id}`, data),
            delete: (id: string) => this.httpClient.delete(`/reference/military-districts/${id}`),
        },
        positions: {
            list: (params?: any) => this.httpClient.get('/positions', { params }),
            create: (data: any) => this.httpClient.post('/positions', data),
            update: (id: string, data: any) => this.httpClient.put(`/positions/${id}`, data),
            delete: (id: string) => this.httpClient.delete(`/positions/${id}`),
        },
        vus: {
            list: (params?: any) => this.httpClient.get('/vus', { params }),
            create: (data: any) => this.httpClient.post('/vus', data),
            update: (id: string, data: any) => this.httpClient.put(`/vus/${id}`, data),
            delete: (id: string) => this.httpClient.delete(`/vus/${id}`),
        },
        supplyDepartments: {
            list: (params?: any) => this.httpClient.get('/supply-departments', { params }),
            create: (data: any) => this.httpClient.post('/supply-departments', data),
            update: (id: string, data: any) => this.httpClient.put(`/supply-departments/${id}`, data),
            delete: (id: string) => this.httpClient.delete(`/supply-departments/${id}`),
        }
    };

    public kpi = {
        stats: (params?: any) => this.httpClient.get('/kpi/stats', { params }),
        reports: (params?: any) => this.httpClient.get('/kpi/reports', { params }),
        calculate: (data: any) => this.httpClient.post('/kpi/calculate', data),
    };
}
