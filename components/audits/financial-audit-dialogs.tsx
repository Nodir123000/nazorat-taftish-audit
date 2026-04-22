"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { FinancialAuditDTO, AuditViolationDTO, CreateFinancialAuditDTO } from "@/lib/types/audits.dto"
import useSWR from "swr"
import { auditsService } from "@/lib/services/audits-service"

interface FinancialAuditDialogsProps {
    // Audit Dialog
    auditOpen: boolean
    onAuditOpenChange: (open: boolean) => void
    initialAudit?: FinancialAuditDTO | null
    onSaveAudit: (data: any) => void
    auditCount: number

    // Violation Dialog
    violationOpen: boolean
    onViolationOpenChange: (open: boolean) => void
    initialViolation?: AuditViolationDTO | null
    selectedAudit?: FinancialAuditDTO | null
    onSaveViolation: (data: any) => void
    saving?: boolean
}

const CONTROL_BODY_ORDER = [
    "КРУ МО РУ",
    "Прокуратура РУ",
    "СНБ РУ",
    "МО РУ",
    "ВО МО РУ",
    "Соединение МО РУ",
    "Объединение МО РУ",
    "В/Ч МО РУ",
]

export function FinancialAuditDialogs({
    auditOpen,
    onAuditOpenChange,
    initialAudit,
    onSaveAudit,
    auditCount,
    violationOpen,
    onViolationOpenChange,
    initialViolation,
    selectedAudit,
    onSaveViolation,
    saving = false,
}: FinancialAuditDialogsProps) {
    const { t } = useTranslation()

    // Fetch violation references
    const { data: references } = useSWR('violation-references', () => auditsService.getViolationReferences())

    // Audit Form State
    const [auditForm, setAuditForm] = useState({
        unit: "",
        unitSubtitle: "",
        inspectionDirection: "Финансово-хозяйственной деятельности",
        inspectionDirectionSubtitle: "ГФЭУ МО РУ",
        inspectionType: "плановые",
        date: "",
        cashier: "",
        cashierRole: "",
        status: "Проверено",
        controlBody: "",
    })

    // Violation Form State
    const [violationForm, setViolationForm] = useState({
        kind: "", // Раздел
        type: "", // Вид
        source: "", // Детализация
        amount: "",
        recovered: "",
        count: "1",
        recoveredCount: "0",
        responsible: "",
    })

    // Computed options for hierarchical selection
    const sectionOptions = references || []
    const kindOptions = violationForm.kind ? sectionOptions.find((s: any) => s.section === violationForm.kind)?.kinds || [] : []
    const detailOptions = violationForm.type ? kindOptions.find((k: any) => k.kind === violationForm.type)?.details || [] : []

    useEffect(() => {
        if (initialAudit) {
            setAuditForm({
                unit: initialAudit.unit,
                unitSubtitle: initialAudit.unitSubtitle,
                inspectionDirection: initialAudit.inspectionDirection,
                inspectionDirectionSubtitle: initialAudit.inspectionDirectionSubtitle,
                inspectionType: initialAudit.inspectionType,
                date: initialAudit.date,
                cashier: initialAudit.cashier,
                cashierRole: initialAudit.cashierRole,
                status: initialAudit.status,
                controlBody: initialAudit.controlBody,
            })
        } else {
            setAuditForm({
                unit: "",
                unitSubtitle: "",
                inspectionDirection: "Финансово-хозяйственной деятельности",
                inspectionDirectionSubtitle: "ГФЭУ МО РУ",
                inspectionType: "плановые",
                date: "",
                cashier: "",
                cashierRole: "",
                status: "Проверено",
                controlBody: "",
            })
        }
    }, [initialAudit, auditOpen])

    useEffect(() => {
        if (initialViolation) {
            setViolationForm({
                kind: initialViolation.kind || "",
                type: initialViolation.type || "",
                source: initialViolation.source || "",
                amount: initialViolation.amount.toString(),
                recovered: initialViolation.recovered.toString(),
                count: initialViolation.count.toString(),
                recoveredCount: (initialViolation.recoveredCount || 0).toString(),
                responsible: initialViolation.responsible || "",
            })
        } else {
            setViolationForm({
                kind: "",
                type: "",
                source: "",
                amount: "",
                recovered: "",
                count: "1",
                recoveredCount: "0",
                responsible: "",
            })
        }
    }, [initialViolation, violationOpen])

    return (
        <>
            {/* Audit Dialog */}
            <Dialog open={auditOpen} onOpenChange={onAuditOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{initialAudit ? "Редактировать результат КРР" : "Добавить результат КРР"}</DialogTitle>
                        <DialogDescription>Заполните данные о результате ревизии или проверки</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Номер акта</Label>
                                <Input value={`AKT-${(auditCount + 1).toString().padStart(3, '0')}`} disabled className="bg-muted" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Дата подписания <span className="text-red-500">*</span></Label>
                                <Input type="date" value={auditForm.date} onChange={(e) => setAuditForm({ ...auditForm, date: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Орган контроля</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={auditForm.controlBody} onChange={(e) => setAuditForm({ ...auditForm, controlBody: e.target.value })}>
                                    <option value="">Выберите орган контроля...</option>
                                    {CONTROL_BODY_ORDER.map((cb) => <option key={cb} value={cb}>{cb}</option>)}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Воинская часть <span className="text-red-500">*</span></Label>
                                <Input placeholder="Воинская часть 12345" value={auditForm.unit} onChange={(e) => setAuditForm({ ...auditForm, unit: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Военный округ</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={auditForm.unitSubtitle} onChange={(e) => setAuditForm({ ...auditForm, unitSubtitle: e.target.value })}>
                                    <option value="">Выберите округ...</option>
                                    <option value="Ташкентский военный округ">ТВО</option>
                                    <option value="Центральный военный округ">ЦВО</option>
                                    <option value="Восточный военный округ">ВВО</option>
                                    <option value="Западный военный округ">ЗВО</option>
                                    <option value="Северо-Западный военный округ">СЗВО</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Направление проверки</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={auditForm.inspectionDirection} onChange={(e) => setAuditForm({ ...auditForm, inspectionDirection: e.target.value })}>
                                    <option value="Финансово-хозяйственной деятельности">ФХД</option>
                                    <option value="Продовольственное обеспечение">Продовольственное</option>
                                    <option value="Вещевое обеспечение">Вещевое</option>
                                    <option value="Квартирно-эксплуатационное">КЭУ</option>
                                    <option value="Медицинское обеспечение">Медицинское</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => onAuditOpenChange(false)} disabled={saving}>Отмена</Button>
                            <Button onClick={() => onSaveAudit(auditForm)} disabled={saving}>
                                {saving ? <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {initialAudit ? "Сохранить" : "Добавить"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Violation Dialog */}
            <Dialog open={violationOpen} onOpenChange={onViolationOpenChange}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{initialViolation ? "Редактировать нарушение" : "Добавить нарушение"}</DialogTitle>
                        <DialogDescription>
                            {initialViolation ? "Измените информацию о нарушении" : `Внесите информацию о выявленном нарушении для ${selectedAudit?.unit}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Раздел справки (для агрегации)</Label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                                value={violationForm.kind} 
                                onChange={(e) => setViolationForm({ ...violationForm, kind: e.target.value, type: "", source: "" })}
                            >
                                <option value="">Выберите раздел...</option>
                                {sectionOptions.map((s: any) => (
                                    <option key={s.section} value={s.section}>{s.section}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Вид нарушения (категория)</Label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                                value={violationForm.type} 
                                disabled={!violationForm.kind}
                                onChange={(e) => setViolationForm({ ...violationForm, type: e.target.value, source: "" })}
                            >
                                <option value="">Выберите вид...</option>
                                {kindOptions.map((k: any) => (
                                    <option key={k.kind} value={k.kind}>{k.kind}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Детализация нарушения (конкретная статья)</Label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                                value={violationForm.source} 
                                disabled={!violationForm.type}
                                onChange={(e) => setViolationForm({ ...violationForm, source: e.target.value })}
                            >
                                <option value="">Выберите детализацию...</option>
                                {detailOptions.map((d: any) => (
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Лиц допустило (чел.)</Label>
                                <Input type="number" value={violationForm.count} onChange={(e) => setViolationForm({ ...violationForm, count: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label className={Number(violationForm.recoveredCount) > Number(violationForm.count) ? "text-red-500" : ""}>Лиц возместило (чел.)</Label>
                                <Input type="number" value={violationForm.recoveredCount} onChange={(e) => setViolationForm({ ...violationForm, recoveredCount: e.target.value })} className={Number(violationForm.recoveredCount) > Number(violationForm.count) ? "border-red-500" : ""} />
                                {Number(violationForm.recoveredCount) > Number(violationForm.count) && (
                                    <span className="text-[10px] text-red-500">Не может быть больше допустивших</span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Сумма нарушения (сум)</Label>
                                <Input type="number" value={violationForm.amount} onChange={(e) => setViolationForm({ ...violationForm, amount: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label className={Number(violationForm.recovered) > Number(violationForm.amount) ? "text-red-500" : ""}>Восстановлено (сум)</Label>
                                <Input type="number" value={violationForm.recovered} onChange={(e) => setViolationForm({ ...violationForm, recovered: e.target.value })} className={Number(violationForm.recovered) > Number(violationForm.amount) ? "border-red-500" : ""} />
                                {Number(violationForm.recovered) > Number(violationForm.amount) && (
                                    <span className="text-[10px] text-red-500">Не может превышать сумму нарушения</span>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Ответственное лицо</Label>
                            <Input placeholder="Ф.И.О. ответственного" value={violationForm.responsible} onChange={(e) => setViolationForm({ ...violationForm, responsible: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onViolationOpenChange(false)} disabled={saving}>Отмена</Button>
                        <Button 
                            onClick={() => onSaveViolation(violationForm)} 
                            disabled={
                                saving || 
                                !violationForm.source || 
                                Number(violationForm.recoveredCount) > Number(violationForm.count) || 
                                Number(violationForm.recovered) > Number(violationForm.amount)
                            }
                        >
                            {saving ? <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Сохранить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
