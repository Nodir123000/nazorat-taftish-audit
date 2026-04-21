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
import dayjs from "dayjs"
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
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {t("annual.schedule.details") || (locale === "ru" ? "Детали плана-графика" : "Reja-grafik tafsilotlari")}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-muted-foreground">{t("annual.table.year")}</Label>
                            <p className="font-medium text-lg">{plan.year}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">{t("annual.table.incomingNumber")}</Label>
                            <p className="font-medium font-mono">{plan.planNumber || "—"}</p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">{t("annual.table.unit")}</Label>
                        <p className="font-medium">{getLocalizedUnitName(plan.controlObject, locale as any)}</p>
                        <p className="text-sm text-muted-foreground">{districtDisplay}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-muted-foreground">{t("annual.table.period")}</Label>
                            <p className="font-medium">
                                {plan.periodCoveredStart ? dayjs(plan.periodCoveredStart).format("DD.MM.YYYY") : ""} — {plan.periodCoveredEnd ? dayjs(plan.periodCoveredEnd).format("DD.MM.YYYY") : ""}
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">{t("annual.table.responsible")}</Label>
                            <p className="font-medium">{getPersonName(plan.responsible)}</p>
                        </div>
                    </div>

                    {plan.subordinateUnitsOnAllowance?.length > 0 && (
                        <div className="border-t pt-4">
                            <Label className="text-muted-foreground mb-2 block">{t("annual.approved.subordinateUnits")}</Label>
                            <div className="space-y-2">
                                {plan.subordinateUnitsOnAllowance.map((u: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                        <Badge variant="outline" className="font-mono">{u.unitCode}</Badge>
                                        <span className="text-sm flex-1">
                                            {typeof u.unitName === 'object' 
                                                ? (u.unitName.ru || u.unitName.uz || u.unitName.uzk || JSON.stringify(u.unitName)) 
                                                : String(u.unitName || "—")}
                                        </span>
                                        <Badge variant={u.allowanceType === "full" ? "default" : "secondary"} className="text-xs">
                                            {u.allowanceType === "full" ? t("common.allowanceFull") : t("common.allowancePartial")}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 border-t pt-4">
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase">{t("annual.note.objectsCount")}</Label>
                            <p className="font-semibold text-lg">{plan.objectsTotal || 0}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase">{t("annual.note.fs")}</Label>
                            <p className="font-semibold text-lg text-blue-600">{plan.objectsFS || 0}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground uppercase">{t("annual.note.os")}</Label>
                            <p className="font-semibold text-lg text-orange-600">{plan.objectsOS || 0}</p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t("common.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
