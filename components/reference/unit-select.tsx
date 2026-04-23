"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { militaryUnits } from "@/lib/data/military-data"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n/hooks"
import { useI18n } from "@/lib/i18n/context"
import useSWR from "swr"
import { toSafeString } from "@/lib/utils/localization"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface UnitSelectProps {
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    districtFilter?: string
    excludeUnits?: string[]
    onUnitChange?: (unit: any) => void
}

export function UnitSelect({
    value,
    onValueChange,
    placeholder = "Выберите воинскую часть...",
    disabled = false,
    className,
    districtFilter,
    excludeUnits = [],
    onUnitChange,
}: UnitSelectProps) {
    const { t } = useTranslation()
    const { locale } = useI18n()
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    const { data: dbUnitsResult, isLoading } = useSWR('/api/units?limit=300', fetcher)
    const dbUnits = React.useMemo(() => {
        if (!dbUnitsResult?.data) return []
        return dbUnitsResult.data.map((u: any) => ({
            ...u,
            id: u.unitId,
            stateNumber: u.unitCode,
            location: u.city + (u.region ? `, ${u.region}` : ""),
            district: u.militaryDistrict
        }))
    }, [dbUnitsResult])

    const options = React.useMemo(() => {
        // Merge static and DB units, avoiding duplicates
        const combined = [...militaryUnits]
        dbUnits.forEach((dbu: any) => {
            if (!combined.some(mu => mu.name === dbu.name || (mu.stateNumber && mu.stateNumber === dbu.stateNumber))) {
                combined.push(dbu)
            }
        })

        let filtered = combined
        if (districtFilter) {
            filtered = filtered.filter(u => u.district === districtFilter)
        }
        if (excludeUnits.length > 0) {
            filtered = filtered.filter(u => !excludeUnits.includes(u.name))
        }
        return filtered
    }, [dbUnits, districtFilter, excludeUnits])

    const selectedUnit = options.find((unit) => unit.name === value || unit.id?.toString() === value)

    const getLocalizedUnitName = (unit: any) => {
        if (!unit) return ""
        let name = unit.name
        if (locale === "uzLatn" && unit.name_uz_latn) name = unit.name_uz_latn
        if (locale === "uzCyrl" && unit.name_uz_cyrl) name = unit.name_uz_cyrl
        
        return toSafeString(name, locale as any)
    }

    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) return options
        const query = searchQuery.toLowerCase()
        return options.filter((unit) => {
            const name = toSafeString(unit.name, locale as any).toLowerCase()
            const nameUzLatn = unit.name_uz_latn ? toSafeString(unit.name_uz_latn, locale as any).toLowerCase() : ""
            const nameUzCyrl = unit.name_uz_cyrl ? toSafeString(unit.name_uz_cyrl, locale as any).toLowerCase() : ""
            
            return name.includes(query) ||
                nameUzLatn.includes(query) ||
                nameUzCyrl.includes(query) ||
                unit.id.toString().includes(query) ||
                (unit.stateNumber && unit.stateNumber.includes(query))
        })
    }, [options, searchQuery])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn("w-full justify-between text-left font-normal", className)}
                >
                    {selectedUnit ? (
                        <div className="flex items-center gap-2 truncate">
                            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{getLocalizedUnitName(selectedUnit)}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-100 p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={t("common.search")}
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList className="max-h-75">
                        <CommandEmpty>{t("common.noData")}</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((unit) => (
                                <CommandItem
                                    key={`${unit.id}-${unit.name}`}
                                    value={unit.name}
                                    onSelect={() => {
                                        // Pass the stable Russian name to onValueChange for consistent lookups,
                                        // or the string name if it's already a string.
                                        const stableName = typeof unit.name === 'object' ? unit.name.ru : unit.name;
                                        onValueChange(stableName)
                                        
                                        if (onUnitChange) {
                                            onUnitChange({
                                                ...unit,
                                                name: stableName // Dialogs expect a string here for controlObject
                                            })
                                        }
                                        setOpen(false)
                                        setSearchQuery("")
                                    }}
                                    className="flex flex-col items-start gap-1 py-3"
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <Check
                                            className={cn(
                                                "h-4 w-4 shrink-0",
                                                value === (typeof unit.name === 'object' ? unit.name.ru : unit.name) || 
                                                value === unit.id.toString()
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <span className="font-semibold truncate">{getLocalizedUnitName(unit)}</span>
                                        {unit.district && (
                                            <Badge variant="outline" className="ml-auto text-[10px] shrink-0">
                                                {toSafeString(unit.district, locale as any)}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-2 text-xs text-muted-foreground pl-6">
                                        <span>{toSafeString(unit.location, locale as any)}</span>
                                        {unit.stateNumber && <span> • №{unit.stateNumber}</span>}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
