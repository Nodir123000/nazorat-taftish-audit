"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import { ServiceInvestigationDTO } from "@/lib/types/audits.dto"
import { TableSkeleton } from "@/components/ui/skeleton"
import { NoDataFound, NoSearchResults } from "@/components/ui/empty-state"

interface ServiceInvestigationTableProps {
    data: ServiceInvestigationDTO[]
    isLoading: boolean
    search: string
    statusFilter: string
    onReset: () => void
    onEdit?: (si: ServiceInvestigationDTO) => void
}

export function ServiceInvestigationTable({
    data,
    isLoading,
    search,
    statusFilter,
    onReset,
    onEdit
}: ServiceInvestigationTableProps) {
    const { t } = useTranslation()

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Просрочено": return <Badge variant="destructive" className="font-bold">Просрочено</Badge>
            case "В процессе": return <Badge className="bg-amber-500 hover:bg-amber-600">В процессе</Badge>
            case "Завершено": return <Badge className="bg-emerald-500 hover:bg-emerald-600">Завершено</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    const getResultBadge = (result: string) => {
        switch (result) {
            case "Вина установлена": return <Badge variant="outline" className="border-rose-500 text-rose-600 bg-rose-50 font-semibold shadow-sm">Вина установлена</Badge>
            case "Полная мат. ответственность": return <Badge variant="outline" className="border-rose-600 text-rose-700 bg-rose-100 font-bold shadow-md">Полная мат. отв.</Badge>
            case "Вина не установлена": return <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 font-semibold shadow-sm">Вина не уст.</Badge>
            default: return <Badge variant="outline">{result}</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableBody>
                        <TableSkeleton columns={11} rows={5} />
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm h-[400px] flex items-center justify-center">
                {search || statusFilter ? (
                    <NoSearchResults query={search} onClear={onReset} />
                ) : (
                    <NoDataFound onReset={onReset} />
                )}
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-md transition-all duration-300">
            <Table>
                <TableHeader className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[120px] font-bold text-slate-700">№ Предп.</TableHead>
                        <TableHead className="font-bold text-slate-700">Воинская часть</TableHead>
                        <TableHead className="font-bold text-slate-700">Суть нарушения</TableHead>
                        <TableHead className="font-bold text-slate-700">Приказ о назн.</TableHead>
                        <TableHead className="font-bold text-slate-700">Виновное лицо</TableHead>
                        <TableHead className="font-bold text-slate-700">Итог расслед.</TableHead>
                        <TableHead className="font-bold text-slate-700">Наказание</TableHead>
                        <TableHead className="text-right font-bold text-slate-700">К взысканию</TableHead>
                        <TableHead className="font-bold text-slate-700">Дедлайн</TableHead>
                        <TableHead className="font-bold text-slate-700">Статус</TableHead>
                        <TableHead className="text-right w-[80px] font-bold text-slate-700">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((si) => (
                        <TableRow key={si.id} className="hover:bg-slate-50/50 transition-colors group">
                            <TableCell className="font-mono font-bold text-primary">{si.prescriptionNum}</TableCell>
                            <TableCell className="text-sm font-medium text-slate-900">{si.unitName}</TableCell>
                            <TableCell className="max-w-[200px]">
                                <div className="truncate text-sm text-slate-600" title={si.violationSummary}>
                                    {si.violationSummary}
                                </div>
                                {si.sourceViolationId && (
                                    <Badge variant="outline" className="mt-1 text-[9px] h-4 px-1.5 py-0 bg-blue-50 text-blue-700 border-blue-200 font-bold tracking-wider">
                                        SOURCE: {si.sourceViolationId}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-[11px] text-slate-500 font-mono">{si.assignmentOrder}</TableCell>
                            <TableCell className="text-sm font-bold text-slate-800">{si.responsiblePerson}</TableCell>
                            <TableCell>{getResultBadge(si.result)}</TableCell>
                            <TableCell className="text-xs italic text-slate-600 max-w-[150px] truncate" title={si.punishmentOrder}>
                                {si.punishmentOrder || "—"}
                            </TableCell>
                            <TableCell className="text-right font-black text-slate-900">
                                {si.amountToRecover ? `${si.amountToRecover.toLocaleString()} uzs` : "—"}
                            </TableCell>
                            <TableCell>
                                <div className={`text-sm font-bold ${si.status === 'Просрочено' ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>
                                    {si.deadline}
                                </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(si.status)}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-white hover:text-primary hover:shadow-sm"
                                    onClick={() => onEdit?.(si)}
                                >
                                    <Icons.Edit className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
