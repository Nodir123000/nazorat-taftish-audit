"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"

interface LocationTabProps {
    unit: any
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-2 gap-4 py-1">
            <span className="text-sm text-slate-500 font-medium">{label}</span>
            <span className="text-sm text-slate-900 font-semibold text-right">{value || "—"}</span>
        </div>
    )
}

export function LocationTab({ unit }: LocationTabProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Icons.Map className="h-4 w-4" />
                        Территориальное расположение и подчиненность
                    </h3>
                </div>
                <CardContent className="p-6">
                    <div className="space-y-2">
                        <InfoRow label="Военный округ" value={unit.district} />
                        <Separator className="my-1 opacity-50" />
                        <InfoRow label="Регион" value={unit.region} />
                        <Separator className="my-1 opacity-50" />
                        <InfoRow label="Город/Населенный пункт" value={unit.city} />
                        <Separator className="my-1 opacity-50" />
                        <InfoRow label="Фактический адрес" value={unit.address} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Icons.Shield className="h-4 w-4" />
                        Оперативное управление
                    </h3>
                </div>
                <CardContent className="p-6">
                    <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-3 rounded-r-lg">
                        Данное подразделение находится в прямом подчинении Командующего войсками {unit.district}.
                        Все оперативные вопросы дислокации и перемещения согласуются с Генеральным штабом ВС РУз.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
