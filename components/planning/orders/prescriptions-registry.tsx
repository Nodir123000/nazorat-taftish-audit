"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { StatsCardsGrid } from "@/components/ui/stats-card"
import { useTranslation } from "@/lib/i18n/hooks"
import type { Prescription, PrescriptionsFilters } from "@/lib/types/orders"
import { getPrescriptionsStats, getAllPrescriptions } from "@/lib/mock-data/orders"
import { ClassifierSelect } from "@/components/reference/classifier-select"
import { UnitSelect } from "@/components/reference/unit-select"
import { PersonnelSelect } from "@/components/reference/personnel-select"
import { militaryUnits } from "@/lib/data/military-data"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons } from "@/components/reference/physical-persons-data"

const getUnitName = (id: string) => {
    const unit = militaryUnits.find(u => u.id.toString() === id);
    return unit ? unit.name : id;
};

const getPersonnelName = (id: string) => {
    const mp = militaryPersonnel.find(p => p.id.toString() === id);
    if (!mp) return id;
    const person = physicalPersons.find(p => p.id === mp.personId);
    return person ? `${person.lastName} ${person.firstName.charAt(0)}.${person.middleName ? person.middleName.charAt(0) + '.' : ''}` : id;
};

export function PrescriptionsRegistry() {
    const { t } = useTranslation()
    const router = useRouter()
    const prescriptions = getAllPrescriptions()
    const stats = getPrescriptionsStats()

    const [filters, setFilters] = useState<PrescriptionsFilters>({
        search: "",
        status: "",
        dateFrom: "",
    })
    const [viewOpen, setViewOpen] = useState(false)
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)

    const filteredPrescriptions = useMemo(() => {
        return prescriptions.filter((prescription) => {
            const searchLower = filters.search.toLowerCase()
            const matchesSearch =
                prescription.prescriptionNum.toLowerCase().includes(searchLower) ||
                prescription.organization.toLowerCase().includes(searchLower)

            const matchesStatus = !filters.status || prescription.status === filters.status

            const matchesDate = !filters.dateFrom || prescription.date >= filters.dateFrom

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [prescriptions, filters])

    const handleViewPrescription = (prescription: Prescription) => {
        setSelectedPrescription(prescription)
        setViewOpen(true)
    }

    const handleDownloadPrescription = (prescription: Prescription) => {
        const leaderName = getPersonnelName(prescription.leader)
        const deputyName = getPersonnelName(prescription.deputy)
        const organizationName = getUnitName(prescription.organization)
        const content = `Предписание ${prescription.prescriptionNum}\nДата: ${prescription.date}\nРуководитель: ${leaderName}\nЗаместитель: ${deputyName}\nОрганизация: ${organizationName}\nПериод: ${prescription.period}\nСтатус: ${prescription.status}`
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Предписание_${prescription.prescriptionNum.replace("№ ", "")}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handleResetFilters = () => {
        setFilters({ search: "", status: "", dateFrom: "" })
    }

    const statsCards = [
        {
            title: t("orders.prescriptions.total"),
            value: stats.total,
            subtitle: t("orders.stats.forYear"),
            icon: Icons.FileText,
            colorScheme: "indigo" as const,
        },
        {
            title: t("orders.stats.active"),
            value: stats.active,
            subtitle: t("orders.prescriptions.prescriptions"),
            icon: Icons.Check,
            colorScheme: "cyan" as const,
        },
        {
            title: t("orders.stats.completed"),
            value: stats.completed,
            subtitle: t("orders.prescriptions.prescriptions"),
            icon: Icons.Archive,
            colorScheme: "teal" as const,
        },
        {
            title: t("orders.prescriptions.lastOne"),
            value: stats.lastPrescription,
            subtitle: t("orders.prescriptions.number"),
            icon: Icons.Calendar,
            colorScheme: "violet" as const,
        },
        {
            title: "Просрочено",
            value: "0",
            subtitle: "Нарушение сроков",
            icon: Icons.Clock,
            colorScheme: "red" as const,
        },
        {
            title: "Важные",
            value: "5",
            subtitle: "Особый контроль",
            icon: Icons.Star,
            colorScheme: "orange" as const,
        },
    ]

    return (
        <div className="space-y-6">
            {/* Статистика */}
            <StatsCardsGrid cards={statsCards} />

            {/* Фильтры */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("orders.filters.title")}</CardTitle>
                    <CardDescription>{t("orders.prescriptions.filterDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <ClassifierSelect
                            classifierId={25}
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                            placeholder={t("orders.filters.allStatuses")}
                        />
                        <UnitSelect
                            value={filters.search}
                            onValueChange={(value) => setFilters({ ...filters, search: value })}
                            placeholder="Поиск по организации"
                        />
                        <Input
                            type="date"
                            placeholder={t("orders.filters.dateFrom")}
                            value={filters.dateFrom}
                            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        />
                        <Button variant="outline" onClick={handleResetFilters}>
                            {t("orders.filters.reset")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Таблица */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{t("orders.prescriptions.tableTitle")}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("orders.table.id")}</TableHead>
                                <TableHead>{t("orders.prescriptions.prescriptionNumber")}</TableHead>
                                <TableHead>{t("orders.table.date")}</TableHead>
                                <TableHead>{t("orders.prescriptions.leader")}</TableHead>
                                <TableHead>{t("orders.prescriptions.organization")}</TableHead>
                                <TableHead>{t("orders.table.period")}</TableHead>
                                <TableHead>{t("orders.table.status")}</TableHead>
                                <TableHead>{t("orders.table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPrescriptions.map((prescription) => (
                                <TableRow key={prescription.id}>
                                    <TableCell className="font-medium">{prescription.id}</TableCell>
                                    <TableCell>{prescription.prescriptionNum}</TableCell>
                                    <TableCell>{prescription.date}</TableCell>
                                    <TableCell>{getPersonnelName(prescription.leader)}</TableCell>
                                    <TableCell>{getUnitName(prescription.organization)}</TableCell>
                                    <TableCell>{prescription.period}</TableCell>
                                    <TableCell>
                                        <Badge variant={prescription.status === "Действует" ? "default" : "secondary"}>
                                            {prescription.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewPrescription(prescription)}
                                                title="Просмотр"
                                            >
                                                <Icons.Eye className="h-4 w-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" title="Создать на основании">
                                                        <Icons.Plus className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuItem onClick={() => {
                                                        const params = new URLSearchParams()
                                                        params.set("planId", prescription.id.toString())
                                                        params.set("object", getUnitName(prescription.organization))
                                                        router.push(`/planning/orders/create?${params.toString()}`)
                                                    }}>
                                                        <Icons.FileText className="mr-2 h-4 w-4 text-blue-600" />
                                                        Приказ
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        const params = new URLSearchParams()
                                                        params.set("planId", prescription.id.toString())
                                                        params.set("object", getUnitName(prescription.organization))
                                                        router.push(`/planning/orders/create-prescription?${params.toString()}`)
                                                    }}>
                                                        <Icons.Shield className="mr-2 h-4 w-4 text-amber-600" />
                                                        Предписание
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        const params = new URLSearchParams()
                                                        params.set("planId", prescription.id.toString())
                                                        router.push(`/planning/orders/create-briefing?${params.toString()}`)
                                                    }}>
                                                        <Icons.BookOpen className="mr-2 h-4 w-4 text-red-600" />
                                                        Инструктаж
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownloadPrescription(prescription)}
                                                title="Скачать"
                                            >
                                                <Icons.Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Диалог просмотра */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Предписание {selectedPrescription?.prescriptionNum}</DialogTitle>
                        <DialogDescription>Детальная информация о предписании</DialogDescription>
                    </DialogHeader>
                    {selectedPrescription && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Дата</p>
                                    <p className="font-medium">{selectedPrescription.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Статус</p>
                                    <Badge variant={selectedPrescription.status === "Действует" ? "default" : "secondary"}>
                                        {selectedPrescription.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Руководитель</p>
                                    <p className="font-medium">{getPersonnelName(selectedPrescription.leader)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Заместитель</p>
                                    <p className="font-medium">{getPersonnelName(selectedPrescription.deputy)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">Организация</p>
                                    <p className="font-medium">{getUnitName(selectedPrescription.organization)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">Период проведения</p>
                                    <p className="font-medium">{selectedPrescription.period}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
