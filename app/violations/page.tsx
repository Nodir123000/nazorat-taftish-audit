"use client"

import { useState, useMemo, useCallback, Fragment } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FinancialViolationsPage() {
    const [activeSection, setActiveSection] = useState("decisions")
    const pageId = "violations-financial"

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId)
    }

    const sections = [
        {
            id: "decisions",
            title: "Не доплата",
            icon: Icons.CheckCircle,
        },
    ]

    const renderSectionContent = () => {
        switch (activeSection) {
            case "decisions":
                return <DecisionsContent />
            default:
                return <DecisionsContent />
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <SectionsTabs
                submoduleTitle="4.1 Финансовые нарушения"
                sections={sections}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                pageId={pageId}
            />

            <div className="p-6">{renderSectionContent()}</div>
        </div>
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

    const underpayments = [
        {
            id: 1,
            actNumber: "НД-2024-001",
            detectionDate: "25.01.2024",
            unit: "Воинская часть 00001",
            unitDistrict: "Северо‑Западный военный округ",
            responsible: "капитан Хайдаров Н.С.",
            responsiblePosition: "Начальник финансовой службы",
            paymentName: "Премия за выслугу лет",
            underpaymentType: "Денежные довольствия",
            amountDetected: 45000,
            amountToRecover: 45000,
            amountCompensated: 45000,
            reason: "Ошибка в расчётах",
            status: "Возвращено",
        },
        {
            id: 2,
            actNumber: "НД-2024-002",
            detectionDate: "18.02.2024",
            unit: "Воинская часть 00002",
            unitDistrict: "Юго‑Западный специальный военный округ",
            responsible: "капитан Иванов И.И.",
            responsiblePosition: "Заместитель командира",
            paymentName: "Оклад за январь",
            underpaymentType: "Заработная плата",
            amountDetected: 68000,
            amountToRecover: 68000,
            amountCompensated: 20000,
            reason: "Недоплата",
            status: "В работе",
        },
        {
            id: 3,
            actNumber: "НД-2024-003",
            detectionDate: "08.03.2024",
            unit: "Воинская часть 00003",
            unitDistrict: "Центральный военный округ",
            responsible: "подполковник Сидоров С.С.",
            responsiblePosition: "Начальник отдела",
            paymentName: "Суточные за командировку",
            underpaymentType: "Командировочные расходы",
            amountDetected: 32000,
            amountToRecover: 32000,
            amountCompensated: 32000,
            reason: "Занижение суммы",
            status: "Возвращено",
        },
        {
            id: 4,
            actNumber: "НД-2024-003",
            detectionDate: "08.03.2024",
            unit: "Воинская часть 00004",
            unitDistrict: "Ташкентский военный округ",
            responsible: "подполковник Сидоров С.С.",
            responsiblePosition: "Начальник отдела",
            paymentName: "Суточные за командировку",
            underpaymentType: "Командировочные расходы",
            amountDetected: 32000,
            amountToRecover: 32000,
            amountCompensated: 32000,
            reason: "Занижение суммы",
            status: "Возвращено",
        },
        {
            id: 5,
            actNumber: "НД-2024-003",
            detectionDate: "08.03.2024",
            unit: "Воинская часть 00005",
            unitDistrict: "Восточный военный округ",
            responsible: "подполковник Сидоров С.С.",
            responsiblePosition: "Начальник отдела",
            paymentName: "Суточные за командировку",
            underpaymentType: "Командировочные расходы",
            amountDetected: 32000,
            amountToRecover: 32000,
            amountCompensated: 32000,
            reason: "Занижение суммы",
            status: "Возвращено",
        },
        {
            id: 6,
            actNumber: "НД-2024-003",
            detectionDate: "08.03.2024",
            unit: "Воинская часть 00006",
            unitDistrict: "Центарльный подчинения",
            responsible: "подполковник Сидоров С.С.",
            responsiblePosition: "Начальник отдела",
            paymentName: "Суточные за командировку",
            underpaymentType: "Командировочные расходы",
            amountDetected: 32000,
            amountToRecover: 32000,
            amountCompensated: 32000,
            reason: "Занижение суммы",
            status: "Возвращено",
        },
    ]

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
                <Card className="relative overflow-hidden border-2 border-cyan-200 bg-linear-to-br from-cyan-50 to-cyan-100 hover:shadow-lg transition-all hover:scale-105">
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

                <Card className="relative overflow-hidden border-2 border-sky-200 bg-linear-to-br from-sky-50 to-sky-100 hover:shadow-lg transition-all hover:scale-105">
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

                <Card className="relative overflow-hidden border-2 border-lime-200 bg-linear-to-br from-lime-50 to-lime-100 hover:shadow-lg transition-all hover:scale-105">
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

                <Card className="relative overflow-hidden border-2 border-red-200 bg-linear-to-br from-red-50 to-red-100 hover:shadow-lg transition-all hover:scale-105">
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
                                    <TableHead>№ акта</TableHead>
                                    <TableHead>
                                        Дата <br /> выявления
                                    </TableHead>
                                    <TableHead>
                                        Воинская <br /> часть
                                    </TableHead>
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
                                                <TableCell className="font-medium">{underpayment.actNumber}</TableCell>
                                                <TableCell>{underpayment.detectionDate}</TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-sm font-semibold" style={{ color: "#222" }}>
                                                            {underpayment.unit}
                                                        </div>
                                                        <div className="text-xs" style={{ color: "#777" }}>
                                                            {underpayment.unitDistrict}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-sm font-semibold" style={{ color: "#222" }}>
                                                            {underpayment.responsible}
                                                        </div>
                                                        <div className="text-xs" style={{ color: "#777" }}>
                                                            {underpayment.responsiblePosition}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{underpayment.paymentName}</TableCell>
                                                <TableCell className="flex flex-col text-xs font-semibold text-red-500">
                                                    {underpayment.underpaymentType.split(" ").map((word: string, index: number) => {
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
                                                            <SelectTrigger className="w-12.5 h-8">
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
                                                    <TableCell colSpan={13} className="p-0">
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
                </CardContent>
            </Card>

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
        </div>
    )
}
