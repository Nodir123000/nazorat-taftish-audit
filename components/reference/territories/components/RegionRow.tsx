import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Edit, Trash2, MapPin, Building2, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { LocalizedContent, Region } from "../types"

interface RegionRowProps {
    item: Region
    idx: number
    onEdit: (item: Region) => void
    onDelete: (id: number) => void
    getLocalizedName: (obj: LocalizedContent) => string
    getSubtextNames: (obj: LocalizedContent) => string
    t: (ru: string, uzL: string, uzC: string) => string
    ui: (key: string, fallback?: string) => string
}

export function RegionRow({ item, idx, onEdit, onDelete, getLocalizedName, getSubtextNames, t, ui }: RegionRowProps) {
    return (
        <TableRow className="group h-20 hover:bg-blue-50/50 transition-all duration-300 border-b border-border/40">
            <TableCell className="px-6">
                <span className="font-mono text-xs font-bold text-muted-foreground/40 leading-none">{(idx + 1).toString().padStart(2, '0')}</span>
            </TableCell>
            <TableCell className="px-6 border-l border-border/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100/50 text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all scale-90 group-hover:scale-100 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                        {item.type === "City" ? <Building2 className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-[15px] text-slate-900 group-hover:text-blue-700 transition-colors">
                            {getLocalizedName(item.name)}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground/60 w-48 truncate">
                            {getSubtextNames(item.name)}
                        </span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-6 border-l border-border/5">
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200/60 font-medium px-2.5 py-0.5 rounded-lg text-[11px]">
                    {item.typeData ? getLocalizedName(item.typeData.name) : item.type}
                </Badge>
            </TableCell>
            <TableCell className="px-6 border-l border-border/5">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-sm text-slate-700 tabular-nums">{item.districtsCount}</span>
                    <span className="text-[11px] text-muted-foreground font-medium lowercase">
                        {ui("common.unit_short")}
                    </span>
                </div>
            </TableCell>
            <TableCell className="px-6 border-l border-border/5">
                <Badge
                    variant={item.status === 'inactive' ? "secondary" : "default"}
                    className={cn(
                        "px-2.5 py-1 rounded-lg border-none text-[10px] font-bold shadow-sm transition-colors",
                        item.status === 'active' ? "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20" : "bg-slate-100 text-slate-500"
                    )}
                >
                    <div className="flex items-center gap-1.5">
                        {item.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {item.statusData ? getLocalizedName(item.statusData.name) : item.status}
                    </div>
                </Badge>
            </TableCell>
            <TableCell className="px-6 text-right border-l border-border/5">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-100 hover:text-slate-900">
                            <MoreHorizontal className="h-5 w-5 text-muted-foreground/70" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-2xl border-none bg-white/95 backdrop-blur-xl p-1">
                        <DropdownMenuLabel className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/50 px-3 py-1.5">
                            {ui("common.manage")}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/40 my-1" />
                        <DropdownMenuItem onClick={() => onEdit(item)} className="rounded-xl py-2.5 px-3 cursor-pointer focus:bg-blue-500/10 focus:text-blue-600 text-sm font-medium transition-colors gap-2">
                            <Edit className="h-4 w-4" />
                            {ui("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item.id)} className="rounded-xl py-2.5 px-3 cursor-pointer focus:bg-destructive/10 focus:text-destructive text-destructive text-sm font-medium transition-colors gap-2 mt-1">
                            <Trash2 className="h-4 w-4" />
                            {ui("common.delete")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}
