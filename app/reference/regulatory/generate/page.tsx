"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { renderTemplate, type OrderFormData } from "@/lib/utils/template-renderer"
import html2canvas from "html2canvas"

function GeneratorContent() {
    const searchParams = useSearchParams()
    const type = searchParams.get("type") || "act"
    const [template, setTemplate] = useState<any>(null)
    const [formData, setFormData] = useState<OrderFormData>({
        location: "г. Ташкент",
        orderDate: new Date().toISOString().split("T")[0],
        orderNumber: "001",
        groupLeader: "",
        groupLeaderRank: "",
        groupLeaderPosition: "",
        deputyLeader: "",
        deputyLeaderRank: "",
        deputyLeaderPosition: "",
        groupMembers: "",
        groupMembersList: [],
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        unit: "",
        unitCommander: "",
        controlMeasuresDescription: "",
        instructionDate: "",
        instructionDetails: "",
        safetyMeasures: "",
        specialistInvolvement: "",
        transportRestrictions: "",
        aviationTransport: "",
        controlNotes: "",
        signerName: "",
        signerRank: "",
        signerPosition: "",
        requirements: ""
    })

    const [renderedContent, setRenderedContent] = useState("")

    useEffect(() => {
        fetchTemplate()
    }, [type])

    const fetchTemplate = async () => {
        try {
            const res = await fetch(`/api/reference/templates?type=${type}`)
            const data = await res.json()
            // Find active Russian template for now
            const active = data.find((t: any) => t.is_active && t.locale === "ru")
            setTemplate(active)
        } catch (error) {
            console.error("Failed to fetch template:", error)
        }
    }

    useEffect(() => {
        if (template) {
            setRenderedContent(renderTemplate(template.content, formData, "ru"))
        }
    }, [template, formData])

    const handleExportPDF = async () => {
        const element = document.getElementById("pdf-content")
        if (!element) return

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            })

            const link = document.createElement("a")
            link.download = `${type}-${formData.orderNumber}.png`
            link.href = canvas.toDataURL("image/png")
            link.click()
        } catch (error) {
            console.error("Export failed:", error)
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Генератор: {template?.title || type}</h1>
                    <p className="text-muted-foreground">Заполните данные для формирования документа</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        Назад
                    </Button>
                    <Button onClick={handleExportPDF}>
                        <Icons.Download className="mr-2 h-4 w-4" />
                        Экспорт
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Column */}
                <Card>
                    <CardHeader>
                        <CardTitle>Данные документа</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Номер документа</Label>
                                <Input
                                    value={formData.orderNumber}
                                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Дата</Label>
                                <Input
                                    type="date"
                                    value={formData.orderDate}
                                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Объект проверки (Часть)</Label>
                            <Input
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Установленные факты / Решение</Label>
                            <Textarea
                                rows={10}
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                placeholder="Введите текст нарушений или постановления..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Председатель комиссии</Label>
                                <Input
                                    value={formData.groupLeader}
                                    onChange={(e) => setFormData({ ...formData, groupLeader: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Должность / Звание</Label>
                                <Input
                                    value={formData.groupLeaderPosition}
                                    onChange={(e) => setFormData({ ...formData, groupLeaderPosition: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Preview Column */}
                <div className="space-y-4">
                    <Card className="bg-slate-50 border-dashed">
                        <CardHeader className="py-3">
                            <CardTitle className="text-sm">Предварительный просмотр</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                id="pdf-content"
                                className="bg-white p-12 shadow-sm min-h-[842px] font-serif text-[14px] leading-relaxed whitespace-pre-wrap doc-preview-content"
                                dangerouslySetInnerHTML={{ __html: renderedContent }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function DocumentGeneratorPage() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <GeneratorContent />
        </Suspense>
    )
}
