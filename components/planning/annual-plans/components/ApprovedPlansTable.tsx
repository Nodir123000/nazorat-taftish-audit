"use client"

import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslation } from "@/lib/i18n/hooks"
import {
    getLocalizedUnitName,
    getLocalizedDistrictName,
    getLocalizedAuthorityName,
    getLocalizedDirectionName,
    getStatusLabel,
    getInspectionTypeLabel,
    toSafeString,
    Locale
} from "@/lib/utils/localization"
import { militaryUnits } from "@/lib/data/military-data"

interface ApprovedPlansTableProps {
    plans: any[]
    allPlans?: any[]
    locale: Locale
    supplyDepartments: any[]
    currentPage: number
    itemsPerPage: number
    onView: (plan: any) => void
    onEdit: (plan: any) => void
    onDelete: (plan: any) => void
    viewMode?: string
}

function getLocalizedName(obj: any, locale: Locale): string {
    if (!obj) return ""
    const nameData = typeof obj.name === 'object' ? obj.name : obj
    return toSafeString(nameData, locale)
}

function getQuarterLabel(dateStr: string | Date, locale: Locale) {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    const q = Math.ceil((d.getMonth() + 1) / 3)
    const y = d.getFullYear()
    const roman = ["I", "II", "III", "IV"][q - 1]

    const quarterWord = locale === "ru" ? "квартал" :
        locale === "uzCyrl" ? "чорак" : "chorak"
    return `${roman}-${quarterWord} ${y}`
}



function getAreaRegionData(plan: any) {
    if (plan.unit?.ref_areas) {
        return { 
            area: plan.unit.ref_areas, 
            region: plan.unit.ref_areas.ref_regions 
        }
    }
    if (plan.unit?.ref_military_districts?.ref_areas) {
        return { 
            area: plan.unit.ref_military_districts.ref_areas, 
            region: plan.unit.ref_military_districts.ref_areas.ref_regions 
        }
    }
    return null
}

function getLocationDisplay(plan: any, locale: Locale): string {
    // 1. Try relational data from DB (Direct or via District)
    const data = getAreaRegionData(plan)
    if (data) {
        const areaName = getLocalizedName(data.area, locale)
        const regionName = data.region ? getLocalizedName(data.region, locale) : ""
        return regionName ? `${regionName}, ${areaName}` : areaName
    }

    // 2. Fallback to static data (Location instead of District)
    const unit = militaryUnits.find(u =>
        u.name === plan.controlObject ||
        u.name_uz_latn === plan.controlObject ||
        u.name_uz_cyrl === plan.controlObject
    )
    
    if (unit) {
        const location = locale === "uzLatn" ? unit.location_uz_latn : 
                        locale === "uzCyrl" ? unit.location_uz_cyrl : 
                        unit.location;
        if (location) return location;
    }

    // 3. Last fallback (Military District Name)
    if (plan.unit?.ref_military_districts) {
        return getLocalizedName(plan.unit.ref_military_districts, locale)
    }

    return plan.controlObjectSubtitle || "—"
}

function getRegionDisplay(plan: any, locale: Locale): string {
    const data = getAreaRegionData(plan)
    if (data?.region) {
        return getLocalizedName(data.region, locale)
    }

    const unit = militaryUnits.find(u =>
        u.name === plan.controlObject ||
        u.name_uz_latn === plan.controlObject ||
        u.name_uz_cyrl === plan.controlObject
    )
    if (unit && unit.location && unit.location.includes(",")) {
        return unit.location.split(",")[1].trim()
    }
    return ""
}

function getDistrictDisplay(plan: any, locale: Locale): string {
    // This is specifically for GRPS (Military District)
    if (plan.unit?.ref_military_districts) {
        return getLocalizedName(plan.unit.ref_military_districts, locale)
    }
    
    if (plan.controlObjectSubtitle) {
        return getLocalizedDistrictName(plan.controlObjectSubtitle, locale)
    }
    
    const unit = militaryUnits.find(u =>
        u.name === plan.controlObject ||
        u.name_uz_latn === plan.controlObject ||
        u.name_uz_cyrl === plan.controlObject
    )
    return unit ? getLocalizedDistrictName(unit.district, locale) : "—"
}

function renderLocationCell(plan: any, locale: Locale) {
    const data = getAreaRegionData(plan)
    
    if (data) {
        const areaName = getLocalizedName(data.area, locale)
        const regionName = data.region ? getLocalizedName(data.region, locale) : ""

        return (
            <div className="flex flex-col">
                <span className="font-medium text-sm">{regionName || "—"}</span>
                {areaName && (
                    <span className="text-[11px] text-muted-foreground leading-none mt-1">
                        {areaName}
                    </span>
                )}
            </div>
        )
    }
    
    const display = getLocationDisplay(plan, locale)
    
    // If it's a "City, Region" string from static data, format it
    if (display.includes(",")) {
        const parts = display.split(",").map(p => p.trim())
        if (parts.length >= 2) {
            // Usually static data is "City, Region", so we flip it to match "Region top, City bottom"
            const region = parts[1]
            const area = parts[0]
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{region}</span>
                    <span className="text-[11px] text-muted-foreground leading-none mt-1">{area}</span>
                </div>
            )
        }
    }

    return <span className="text-sm">{display}</span>
}

export function ApprovedPlansTable({
    plans,
    allPlans = [],
    locale,
    supplyDepartments,
    currentPage,
    itemsPerPage,
    onView,
    onEdit,
    onDelete,
    viewMode = 'list',
}: ApprovedPlansTableProps) {
    const { t } = useTranslation()
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

    const groupingPlans = allPlans.length > 0 ? allPlans : plans

    // Reset expanded groups when view mode changes
    useEffect(() => {
        setExpandedGroups({})
    }, [viewMode])

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }))
    }
    return (
        <div className="rounded-md border">
            <div className="min-h-[400px]">
                <Table className="relative border-collapse">
                    <TableHeader className="sticky top-0 bg-background z-20 shadow-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[50px] bg-background">ID</TableHead>
                            <TableHead className="bg-background">{t("annual.approved.controlObject")}</TableHead>
                            <TableHead className="bg-background">{t("common.location") || (locale === "ru" ? "Место дислокации" : "Joylashuvi")}</TableHead>
                            <TableHead className="bg-background">{t("annual.approved.controlAuthority")}</TableHead>
                            <TableHead className="bg-background">{t("annual.approved.inspectionDirection")}</TableHead>
                            <TableHead className="bg-background">{t("annual.approved.inspectionType")}</TableHead>
                            <TableHead className="bg-background whitespace-pre-line min-w-[120px]">{t("annual.approved.periodCovered")}</TableHead>
                            <TableHead className="bg-background whitespace-pre-line min-w-[120px]">{t("annual.approved.periodConducted")}</TableHead>
                            <TableHead className="bg-background">{t("annual.approved.subordinateUnits")}</TableHead>
                            <TableHead className="bg-background">{t("annual.approved.status")}</TableHead>
                            <TableHead className="text-right bg-background">{t("annual.table.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.map((plan, index) => {
                            const districtDisplay = getDistrictDisplay(plan, locale)
                            const currentGroup = viewMode === 'years' ? String(plan.year) :
                                viewMode === 'regions' ? getRegionDisplay(plan, locale) :
                                    viewMode === 'districts' ? districtDisplay :
                                        viewMode === 'authorities' ? getLocalizedAuthorityName(plan.controlAuthority, locale, supplyDepartments) :
                                            'default'

                            const prevPlan = index > 0 ? plans[index - 1] : null
                            const prevGroup = prevPlan ? (
                                viewMode === 'years' ? String(prevPlan.year) :
                                    viewMode === 'regions' ? getRegionDisplay(prevPlan, locale) :
                                        viewMode === 'districts' ? getDistrictDisplay(prevPlan, locale) :
                                            viewMode === 'authorities' ? getLocalizedAuthorityName(prevPlan.controlAuthority, locale, supplyDepartments) :
                                                'default'
                            ) : null

                            const showGroupHeader = viewMode !== 'list' && currentGroup !== prevGroup
                            const isGroupExpanded = expandedGroups[currentGroup] ?? false

                            return (
                                <React.Fragment key={plan.id || plan.planId || `plan-${index}`}>
                                    {showGroupHeader && (
                                        <TableRow className="bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors" onClick={() => toggleGroup(currentGroup)}>
                                            <TableCell colSpan={10} className="font-semibold p-2.5">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "p-1 rounded-sm",
                                                        isGroupExpanded ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground"
                                                    )}>
                                                        {isGroupExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                                    </div>
                                                    <span className="text-sm">
                                                        {currentGroup || (
                                                            viewMode === 'regions' 
                                                                ? (locale === 'ru' ? 'Без области' : locale === 'uzLatn' ? 'Viloyatsiz' : 'Вилоятсиз')
                                                                : viewMode === 'districts' 
                                                                    ? (locale === 'ru' ? 'Без локации' : 'Joylashuvsiz') 
                                                                    : 'Unknown'
                                                        )}
                                                    </span>
                                                    <Badge variant="outline" className="ml-2 font-normal">
                                                        {groupingPlans.filter(p => {
                                                            if (viewMode === 'years') return String(p.year) === currentGroup
                                                            if (viewMode === 'regions') return getRegionDisplay(p, locale) === currentGroup
                                                            if (viewMode === 'districts') return getDistrictDisplay(p, locale) === currentGroup
                                                            if (viewMode === 'authorities') return getLocalizedAuthorityName(p.controlAuthority, locale, supplyDepartments) === currentGroup
                                                            return false
                                                        }).length}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {(viewMode === 'list' || isGroupExpanded) && (
                                        <TableRow>
                                            <TableCell className="font-mono text-xs text-muted-foreground/70">
                                                {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(5, '0')}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                                                        {(() => {
                                                            if (plan.unit?.unit_code) {
                                                                return `В/Ч ${plan.unit.unit_code.toString().padStart(5, "0")}`;
                                                            }
                                                            return plan.unit ? getLocalizedName(plan.unit, locale) : toSafeString(plan.controlObject, locale);
                                                        })()}
                                                    </span>
                                                    {(() => {
                                                        if (plan.unit?.ref_military_districts) {
                                                            const dist = plan.unit.ref_military_districts
                                                            const fullName = getLocalizedName(dist, locale)
                                                            const shortName = dist.short_name
                                                                ? getLocalizedName({ ...dist, name: dist.short_name }, locale)
                                                                : fullName
                                                            return (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="text-[10px] text-muted-foreground cursor-help truncate max-w-[200px] leading-tight">
                                                                            {shortName}
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        {fullName}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )
                                                        }
                                                        // Legacy fallback
                                                        const unit = militaryUnits.find(u =>
                                                            u.name === plan.controlObject ||
                                                            u.name_uz_latn === plan.controlObject ||
                                                            u.name_uz_cyrl === plan.controlObject
                                                        )
                                                        if (unit?.district) {
                                                            return (
                                                                <div className="text-[10px] text-muted-foreground leading-tight">
                                                                    {getLocalizedDistrictName(unit.district, locale)}
                                                                </div>
                                                            )
                                                        }
                                                        return null
                                                    })()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {renderLocationCell(plan, locale)}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-help underline decoration-dotted text-xs">
                                                            {getLocalizedAuthorityName(plan.controlAuthority, locale, supplyDepartments, 'short')}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {getLocalizedAuthorityName(plan.controlAuthority, locale, supplyDepartments, 'full')}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs">
                                                    {getLocalizedDirectionName(plan.inspectionDirection, locale)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="whitespace-nowrap py-0.5 font-normal text-[10px]">
                                                    {getInspectionTypeLabel(plan.inspectionType, locale)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-[10px] whitespace-nowrap flex items-center text-muted-foreground">
                                                    <span>{plan.periodCoveredStart ? new Date(plan.periodCoveredStart).toLocaleDateString() : ""}</span>
                                                    <span className="mx-0.5">-</span>
                                                    <span>{plan.periodCoveredEnd ? new Date(plan.periodCoveredEnd).toLocaleDateString() : ""}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="whitespace-nowrap text-xs text-muted-foreground text-center">
                                                    {plan.periodCoveredStart
                                                        ? getQuarterLabel(plan.periodCoveredStart, locale)
                                                        : plan.periodConducted}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {(() => {
                                                    const units = plan.subordinateUnitsOnAllowance
                                                    if (Array.isArray(units) && units.length > 0) {
                                                        return (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Badge variant="secondary" className="cursor-help px-1 py-0 h-5">
                                                                        {units.length}
                                                                    </Badge>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <div className="flex flex-col gap-1">
                                                                        {units.map((u: any, i: number) => {
                                                                            const name = u.unitName || u.name
                                                                            const displayName = typeof name === 'object' 
                                                                                ? (name.ru || name.uz || name.uzk || JSON.stringify(name)) 
                                                                                : String(name || "—")
                                                                            return (
                                                                                <span key={i} className="whitespace-nowrap">
                                                                                    {displayName}
                                                                                </span>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )
                                                    }
                                                    return <span className="text-muted-foreground text-xs">—</span>
                                                })()}
                                            </TableCell>
                                            <TableCell>
                                                {(() => {
                                                    const statusId = plan.status?.toString();
                                                    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
                                                    let className = "";

                                                    if (statusId === "101" || statusId === "approved" || statusId === "draft") {
                                                        className = "bg-green-500/10 text-green-600 border-green-200";
                                                    } else if (statusId === "102" || statusId === "in_progress") {
                                                        className = "bg-indigo-500/10 text-indigo-600 border-indigo-200";
                                                    } else if (statusId === "103") {
                                                        className = "bg-slate-500/10 text-slate-600 border-slate-200";
                                                    } else if (statusId === "104" || statusId === "completed") {
                                                        className = "bg-teal-500/10 text-teal-600 border-teal-200";
                                                    } else if (statusId === "105") {
                                                        variant = "destructive";
                                                    } else if (statusId === "106") {
                                                        className = "bg-amber-500/10 text-amber-600 border-amber-200";
                                                    }

                                                    return (
                                                        <Badge variant={variant} className={cn("whitespace-nowrap font-medium text-[10px]", className)}>
                                                            {getStatusLabel(plan.status, locale as any)}
                                                        </Badge>
                                                    );
                                                })()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {(() => {
                                                        const isLocked = plan.orders && plan.orders.length > 0;
                                                        const editButton = (
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8" 
                                                                onClick={() => onEdit(plan)}
                                                                disabled={isLocked}
                                                            >
                                                                <Icons.Edit className={cn("h-4 w-4", isLocked && "opacity-50")} />
                                                            </Button>
                                                        );

                                                        const deleteButton = (
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-destructive" 
                                                                onClick={() => onDelete(plan)}
                                                                disabled={isLocked}
                                                            >
                                                                <Icons.Trash className={cn("h-4 w-4", isLocked && "opacity-50")} />
                                                            </Button>
                                                        );

                                                        if (isLocked) {
                                                            return (
                                                                <div className="flex items-center gap-1">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div className="cursor-not-allowed">
                                                                                {editButton}
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            {t("annual.locked.description")}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div className="cursor-not-allowed">
                                                                                {deleteButton}
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            {t("annual.locked.description")}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                    <Icons.Lock className="h-3 w-3 text-muted-foreground ml-1" />
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <>
                                                                {editButton}
                                                                {deleteButton}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </TableBody>
                </Table >
            </div >
        </div >
    )
}
