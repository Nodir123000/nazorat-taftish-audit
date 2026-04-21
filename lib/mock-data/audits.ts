export interface LawEnforcementCase {
    id: string
    violationId: string
    sourceViolationId?: string // Link to Financial Audit finding
    type: "Хищение" | "Недостача ТМЦ" | "Злоупотребление" | "Отказ в допуске" | "Иное"
    outgoingNumber: string
    outgoingDate: string
    recipientOrg: "Военная прокуратура" | "СГБ" | "МВД" | "Департамент ГП"
    amount: number
    status: "На рассмотрении" | "Возбуждено УД" | "Отказано" | "Возвращено на доработку"
    caseNumber?: string
    decision?: "Осужден" | "Прекращему (реаб.)" | "Прекращено (нереаб.)" | "В процессе"
}

export interface ServiceInvestigation {
    id: string
    prescriptionNum: string
    sourceViolationId?: string // Link to Financial Audit finding
    unitName: string
    violationSummary: string
    deadline: string
    assignmentOrder: string
    responsiblePerson: string
    result: "Вина установлена" | "Вина не установлена" | "Ограниченная мат. ответственность" | "Полная мат. ответственность" | "В процессе"
    punishmentOrder?: string
    amountToRecover?: number
    status: "В процессе" | "Завершено" | "Просрочено"
}

export const mockLawEnforcementCases: LawEnforcementCase[] = [
    {
        id: "LEC-001",
        violationId: "V-777",
        sourceViolationId: "V-13", // Linked to Audit 7 finding
        type: "Хищение",
        outgoingNumber: "№123/спец",
        outgoingDate: "2024-01-20",
        recipientOrg: "Военная прокуратура",
        amount: 5000000,
        status: "Возбуждено УД",
        caseNumber: "№2024-УД-01",
        decision: "В процессе",
    },
    {
        id: "LEC-002",
        violationId: "V-888",
        type: "Злоупотребление",
        outgoingNumber: "№125/спец",
        outgoingDate: "2024-02-15",
        recipientOrg: "СГБ",
        amount: 1200000,
        status: "На рассмотрении",
    },
    {
        id: "LEC-003",
        violationId: "V-999",
        type: "Недостача ТМЦ",
        outgoingNumber: "№130/спец",
        outgoingDate: "2023-11-10",
        recipientOrg: "МВД",
        amount: 2500000,
        status: "Отказано",
        caseNumber: "М-45/2023",
    },
]

export const mockServiceInvestigations: ServiceInvestigation[] = [
    {
        id: "SI-001",
        prescriptionNum: "ПР-045",
        sourceViolationId: "V-1", // Linked to Audit 1 finding
        unitName: "в/ч 12345",
        violationSummary: "Утрата вещевого имущества",
        deadline: "2024-03-15",
        assignmentOrder: "№10 от 01.02.2024",
        responsiblePerson: "Майор Петров А.А.",
        result: "Вина установлена",
        punishmentOrder: "№15 от 10.02.2024",
        amountToRecover: 1500000,
        status: "Завершено",
    },
    {
        id: "SI-002",
        prescriptionNum: "ПР-046",
        sourceViolationId: "V-6", // Linked to Audit 4 finding
        unitName: "в/ч 67890",
        violationSummary: "Недостача ГСМ",
        deadline: "2024-04-10",
        assignmentOrder: "№12 от 15.03.2024",
        responsiblePerson: "Капитан Сидоров С.С.",
        result: "В процессе",
        status: "В процессе",
    },
    {
        id: "SI-003",
        prescriptionNum: "ПР-040",
        unitName: "в/ч 11111",
        violationSummary: "Нарушение учета продовольствия",
        deadline: "2024-01-01",
        assignmentOrder: "№5 от 05.12.2023",
        responsiblePerson: "Подполковник Иванов И.И.",
        result: "В процессе",
        status: "Просрочено",
    },
]
