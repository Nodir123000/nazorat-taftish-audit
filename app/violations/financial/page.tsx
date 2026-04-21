"use client"

import { useState, useMemo, useCallback, Fragment } from "react"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ALL_SHORTAGES, ALL_THEFTS, ALL_EXPENSES, ALL_OVERPAYMENTS, ALL_UNDERPAYMENTS, ALL_FINANCIAL_REPAYMENTS } from "@/lib/data/financial-mock-data"
import { VIOLATION_TYPES } from "@/lib/constants/violation-types"
import * as XLSX from "xlsx"
import { getDistrictAbbreviation } from "@/lib/utils"

function AllViolationsContent() {
    const [filter, setFilter] = useState("")

    // Normalize and combine data
    const allViolations = useMemo(() => {
        const shortages = ALL_SHORTAGES.map(i => ({
            ...i,
            type: "Недостача",
            rawDate: i.detectionDate,
            amount: i.amountDetected,
            recovered: i.amountCompensated,
            category: "shortages"
        }))
        const thefts = ALL_THEFTS.map(i => ({
            ...i,
            type: i.type || "Хищение",
            rawDate: i.detectionDate,
            amount: i.amountDetected,
            recovered: i.amountCompensated,
            category: "thefts"
        }))
        const expenses = ALL_EXPENSES.map(i => ({
            ...i,
            type: i.expenseType || "Незаконные выплаты",
            rawDate: i.date, // Note: format might differ (YYYY-MM-DD vs DD.MM.YYYY)
            amount: i.identifiedAmount,
            recovered: i.reimbursedAmount,
            actNumber: "—", // Expenses don't have actNumber in mock?
            category: "illegal-exp"
        }))
        const overpayments = ALL_OVERPAYMENTS.map(i => ({
            ...i,
            type: i.overpaymentType || "Переплата",
            rawDate: i.detectionDate,
            amount: i.amountDetected,
            recovered: i.amountCompensated,
            category: "overpay"
        }))
        const underpayments = ALL_UNDERPAYMENTS.map(i => ({
            ...i,
            type: i.underpaymentType || "Недоплата",
            rawDate: i.detectionDate,
            amount: i.amountDetected,
            recovered: i.amountCompensated,
            category: "decisions" // using the existing id for underpayments
        }))

        return [...shortages, ...thefts, ...expenses, ...overpayments, ...underpayments]
            .filter(item => {
                if (!filter) return true
                const searchStr = filter.toLowerCase()
                return (
                    item.unit?.toLowerCase().includes(searchStr) ||
                    item.actNumber?.toLowerCase().includes(searchStr) ||
                    item.type.toLowerCase().includes(searchStr)
                )
            })
    }, [filter])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Реестр финансовых нарушений</CardTitle>
                <CardDescription>Сводный реестр всех нарушений</CardDescription>
                <div className="pt-4">
                    <Input
                        placeholder="Поиск по части, номеру акта или типу..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="max-w-md"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Тип нарушения</TableHead>
                                <TableHead>№ акта / Дата</TableHead>
                                <TableHead>Воинская часть</TableHead>
                                <TableHead className="text-center">Источник</TableHead>
                                <TableHead className="text-right">Сумма (сум)</TableHead>
                                <TableHead className="text-right">Возмещено (сум)</TableHead>
                                <TableHead>Статус</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allViolations.map((item, idx) => (
                                <TableRow key={`${item.category}-${item.id}-${idx}`}>
                                    <TableCell className="font-medium">{item.type}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{item.actNumber}</span>
                                            <span className="text-xs text-muted-foreground">{item.rawDate}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell className="text-center">{item.source || "—"}</TableCell> {/* New TableCell for Source */}
                                    <TableCell className="text-right font-mono">
                                        {item.amount?.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-green-600">
                                        {item.recovered?.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}


export default function FinancialViolationsPage() {

    return (
        <div className="flex flex-col gap-6">
            <div className="p-6"><OverpayContent /></div>
        </div>
    )
}

function OverpayContent() {
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showViewDialog, setShowViewDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showRepaymentDialog, setShowRepaymentDialog] = useState(false)
    const [showEditRepaymentDialog, setShowEditRepaymentDialog] = useState(false)
    const [selectedRepayment, setSelectedRepayment] = useState<any>(null)
    const [selectedOverpayment, setSelectedOverpayment] = useState<any>(null)
    const [repayments, setRepayments] = useState<any[]>(ALL_FINANCIAL_REPAYMENTS)
    const [repaymentForm, setRepaymentForm] = useState({
        djArticle: "",
        documentName: "",
        documentDate: "",
        repaidAmount: "",
        documentNumber: "",
    })
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [filters, setFilters] = useState({
        search: "",
        amountFrom: "",
        amountTo: "",
        status: "all",
    })
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
    const [viewMode, setViewMode] = useState<"list" | "districts" | "payments" | "types">("list")

    const overpayments = ALL_OVERPAYMENTS;

    const filteredOverpayments = useMemo(() => {
        return overpayments.filter((overpayment) => {
            const matchesSearch = filters.search
                ? overpayment.unit.toLowerCase().includes(filters.search.toLowerCase()) ||
                overpayment.responsible.toLowerCase().includes(filters.search.toLowerCase())
                : true

            const matchesAmountFrom = filters.amountFrom
                ? overpayment.amountDetected >= Number.parseFloat(filters.amountFrom)
                : true

            const matchesAmountTo = filters.amountTo
                ? overpayment.amountDetected <= Number.parseFloat(filters.amountTo)
                : true

            const matchesStatus = filters.status !== "all" ? overpayment.status === filters.status : true

            return matchesSearch && matchesAmountFrom && matchesAmountTo && matchesStatus
        })
    }, [filters, overpayments])

    const groupedOverpayments = useMemo(() => {
        const grouped: Record<string, typeof overpayments> = {}
        filteredOverpayments.forEach(item => {
            let key = ""
            if (viewMode === "districts") key = item.unitDistrict || "Не указан округ"
            else if (viewMode === "payments") key = item.paymentName || "Не указана выплата"
            else if (viewMode === "types") key = item.overpaymentType || "Не указан тип"

            if (!grouped[key]) grouped[key] = []
            grouped[key].push(item)
        })
        return grouped
    }, [filteredOverpayments, viewMode])

    const handleResetFilters = () => {
        setFilters({
            search: "",
            amountFrom: "",
            amountTo: "",
            status: "all",
        })
    }

    const toggleRowExpansion = useCallback((id: number) => {
        setExpandedRows((prev) => {
            const newExpanded = new Set(prev)
            if (newExpanded.has(id)) {
                newExpanded.delete(id)
            } else {
                newExpanded.add(id)
            }
            return newExpanded
        })
    }, [])

    const toggleItemSelection = useCallback((id: number) => {
        setSelectedItems((prev) => {
            const newSelected = new Set(prev)
            if (newSelected.has(id)) {
                newSelected.delete(id)
            } else {
                newSelected.add(id)
            }
            return newSelected
        })
    }, [])

    const getOverpaymentRepayments = (overpaymentId: number) => {
        return repayments.filter((r) => r.overpaymentId === overpaymentId)
    }

    const handleView = (overpayment: any) => {
        setSelectedItem(overpayment)
        setShowViewDialog(true)
    }

    const handleEdit = (overpayment: any) => {
        setSelectedItem(overpayment)
        setShowEditDialog(true)
    }

    const handleAddRepayment = (overpayment: any) => {
        setSelectedOverpayment(overpayment)
        setRepaymentForm({
            djArticle: "",
            documentName: "",
            documentNumber: "",
            documentDate: "",
            repaidAmount: "",
        })
        setShowRepaymentDialog(true)
    }

    const handleEditRepayment = (repayment: any) => {
        setSelectedRepayment(repayment)
        setRepaymentForm({
            djArticle: repayment.djArticle || "",
            documentName: repayment.documentName || "",
            documentNumber: repayment.documentNumber || "",
            documentDate: repayment.documentDate || "",
            repaidAmount: repayment.repaidAmount?.toString() || "",
        })
        setShowEditRepaymentDialog(true)
    }

    const getOverpaymentRepaidTotal = (overpaymentId: number) => {
        const itemRepayments = repayments.filter((r) => r.overpaymentId === overpaymentId)
        return itemRepayments.reduce((sum, r) => sum + r.repaidAmount, 0)
    }

    const getOverpaymentRemainder = (overpayment: any) => {
        const repaidTotal = getOverpaymentRepaidTotal(overpayment.id)
        return overpayment.amountToRecover - overpayment.amountCompensated - repaidTotal
    }

    const handleSaveRepayment = () => {
        if (selectedOverpayment) {
            const newRepayment = {
                id: repayments.length + 1,
                overpaymentId: selectedOverpayment.id,
                djArticle: repaymentForm.djArticle,
                documentName: repaymentForm.documentName,
                documentNumber: repaymentForm.documentNumber,
                documentDate: repaymentForm.documentDate,
                repaidAmount: Number.parseFloat(repaymentForm.repaidAmount),
                remainder: getOverpaymentRemainder(selectedOverpayment) - Number.parseFloat(repaymentForm.repaidAmount)
            }
            // Update the remainder in the repayment object itself if needed, 
            // but relying on getOverpaymentRemainder for the parent table is safer.
            // For the specific repayment row "Remainder" column, it usually means "Remainder AFTER this repayment".

            setRepayments([...repayments, newRepayment])
            setRepaymentForm({
                djArticle: "",
                documentName: "",
                documentDate: "",
                repaidAmount: "",
                documentNumber: "",
            })
            setShowRepaymentDialog(false)
        }
    }

    const handleSaveEditedRepayment = () => {
        if (selectedRepayment) {
            const updatedRepayments = repayments.map((r) =>
                r.id === selectedRepayment.id
                    ? {
                        ...r,
                        djArticle: repaymentForm.djArticle,
                        documentName: repaymentForm.documentName,
                        documentNumber: repaymentForm.documentNumber,
                        documentDate: repaymentForm.documentDate,
                        repaidAmount: Number.parseFloat(repaymentForm.repaidAmount),
                        // Remainder logic for individual history rows is complex (snapshot vs current). 
                        // Simplified: update the amount.
                    }
                    : r
            )
            setRepayments(updatedRepayments)
            setRepaymentForm({
                djArticle: "",
                documentName: "",
                documentDate: "",
                repaidAmount: "",
                documentNumber: "",
            })
            setShowEditRepaymentDialog(false)
        }
    }

    const handleDeleteRepayment = (repaymentId: number) => {
        if (confirm("Вы уверены, что хотите удалить это погашение?")) {
            setRepayments((prev) => prev.filter((r) => r.id !== repaymentId))
        }
    }

    const handleExportToPDF = (overpaymentId: number) => {
        alert(`Экспорт погашений для переплаты ID ${overpaymentId} в PDF`)
    }

    // ... existing imports

    // ... inside OverpayContent

    const handlePrint = () => {
        window.print()
    }

    const handleExportExcel = () => {
        let dataToExport: any[] = []

        if (viewMode === "list") {
            dataToExport = filteredOverpayments
        } else {
            Object.keys(groupedOverpayments).forEach(key => {
                dataToExport.push({ isGroupHeader: true, title: key })
                dataToExport = [...dataToExport, ...groupedOverpayments[key]]
            })
        }

        const exportData = dataToExport.map((item: any) => {
            if (item.isGroupHeader) {
                return {
                    "ID": item.title.toUpperCase(),
                    "№ Акта": "",
                    "Воинская часть": "",
                    "Ответственный": "",
                    "Наименование выплаты": "",
                    "Вид нарушения": "",
                    "Источник": "",
                    "Сумма выявленная": "",
                    "Сумма возмещена": "",
                    "Остаток": "",
                    "Статус": "",
                }
            }

            return {
                "ID": item.id,
                "№ Акта": `${item.actNumber} (${item.detectionDate})`,
                "Воинская часть": `${item.unit}\n${item.unitDistrict}`,
                "Ответственный": `${item.responsible}\n${item.responsiblePosition}`,
                "Наименование выплаты": item.paymentName,
                "Вид нарушения": item.overpaymentType,
                "Источник": item.source,
                "Сумма выявленная": item.amountDetected,
                "Сумма возмещена": item.amountCompensated,
                "Остаток": item.amountToRecover - item.amountCompensated - getOverpaymentRepaidTotal(item.id),
                "Статус": item.status,
            }
        })

        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Переплаты")
        XLSX.writeFile(wb, `financial_violations_${viewMode}_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    const handleAddRecord = () => {
        setShowAddDialog(true)
    }

    const renderTable = (items: typeof overpayments) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead className="text-center">№ акта <br /> и дата</TableHead>
                    <TableHead className="text-center">Воинская часть</TableHead>
                    <TableHead className="text-center">Получатель</TableHead>
                    <TableHead className="text-center">
                        Наименование <br /> выплаты
                    </TableHead>
                    <TableHead className="text-center">Вид нарушения</TableHead>
                    <TableHead className="text-center">Источник</TableHead>
                    <TableHead className="text-center">
                        Сумма <br /> выявленная
                    </TableHead>
                    <TableHead className="text-center">
                        Сумма <br /> возмещена
                    </TableHead>
                    <TableHead className="text-center">Остаток</TableHead>
                    <TableHead className="text-center">Статус</TableHead>
                    <TableHead className="text-center">Действия</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((overpayment) => {
                    const overpaymentRepayments = getOverpaymentRepayments(overpayment.id)
                    const isExpanded = expandedRows.has(overpayment.id)
                    const isSelected = selectedItems.has(overpayment.id)

                    return (
                        <Fragment key={overpayment.id}>
                            <TableRow key={overpayment.id} className={isSelected ? "bg-muted/50" : ""}>
                                <TableCell className="font-mono">{overpayment.id}</TableCell>
                                <TableCell className="align-top">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex flex-col cursor-help">
                                                    <span className="font-medium">{overpayment.actNumber}</span>
                                                    <span className="text-xs text-muted-foreground">{overpayment.detectionDate}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{overpayment.unit}</p>
                                                <p>{overpayment.unitDistrict}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-[15px] font-semibold" style={{ color: "#222" }}>
                                            {overpayment.unit}
                                        </div>
                                        <div className="text-[13px]" style={{ color: "#777" }}>
                                            {getDistrictAbbreviation(overpayment.unitDistrict)}
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-[15px] font-semibold" style={{ color: "#222" }}>
                                            {overpayment.responsible}
                                        </div>
                                        <div className="text-[13px]" style={{ color: "#777" }}>
                                            {overpayment.responsiblePosition}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{overpayment.paymentName}</span>
                                        <span className="text-xs text-muted-foreground">{overpayment.paymentCategory || "Денежные довольствия"}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-[13px] items-center text-red-500 flex flex-col">
                                    {overpayment.overpaymentType.split(" ").map((word: string, index: number) => {
                                        // If word is longer than 10 characters — insert a <br /> halfway
                                        if (word.length > 20) {
                                            const mid = Math.ceil(word.length / 2)
                                            return (
                                                <span key={index}>
                                                    {word.slice(0, mid)}
                                                    <br />
                                                    {word.slice(mid)}{" "}
                                                </span>
                                            )
                                        }
                                        // otherwise return normally
                                        return <span key={index}>{word} </span>
                                    })}
                                </TableCell>
                                <TableCell className="text-center">{overpayment.source || "—"}</TableCell>
                                <TableCell className="font-semibold">
                                    {overpayment.amountDetected.toLocaleString()} cум
                                </TableCell>
                                <TableCell className="font-semibold text-green-600">
                                    {overpayment.amountCompensated.toLocaleString()} cум
                                </TableCell>
                                <TableCell className="font-semibold">
                                    {(overpayment.amountToRecover - overpayment.amountCompensated - getOverpaymentRepaidTotal(overpayment.id)).toLocaleString()} cум
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            overpayment.status === "Возвращено"
                                                ? "default"
                                                : overpayment.status === "В работе"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                    >
                                        {overpayment.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 items-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleRowExpansion(overpayment.id)}
                                            title={isExpanded ? "Скрыть погашения" : "Показать погашения"}
                                        >
                                            {isExpanded ? (
                                                <Icons.ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <Icons.ChevronDown className="h-4 w-4" />
                                            )}
                                            {overpaymentRepayments.length > 0 && (
                                                <span className="ml-1 text-xs">({overpaymentRepayments.length})</span>
                                            )}
                                        </Button>

                                        <Button variant="ghost" size="sm" onClick={() => handleAddRepayment(overpayment)}>
                                            <Icons.Plus className="h-4 w-4 mr-1 text-red-500" />
                                        </Button>
                                        <Select>
                                            <SelectTrigger className="w-[70px] h-8">
                                                {/* <SelectValue placeholder="..." /> */}
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="show">
                                                    Просмотр
                                                    <Button variant="ghost" size="sm" onClick={() => handleView(overpayment)}>
                                                        <Icons.Eye className="h-4 w-4" />
                                                    </Button>
                                                </SelectItem>
                                                <SelectItem value="edit">
                                                    Редактировать
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(overpayment)}>
                                                        <Icons.Edit className="h-4 w-4" />
                                                    </Button>
                                                </SelectItem>
                                                <SelectItem value="export">Экспорт</SelectItem>
                                                <SelectItem value="print">Печать</SelectItem>
                                                <SelectItem value="archive">Архивировать</SelectItem>
                                                <SelectItem value="delete">Удалить</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {isExpanded && overpaymentRepayments.length > 0 && (
                                <TableRow className="bg-green-50/50 hover:bg-green-50/70">
                                    <TableCell colSpan={12} className="p-0">
                                        <div className="p-4 border-l-4 border-green-500">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Icons.FileText className="h-4 w-4 text-green-700" />
                                                    <h4 className="font-semibold text-green-900">
                                                        Реестр погашений для акта {overpayment.actNumber}
                                                    </h4>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleExportToPDF(overpayment.id)}
                                                    className="gap-2"
                                                >
                                                    <Icons.FileText className="h-4 w-4" />
                                                    Экспорт в PDF
                                                </Button>
                                            </div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-green-100/50">
                                                        <TableHead className="text-green-900">Статья ДЖ</TableHead>
                                                        <TableHead className="text-green-900">Наименование документа</TableHead>
                                                        <TableHead className="text-green-900">№ документа</TableHead>
                                                        <TableHead className="text-green-900">Дата документа</TableHead>
                                                        <TableHead className="text-green-900">Погашенная сумма</TableHead>
                                                        <TableHead className="text-green-900">Остаток</TableHead>
                                                        <TableHead className="text-green-900">Действия</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {overpaymentRepayments.map((repayment) => (
                                                        <TableRow key={repayment.id} className="bg-white">
                                                            <TableCell>{repayment.djArticle}</TableCell>
                                                            <TableCell>{repayment.documentName}</TableCell>
                                                            <TableCell>{repayment.documentNumber}</TableCell>
                                                            <TableCell>{repayment.documentDate}</TableCell>
                                                            <TableCell className="font-semibold text-green-600">
                                                                {repayment.repaidAmount.toLocaleString()} cум
                                                            </TableCell>
                                                            <TableCell className="font-semibold">
                                                                {repayment.remainder.toLocaleString()} cум
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleEditRepayment(repayment)}
                                                                        title="Редактировать"
                                                                    >
                                                                        <Icons.Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteRepayment(repayment.id)}
                                                                        title="Удалить"
                                                                        className="text-destructive hover:text-destructive"
                                                                    >
                                                                        <Icons.Trash className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </Fragment>
                    )
                })}
            </TableBody >
        </Table >
    )

    return (
        <div className="space-y-6">

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 print:hidden">
                <Card className="relative overflow-hidden border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-cyan-900">Всего переплат</CardTitle>
                        <div className="rounded-full bg-cyan-200 p-2 ring-2 ring-cyan-300">
                            <Icons.TrendingUp className="h-5 w-5 text-cyan-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-cyan-900">{overpayments.length}</div>
                        <p className="text-xs text-cyan-700 font-medium">Выявлено</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-sky-900">Общая сумма</CardTitle>
                        <div className="rounded-full bg-sky-200 p-2 ring-2 ring-sky-300">
                            <Icons.DollarSign className="h-5 w-5 text-sky-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-sky-900">
                            {overpayments.reduce((sum, o) => sum + o.amountDetected, 0).toLocaleString()} cум
                        </div>
                        <p className="text-xs text-sky-700 font-medium">Переплачено</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-lime-200 bg-gradient-to-br from-lime-50 to-lime-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-lime-900">Возвращено</CardTitle>
                        <div className="rounded-full bg-lime-200 p-2 ring-2 ring-lime-300">
                            <Icons.Check className="h-5 w-5 text-lime-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-lime-900">
                            {overpayments.filter((o) => o.status === "Возвращено").length}
                        </div>
                        <p className="text-xs text-lime-700 font-medium">Случаев</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-yellow-900">Частично</CardTitle>
                        <div className="rounded-full bg-yellow-200 p-2 ring-2 ring-yellow-300">
                            <Icons.PieChart className="h-5 w-5 text-yellow-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-900">
                            {overpayments.filter((o) => o.amountCompensated > 0 && o.amountCompensated < o.amountDetected).length}
                        </div>
                        <p className="text-xs text-yellow-700 font-medium">Возмещено</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-red-900">В процессе</CardTitle>
                        <div className="rounded-full bg-red-200 p-2 ring-2 ring-red-300">
                            <Icons.Clock className="h-5 w-5 text-red-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-900">
                            {overpayments.filter((o) => o.status === "В работе").length}
                        </div>
                        <p className="text-xs text-red-700 font-medium">Возврата</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-purple-900">Крупные</CardTitle>
                        <div className="rounded-full bg-purple-200 p-2 ring-2 ring-purple-300">
                            <Icons.AlertCircle className="h-5 w-5 text-purple-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-900">
                            {overpayments.filter((o) => o.amountDetected > 5000000).length}
                        </div>
                        <p className="text-xs text-purple-700 font-medium">&gt; 5 млн сум</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="print:hidden">
                    <CardTitle>Фильтры</CardTitle>
                    <CardDescription>Поиск и фильтрация переплат</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Input
                            placeholder="Поиск по части или получателю..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                        <Input
                            placeholder="Сумма от..."
                            type="number"
                            value={filters.amountFrom}
                            onChange={(e) => setFilters({ ...filters, amountFrom: e.target.value })}
                        />
                        <Input
                            placeholder="Сумма до..."
                            type="number"
                            value={filters.amountTo}
                            onChange={(e) => setFilters({ ...filters, amountTo: e.target.value })}
                        />

                        {/* селект статуса + кнопка сброса в одной колонке */}
                        <div className="flex items-center gap-2">
                            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Все статусы" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все статусы</SelectItem>
                                    <SelectItem value="Возвращено">Возвращено</SelectItem>
                                    <SelectItem value="В работе">В работе</SelectItem>
                                    <SelectItem value="Выявлено">Выявлено</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Режим отображения" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="list">Список</SelectItem>
                                    <SelectItem value="districts">По округам</SelectItem>
                                    <SelectItem value="payments">По наименованию выплаты</SelectItem>
                                    <SelectItem value="types">По виду нарушения</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" onClick={handleResetFilters} className="shrink-0 h-10 px-4 bg-transparent">
                                Сбросить
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Реестр переплат</CardTitle>
                            <CardDescription>Всего записей: {filteredOverpayments.length}</CardDescription>
                        </div>
                        <div className="flex gap-2 print:hidden">
                            <Button variant="outline" onClick={handleExportExcel}>
                                <Icons.Download className="mr-2 h-4 w-4" />
                                Excel
                            </Button>
                            <Button variant="outline" onClick={handlePrint}>
                                <Icons.Printer className="mr-2 h-4 w-4" />
                                Печать
                            </Button>
                            <Button onClick={() => setShowAddDialog(true)}>
                                <Icons.Plus className="mr-2 h-4 w-4" />
                                Добавить переплату
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        {viewMode === "list" ? (
                            renderTable(filteredOverpayments)
                        ) : (
                            <Accordion type="multiple" className="space-y-2">
                                {Object.entries(groupedOverpayments).map(([key, items]) => {
                                    const totalSum = items.reduce((acc, item) => acc + item.amountDetected, 0)
                                    // Base recovered from mock data
                                    const baseRecovered = items.reduce((acc, item) => acc + item.amountCompensated, 0)
                                    // Additional recovered from local repayments state
                                    const additionalRecovered = items.reduce((acc, item) => acc + getOverpaymentRepaidTotal(item.id), 0)

                                    const totalRecovered = baseRecovered + additionalRecovered
                                    const totalLeft = totalSum - totalRecovered // Assuming AmountDetected ~= AmountToRecover for simplification or use specific field if needed

                                    return (
                                        <AccordionItem key={key} value={key} className="border rounded-lg bg-white shadow-sm">
                                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center justify-between w-full pr-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-blue-100 p-2 rounded-lg">
                                                            <Icons.List className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex flex-col items-start text-left">
                                                            <span className="font-semibold text-base text-slate-800">{key}</span>
                                                            <span className="text-xs text-muted-foreground font-normal">
                                                                Группа: {viewMode === "districts" ? "Военный округ" : viewMode === "payments" ? "Вид выплаты" : "Вид нарушения"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col items-end mr-2">
                                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Записей</span>
                                                            <Badge variant="outline" className="mt-0.5 bg-slate-100 text-slate-700 border-slate-200">
                                                                {items.length}
                                                            </Badge>
                                                        </div>

                                                        <div className="h-8 w-px bg-slate-200 mx-1"></div>

                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Выявлено</span>
                                                            <span className="text-sm font-bold text-slate-900">{totalSum.toLocaleString()}</span>
                                                        </div>

                                                        <div className="h-8 w-px bg-slate-200 mx-1"></div>

                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] text-green-600 uppercase tracking-wider font-semibold">Возмещено</span>
                                                            <span className="text-sm font-bold text-green-700">{totalRecovered.toLocaleString()}</span>
                                                        </div>

                                                        <div className="h-8 w-px bg-slate-200 mx-1"></div>

                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] text-red-500 uppercase tracking-wider font-semibold">Остаток</span>
                                                            <span className="text-sm font-bold text-red-600">{totalLeft.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-0 pb-0 border-t">
                                                <div className="bg-slate-50/50 p-4">
                                                    {renderTable(items)}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Добавить переплату</DialogTitle>
                        <DialogDescription>Заполните информацию о переплате</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>№ акта</Label>
                                <Input placeholder="ПП-2024-001" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Дата выявления</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Воинская часть</Label>
                            <Input placeholder="Воинская часть 00001" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Военный округ</Label>
                            <Input placeholder="Северо‑Западный военный округ" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Получатель (ответственное лицо)</Label>
                            <Input placeholder="капитан Хайдаров Н.С." />
                        </div>
                        <div className="grid gap-2">
                            <Label>Должность получателя</Label>
                            <Input placeholder="Начальник финансовой службы" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Наименование выплаты</Label>
                            <Input placeholder="Премия за выслугу лет" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Вид нарушения</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" defaultValue="">
                                <option value="" disabled>Выберите вид нарушения</option>
                                {VIOLATION_TYPES.filter(t => t.category === "Финансовые").map(type => (
                                    <option key={type.id} value={type.name}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Причина переплаты</Label>
                            <Input placeholder="Ошибка в расчётах" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Сумма выявленная (uzs)</Label>
                                <Input type="number" placeholder="45000" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Сумма к взысканию (uzs)</Label>
                                <Input type="number" placeholder="45000" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Сумма возмещена (uzs)</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Статус</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                                <option value="work">В работе</option>
                                <option value="returned">Возвращено</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={() => setShowAddDialog(false)}>Добавить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Просмотр переплаты</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">№ акта</Label>
                                    <p className="font-medium">{selectedItem.actNumber}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Дата выявления</Label>
                                    <p className="font-medium">{selectedItem.detectionDate}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Воинская часть</Label>
                                <p className="font-medium">{selectedItem.unit}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Получатель</Label>
                                <p className="font-medium">{selectedItem.responsible}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Наименование выплаты</Label>
                                <p className="font-medium">{selectedItem.paymentName}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Вид нарушения</Label>
                                <p className="font-medium">
                                    <Badge variant="outline">{selectedItem.overpaymentType}</Badge>
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Сумма переплаты</Label>
                                <p className="font-medium text-lg">{selectedItem.amountDetected.toLocaleString()} cум</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Статус</Label>
                                <Badge>{selectedItem.status}</Badge>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setShowViewDialog(false)}>Закрыть</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Редактировать переплату</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>№ акта</Label>
                                    <Input defaultValue={selectedItem.actNumber} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Дата выявления</Label>
                                    <Input type="date" defaultValue={selectedItem.detectionDate} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Воинская часть</Label>
                                <Input defaultValue={selectedItem.unit} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Военный округ</Label>
                                <Input defaultValue={selectedItem.unitDistrict} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Получатель (ответственное лицо)</Label>
                                <Input defaultValue={selectedItem.responsible} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Должность получателя</Label>
                                <Input defaultValue={selectedItem.responsiblePosition} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Наименование выплаты</Label>
                                <Input defaultValue={selectedItem.paymentName} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Вид нарушения</Label>
                                <Select defaultValue={selectedItem.overpaymentType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите вид нарушения" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="allowances">Денежные довольствия</SelectItem>
                                        <SelectItem value="salary">Заработная плата</SelectItem>
                                        <SelectItem value="travel">Командировочные расходы</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Причина переплаты</Label>
                                <Input defaultValue={selectedItem.reason} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label>Сумма выявленная (uzs)</Label>
                                    <Input type="number" defaultValue={selectedItem.amountDetected} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Сумма к взысканию (uzs)</Label>
                                    <Input type="number" defaultValue={selectedItem.amountToRecover} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Сумма возмещена (uzs)</Label>
                                    <Input type="number" defaultValue={selectedItem.amountCompensated} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Статус</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                    defaultValue={selectedItem.status}
                                >
                                    <option value="work">В работе</option>
                                    <option value="returned">Возвращено</option>
                                </select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={() => setShowEditDialog(false)}>Сохранить изменения</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRepaymentDialog} onOpenChange={setShowRepaymentDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Добавить погашение</DialogTitle>
                        <DialogDescription>{selectedOverpayment && `Акт: ${selectedOverpayment.actNumber}`}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Статья ДЖ</Label>
                            <Input
                                placeholder="Введите статью ДЖ"
                                value={repaymentForm.djArticle}
                                onChange={(e) => setRepaymentForm({ ...repaymentForm, djArticle: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Наименование документа</Label>
                            <Input
                                placeholder="Введите наименование документа"
                                value={repaymentForm.documentName}
                                onChange={(e) => setRepaymentForm({ ...repaymentForm, documentName: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>№ документа</Label>
                                <Input
                                    placeholder="№ документа"
                                    value={repaymentForm.documentNumber}
                                    onChange={(e) => setRepaymentForm({ ...repaymentForm, documentNumber: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Дата документа</Label>
                                <Input
                                    type="date"
                                    value={repaymentForm.documentDate}
                                    onChange={(e) => setRepaymentForm({ ...repaymentForm, documentDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Погашенная сумма</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={repaymentForm.repaidAmount}
                                onChange={(e) => setRepaymentForm({ ...repaymentForm, repaidAmount: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRepaymentDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleSaveRepayment}>
                            Добавить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditRepaymentDialog} onOpenChange={setShowEditRepaymentDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Редактировать погашение</DialogTitle>
                        <DialogDescription>{selectedRepayment && `Документ № ${selectedRepayment.documentNumber}`}</DialogDescription>
                    </DialogHeader>
                    {selectedRepayment && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Статья ДЖ</Label>
                                <Input
                                    placeholder="Введите статью ДЖ"
                                    value={repaymentForm.djArticle}
                                    onChange={(e) => setRepaymentForm({ ...repaymentForm, djArticle: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Наименование документа</Label>
                                <Input
                                    placeholder="Введите наименование документа"
                                    value={repaymentForm.documentName}
                                    onChange={(e) => setRepaymentForm({ ...repaymentForm, documentName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>№ документа</Label>
                                    <Input
                                        placeholder="№ документа"
                                        value={repaymentForm.documentNumber}
                                        onChange={(e) => setRepaymentForm({ ...repaymentForm, documentNumber: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Дата документа</Label>
                                    <Input
                                        type="date"
                                        value={repaymentForm.documentDate}
                                        onChange={(e) => setRepaymentForm({ ...repaymentForm, documentDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Погашенная сумма</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={repaymentForm.repaidAmount}
                                    onChange={(e) => setRepaymentForm({ ...repaymentForm, repaidAmount: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditRepaymentDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleSaveEditedRepayment}>
                            Сохранить изменения
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}

function DecisionsContent() {
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showViewDialog, setShowViewDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showRepaymentDialog, setShowRepaymentDialog] = useState(false)
    const [showEditRepaymentDialog, setShowEditRepaymentDialog] = useState(false)
    const [selectedRepayment, setSelectedRepayment] = useState<any>(null)
    const [selectedUnderpayment, setSelectedUnderpayment] = useState<any>(null)
    const [repayments, setRepayments] = useState<any[]>([])
    const [repaymentForm, setRepaymentForm] = useState({
        djArticle: "",
        documentName: "",
        documentNumber: "",
        documentDate: "",
        repaidAmount: "",
    })
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [filters, setFilters] = useState({
        search: "",
        amountFrom: "",
        amountTo: "",
        status: "all",
    })
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

    const underpayments = ALL_UNDERPAYMENTS;

    const filteredUnderpayments = useMemo(() => {
        return underpayments.filter((underpayment) => {
            const matchesSearch = filters.search
                ? underpayment.unit.toLowerCase().includes(filters.search.toLowerCase()) ||
                underpayment.responsible.toLowerCase().includes(filters.search.toLowerCase())
                : true

            const matchesAmountFrom = filters.amountFrom
                ? underpayment.amountDetected >= Number.parseFloat(filters.amountFrom)
                : true

            const matchesAmountTo = filters.amountTo
                ? underpayment.amountDetected <= Number.parseFloat(filters.amountTo)
                : true

            const matchesStatus = filters.status !== "all" ? underpayment.status === filters.status : true

            return matchesSearch && matchesAmountFrom && matchesAmountTo && matchesStatus
        })
    }, [filters, underpayments])

    const handleResetFilters = () => {
        setFilters({
            search: "",
            amountFrom: "",
            amountTo: "",
            status: "all",
        })
    }

    const toggleRowExpansion = useCallback((id: number) => {
        setExpandedRows((prev) => {
            const newExpanded = new Set(prev)
            if (newExpanded.has(id)) {
                newExpanded.delete(id)
            } else {
                newExpanded.add(id)
            }
            return newExpanded
        })
    }, [])

    const toggleItemSelection = useCallback((id: number) => {
        setSelectedItems((prev) => {
            const newSelected = new Set(prev)
            if (newSelected.has(id)) {
                newSelected.delete(id)
            } else {
                newSelected.add(id)
            }
            return newSelected
        })
    }, [])

    const getUnderpaymentRepayments = (underpaymentId: number) => {
        return repayments.filter((r) => r.underpaymentId === underpaymentId)
    }

    const handleView = (underpayment: any) => {
        setSelectedItem(underpayment)
        setShowViewDialog(true)
    }

    const handleEdit = (underpayment: any) => {
        setSelectedItem(underpayment)
        setShowEditDialog(true)
    }

    const handleAddRepayment = (underpayment: any) => {
        setSelectedUnderpayment(underpayment)
        setRepaymentForm({
            djArticle: "",
            documentName: "",
            documentNumber: "",
            documentDate: "",
            repaidAmount: "",
        })
        setShowRepaymentDialog(true)
    }

    const handleEditRepayment = (repayment: any) => {
        setSelectedRepayment(repayment)
        setShowEditRepaymentDialog(true)
    }

    const handleDeleteRepayment = (repaymentId: number) => {
        if (confirm("Вы уверены, что хотите удалить это погашение?")) {
            setRepayments((prev) => prev.filter((r) => r.id !== repaymentId))
        }
    }

    const handleExportToPDF = (underpaymentId: number) => {
        alert(`Экспорт погашений для недоплаты ID ${underpaymentId} в PDF`)
    }

    const handleAddRecord = () => {
        setShowAddDialog(true)
    }

    return (
        <div className="space-y-6 px-5">
            <div className="flex items-center justify-between border-l-4 ml-4 border-yellow-500">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight px-5">Не доплата</h2>
                    <p className="text-muted-foreground px-5">Учёт недоплат</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="relative overflow-hidden border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-cyan-900">Всего недоплат</CardTitle>
                        <div className="rounded-full bg-cyan-200 p-2 ring-2 ring-cyan-300">
                            <Icons.TrendingUp className="h-5 w-5 text-cyan-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-cyan-900">{underpayments.length}</div>
                        <p className="text-xs text-cyan-700 font-medium">Выявлено</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-sky-900">Общая сумма</CardTitle>
                        <div className="rounded-full bg-sky-200 p-2 ring-2 ring-sky-300">
                            <Icons.DollarSign className="h-5 w-5 text-sky-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-sky-900">
                            {underpayments.reduce((sum, o) => sum + o.amountDetected, 0).toLocaleString()} cум
                        </div>
                        <p className="text-xs text-sky-700 font-medium">Недоплачено</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-lime-200 bg-gradient-to-br from-lime-50 to-lime-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-lime-900">Возвращено</CardTitle>
                        <div className="rounded-full bg-lime-200 p-2 ring-2 ring-lime-300">
                            <Icons.Check className="h-5 w-5 text-lime-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-lime-900">
                            {underpayments.filter((o) => o.status === "Возвращено").length}
                        </div>
                        <p className="text-xs text-lime-700 font-medium">Случаев</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-red-900">В процессе</CardTitle>
                        <div className="rounded-full bg-red-200 p-2 ring-2 ring-red-300">
                            <Icons.Clock className="h-5 w-5 text-red-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-900">
                            {underpayments.filter((o) => o.status === "В работе").length}
                        </div>
                        <p className="text-xs text-red-700 font-medium">Возврата</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Фильтры</CardTitle>
                    <CardDescription>Поиск и фильтрация незаконных списаний</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Input
                            placeholder="№ акта..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                        <Input
                            placeholder="Воинская часть..."
                            value={filters.amountFrom}
                            onChange={(e) => setFilters({ ...filters, amountFrom: e.target.value })}
                        />
                        <Input
                            placeholder="Ответственный..."
                            value={filters.amountTo}
                            onChange={(e) => setFilters({ ...filters, amountTo: e.target.value })}
                        />

                        {/* селект + кнопка в одной колонке */}
                        <div className="flex items-center gap-2">
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="">Все статусы</option>
                                <option value="В работе">В работе</option>
                                <option value="Возвращено">Возвращено</option>
                                <option value="Списано">Списано</option>
                            </select>

                            <Button variant="outline" onClick={handleResetFilters} className="shrink-0 h-10 bg-transparent">
                                Сбросить
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Реестр недоплат</CardTitle>
                            <CardDescription>Всего записей: {filteredUnderpayments.length}</CardDescription>
                        </div>
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Icons.Plus className="mr-2 h-4 w-4" />
                            Добавить недоплату
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>№ акта <br /> и дата</TableHead>
                                    <TableHead>
                                        В/ч <br /> выявления
                                    </TableHead>
                                    <TableHead>Текущая в/ч</TableHead>
                                    <TableHead>Получатель</TableHead>
                                    <TableHead>
                                        Наименование <br /> выплаты
                                    </TableHead>
                                    <TableHead>
                                        Вид <br /> недоплаты
                                    </TableHead>
                                    <TableHead>
                                        Сумма <br /> выявленная
                                    </TableHead>
                                    <TableHead>
                                        Сумма <br /> возмещена
                                    </TableHead>
                                    <TableHead>Остаток</TableHead>
                                    <TableHead>Статус</TableHead>
                                    <TableHead>Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUnderpayments.map((underpayment) => {
                                    const underpaymentRepayments = getUnderpaymentRepayments(underpayment.id)
                                    const isExpanded = expandedRows.has(underpayment.id)
                                    const isSelected = selectedItems.has(underpayment.id)

                                    return (
                                        <Fragment key={underpayment.id}>
                                            <TableRow key={underpayment.id} className={isSelected ? "bg-muted/50" : ""}>
                                                <TableCell className="font-mono">{underpayment.id}</TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{underpayment.actNumber}</span>
                                                        <span className="text-xs text-muted-foreground">{underpayment.detectionDate}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-[15px] font-semibold" style={{ color: "#222" }}>
                                                            {underpayment.unit}
                                                        </div>
                                                        <div className="text-[13px]" style={{ color: "#777" }}>
                                                            {underpayment.unitDistrict}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    {underpayment.transferDate ? (
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-1">
                                                                <Icons.ArrowRight className="h-3 w-3 text-orange-500" />
                                                                <span className="text-[15px] font-semibold text-orange-700">
                                                                    {underpayment.currentUnit}
                                                                </span>
                                                            </div>
                                                            <div className="text-[13px]" style={{ color: "#777" }}>
                                                                {underpayment.currentUnitDistrict}
                                                            </div>
                                                            <Badge variant="outline" className="text-[10px] w-fit bg-orange-50 text-orange-700 border-orange-200">
                                                                <Icons.Calendar className="h-2 w-2 mr-1" />
                                                                Переведён {underpayment.transferDate}
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <div className="text-[13px] text-muted-foreground">—</div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-[15px] font-semibold" style={{ color: "#222" }}>
                                                            {underpayment.responsible}
                                                        </div>
                                                        <div className="text-[13px]" style={{ color: "#777" }}>
                                                            {underpayment.responsiblePosition}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{underpayment.paymentName}</TableCell>
                                                <TableCell className="flex flex-col text-[13px] font-semibold text-red-500">
                                                    {underpayment.underpaymentType.split(" ").map((word: string, index: number) => {
                                                        // If word is longer than 10 characters — insert a <br /> halfway
                                                        if (word.length > 20) {
                                                            const mid = Math.ceil(word.length / 2)
                                                            return (
                                                                <span key={index}>
                                                                    {word.slice(0, mid)}
                                                                    <br />
                                                                    {word.slice(mid)}{" "}
                                                                </span>
                                                            )
                                                        }
                                                        // otherwise return normally
                                                        return <span key={index}>{word} </span>
                                                    })}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {underpayment.amountDetected.toLocaleString()} cум
                                                </TableCell>
                                                <TableCell className="font-semibold text-green-600">
                                                    {underpayment.amountCompensated.toLocaleString()} cум
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {(underpayment.amountToRecover - underpayment.amountCompensated).toLocaleString()} cум
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            underpayment.status === "Возвращено"
                                                                ? "default"
                                                                : underpayment.status === "В работе"
                                                                    ? "secondary"
                                                                    : "outline"
                                                        }
                                                    >
                                                        {underpayment.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 items-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleRowExpansion(underpayment.id)}
                                                            title={isExpanded ? "Скрыть погашения" : "Показать погашения"}
                                                        >
                                                            {isExpanded ? (
                                                                <Icons.ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <Icons.ChevronDown className="h-4 w-4" />
                                                            )}
                                                            {underpaymentRepayments.length > 0 && (
                                                                <span className="ml-1 text-xs">({underpaymentRepayments.length})</span>
                                                            )}
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleAddRepayment(underpayment)}>
                                                            <Icons.Plus className="h-4 w-4 mr-1" />
                                                        </Button>
                                                        <Select>
                                                            <SelectTrigger className="w-[50px] h-8">
                                                                {/* <SelectValue placeholder="..." /> */}
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="edit">
                                                                    Редактировать
                                                                    <Icons.Eye onClick={() => handleView(underpayment)} className="h-4 w-4" />
                                                                </SelectItem>
                                                                <SelectItem value="show">
                                                                    Просмотр
                                                                    <Icons.Edit onClick={() => handleEdit(underpayment)} className="h-4 w-4" />
                                                                </SelectItem>
                                                                <SelectItem value="export">Экспорт</SelectItem>
                                                                <SelectItem value="print">Печать</SelectItem>
                                                                <SelectItem value="archive">Архивировать</SelectItem>
                                                                <SelectItem value="delete">Удалить</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {isExpanded && underpaymentRepayments.length > 0 && (
                                                <TableRow className="bg-green-50/50 hover:bg-green-50/70">
                                                    <TableCell colSpan={12} className="p-0">
                                                        <div className="p-4 border-l-4 border-green-500">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Icons.FileText className="h-4 w-4 text-green-700" />
                                                                    <h4 className="font-semibold text-green-900">
                                                                        Реестр погашений для акта {underpayment.actNumber}
                                                                    </h4>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleExportToPDF(underpayment.id)}
                                                                    className="gap-2"
                                                                >
                                                                    <Icons.FileText className="h-4 w-4" />
                                                                    Экспорт в PDF
                                                                </Button>
                                                            </div>
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow className="bg-green-100/50">
                                                                        <TableHead className="text-green-900">Статья ДЖ</TableHead>
                                                                        <TableHead className="text-green-900">Наименование документа</TableHead>
                                                                        <TableHead className="text-green-900">№ документа</TableHead>
                                                                        <TableHead className="text-green-900">Дата документа</TableHead>
                                                                        <TableHead className="text-green-900">Погашенная сумма</TableHead>
                                                                        <TableHead className="text-green-900">Остаток</TableHead>
                                                                        <TableHead className="text-green-900">Действия</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {underpaymentRepayments.map((repayment) => (
                                                                        <TableRow key={repayment.id} className="bg-white">
                                                                            <TableCell>{repayment.djArticle}</TableCell>
                                                                            <TableCell>{repayment.documentName}</TableCell>
                                                                            <TableCell>{repayment.documentNumber}</TableCell>
                                                                            <TableCell>{repayment.documentDate}</TableCell>
                                                                            <TableCell className="font-semibold text-green-600">
                                                                                {repayment.repaidAmount.toLocaleString()} cум
                                                                            </TableCell>
                                                                            <TableCell className="font-semibold">
                                                                                {repayment.remainder.toLocaleString()} cум
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="flex gap-2">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => handleEditRepayment(repayment)}
                                                                                        title="Редактировать"
                                                                                    >
                                                                                        <Icons.Edit className="h-4 w-4" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => handleDeleteRepayment(repayment.id)}
                                                                                        title="Удалить"
                                                                                        className="text-destructive hover:text-destructive"
                                                                                    >
                                                                                        <Icons.Trash className="h-4 w-4" />
                                                                                    </Button>
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
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
                </CardContent >
            </Card >

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Добавить недоплату</DialogTitle>
                        <DialogDescription>Заполните информацию о недоплате</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>№ акта</Label>
                                <Input placeholder="НД-2024-001" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Дата выявления</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Воинская часть</Label>
                            <Input placeholder="Воинская часть 00001" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Военный округ</Label>
                            <Input placeholder="Северо‑Западный военный округ" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Получатель (ответственное лицо)</Label>
                            <Input placeholder="капитан Хайдаров Н.С." />
                        </div>
                        <div className="grid gap-2">
                            <Label>Должность получателя</Label>
                            <Input placeholder="Начальник финансовой службы" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Наименование выплаты</Label>
                            <Input placeholder="Премия за выслугу лет" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Вид недоплаты</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                                <option value="allowances">Денежные довольствия</option>
                                <option value="salary">Заработная плата</option>
                                <option value="travel">Командировочные расходы</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Причина недоплаты</Label>
                            <Input placeholder="Ошибка в расчётах" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Сумма выявленная (uzs)</Label>
                                <Input type="number" placeholder="45000" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Сумма к взысканию (uzs)</Label>
                                <Input type="number" placeholder="45000" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Сумма возмещена (uzs)</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Статус</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                                <option value="work">В работе</option>
                                <option value="returned">Возвращено</option>
                                <option value="written-off">Списано</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={() => setShowAddDialog(false)}>Добавить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Просмотр недоплаты</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">№ акта</Label>
                                    <p className="font-medium">{selectedItem.actNumber}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Дата выявления</Label>
                                    <p className="font-medium">{selectedItem.detectionDate}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Воинская часть</Label>
                                <p className="font-medium">{selectedItem.unit}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Получатель</Label>
                                <p className="font-medium">{selectedItem.responsible}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Наименование выплаты</Label>
                                <p className="font-medium">{selectedItem.paymentName}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Вид недоплаты</Label>
                                <p className="font-medium">
                                    <Badge variant="outline">{selectedItem.underpaymentType}</Badge>
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Сумма недоплаты</Label>
                                <p className="font-medium text-lg">{selectedItem.amountDetected.toLocaleString()} cум</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Статус</Label>
                                <Badge>{selectedItem.status}</Badge>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setShowViewDialog(false)}>Закрыть</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Редактировать недоплату</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>№ акта</Label>
                                    <Input defaultValue={selectedItem.actNumber} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Дата выявления</Label>
                                    <Input type="date" defaultValue={selectedItem.detectionDate} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Воинская часть</Label>
                                <Input defaultValue={selectedItem.unit} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Военный округ</Label>
                                <Input defaultValue={selectedItem.unitDistrict} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Получатель (ответственное лицо)</Label>
                                <Input defaultValue={selectedItem.responsible} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Должность получателя</Label>
                                <Input defaultValue={selectedItem.responsiblePosition} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Наименование выплаты</Label>
                                <Input defaultValue={selectedItem.paymentName} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Вид недоплаты</Label>
                                <Select defaultValue={selectedItem.underpaymentType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите вид недоплаты" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monetary">Денежные довольствия</SelectItem>
                                        <SelectItem value="salary">Заработная плата</SelectItem>
                                        <SelectItem value="travel">Командировочные расходы</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Причина недоплаты</Label>
                                <Input defaultValue={selectedItem.reason} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label>Сумма выявленная (uzs)</Label>
                                    <Input type="number" defaultValue={selectedItem.amountDetected} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Сумма к взысканию (uzs)</Label>
                                    <Input type="number" defaultValue={selectedItem.amountToRecover} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Сумма возмещена (uzs)</Label>
                                    <Input type="number" defaultValue={selectedItem.amountCompensated} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Статус</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                    defaultValue={selectedItem.status}
                                >
                                    <option value="work">В работе</option>
                                    <option value="returned">Возвращено</option>
                                    <option value="written-off">Списано</option>
                                </select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={() => setShowEditDialog(false)}>Сохранить изменения</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRepaymentDialog} onOpenChange={setShowRepaymentDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Добавить погашение</DialogTitle>
                        <DialogDescription>{selectedUnderpayment && `Акт: ${selectedUnderpayment.actNumber}`}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Статья ДЖ</Label>
                            <Input
                                placeholder="Введите статью ДЖ"
                                value={repaymentForm.djArticle}
                                onChange={(e) => setRepaymentForm({ ...repaymentForm, djArticle: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Наименование документа</Label>
                            <Input
                                placeholder="Введите наименование документа"
                                value={repaymentForm.documentName}
                                onChange={(e) => setRepaymentForm({ ...repaymentForm, documentName: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>№ документа</Label>
                                <Input
                                    placeholder="№ документа"
                                    value={repaymentForm.documentNumber}
                                    onChange={(e) => setRepaymentForm({ ...repaymentForm, documentNumber: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Дата документа</Label>
                                <Input
                                    type="date"
                                    value={repaymentForm.documentDate}
                                    onChange={(e) => setRepaymentForm({ ...repaymentForm, documentDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Погашенная сумма</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={repaymentForm.repaidAmount}
                                onChange={(e) => setRepaymentForm({ ...repaymentForm, repaidAmount: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRepaymentDialog(false)}>
                            Отмена
                        </Button>
                        <Button
                            onClick={() => {
                                if (selectedUnderpayment) {
                                    const newRepayment = {
                                        id: repayments.length + 1,
                                        underpaymentId: selectedUnderpayment.id,
                                        djArticle: repaymentForm.djArticle,
                                        documentName: repaymentForm.documentName,
                                        documentNumber: repaymentForm.documentNumber,
                                        documentDate: repaymentForm.documentDate,
                                        repaidAmount: Number.parseFloat(repaymentForm.repaidAmount),
                                        remainder: selectedUnderpayment.amountToRecover - Number.parseFloat(repaymentForm.repaidAmount),
                                    }
                                    setRepayments([...repayments, newRepayment])
                                    setRepaymentForm({
                                        djArticle: "",
                                        documentName: "",
                                        documentNumber: "",
                                        documentDate: "",
                                        repaidAmount: "",
                                    })
                                    setShowRepaymentDialog(false)
                                }
                            }}
                        >
                            Добавить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditRepaymentDialog} onOpenChange={setShowEditRepaymentDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Редактировать погашение</DialogTitle>
                    </DialogHeader>
                    {selectedRepayment && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Статья ДЖ</Label>
                                <Input defaultValue={selectedRepayment.djArticle} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Наименование документа</Label>
                                <Input defaultValue={selectedRepayment.documentName} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>№ документа</Label>
                                    <Input defaultValue={selectedRepayment.documentNumber} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Дата документа</Label>
                                    <Input type="date" defaultValue={selectedRepayment.documentDate} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Погашенная сумма</Label>
                                <Input type="number" defaultValue={selectedRepayment.repaidAmount} />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditRepaymentDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={() => setShowEditRepaymentDialog(false)}>Сохранить изменения</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}
