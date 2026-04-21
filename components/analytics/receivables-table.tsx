"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface TransactionRecord {
    month: string;
    year: number;
    manager: string;
    buyer: string;
    city: string;
    sales: number;
    totalDebt: number;
    noOverdue: number;
    days1to30: number;
    days31to60: number;
    days61to90: number;
    days91plus: number;
}

export function ReceivablesTable({ data }: { data: TransactionRecord[] }) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(val);

    return (
        <Card className="col-span-full mt-4">
            <CardHeader>
                <CardTitle>Детальный отчет по дебиторам</CardTitle>
                <CardDescription>Полный список транзакций и задолженностей ({data.length} записей)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Менеджер</TableHead>
                                <TableHead>Покупатель</TableHead>
                                <TableHead>Город</TableHead>
                                <TableHead className="text-right">Продажи</TableHead>
                                <TableHead className="text-right">Долг Всего</TableHead>
                                <TableHead className="text-right">Без просрочки</TableHead>
                                <TableHead className="text-right text-red-500">До 30 дн.</TableHead>
                                <TableHead className="text-right text-red-600">31-60 дн.</TableHead>
                                <TableHead className="text-right text-red-700">61-90 дн.</TableHead>
                                <TableHead className="text-right text-red-800">91+ дн.</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{row.manager}</TableCell>
                                    <TableCell>{row.buyer}</TableCell>
                                    <TableCell>{row.city}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.sales)}</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(row.totalDebt)}</TableCell>
                                    <TableCell className="text-right text-green-600">{formatCurrency(row.noOverdue)}</TableCell>
                                    <TableCell className="text-right">{row.days1to30 > 0 ? formatCurrency(row.days1to30) : '-'}</TableCell>
                                    <TableCell className="text-right">{row.days31to60 > 0 ? formatCurrency(row.days31to60) : '-'}</TableCell>
                                    <TableCell className="text-right">{row.days61to90 > 0 ? formatCurrency(row.days61to90) : '-'}</TableCell>
                                    <TableCell className="text-right">{row.days91plus > 0 ? formatCurrency(row.days91plus) : '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Предыдущая
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Страница {page} из {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Следующая
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
