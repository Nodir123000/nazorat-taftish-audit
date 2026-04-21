import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker, ConfigProvider } from "antd"
import dayjs from "dayjs"
import ruRU from "antd/locale/ru_RU"
import enUS from "antd/locale/en_US"
import { Icons } from "@/components/icons"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useTranslation } from "@/lib/i18n/hooks"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface FilterPanelProps {
    filters: any
    setFilters: (filters: any) => void
    locale: "ru" | "uzLatn" | "uzCyrl"
    viewMode?: string
    onViewModeChange?: (mode: any) => void
    handleResetFilters: () => void
    handleExport?: () => void
    showYear?: boolean
    showViewMode?: boolean
    showPeriod?: boolean
    itemsPerPage?: number
    onItemsPerPageChange?: (value: number) => void
    currentPage?: number
    totalPages?: number
    onPageChange?: (page: number) => void
}

export function FilterPanel({
    filters,
    setFilters,
    locale,
    viewMode,
    onViewModeChange,
    handleResetFilters,
    handleExport,
    showYear = true,
    showViewMode = true,
    showPeriod = true,
    itemsPerPage = 10,
    onItemsPerPageChange,
    currentPage = 1,
    totalPages = 0,
    onPageChange,
}: FilterPanelProps) {
    const { t } = useTranslation()
    const [openYearFilter, setOpenYearFilter] = useState(false)

    const getPageNumbers = () => {
        const pages = []
        const showMax = 3 // Количество страниц вокруг текущей

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (currentPage > showMax) pages.push("ellipsis-1")

            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i)
            }

            if (currentPage < totalPages - showMax + 1) pages.push("ellipsis-2")
            if (!pages.includes(totalPages)) pages.push(totalPages)
        }
        return pages
    }

    const yearOptions = [
        { value: "all", label: locale === "ru" ? "Все годы" : "Barcha yillar" },
        { value: "2023", label: "2023" },
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
    ]

    return (
        <Card className="border-primary/20 mb-6">
            <CardHeader>
                <CardTitle>{locale === "ru" ? "Фильтры" : locale === "uzLatn" ? "Filtrlar" : "Филтрлар"}</CardTitle>
                <CardDescription>
                    {locale === "ru" ? "Поиск и фильтрация данных реестра"
                        : locale === "uzLatn" ? "Reyestr ma'lumotlarini qidirish va filtrlash"
                            : "Реестр маълумотларини қидириш ва филтрлаш"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 relative min-w-64">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t("annual.search")}
                            className="pl-10"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>


                    {showYear && (
                        <Popover open={openYearFilter} onOpenChange={setOpenYearFilter}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openYearFilter}
                                    className="w-32 justify-between"
                                >
                                    {filters.year && filters.year !== "all"
                                        ? yearOptions.find((y) => y.value === filters.year)?.label
                                        : t("annual.filter.year")}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-32 p-0">
                                <Command>
                                    <CommandInput placeholder={t("annual.filter.year")} />
                                    <CommandList>
                                        <CommandEmpty>Нет данных</CommandEmpty>
                                        <CommandGroup>
                                            {yearOptions.map((item) => (
                                                <CommandItem
                                                    key={item.value}
                                                    value={item.value}
                                                    onSelect={(currentValue) => {
                                                        setFilters({ ...filters, year: currentValue })
                                                        setOpenYearFilter(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            filters.year === item.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {item.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    )}
                    {showViewMode && onViewModeChange && (
                        <Select value={viewMode} onValueChange={onViewModeChange}>
                            <SelectTrigger className="w-52">
                                <SelectValue placeholder="Режим отображения" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="list">
                                    <span className="flex items-center gap-2">
                                        <Icons.List className="h-4 w-4" />
                                        {locale === "ru" ? "Списком" : locale === "uzLatn" ? "Ro'yxat" : "Рўйхат"}
                                    </span>
                                </SelectItem>
                                <SelectItem value="years">
                                    <span className="flex items-center gap-2">
                                        <Icons.Calendar className="h-4 w-4" />
                                        {locale === "ru" ? "По годам" : locale === "uzLatn" ? "Yillar bo'yicha" : "Йиллар бўйича"}
                                    </span>
                                </SelectItem>
                                <SelectItem value="regions">
                                    <span className="flex items-center gap-2">
                                        <Icons.MapPin className="h-4 w-4" />
                                        {locale === "ru" ? "По областям" : locale === "uzLatn" ? "Viloyatlar bo'yicha" : "Вилоятлар бўйича"}
                                    </span>
                                </SelectItem>
                                <SelectItem value="districts">
                                    <span className="flex items-center gap-2">
                                        <Icons.Map className="h-4 w-4" />
                                        {locale === "ru" ? "По округам" : locale === "uzLatn" ? "Okruglar bo'yicha" : "Округлар бўйича"}
                                    </span>
                                </SelectItem>
                                <SelectItem value="authorities">
                                    <span className="flex items-center gap-2">
                                        <Icons.Building className="h-4 w-4" />
                                        {locale === "ru" ? "По органу контроля" : locale === "uzLatn" ? "Nazorat organi bo'yicha" : "Назорат органи бўйича"}
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    <Button variant="outline" onClick={handleResetFilters}>
                        {locale === "ru" ? "Сбросить" : locale === "uzLatn" ? "Tozalash" : "Тозалаш"}
                    </Button>
                    {handleExport && (
                        <Button variant="outline" onClick={handleExport}>
                            <Icons.Download className="mr-2 h-4 w-4" />
                            {locale === "ru" ? "Экспорт" : locale === "uzLatn" ? "Eksport" : "Экспорт"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
