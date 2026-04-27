"use client"

import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ChevronDown, ChevronRight, MoreVertical, Copy, Eye, FileEdit, Trash2, Calendar, MapPin, Building2, Tag, ShieldAlert, CircleDot, FileText } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n/hooks"
import dayjs from "dayjs"
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
                    <TableHeader className="sticky top-0 bg-background/80 backdrop-blur-md z-20 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[50px] bg-transparent font-semibold text-foreground/80">ID</TableHead>
                            <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-[250px]">{t("annual.approved.controlObject")} {locale === "ru" ? "и Дислокация" : "va Joylashuv"}</TableHead>
                            <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-[200px]">{locale === "ru" ? "Параметры проверки" : "Tekshiruv parametrlari"}</TableHead>
                            <TableHead className="bg-transparent font-semibold text-foreground/80 min-w-[180px]">{locale === "ru" ? "Сроки (Таймлайн)" : "Muddatlar"}</TableHead>
                            <TableHead className="bg-transparent font-semibold text-foreground/80">{t("annual.approved.status")}</TableHead>
                            <TableHead className="text-right bg-transparent font-semibold text-foreground/80">{t("annual.table.actions")}</TableHead>
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
                                        <TableRow className="bg-slate-100/60 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200 border-b shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] group/header" onClick={() => toggleGroup(currentGroup)}>
                                            <TableCell colSpan={6} className="font-semibold p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "p-1 rounded-sm transition-colors",
                                                            isGroupExpanded ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground group-hover/header:bg-primary/5 group-hover/header:text-primary/70"
                                                        )}>
                                                            {isGroupExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                        </div>
                                                        <span className="text-sm font-semibold tracking-tight text-foreground/90">
                                                            {currentGroup || (
                                                                viewMode === 'regions' 
                                                                    ? (locale === 'ru' ? 'Без области' : locale === 'uzLatn' ? 'Viloyatsiz' : 'Вилоятсиз')
                                                                    : viewMode === 'districts' 
                                                                        ? (locale === 'ru' ? 'Без локации' : 'Joylashuvsiz') 
                                                                        : 'Unknown'
                                                            )}
                                                        </span>
                                                        <Badge variant="secondary" className="ml-2 font-medium bg-white/50 dark:bg-black/20 border-slate-200 dark:border-slate-700 shadow-sm">
                                                            {(() => {
                                                                const groupPlans = groupingPlans.filter(p => {
                                                                    if (viewMode === 'years') return String(p.year) === currentGroup
                                                                    if (viewMode === 'regions') return getRegionDisplay(p, locale) === currentGroup
                                                                    if (viewMode === 'districts') return getDistrictDisplay(p, locale) === currentGroup
                                                                    if (viewMode === 'authorities') return getLocalizedAuthorityName(p.controlAuthority, locale, supplyDepartments) === currentGroup
                                                                    return false
                                                                });
                                                                const total = groupPlans.length;
                                                                const completed = groupPlans.filter(p => p.status?.toString() === '104' || p.status === 'completed').length;
                                                                
                                                                return (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[11px] text-muted-foreground">{locale === 'ru' ? 'Планы:' : 'Rejalar:'}</span>
                                                                        <span className="text-sm">{total}</span>
                                                                        {total > 0 && (
                                                                            <span className="ml-1 text-[10px] text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded-sm flex items-center">
                                                                                {Math.round((completed / total) * 100)}% {locale === 'ru' ? 'выполнено' : 'bajarildi'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })()}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {(viewMode === 'list' || isGroupExpanded) && (
                                        <TableRow className="group transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 hover:shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                            <TableCell className="font-mono text-xs text-muted-foreground/70">
                                                {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(5, '0')}
                                            </TableCell>
                                            <TableCell className="font-medium min-w-[250px]">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-start gap-2 text-sm font-semibold">
                                                        <Building2 className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
                                                        <span className="whitespace-normal leading-tight text-foreground/90">
                                                            {(() => {
                                                                if (plan.unit?.unit_code) {
                                                                    return `В/Ч ${plan.unit.unit_code.toString().padStart(5, "0")}`;
                                                                }
                                                                return plan.unit ? getLocalizedName(plan.unit, locale) : toSafeString(plan.controlObject, locale);
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 ml-6">
                                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                                                        <div className="text-muted-foreground/90 text-xs">
                                                            {renderLocationCell(plan, locale)}
                                                        </div>
                                                    </div>
                                                    {(() => {
                                                        const units = plan.subordinateUnitsOnAllowance
                                                        if (Array.isArray(units) && units.length > 0) {
                                                            return (
                                                                <div className="ml-6 mt-1">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Badge variant="secondary" className="cursor-help px-1.5 py-0 h-5 text-[10px] bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                                                                                + {units.length} {locale === 'ru' ? 'частей на довольствии' : 'qismlar taʼminotda'}
                                                                            </Badge>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <div className="flex flex-col gap-1">
                                                                                {units.map((u: any, i: number) => {
                                                                                    const name = u.unitName || u.name
                                                                                    return <span key={i} className="text-xs">{toSafeString(name, locale)}</span>
                                                                                })}
                                                                            </div>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            )
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="min-w-[200px] align-top pt-3">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-start gap-1.5">
                                                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500/80 shrink-0 mt-0.5" />
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="text-xs font-medium cursor-help underline decoration-dotted decoration-muted-foreground/50 leading-tight">
                                                                    {getLocalizedAuthorityName(plan.controlAuthority, locale, supplyDepartments, 'short')}
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {getLocalizedAuthorityName(plan.controlAuthority, locale, supplyDepartments, 'full')}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <div className="flex items-start gap-1.5">
                                                        <CircleDot className="w-3.5 h-3.5 text-blue-500/80 shrink-0 mt-0.5" />
                                                        <span className="text-[11px] text-muted-foreground leading-tight max-w-[220px]">
                                                            {getLocalizedDirectionName(plan.inspectionDirection, locale)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-0.5 ml-5">
                                                        <Badge variant="outline" className="py-0 h-4.5 px-1.5 text-[10px] font-medium border-primary/20 text-primary/80 bg-primary/5">
                                                            <Tag className="w-2.5 h-2.5 mr-1" />
                                                            {getInspectionTypeLabel(plan.inspectionType, locale)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="min-w-[180px] align-top pt-3">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-start gap-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                                                                {locale === 'ru' ? 'Предв. контроль' : 'Dastlabki nazorat'}
                                                            </span>
                                                            <span className="text-xs font-mono bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded border">
                                                                {plan.periodCoveredStart ? new Date(plan.periodCoveredStart).toLocaleDateString() : "—"} 
                                                                <span className="text-muted-foreground mx-1 text-[10px]">-</span>
                                                                {plan.periodCoveredEnd ? new Date(plan.periodCoveredEnd).toLocaleDateString() : "—"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <FileText className="w-4 h-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                                                                {locale === 'ru' ? 'Период проведения' : 'Otkazish davri'}
                                                            </span>
                                                            <span className="text-[11px] font-medium leading-tight">
                                                                {plan.periodCoveredStart
                                                                    ? getQuarterLabel(plan.periodCoveredStart, locale)
                                                                    : toSafeString(plan.periodConducted, locale)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top pt-3">
                                                {(() => {
                                                    const statusId = plan.status?.toString();
                                                    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
                                                    let className = "";

                                                    if (statusId === "101" || statusId === "approved" || statusId === "draft") {
                                                        className = "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400";
                                                    } else if (statusId === "102" || statusId === "in_progress") {
                                                        className = "bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:text-indigo-400";
                                                    } else if (statusId === "103") {
                                                        className = "bg-slate-500/10 text-slate-700 border-slate-200 dark:text-slate-400";
                                                    } else if (statusId === "104" || statusId === "completed") {
                                                        className = "bg-teal-500/10 text-teal-700 border-teal-200 dark:text-teal-400";
                                                    } else if (statusId === "105") {
                                                        variant = "destructive";
                                                    } else if (statusId === "106") {
                                                        className = "bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-400";
                                                    }

                                                    return (
                                                        <Badge variant={variant} className={cn("whitespace-nowrap font-medium text-[11px] px-2.5 py-0.5 shadow-sm transition-all hover:shadow-md", className)}>
                                                            {getStatusLabel(plan.status, locale as any)}
                                                        </Badge>
                                                    );
                                                })()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(() => {
                                                    const isLocked = plan.orders && plan.orders.length > 0;
                                                    
                                                    return (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/80">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <Icons.MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-[180px] p-1.5 shadow-xl border-border/50 backdrop-blur-sm bg-background/95">
                                                                <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground px-2 py-1.5">
                                                                    {locale === "ru" ? "Управление" : "Boshqarish"}
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuSeparator className="opacity-50" />
                                                                <DropdownMenuItem 
                                                                    className="gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer rounded-md transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onEdit(plan);
                                                                    }}
                                                                    disabled={isLocked}
                                                                >
                                                                    <Icons.Edit className="h-4 w-4" />
                                                                    <span>{locale === "ru" ? "Редактировать" : "Tahrirlash"}</span>
                                                                    {isLocked && <Icons.Lock className="ml-auto h-3 w-3 opacity-50" />}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer rounded-md transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Logic for duplication if available, else just onEdit with modified data
                                                                        const { id, ...duplicateData } = plan;
                                                                        onEdit(duplicateData);
                                                                    }}
                                                                >
                                                                    <Icons.Copy className="h-4 w-4" />
                                                                    <span>{locale === "ru" ? "Дублировать" : "Nusxalash"}</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="opacity-50" />
                                                                <DropdownMenuItem 
                                                                    className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-md transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onDelete(plan);
                                                                    }}
                                                                    disabled={isLocked}
                                                                >
                                                                    <Icons.Trash className="h-4 w-4" />
                                                                    <span>{locale === "ru" ? "Удалить" : "O'chirish"}</span>
                                                                    {isLocked && <Icons.Lock className="ml-auto h-3 w-3 opacity-50" />}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    );
                                                })()}
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
