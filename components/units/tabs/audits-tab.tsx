"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useTranslation } from "@/lib/i18n/hooks"
import { Icons } from "@/components/icons"
import { FinancialAuditRegistry } from "@/components/audits/financial-audit-registry"
import { FinancialAuditDialogs } from "@/components/audits/financial-audit-dialogs"
import {
    useFinancialAudits,
    useCreateFinancialAudit,
    useUpdateFinancialAudit,
    useAuditViolations,
    useCreateAuditViolation,
    useUpdateAuditViolation,
    useDeleteAuditViolation,
    useCreateServiceInvestigation,
    useUpdateServiceInvestigation,
    useCreateLawEnforcementCase,
    useUpdateLawEnforcementCase,
    useRepayments,
    useCreateRepayment,
} from "@/lib/hooks/use-audits"
import { FinancialAuditDTO, AuditViolationDTO, RepaymentDTO, CreateRepaymentDTO } from "@/lib/types/audits.dto"
import { useToast } from "@/lib/hooks/use-toast"
import { ServiceInvestigationDialogs } from "@/components/audits/service-investigation-dialogs"
import { LawEnforcementDialogs } from "@/components/audits/law-enforcement-dialogs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"

interface AuditsTabProps {
    unitNumber: string
    unitName: string
}

function useCurrentUserRole() {
    return useQuery<{ role: string }>({
        queryKey: ["auth", "me"],
        queryFn: () => fetch("/api/auth/me").then(r => r.json()),
        staleTime: 5 * 60 * 1000,
    })
}

// ─── Repayment sub-table shown when a violation row is expanded ───────────────
function RepaymentPanel({
    violation,
    canEdit,
}: {
    violation: AuditViolationDTO
    canEdit: boolean
}) {
    const { data: repayments = [], isLoading } = useRepayments(violation.id)
    const createRepayment = useCreateRepayment()
    const toast = useToast()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [form, setForm] = useState<Partial<CreateRepaymentDTO>>({
        violation_id: violation.id,
        dj_article: "",
        document_name: "",
        document_number: "",
        document_date: new Date().toISOString().slice(0, 10),
        repaid_amount: 0,
        remainder_after: 0,
    })

    const handleSave = () => {
        if (!form.repaid_amount) return
        createRepayment.mutate(form as CreateRepaymentDTO, {
            onSuccess: () => {
                toast.success("Запись о погашении добавлена")
                setDialogOpen(false)
                setForm(f => ({ ...f, dj_article: "", document_name: "", document_number: "", repaid_amount: 0, remainder_after: 0 }))
            },
            onError: (e: any) => toast.error(e.message ?? "Ошибка сохранения"),
        })
    }

    const totalRepaid = repayments.reduce((s, r) => s + Number(r.repaid_amount), 0)
    const formatMoney = (v: number) =>
        new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)

    return (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                    Реестр погашений — итого погашено:{" "}
                    <span className="text-green-700">{formatMoney(totalRepaid)}</span>
                </span>
                {canEdit && (
                    <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
                        <Icons.Plus className="w-3.5 h-3.5 mr-1" />
                        Добавить погашение
                    </Button>
                )}
            </div>

            {isLoading ? (
                <p className="text-xs text-muted-foreground">Загрузка…</p>
            ) : repayments.length === 0 ? (
                <p className="text-xs text-muted-foreground">Записей о погашении нет</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="text-xs">
                            <TableHead>Ст. ДЖ</TableHead>
                            <TableHead>Наименование документа</TableHead>
                            <TableHead>№ документа</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead className="text-right">Погашено</TableHead>
                            <TableHead className="text-right">Остаток</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {repayments.map((r: RepaymentDTO) => (
                            <TableRow key={r.id} className="text-xs">
                                <TableCell>{r.dj_article || "—"}</TableCell>
                                <TableCell>{r.document_name || "—"}</TableCell>
                                <TableCell>{r.document_number || "—"}</TableCell>
                                <TableCell>{new Date(r.document_date).toLocaleDateString("ru-RU")}</TableCell>
                                <TableCell className="text-right font-medium text-green-700">
                                    {formatMoney(Number(r.repaid_amount))}
                                </TableCell>
                                <TableCell className="text-right text-amber-700">
                                    {formatMoney(Number(r.remainder_after))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Новая запись о погашении</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs">Статья ДЖ</Label>
                                <Input
                                    value={form.dj_article}
                                    onChange={e => setForm(f => ({ ...f, dj_article: e.target.value }))}
                                    placeholder="например, ст. 215"
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Дата документа</Label>
                                <Input
                                    type="date"
                                    value={form.document_date}
                                    onChange={e => setForm(f => ({ ...f, document_date: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs">Наименование документа</Label>
                            <Input
                                value={form.document_name}
                                onChange={e => setForm(f => ({ ...f, document_name: e.target.value }))}
                                placeholder="Платёжное поручение / Приходный ордер"
                            />
                        </div>
                        <div>
                            <Label className="text-xs">№ документа</Label>
                            <Input
                                value={form.document_number}
                                onChange={e => setForm(f => ({ ...f, document_number: e.target.value }))}
                                placeholder="123/2024"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs">Погашенная сумма</Label>
                                <Input
                                    type="number"
                                    value={form.repaid_amount}
                                    onChange={e => setForm(f => ({ ...f, repaid_amount: Number(e.target.value) }))}
                                    min={0}
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Остаток после платежа</Label>
                                <Input
                                    type="number"
                                    value={form.remainder_after}
                                    onChange={e => setForm(f => ({ ...f, remainder_after: Number(e.target.value) }))}
                                    min={0}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
                        <Button onClick={handleSave} disabled={createRepayment.isPending}>
                            {createRepayment.isPending ? "Сохранение…" : "Сохранить"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ─── Main AuditsTab ────────────────────────────────────────────────────────────
export function AuditsTab({ unitNumber, unitName }: AuditsTabProps) {
    const { t } = useTranslation()
    const toast = useToast()

    const { data: roleData } = useCurrentUserRole()
    const canManageRepayments =
        roleData?.role === "financial_head" || roleData?.role === "admin"

    // Expanded violation rows (repayment panel)
    const [expandedViolationId, setExpandedViolationId] = useState<number | null>(null)

    // Data Fetching
    const { data: audits = [], isLoading: auditsLoading } = useFinancialAudits<FinancialAuditDTO[]>({ unitName: unitName || unitNumber })
    const { data: violations = [], isLoading: violationsLoading } = useAuditViolations<AuditViolationDTO[]>()

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

    const normalize = (s?: string) => String(s ?? "").toLowerCase().replace(/\s+/g, " ").trim()

    const extractUnitString = (unitField: any): string => {
        if (!unitField) return ""
        if (typeof unitField === "string") return unitField
        if (unitField.name) return extractUnitString(unitField.name)
        return unitField.ru ?? unitField.name_ru ?? unitField.name_en ?? ""
    }

    const matchesUnit = (itemUnit: any) => {
        const s = normalize(extractUnitString(itemUnit))
        const searchName = normalize(unitName)
        const searchNumber = normalize(unitNumber)

        if (!searchName && !searchNumber) return false

        if (searchNumber && s.includes(searchNumber)) return true
        if (searchName && s.includes(searchName)) return true

        const sDigits = s.replace(/\D/g, "")
        const nameDigits = searchName.replace(/\D/g, "")
        const numberDigits = searchNumber.replace(/\D/g, "")

        if (sDigits) {
            if (nameDigits && sDigits.includes(nameDigits)) return true
            if (numberDigits && sDigits.includes(numberDigits)) return true
        }

        return false
    }

    const filteredAudits = useMemo(() => {
        return audits.filter(a => matchesUnit(a.unit))
    }, [audits, unitName, unitNumber])

    const filteredViolations = useMemo(() => {
        return violations.filter(v => filteredAudits.some(a => a.id === v.auditId))
    }, [violations, filteredAudits])

    // Actions
    const handleAddAudit = useCallback(() => {
        setSelectedAudit(null)
        setAuditDialogOpen(true)
    }, [])

    const handleEditAudit = useCallback((audit: FinancialAuditDTO) => {
        setSelectedAudit(audit)
        setAuditDialogOpen(true)
    }, [])

    const handleSaveAudit = useCallback((data: any) => {
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
    }, [selectedAudit, updateAudit, createAudit, toast])

    const handleAddViolation = useCallback((audit: FinancialAuditDTO) => {
        setSelectedAudit(audit)
        setSelectedViolation(null)
        setViolationDialogOpen(true)
    }, [])

    const handleEditViolation = useCallback((violation: AuditViolationDTO) => {
        setSelectedViolation(violation)
        setViolationDialogOpen(true)
    }, [])

    const handleSaveViolation = useCallback((data: any) => {
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
    }, [selectedViolation, selectedAudit, updateViolation, createViolation, toast])

    const handleDeleteViolation = useCallback((id: number) => {
        if (window.confirm("Вы уверены, что хотите удалить это нарушение?")) {
            deleteViolation.mutate(id, {
                onSuccess: () => toast.success("Нарушение удалено")
            })
        }
    }, [deleteViolation, toast])

    const handleSaveInvestigation = useCallback((data: any) => {
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
    }, [selectedInvestigation, updateInvestigation, createInvestigation, toast])

    const handleSaveLawEnforcement = useCallback((data: any) => {
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
    }, [selectedLawCase, updateLawEnforcement, createLawEnforcement, toast])

    return (
        <div className="space-y-6">
            <FinancialAuditRegistry
                audits={filteredAudits}
                violations={filteredViolations}
                isLoading={auditsLoading || violationsLoading}
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
                hideFilters={true}
                hideHeader={true}
                // Repayment expand support
                expandedViolationId={expandedViolationId}
                onToggleViolationExpand={(id) =>
                    setExpandedViolationId(prev => (prev === id ? null : id))
                }
                renderViolationExpansion={(violation) => (
                    <RepaymentPanel violation={violation} canEdit={canManageRepayments} />
                )}
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
                saving={createAudit.isPending || updateAudit.isPending || createViolation.isPending || updateViolation.isPending}
            />

            <ServiceInvestigationDialogs
                open={investigationDialogOpen}
                onOpenChange={setInvestigationDialogOpen}
                investigation={selectedInvestigation}
                onSave={handleSaveInvestigation}
                escalationViolation={escalationViolation}
                saving={createInvestigation.isPending || updateInvestigation.isPending}
            />

            <LawEnforcementDialogs
                open={lawEnforcementDialogOpen}
                onOpenChange={setLawEnforcementDialogOpen}
                caseData={selectedLawCase}
                onSave={handleSaveLawEnforcement}
                escalationViolation={escalationViolation}
                saving={createLawEnforcement.isPending || updateLawEnforcement.isPending}
            />
        </div>
    )
}
