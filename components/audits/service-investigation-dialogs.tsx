"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import { ServiceInvestigationDTO, AuditViolationDTO } from "@/lib/types/audits.dto"

interface ServiceInvestigationDialogsProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    investigation?: ServiceInvestigationDTO | null
    onSave: (data: Partial<ServiceInvestigationDTO>) => void
    escalationViolation?: AuditViolationDTO | null
    saving?: boolean
}

export function ServiceInvestigationDialogs({
    open,
    onOpenChange,
    investigation,
    onSave,
    escalationViolation,
    saving
}: ServiceInvestigationDialogsProps) {
    const { t } = useTranslation()
    const [formData, setFormData] = useState<Partial<ServiceInvestigationDTO>>({
        prescriptionNum: "",
        unitName: "",
        violationSummary: "",
        assignmentOrder: "",
        responsiblePerson: "",
        result: "В процессе",
        punishmentOrder: "",
        amountToRecover: 0,
        deadline: new Date().toISOString().split('T')[0],
        status: "В процессе"
    })

    useEffect(() => {
        if (investigation) {
            setFormData(investigation)
        } else {
            setFormData({
                prescriptionNum: "",
                unitName: "",
                violationSummary: "",
                assignmentOrder: "",
                responsiblePerson: "",
                result: "В процессе",
                punishmentOrder: "",
                amountToRecover: 0,
                deadline: new Date().toISOString().split('T')[0],
                status: "В процессе"
            })
        }
    }, [investigation, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Icons.ShieldAlert className="h-6 w-6 text-amber-500" />
                            {investigation ? "Редактировать расследование" : "Назначить расследование"}
                        </DialogTitle>
                        <DialogDescription>
                            Заполните данные о служебном расследовании по выявленному нарушению.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="prescriptionNum">№ Предписания</Label>
                                <Input
                                    id="prescriptionNum"
                                    value={formData.prescriptionNum}
                                    onChange={(e) => setFormData({ ...formData, prescriptionNum: e.target.value })}
                                    required
                                    placeholder="ПР-2025-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unitName">Воинская часть</Label>
                                <Input
                                    id="unitName"
                                    value={formData.unitName}
                                    onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                                    required
                                    placeholder="В/Ч 00000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="violationSummary">Суть нарушения</Label>
                            <Textarea
                                id="violationSummary"
                                value={formData.violationSummary}
                                onChange={(e) => setFormData({ ...formData, violationSummary: e.target.value })}
                                required
                                placeholder="Краткое описание выявленного нарушения..."
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="assignmentOrder">Приказ о назначении</Label>
                                <Input
                                    id="assignmentOrder"
                                    value={formData.assignmentOrder}
                                    onChange={(e) => setFormData({ ...formData, assignmentOrder: e.target.value })}
                                    required
                                    placeholder="№123 от 01.01.2025"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="responsiblePerson">Виновное лицо</Label>
                                <Input
                                    id="responsiblePerson"
                                    value={formData.responsiblePerson}
                                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                                    required
                                    placeholder="Ф.И.О. ответственного"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="result">Итог расследования</Label>
                                <Select
                                    value={formData.result}
                                    onValueChange={(value) => setFormData({ ...formData, result: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите результат" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="В процессе">В процессе</SelectItem>
                                        <SelectItem value="Вина установлена">Вина установлена</SelectItem>
                                        <SelectItem value="Вина не установлена">Вина не установлена</SelectItem>
                                        <SelectItem value="Полная мат. ответственность">Полная мат. ответственность</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Статус</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите статус" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="В процессе">В процессе</SelectItem>
                                        <SelectItem value="Завершено">Завершено</SelectItem>
                                        <SelectItem value="Просрочено">Просрочено</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amountToRecover">Сумма к взысканию (UZS)</Label>
                                <Input
                                    id="amountToRecover"
                                    type="number"
                                    value={formData.amountToRecover}
                                    onChange={(e) => setFormData({ ...formData, amountToRecover: parseFloat(e.target.value) })}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Срок завершения</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="punishmentOrder">Приказ о наказании</Label>
                            <Input
                                id="punishmentOrder"
                                value={formData.punishmentOrder}
                                onChange={(e) => setFormData({ ...formData, punishmentOrder: e.target.value })}
                                placeholder="№456 от 15.01.2025"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white shadow-md">
                            {saving && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Сохранить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
