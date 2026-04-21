import React from "react"

export interface Position {
    id: string
    title: string
    personName?: string
    photoUrl?: string
}

export interface Department {
    id: string
    name: string
    icon?: React.ReactNode
    iconName?: string
    positions: Position[]
    subDepartments?: Department[]
    imageUrl?: string
}

export const initialKruStructure: Department = {
    id: "root",
    name: "Контрольно-ревизионное управление",
    iconName: "Shield",
    positions: [
        { id: "pos-1", title: "Начальник управления", personName: "Генерал-майор Иванов И.И.", photoUrl: "/uploads/personnel/inspector-1.png" },
        { id: "pos-2", title: "Зам. нач. управления", personName: "Полковник Петров П.П." },
    ],
    subDepartments: [
        {
            id: "dept-1",
            name: "Организационно-методический отдел",
            iconName: "Settings",
            positions: [
                { id: "pos-1-1", title: "Начальник отдела" },
                { id: "pos-1-2", title: "Главный специалист" },
            ]
        },
        {
            id: "dept-2",
            name: "Отдел внутреннего аудита",
            iconName: "Check",
            positions: [
                { id: "pos-2-1", title: "Начальник отдела" },
                { id: "pos-2-2", title: "Главный специалист-аудитор" },
            ]
        },
        {
            id: "dept-3",
            name: "Отдел финансовой инспекции",
            iconName: "Dollar",
            positions: [
                { id: "pos-3-1", title: "Начальник отдела" },
                { id: "pos-3-2", title: "Старший инспектор-ревизор" },
            ]
        },
        {
            id: "dept-4",
            name: "Отдел инспекции МТО",
            iconName: "Package",
            positions: [
                { id: "pos-4-1", title: "Начальник отдела" },
                { id: "pos-4-2", title: "Старший инспектор-ревизор" },
            ]
        }
    ]
}
