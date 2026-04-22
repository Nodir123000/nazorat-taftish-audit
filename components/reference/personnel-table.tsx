"use client"

import { useMemo } from "react"
import {
    MaterialReactTable,
    MRT_TablePagination,
    MRT_ToolbarInternalButtons,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_PaginationState,
    type MRT_SortingState,
    type MRT_ColumnFiltersState,
    type MRT_Updater,
} from "material-react-table"
import { MRT_Localization_RU } from "material-react-table/locales/ru"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Eye,
    Edit,
    Trash2,
    MapPin,
    Building2,
    ShieldCheck,
    MoreHorizontal
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, maskPINFL } from "@/lib/utils"

interface PersonnelTableProps {
    data: any[]
    totalCount: number
    pagination: MRT_PaginationState
    onPaginationChange: (updater: MRT_Updater<MRT_PaginationState>) => void
    sorting: MRT_SortingState
    onSortingChange: (updater: MRT_Updater<MRT_SortingState>) => void
    columnFilters: MRT_ColumnFiltersState
    onColumnFiltersChange: (updater: MRT_Updater<MRT_ColumnFiltersState>) => void
    globalFilter: string
    onGlobalFilterChange: (filter: string) => void
    isLoading: boolean
    onView: (member: any) => void
    onEdit: (member: any) => void
    onMove: (member: any) => void
    onDelete: (id: number) => void
    rankOptions: any[]
}

export function PersonnelTable({
    data,
    totalCount,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    globalFilter,
    onGlobalFilterChange,
    isLoading,
    onView,
    onEdit,
    onMove,
    onDelete,
    rankOptions,
}: PersonnelTableProps) {
    const getAvatarColor = (id: number) => {
        const colors = [
            "bg-blue-100 text-blue-600 border-blue-200",
            "bg-emerald-100 text-emerald-600 border-emerald-200",
            "bg-violet-100 text-violet-600 border-violet-200",
            "bg-amber-100 text-amber-600 border-amber-200",
            "bg-rose-100 text-rose-600 border-rose-200",
            "bg-slate-100 text-slate-600 border-slate-200",
        ]
        return colors[(id || 0) % colors.length]
    }

    const getInitials = (person: any) => {
        if (!person) return "?"
        return `${person.lastName?.[0] || ''}${person.firstName?.[0] || ''}`
    }

    const getLocalizedName = (obj: any) => {
        if (!obj) return "—"
        if (typeof obj === 'string') return obj
        // Handle name object { ru: "...", uz: "..." }
        if (obj.name && typeof obj.name === 'object') {
            return obj.name.ru || obj.name.uz || obj.name.uzk || "—"
        }
        return obj.nameRu || obj.name_ru || obj.ru || obj.name || "—"
    }

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "id",
                header: "ID",
                size: 80,
                enableColumnFilter: false,
                Cell: ({ cell }) => (
                    <span className="font-mono text-xs font-bold text-muted-foreground/60">
                        {cell.getValue<number>()?.toString().padStart(5, "0")}
                    </span>
                ),
            },
            {
                accessorKey: "pnr",
                header: "Личный №",
                size: 140,
                Cell: ({ row }) => (
                    <div className="flex flex-col items-start">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono text-[10px] px-2 py-0 rounded mb-1 whitespace-nowrap">
                            {row.original.pnr}
                        </Badge>
                        <span className="text-[9px] text-muted-foreground/70 font-mono tracking-tight truncate w-full">
                            {maskPINFL(row.original.physicalPerson?.pinfl)}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: "physicalPerson.lastName",
                header: "Военнослужащий",
                size: 300,
                Cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-9 w-9 shrink-0 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm border-2",
                            getAvatarColor(row.original.id)
                        )}>
                            {getInitials(row.original.physicalPerson)}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[9px] font-black text-primary/80 uppercase tracking-widest bg-primary/10 px-1 py-0 rounded">
                                    {getLocalizedName(row.original.rank)}
                                </span>
                            </div>
                            <span className="font-bold text-sm truncate text-slate-900">
                                {row.original.physicalPerson?.lastName} {row.original.physicalPerson?.firstName} {row.original.physicalPerson?.middleName}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "dislocation",
                header: "Дислокация",
                size: 200,
                Cell: ({ row }) => (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 leading-none mb-1">
                            <MapPin className="h-3 w-3 text-emerald-600" />
                            <span className="text-[11px] font-bold text-slate-800 truncate" title={row.original.dislocation}>
                                {row.original.dislocation || "—"}
                            </span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-medium italic block pl-5 truncate" title={getLocalizedName(row.original.unit?.area?.region)}>
                            {getLocalizedName(row.original.unit?.area?.region)}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: "unit.district.shortName",
                header: "Округ",
                size: 150,
                Cell: ({ row }) => (
                    <Badge
                        variant="outline"
                        className="font-normal text-[10px] bg-slate-50 text-slate-600 border-slate-200 gap-1.5 py-1"
                    >
                        <ShieldCheck className="h-3 w-3" />
                        {getLocalizedName(row.original.unit?.district?.shortName)}
                    </Badge>
                ),
            },
            {
                accessorKey: "unit.unitId",
                header: "Подразделение",
                size: 180,
                Cell: ({ row }) => (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 group/unit mb-1">
                            <Building2 className="h-3 w-3 text-indigo-500" />
                            <span className="text-[11px] font-bold text-foreground truncate">
                                {(() => {
                                    const code = row.original.unit?.unitCode;
                                    const id = row.original.unit?.unitId;
                                    const name = getLocalizedName(row.original.unit);
                                    if (code && !isNaN(Number(code))) return `В/Ч ${code.toString().padStart(5, "0")}`;
                                    if (id && !isNaN(Number(id))) return `В/Ч ${id.toString().padStart(5, "0")}`;
                                    return name || "—";
                                })()}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "position.nameRu",
                header: "Должность / ВУС",
                size: 220,
                Cell: ({ row }) => (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 truncate mb-1">
                            <ShieldCheck className="h-3 w-3 text-blue-500" />
                            {getLocalizedName(row.original.position)}
                        </div>
                        <div className="text-[9px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded w-fit font-mono font-bold">
                            VUS: {row.original.vus?.code || "—"}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "status",
                header: "Статус",
                size: 100,
                filterVariant: "select",
                filterSelectOptions: [
                    { label: "Актив", value: "active" },
                    { label: "Запас", value: "reserve" },
                    { label: "Отставка", value: "retired" },
                ],
                Cell: ({ cell }) => {
                    const status = cell.getValue<string>()
                    return (
                        <Badge
                            variant={status === "retired" ? "secondary" : "default"}
                            className={cn(
                                "px-2 py-0.5 rounded-lg border-none text-[9px] font-bold shadow-sm",
                                status === "active" ? "bg-emerald-500/10 text-emerald-600" :
                                    status === "reserve" ? "bg-amber-500/10 text-amber-600" :
                                        "bg-slate-100 text-slate-500"
                            )}
                        >
                            {status === "active" ? "Актив" : status === "reserve" ? "Запас" : "Отставка"}
                        </Badge>
                    )
                },
            },
        ],
        []
    )

    const table = useMaterialReactTable({
        columns,
        data,
        initialState: {
            showColumnFilters: false,
            columnPinning: {
                left: ["mrt-row-actions", "id"],
                right: ["status"],
            },
            density: "compact",
        },
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        onPaginationChange,
        onSortingChange,
        onColumnFiltersChange,
        onGlobalFilterChange,
        rowCount: totalCount,
        state: {
            pagination,
            sorting,
            columnFilters,
            globalFilter,
            isLoading,
        },
        paginationDisplayMode: "pages",
        positionPagination: "top",
        muiPaginationProps: {
            sx: {
                width: "auto",
                '& .MuiToolbar-root': {
                    padding: 0,
                    minHeight: "48px",
                },
                '& .MuiTablePagination-spacer': {
                    display: "none",
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-select, & .MuiTablePagination-actions': {
                    margin: 0,
                }
            }
        },
        enableStickyHeader: true,
        enableColumnPinning: true,
        enableRowActions: true,
        displayColumnDefOptions: {
            "mrt-row-actions": {
                header: "Действия",
                size: 80,
            },
        },
        renderRowActions: ({ row }) => (
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => onView(row.original)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-2xl border-none z-[10000]">
                        <DropdownMenuItem className="rounded-xl py-2 cursor-pointer focus:bg-primary/5" onClick={() => onMove(row.original)}>
                            <MapPin className="h-4 w-4 mr-2.5 text-emerald-600" />
                            Переместить
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl py-2 cursor-pointer focus:bg-primary/5" onClick={() => onEdit(row.original)}>
                            <Edit className="h-4 w-4 mr-2.5 text-blue-600" />
                            Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl py-2 cursor-pointer text-destructive focus:bg-destructive/5" onClick={() => onDelete(row.original.id)}>
                            <Trash2 className="h-4 w-4 mr-2.5" />
                            Уволить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
        localization: MRT_Localization_RU,
        muiTablePaperProps: {
            elevation: 0,
            className: "border-none bg-transparent",
        },
        muiTableContainerProps: {
            className: "scrollbar-hide rounded-xl border border-slate-100",
            sx: {
                maxHeight: "calc(100vh - 280px)",
            },
        },
        muiTableHeadCellProps: {
            className: "bg-slate-50/80 text-slate-500 font-black uppercase tracking-widest text-[10px] py-4",
        },
        muiTableBodyCellProps: {
            className: "border-slate-50 py-3",
        },
        muiTableBodyRowProps: {
            className: "hover:bg-primary/5 transition-all duration-300",
        },
        renderTopToolbar: ({ table }) => (
            <div className="flex flex-row items-center justify-between w-full px-2 py-0 border-b border-slate-100" style={{ minHeight: 48 }}>
                <MRT_TablePagination table={table} />
                <MRT_ToolbarInternalButtons table={table} />
            </div>
        ),
        enableBottomToolbar: false,
    })

    return <MaterialReactTable table={table} />
}
