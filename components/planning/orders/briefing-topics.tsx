"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { StatsCardsGrid } from "@/components/ui/stats-card"
import { useTranslation } from "@/lib/i18n/hooks"
import type { BriefingTopic, BriefingFilters } from "@/lib/types/orders"
import { getBriefingStats, getAllBriefingTopics } from "@/lib/mock-data/orders"
import { ClassifierSelect } from "@/components/reference/classifier-select"

type LocalTopic = Omit<BriefingTopic, "id"> & { id: number | string }

export function BriefingTopicsRegistry() {
    const { t } = useTranslation()
    const router = useRouter()

    // исходные данные (мок)
    const initialTopics = useMemo(() => getAllBriefingTopics(), [])
    const stats = useMemo(() => getBriefingStats(), [])

    // локальное состояние тем (чтобы можно было добавлять без бэкенда)
    const [topics, setTopics] = useState<LocalTopic[]>(initialTopics.map((t, i) => ({ ...t, id: t.id ?? `local-${i}` })))

    // фильтры
    const [filters, setFilters] = useState<BriefingFilters>({ search: "", status: "", date: "" })

    // локальный controlled search + дебаунс
    const [searchInput, setSearchInput] = useState("")
    useEffect(() => {
        const id = window.setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput }))
        }, 300)
        return () => clearTimeout(id)
    }, [searchInput])

    // диалоги и выбранная тема
    const [addTopicOpen, setAddTopicOpen] = useState(false)
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState<LocalTopic | null>(null)

    // контролируемая форма добавления
    const [newTopic, setNewTopic] = useState<Partial<LocalTopic>>({
        topic: "",
        duration: "30",
        notes: "",
        completed: false,
    })

    // safer filter — ищем по topic и notes (case-insensitive)
    const filteredTopics = useMemo(() => {
        const search = String(filters.search ?? "").trim().toLowerCase()
        const status = String(filters.status ?? "")
        return topics.filter((topic) => {
            // search
            if (search) {
                const hay = `${topic.topic ?? ""} ${topic.notes ?? ""}`.toLowerCase()
                if (!hay.includes(search)) return false
            }
            // status
            if (status === "completed") return !!topic.completed
            if (status === "planned") return !topic.completed
            return true
        })
    }, [topics, filters.search, filters.status])

    // handlers
    const handleViewDetails = useCallback((topic: LocalTopic) => {
        setSelectedTopic(topic)
        setViewDetailsOpen(true)
    }, [])

    const handleResetFilters = useCallback(() => {
        setFilters({ search: "", status: "", date: "" })
        setSearchInput("")
    }, [])

    const handleOpenAdd = useCallback(() => {
        setNewTopic({ topic: "", duration: "30", notes: "", completed: false })
        setAddTopicOpen(true)
    }, [])

    const handleAddTopic = useCallback(() => {
        // basic validation
        if (!newTopic.topic || String(newTopic.topic).trim().length < 2) {
            // можно заменить на toast
            alert(t("orders.dialog.topicName") + " — " + (t("validation.required") ?? "обязательное поле"))
            return
        }
        const created: LocalTopic = {
            id: `local-${Date.now()}`,
            topic: String(newTopic.topic),
            duration: String(newTopic.duration ?? "30"),
            notes: String(newTopic.notes ?? ""),
            completed: !!newTopic.completed,
            plannedDate: newTopic.plannedDate,
            conductedDate: newTopic.conductedDate,
        }
        setTopics((prev) => [created, ...prev])
        setAddTopicOpen(false)
    }, [newTopic, t])

    // stats cards (unchanged, but derived from topics if you want dynamic stats)
    const statsCards = useMemo(
        () => [
            {
                title: t("orders.briefing.totalTopics"),
                value: stats.total,
                subtitle: t("orders.briefing.planned"),
                icon: Icons.FileText,
                colorScheme: "violet" as const,
            },
            {
                title: t("orders.briefing.conducted"),
                value: stats.completed,
                subtitle: t("orders.briefing.topics"),
                icon: Icons.Check,
                colorScheme: "teal" as const,
            },
            {
                title: t("orders.briefing.planned"),
                value: stats.planned,
                subtitle: t("orders.briefing.topics"),
                icon: Icons.Clock,
                colorScheme: "pink" as const,
            },
            {
                title: t("orders.briefing.totalDuration"),
                value: stats.totalMinutes,
                subtitle: t("orders.briefing.minutes"),
                icon: Icons.Timer,
                colorScheme: "lime" as const,
            },
            {
                title: "Ср. явка",
                value: "98%",
                subtitle: "Личного состава",
                icon: Icons.Users,
                colorScheme: "blue" as const,
            },
            {
                title: "Материалы",
                value: "24",
                subtitle: "Документов",
                icon: Icons.FileText,
                colorScheme: "emerald" as const,
            },
        ],
        [stats, t]
    )

    return (
        <div className="space-y-6">
            <StatsCardsGrid cards={statsCards} />

            <Card className="border-primary/20">
                <CardHeader>
                    <CardTitle>{t("orders.filters.title")}</CardTitle>
                    <CardDescription>{t("orders.briefing.filterDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="relative">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                            <Input
                                placeholder={t("orders.briefing.searchPlaceholder")}
                                className="pl-10"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                aria-label={String(t("orders.briefing.searchPlaceholder"))}
                            />
                        </div>

                        <Select value={filters.status} onValueChange={(value) => setFilters((p) => ({ ...p, status: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder={t("orders.filters.allStatuses")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">{t("orders.filters.allStatuses")}</SelectItem>
                                <SelectItem value="completed">{t("orders.briefing.statusCompleted")}</SelectItem>
                                <SelectItem value="planned">{t("orders.briefing.statusPlanned")}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            type="date"
                            placeholder={t("orders.briefing.conductionDate")}
                            value={filters.date}
                            onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))}
                            aria-label={String(t("orders.briefing.conductionDate"))}
                        />

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleResetFilters} type="button">
                                {t("orders.filters.reset")}
                            </Button>
                            <Button onClick={handleOpenAdd} type="button">
                                {t("orders.dialog.add")}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <CardTitle>{t("orders.briefing.tableTitle")}</CardTitle>
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("orders.briefing.topic")}</TableHead>
                                <TableHead>{t("orders.briefing.duration")}</TableHead>
                                <TableHead>{t("orders.table.status")}</TableHead>
                                <TableHead>{t("orders.briefing.notes")}</TableHead>
                                <TableHead>{t("orders.table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredTopics.map((topic) => (
                                <TableRow key={topic.id}>
                                    <TableCell className="font-medium">{topic.topic}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{topic.duration}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={topic.completed ? "default" : "secondary"}>
                                            {topic.completed ? t("orders.briefing.statusCompleted") : t("orders.briefing.statusPlanned")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{topic.notes}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(topic)} title={String(t("actions.view"))}>
                                                <Icons.Eye className="h-4 w-4" />
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" title={String(t("orders.createBasedOn"))}>
                                                        <Icons.Plus className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuItem onClick={() => {
                                                        const params = new URLSearchParams()
                                                        params.set("planId", String(topic.id))
                                                        params.set("object", topic.topic)
                                                        router.push(`/planning/orders/create?${params.toString()}`)
                                                    }}>
                                                        <Icons.FileText className="mr-2 h-4 w-4 text-blue-600" />
                                                        {t("orders.create.order")}
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() => {
                                                        const params = new URLSearchParams()
                                                        params.set("planId", String(topic.id))
                                                        params.set("object", topic.topic)
                                                        router.push(`/planning/orders/create-prescription?${params.toString()}`)
                                                    }}>
                                                        <Icons.Shield className="mr-2 h-4 w-4 text-amber-600" />
                                                        {t("orders.create.prescription")}
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() => {
                                                        const params = new URLSearchParams()
                                                        params.set("planId", String(topic.id))
                                                        router.push(`/planning/orders/create-briefing?${params.toString()}`)
                                                    }}>
                                                        <Icons.BookOpen className="mr-2 h-4 w-4 text-red-600" />
                                                        {t("orders.create.briefing")}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add topic dialog */}
            <Dialog open={addTopicOpen} onOpenChange={setAddTopicOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("orders.dialog.addTopic.title")}</DialogTitle>
                        <DialogDescription>{t("orders.dialog.addTopic.description")}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>{t("orders.briefing.topic")}</Label>
                            <ClassifierSelect
                                classifierId={26}
                                value={newTopic.topic ? Number(newTopic.topic) : undefined}
                                onValueChange={(val) => setNewTopic((p) => ({ ...p, topic: String(val) }))}
                                placeholder={t("orders.dialog.topicName")}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t("orders.dialog.durationMinutes")}</Label>
                            <Input
                                type="number"
                                value={String(newTopic.duration ?? "")}
                                onChange={(e) => setNewTopic((p) => ({ ...p, duration: e.target.value }))}
                                placeholder="30"
                                aria-label={String(t("orders.dialog.durationMinutes"))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t("orders.table.status")}</Label>
                            <Select value={newTopic.completed ? "completed" : "planned"} onValueChange={(val) => setNewTopic((p) => ({ ...p, completed: val === "completed" }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("orders.table.status")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="planned">{t("orders.briefing.statusPlanned")}</SelectItem>
                                    <SelectItem value="completed">{t("orders.briefing.statusCompleted")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>{t("orders.briefing.notes")}</Label>
                            <Input
                                placeholder={String(t("orders.dialog.additionalInfo"))}
                                value={String(newTopic.notes ?? "")}
                                onChange={(e) => setNewTopic((p) => ({ ...p, notes: e.target.value }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddTopicOpen(false)} type="button">
                            {t("orders.dialog.cancel")}
                        </Button>
                        <Button onClick={handleAddTopic} type="button">
                            {t("orders.dialog.add")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View details */}
            <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("orders.dialog.viewTopic.title") ?? "Детали темы"}</DialogTitle>
                        <DialogDescription>{t("orders.dialog.viewTopic.description") ?? "Информация о теме"}</DialogDescription>
                    </DialogHeader>

                    {selectedTopic && (
                        <div className="grid gap-4 py-4">
                            <div>
                                <p className="text-sm text-muted-foreground">{t("orders.briefing.topic")}</p>
                                <p className="font-medium text-lg">{selectedTopic.topic}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t("orders.dialog.durationMinutes")}</p>
                                    <Badge variant="outline" className="mt-1">{selectedTopic.duration}</Badge>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">{t("orders.table.status")}</p>
                                    <Badge variant={selectedTopic.completed ? "default" : "secondary"} className="mt-1">
                                        {selectedTopic.completed ? t("orders.briefing.statusCompleted") : t("orders.briefing.statusPlanned")}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">{t("orders.briefing.notes")}</p>
                                <p className="font-medium">{selectedTopic.notes}</p>
                            </div>

                            {selectedTopic.conductedDate && (
                                <div>
                                    <p className="text-sm text-muted-foreground">{t("orders.briefing.conductedDate")}</p>
                                    <p className="font-medium">{selectedTopic.conductedDate}</p>
                                </div>
                            )}

                            {selectedTopic.plannedDate && (
                                <div>
                                    <p className="text-sm text-muted-foreground">{t("orders.briefing.conductionDate")}</p>
                                    <p className="font-medium">{selectedTopic.plannedDate}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}