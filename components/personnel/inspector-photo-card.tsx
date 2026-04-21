"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { Camera } from "lucide-react"
import type { Inspector } from "@/lib/types/inspector"
import { getInspectorCategoryColor, getKpiRatingColor, getKpiRatingText } from "@/lib/types/inspector"

interface InspectorPhotoCardProps {
    inspector: Inspector
}

function getInitials(fullName: string): string {
    return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

function calculateYearsOfService(employmentDate: string): number {
    const start = new Date(employmentDate).getTime()
    const now = Date.now()
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25)
    return Math.floor(years)
}

function calculateContractProgress(startDate: string, endDate: string): number {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = Date.now()
    const total = end - start
    const elapsed = now - start
    const progress = (elapsed / total) * 100
    return Number(Math.min(Math.max(progress, 0), 100).toFixed(2))
}

export function InspectorPhotoCard({ inspector }: InspectorPhotoCardProps) {
    const initials = getInitials(inspector.fullName)
    const yearsOfService = calculateYearsOfService(inspector.employmentDate)
    const contractProgress = calculateContractProgress(inspector.employmentDate, inspector.contractEndDate)
    const isContractExpiring = contractProgress > 80

    const [localPhoto, setLocalPhoto] = useState<string | null>(inspector.photo || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Загружаем сохраненное фото при инициализации
    useEffect(() => {
        if (inspector.id) {
            const savedPhoto = localStorage.getItem(`inspector_photo_${inspector.id}`)
            if (savedPhoto) {
                setLocalPhoto(savedPhoto)
            }
        }
    }, [inspector.id])

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setLocalPhoto(base64String)
                if (inspector.id) {
                    localStorage.setItem(`inspector_photo_${inspector.id}`, base64String)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative mb-4 group cursor-pointer w-full max-w-[288px] mx-auto" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="h-72 w-72 rounded-xl border-4 border-primary/20 shadow-lg transition-all duration-300 group-hover:brightness-75 group-hover:border-primary/50">
                            <AvatarImage src={localPhoto || "/placeholder.svg"} alt={inspector.fullName} className="object-cover" />
                            <AvatarFallback className="text-6xl rounded-xl bg-primary/10 text-primary font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        {/* Hover Overlay for Upload */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl z-10 bg-black/40">
                            <div className="flex flex-col items-center text-white">
                                <Camera className="h-8 w-8 mb-1" />
                                <span className="text-xs font-medium">Загрузить</span>
                            </div>
                        </div>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                        />

                        {/* Status indicator */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-md z-20" />
                    </div>

                    {/* Name and Rank */}
                    <h2 className="text-xl font-bold text-center mb-1">{inspector.fullName}</h2>
                    <Badge variant="destructive" className="mb-2">
                        {inspector.militaryRank}
                    </Badge>

                    {/* Inspector Category */}
                    <Badge variant="outline" className={`mb-4 ${getInspectorCategoryColor(inspector.inspectorCategory)}`}>
                        {inspector.inspectorCategory}
                    </Badge>

                    {/* KPI Score */}
                    <div className="w-full mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">KPI Рейтинг</span>
                            <Badge variant="outline" className={getKpiRatingColor(inspector.kpiRating)}>
                                {inspector.kpiScore}% - {getKpiRatingText(inspector.kpiRating)}
                            </Badge>
                        </div>
                        <Progress value={inspector.kpiScore} className="h-2" />
                    </div>

                    {/* Quick Stats */}
                    <div className="w-full grid grid-cols-2 gap-3">
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-primary">{inspector.auditsCompleted}</div>
                            <div className="text-xs text-muted-foreground">Ревизий</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-amber-600">{yearsOfService}</div>
                            <div className="text-xs text-muted-foreground">Лет стажа</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-red-600">{inspector.violationsFound}</div>
                            <div className="text-xs text-muted-foreground">Нарушений</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-emerald-600">{inspector.auditsInProgress}</div>
                            <div className="text-xs text-muted-foreground">В работе</div>
                        </div>
                    </div>

                    {/* Contract Progress */}
                    <div className="w-full mt-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">Срок контракта</span>
                            <span className={`text-xs font-medium ${isContractExpiring ? "text-amber-600" : "text-muted-foreground"}`}>
                                до {new Date(inspector.contractEndDate).toLocaleDateString("ru-RU")}
                            </span>
                        </div>
                        <Progress
                            value={contractProgress}
                            className={`h-1.5 ${isContractExpiring ? "[&>div]:bg-amber-500" : ""}`}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
