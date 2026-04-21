"use client"

import * as React from "react"
import { Check, ChevronsUpDown, User } from "lucide-react"
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
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons, type PhysicalPerson } from "./physical-persons-data"
import { Badge } from "@/components/ui/badge"

interface PersonnelSelectProps {
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    returnId?: boolean
}

export function PersonnelSelect({
    value,
    onValueChange,
    placeholder = "Выберите сотрудника...",
    disabled = false,
    className,
    returnId = false,
}: PersonnelSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    const options = React.useMemo(() => {
        return militaryPersonnel.map(person => {
            const physical = physicalPersons.find((p: PhysicalPerson) => p.id === person.personId)
            const fullName = physical ? `${physical.lastName} ${physical.firstName} ${physical.middleName}` : "Неизвестно"
            return {
                ...person,
                fullName
            }
        })
    }, [])

    const selectedPerson = options.find((p) =>
        (returnId && p.id.toString() === value) ||
        (!returnId && p.fullName === value) ||
        // Fallback for existing mixed usage or transition
        p.id.toString() === value ||
        p.fullName === value
    )

    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) return options
        const query = searchQuery.toLowerCase()
        return options.filter((p) =>
            p.fullName.toLowerCase().includes(query) ||
            p.rank.toLowerCase().includes(query) ||
            p.position.toLowerCase().includes(query)
        )
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
                    {selectedPerson ? (
                        <div className="flex items-center gap-2 truncate">
                            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{selectedPerson.fullName}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-[350px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Поиск по ФИО, званию или должности..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList className="max-h-[300px]">
                        <CommandEmpty>Сотрудник не найден</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((person) => (
                                <CommandItem
                                    key={person.id}
                                    value={person.fullName}
                                    onSelect={() => {
                                        onValueChange(returnId ? person.id.toString() : person.fullName)
                                        setOpen(false)
                                        setSearchQuery("")
                                    }}
                                    className="flex flex-col items-start gap-1 py-3"
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <Check
                                            className={cn(
                                                "h-4 w-4 shrink-0",
                                                value === person.fullName || value === person.id.toString()
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <span className="font-semibold truncate">{person.fullName}</span>
                                        <Badge variant="secondary" className="ml-auto text-[10px] shrink-0">
                                            {person.rank}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground pl-6">
                                        {person.position}
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
