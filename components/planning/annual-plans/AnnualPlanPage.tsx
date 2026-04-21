"use client"

import React, { useState } from "react"
import { useAnnualPlans } from "./hooks/useAnnualPlans"
import { StatsGrid } from "./components/StatsGrid"
import { FilterPanel } from "./components/FilterPanel"
import { ApprovedPlansTable } from "./components/ApprovedPlansTable"
import { ViewPlanDialog } from "./components/ViewPlanDialog"
import { CreatePlanDialog } from "./components/CreatePlanDialog"
import { ApprovedPlanDialog } from "./components/ApprovedPlanDialog"
import { useTranslation } from "@/lib/i18n/hooks"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getLocalizedDistrictName, getLocalizedAuthorityName } from "@/lib/utils/localization"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis
} from "@/components/ui/pagination"
import { militaryUnits } from "@/lib/data/military-data"

interface AnnualPlanPageProps {
    initialPlans?: any[]
}

export function AnnualPlanPage({ initialPlans = [] }: AnnualPlanPageProps) {
    const { t } = useTranslation()
    const { locale } = useI18n()

    const {
        plans,
        militaryPersonnel,
        physicalPersons,
        supplyDepartments,
        loading,
        isSubmitting,
        selectedPlan,
        setSelectedPlan,
        isEditing,
        setIsEditing,
        filters,
        setFilters,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        handleCreatePlan,
        handleUpdatePlan,
        handleDeletePlan,
    } = useAnnualPlans({ initialPlans, locale: locale as any })

    // UI state
    const [viewMode, setViewMode] = useState("list")
    const [createPlanOpen, setCreatePlanOpen] = useState(false)
    const [viewPlanOpen, setViewPlanOpen] = useState(false)
    const [approvedPlanDialogOpen, setApprovedPlanDialogOpen] = useState(false)

    // Local filtering (until we move to server-side)
    const filteredPlans = plans.filter((plan) => {
        const search = filters.search.toLowerCase()
        const matchesSearch =
            (plan.planNumber || "").toLowerCase().includes(search) ||
            (plan.controlObject || "").toLowerCase().includes(search) ||
            (plan.controlAuthority || "").toLowerCase().includes(search)

        const matchesYear = !filters.year || filters.year === "all" || plan.year.toString() === filters.year
        const matchesStatus = !filters.status || filters.status === "all" || plan.status.toString() === filters.status

        return matchesSearch && matchesYear && matchesStatus
    })

    // Sort plans based on viewMode
    const sortedPlans = [...filteredPlans].sort((a, b) => {
        if (viewMode === 'years') {
            return Number(b.year) - Number(a.year)
        }
        if (viewMode === 'regions') {
            const getRegionName = (plan: any) => {
                if (plan.unit?.ref_areas?.ref_regions) {
                    const reg = plan.unit.ref_areas.ref_regions
                    if (typeof reg.name === 'string') return reg.name
                    if (locale === "uzLatn") return reg.name?.uz || reg.name?.ru || ''
                    if (locale === "uzCyrl") return reg.name?.uzk || reg.name?.ru || ''
                    return reg.name?.ru || reg.name?.uz || ''
                }
                const unit = militaryUnits.find(u =>
                    u.name === plan.controlObject ||
                    u.name_uz_latn === plan.controlObject ||
                    u.name_uz_cyrl === plan.controlObject
                )
                if (unit && unit.location && unit.location.includes(",")) {
                    return unit.location.split(",")[1].trim()
                }
                return ''
            }
            return getRegionName(a).localeCompare(getRegionName(b))
        }
        if (viewMode === 'districts') {
            const getDistrictName = (plan: any) => {
                // 1. Из связанных данных (БД)
                if (plan.unit?.ref_military_districts) {
                    const dist = plan.unit.ref_military_districts
                    if (typeof dist.name === 'string') return dist.name
                    if (locale === "uzLatn") return dist.name?.uz || dist.name?.ru || ''
                    if (locale === "uzCyrl") return dist.name?.uzk || dist.name?.ru || ''
                    return dist.name?.ru || dist.name?.uz || ''
                }
                // 2. Статичный fallback
                const unit = militaryUnits.find(u =>
                    u.name === plan.controlObject ||
                    u.name_uz_latn === plan.controlObject ||
                    u.name_uz_cyrl === plan.controlObject
                )
                if (unit) return getLocalizedDistrictName(unit.district, locale as any) || ''
                return plan.controlObjectSubtitle || ''
            }
            return getDistrictName(a).localeCompare(getDistrictName(b))
        }
        if (viewMode === 'authorities') {
            const getAuthName = (plan: any) => {
                return getLocalizedAuthorityName(plan.controlAuthority, locale as any, supplyDepartments) || ''
            }
            return getAuthName(a).localeCompare(getAuthName(b))
        }
        return 0
    })

    const totalPages = Math.ceil(sortedPlans.length / itemsPerPage)
    const paginatedPlans = sortedPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleResetFilters = () => {
        setFilters({ search: "", year: "", status: "", period: "" })
        setCurrentPage(1)
    }

    const handleSavePlan = async (data: any) => {
        let result
        if (isEditing && selectedPlan) {
            result = await handleUpdatePlan(selectedPlan.id, data)
        } else {
            result = await handleCreatePlan(data)
        }

        if (result.success) {
            setCreatePlanOpen(false)
            setApprovedPlanDialogOpen(false)
        }
    }





    const maxPlanId = plans.reduce((max, plan) => {
        const id = typeof plan.planId === 'number' ? plan.planId : 0
        return id > max ? id : max
    }, 0)
    const nextPlanNumber = (maxPlanId + 1).toString()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("annual.title")}</h1>
                    <p className="text-muted-foreground">{t("annual.description")}</p>
                </div>
                <Button onClick={() => {
                    setSelectedPlan(null);
                    setIsEditing(false);
                    setApprovedPlanDialogOpen(true);
                }}>
                    <Icons.Plus className="mr-2 h-4 w-4" />
                    {t("common.add")}
                </Button>
            </div>



            <StatsGrid
                plans={plans}
                locale={locale}
                supplyDepartments={supplyDepartments}
                onStatClick={(status) => {
                    setFilters({ ...filters, status: status || "all" });
                    setCurrentPage(1);
                }}
                activeStatus={filters.status || "all"}
            />

            <FilterPanel
                filters={filters}
                setFilters={setFilters}
                locale={locale as any}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                handleResetFilters={handleResetFilters}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Card>
                <CardHeader>
                    <CardTitle>
                        {t("annual.registry.title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ApprovedPlansTable
                        plans={sortedPlans}
                        allPlans={sortedPlans}
                        locale={locale as any}
                        supplyDepartments={supplyDepartments}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        viewMode={viewMode}
                        onView={(plan) => { setSelectedPlan(plan); setViewPlanOpen(true); }}
                        onEdit={(plan) => { setSelectedPlan(plan); setIsEditing(true); setApprovedPlanDialogOpen(true); }}
                        onDelete={(plan) => {
                            const id = plan.id || plan.planId;
                            if (id) handleDeletePlan(id);
                        }}
                    />
                </CardContent>
            </Card>

            <ViewPlanDialog
                open={viewPlanOpen}
                onOpenChange={setViewPlanOpen}
                plan={selectedPlan}
                locale={locale}
                militaryPersonnel={militaryPersonnel}
                physicalPersons={physicalPersons}
            />

            <CreatePlanDialog
                open={createPlanOpen}
                onOpenChange={setCreatePlanOpen}
                onSave={handleSavePlan}
                initialData={selectedPlan}
                isEditing={isEditing}
                locale={locale}
                militaryPersonnel={militaryPersonnel}
                physicalPersons={physicalPersons}
                supplyDepartments={supplyDepartments}
                isSubmitting={isSubmitting}
            />

            <ApprovedPlanDialog
                open={approvedPlanDialogOpen}
                onOpenChange={setApprovedPlanDialogOpen}
                onSave={handleSavePlan}
                initialData={selectedPlan}
                isEditing={isEditing}
                locale={locale as any}
                supplyDepartments={supplyDepartments}
                isSubmitting={isSubmitting}
                suggestedPlanNumber={nextPlanNumber}
            />
        </div>
    )
}
