"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LawEnforcementCaseDTO, AuditViolationDTO } from "@/lib/types/audits.dto"
import { useTranslation } from "@/lib/i18n/hooks"
import { Icons } from "@/components/icons"

interface LawEnforcementDialogsProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    caseData?: LawEnforcementCaseDTO | null
    onSave: (data: Partial<LawEnforcementCaseDTO>) => void
    escalationViolation?: AuditViolationDTO | null
    saving?: boolean
}

export function LawEnforcementDialogs({
    open,
    onOpenChange,
    caseData,
    onSave,
    escalationViolation,
    saving
}: LawEnforcementDialogsProps) {
    const { t } = useTranslation()
    const [formData, setFormData] = useState<Partial<LawEnforcementCaseDTO>>({
        outgoingNumber: "",
        outgoingDate: new Date().toISOString().split('T')[0],
        recipientOrg: "",
        amount: 0,
        status: "Передано",
        caseNumber: "",
        decision: "В процессе",
        type: "Уголовное",
        violationId: ""
    })

    useEffect(() => {
        if (caseData) {
            setFormData(caseData)
        } else {
            setFormData({
                outgoingNumber: "",
                outgoingDate: new Date().toISOString().split('T')[0],
                recipientOrg: "",
                amount: 0,
                status: "Передано",
                caseNumber: "",
                decision: "В процессе",
                type: "Уголовное",
                violationId: ""
            })
        }
    }, [caseData, open])

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
                            <Icons.Gavel className="h-6 w-6 text-rose-500" />
                            {caseData ? "Редактировать дело" : "Оформить передачу в ОВД"}
                        </DialogTitle>
                        <DialogDescription>
                            Заполните данные о передаче материалов в следственные органы.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="outgoingNumber">Исходящий номер</Label>
                                <Input
                                    id="outgoingNumber"
                                    value={formData.outgoingNumber}
                                    onChange={(e) => setFormData({ ...formData, outgoingNumber: e.target.value })}
                                    required
                                    placeholder="№15/4-123"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="outgoingDate">Дата отправки</Label>
                                <Input
                                    id="outgoingDate"
                                    type="date"
                                    value={formData.outgoingDate}
                                    onChange={(e) => setFormData({ ...formData, outgoingDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recipientOrg">Орган-получатель</Label>
                            <Input
                                id="recipientOrg"
                                value={formData.recipientOrg}
                                onChange={(e) => setFormData({ ...formData, recipientOrg: e.target.value })}
                                required
                                placeholder="Военная прокуратура..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Тип дела</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите тип" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Уголовное">Уголовное</SelectItem>
                                        <SelectItem value="Административное">Административное</SelectItem>
                                        <SelectItem value="Гражданское">Гражданское</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Сумма ущерба (UZS)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                    required
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2">
                            <div className="space-y-2">
                                <Label htmlFor="caseNumber">№ Уголовного дела (если есть)</Label>
                                <Input
                                    id="caseNumber"
                                    value={formData.caseNumber}
                                    onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                                    placeholder="№ УД-123-2025"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="decision">Решение</Label>
                                <Select
                                    value={formData.decision}
                                    onValueChange={(value) => setFormData({ ...formData, decision: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите решение" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="В процессе">В процессе</SelectItem>
                                        <SelectItem value="Возбуждено УД">Возбуждено УД</SelectItem>
                                        <SelectItem value="Отказ в возбуждении">Отказ в возбуждении</SelectItem>
                                        <SelectItem value="Передано в суд">Передано в суд</SelectItem>
                                        <SelectItem value="Осужден">Осужден</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Текущий статус</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите статус" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Передано">Передано</SelectItem>
                                    <SelectItem value="На рассмотрении">На рассмотрении</SelectItem>
                                    <SelectItem value="Завершено">Завершено</SelectItem>
                                    <SelectItem value="Возвращено">Возвращено</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={saving} className="bg-rose-600 hover:bg-rose-700 text-white shadow-md">
                            {saving && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Сохранить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
