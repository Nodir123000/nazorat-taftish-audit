import React from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import dayjs from "dayjs"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/hooks"
import { getLocalizedUnitName, getPersonnelName, getLocalizedDistrictName } from "@/lib/utils/localization"
import { militaryUnits } from "@/lib/data/military-data"

interface ViewPlanDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    plan: any | null
    locale: string
    militaryPersonnel?: any[]
    physicalPersons?: any[]
}

export function ViewPlanDialog({
    open,
    onOpenChange,
    plan,
    locale,
    militaryPersonnel = [],
    physicalPersons = [],
}: ViewPlanDialogProps) {
    const { t } = useTranslation()

    if (!plan) return null

    const unit = militaryUnits.find(u =>
        u.name === plan.controlObject ||
        u.name_uz_latn === plan.controlObject ||
        u.name_uz_cyrl === plan.controlObject
    )
    const districtDisplay = unit
        ? getLocalizedDistrictName(unit.district, locale as any)
        : getLocalizedDistrictName(plan.controlObjectSubtitle, locale as any)

    const getPersonName = (personId: any) => {
        if (!personId) return "—"
        const p = militaryPersonnel.find(mp => mp.id.toString() === personId.toString())
        if (!p) return personId
        const phys = physicalPersons.find(pp => pp.id === p.personId)
        return phys ? `${phys.lastName} ${phys.firstName} ${phys.middleName || ""}` : personId
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-187.5 p-0 overflow-hidden border-none shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <DialogHeader className="p-6 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                                <Icons.FileText className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold tracking-tight">
                                    {t("annual.schedule.details") || (locale === "ru" ? "Детали плана-графика" : "Reja-grafik tafsilotlari")}
                                </DialogTitle>
                                <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1 font-bold">
                                    {locale === "ru" ? "Паспорт ежегодного планирования" : "Yillik rejalashtirish pasporti"}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">№ ДОКУМЕНТА</span>
                            <Badge variant="outline" className="text-blue-400 border-blue-400/30 font-mono text-lg px-4 py-1.5 bg-blue-400/5">
                                {plan.planNumber || "—"}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 space-y-8 bg-background overflow-y-auto max-h-[70vh]">
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        <InfoRow 
                            icon={<Icons.Shield className="w-4 h-4 text-primary" />}
                            label={t("annual.table.unit")} 
                            value={getLocalizedUnitName(plan.controlObject, locale as any)}
                            subtitle={districtDisplay}
                            accent
                        />
                        <div className="space-y-6">
                            <InfoRow 
                                icon={<Icons.Calendar className="w-4 h-4 text-primary" />}
                                label={t("annual.table.year")} 
                                value={`${plan.year} ${locale === "ru" ? "год" : "yil"}`}
                            />
                            <InfoRow 
                                icon={<Icons.User className="w-4 h-4 text-primary" />}
                                label={t("annual.table.responsible")} 
                                value={getPersonName(plan.responsible)}
                            />
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Period Section */}
                    <div className="space-y-4">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                            <Icons.CalendarRange className="w-3 h-3" />
                            {t("annual.table.period")}
                        </Label>
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-muted-foreground/10">
                            <div className="flex-1 text-center">
                                <p className="text-[10px] text-muted-foreground uppercase mb-1">{locale === "ru" ? "Начало" : "Boshlanishi"}</p>
                                <p className="font-mono text-lg font-bold">
                                    {plan.periodCoveredStart ? dayjs(plan.periodCoveredStart).format("DD.MM.YYYY") : "—"}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-muted-foreground/20" />
                            <div className="flex-1 text-center">
                                <p className="text-[10px] text-muted-foreground uppercase mb-1">{locale === "ru" ? "Конец" : "Tugashi"}</p>
                                <p className="font-mono text-lg font-bold">
                                    {plan.periodCoveredEnd ? dayjs(plan.periodCoveredEnd).format("DD.MM.YYYY") : "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Subordinate Units */}
                    {plan.subordinateUnitsOnAllowance?.length > 0 && (
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                                <Icons.Layers className="w-3 h-3" />
                                {t("annual.approved.subordinateUnits")}
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {plan.subordinateUnitsOnAllowance.map((u: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border rounded-xl hover:shadow-sm transition-shadow">
                                        <Badge variant="outline" className="font-mono bg-white shrink-0 border-slate-200">
                                            {u.unitCode}
                                        </Badge>
                                        <span className="text-xs font-medium flex-1 line-clamp-1">
                                            {typeof u.unitName === 'object' 
                                                ? (u.unitName.ru || u.unitName.uz || u.unitName.uzk || JSON.stringify(u.unitName)) 
                                                : String(u.unitName || "—")}
                                        </span>
                                        <Badge 
                                            variant={u.allowanceType === "full" ? "default" : "secondary"} 
                                            className={cn("text-[9px] h-5 px-1.5 uppercase", u.allowanceType === "full" ? "bg-indigo-600" : "")}
                                        >
                                            {u.allowanceType === "full" ? (locale === "ru" ? "П" : "T") : (locale === "ru" ? "Ч" : "Q")}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Objects Stats Dashboard */}
                    <div className="space-y-4">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                            <Icons.Activity className="w-3 h-3" />
                            {locale === "ru" ? "Статистика объектов контроля" : "Nazorat ob'ektlari statistikasi"}
                        </Label>
                        <div className="grid grid-cols-3 gap-6">
                            <StatCard 
                                label={t("annual.note.objectsCount")} 
                                value={plan.objectsTotal || 0} 
                                icon={<Icons.Box className="w-4 h-4" />}
                                color="bg-slate-100 text-slate-700 border-slate-200"
                            />
                            <StatCard 
                                label={t("annual.note.fs")} 
                                value={plan.objectsFS || 0} 
                                icon={<Icons.ShieldCheck className="w-4 h-4" />}
                                color="bg-blue-50 text-blue-700 border-blue-100"
                            />
                            <StatCard 
                                label={t("annual.note.os")} 
                                value={plan.objectsOS || 0} 
                                icon={<Icons.Target className="w-4 h-4" />}
                                color="bg-orange-50 text-orange-700 border-orange-100"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-muted/30 border-t flex items-center justify-between sm:justify-between">
                    <Button variant="ghost" className="text-muted-foreground hover:text-slate-900" onClick={() => onOpenChange(false)}>
                        <Icons.X className="w-4 h-4 mr-2" />
                        {t("common.close")}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-slate-200" onClick={() => window.print()}>
                            <Icons.Printer className="w-4 h-4 mr-2" />
                            {locale === "ru" ? "Печать" : "Chop etish"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function InfoRow({ icon, label, value, subtitle, accent }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string; 
    subtitle?: string;
    accent?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2">
                <div className="shrink-0">{icon}</div>
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">{label}</Label>
            </div>
            <div className="pl-6">
                <p className={cn("font-semibold leading-tight", accent ? "text-lg text-slate-900" : "text-base text-slate-700")}>
                    {value || "—"}
                </p>
                {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
        </div>
    )
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
    return (
        <div className={cn("p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-md", color)}>
            <div className="shrink-0 opacity-60">{icon}</div>
            <div className="text-center">
                <p className="text-2xl font-black font-mono tracking-tighter">{value}</p>
                <p className="text-[10px] uppercase font-bold opacity-70 leading-none mt-1">{label}</p>
            </div>
        </div>
    )
}

