"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"

interface LawEnforcementFiltersProps {
    search: string
    setSearch: (value: string) => void
    statusFilter: string
    setStatusFilter: (value: string) => void
    onReset: () => void
}

export function LawEnforcementFilters({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    onReset
}: LawEnforcementFiltersProps) {
    const { t } = useTranslation()

    return (
        <Card className="shadow-lg border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest">
                    <Icons.Filter className="w-4 h-4 text-primary" />
                    Параметры фильтрации дел
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[300px]">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                        <Input
                            placeholder={t("audits.lawEnforcement.searchPlaceholder")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-12 border-slate-200 focus:border-primary shadow-sm bg-slate-50/30 rounded-xl font-medium"
                        />
                    </div>
                    <select
                        className="flex h-12 w-64 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none bg-no-repeat bg-[right_1rem_center]"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundSize: '1em' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Все статусы дел</option>
                        <option value="Возбуждено УД" className="font-bold text-rose-600">Возбуждено УД</option>
                        <option value="На рассмотрении" className="font-bold text-blue-600">На рассмотрении</option>
                        <option value="Отказано" className="font-bold text-slate-500">Отказано</option>
                        <option value="Возвращено на доработку" className="font-bold text-amber-600">Возвращено</option>
                    </select>
                    <Button
                        variant="outline"
                        onClick={onReset}
                        className="gap-2 h-12 px-8 font-black rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary transition-all shadow-sm group"
                    >
                        <Icons.RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        Сбросить
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
