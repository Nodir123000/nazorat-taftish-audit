"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { MilitaryUnit } from "@/lib/types/military-unit"

interface MilitaryUnitsTableProps {
    data: MilitaryUnit[]
}

export function MilitaryUnitsTable({ data }: MilitaryUnitsTableProps) {
    const router = useRouter()

    const handleViewDetails = (unit: MilitaryUnit) => {
        router.push(`/units/view/${unit.id}`)
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[50px] font-bold">ID</TableHead>
                        <TableHead className="w-[50px] font-bold">Штат ID</TableHead>
                        <TableHead className="font-bold">Наименование</TableHead>
                        <TableHead className="font-bold">Локация</TableHead>
                        <TableHead className="font-bold">Округ</TableHead>
                        <TableHead className="font-bold">Командир</TableHead>
                        <TableHead className="text-center font-bold">Ревизий</TableHead>
                        <TableHead className="text-center font-bold">KPI</TableHead>
                        <TableHead className="font-bold">Посл. проверка</TableHead>
                        <TableHead className="text-center font-bold">Статус</TableHead>
                        <TableHead className="text-right font-bold w-[50px]">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((unit) => (
                        <TableRow key={unit.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-mono text-xs text-muted-foreground">
                                {unit.id}
                            </TableCell>

                            <TableCell className="font-mono text-xs font-bold">
                                {unit.unitNumber}
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                                        <Icons.Home className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-foreground">В/Ч {unit.unitNumber}</div>
                                        <div className="text-xs text-muted-foreground">{unit.name}</div>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        {unit.city}
                                    </div>
                                    <div className="text-xs text-muted-foreground pl-3">{unit.region}</div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <Badge variant="outline" className="font-normal text-xs bg-slate-50 text-slate-600 border-slate-200 gap-1.5 py-1">
                                    <Icons.Shield className="h-3 w-3" />
                                    {unit.militaryDistrict.toLowerCase()}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div className="text-sm font-medium">{unit.commander}</div>
                            </TableCell>

                            <TableCell className="text-center">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                    {unit.auditsCount}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-center">
                                <div className="font-bold text-sm text-emerald-600">{unit.kpiScore}%</div>
                            </TableCell>

                            <TableCell>
                                <div className="text-xs text-muted-foreground">
                                    {unit.lastAuditDate ? unit.lastAuditDate : "-"}
                                </div>
                            </TableCell>

                            <TableCell className="text-center">
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-2 py-0.5 text-[10px] uppercase">
                                    АКТИВНА
                                </Badge>
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleViewDetails(unit)}
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                        <Icons.Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    >
                                        <Icons.Edit className="h-4 w-4" />
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
