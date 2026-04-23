"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { useLawEnforcementCases, useServiceInvestigations } from "@/lib/hooks/use-audits"
import { LawEnforcementCaseDTO, ServiceInvestigationDTO } from "@/lib/types/audits.dto"
import { useMemo } from "react"

interface LegalTabProps {
    unitName: string
    unitNumber?: string
}

export function LegalTab({ unitName, unitNumber }: LegalTabProps) {
    const [subTab, setSubTab] = React.useState("investigations")
    const { data: allCases = [], isLoading: casesLoading } = useLawEnforcementCases()
    const { data: allInvestigations = [], isLoading: investigationsLoading } = useServiceInvestigations()

    const matchesUnit = (itemUnitName: string) => {
        const s = String(itemUnitName || "").toLowerCase()
        const searchName = String(unitName || "").toLowerCase()
        const searchNumber = String(unitNumber || "").toLowerCase()

        if (!searchName && !searchNumber) return false

        if (searchNumber && s.includes(searchNumber)) return true
        if (searchName && s.includes(searchName)) return true

        const sDigits = s.replace(/\D/g, "")
        const nameDigits = searchName.replace(/\D/g, "")
        const numberDigits = searchNumber.replace(/\D/g, "")

        if (sDigits && sDigits.length > 0) {
            if (nameDigits && sDigits.includes(nameDigits)) return true
            if (numberDigits && sDigits.includes(numberDigits)) return true
        }

        return false
    }

    const filteredCases = useMemo(() =>
        allCases.filter((c: LawEnforcementCaseDTO) => matchesUnit(c.unitName || "")),
        [allCases, unitName, unitNumber]
    )

    const filteredInvestigations = useMemo(() =>
        allInvestigations.filter((si: ServiceInvestigationDTO) => matchesUnit(si.unitName || "")),
        [allInvestigations, unitName, unitNumber]
    )

    if (casesLoading || investigationsLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Icons.Spinner className="w-8 h-8 animate-spin text-slate-300" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Tabs value={subTab} onValueChange={setSubTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="investigations" className="font-bold text-tiny uppercase tracking-widest">
                        <Icons.ShieldAlert className="w-4 h-4 mr-2" />
                        Служебные расследования
                    </TabsTrigger>
                    <TabsTrigger value="law-enforcement" className="font-bold text-tiny uppercase tracking-widest">
                        <Icons.Gavel className="w-4 h-4 mr-2" />
                        Правоохранительные органы
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="investigations">
                    <Card className="border-slate-200 shadow-sm overflow-hidden text-left">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                                    <Icons.ShieldAlert className="w-4 h-4 text-amber-500" />
                                    Реестр служебных расследований
                                </CardTitle>
                                <CardDescription className="text-tiny font-bold">Дисциплинарные меры по итогам проверок</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/30">
                                            <TableHead className="text-tiny font-black uppercase tracking-widest text-left">№ Предп.</TableHead>
                                            <TableHead className="text-tiny font-black uppercase tracking-widest text-left">Суть нарушения</TableHead>
                                            <TableHead className="text-tiny font-black uppercase tracking-widest text-left">Виновный</TableHead>
                                            <TableHead className="text-right text-tiny font-black uppercase tracking-widest">Сумма</TableHead>
                                            <TableHead className="text-center text-tiny font-black uppercase tracking-widest">Статус</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredInvestigations.length > 0 ? filteredInvestigations.map((si) => (
                                            <TableRow key={si.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="font-mono text-tiny font-bold text-amber-600 text-left">{si.prescriptionNum}</TableCell>
                                                <TableCell className="max-w-40 text-left">
                                                    <div className="text-tiny font-bold text-slate-800 line-clamp-1">{si.violationSummary}</div>
                                                    <div className="text-mini text-slate-400 font-bold uppercase">{si.assignmentOrder}</div>
                                                </TableCell>
                                                <TableCell className="text-tiny font-black text-slate-700 text-left">{si.responsiblePerson}</TableCell>
                                                <TableCell className="text-right text-tiny font-bold text-slate-900">{si.amountToRecover?.toLocaleString()}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={si.status === "Завершено" ? "default" : "secondary"} className="text-mini font-black uppercase tracking-tighter px-1.5 h-4">
                                                        {si.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-tiny font-black text-slate-400 uppercase tracking-widest">Нет активных расследований</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="law-enforcement">
                    <Card className="border-slate-200 shadow-sm overflow-hidden text-left">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                                    <Icons.Gavel className="w-4 h-4 text-rose-600" />
                                    Реестр материалов в правоохранительные органы
                                </CardTitle>
                                <CardDescription className="text-tiny font-bold">Материалы переданые в компетентные органы</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/30">
                                            <TableHead className="text-tiny font-black uppercase tracking-widest text-left">Исх. № / Дата</TableHead>
                                            <TableHead className="text-tiny font-black uppercase tracking-widest text-left">Тип нарушения</TableHead>
                                            <TableHead className="text-tiny font-black uppercase tracking-widest text-left">Орган</TableHead>
                                            <TableHead className="text-right text-tiny font-black uppercase tracking-widest">Сумма</TableHead>
                                            <TableHead className="text-center text-tiny font-black uppercase tracking-widest">Статус</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCases.length > 0 ? filteredCases.map((c) => (
                                            <TableRow key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="text-left">
                                                    <div className="text-tiny font-black text-slate-800 uppercase tracking-widest">{c.outgoingNumber}</div>
                                                    <div className="text-mini text-slate-400 font-bold">{c.outgoingDate}</div>
                                                </TableCell>
                                                <TableCell className="text-tiny font-bold text-slate-700 text-left">{c.type}</TableCell>
                                                <TableCell className="text-tiny font-bold text-slate-600 text-left">{c.recipientOrg}</TableCell>
                                                <TableCell className="text-right text-tiny font-black text-rose-600">{c.amount.toLocaleString()}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="text-mini font-black uppercase tracking-tighter px-1.5 h-4 border-rose-200 text-rose-700 bg-rose-50">
                                                        {c.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-tiny font-black text-slate-400 uppercase tracking-widest">Материалы не передавались</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
