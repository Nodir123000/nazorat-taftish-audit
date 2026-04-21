"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

interface KPIEmployeeDialogsProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    employee: any
    onSave: (data: any) => void
    isSaving: boolean
}

export function KPIEmployeeDialogs({
    open,
    onOpenChange,
    employee,
    onSave,
    isSaving
}: KPIEmployeeDialogsProps) {
    const [formData, setFormData] = useState<any>({
        fullName: "",
        rank: "",
        position: "",
        department: "",
        status: "active"
    })

    useEffect(() => {
        if (employee) {
            setFormData(employee)
        } else {
            setFormData({
                fullName: "",
                rank: "",
                position: "",
                department: "",
                status: "active"
            })
        }
    }, [employee, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{employee ? "Редактировать сотрудника" : "Добавить сотрудника"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">ФИО</Label>
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rank">Звание</Label>
                            <Input
                                id="rank"
                                value={formData.rank}
                                onChange={e => setFormData({ ...formData, rank: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Статус</Label>
                            <Select
                                value={formData.status}
                                onValueChange={s => setFormData({ ...formData, status: s })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Активен</SelectItem>
                                    <SelectItem value="inactive">Неактивен</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="position">Должность</Label>
                        <Input
                            id="position"
                            value={formData.position}
                            onChange={e => setFormData({ ...formData, position: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="department">Подразделение</Label>
                        <Input
                            id="department"
                            value={formData.department}
                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Сохранение..." : "Сохранить"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
