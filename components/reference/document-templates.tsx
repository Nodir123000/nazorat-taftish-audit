"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n/context"
import { Switch } from "@/components/ui/switch"

interface Template {
    id: string
    type: string
    title: string
    content: string
    locale: string
    is_active: boolean
}

export function DocumentTemplates() {
    const { locale } = useI18n()
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(true)
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/reference/templates")
            if (!res.ok) throw new Error("Failed to fetch templates")
            const data = await res.json()
            setTemplates(data)
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при загрузке шаблонов")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!editingTemplate) return
        try {
            const res = await fetch("/api/reference/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingTemplate),
            })
            if (!res.ok) throw new Error("Failed to save template")
            toast.success("Шаблон успешно сохранен")
            setEditingTemplate(null)
            fetchTemplates()
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при сохранении")
        }
    }

    const toggleStatus = async (template: Template) => {
        try {
            const updated = { ...template, is_active: !template.is_active }
            const res = await fetch("/api/reference/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            })
            if (!res.ok) throw new Error("Failed to update status")
            toast.success(`Шаблон ${updated.is_active ? 'активирован' : 'деактивирован'}`)
            fetchTemplates()
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при изменении статуса")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Вы уверены, что хотите удалить этот шаблон?")) return
        try {
            const res = await fetch(`/api/reference/templates?id=${id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Failed to delete template")
            toast.success("Шаблон удален")
            fetchTemplates()
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при удалении")
        }
    }

    const createInitialTemplates = async () => {
        // Helper to seed initial templates if none exist
        const initial = [
            { id: "order_general", type: "order", title: "Общий приказ на ревизию", content: "ПРИКАЗ № {{order_number}}\\n\\nВ соответствии с {{plan_basis}} провести ревизию в {{unit_name}}...", locale: "ru", is_active: true },
            { id: "briefing_standard", type: "briefing", title: "Стандартный инструктаж", content: "ЛИСТ ИНСТРУКТАЖА\\n\\nМной проведено инструктирование группы: {{group_members}}...", locale: "ru", is_active: true },
            { id: "prescription_standard", type: "prescription", title: "Стандартное предписание", content: "ПРЕДПИСАНИЕ № {{prescription_num}}\\n\\nНа основании {{plan_basis}}...", locale: "ru", is_active: true },
        ]
        for (const t of initial) {
            await fetch("/api/reference/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(t),
            })
        }
        fetchTemplates()
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'order': return 'Приказ'
            case 'briefing': return 'Инструктаж'
            case 'prescription': return 'Предписание'
            default: return type
        }
    }

    const getLocaleLabel = (loc: string) => {
        switch (loc) {
            case 'ru': return 'Русский'
            case 'uz_cy': return 'Ўзбек (кирилл)'
            case 'uz_lt': return 'O\'zbek (lotin)'
            default: return loc
        }
    }

    if (loading) return <div className="flex justify-center p-8"><Icons.Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

    return (
        <div className="space-y-6">
            {templates.length === 0 && !editingTemplate && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <Icons.File className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">Список шаблонов пуст</h3>
                        <p className="text-muted-foreground mb-6">Создайте стандартные шаблоны для начала работы</p>
                        <Button onClick={createInitialTemplates}>Создать стандартные шаблоны</Button>
                    </CardContent>
                </Card>
            )}

            {editingTemplate ? (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Редактирование шаблона</CardTitle>
                                <CardDescription>{editingTemplate.id}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(null)}>
                                <Icons.X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Заголовок</label>
                                <Input
                                    value={editingTemplate.title}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Тип документа</label>
                                <select
                                    className="w-full border rounded-md p-2 text-sm bg-background"
                                    value={editingTemplate.type}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, type: e.target.value })}
                                >
                                    <option value="order">Приказ</option>
                                    <option value="briefing">Инструктаж</option>
                                    <option value="prescription">Предписание</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Язык документа</label>
                                <select
                                    className="w-full border rounded-md p-2 text-sm bg-background"
                                    value={editingTemplate.locale}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, locale: e.target.value })}
                                >
                                    <option value="ru">Русский</option>
                                    <option value="uz_cy">Ўзбек (кирилл)</option>
                                    <option value="uz_lt">O'zbek (lotin)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Идентификатор (ID)</label>
                                <Input
                                    value={editingTemplate.id}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, id: e.target.value })}
                                    placeholder="например: order_custom_2025"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-medium">Текст шаблона</label>
                                <div className="text-[10px] text-muted-foreground bg-slate-50 p-1 px-2 rounded border leading-tight max-w-[70%]">
                                    <span className="font-bold">Доступные теги:</span><br />
                                    {"{{order_number}}, {{order_date}}, {{location}}, {{start_date}}, {{end_date}}, {{unit}}, {{leader_name}}, {{leader_rank}}, {{leader_position}}, {{group_composition}}, {{plan_number}}, {{plan_date}}, {{requirements}}"}
                                </div>
                            </div>
                            <Textarea
                                className="font-mono min-h-[450px] text-sm"
                                value={editingTemplate.content}
                                onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setEditingTemplate(null)}>Отмена</Button>
                            <Button onClick={handleSave}>Сохранить шаблон</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : templates.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Шаблоны документов</CardTitle>
                                <CardDescription>Управление шаблонами приказов, инструктажей и предписаний</CardDescription>
                            </div>
                            <Button
                                onClick={() => setEditingTemplate({
                                    id: `custom_${Date.now()}`,
                                    type: "order",
                                    title: "Новый шаблон",
                                    content: "",
                                    locale: "ru",
                                    is_active: true
                                })}
                            >
                                <Icons.Plus className="mr-2 h-4 w-4" />
                                Добавить шаблон
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead className="w-[120px]">Тип</TableHead>
                                    <TableHead className="w-[120px]">Язык</TableHead>
                                    <TableHead className="w-[100px]">Статус</TableHead>
                                    <TableHead className="w-[120px] text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell className="font-mono text-xs">{template.id.substring(0, 12)}...</TableCell>
                                        <TableCell className="font-semibold">{template.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                template.type === 'order' ? 'default' :
                                                    template.type === 'briefing' ? 'secondary' : 'outline'
                                            }>
                                                {getTypeLabel(template.type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">{getLocaleLabel(template.locale)}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={template.is_active}
                                                    onCheckedChange={() => toggleStatus(template)}
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {template.is_active ? 'Активен' : 'Неактивен'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingTemplate(template)}
                                                >
                                                    <Icons.Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(template.id)}
                                                >
                                                    <Icons.Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
