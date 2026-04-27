"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { cn } from "@/lib/utils"
import { useCommissionValidation } from "@/lib/hooks/use-commission-validation"

const getUnitName = (id: string) => {
    const unit = militaryUnits.find(u => u.id.toString() === id)
    return unit ? unit.name : id
}

const getPersonnelName = (id: string) => {
    const mp = militaryPersonnel.find(p => p.id.toString() === id)
    if (!mp) return id
    const person = physicalPersons.find(p => p.id === mp.personId)
    return person ? `${person.lastName} ${person.firstName.charAt(0)}.${person.middleName ? person.middleName.charAt(0) + "." : ""}` : id
}

function getRoleBadge(role: string) {
    const r = role.toLowerCase()
    if (r.includes("председатель")) {
        return <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-[9px] font-black uppercase tracking-widest rounded-sm px-2">ПРЕДСЕДАТЕЛЬ</Badge>
    }
    if (r.includes("специалист")) {
        return <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-black uppercase tracking-widest rounded-sm px-2">СПЕЦИАЛИСТ</Badge>
    }
    return <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest rounded-sm px-2">ЧЛЕН КОМИССИИ</Badge>
}

// Conflict Alert Banner
function ConflictBanner({ message, isWarning }: { message: string; isWarning: boolean }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                    "rounded-xl border-l-4 p-4 text-sm font-medium",
                    isWarning
                        ? "bg-amber-50 border-amber-500 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
                        : "bg-red-50 border-red-600 text-red-800 dark:bg-red-950/30 dark:text-red-300"
                )}
            >
                <div className="flex items-start gap-3">
                    {isWarning
                        ? <Icons.AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        : <Icons.AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    }
                    <span>{message}</span>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export function CommissionMembersRegistry() {
    const { t } = useTranslation()
    const commissionMembers = getAllCommissionMembers()
    const orders = getAllOrders()
    const stats = getCommissionStats()
    const { validate, reset: resetValidation, isChecking, result: validationResult } = useCommissionValidation()

    const [filters, setFilters] = useState<CommissionFilters>({ search: "", role: "", orderNum: "" })
    const [addMemberOpen, setAddMemberOpen] = useState(false)
    const [viewMemberOpen, setViewMemberOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<CommissionMember | null>(null)
    const [newMember, setNewMember] = useState<Partial<CommissionMember>>({
        name: "", role: "Член комиссии", rank: "", position: "", unit: "", orderNum: "",
    })

    // When role or name changes, re-run validation
    useEffect(() => {
        resetValidation()
        if (newMember.name && newMember.role) {
            // Get selected order period for validation
            const order = orders.find(o => o.orderNum === newMember.orderNum)
            if (order?.period) {
                const parts = order.period.split(" - ")
                if (parts.length === 2) {
                    validate(Number(newMember.name), newMember.role, parts[0], parts[1])
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMember.name, newMember.role, newMember.orderNum])

    const filteredMembers = useMemo(() => {
        return commissionMembers.filter((member) => {
            const searchLower = filters.search.toLowerCase()
            const matchesSearch = member.name.toLowerCase().includes(searchLower)
            const matchesRole = !filters.role || filters.role === "all" ||
                (filters.role === "chairman" && member.role === "Председатель комиссии") ||
                (filters.role === "member" && member.role !== "Председатель комиссии")
            const matchesOrderNum = !filters.orderNum || member.orderNum.toLowerCase().includes(filters.orderNum.toLowerCase())
            return matchesSearch && matchesRole && matchesOrderNum
        })
    }, [commissionMembers, filters])

    const statsCards = [
        { title: t("orders.commission.totalMembers"), value: stats.total, subtitle: t("orders.commission.inCommissions"), icon: Icons.Users, colorScheme: "emerald" as const },
        { title: t("orders.commission.chairmen"), value: stats.chairmen, subtitle: t("orders.commission.appointed"), icon: Icons.Star, colorScheme: "indigo" as const },
        { title: t("orders.commission.members"), value: stats.members, subtitle: t("orders.commission.appointed"), icon: Icons.User, colorScheme: "rose" as const },
        { title: t("orders.commission.activeCommissions"), value: stats.activeCommissions, subtitle: "Активных", icon: Icons.FileText, colorScheme: "amber" as const },
    ]

    const canAdd = !isChecking && (validationResult === null || validationResult.isValid || validationResult.isWarning)

    return (
        <div className="space-y-6">
            <StatsCardsGrid cards={statsCards} />

            {/* Filters */}
            <Card className="border border-border/60 shadow-sm">
                <CardContent className="pt-5 pb-4">
                    <div className="grid gap-3 md:grid-cols-4">
                        <Input
                            placeholder={t("orders.commission.searchPlaceholder")}
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="h-10"
                        />
                        <Select value={filters.role} onValueChange={(v) => setFilters({ ...filters, role: v })}>
                            <SelectTrigger className="h-10"><SelectValue placeholder="Все роли" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все роли</SelectItem>
                                <SelectItem value="chairman">Председатель</SelectItem>
                                <SelectItem value="member">Член / Специалист</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Номер приказа"
                            value={filters.orderNum}
                            onChange={(e) => setFilters({ ...filters, orderNum: e.target.value })}
                            className="h-10"
                        />
                        <Button variant="outline" className="h-10" onClick={() => setFilters({ search: "", role: "", orderNum: "" })}>
                            <Icons.X className="h-4 w-4 mr-2" /> Сбросить
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table Card */}
            <Card className="border border-border/60 shadow-sm overflow-hidden">
                <CardHeader className="px-6 py-4 border-b border-border/40 flex flex-row items-center justify-between">
                    <div>
                        <h2 className="text-base font-black tracking-tight uppercase">{t("orders.commission.tableTitle")}</h2>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{filteredMembers.length} записей</p>
                    </div>
                    <Button
                        className="h-9 px-4 text-sm font-bold shadow-sm"
                        onClick={() => { resetValidation(); setNewMember({ name: "", role: "Член комиссии", rank: "", position: "", unit: "", orderNum: "" }); setAddMemberOpen(true) }}
                    >
                        <Icons.Plus className="mr-2 h-4 w-4" />
                        {t("orders.section2.addMember")}
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-b-2 border-border/40">
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3 pl-6">ФИО</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3">Роль</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3">Звание / Должность</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3">Приказ</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3">Воинская часть</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3 text-right pr-6">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-20 text-center">
                                        <Icons.Inbox className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Нет данных</p>
                                    </TableCell>
                                </TableRow>
                            ) : filteredMembers.map((member) => (
                                <TableRow key={member.id} className="group hover:bg-primary/5 border-b border-border/30 last:border-0">
                                    <TableCell className="py-3 pl-6 font-semibold text-sm">{getPersonnelName(member.name)}</TableCell>
                                    <TableCell className="py-3">{getRoleBadge(member.role)}</TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">{member.rank}</span>
                                            <span className="text-[10px] text-muted-foreground">{member.position}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <code className="text-xs font-black text-primary bg-primary/5 px-1.5 py-0.5 rounded">{member.orderNum}</code>
                                    </TableCell>
                                    <TableCell className="py-3 text-sm">{getUnitName(member.unit)}</TableCell>
                                    <TableCell className="py-3 text-right pr-6">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" onClick={() => { setSelectedMember(member); setViewMemberOpen(true) }}>
                                                <Icons.Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Member Dialog */}
            <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <DialogContent className="max-w-lg rounded-2xl border-none shadow-2xl bg-card">
                    {/* Header */}
                    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-800 to-slate-900 px-6 pt-6 pb-5 -mx-6 -mt-6">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #6366f1 0%, transparent 60%)" }} />
                        <DialogHeader>
                            <DialogTitle className="text-white text-lg font-black tracking-tight flex items-center gap-2">
                                <Icons.UserPlus className="h-5 w-5 text-indigo-300" />
                                Назначить в комиссию
                            </DialogTitle>
                            <p className="text-slate-400 text-xs mt-1">Выберите сотрудника КРУ и укажите его роль в контрольной группе</p>
                        </DialogHeader>
                    </div>

                    <div className="space-y-4 py-2">
                        {/* Conflict/Warning Banner */}
                        {validationResult?.message && (
                            <ConflictBanner message={validationResult.message} isWarning={validationResult.isWarning} />
                        )}
                        {isChecking && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Icons.Loader2 className="h-3 w-3 animate-spin" /> Проверка занятости...
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Приказ</Label>
                            <Select value={newMember.orderNum} onValueChange={(v) => setNewMember({ ...newMember, orderNum: v })}>
                                <SelectTrigger className="h-10"><SelectValue placeholder="Выберите приказ" /></SelectTrigger>
                                <SelectContent>
                                    {orders.map((o) => (
                                        <SelectItem key={o.id} value={o.orderNum}>{o.orderNum} — {o.period}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Роль в комиссии</Label>
                            <ClassifierSelect
                                classifierId={24}
                                value={newMember.role}
                                onValueChange={(v) => setNewMember({ ...newMember, role: v as CommissionRole })}
                                placeholder="Выберите роль"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Сотрудник</Label>
                            <PersonnelSelect
                                value={newMember.name}
                                onValueChange={(v) => setNewMember({ ...newMember, name: v })}
                                placeholder="Выберите сотрудника КРУ"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Звание</Label>
                                <ClassifierSelect classifierId={6} value={newMember.rank} onValueChange={(v) => setNewMember({ ...newMember, rank: v })} placeholder="Звание" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Должность</Label>
                                <ClassifierSelect classifierId={13} value={newMember.position} onValueChange={(v) => setNewMember({ ...newMember, position: v })} placeholder="Должность" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={() => setAddMemberOpen(false)}>Отмена</Button>
                        <Button
                            disabled={!canAdd || !newMember.name || !newMember.role}
                            onClick={() => setAddMemberOpen(false)}
                            className="font-bold"
                        >
                            {validationResult && !validationResult.isValid
                                ? <><Icons.AlertCircle className="h-4 w-4 mr-2 text-red-400" /> Конфликт занятости</>
                                : <><Icons.Check className="h-4 w-4 mr-2" /> Назначить</>
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Member Dialog */}
            <Dialog open={viewMemberOpen} onOpenChange={setViewMemberOpen}>
                <DialogContent className="max-w-md rounded-2xl border-none shadow-2xl bg-card">
                    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-800 to-slate-900 px-6 pt-6 pb-5 -mx-6 -mt-6">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #6366f1 0%, transparent 60%)" }} />
                        <DialogHeader>
                            <DialogTitle className="text-white text-lg font-black tracking-tight flex items-center gap-2">
                                <Icons.User className="h-5 w-5 text-indigo-300" />
                                Карточка ревизора
                            </DialogTitle>
                        </DialogHeader>
                    </div>
                    {selectedMember && (
                        <div className="space-y-3 py-2">
                            {[
                                { label: "ФИО", value: getPersonnelName(selectedMember.name) },
                                { label: "Роль", value: getRoleBadge(selectedMember.role) },
                                { label: "Звание", value: selectedMember.rank },
                                { label: "Должность", value: selectedMember.position },
                                { label: "Приказ", value: <code className="text-xs font-black text-primary bg-primary/5 px-1.5 py-0.5 rounded">{selectedMember.orderNum}</code> },
                                { label: "Воинская часть", value: getUnitName(selectedMember.unit) },
                            ].map((row) => (
                                <div key={row.label} className="grid grid-cols-2 gap-4 py-1.5 border-b border-border/30 last:border-0">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{row.label}</span>
                                    <span className="text-sm text-foreground font-medium">{row.value || "—"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewMemberOpen(false)}>Закрыть</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
