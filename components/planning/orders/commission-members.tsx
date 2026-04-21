"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { StatsCardsGrid } from "@/components/ui/stats-card"
import { useTranslation } from "@/lib/i18n/hooks"
import type { CommissionMember, CommissionFilters, CommissionRole } from "@/lib/types/orders"
import { getCommissionStats, getAllCommissionMembers, getAllOrders } from "@/lib/mock-data/orders"
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

export function CommissionMembersRegistry() {
    const { t } = useTranslation()
    const commissionMembers = getAllCommissionMembers()
    const orders = getAllOrders()
    const stats = getCommissionStats()

    const [filters, setFilters] = useState<CommissionFilters>({
        search: "",
        role: "",
        orderNum: "",
    })
    const [addMemberOpen, setAddMemberOpen] = useState(false)
    const [viewMemberOpen, setViewMemberOpen] = useState(false)
    const [editMemberOpen, setEditMemberOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<CommissionMember | null>(null)
    const [newMember, setNewMember] = useState<Partial<CommissionMember>>({
        name: "",
        role: "Ревизор",
        rank: "",
        position: "",
        unit: "",
        orderNum: "",
    })

    const filteredMembers = useMemo(() => {
        return commissionMembers.filter((member) => {
            const searchLower = filters.search.toLowerCase()
            const matchesSearch = member.name.toLowerCase().includes(searchLower)

            const matchesRole =
                !filters.role ||
                (filters.role === "chairman" && member.role === "Главный ревизор") ||
                (filters.role === "member" && member.role === "Ревизор")

            const matchesOrderNum =
                !filters.orderNum || member.orderNum.toLowerCase().includes(filters.orderNum.toLowerCase())

            return matchesSearch && matchesRole && matchesOrderNum
        })
    }, [commissionMembers, filters])

    const handleViewMember = (member: CommissionMember) => {
        setSelectedMember(member)
        setViewMemberOpen(true)
    }

    const handleEditMember = (member: CommissionMember) => {
        setSelectedMember(member)
        setEditMemberOpen(true)
    }

    const handleResetFilters = () => {
        setFilters({ search: "", role: "", orderNum: "" })
    }

    const statsCards = [
        {
            title: t("orders.commission.totalMembers"),
            value: stats.total,
            subtitle: t("orders.commission.inCommissions"),
            icon: Icons.Users,
            colorScheme: "emerald" as const,
        },
        {
            title: t("orders.commission.chairmen"),
            value: stats.chairmen,
            subtitle: t("orders.commission.appointed"),
            icon: Icons.Star,
            colorScheme: "indigo" as const,
        },
        {
            title: t("orders.commission.members"),
            value: stats.members,
            subtitle: t("orders.commission.appointed"),
            icon: Icons.User,
            colorScheme: "rose" as const,
        },
        {
            title: t("orders.commission.activeCommissions"),
            value: stats.activeCommissions,
            subtitle: t("orders.commission.byOrder") + " №15",
            icon: Icons.FileText,
            colorScheme: "amber" as const,
        },
        {
            title: "Ср. состав",
            value: "4.5",
            subtitle: "Чел. в комиссии",
            icon: Icons.Users,
            colorScheme: "lime" as const,
        },
        {
            title: "Резерв",
            value: "12",
            subtitle: "Сотрудников",
            icon: Icons.User,
            colorScheme: "cyan" as const,
        },
    ]

    return (
        <div className="space-y-6">
            {/* Заголовок */}


            {/* Статистика */}
            <StatsCardsGrid cards={statsCards} />

            {/* Фильтры */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("orders.filters.title")}</CardTitle>
                    <CardDescription>{t("orders.commission.filterDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Input
                            placeholder={t("orders.commission.searchPlaceholder")}
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                        <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder={t("orders.commission.allRoles")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("orders.commission.allRoles")}</SelectItem>
                                <SelectItem value="chairman">{t("orders.commission.chairman")}</SelectItem>
                                <SelectItem value="member">{t("orders.commission.member")}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder={t("orders.commission.orderNumber")}
                            value={filters.orderNum}
                            onChange={(e) => setFilters({ ...filters, orderNum: e.target.value })}
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
                        <CardTitle>{t("orders.commission.tableTitle")}</CardTitle>
                        <Button onClick={() => setAddMemberOpen(true)}>
                            <Icons.Plus className="mr-2 h-4 w-4" />
                            {t("orders.section2.addMember")}
                        </Button>
                    </div>

                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("orders.table.id")}</TableHead>
                                <TableHead>{t("orders.commission.order")}</TableHead>
                                <TableHead>{t("orders.commission.role")}</TableHead>
                                <TableHead>{t("orders.commission.fullName")}</TableHead>
                                <TableHead>{t("orders.commission.rank")}</TableHead>
                                <TableHead>{t("orders.commission.position")}</TableHead>
                                <TableHead>{t("orders.table.unit")}</TableHead>
                                <TableHead>{t("orders.table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">{member.id}</TableCell>
                                    <TableCell>{member.orderNum}</TableCell>
                                    <TableCell>
                                        <Badge variant={member.role === "Главный ревизор" ? "default" : "outline"}>
                                            {member.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{getPersonnelName(member.name)}</TableCell>
                                    <TableCell>{member.rank}</TableCell>
                                    <TableCell>{member.position}</TableCell>
                                    <TableCell>{getUnitName(member.unit)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewMember(member)} title="Просмотр">
                                                <Icons.Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEditMember(member)} title="Редактировать">
                                                <Icons.Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Диалог добавления */}
            <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("orders.dialog.addMember.title")}</DialogTitle>
                        <DialogDescription>{t("orders.dialog.addMember.description")}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>{t("orders.commission.order")}</Label>
                            <Select value={newMember.orderNum} onValueChange={(val) => setNewMember({ ...newMember, orderNum: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("orders.dialog.selectOrder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {orders.map((order) => (
                                        <SelectItem key={order.id} value={order.orderNum}>
                                            {order.orderNum} — {order.unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                {t("orders.commissionMembers.role")}
                            </Label>
                            <div className="col-span-3">
                                <ClassifierSelect
                                    classifierId={24}
                                    value={newMember.role}
                                    onValueChange={(val) => setNewMember({ ...newMember, role: val as CommissionRole })}
                                    placeholder="Выберите роль"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                {t("orders.commissionMembers.name")}
                            </Label>
                            <div className="col-span-3">
                                <PersonnelSelect
                                    value={newMember.name}
                                    onValueChange={(val) => setNewMember({ ...newMember, name: val })}
                                    placeholder="Выберите сотрудника"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rank" className="text-right">
                                {t("orders.commissionMembers.rank")}
                            </Label>
                            <div className="col-span-3">
                                <ClassifierSelect
                                    classifierId={6}
                                    value={newMember.rank}
                                    onValueChange={(val) => setNewMember({ ...newMember, rank: val })}
                                    placeholder="Выберите звание"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="position" className="text-right">
                                {t("orders.commissionMembers.position")}
                            </Label>
                            <div className="col-span-3">
                                <ClassifierSelect
                                    classifierId={13}
                                    value={newMember.position}
                                    onValueChange={(val) => setNewMember({ ...newMember, position: val })}
                                    placeholder="Выберите должность"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="unit" className="text-right">
                                {t("orders.commissionMembers.unit")}
                            </Label>
                            <div className="col-span-3">
                                <UnitSelect
                                    value={newMember.unit}
                                    onValueChange={(val) => setNewMember({ ...newMember, unit: val })}
                                    placeholder="Выберите часть"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
                            {t("orders.dialog.cancel")}
                        </Button>
                        <Button onClick={() => setAddMemberOpen(false)}>{t("orders.dialog.add")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Диалог просмотра */}
            <Dialog open={viewMemberOpen} onOpenChange={setViewMemberOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Информация о ревизоре</DialogTitle>
                        <DialogDescription>Детальные данные</DialogDescription>
                    </DialogHeader>
                    {selectedMember && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">ФИО</p>
                                    <p className="font-medium">{getPersonnelName(selectedMember.name)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Роль</p>
                                    <Badge variant={selectedMember.role === "Главный ревизор" ? "default" : "outline"}>
                                        {selectedMember.role}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Звание</p>
                                    <p className="font-medium">{selectedMember.rank}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Должность</p>
                                    <p className="font-medium">{selectedMember.position}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Приказ</p>
                                    <p className="font-medium">{selectedMember.orderNum}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">В/Ч</p>
                                    <p className="font-medium">{getUnitName(selectedMember.unit)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Диалог редактирования */}
            <Dialog open={editMemberOpen} onOpenChange={setEditMemberOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редактирование данных ревизора</DialogTitle>
                        <DialogDescription>Внесите изменения</DialogDescription>
                    </DialogHeader>
                    {selectedMember && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>ФИО</Label>
                                <Input defaultValue={selectedMember.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Роль</Label>
                                <Select defaultValue={selectedMember.role === "Главный ревизор" ? "chairman" : "member"}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="chairman">Главный ревизор</SelectItem>
                                        <SelectItem value="member">Ревизор</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Должность</Label>
                                <Input defaultValue={selectedMember.position} />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditMemberOpen(false)}>
                            Отмена
                        </Button>
                        <Button onClick={() => setEditMemberOpen(false)}>Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
