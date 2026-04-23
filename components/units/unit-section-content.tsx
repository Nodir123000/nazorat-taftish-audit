"use client"

import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { MilitaryUnit } from "@/lib/mock-data/units"
import { UnitSection } from "./unit-navigation"

interface UnitSectionContentProps {
    section: UnitSection
    unit: MilitaryUnit
}

function InfoRow({ label, value }: { label: string; value: string | ReactNode }) {
    return (
        <div className="grid grid-cols-2 gap-4 py-0.5">
            <span className="text-sm text-slate-500 font-medium">{label}</span>
            <span className="text-sm text-slate-900">{value || "—"}</span>
        </div>
    )
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: any }) {
    return (
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800">
            <Icon className="h-5 w-5 text-blue-600" />
            {title}
        </h3>
    )
}

export function UnitSectionContent({ section, unit }: UnitSectionContentProps) {
    switch (section) {
        case "general":
            return (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <SectionHeader title="Общая информация" icon={Icons.FileText} />
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="py-2 border-slate-200">
                            <CardContent className="p-3">
                                <InfoRow label="Код части" value={<span className="font-bold text-blue-600">{unit.unitCode}</span>} />
                                <Separator className="my-1 opacity-50" />
                                <InfoRow label="Наименование" value={unit.name} />
                                <Separator className="my-1 opacity-50" />
                                <InfoRow label="Полное название" value={unit.fullName} />
                                <Separator className="my-1 opacity-50" />
                                <InfoRow label="Тип подразделения" value={unit.type} />
                                <Separator className="my-1 opacity-50" />
                                <InfoRow label="Специализация" value={unit.specialization} />
                            </CardContent>
                        </Card>
                        <Card className="py-2 border-slate-200">
                            <CardContent className="p-3">
                                <InfoRow label="Статус" value={unit.status === 'active' ? "Активна" : "Неактивна"} />
                                <Separator className="my-1 opacity-50" />
                                <InfoRow label="Дата последней ревизии" value={unit.lastAuditDate} />
                                <Separator className="my-1 opacity-50" />
                                <InfoRow label="Результат ревизии" value={unit.lastAuditStatus} />
                                <Separator className="my-1 opacity-50" />
                                <InfoRow label="Контактный телефон" value={unit.contactPhone} />
                                <Separator className="my-1 opacity-50" />
                                <InfoRow label="Электронная почта" value={unit.email} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )
        case "location":
            return (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <SectionHeader title="Расположение" icon={Icons.Map} />
                    <Card className="py-2 border-slate-200">
                        <CardContent className="p-3">
                            <InfoRow label="Военный округ" value={unit.district} />
                            <Separator className="my-1 opacity-50" />
                            <InfoRow label="Регион" value={unit.region} />
                            <Separator className="my-1 opacity-50" />
                            <InfoRow label="Город/Населенный пункт" value={unit.city} />
                            <Separator className="my-1 opacity-50" />
                            <InfoRow label="Фактический адрес" value={unit.address} />
                        </CardContent>
                    </Card>
                </div>
            )
        case "command":
            return (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <SectionHeader title="Командование" icon={Icons.User} />
                    <Card className="py-2 border-slate-200">
                        <CardContent className="p-3">
                            <InfoRow label="ФИО Командира" value={unit.commanderName} />
                            <Separator className="my-1 opacity-50" />
                            <InfoRow label="Воинское звание" value={unit.commanderRank} />
                            <Separator className="my-1 opacity-50" />
                            <InfoRow label="Срок пребывания в должности" value="С 15.06.2022" />
                        </CardContent>
                    </Card>
                </div>
            )
        case "personnel":
            return (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <SectionHeader title="Личный состав" icon={Icons.Users} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-slate-50 border-none shadow-sm h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-black text-slate-800">{unit.personnelCount}</span>
                                <span className="text-tiny uppercase font-bold text-slate-400 tracking-wider">Всего штата</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-emerald-50 border-none shadow-sm h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-black text-emerald-600">432</span>
                                <span className="text-tiny uppercase font-bold text-emerald-400 tracking-wider">В наличии</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-amber-50 border-none shadow-sm h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-black text-amber-600">18</span>
                                <span className="text-tiny uppercase font-bold text-amber-400 tracking-wider">Вакант</span>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-bold text-tiny uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">ФИО</th>
                                    <th className="px-4 py-3 text-left">Звание</th>
                                    <th className="px-4 py-3 text-left">Должность</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="px-4 py-3 font-medium">Абдуллаев О.Х.</td>
                                    <td className="px-4 py-3 text-slate-600">Полковник</td>
                                    <td className="px-4 py-3 text-slate-600">Командир части</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Ибрагимов С.А.</td>
                                    <td className="px-4 py-3 text-slate-600">Подполковник</td>
                                    <td className="px-4 py-3 text-slate-600">Нач. штаба</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Каримов Д.Р.</td>
                                    <td className="px-4 py-3 text-slate-600">Майор</td>
                                    <td className="px-4 py-3 text-slate-600">Зам по тылу</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        case "audits":
            return (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <SectionHeader title="История ревизий" icon={Icons.Search} />
                    <div className="space-y-3">
                        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Плановая ревизия ФХД</div>
                                    <div className="text-xs text-slate-500 italic">Период: 01.01.2023 - 31.12.2023</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-emerald-600">Успешно</div>
                                    <div className="text-tiny text-slate-400">15.12.2023</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-amber-500 shadow-sm opacity-80">
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Внеплановая проверка ГСМ</div>
                                    <div className="text-xs text-slate-500 italic">Период: 15.05.2022 - 20.06.2022</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-amber-600">Замечания</div>
                                    <div className="text-tiny text-slate-400">22.06.2022</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )
        case "violations":
            return (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <SectionHeader title="Реестр нарушений" icon={Icons.AlertCircle} />
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 text-center">
                        <Icons.CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                        <h4 className="font-bold text-slate-800">Активных нарушений не выявлено</h4>
                        <p className="text-xs text-slate-500 mt-1">Все ранее выявленные недостатки устранены в установленные сроки.</p>
                    </div>
                </div>
            )
        case "kpi":
            return (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <SectionHeader title="Рейтинг KPI" icon={Icons.BarChart} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-600 uppercase">Финансовая дисциплина</span>
                                    <span className="text-xs font-black text-blue-600">98%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full" style={{ width: '98%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-600 uppercase">Обеспеченность СИЗ</span>
                                    <span className="text-xs font-black text-amber-600">82%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full" style={{ width: '82%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-600 uppercase">Уровень подготовки</span>
                                    <span className="text-xs font-black text-emerald-600">95%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{ width: '95%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-indigo-600 rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center shadow-xl shadow-indigo-200">
                            <span className="text-4xl font-black mb-1">92.4</span>
                            <span className="text-tiny uppercase font-bold tracking-widest opacity-80">Итоговый балл (2024)</span>
                            <div className="mt-4 px-3 py-1 bg-white/20 rounded-full text-tiny font-bold">
                                4 место в округе
                            </div>
                        </div>
                    </div>
                </div>
            )
        default:
            return (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-in fade-in duration-500">
                    <Icons.Shield className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">Раздел "{section}" находится в разработке</p>
                    <p className="text-sm">Скоро здесь появится детальная информация</p>
                </div>
            )
    }
}
