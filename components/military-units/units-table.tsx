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
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, MapPin, Building2, ShieldCheck } from "lucide-react"

export interface UnitRow {
    id: string
    unitNumber: string
    name: string
    militaryDistrict: string
    region: string
    city: string
    commander: string
    detected: number
    repaid: number
    balance: number
    auditsCount: number
    isActive: boolean
}

interface UnitsTableProps {
    data: UnitRow[]
    totalCount: number
    isLoading: boolean
    pagination: MRT_PaginationState
    sorting: MRT_SortingState
    columnFilters: MRT_ColumnFiltersState
    globalFilter: string
    onPaginationChange: (updater: MRT_Updater<MRT_PaginationState>) => void
    onSortingChange: (updater: MRT_Updater<MRT_SortingState>) => void
    onColumnFiltersChange: (updater: MRT_Updater<MRT_ColumnFiltersState>) => void
    onGlobalFilterChange: (value: string) => void
    onEdit?: (row: UnitRow) => void
}

export function UnitsTable({
    data,
    totalCount,
    isLoading,
    pagination,
    sorting,
    columnFilters,
    globalFilter,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onEdit,
}: UnitsTableProps) {
    const router = useRouter()

    const columns = useMemo<MRT_ColumnDef<UnitRow>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Наименование",
                size: 250,
                Cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0">
                            <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="font-semibold text-xs text-slate-800 leading-tight">
                                {row.original.name || "—"}
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <ShieldCheck className="h-2.5 w-2.5 text-slate-400" />
                                {row.original.militaryDistrict || "—"}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "city",
                header: "Дислокация",
                size: 180,
                Cell: ({ row }) => {
                    const city = row.original.city
                    const region = row.original.region

                    const displayCity = city && city !== "—"
                        ? (city.toLowerCase().startsWith('г.') ||
                            city.toLowerCase().startsWith('город') ||
                            city.toLowerCase().includes('район') ||
                            city.toLowerCase().includes('тумани'))
                            ? city
                            : `город ${city}`
                        : "—"

                    const displayRegion = region && region !== "—"
                        ? region.replace(/\sобл\.?$/i, ' область').replace('обл.', 'область')
                        : "—"

                    return (
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 leading-none mb-1">
                                <MapPin className="h-3 w-3 text-emerald-600" />
                                <span className="text-[11px] font-bold text-slate-800 truncate">
                                    {displayCity}
                                </span>
                            </div>
                            <span className="text-[9px] text-muted-foreground font-medium italic block pl-5 truncate">
                                {displayRegion}
                            </span>
                        </div>
                    )
                },
            },
            {
                accessorKey: "commander",
                header: "Количество",
                size: 180,
                Cell: ({ row }) => (
                    <div className="text-xs font-medium text-slate-700">
                        {row.original.commander || "—"}
                    </div>
                ),
            },
            {
                accessorKey: "detected",
                header: "Выявлено",
                size: 120,
                Cell: ({ row }) => (
                    <div className="text-xs font-bold text-red-600">
                        {row.original.detected.toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: "repaid",
                header: "Погашено",
                size: 120,
                Cell: ({ row }) => (
                    <div className="text-xs font-bold text-emerald-600">
                        {row.original.repaid.toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: "balance",
                header: "Остаток",
                size: 120,
                Cell: ({ row }) => (
                    <div className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded text-center">
                        {row.original.balance.toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: "auditsCount",
                header: "Ревизий",
                size: 90,
                Cell: ({ row }) => (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                        {row.original.auditsCount}
                    </Badge>
                ),
            },
            {
                accessorKey: "isActive",
                header: "Статус",
                size: 90,
                Cell: ({ row }) => (
                    row.original.isActive
                        ? <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-2 py-0.5 text-[10px] uppercase">Активна</Badge>
                        : <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium px-2 py-0.5 text-[10px] uppercase">Неактивна</Badge>
                ),
            },
        ],
        []
    )

    const table = useMaterialReactTable({
        columns,
        data,
        initialState: {
            showColumnFilters: false,
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
        enableStickyHeader: true,
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
                    onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/units/view/${row.original.id}`)
                    }}
                >
                    <Eye className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (onEdit) onEdit(row.original)
                    }}
                >
                    <Edit className="h-4 w-4" />
                </Button>
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
                maxHeight: "calc(100vh - 300px)",
            },
        },
        muiTableHeadCellProps: {
            className: "bg-slate-50/80 text-slate-500 font-black uppercase tracking-widest text-[10px] py-4",
        },
        muiTableBodyCellProps: {
            className: "border-slate-50 py-3",
        },
        muiTableBodyRowProps: {
            className: "hover:bg-primary/5 transition-all duration-300 cursor-pointer",
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
