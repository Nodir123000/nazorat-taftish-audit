"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"

interface GeneralTabProps {
    unit: any
}

export function GeneralTab({ unit }: GeneralTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Icons.FileText className="w-5 h-5 text-blue-600" />
                            Официальные данные
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 text-sm border-b pb-2">
                            <span className="text-muted-foreground">Условное наименование:</span>
                            <span className="font-semibold text-right">В/Ч {unit.unitNumber}</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm border-b pb-2">
                            <span className="text-muted-foreground">Действительное наим.:</span>
                            <span className="font-semibold text-right">{unit.name}</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm border-b pb-2">
                            <span className="text-muted-foreground">Дата формирования:</span>
                            <span className="font-semibold text-right">15.05.1992</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm border-b pb-2">
                            <span className="text-muted-foreground">Пункт дислокации:</span>
                            <span className="font-semibold text-right">{unit.city}</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                            <span className="text-muted-foreground">Подчиненность:</span>
                            <Badge className="ml-auto bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
                                {unit.militaryDistrict}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Icons.Shield className="w-5 h-5 text-blue-600" />
                            Боевое знамя и награды
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-lg text-sm italic text-slate-600 border-l-4 border-blue-500">
                            "За мужество и героизм, проявленные при выполнении государственных задач..."
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Icons.PieChart className="w-4 h-4 text-amber-500" />
                                <span>Орден "Шон-Шараф" I степени</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Icons.PieChart className="w-4 h-4 text-emerald-500" />
                                <span>Почетная грамота Министра обороны</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Краткая историческая справка</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
                        <p>
                            Сформирована в 1992 году на базе учебного центра. За годы существования личный состав части неоднократно принимал участие в крупномасштабных учениях "Жануб", "Шарк-2023" и в миротворческих миссиях.
                        </p>
                        <p className="mt-2">
                            В 2018 году часть была полностью перевооружена современными образцами техники и признана лучшей в своем округе по итогам боевой подготовки. Основная специализация — выполнение специальных задач в горно-лесистой местности.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
