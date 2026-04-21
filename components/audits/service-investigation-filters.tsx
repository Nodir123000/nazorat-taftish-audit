"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"

interface ServiceInvestigationFiltersProps {
    search: string
    setSearch: (value: string) => void
    statusFilter: string
    setStatusFilter: (value: string) => void
    onReset: () => void
}

export function ServiceInvestigationFilters({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    onReset
}: ServiceInvestigationFiltersProps) {
    const { t } = useTranslation()

    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                    <Icons.Filter className="w-4 h-4 text-primary" />
                    Параметры фильтрации
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[300px]">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder={t("audits.serviceInvestigations.searchPlaceholder")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-11 border-slate-200 focus:border-primary shadow-sm"
                        />
                    </div>
                    <select
                        className="flex h-11 w-56 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-focus focus:border-primary focus:ring-0"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">{t("audits.financial.filters.allStatuses")}</option>
                        <option value="Завершено" className="font-semibold text-emerald-600">Завершено</option>
                        <option value="В процессе" className="font-semibold text-amber-600">В процессе</option>
                        <option value="Просрочено" className="font-semibold text-rose-600">Просрочено</option>
                    </select>
                    <Button
                        variant="outline"
                        onClick={onReset}
                        className="gap-2 h-11 px-6 font-bold hover:bg-slate-50 hover:text-primary transition-all shadow-sm"
                    >
                        <Icons.RefreshCw className="w-4 h-4" />
                        {t("audits.financial.filters.reset")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
