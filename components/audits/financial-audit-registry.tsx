"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "@/lib/i18n/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { TableSkeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { NoDataFound } from "@/components/ui/empty-state"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FinancialAuditDTO, AuditViolationDTO } from "@/lib/types/audits.dto"
import * as XLSX from "xlsx"

interface FinancialAuditRegistryProps {
    audits: FinancialAuditDTO[]
    violations: AuditViolationDTO[]
    isLoading?: boolean
    onAddAudit: () => void
    onEditAudit: (audit: FinancialAuditDTO) => void
    onViewDetail: (audit: FinancialAuditDTO) => void
    onAddViolation: (audit: FinancialAuditDTO) => void
    onEditViolation: (violation: AuditViolationDTO) => void
    onDeleteViolation: (id: number) => void
    onInitiateInvestigation?: (violation: AuditViolationDTO) => void
    onTransferLawEnforcement?: (violation: AuditViolationDTO) => void
    hideFilters?: boolean
    hideHeader?: boolean
    expandedViolationId?: number | null
    onToggleViolationExpand?: (id: number) => void
    renderViolationExpansion?: (violation: AuditViolationDTO) => React.ReactNode
}

const CONTROL_BODIES: Record<string, string> = {
    "КРУ МО РУ": "Контрольно-ревизионное управление Министерства обороны Республики Узбекистан",
    "Прокуратура РУ": "Прокуратура Республики Узбекистан",
    "СНБ РУ": "Служба национальной безопасности Республики Узбекистан",
    "МО РУ": "Министерство обороны Республики Узбекистан",
    "ВО МО РУ": "Должностные лица военроны Республики Узбекистан",
    "Соединение МО РУ": "Должностные лица соединения Министерства обороны Республики Узбекистан",
    "Объединение МО РУ": "Должностные лица объединения Министерства обороны Республики Узбекистан",
    "В/Ч МО РУ": "Должностные лица воинской части Министерства обороны Республики Узбекистан",
}

const CONTROL_BODY_ORDER = [
    "КРУ МО РУ",
    "Прокуратура РУ",
    "СНБ РУ",
    "МО РУ",
    "ВО МО РУ",
    "Соединение МО РУ",
    "Объединение МО РУ",
    "В/Ч МО РУ",
]

export function FinancialAuditRegistry({
    audits,
    violations,
    isLoading,
    onAddAudit,
    onEditAudit,
    onViewDetail,
    onAddViolation,
    onEditViolation,
    onDeleteViolation,
    onInitiateInvestigation,
    onTransferLawEnforcement,
    hideFilters = false,
    hideHeader = false,
    expandedViolationId,
    onToggleViolationExpand,
    renderViolationExpansion,
}: FinancialAuditRegistryProps) {
    const { t } = useTranslation()
    const [filters, setFilters] = useState({ search: "", status: "", dateFrom: "" })
    const [viewMode, setViewMode] = useState<"list" | "districts" | "directions" | "controlBody">("list")
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

    const getAuditViolations = (auditId: number) => violations.filter((v) => v.auditId === auditId)
    const getAuditViolationsTotal = (auditId: number) => getAuditViolations(auditId).reduce((sum, v) => sum + v.amount, 0)
    const getAuditRecoveredTotal = (auditId: number) => getAuditViolations(auditId).reduce((sum, v) => sum + (v.recovered || 0), 0)
    const getAuditViolationsCount = (auditId: number) => getAuditViolations(auditId).reduce((sum, v) => sum + (v.count || 1), 0)
    const getAuditResolvedCount = (auditId: number) => getAuditViolations(auditId).filter((v) => v.recovered > 0).length

    const toggleRowExpansion = (id: number) => {
        setExpandedRows((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const getDistrictAbbr = (district: string) => {
        const abbr: Record<string, string> = {
            "Ташкентский военный округ": "ТВО",
            "Центральный военный округ": "ЦВО",
            "Восточный военный округ": "ВВО",
            "Западный военный округ": "ЗВО",
            "Северо-Западный военный округ": "СЗВО",
            "Юго-Западный особый военный округ": "ЮЗОВО",
            "Юго‑Западный военный округ": "ЮЗВО",
            "Юго‑Западный специальный военный округ": "ЮЗСВО",
            "Центральный подчинения": "ЦП",
            "Центарльный подчинения": "ЦП",
        }
        return abbr[district] || district
    }

    const getDirectionAbbr = (direction: string) => {
        const abbr: Record<string, string> = {
            "Главное финансово-экономическое управление МО РУ": "ГФЭУ МО РУ",
            "Главное финансово-экономическое управление": "ГФЭУ",
            "Управление материально-технического снабжения": "УМТС",
            "Управление кадров и воспитательной работы": "УКиВР",
            "Главное военно-медицинское управление": "ГВМУ",
            "Управление вооружения": "УВ",
            "Управление тылового обеспечения": "УТО",
            "Управление финансов округа": "УФО",
            "Управление вещевого снабжения": "УВС",
            "КЭУ Округа": "КЭУ",
            "Медслужба округа": "МС",
            "Служба ракетно-артиллерийского вооружения": "СРАВ",
            "Инспекция пожарной безопасности": "ИПБ",
            "Экологическая служба": "ЭС",
            "Тыловая служба": "ТС",
            "Служба горючего": "СГ",
        }
        return abbr[direction] || direction
    }

    const filteredAudits = useMemo(() => {
        return audits.filter(audit => {
            const matchesSearch = filters.search
                ? audit.unit.toLowerCase().includes(filters.search.toLowerCase()) ||
                audit.cashier.toLowerCase().includes(filters.search.toLowerCase())
                : true
            const matchesStatus = filters.status ? audit.status === filters.status : true
            const matchesDate = filters.dateFrom ? audit.date >= filters.dateFrom : true
            return matchesSearch && matchesStatus && matchesDate
        })
    }, [audits, filters])

    const groupedAudits = useMemo(() => {
        const grouped: Record<string, FinancialAuditDTO[]> = {}
        if (viewMode === 'list') return { "Список": filteredAudits }

        filteredAudits.forEach(item => {
            let key = ""
            if (viewMode === "districts") key = item.unitSubtitle || "Не указан округ"
            else if (viewMode === "directions") key = item.inspectionDirection || "Не указано направление"
            else if (viewMode === "controlBody") key = item.controlBody || "Не указан орган контроля"

            if (!grouped[key]) grouped[key] = []
            grouped[key].push(item)
        })

        if (viewMode === "controlBody") {
            const sortedKeys = Object.keys(grouped).sort((a, b) => {
                const indexA = CONTROL_BODY_ORDER.indexOf(a)
                const indexB = CONTROL_BODY_ORDER.indexOf(b)
                if (indexA === -1) return 1
                if (indexB === -1) return -1
                return indexA - indexB
            })
            const sortedGrouped: Record<string, FinancialAuditDTO[]> = {}
            sortedKeys.forEach(key => sortedGrouped[key] = grouped[key])
            return sortedGrouped
        }
        return grouped
    }, [filteredAudits, viewMode])

    const handleExportExcel = () => {
        let dataToExport: any[] = []
        Object.entries(groupedAudits).forEach(([key, items]) => {
            if (viewMode !== "list") {
                dataToExport.push({ isGroupHeader: true, title: key })
            }
            dataToExport = [...dataToExport, ...items]
        })

        const exportData = dataToExport.map((a: any) => {
            if (a.isGroupHeader) {
                return { "ID": a.title.toUpperCase(), "№ Акта": "", "Дата": "", "Орган контроля": "", "Объект контроля": "", "Округ": "", "Направление": "", "Тип": "", "Сумма нарушений": "", "Возмещено": "", "Кол-во нарушений": "", "Статус": "" }
            }
            return {
                "ID": a.id,
                "№ Акта": `AKT-${a.id.toString().padStart(3, '0')}`,
                "Дата": a.date,
                "Орган контроля": CONTROL_BODIES[a.controlBody] || a.controlBody,
                "Объект контроля": a.unit,
                "Округ": a.unitSubtitle,
                "Направление": a.inspectionDirection,
                "Тип": a.inspectionType,
                "Сумма нарушений": getAuditViolationsTotal(a.id),
                "Возмещено": getAuditRecoveredTotal(a.id),
                "Кол-во нарушений": getAuditViolationsCount(a.id),
                "Статус": a.status,
            }
        })

        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Реестр нарушений")
        XLSX.writeFile(wb, `financial_audits_${viewMode}_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    const renderTable = (items: FinancialAuditDTO[]) => (
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50">
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center w-[80px]">ИД плана</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center whitespace-nowrap">№ акта и дата</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center">Орган контроля</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center">{t("audits.financial.table.controlObject")}</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center">{t("audits.financial.table.inspectionDirection")}</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center">{t("audits.financial.table.inspectionType")}</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center">Сумма нарушений</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center">Возмещено</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center whitespace-nowrap">Количество</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center">Виновные лица</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center">{t("audits.financial.table.status")}</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-700 text-center">{t("audits.financial.table.actions")}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableSkeleton columns={12} rows={5} />
                ) : items.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={12} className="h-24">
                            <NoDataFound description="Результаты не найдены. Попробуйте изменить параметры поиска." />
                        </TableCell>
                    </TableRow>
                ) : (
                    items.map((audit) => {
                        const auditViolations = getAuditViolations(audit.id)
                        const isExpanded = expandedRows.has(audit.id)
                        const totalAmount = getAuditViolationsTotal(audit.id)
                        const recoveredAmount = getAuditRecoveredTotal(audit.id)
                        const violationsCount = getAuditViolationsCount(audit.id)
                        const resolvedCount = getAuditResolvedCount(audit.id)

                        return (
                            <React.Fragment key={audit.id}>
                                <TableRow>
                                    <TableCell className="py-2.5 text-center">
                                        <div className="font-mono text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded inline-block">
                                            {audit.id}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-xs text-slate-800">AKT-{audit.id.toString().padStart(3, '0')}</span>
                                            <span className="text-[9px] text-slate-400">{audit.date}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold self-start truncate max-w-[120px]" title={CONTROL_BODIES[audit.controlBody] || audit.controlBody}>
                                                {audit.controlBody || audit.unitSubtitle}
                                            </code>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-xs text-slate-800">{audit.unit}</div>
                                            <div className="text-[9px] text-slate-400">{getDistrictAbbr(audit.unitSubtitle)}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-[10px] text-slate-700">{audit.inspectionDirection}</div>
                                            <div className="text-[9px] text-slate-400">{getDirectionAbbr(audit.inspectionDirectionSubtitle)}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={audit.inspectionType === "плановые" ? "default" : "secondary"} className={audit.inspectionType === "плановые" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}>
                                            {audit.inspectionType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="font-bold text-[11px] text-slate-800">{totalAmount.toLocaleString()}</div>
                                        <div className="text-[9px] text-slate-400 mt-0.5">сум</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="font-bold text-[11px] text-green-600">{recoveredAmount.toLocaleString()}</div>
                                        <div className="text-[9px] text-green-600/60 mt-0.5">сум</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-bold">{violationsCount}</span>
                                        <span className="text-muted-foreground">/</span>
                                        <span className="font-bold text-green-600">{resolvedCount}</span>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-xs text-slate-800">{audit.cashier}</div>
                                            <div className="text-[9px] text-slate-400">{audit.cashierRole}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={audit.status === "Проверено" ? "default" : "secondary"}>{audit.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 items-center">
                                            <Button variant="ghost" size="sm" onClick={() => toggleRowExpansion(audit.id)} title={isExpanded ? "Скрыть" : "Показать нарушения"}>
                                                {isExpanded ? <Icons.ChevronUp className="h-4 w-4" /> : <Icons.ChevronDown className="h-4 w-4" />}
                                                {auditViolations.length > 0 && <span className="ml-1 text-xs">({auditViolations.length})</span>}
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => onAddViolation(audit)}>
                                                <Icons.Plus className="h-4 w-4 mr-1 text-red-500" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => onViewDetail(audit)}>
                                                <Icons.Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => onEditAudit(audit)}>
                                                <Icons.Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {isExpanded && auditViolations.length > 0 && (
                                    <TableRow className="bg-red-50/50 hover:bg-red-50/70">
                                        <TableCell colSpan={15} className="p-0">
                                            <div className="p-4 border-l-4 border-red-500 bg-red-50/30">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Icons.AlertTriangle className="h-5 w-5 text-red-600 fill-red-100" />
                                                        <h4 className="font-bold text-lg text-red-900">Реестр выявленных нарушений</h4>
                                                    </div>
                                                </div>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-red-100/50">
                                                            <TableHead className="text-red-900 text-center w-[50px]">№ п/п</TableHead>
                                                            <TableHead className="text-red-900 text-center">Вид нарушения</TableHead>
                                                            <TableHead className="text-red-900 text-center">Тип нарушения</TableHead>
                                                            <TableHead className="text-red-900 text-center">Источник</TableHead>
                                                            <TableHead className="text-red-900 text-center">Сумма нарушений</TableHead>
                                                            <TableHead className="text-red-900 text-center">Возмещено в ходе</TableHead>
                                                            <TableHead className="text-red-900 text-center">Количество</TableHead>
                                                            <TableHead className="text-red-900 text-center">Виновные лица</TableHead>
                                                            <TableHead className="text-red-900 text-center">Действия</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {auditViolations.map((v, index) => (
                                                            <React.Fragment key={v.id}>
                                                                <TableRow className="bg-white">
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{v.kind}</TableCell>
                                                                    <TableCell>{v.type}</TableCell>
                                                                    <TableCell>{v.source}</TableCell>
                                                                    <TableCell className="text-right font-semibold text-red-600">{v.amount.toLocaleString()} cум</TableCell>
                                                                    <TableCell className="text-right font-semibold text-green-600">{v.recovered.toLocaleString()} cум</TableCell>
                                                                    <TableCell className="text-center">
                                                                        <span className="font-bold">{v.count}</span>
                                                                        <span className="text-muted-foreground">/</span>
                                                                        <span className="font-bold text-green-600">{v.recovered > 0 ? 1 : 0}</span>
                                                                    </TableCell>
                                                                    <TableCell className="whitespace-pre-line text-sm">{v.responsible}</TableCell>
                                                                    <TableCell>
                                                                        <div className="flex gap-1 justify-center">
                                                                            {onToggleViolationExpand && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    title="История погашений"
                                                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                                    onClick={() => onToggleViolationExpand(v.id)}
                                                                                >
                                                                                    {expandedViolationId === v.id
                                                                                        ? <Icons.ChevronUp className="h-4 w-4" />
                                                                                        : <Icons.ChevronDown className="h-4 w-4" />}
                                                                                </Button>
                                                                            )}
                                                                            {onInitiateInvestigation && (
                                                                            <Button variant="ghost" size="sm" title={t("audits.financial.action.initiateInvestigation")} className="text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => onInitiateInvestigation(v)}>
                                                                                <Icons.ShieldAlert className="h-4 w-4" />
                                                                            </Button>
                                                                            )}
                                                                            {onTransferLawEnforcement && (
                                                                            <Button variant="ghost" size="sm" title={t("audits.financial.action.transferLawEnforcement")} className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onTransferLawEnforcement(v)}>
                                                                                <Icons.Gavel className="h-4 w-4" />
                                                                            </Button>
                                                                            )}
                                                                            <Button variant="ghost" size="sm" title="Редактировать" onClick={() => onEditViolation(v)}>
                                                                                <Icons.Edit className="h-4 w-4" />
                                                                            </Button>
                                                                            <Button variant="ghost" size="sm" title="Удалить" className="text-red-500 hover:text-red-700" onClick={() => onDeleteViolation(v.id)}>
                                                                                <Icons.Trash className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                                {expandedViolationId === v.id && renderViolationExpansion && (
                                                                    <TableRow>
                                                                        <TableCell colSpan={9} className="p-0">
                                                                            {renderViolationExpansion(v)}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        )
                    })
                )}
            </TableBody>
        </Table>
    )

    return (
        <div className="space-y-6">
            {!hideFilters && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t("audits.financial.filters.title")}</CardTitle>
                        <CardDescription>{t("audits.financial.filters.description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Input className="w-64" placeholder={t("audits.financial.filters.searchPlaceholder")} value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
                            <select className="flex h-10 w-44 rounded-md border border-input bg-background px-3 py-2" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                                <option value="">{t("audits.financial.filters.allStatuses")}</option>
                                <option value="Проверено">{t("audits.financial.filters.statusChecked")}</option>
                                <option value="В процессе">{t("audits.financial.filters.statusInProgress")}</option>
                                <option value="Назначено">{t("audits.financial.filters.statusAssigned")}</option>
                            </select>
                            <Input className="w-40" type="date" placeholder={t("audits.financial.filters.dateFrom")} value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
                            <select className="flex h-10 w-44 rounded-md border border-input bg-background px-3 py-2" value={viewMode} onChange={(e) => setViewMode(e.target.value as any)}>
                                <option value="list">Список</option>
                                <option value="districts">По округам</option>
                                <option value="directions">По направлениям</option>
                                <option value="controlBody">По органу контроля</option>
                            </select>
                            <Button variant="outline" onClick={() => setFilters({ search: "", status: "", dateFrom: "" })}>
                                {t("audits.financial.filters.reset")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="print:shadow-none print:border-none">
                {!hideHeader && (
                    <CardHeader className="print:hidden">
                        <div className="flex items-center justify-between">
                            <CardTitle>Реестр результатов ревизии и проверок</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleExportExcel}>
                                    <Icons.Download className="mr-2 h-4 w-4" /> Excel
                                </Button>
                                <Button variant="outline" onClick={() => window.print()}>
                                    <Icons.Printer className="mr-2 h-4 w-4" /> Печать / PDF
                                </Button>
                                <Button onClick={onAddAudit}>
                                    <Icons.Plus className="mr-2 h-4 w-4" /> Добавить результат КРР
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                )}
                <CardContent className="print:p-0">
                    <ErrorBoundary>
                        {viewMode === "list" ? renderTable(groupedAudits["Список"] || []) : (
                            <Accordion type="multiple" className="space-y-2">
                                {Object.entries(groupedAudits).map(([key, items]) => {
                                    const totalViolations = items.reduce((acc, item) => acc + getAuditViolationsCount(item.id), 0)
                                    const resolvedViolations = items.reduce((acc, item) => acc + getAuditResolvedCount(item.id), 0)
                                    const totalAmount = items.reduce((acc, item) => acc + getAuditViolationsTotal(item.id), 0)
                                    const recoveredAmount = items.reduce((acc, item) => acc + getAuditRecoveredTotal(item.id), 0)

                                    return (
                                        <AccordionItem key={key} value={key} className="border rounded-lg bg-white shadow-sm">
                                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center justify-between w-full pr-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-blue-100 p-2 rounded-lg"><Icons.List className="h-5 w-5 text-blue-600" /></div>
                                                        <span className="font-semibold text-base text-slate-800">{viewMode === "controlBody" ? (CONTROL_BODIES[key] || key) : key}</span>
                                                    </div>
                                                    <div className="flex items-center gap-6 text-sm font-mono">
                                                        <div className="w-24 text-right"><span className="text-muted-foreground text-xs">Проверок</span><div className="font-bold text-slate-900">{items.length}</div></div>
                                                        <div className="w-32 text-right"><span className="text-muted-foreground text-xs">Сумма</span><div className="font-bold text-red-600">{totalAmount.toLocaleString()}</div></div>
                                                        <div className="w-32 text-right"><span className="text-muted-foreground text-xs">Возмещено</span><div className="font-bold text-green-600">{recoveredAmount.toLocaleString()}</div></div>
                                                        <div className="w-24 text-right"><span className="text-muted-foreground text-xs">Количество</span><div><span className="font-bold">{totalViolations}</span>/<span className="font-bold text-green-600">{resolvedViolations}</span></div></div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-0 pb-0 border-t">
                                                <div className="bg-slate-50/50 p-4">{renderTable(items)}</div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        )}
                    </ErrorBoundary>
                </CardContent>
            </Card>
        </div>
    )
}
