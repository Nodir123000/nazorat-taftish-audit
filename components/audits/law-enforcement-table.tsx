"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import { LawEnforcementCaseDTO } from "@/lib/types/audits.dto"
import { TableSkeleton } from "@/components/ui/skeleton"
import { NoDataFound, NoSearchResults } from "@/components/ui/empty-state"

interface LawEnforcementTableProps {
    data: LawEnforcementCaseDTO[]
    isLoading: boolean
    search: string
    statusFilter: string
    onReset: () => void
    onView?: (c: LawEnforcementCaseDTO) => void
    onFileClick?: (c: LawEnforcementCaseDTO) => void
}

export function LawEnforcementTable({
    data,
    isLoading,
    search,
    statusFilter,
    onReset,
    onView,
    onFileClick
}: LawEnforcementTableProps) {
    const { t } = useTranslation()

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Возбуждено УД": return <Badge className="bg-rose-600 shadow-sm font-bold">Возбуждено УД</Badge>
            case "На рассмотрении": return <Badge className="bg-blue-600 shadow-sm font-bold">На рассмотрении</Badge>
            case "Отказано": return <Badge variant="secondary" className="font-semibold">Отказано</Badge>
            case "Возвращено на доработку": return <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 font-semibold">Возвращено</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                <Table>
                    <TableBody>
                        <TableSkeleton columns={9} rows={5} />
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white h-[400px] flex items-center justify-center">
                {search || statusFilter ? (
                    <NoSearchResults query={search} onClear={onReset} />
                ) : (
                    <NoDataFound onReset={onReset} />
                )}
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xl transition-all duration-300">
            <Table>
                <TableHeader className="bg-slate-50/50 backdrop-blur-sm border-b border-slate-200">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[120px] font-bold text-slate-700 uppercase tracking-wider text-xs">ID Нар.</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Основание</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Исх. № и Дата</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Орган-получатель</TableHead>
                        <TableHead className="text-right font-bold text-slate-700 uppercase tracking-wider text-xs">Сумма ущерба</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Статус</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">№ Дела / Отказа</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Решение</TableHead>
                        <TableHead className="text-right w-[100px] font-bold text-slate-700 uppercase tracking-wider text-xs">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((c) => (
                        <TableRow key={c.id} className="hover:bg-slate-50/30 transition-colors group border-b border-slate-100 last:border-0">
                            <TableCell>
                                <div className="font-mono font-black text-primary text-sm tracking-tight">{c.violationId}</div>
                                {c.sourceViolationId && (
                                    <Badge variant="outline" className="mt-1 text-[9px] h-4 px-1.5 py-0 bg-blue-50 text-blue-700 border-blue-200 font-bold uppercase tracking-tighter">
                                        SOURCE: {c.sourceViolationId}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="max-w-[180px]">
                                <div className="truncate text-xs font-bold text-slate-700 uppercase tracking-tight" title={c.type}>
                                    {c.type}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm font-black text-slate-900">{c.outgoingNumber}</div>
                                <div className="text-xs text-slate-400 font-bold">{c.outgoingDate}</div>
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-slate-600">{c.recipientOrg}</TableCell>
                            <TableCell className="text-right font-black text-slate-900 text-lg tracking-tighter">
                                {c.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">uzs</span>
                            </TableCell>
                            <TableCell>{getStatusBadge(c.status)}</TableCell>
                            <TableCell className="font-mono text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded inline-block mt-2">
                                {c.caseNumber || "—"}
                            </TableCell>
                            <TableCell className="max-w-[150px]">
                                <div className="truncate text-sm font-medium text-slate-600 italic" title={c.decision || ""}>
                                    {c.decision || "—"}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex gap-2 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 hover:bg-white hover:shadow-md hover:text-primary"
                                        title="Просмотр"
                                        onClick={() => onView?.(c)}
                                    >
                                        <Icons.Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 hover:bg-white hover:shadow-md hover:text-slate-800"
                                        title="Файлы"
                                        onClick={() => onFileClick?.(c)}
                                    >
                                        <Icons.File className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
