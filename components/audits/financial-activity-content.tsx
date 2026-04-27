"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/i18n/hooks"
import { Icons } from "@/components/icons"
import { FinancialAuditStats } from "./financial-audit-stats"
import { FinancialAuditRegistry } from "./financial-audit-registry"
import { FinancialAuditDialogs } from "./financial-audit-dialogs"
import {
    useFinancialAudits,
    useCreateFinancialAudit,
    useUpdateFinancialAudit,
} from "@/lib/hooks/use-financial-audits";
import {
    useAuditViolations,
    useCreateAuditViolation,
    useUpdateAuditViolation,
    useDeleteAuditViolation,
} from "@/lib/hooks/use-violations";
import {
    useCreateServiceInvestigation,
    useUpdateServiceInvestigation,
} from "@/lib/hooks/use-service-investigations";
import {
    useCreateLawEnforcementCase,
    useUpdateLawEnforcementCase,
} from "@/lib/hooks/use-law-enforcement";
import { useAllReferences } from "@/lib/hooks/use-references";
import { FinancialAuditDTO, AuditViolationDTO } from "@/lib/types/audits.dto"
import { useToast } from "@/lib/hooks/use-toast"
import { ServiceInvestigationDialogs } from "./service-investigation-dialogs"
import { LawEnforcementDialogs } from "./law-enforcement-dialogs"

export function FinancialActivityContent() {
    const { t } = useTranslation()
    const toast = useToast()

    // Data Fetching
    const { data: audits = [], isLoading: auditsLoading } = useFinancialAudits()
    const { data: violations = [], isLoading: violationsLoading } = useAuditViolations()
    const { data: allRefs } = useAllReferences()

    // Mutations
    const createAudit = useCreateFinancialAudit()
    const updateAudit = useUpdateFinancialAudit()
    const createViolation = useCreateAuditViolation()
    const updateViolation = useUpdateAuditViolation()
    const deleteViolation = useDeleteAuditViolation()
    const createInvestigation = useCreateServiceInvestigation()
    const updateInvestigation = useUpdateServiceInvestigation()
    const createLawEnforcement = useCreateLawEnforcementCase()
    const updateLawEnforcement = useUpdateLawEnforcementCase()

    // Dialog States
    const [auditDialogOpen, setAuditDialogOpen] = useState(false)
    const [violationDialogOpen, setViolationDialogOpen] = useState(false)
    const [investigationDialogOpen, setInvestigationDialogOpen] = useState(false)
    const [lawEnforcementDialogOpen, setLawEnforcementDialogOpen] = useState(false)

    // Selection States
    const [selectedAudit, setSelectedAudit] = useState<FinancialAuditDTO | null>(null)
    const [selectedViolation, setSelectedViolation] = useState<AuditViolationDTO | null>(null)
    const [selectedInvestigation, setSelectedInvestigation] = useState<any | null>(null)
    const [selectedLawCase, setSelectedLawCase] = useState<any | null>(null)
    const [escalationViolation, setEscalationViolation] = useState<AuditViolationDTO | null>(null)

    // Actions
    const handleAddAudit = () => {
        setSelectedAudit(null)
        setAuditDialogOpen(true)
    }

    const handleEditAudit = (audit: FinancialAuditDTO) => {
        setSelectedAudit(audit)
        setAuditDialogOpen(true)
    }

    const handleSaveAudit = (data: any) => {
        if (selectedAudit) {
            updateAudit.mutate({ id: selectedAudit.id, data }, {
                onSuccess: () => {
                    toast.success("Данные аудита обновлены")
                    setAuditDialogOpen(false)
                }
            })
        } else {
            createAudit.mutate(data, {
                onSuccess: () => {
                    toast.success("Новый аудит добавлен в реестр")
                    setAuditDialogOpen(false)
                }
            })
        }
    }

    const handleAddViolation = (audit: FinancialAuditDTO) => {
        setSelectedAudit(audit)
        setSelectedViolation(null)
        setViolationDialogOpen(true)
    }

    const handleEditViolation = (violation: AuditViolationDTO) => {
        setSelectedViolation(violation)
        setViolationDialogOpen(true)
    }

    const handleSaveViolation = (data: any) => {
        if (selectedViolation) {
            updateViolation.mutate({ id: selectedViolation.id, data }, {
                onSuccess: () => {
                    toast.success("Нарушение обновлено")
                    setViolationDialogOpen(false)
                }
            })
        } else {
            createViolation.mutate({ ...data, auditId: selectedAudit?.id }, {
                onSuccess: () => {
                    toast.success("Нарушение добавлено")
                    setViolationDialogOpen(false)
                }
            })
        }
    }

    const handleDeleteViolation = (id: number) => {
        if (confirm("Вы уверены, что хотите удалить это нарушение?")) {
            deleteViolation.mutate(id, {
                onSuccess: () => toast.success("Нарушение удалено")
            })
        }
    }

    const handleSaveInvestigation = (data: any) => {
        if (selectedInvestigation) {
            updateInvestigation.mutate({ id: selectedInvestigation.id, data }, {
                onSuccess: () => {
                    toast.success("Данные расследования обновлены")
                    setInvestigationDialogOpen(false)
                }
            })
        } else {
            createInvestigation.mutate(data, {
                onSuccess: () => {
                    toast.success("Служебное расследование начато")
                    setInvestigationDialogOpen(false)
                }
            })
        }
    }

    const handleSaveLawEnforcement = (data: any) => {
        if (selectedLawCase) {
            updateLawEnforcement.mutate({ id: selectedLawCase.id, data }, {
                onSuccess: () => {
                    toast.success("Данные дела обновлены")
                    setLawEnforcementDialogOpen(false)
                }
            })
        } else {
            createLawEnforcement.mutate(data, {
                onSuccess: () => {
                    toast.success("Материалы переданы в ОВД")
                    setLawEnforcementDialogOpen(false)
                }
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Icons.Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{t("audits.financial.title")}</h1>
                    <p className="text-muted-foreground">{t("audits.financial.description")}</p>
                </div>
            </div>

            <FinancialAuditStats audits={audits} violations={violations} isLoading={auditsLoading || violationsLoading} />

            <FinancialAuditRegistry
                audits={audits}
                violations={violations}
                isLoading={auditsLoading || violationsLoading || !allRefs}
                onAddAudit={handleAddAudit}
                onEditAudit={handleEditAudit}
                onViewDetail={(audit) => window.open(`/audits/financial-activity/${audit.id}`, '_blank')}
                onAddViolation={handleAddViolation}
                onEditViolation={handleEditViolation}
                onDeleteViolation={handleDeleteViolation}
                onInitiateInvestigation={(v) => {
                    setEscalationViolation(v);
                    setSelectedInvestigation(null);
                    setInvestigationDialogOpen(true);
                }}
                onTransferLawEnforcement={(v) => {
                    setEscalationViolation(v);
                    setSelectedLawCase(null);
                    setLawEnforcementDialogOpen(true);
                }}
                districts={allRefs?.districts}
                directions={allRefs?.directions}
                authorities={allRefs?.authorities}
                violationTypes={allRefs?.violations}
            />

            <FinancialAuditDialogs
                auditOpen={auditDialogOpen}
                onAuditOpenChange={setAuditDialogOpen}
                initialAudit={selectedAudit}
                onSaveAudit={handleSaveAudit}
                auditCount={audits.length}
                violationOpen={violationDialogOpen}
                onViolationOpenChange={setViolationDialogOpen}
                initialViolation={selectedViolation}
                selectedAudit={selectedAudit}
                onSaveViolation={handleSaveViolation}
            />

            <ServiceInvestigationDialogs
                open={investigationDialogOpen}
                onOpenChange={setInvestigationDialogOpen}
                investigation={selectedInvestigation}
                onSave={handleSaveInvestigation}
                saving={createInvestigation.isPending || updateInvestigation.isPending}
            />

            <LawEnforcementDialogs
                open={lawEnforcementDialogOpen}
                onOpenChange={setLawEnforcementDialogOpen}
                caseData={selectedLawCase}
                onSave={handleSaveLawEnforcement}
                saving={createLawEnforcement.isPending || updateLawEnforcement.isPending}
            />
        </div>
    )
}
