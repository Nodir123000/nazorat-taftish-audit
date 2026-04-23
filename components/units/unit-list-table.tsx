"use client"

import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"
import { Lang } from "@/lib/types/i18n"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UnitListTableProps {
    data: any[]
    isLoading?: boolean
    onEdit?: (unit: any) => void
    onDelete?: (id: number) => void
}

export function UnitListTable({ data, isLoading, onEdit, onDelete }: UnitListTableProps) {
    const router = useRouter()
    const { locale } = useI18n()

    const handleView = (unit: any) => {
        router.push(`/units/view/${unit.unitId}`)
    }

    const getLocalizedName = (item: any) => {
        if (!item) return ""
        if (typeof item.name === 'object' && item.name !== null) {
            if (locale === "ru") return item.name[Lang.RU] || ""
            if (locale === "uzLatn") return item.name[Lang.UZ_LATN] || ""
            if (locale === "uzCyrl") return item.name[Lang.UZ_CYRL] || ""
            return item.name[Lang.RU] || ""
        }
        if (locale === "uzLatn") return item.name_uz_latn || item.name || ""
        if (locale === "uzCyrl") return item.name_uz_cyrl || item.name || ""
        return item.name || ""
    }

    const t = (ru: string, uzL: string, uzC: string) => {
        if (locale === "ru") return ru;
        if (locale === "uzLatn") return uzL;
        return uzC;
    }

    return (
        <div className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <div className="overflow-x-auto min-w-250">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-slate-100 h-20 bg-slate-50/50 flex items-center">
                            <TableHead className="w-15 px-4 font-black text-tiny uppercase tracking-widest text-slate-400 items-center justify-center flex shrink-0">ID</TableHead>
                            <TableHead className="w-24 px-2 font-black text-tiny uppercase tracking-widest text-slate-400 items-center justify-center flex shrink-0">{t("Штат ID", "Shtat ID", "Штат ID")}</TableHead>
                            <TableHead className="w-100 px-6 font-black text-tiny uppercase tracking-widest text-slate-400 items-center flex shrink-0">{t("Наименование", "Nomlanishi", "Номи")}</TableHead>
                            <TableHead className="flex-1 px-6 font-black text-tiny uppercase tracking-widest text-slate-400 items-center flex shrink-0">{t("Локация", "Joylashuvi", "Локация")}</TableHead>
                            <TableHead className="w-80 px-6 font-black text-tiny uppercase tracking-widest text-slate-400 items-center flex shrink-0">{t("Округ", "Okrug", "Округ")}</TableHead>
                            <TableHead className="w-25 px-4 font-black text-tiny uppercase tracking-widest text-slate-400 items-center justify-center flex shrink-0">{t("Статус", "Holati", "Ҳолати")}</TableHead>
                            <TableHead className="w-30 px-8 font-black text-tiny uppercase tracking-widest text-slate-400 items-center justify-end flex shrink-0">{t("Действия", "Harakatlar", "Ҳаракатлар")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="h-64 flex items-center justify-center w-full">
                                <TableCell className="flex items-center justify-center gap-2 w-full">
                                    <Icons.Spinner className="h-5 w-5 animate-spin text-primary" />
                                    <span className="text-muted-foreground font-medium">Загрузка данных...</span>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow className="h-64 flex items-center justify-center w-full">
                                <TableCell className="text-center text-muted-foreground font-medium w-full">
                                    Данные не найдены
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((unit) => (
                                <TableRow
                                    key={unit.unitId}
                                    className="hover:bg-slate-50/80 border-b border-slate-100 group transition-all duration-200 w-full flex items-center"
                                    style={{ height: '96px' }}
                                >
                                    <TableCell className="w-15 px-4 font-mono text-tiny font-bold text-slate-400 justify-center flex shrink-0">
                                        {unit.unitId}
                                    </TableCell>
                                    <TableCell className="w-24 px-2 font-mono text-xs font-black text-slate-700 justify-center flex shrink-0">
                                        {unit.unitCode || unit.stateId || "-"}
                                    </TableCell>
                                    <TableCell className="w-100 px-6 flex shrink-0 items-center gap-4 overflow-hidden">
                                        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm shrink-0">
                                            <Icons.Building className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-black text-sm text-slate-800 tracking-tight truncate leading-tight">
                                                {getLocalizedName(unit)}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="rounded-md px-1.5 py-0 text-mini uppercase font-black bg-white text-slate-400 border-slate-200 tracking-tighter">
                                                    {unit.unitType || unit.type || t("Часть", "Qism", "Қисм")}
                                                </Badge>
                                                {unit.unitCode && (
                                                    <span className="text-mini font-mono font-bold text-slate-300 bg-slate-50/50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                                        {unit.unitCode}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex-1 px-6 text-xs text-slate-600 font-medium flex shrink-0 flex-col justify-center gap-1.5 min-w-0">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                            <Icons.MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                            <span className="truncate">{getLocalizedName(unit.area) || "-"}</span>
                                        </div>
                                        <div className="flex items-center gap-1 pl-5">
                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span className="text-tiny text-slate-400 truncate tracking-tight">{getLocalizedName(unit.area?.region) || "-"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-80 px-6 flex shrink-0 items-center">
                                        {unit.district ? (
                                            <div className="bg-slate-50 border border-slate-100/50 rounded-xl px-4 py-2 w-full flex items-center gap-3 group-hover:bg-white transition-colors shadow-sm">
                                                <Icons.Shield className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                                                <span className="text-tiny font-black uppercase tracking-tight text-slate-600 leading-none">
                                                    {getLocalizedName(unit.district) || "-"}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 px-6">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="w-25 px-4 justify-center flex shrink-0">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "rounded-lg px-2.5 py-1.5 font-black text-mini uppercase tracking-widest border whitespace-nowrap shadow-sm",
                                                unit.isActive !== false ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                            )}
                                        >
                                            {unit.isActive !== false ? t("Активна", "Faol", "Актив") : t("Nofaol", "Nofaol", "Нофаол")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="w-30 px-4 text-right shrink-0 flex justify-end gap-1.5">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-2xl hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-all active:scale-90"
                                            onClick={() => handleView(unit)}
                                        >
                                            <Icons.Eye className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                                            onClick={() => onEdit?.(unit)}
                                        >
                                            <Icons.Edit className="h-5 w-5" />
                                        </Button>
                                    </TableCell>


                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
