"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Eye, RotateCcw } from "lucide-react"

interface KPIEmployeeTableProps {
    employees: any[]
    isLoading: boolean
    searchQuery: string
    onEdit: (e: any) => void
    onDelete: (id: string) => void
    onView: (e: any) => void
    onReset: () => void
}

export function KPIEmployeeTable({
    employees,
    isLoading,
    searchQuery,
    onEdit,
    onDelete,
    onView,
    onReset
}: KPIEmployeeTableProps) {
    if (isLoading) return <div className="h-60 flex items-center justify-center">Загрузка...</div>

    if (employees.length === 0) return (
        <div className="h-60 flex flex-col items-center justify-center text-slate-400 gap-4">
            <p>Сотрудники не найдены</p>
            {searchQuery && (
                <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Сбросить поиск
                </Button>
            )}
        </div>
    )

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead className="font-bold">ФИО</TableHead>
                        <TableHead className="font-bold">Звание</TableHead>
                        <TableHead className="font-bold">Должность</TableHead>
                        <TableHead className="font-bold">Подразделение</TableHead>
                        <TableHead className="font-bold">Статус</TableHead>
                        <TableHead className="text-right font-bold">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((e) => (
                        <TableRow key={e.id}>
                            <TableCell className="font-medium text-blue-900">{e.fullName}</TableCell>
                            <TableCell>{e.rank}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{e.position}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{e.department}</TableCell>
                            <TableCell>
                                <Badge variant={e.status === 'active' ? 'default' : 'secondary'} className={e.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                    {e.status === 'active' ? 'Активен' : 'Неактивен'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => onView(e)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600" onClick={() => onEdit(e)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => onDelete(e.id)}>
                                        <Trash2 className="h-4 w-4" />
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
