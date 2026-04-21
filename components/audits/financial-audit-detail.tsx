"use client"

import { useFinancialAudit, useAuditViolations } from "@/lib/hooks/use-audits"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "@/lib/i18n/hooks"
import { PageSkeleton } from "@/components/loading-skeleton"
import Link from "next/link"

interface FinancialAuditDetailProps {
    id: number
}

export function FinancialAuditDetail({ id }: FinancialAuditDetailProps) {
    const { t } = useTranslation()
    const { data: audit, isLoading: auditLoading } = useFinancialAudit(id)
    const { data: allViolations = [], isLoading: violationsLoading } = useAuditViolations()

    const isLoading = auditLoading || violationsLoading

    if (isLoading) return <PageSkeleton />

    if (!audit) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Icons.AlertCircle className="w-12 h-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Аудит не найден</h2>
                <Button asChild>
                    <Link href="/audits/financial">Вернуться к списку</Link>
                </Button>
            </div>
        )
    }

    const auditViolations = allViolations.filter(v => v.auditId === id)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/audits/financial">
                            <Icons.ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{audit.unit}</h1>
                        <p className="text-muted-foreground">{audit.unitSubtitle}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Icons.Download className="mr-2 h-4 w-4" />
                        Экспорт
                    </Button>
                    <Button variant="outline">
                        <Icons.Printer className="mr-2 h-4 w-4" />
                        Печать
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Информация об аудите</CardTitle>
                        <CardDescription>Основные параметры проведенной проверки</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Орган контроля</p>
                            <p className="font-semibold">{audit.controlBody}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Тип проверки</p>
                            <Badge variant="secondary">{audit.inspectionType}</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Направление</p>
                            <p>{audit.inspectionDirection}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Дата</p>
                            <p className="flex items-center gap-2">
                                <Icons.Calendar className="h-4 w-4 text-muted-foreground" />
                                {audit.date}
                            </p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <p className="text-sm font-medium text-muted-foreground">Ответственный</p>
                            <div className="flex items-start gap-2">
                                <Icons.User className="h-4 w-4 mt-1 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{audit.cashier}</p>
                                    <p className="text-xs text-muted-foreground">{audit.cashierRole}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Статус и итоги</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Статус</span>
                            <Badge variant={audit.status === "Проверено" ? "default" : "secondary"}>
                                {audit.status}
                            </Badge>
                        </div>
                        <div className="pt-4 border-t space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm">Финансовые нарушения</span>
                                <span className="font-medium text-red-600">{audit.financialAmount?.toLocaleString()} cум</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Имущественные нарушения</span>
                                <span className="font-medium text-orange-600">{audit.propertyAmount?.toLocaleString()} cум</span>
                            </div>
                            <div className="flex justify-between font-bold pt-2 border-t text-lg">
                                <span>Всего</span>
                                <span>{((audit.financialAmount || 0) + (audit.propertyAmount || 0)).toLocaleString()} cум</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-medium">
                                <span className="text-sm">Возмещено</span>
                                <span>{audit.recoveredAmount?.toLocaleString()} cум</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Реестр нарушений</CardTitle>
                        <CardDescription>Список выявленных нарушений по данному аудиту</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                        {auditViolations.length} {t("common.units.count")}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Тип</TableHead>
                                <TableHead>Вид</TableHead>
                                <TableHead>Источник</TableHead>
                                <TableHead className="text-right">Сумма</TableHead>
                                <TableHead className="text-right">Возмещено</TableHead>
                                <TableHead>Ответственное лицо</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {auditViolations.length > 0 ? (
                                auditViolations.map((violation) => (
                                    <TableRow key={violation.id}>
                                        <TableCell>
                                            <Badge variant={violation.kind === "Финансовое" ? "default" : "secondary"}>
                                                {violation.kind}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{violation.type}</TableCell>
                                        <TableCell>{violation.source}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {violation.amount.toLocaleString()} cум
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-600">
                                            {violation.recovered.toLocaleString()} cум
                                        </TableCell>
                                        <TableCell className="text-xs max-w-[200px] truncate" title={violation.responsible}>
                                            {violation.responsible}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Нарушений не выявлено
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
