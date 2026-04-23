"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
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
import { classifiers } from "@/components/reference/classifiers"
import { usePositions, useVus } from "@/lib/hooks/use-reference"

interface ClassifierSelectProps {
    classifierId: number
    value?: string | number
    onValueChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function ClassifierSelect({
    classifierId,
    value,
    onValueChange,
    placeholder = "Выберите значение...",
    disabled = false,
    className,
}: ClassifierSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const { data: positions = [], isLoading: loadingPositions } = usePositions(undefined)
    const { data: vus = [], isLoading: loadingVus } = useVus(undefined)

    const classifier = classifiers.find((c) => c.id === classifierId)
    const isDynamic = classifier?.isDynamic || classifierId === 13 || classifierId === 14

    const loading = loadingPositions || loadingVus

    const dynamicOptions = React.useMemo(() => {
        if (!isDynamic) return []
        return classifierId === 13 ? positions : vus
    }, [isDynamic, classifierId, positions, vus])

    const options = isDynamic ? dynamicOptions : (classifier?.values || [])

    const getLocalizedName = (item: any) => {
        if (!item) return ""
        if (typeof item.name === 'object') {
            // Priority: RU (usually standard for these specific fields in this UI)
            return item.name.ru || item.name.uz || item.name.uzk || ""
        }
        return item.name
    }

    // Найти выбранное имя
    const selectedName = React.useMemo(() => {
        const found = options.find((opt: any) => {
            const optId = opt.id?.toString()
            const valStr = value?.toString()
            if (optId && valStr && optId === valStr) return true
            
            const optName = getLocalizedName(opt)
            return optName === value
        })
        return found ? getLocalizedName(found) : null
    }, [options, value])

    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) return options
        const query = searchQuery.toLowerCase()
        return options.filter((opt: any) => {
            const name = getLocalizedName(opt).toLowerCase()
            return name.includes(query) || (opt.id && opt.id.toString().includes(query))
        })
    }, [options, searchQuery])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled || loading}
                    className={cn("w-full justify-between text-left font-normal", className)}
                >
                    {loading ? (
                        <span className="text-muted-foreground animate-pulse">Загрузка...</span>
                    ) : selectedName ? (
                        <span className="truncate">{selectedName}</span>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-75 p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Поиск..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList className="max-h-75">
                        <CommandEmpty>{loading ? "Загрузка данных..." : "Ничего не найдено"}</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((opt: any) => {
                                const name = getLocalizedName(opt)
                                return (
                                    <CommandItem
                                        key={opt.id}
                                        value={name}
                                        onSelect={() => {
                                            onValueChange(name)
                                            setOpen(false)
                                            setSearchQuery("")
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check
                                            className={cn(
                                                "h-4 w-4 shrink-0",
                                                value === name || value?.toString() === opt.id.toString()
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <span className="truncate">{name}</span>
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
