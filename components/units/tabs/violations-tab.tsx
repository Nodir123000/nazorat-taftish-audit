"use client"

import React, { useMemo, useState, Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ALL_SHORTAGES, ALL_THEFTS, ALL_EXPENSES, ALL_OVERPAYMENTS, ALL_UNDERPAYMENTS, ALL_FINANCIAL_REPAYMENTS, ALL_ASSET_REPAYMENTS } from "@/lib/data/financial-mock-data"
import { Icons } from "@/components/icons"

interface ViolationsTabProps {
    unitName: string
    unitNumber?: string
}

export function ViolationsTab({ unitName, unitNumber }: ViolationsTabProps) {
    const [subTab, setSubTab] = useState("financial")
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

    // Состояния фильтров
    const [filters, setFilters] = useState({
        search: "",
        amountFrom: "",
        amountTo: "",
        status: "all",
    })

    const financialViolations = useMemo(() => {
        const matchesUnit = (item: any) => {
            const itemUnit = String(item.unit || "").toLowerCase()
            const itemCurrentUnit = String(item.currentUnit || "").toLowerCase()

            const searchName = String(unitName || "").toLowerCase()
            const searchNumber = String(unitNumber || "").toLowerCase()

            if (!searchName && !searchNumber) return false

            const checkMatch = (s: string) => {
                if (!s) return false
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

            return checkMatch(itemUnit) || checkMatch(itemCurrentUnit)
        }

        const filteredByGlobal = (items: any[]) => items.filter(matchesUnit).filter(item => {
            const matchesSearch = filters.search
                ? (item.responsible || "").toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.actNumber || "").toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.paymentName || "").toLowerCase().includes(filters.search.toLowerCase())
                : true

            const amount = item.amountDetected || item.identifiedAmount || 0
            const matchesAmountFrom = filters.amountFrom ? amount >= Number(filters.amountFrom) : true
            const matchesAmountTo = filters.amountTo ? amount <= Number(filters.amountTo) : true
            const matchesStatus = filters.status !== "all" ? item.status === filters.status : true

            return matchesSearch && matchesAmountFrom && matchesAmountTo && matchesStatus
        })

        const shortages = filteredByGlobal(ALL_SHORTAGES).map(i => ({
            ...i,
            type: "Недостача",
            amountDetected: i.amountDetected,
            amountCompensated: i.amountCompensated,
            category: "shortages"
        }))
        const thefts = filteredByGlobal(ALL_THEFTS).map(i => ({
            ...i,
            type: i.type || "Хищение",
            amountDetected: i.amountDetected,
            amountCompensated: i.amountCompensated,
            category: "thefts"
        }))
        const expenses = filteredByGlobal(ALL_EXPENSES).map(i => ({
            ...i,
            type: i.expenseType || "Незаконные выплаты",
            category: "illegal-exp",
            amountDetected: i.identifiedAmount,
            amountCompensated: i.reimbursedAmount,
            detectionDate: i.date,
            responsible: i.responsiblePerson,
            actNumber: "—"
        }))
        const overpayments = filteredByGlobal(ALL_OVERPAYMENTS).map(i => ({
            ...i,
            type: i.overpaymentType || "Переплата",
            category: "overpay"
        }))
        const underpayments = filteredByGlobal(ALL_UNDERPAYMENTS).map(i => ({
            ...i,
            type: i.underpaymentType || "Недоплата",
            category: "decisions"
        }))

        return [...shortages, ...thefts, ...expenses, ...overpayments, ...underpayments]
    }, [unitName, unitNumber, filters])

    const assetViolations = useMemo(() => {
        const matchesUnit = (item: any) => {
            const itemUnit = String(item.unit || "").toLowerCase()
            const itemCurrentUnit = String(item.currentUnit || "").toLowerCase()

            const searchName = String(unitName || "").toLowerCase()
            const searchNumber = String(unitNumber || "").toLowerCase()

            if (!searchName && !searchNumber) return false

            const checkMatch = (s: string) => {
                if (!s) return false
                if (searchNumber && s.includes(searchNumber)) return true
                if (searchName && s.includes(searchName)) return true

                return false
            }

            return checkMatch(itemUnit) || checkMatch(itemCurrentUnit)
        }

        return ALL_SHORTAGES.filter(matchesUnit).filter(item => {
            const matchesSearch = filters.search
                ? (item.responsible || "").toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.actNumber || "").toLowerCase().includes(filters.search.toLowerCase())
                : true

            const amount = item.amountDetected || 0
            const matchesAmountFrom = filters.amountFrom ? amount >= Number(filters.amountFrom) : true
            const matchesAmountTo = filters.amountTo ? amount <= Number(filters.amountTo) : true
            const matchesStatus = filters.status !== "all" ? item.status === filters.status : true

            return matchesSearch && matchesAmountFrom && matchesAmountTo && matchesStatus
        })
    }, [unitName, unitNumber, filters])

    const getRepaymentTotal = (violationId: number, category: string) => {
        if (category === "overpay") {
            return ALL_FINANCIAL_REPAYMENTS.filter(r => r.overpaymentId === violationId).reduce((sum, r) => sum + r.repaidAmount, 0)
        } else {
            return ALL_ASSET_REPAYMENTS.filter(r => r.shortageId === violationId).reduce((sum, r) => sum + r.repaidAmount, 0)
        }
    }

    return (
        <Tabs value={subTab} onValueChange={setSubTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="financial">Финансовые</TabsTrigger>
                <TabsTrigger value="assets">Материальные</TabsTrigger>
            </TabsList>

            <TabsContent value="financial" className="mt-0 space-y-6">
                <Card className="border-slate-200 shadow-sm overflow-hidden text-left">
                    <CardHeader className="flex flex-row items-center justify-between pb-6 border-b bg-white">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-800 tracking-tight text-left">Реестр финансовых нарушений</CardTitle>
                            <CardDescription className="text-slate-400 font-medium tracking-tight text-left">В/Ч {unitName} • Всего записей: {financialViolations.length}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {financialViolations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80 border-b">
                                        <TableRow>
                                            <TableHead className="text-center w-12 font-bold text-[10px] uppercase text-slate-500 tracking-widest">ID</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase text-slate-500 tracking-widest pl-6 text-left">№ Акта и Дата</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase text-slate-500 tracking-widest text-left">Ответственный</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase text-slate-500 tracking-widest text-left">Тип / Причина</TableHead>
                                            <TableHead className="text-right font-bold text-[10px] uppercase text-slate-500 tracking-widest">Выявлено</TableHead>
                                            <TableHead className="text-right font-bold text-[10px] uppercase text-slate-500 tracking-widest">Возмещено</TableHead>
                                            <TableHead className="text-right font-bold text-[10px] uppercase text-slate-500 tracking-widest">Остаток</TableHead>
                                            <TableHead className="text-center font-bold text-[10px] uppercase text-slate-500 tracking-widest">Статус</TableHead>
                                            <TableHead className="text-center w-24 font-bold text-[10px] uppercase text-slate-500 tracking-widest">Детали</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {financialViolations.map((v: any, idx) => {
                                            const violationRepayments = ALL_FINANCIAL_REPAYMENTS.filter((r: any) => r.overpaymentId === v.id && v.category === "overpay")
                                            const isExpanded = expandedRows.has(v.id)
                                            const repaidTotal = getRepaymentTotal(v.id, v.category)
                                            const amountDetected = v.amountDetected || 0
                                            const amountCompensated = v.amountCompensated || 0
                                            const totalRecovered = amountCompensated + repaidTotal
                                            const remainder = amountDetected - totalRecovered

                                            return (
                                                <Fragment key={`${v.category}-${v.id}-${idx}`}>
                                                    <TableRow className="hover:bg-slate-50/50 group border-b last:border-0 transition-colors">
                                                        <TableCell className="font-mono text-[10px] text-center text-slate-400">{v.id}</TableCell>
                                                        <TableCell className="pl-6 text-left">
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-slate-800 tracking-tight text-sm">{v.actNumber}</span>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{v.detectionDate}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-left">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-700">{v.responsible || v.responsiblePerson || "—"}</span>
                                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter line-clamp-1">{v.responsiblePosition || "—"}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-left">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-700 text-sm">{v.type}</span>
                                                                {v.paymentName && <span className="text-[10px] text-slate-400 font-medium italic mt-0.5">{v.paymentName}</span>}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-black text-slate-900">
                                                            {amountDetected.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right font-black text-emerald-600">
                                                            {totalRecovered.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right font-black text-rose-600">
                                                            {remainder.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant={v.status === "Возвращено" || v.status === "Взыскано" ? "default" : "outline"} className="whitespace-nowrap font-bold text-[10px] py-0.5 px-2.5">
                                                                {v.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-center">
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100" onClick={() => {
                                                                    setExpandedRows((prev) => {
                                                                        const newSet = new Set(prev)
                                                                        if (newSet.has(v.id)) newSet.delete(v.id)
                                                                        else newSet.add(v.id)
                                                                        return newSet
                                                                    })
                                                                }}>
                                                                    {isExpanded ? (
                                                                        <Icons.ChevronUp className="h-4 w-4 text-slate-400" />
                                                                    ) : (
                                                                        <Icons.ChevronDown className="h-4 w-4 text-slate-400" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    {isExpanded && v.category === "overpay" && (
                                                        <TableRow className="bg-emerald-50/10 border-l-4 border-l-emerald-500 transition-all">
                                                            <TableCell colSpan={9} className="p-0">
                                                                <div className="p-6 ml-4">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="bg-emerald-100 p-2 rounded-xl">
                                                                                <Icons.History className="h-4 w-4 text-emerald-700" />
                                                                            </div>
                                                                            <h4 className="font-black text-emerald-900 text-xs uppercase tracking-widest pl-1">Детализация платежей</h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="rounded-2xl border border-emerald-100 overflow-hidden shadow-sm bg-white">
                                                                        <Table>
                                                                            <TableHeader>
                                                                                <TableRow className="bg-emerald-50/50 border-b border-emerald-100">
                                                                                    <TableHead className="h-10 text-[9px] uppercase font-black text-emerald-800 tracking-wider pl-4 text-left">Платёжный документ</TableHead>
                                                                                    <TableHead className="h-10 text-[9px] uppercase font-black text-emerald-800 tracking-wider text-left">№ / Дата</TableHead>
                                                                                    <TableHead className="h-10 text-[9px] uppercase font-black text-emerald-800 tracking-wider text-right">Сумма</TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {violationRepayments.length > 0 ? violationRepayments.map((r: any) => (
                                                                                    <TableRow key={r.id} className="hover:bg-slate-50 last:border-0 border-b border-emerald-50/50">
                                                                                        <TableCell className="py-3 text-[11px] font-bold text-slate-700 pl-4 text-left">{r.documentName}</TableCell>
                                                                                        <TableCell className="py-3 text-[11px] font-medium text-slate-500 text-left">{r.documentNumber} от {r.documentDate}</TableCell>
                                                                                        <TableCell className="py-3 text-[11px] text-right font-black text-emerald-600">{r.repaidAmount.toLocaleString()} сум</TableCell>
                                                                                    </TableRow>
                                                                                )) : (
                                                                                    <TableRow>
                                                                                        <TableCell colSpan={3} className="text-center py-8 text-[11px] text-slate-400 italic">
                                                                                            Погашений по данному акту не зафиксировано
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                )}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </Fragment>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-slate-50 border-b">
                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
                                    <Icons.Badge className="w-8 h-8 text-emerald-500/60" />
                                </div>
                                <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest text-left">Финансовых нарушений не найдено</h3>
                                <p className="text-slate-400 text-xs mt-2 font-medium text-left">По заданным критериям фильтрации данных не найдено.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="assets" className="mt-0 space-y-6">
                <Card className="border-slate-200 shadow-sm overflow-hidden text-left">
                    <CardHeader className="flex flex-row items-center justify-between pb-6 border-b bg-white">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-800 tracking-tight text-left">Реестр материальных нарушений</CardTitle>
                            <CardDescription className="text-slate-400 font-medium tracking-tight text-left">В/Ч {unitName} • Всего записей: {assetViolations.length}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {assetViolations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80 border-b">
                                        <TableRow>
                                            <TableHead className="text-center w-12 font-bold text-[10px] uppercase text-slate-500 tracking-widest">ID</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase text-slate-500 tracking-widest pl-6 text-left">№ Акта / Дата</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase text-slate-500 tracking-widest text-left">Ответственный</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase text-slate-500 tracking-widest text-left">Имущество / Вид нарушения</TableHead>
                                            <TableHead className="text-right font-bold text-[10px] uppercase text-slate-500 tracking-widest">Выявлено</TableHead>
                                            <TableHead className="text-right font-bold text-[10px] uppercase text-slate-500 tracking-widest">Возмещено</TableHead>
                                            <TableHead className="text-right font-bold text-[10px] uppercase text-slate-500 tracking-widest">Остаток</TableHead>
                                            <TableHead className="text-center font-bold text-[10px] uppercase text-slate-500 tracking-widest">Статус</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assetViolations.map((v: any, idx) => {
                                            const repaidTotal = getRepaymentTotal(v.id, "assets")
                                            const remainder = (v.amountDetected || 0) - (v.amountCompensated || 0) - repaidTotal

                                            return (
                                                <TableRow key={`asset-${v.id}`} className="hover:bg-slate-50 group border-b last:border-0 transition-colors">
                                                    <TableCell className="font-mono text-[10px] text-center text-slate-400">{v.id}</TableCell>
                                                    <TableCell className="pl-6 text-left">
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-slate-800 tracking-tight text-sm">{v.actNumber}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{v.detectionDate}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-left">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-700">{v.responsible}</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{v.responsiblePosition}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-left">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-700 text-sm">{v.assetName || "Имущество"}</span>
                                                            <span className="text-[10px] text-slate-400 font-medium italic mt-0.5">{v.shortageType || "Недостача"}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-black text-slate-900">
                                                        {v.amountDetected?.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-right font-black text-emerald-600">
                                                        {(v.amountCompensated + repaidTotal).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-right font-black text-rose-600">
                                                        {remainder.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant={v.status === "Возвращено" ? "default" : "outline"} className="font-bold text-[10px]">
                                                            {v.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 border-b">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] text-left">Материальных средств не выявлено</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
