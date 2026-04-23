"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { supplyDepartments } from "@/lib/data/expense-classification"
import { useSupplyDepartments } from "@/lib/hooks/use-reference"

interface SupplyDepartmentSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SupplyDepartmentSelect({
  value,
  onValueChange,
  placeholder = "Выберите довольствующее управление",
  disabled = false,
  className,
}: SupplyDepartmentSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { data: departments = [], isLoading } = useSupplyDepartments()

  const selectedDepartment = value ? departments.find((d: any) => d.code === value) : null

  const filteredDepartments = React.useMemo(() => {
    if (!searchQuery) return departments

    const query = searchQuery.toLowerCase()
    return departments.filter(
      (dept: any) => {
        const code = (dept.code || "").toLowerCase()
        const nameRu = (dept.nameRu || (typeof dept.name === 'object' ? dept.name?.ru : dept.name) || "").toLowerCase()
        return code.includes(query) || nameRu.includes(query)
      }
    )
  }, [searchQuery, departments])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn("w-full justify-between text-left font-normal", className)}
        >
          {selectedDepartment ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">
                {selectedDepartment.code}
              </span>
              <span className="truncate">
                {selectedDepartment.name_ru || (typeof selectedDepartment.name === 'object' ? selectedDepartment.name?.ru : selectedDepartment.name) || ""}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-125 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск по коду или названию..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-75">
            <CommandEmpty>Управление не найдено</CommandEmpty>
            <CommandGroup heading="Довольствующие управления МО РУз">
              {filteredDepartments.map((dept: any) => {
                const nameRu = dept.name_ru || (typeof dept.name === 'object' ? dept.name?.ru : dept.name) || "";
                return (
                  <CommandItem
                    key={dept.code}
                    value={dept.code}
                    onSelect={() => {
                      onValueChange(dept.code)
                      setOpen(false)
                      setSearchQuery("")
                    }}
                    className="flex items-center gap-2"
                  >
                    <Check className={cn("h-4 w-4 shrink-0", value === dept.code ? "opacity-100" : "opacity-0")} />
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">{dept.code}</span>
                    <span className="truncate">{nameRu}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
