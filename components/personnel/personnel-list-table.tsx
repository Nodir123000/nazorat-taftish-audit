"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_ColumnFiltersState,
} from 'material-react-table'
import { MRT_Localization_RU } from 'material-react-table/locales/ru'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import type { EmployeeDTO } from "@/lib/types/personnel.dto"
import { RankEnum } from "@/lib/types/personnel.dto"

interface PersonnelListTableProps {
  data: EmployeeDTO[]
  totalCount: number
  pagination: MRT_PaginationState
  onPaginationChange: (updater: any) => void
  sorting: MRT_SortingState
  onSortingChange: (updater: any) => void
  columnFilters: MRT_ColumnFiltersState
  onColumnFiltersChange: (updater: any) => void
  globalFilter: string
  onGlobalFilterChange: (updater: any) => void
  isLoading?: boolean
}

export function PersonnelListTable({
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
  isLoading
}: PersonnelListTableProps) {
  const router = useRouter()

  const handleViewDetails = (id: string) => {
    router.push(`/personnel/view/${id}?mode=inspector`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTenure = (dateString?: string) => {
    if (!dateString) return "Н/Д"
    const start = new Date(dateString.split('.').reverse().join('-'))
    if (isNaN(start.getTime())) return "Н/Д"
    const now = new Date()
    const years = now.getFullYear() - start.getFullYear()
    return `${years} лет`
  }

  const getKpiColor = (rating?: string) => {
    switch (rating) {
      case 'excellent': return "bg-green-100 text-green-700 border-green-200"
      case 'good': return "bg-blue-100 text-blue-700 border-blue-200"
      case 'satisfactory': return "bg-amber-100 text-amber-700 border-amber-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getKpiText = (rating?: string) => {
    switch (rating) {
      case 'excellent': return "Отлично"
      case 'good': return "Хорошо"
      case 'satisfactory': return "Удовл."
      default: return "Н/Д"
    }
  }

  const columns = useMemo<MRT_ColumnDef<EmployeeDTO>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 70,
        enableColumnFilter: false,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'serviceNumber',
        header: 'ПНР',
        size: 100,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs">
            {cell.getValue<string>() || "Н/Д"}
          </span>
        ),
      },
      {
        accessorKey: 'pin',
        header: 'ПИНФЛ',
        size: 120,
        Cell: ({ cell }) => (
          <Badge variant="outline" className="text-blue-600 font-mono text-[10px] w-fit px-1.5 py-0">
            {cell.getValue<string>() ? cell.getValue<string>()?.slice(0, 14) : "Н/Д"}
          </Badge>
        ),
      },
      {
        accessorKey: 'rank',
        header: 'Звание',
        size: 120,
        filterVariant: 'multi-select',
        filterSelectOptions: RankEnum.options,
        Cell: ({ row }) => (
          <span className="text-[11px] font-bold uppercase text-muted-foreground px-1.5 py-0.5 bg-muted rounded shadow-sm whitespace-nowrap">
            {typeof row.original.rank === 'string' ? row.original.rank : row.original.militaryRank}
          </span>
        ),
      },
      {
        id: 'fullName',
        header: 'ФИО',
        size: 200,
        accessorFn: (row) => `${row.lastName} ${row.firstName} ${row.patronymic || ''}`,
        Cell: ({ row }) => (
          <span className="font-medium text-sm leading-tight text-foreground">
            {row.original.lastName} {row.original.firstName} {row.original.patronymic}
          </span>
        ),
      },
      {
        accessorKey: 'inspectorCategory',
        header: 'Категория',
        size: 130,
        filterVariant: 'select',
        filterSelectOptions: ['Инспектор', 'Старший инспектор', 'Ведущий инспектор'],
        Cell: ({ cell }) => (
          <Badge variant="outline" className="font-normal text-xs bg-slate-50 whitespace-nowrap">
            {cell.getValue<string>() || "Инспектор"}
          </Badge>
        ),
      },
      {
        accessorKey: 'militaryDistrict',
        header: 'Местонахождение',
        Cell: ({ row }) => (
          <div className="flex flex-col max-w-[150px]">
            <div className="text-[11px] text-foreground flex items-center gap-1 font-bold truncate" title={row.original.militaryDistrict}>
              <Icons.Shield className="h-3 w-3 text-muted-foreground" />
              {row.original.militaryDistrict || "—"}
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium truncate" title={row.original.dislocation}>
              <Icons.MapPin className="h-3 w-3 text-muted-foreground" />
              {row.original.dislocation || "—"}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'position',
        header: 'Должность',
        size: 150,
        Cell: ({ cell }) => (
          <div className="text-[11px] text-foreground flex items-center gap-1 font-medium max-w-[150px] truncate" title={cell.getValue<string>()}>
            <Icons.Briefcase className="h-3 w-3 text-muted-foreground" />
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'specialization',
        header: 'ВУС',
        size: 100,
        Cell: ({ cell }) => (
          <div className="text-[10px] text-muted-foreground font-mono">
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'dob',
        header: 'Стаж',
        size: 80,
        enableColumnFilter: false,
        Cell: ({ cell }) => (
          <div className="text-center text-xs whitespace-nowrap">
            {getTenure(cell.getValue<string>())}
          </div>
        ),
      },
      {
        accessorKey: 'auditCount',
        header: 'Ревизий',
        size: 80,
        filterVariant: 'range',
        Cell: ({ cell }) => (
          <div className="text-center font-bold text-sm">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        accessorKey: 'violationsFound',
        header: 'Нарушений',
        size: 80,
        filterVariant: 'range',
        Cell: ({ cell }) => (
          <div className="text-center font-bold text-sm text-amber-700">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        accessorKey: 'totalDamageAmount',
        header: 'Выявленный ущерб',
        size: 150,
        filterVariant: 'range',
        Cell: ({ cell }) => (
          <div className="text-right font-bold text-xs whitespace-nowrap">
            {formatCurrency(cell.getValue<number>() || 0)}
          </div>
        ),
      },
      {
        accessorKey: 'kpiRating',
        header: 'KPI',
        size: 100,
        filterVariant: 'select',
        filterSelectOptions: [
          { label: 'Отлично', value: 'excellent' },
          { label: 'Хорошо', value: 'good' },
          { label: 'Удовлетв.', value: 'satisfactory' },
        ],
        Cell: ({ cell }) => (
          <div className="text-center">
            <Badge variant="outline" className={`${getKpiColor(cell.getValue<string>())} text-[10px] px-1.5 whitespace-nowrap`}>
              {getKpiText(cell.getValue<string>())}
            </Badge>
          </div>
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
      columnPinning: {
        left: ['mrt-row-actions', 'id'],
        right: ['kpiRating'],
      },
      density: 'compact',
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
    enableStickyHeader: true,
    enableColumnPinning: true,
    enableRowActions: true,
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Действия',
        size: 80,
      },
    },
    renderRowActions: ({ row }) => (
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleViewDetails(row.original.id)}
          className="h-8 w-8 text-muted-foreground hover:text-primary"
        >
          <Icons.ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    ),
    localization: MRT_Localization_RU,
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
        border: 'none',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 350px)',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 'bold',
        backgroundColor: 'var(--muted)',
      },
    },
  })

  return <MaterialReactTable table={table} />
}
