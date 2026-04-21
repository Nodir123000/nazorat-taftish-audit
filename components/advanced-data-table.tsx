"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: string
  title: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

interface AdvancedDataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  groupBy?: string
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
  actions?: {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: (row: T) => void
  }[]
}

export function AdvancedDataTable<T extends Record<string, any>>({
  data,
  columns,
  groupBy,
  onRowClick,
  onSelectionChange,
  actions,
}: AdvancedDataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map((_, index) => index)))
      onSelectionChange?.(data)
    } else {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    }
  }

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(index)
    } else {
      newSelected.delete(index)
    }
    setSelectedRows(newSelected)
    onSelectionChange?.(data.filter((_, i) => newSelected.has(i)))
  }

  const toggleGroup = (groupKey: string) => {
    const newCollapsed = new Set(collapsedGroups)
    if (newCollapsed.has(groupKey)) {
      newCollapsed.delete(groupKey)
    } else {
      newCollapsed.add(groupKey)
    }
    setCollapsedGroups(newCollapsed)
  }

  const sortedData = [...data]
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortDirection === "asc" ? comparison : -comparison
    })
  }

  const groupedData = groupBy
    ? sortedData.reduce(
        (acc, row) => {
          const groupKey = row[groupBy]
          if (!acc[groupKey]) acc[groupKey] = []
          acc[groupKey].push(row)
          return acc
        },
        {} as Record<string, T[]>,
      )
    : null

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectionChange && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead key={column.key}>
                {column.sortable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.title}
                    {sortColumn === column.key && (
                      <Icons.ArrowUpDown
                        className={cn("ml-2 h-4 w-4 transition-transform", sortDirection === "desc" && "rotate-180")}
                      />
                    )}
                  </Button>
                ) : (
                  column.title
                )}
              </TableHead>
            ))}
            {actions && <TableHead className="w-24">Действия</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedData ? (
            Object.entries(groupedData).map(([groupKey, rows]) => (
              <>
                <TableRow key={`group-${groupKey}`} className="bg-muted/50 hover:bg-muted/70">
                  <TableCell colSpan={columns.length + (onSelectionChange ? 1 : 0) + (actions ? 1 : 0)}>
                    <Button variant="ghost" size="sm" className="font-semibold" onClick={() => toggleGroup(groupKey)}>
                      {collapsedGroups.has(groupKey) ? (
                        <Icons.ChevronRight className="h-4 w-4 mr-2" />
                      ) : (
                        <Icons.ChevronDown className="h-4 w-4 mr-2" />
                      )}
                      {groupKey} ({rows.length})
                    </Button>
                  </TableCell>
                </TableRow>
                {!collapsedGroups.has(groupKey) &&
                  rows.map((row, rowIndex) => {
                    const globalIndex = data.indexOf(row)
                    return (
                      <TableRow
                        key={`row-${globalIndex}`}
                        className={cn(onRowClick && "cursor-pointer")}
                        onClick={() => onRowClick?.(row)}
                      >
                        {onSelectionChange && (
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedRows.has(globalIndex)}
                              onCheckedChange={(checked) => handleSelectRow(globalIndex, checked as boolean)}
                            />
                          </TableCell>
                        )}
                        {columns.map((column) => (
                          <TableCell key={column.key}>
                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                          </TableCell>
                        ))}
                        {actions && (
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-1">
                              {actions.map((action, actionIndex) => {
                                const ActionIcon = action.icon
                                return (
                                  <Button
                                    key={actionIndex}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => action.onClick(row)}
                                  >
                                    {ActionIcon && <ActionIcon className="h-4 w-4" />}
                                  </Button>
                                )
                              })}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}
              </>
            ))
          ) : (
            <>
              {sortedData.map((row, index) => (
                <TableRow key={index} className={cn(onRowClick && "cursor-pointer")} onClick={() => onRowClick?.(row)}>
                  {onSelectionChange && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onCheckedChange={(checked) => handleSelectRow(index, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        {actions.map((action, actionIndex) => {
                          const ActionIcon = action.icon
                          return (
                            <Button key={actionIndex} variant="ghost" size="sm" onClick={() => action.onClick(row)}>
                              {ActionIcon && <ActionIcon className="h-4 w-4" />}
                            </Button>
                          )
                        })}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
