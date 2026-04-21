"use client"

import { useState, useCallback, useMemo, Fragment } from "react"
import { SectionsTabs } from "@/components/sections-tabs"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import * as XLSX from "xlsx"
import { getDistrictAbbreviation } from "@/lib/utils"
import { ALL_ASSET_REPAYMENTS } from "@/lib/data/financial-mock-data"

export default function AssetShortagesPage() {
    return (
        <div className="space-y-6">
            <AccountsContent />
        </div>
    )
}

function AccountsContent() {
    console.log("[v0] AccountsContent component loaded")

    const formatNumber = (value: number | undefined | null): string => {
        if (value === undefined || value === null || isNaN(value)) {
            return "0"
        }
        return value.toLocaleString()
    }

    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showViewDialog, setShowViewDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showAddRepaymentDialog, setShowAddRepaymentDialog] = useState(false)
    const [showEditRepaymentDialog, setShowEditRepaymentDialog] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [selectedRepayment, setSelectedRepayment] = useState<any>(null)
    const [selectedShortage, setSelectedShortage] = useState<any>(null)
    const [repayments, setRepayments] = useState<any[]>(ALL_ASSET_REPAYMENTS)
    const [repaymentForm, setRepaymentForm] = useState({
        djArticle: "",
        documentName: "",
        documentNumber: "",
        documentDate: "",
        repaidAmount: "",
    })
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [filters, setFilters] = useState({
        actNumber: "",
        unit: "",
        responsible: "",
        status: "",
    })
    const [viewMode, setViewMode] = useState<"list" | "districts" | "assets" | "types">("list")

    const shortages = [
        {
            id: 1,
            actNumber: "АКТ-001/2024",
            detectionDate: "15.01.2025",
            unit: "Воинская часть 00001",
            unitDistrict: "Ташкентский военный округ",
            responsible: "Иванов Иван Иванович",
            responsiblePosition: "Начальник склада",
            assetName: "Вещевое имущество",
            shortageType: "Недостача при инвентаризации",
            amountDetected: 185000,
            amountCompensated: 50000,
            amountToRecover: 185000,
            status: "В работе",
            source: "Бюджет",
            currentUnit: "Воинская часть 00001",
            currentUnitDistrict: "Ташкентский военный округ",
            transferDate: null,
        },
        {
            id: 2,
            actNumber: "АКТ-002/2024",
            detectionDate: "10.02.2024",
            unit: "Воинская часть 00002",
            unitDistrict: "Центральный военный округ",
            responsible: "Петров Петр Петрович",
            responsiblePosition: "Заведующий складом",
            assetName: "Продовольствие",
            shortageType: "Недостача при приемке",
            amountDetected: 95000,
            amountCompensated: 95000,
            amountToRecover: 95000,
            status: "Возвращено",
            source: "Внебюджет",
            currentUnit: "Воинская часть 00005",
            currentUnitDistrict: "Северо-Западный военный округ",
            transferDate: "01.03.2024",
        },
        {
            id: 3,
            actNumber: "АКТ-003/2024",
            detectionDate: "20.03.2024",
            unit: "Воинская часть 00003",
            unitDistrict: "Восточный военный округ",
            responsible: "Сидоров Сидор Сидорович",
            responsiblePosition: "Начальник ГСМ",
            assetName: "ГСМ",
            shortageType: "Хищение",
            amountDetected: 4500000,
            amountCompensated: 0,
            amountToRecover: 4500000,
            status: "Передано в суд",
            source: "СМПР",
            currentUnit: "Воинская часть 00003",
            currentUnitDistrict: "Восточный военный округ",
            transferDate: null,
        },
        {
            id: 4,
            actNumber: "АКТ-004/2024",
            detectionDate: "05.04.2024",
            unit: "Воинская часть 00004",
            unitDistrict: "Юго-Западный особый военный округ",
            responsible: "Алиев Али",
            responsiblePosition: "Начальник медпункта",
            assetName: "Медицинское имущество",
            shortageType: "Порча",
            amountDetected: 120000,
            amountCompensated: 120000,
            amountToRecover: 120000,
            status: "Списано",
            source: "Бюджет",
            currentUnit: "Воинская часть 00004",
            currentUnitDistrict: "Юго-Западный особый военный округ",
            transferDate: null,
        },
        {
            id: 5,
            actNumber: "АКТ-005/2024",
            detectionDate: "12.05.2024",
            unit: "Воинская часть 00005",
            unitDistrict: "Северо-Западный военный округ",
            responsible: "Васильев Василий",
            responsiblePosition: "Квартирмейстер",
            assetName: "КЭЧ",
            shortageType: "Утрата",
            amountDetected: 350000,
            amountCompensated: 100000,
            amountToRecover: 350000,
            status: "В работе",
            source: "Бюджет",
            currentUnit: "Воинская часть 00005",
            currentUnitDistrict: "Северо-Западный военный округ",
            transferDate: null,
        },
        {
            id: 6,
            actNumber: "АКТ-006/2024",
            detectionDate: "18.06.2024",
            unit: "Воинская часть 00006",
            unitDistrict: "Ташкентский военный округ",
            responsible: "Ким Дмитрий",
            responsiblePosition: "Начальник вещевой службы",
            assetName: "Вещевое имущество",
            shortageType: "Недостача при инвентаризации",
            amountDetected: 85000,
            amountCompensated: 0,
            amountToRecover: 85000,
            status: "В работе",
            source: "Бюджет",
            currentUnit: "Воинская часть 00006",
            currentUnitDistrict: "Ташкентский военный округ",
            transferDate: null,
        },
        {
            id: 7,
            actNumber: "АКТ-007/2024",
            detectionDate: "25.07.2024",
            unit: "Воинская часть 00007",
            unitDistrict: "Центральный военный округ",
            responsible: "Махмудов Алишер",
            responsiblePosition: "Начальник продсклада",
            assetName: "Продовольствие",
            shortageType: "Порча",
            amountDetected: 45000,
            amountCompensated: 45000,
            amountToRecover: 45000,
            status: "Возвращено",
            source: "Внебюджет",
            currentUnit: "Воинская часть 00007",
            currentUnitDistrict: "Центральный военный округ",
            transferDate: null,
        },
        {
            id: 8,
            actNumber: "АКТ-008/2024",
            detectionDate: "02.08.2024",
            unit: "Воинская часть 00008",
            unitDistrict: "Восточный военный округ",
            responsible: "Пак Сергей",
            responsiblePosition: "Техник",
            assetName: "ГСМ",
            shortageType: "Недостача при приемке",
            amountDetected: 1500000,
            amountCompensated: 500000,
            amountToRecover: 1500000,
            status: "В работе",
            source: "Бюджет",
            currentUnit: "Воинская часть 00008",
            currentUnitDistrict: "Восточный военный округ",
            transferDate: null,
        },
        {
            id: 9,
            actNumber: "АКТ-009/2024",
            detectionDate: "14.09.2024",
            unit: "Воинская часть 00009",
            unitDistrict: "Юго-Западный особый военный округ",
            responsible: "Юсупов Бобур",
            responsiblePosition: "Начальник автослужбы",
            assetName: "ГСМ",
            shortageType: "Хищение",
            amountDetected: 2800000,
            amountCompensated: 0,
            amountToRecover: 2800000,
            status: "Передано в суд",
            source: "СМПР",
            currentUnit: "Воинская часть 00009",
            currentUnitDistrict: "Юго-Западный особый военный округ",
            transferDate: null,
        },
        {
            id: 10,
            actNumber: "АКТ-010/2024",
            detectionDate: "20.10.2024",
            unit: "Воинская часть 00010",
            unitDistrict: "Северо-Западный военный округ",
            responsible: "Ахмедов Сардор",
            responsiblePosition: "Командир взвода",
            assetName: "Вещевое имущество",
            shortageType: "Утрата",
            amountDetected: 65000,
            amountCompensated: 65000,
            amountToRecover: 65000,
            status: "Возвращено",
            source: "Внебюджет",
            currentUnit: "Воинская часть 00010",
            currentUnitDistrict: "Северо-Западный военный округ",
            transferDate: null,
        },
        {
            id: 11,
            actNumber: "АКТ-011/2024",
            detectionDate: "05.11.2024",
            unit: "Воинская часть 00011",
            unitDistrict: "Ташкентский военный округ",
            responsible: "Тен Виктор",
            responsiblePosition: "Начальник КЭС",
            assetName: "КЭЧ",
            shortageType: "Недостача при инвентаризации",
            amountDetected: 420000,
            amountCompensated: 0,
            amountToRecover: 420000,
            status: "В работе",
            source: "Бюджет",
            currentUnit: "Воинская часть 00011",
            currentUnitDistrict: "Ташкентский военный округ",
            transferDate: null,
        },
        {
            id: 12,
            actNumber: "АКТ-012/2024",
            detectionDate: "10.12.2024",
            unit: "Воинская часть 00012",
            unitDistrict: "Центральный военный округ",
            responsible: "Олимов Джамшид",
            responsiblePosition: "Начальник аптеки",
            assetName: "Медицинское имущество",
            shortageType: "Порча",
            amountDetected: 35000,
            amountCompensated: 35000,
            amountToRecover: 35000,
            status: "Списано",
            source: "Бюджет",
            currentUnit: "Воинская часть 00012",
            currentUnitDistrict: "Центральный военный округ",
            transferDate: null,
        },
    ]

    const getShortageRepayments = (shortageId: number) => {
        return repayments.filter((r) => r.shortageId === shortageId)
    }

    const getShortageRepaidTotal = useCallback(
        (shortageId: number) => {
            return repayments.filter((r) => r.shortageId === shortageId).reduce((sum, r) => sum + r.repaidAmount, 0)
        },
        [repayments],
    )

    const getShortageRemainder = useCallback(
        (shortage: any) => {
            const totalRepaid = getShortageRepaidTotal(shortage.id)
            return shortage.amountToRecover - totalRepaid
        },
        [getShortageRepaidTotal],
    )

    const filteredShortages = shortages.filter((shortage) => {
        if (filters.actNumber && !shortage.actNumber.toLowerCase().includes(filters.actNumber.toLowerCase())) return false
        if (filters.unit && !shortage.unit.toLowerCase().includes(filters.unit.toLowerCase())) return false
        if (filters.responsible && !shortage.responsible.toLowerCase().includes(filters.responsible.toLowerCase()))
            return false
        if (filters.status && shortage.status !== filters.status) return false
        return true
    })

    const groupedShortages = useMemo(() => {
        const grouped: Record<string, typeof shortages> = {}
        filteredShortages.forEach(item => {
            let key = ""
            if (viewMode === "districts") key = item.unitDistrict || "Не указан округ"
            else if (viewMode === "assets") key = item.assetName || "Не указан тип"
            else if (viewMode === "types") key = item.shortageType || "Не указан вид"

            if (!grouped[key]) grouped[key] = []
            grouped[key].push(item)
        })
        return grouped
    }, [filteredShortages, viewMode])

    const handleResetFilters = () => {
        setFilters({
            actNumber: "",
            unit: "",
            responsible: "",
            status: "",
        })
    }

    const handleView = (item: any) => {
        setSelectedItem(item)
        setShowViewDialog(true)
    }

    const handleEdit = (item: any) => {
        setSelectedItem(item)
        setShowEditDialog(true)
    }

    const handleAddRepayment = useCallback((shortage: any) => {
        setSelectedShortage(shortage)
        setRepaymentForm({
            djArticle: "",
            documentName: "",
            documentNumber: "",
            documentDate: "",
            repaidAmount: "",
        })
        setShowAddRepaymentDialog(true)
    }, [])

    const handleEditRepayment = useCallback((repayment: any) => {
        setSelectedRepayment(repayment)
        setRepaymentForm({
            djArticle: repayment.djArticle,
            documentName: repayment.documentName,
            documentNumber: repayment.documentNumber,
            documentDate: repayment.documentDate,
            repaidAmount: repayment.repaidAmount.toString(),
        })
        setShowEditRepaymentDialog(true)
    }, [])

    const handleDeleteRepayment = (id: number) => {
        setRepayments((prev) => prev.filter((r) => r.id !== id))
    }

    const handleSaveRepayment = useCallback(() => {
        if (!selectedShortage || !repaymentForm.repaidAmount) return

        const repaidAmount = Number.parseFloat(repaymentForm.repaidAmount)
        const totalRepaid = getShortageRepaidTotal(selectedShortage.id)
        const remainder = selectedShortage.amountToRecover - (totalRepaid + repaidAmount)

        const newRepayment = {
            id: Date.now(),
            shortageId: selectedShortage.id,
            djArticle: repaymentForm.djArticle,
            documentName: repaymentForm.documentName,
            documentNumber: repaymentForm.documentNumber,
            documentDate: repaymentForm.documentDate,
            repaidAmount: repaidAmount,
            remainder: remainder,
        }

        setRepayments((prev) => [...prev, newRepayment])
        setShowAddRepaymentDialog(false)
        setRepaymentForm({
            djArticle: "",
            documentName: "",
            documentNumber: "",
            documentDate: "",
            repaidAmount: "",
        })
    }, [selectedShortage, repaymentForm, getShortageRepaidTotal])

    const handleSaveEditedRepayment = useCallback(() => {
        if (!selectedRepayment || !repaymentForm.repaidAmount) return

        setRepayments((prev) =>
            prev.map((r) => {
                if (r.id === selectedRepayment.id) {
                    const shortage = shortages.find((s) => s.id === r.shortageId)
                    if (!shortage) return r

                    const otherRepaymentsTotal = prev
                        .filter((rep) => rep.shortageId === r.shortageId && rep.id !== r.id)
                        .reduce((sum, rep) => sum + rep.repaidAmount, 0)

                    const newRepaidAmount = Number.parseFloat(repaymentForm.repaidAmount)
                    const remainder = shortage.amountToRecover - (otherRepaymentsTotal + newRepaidAmount)

                    return {
                        ...r,
                        djArticle: repaymentForm.djArticle,
                        documentName: repaymentForm.documentName,
                        documentNumber: repaymentForm.documentNumber,
                        documentDate: repaymentForm.documentDate,
                        repaidAmount: newRepaidAmount,
                        remainder: remainder,
                    }
                }
                return r
            }),
        )

        setShowEditRepaymentDialog(false)
        setSelectedRepayment(null)
    }, [selectedRepayment, repaymentForm, shortages])

    const toggleRowExpansion = (id: number) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedRows(newExpanded)
    }

    const toggleItemSelection = (id: number) => {
        const newSelected = new Set(selectedItems)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedItems(newSelected)
    }

    const handleExportToPDF = (id: number) => {
        console.log("Export to PDF:", id)
    }

    const handlePrint = () => {
        window.print()
    }

    const handleExportExcel = () => {
        let dataToExport: any[] = []

        if (viewMode === "list") {
            dataToExport = filteredShortages
        } else {
            Object.keys(groupedShortages).forEach(key => {
                dataToExport.push({ isGroupHeader: true, title: key })
                dataToExport = [...dataToExport, ...groupedShortages[key]]
            })
        }

        const exportData = dataToExport.map((item: any) => {
            if (item.isGroupHeader) {
                return {
                    "ID": item.title.toUpperCase(),
                    "№ Акта": "",
                    "Воинская часть": "",
                    "Ответственный": "",
                    "Вид имущества": "",
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
                "Вид имущества": item.assetName,
                "Вид нарушения": item.shortageType,
                "Источник": item.source,
                "Сумма выявленная": item.amountDetected,
                "Сумма возмещена": item.amountCompensated,
                "Остаток": (item.amountToRecover || 0) - (item.amountCompensated || 0),
                "Статус": item.status,
            }
        })

        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Недостачи")
        XLSX.writeFile(wb, `asset_shortages_${viewMode}_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    const renderTable = (items: typeof shortages) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead className="text-center">№ акта <br /> и дата</TableHead>
                    <TableHead className="text-center">
                        Воинская <br /> часть
                    </TableHead>
                    <TableHead className="text-center">Ответственный</TableHead>
                    <TableHead className="text-center">
                        Виды материальных <br /> средств
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
                {items.map((shortage) => {
                    const shortageRepayments = getShortageRepayments(shortage.id)
                    const isExpanded = expandedRows.has(shortage.id)
                    const isSelected = selectedItems.has(shortage.id)

                    return (
                        <Fragment key={shortage.id}>
                            <TableRow className={isSelected ? "bg-muted/50" : ""}>
                                <TableCell className="font-mono">{shortage.id}</TableCell>
                                <TableCell className="align-top">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex flex-col cursor-help">
                                                    <span className="font-medium">{shortage.actNumber}</span>
                                                    <span className="text-xs text-muted-foreground">{shortage.detectionDate}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{shortage.unit}</p>
                                                <p>{shortage.unitDistrict}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-[15px] font-semibold" style={{ color: "#222" }}>
                                            {shortage.unit}
                                        </div>
                                        <div className="text-[13px]" style={{ color: "#777" }}>
                                            {getDistrictAbbreviation(shortage.unitDistrict)}
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-[15px] font-semibold" style={{ color: "#222" }}>
                                            {shortage.responsible}
                                        </div>
                                        <div className="text-[13px]" style={{ color: "#777" }}>
                                            {shortage.responsiblePosition}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{shortage.assetName}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{shortage.shortageType}</Badge>
                                </TableCell>
                                <TableCell>{shortage.source || "—"}</TableCell>
                                <TableCell className="font-semibold">{formatNumber(shortage.amountDetected)} cум</TableCell>
                                <TableCell className="font-semibold text-green-600">
                                    {formatNumber(shortage.amountCompensated)} cум
                                </TableCell>
                                <TableCell className="font-semibold">
                                    {formatNumber((shortage.amountToRecover || 0) - (shortage.amountCompensated || 0))} cум
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            shortage.status === "Возвращено"
                                                ? "default"
                                                : shortage.status === "В работе"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                    >
                                        {shortage.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 items-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleRowExpansion(shortage.id)}
                                            title={isExpanded ? "Скрыть погашения" : "Показать погашения"}
                                        >
                                            {isExpanded ? (
                                                <Icons.ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <Icons.ChevronDown className="h-4 w-4" />
                                            )}
                                            {shortageRepayments.length > 0 && (
                                                <span className="ml-1 text-xs">({shortageRepayments.length})</span>
                                            )}
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleAddRepayment(shortage)}>
                                            <Icons.Plus className="h-4 w-4 mr-1 text-red-500" />
                                        </Button>
                                        <Select>
                                            <SelectTrigger className="w-[100px] h-8">
                                                <SelectValue placeholder="Ещё" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="edit">
                                                    Редактировать
                                                    <Icons.Eye onClick={() => handleView(shortage)} className="h-4 w-4" />
                                                </SelectItem>
                                                <SelectItem value="show">
                                                    Просмотр
                                                    <Icons.Edit onClick={() => handleEdit(shortage)} className="h-4 w-4" />
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
                            {isExpanded && shortageRepayments.length > 0 && (
                                <TableRow className="bg-green-50/50 hover:bg-green-50/70">
                                    <TableCell colSpan={12} className="p-0">
                                        <div className="p-4 border-l-4 border-green-500">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Icons.FileText className="h-4 w-4 text-green-700" />
                                                    <h4 className="font-semibold text-green-900">
                                                        Реестр погашений для акта {shortage.actNumber}
                                                    </h4>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleExportToPDF(shortage.id)}
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
                                                    {shortageRepayments.map((repayment) => (
                                                        <TableRow key={repayment.id} className="bg-white">
                                                            <TableCell>{repayment.djArticle}</TableCell>
                                                            <TableCell>{repayment.documentName}</TableCell>
                                                            <TableCell>{repayment.documentNumber}</TableCell>
                                                            <TableCell>{repayment.documentDate}</TableCell>
                                                            <TableCell className="font-semibold text-green-600">
                                                                {formatNumber(repayment.repaidAmount)} cум
                                                            </TableCell>
                                                            <TableCell className="font-semibold">
                                                                {formatNumber(repayment.remainder)} cум
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
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-l-4 ml-4 border-sky-500"></div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 print:hidden">
                <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Всего недостач</CardTitle>
                        <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                            <Icons.FileText className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700">{shortages.length}</div>
                        <p className="text-xs text-blue-600 mt-1">Зарегистрировано</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-900">Общая сумма</CardTitle>
                        <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                            <Icons.DollarSign className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-700">
                            {formatNumber(shortages.reduce((sum, s) => sum + (s.amountDetected || 0), 0))} cум
                        </div>
                        <p className="text-xs text-green-600 mt-1">Выявлено недостач</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-900">Возмещено</CardTitle>
                        <div className="rounded-full bg-orange-500 p-2 ring-4 ring-orange-200">
                            <Icons.TrendingUp className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-700">
                            {formatNumber(shortages.reduce((sum, s) => sum + (s.amountCompensated || 0), 0))} cум
                        </div>
                        <p className="text-xs text-orange-600 mt-1">Погашено</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-900">Инвентаризация</CardTitle>
                        <div className="rounded-full bg-yellow-500 p-2 ring-4 ring-yellow-200">
                            <Icons.Clipboard className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-700">
                            {shortages.filter(s => s.shortageType === "Недостача при инвентаризации").length}
                        </div>
                        <p className="text-xs text-yellow-600 mt-1">Выявлено</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-900">Остаток</CardTitle>
                        <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                            <Icons.AlertCircle className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-700">
                            {formatNumber(
                                shortages.reduce((sum, s) => sum + ((s.amountToRecover || 0) - (s.amountCompensated || 0)), 0),
                            )}{" "}
                            cум
                        </div>
                        <p className="text-xs text-purple-600 mt-1">К возмещению</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-900">Списано</CardTitle>
                        <div className="rounded-full bg-slate-500 p-2 ring-4 ring-slate-200">
                            <Icons.Trash className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-700">
                            {shortages.filter(s => s.status === "Списано").length}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">Дел закрыто</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="print:hidden">
                    <CardTitle>Фильтры</CardTitle>
                    <CardDescription>Поиск и фильтрация недостач</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
                        <Input
                            placeholder="№ акта..."
                            value={filters.actNumber}
                            onChange={(e) => setFilters({ ...filters, actNumber: e.target.value })}
                        />
                        <Input
                            placeholder="Воинская часть..."
                            value={filters.unit}
                            onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
                        />
                        <Input
                            placeholder="Ответственный..."
                            value={filters.responsible}
                            onChange={(e) => setFilters({ ...filters, responsible: e.target.value })}
                        />
                        <div className="flex items-center gap-2 col-span-2">
                            <Select
                                value={filters.status || "all"}
                                onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? "" : value })}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Все статусы" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все статусы</SelectItem>
                                    <SelectItem value="В работе">В работе</SelectItem>
                                    <SelectItem value="Возвращено">Возвращено</SelectItem>
                                    <SelectItem value="Списано">Списано</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Режим отображения" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="list">Список</SelectItem>
                                    <SelectItem value="districts">По округам</SelectItem>
                                    <SelectItem value="assets">По видам мат. средств</SelectItem>
                                    <SelectItem value="types">По видам нарушения</SelectItem>
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
                            <CardTitle>Реестр недостач и хищений материальных средств</CardTitle>
                            <CardDescription>Всего записей: {filteredShortages.length}</CardDescription>
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
                                Добавить недостачу
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        {viewMode === "list" ? (
                            renderTable(filteredShortages)
                        ) : (
                            <Accordion type="multiple" className="space-y-2">
                                {Object.entries(groupedShortages).map(([key, items]) => {
                                    const totalSum = items.reduce((acc, item) => acc + item.amountDetected, 0)
                                    const totalCompensated = items.reduce((acc, item) => acc + (item.amountCompensated || 0), 0)
                                    const totalRecoverable = items.reduce((acc, item) => acc + (item.amountToRecover || 0), 0)
                                    const totalRemainder = totalRecoverable - totalCompensated

                                    return (
                                        <AccordionItem key={key} value={key} className="border rounded-lg bg-white shadow-sm">
                                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 pr-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-50 rounded-lg">
                                                            <Icons.List className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <span className="font-semibold text-base text-slate-900">{key}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 text-sm">
                                                        <Badge variant="outline" className="h-8 px-3 gap-2 bg-slate-50 border-slate-200 text-slate-600 font-medium">
                                                            <Icons.FileText className="h-4 w-4" />
                                                            Записей: {items.length}
                                                        </Badge>

                                                        <div className="flex items-center h-8 px-3 gap-2 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                                            <span className="text-xs font-normal uppercase tracking-wider text-blue-600/80">Выявлено:</span>
                                                            <span className="font-bold whitespace-nowrap">{formatNumber(totalSum)} сум</span>
                                                        </div>

                                                        <div className="flex items-center h-8 px-3 gap-2 rounded-md bg-green-50 text-green-700 border border-green-100">
                                                            <span className="text-xs font-normal uppercase tracking-wider text-green-600/80">Возмещено:</span>
                                                            <span className="font-bold whitespace-nowrap">{formatNumber(totalCompensated)} сум</span>
                                                        </div>

                                                        <div className="flex items-center h-8 px-3 gap-2 rounded-md bg-red-50 text-red-700 border border-red-100">
                                                            <span className="text-xs font-normal uppercase tracking-wider text-red-600/80">Остаток:</span>
                                                            <span className="font-bold whitespace-nowrap">{formatNumber(totalRemainder)} сум</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4">
                                                <div className="overflow-x-auto">
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Добавить недостачу</DialogTitle>
                        <DialogDescription>Заполните информацию о выявленной недостаче имущества</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>№ акта</Label>
                            <Input placeholder="АКТ-001/2024" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Дата выявления</Label>
                            <Input type="date" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Воинская часть</Label>
                            <Input placeholder="Введите воинскую часть" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Военный округ</Label>
                            <Input placeholder="Введите военный округ" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Ответственный</Label>
                            <Input placeholder="ФИО ответственного" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Должность ответственного</Label>
                            <Input placeholder="Должность" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Виды материальных средств</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                                <option value="">Выберите тип</option>
                                <option value="clothing">Вещевое имущество</option>
                                <option value="food">Продовольствие</option>
                                <option value="fuel">ГСМ</option>
                                <option value="equipment">Техника</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Вид нарушения</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                                <option value="">Выберите вид</option>
                                <option value="inventory">Недостача при инвентаризации</option>
                                <option value="receipt">Недостача при приемке</option>
                                <option value="transfer">Недостача при передаче</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Сумма выявленная (uzs)</Label>
                            <Input type="number" placeholder="0" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Статус</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                                <option value="new">Новая</option>
                                <option value="in-progress">В работе</option>
                                <option value="compensated">Возвращено</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Описание</Label>
                            <Textarea placeholder="Подробное описание недостачи..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={() => setShowAddDialog(false)}>Добавить недостачу</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Детали лицевого счёта #{selectedItem?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Номер дела:</span>
                                <span className="font-mono">{selectedItem.caseId}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Тип имущества:</span>
                                <span>{selectedItem.assetType}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Сумма:</span>
                                <span className="font-semibold">{formatNumber(selectedItem.amount)} ₽</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Дата открытия:</span>
                                <span>{selectedItem.date}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-semibold">Статус:</span>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Редактировать лицевой счёт #{selectedItem?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Номер дела</Label>
                                <Input defaultValue={selectedItem.caseId} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Тип имущества</Label>
                                <Input defaultValue={selectedItem.assetType} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Сумма недостачи (₽)</Label>
                                <Input type="number" defaultValue={selectedItem.amount} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Дата открытия</Label>
                                <Input type="date" defaultValue={selectedItem.date} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Статус</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                    defaultValue={selectedItem.status}
                                >
                                    <option value="Открыто">Открыто</option>
                                    <option value="Расследуется">Расследуется</option>
                                    <option value="Закрыто">Закрыто</option>
                                </select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={() => setShowEditDialog(false)}>Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showAddRepaymentDialog} onOpenChange={setShowAddRepaymentDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Добавить погашение</DialogTitle>
                        <DialogDescription>Запись погашения для акта {selectedShortage?.actNumber}</DialogDescription>
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
                            <Select
                                value={repaymentForm.documentName}
                                onValueChange={(value) => setRepaymentForm({ ...repaymentForm, documentName: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите тип документа" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Раздаточная ведомость">Раздаточная ведомость</SelectItem>
                                    <SelectItem value="Платёжное поручение">Платёжное поручение</SelectItem>
                                    <SelectItem value="Квитанция">Квитанция</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Номер документа</Label>
                            <Input
                                placeholder="Введите номер документа"
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
                        <div className="grid gap-2">
                            <Label>Погашенная сумма (uzs)</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={repaymentForm.repaidAmount}
                                onChange={(e) => setRepaymentForm({ ...repaymentForm, repaidAmount: e.target.value })}
                            />
                        </div>
                        {selectedShortage && repaymentForm.repaidAmount && (
                            <div className="grid gap-2">
                                <Label>Остаток (uzs)</Label>
                                <Input
                                    type="number"
                                    value={getShortageRemainder(selectedShortage) - Number.parseFloat(repaymentForm.repaidAmount || "0")}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddRepaymentDialog(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleSaveRepayment}>Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditRepaymentDialog} onOpenChange={setShowEditRepaymentDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Редактировать погашение</DialogTitle>
                        <DialogDescription>Изменение записи погашения #{selectedRepayment?.id}</DialogDescription>
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
                            <Select
                                value={repaymentForm.documentName}
                                onValueChange={(value) => setRepaymentForm({ ...repaymentForm, documentName: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите тип документа" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Раздаточная ведомость">Раздаточная ведомость</SelectItem>
                                    <SelectItem value="Платёжное поручение">Платёжное поручение</SelectItem>
                                    <SelectItem value="Квитанция">Квитанция</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Номер документа</Label>
                            <Input
                                placeholder="Введите номер документа"
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
                        <div className="grid gap-2">
                            <Label>Погашенная сумма (uzs)</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={repaymentForm.repaidAmount}
                                onChange={(e) => setRepaymentForm({ ...repaymentForm, repaidAmount: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowEditRepaymentDialog(false)
                                setSelectedRepayment(null)
                            }}
                        >
                            Отмена
                        </Button>
                        <Button onClick={handleSaveEditedRepayment}>Сохранить изменения</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
