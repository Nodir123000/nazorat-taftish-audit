"use client"

import { useState } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function getRoleBadge(role: string) {
    const r = (role || "").toLowerCase()
    if (r === "admin") return <Badge className="bg-red-600/15 text-red-700 border-red-600/30 text-[9px] font-black uppercase tracking-widest">НАЧАЛЬНИК</Badge>
    if (r === "chief_inspector") return <Badge className="bg-purple-600/15 text-purple-700 border-purple-600/30 text-[9px] font-black uppercase tracking-widest">ГЛ. ИНСПЕКТОР</Badge>
    return <Badge className="bg-blue-600/15 text-blue-700 border-blue-600/30 text-[9px] font-black uppercase tracking-widest">ИНСПЕКТОР</Badge>
}

export function KruStaffRegistry() {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const { data, isLoading } = useSWR("/api/planning/kru-staff", fetcher)
    const users: any[] = data?.users || []

    const filtered = users.filter((u) => {
        const q = search.toLowerCase()
        return (
            u.fullname?.toLowerCase().includes(q) ||
            u.rank?.toLowerCase().includes(q) ||
            u.position?.toLowerCase().includes(q)
        )
    })

    return (
        <Card className="border border-border/60 shadow-sm overflow-hidden">
            {/* Header */}
            <CardHeader className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-8 py-6 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, #3b82f6 0%, transparent 60%)" }} />
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">РЕЕСТР СОТРУДНИКОВ</p>
                        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <Icons.ShieldCheck className="h-5 w-5 text-blue-400" />
                            Личный состав КРУ
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">
                            Контрольно-Ревизионное Управление МО РУз — {users.length} сотрудников
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs font-bold px-3 py-1">
                            {users.length} ревизоров
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            {/* Search */}
            <div className="px-6 py-4 border-b border-border/40 bg-muted/10">
                <div className="relative max-w-sm">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Поиск по ФИО, званию, должности..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10"
                    />
                </div>
            </div>

            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Icons.Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <Icons.Inbox className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Сотрудники не найдены</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-b-2 border-border/40">
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3 pl-6">ФИО</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3">Звание</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3">Должность</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3 text-center">Роль в системе</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-3 text-right pr-6">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((u, i) => (
                                <motion.tr
                                    key={u.user_id}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={cn("group hover:bg-primary/5 border-b border-border/30 last:border-0 transition-colors")}
                                >
                                    <TableCell className="py-3.5 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-600/15 flex items-center justify-center shrink-0 border border-blue-600/20">
                                                <Icons.User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <span className="font-semibold text-sm">{u.fullname}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3.5 text-sm text-muted-foreground font-medium">{u.rank || "—"}</TableCell>
                                    <TableCell className="py-3.5 text-sm text-muted-foreground">{u.position || "—"}</TableCell>
                                    <TableCell className="py-3.5 text-center">{getRoleBadge(u.role)}</TableCell>
                                    <TableCell className="py-3.5 text-right pr-6">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                                title="Открыть профиль"
                                                onClick={() => router.push(`/personnel/view/${u.user_id}?mode=personnel`)}
                                            >
                                                <Icons.Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-600"
                                                title="Назначения"
                                                onClick={() => router.push(`/personnel/view/${u.user_id}?mode=personnel&section=commission_assignments`)}
                                            >
                                                <Icons.FileText className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
