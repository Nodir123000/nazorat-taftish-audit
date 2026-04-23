"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { Camera } from "lucide-react"
import type { Inspector } from "@/lib/types/inspector"
import { getInspectorCategoryColor, getKpiRatingColor, getKpiRatingText } from "@/lib/types/inspector"
import { motion } from "framer-motion"

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
        <Card className="overflow-hidden border-2 border-border/80 shadow-lg bg-card relative">
            {/* Background Pattern for Military Aesthetic */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            <CardContent className="p-6 relative z-10">
                <div className="flex flex-col items-center">
                    {/* Avatar with Precision Border */}
                    <div className="relative mb-6 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="absolute -inset-2 bg-linear-to-tr from-primary/20 to-transparent rounded-2xl blur-sm opacity-50" />
                        <Avatar className="h-64 w-64 rounded-xl border-[3px] border-primary/40 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-primary">
                            <AvatarImage src={localPhoto || "/placeholder.svg"} alt={inspector.fullName} className="object-cover" />
                            <AvatarFallback className="text-7xl rounded-xl bg-primary/5 text-primary font-black tracking-tighter">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl bg-black/60 backdrop-blur-[2px]">
                            <div className="flex flex-col items-center text-white scale-90 group-hover:scale-100 transition-transform">
                                <Camera className="h-10 w-10 mb-2 text-primary" />
                                <span className="text-xs font-bold tracking-widest uppercase">ОБНОВИТЬ ФОТО</span>
                            </div>
                        </div>

                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />

                        {/* Rank Insignia Style Badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-sm shadow-xl border border-white/20">
                            <span className="text-tiny font-black text-white tracking-[0.2em] uppercase whitespace-nowrap">
                                {inspector.militaryRank}
                            </span>
                        </div>
                    </div>

                    {/* Personal Identification Section */}
                    <div className="w-full text-center mb-6 pt-2">
                        <div className="text-tiny font-mono text-muted-foreground tracking-[0.3em] uppercase mb-1">Служебный ранг</div>
                        <Badge variant="outline" className={`rounded-sm border-2 font-bold px-3 py-1 ${getInspectorCategoryColor(inspector.inspectorCategory)}`}>
                            {inspector.inspectorCategory.toUpperCase()}
                        </Badge>
                    </div>

                    {/* KPI Sensor Display */}
                    <div className="w-full bg-muted/40 border-y border-border/60 py-4 px-2 mb-6">
                        <div className="flex justify-between items-end mb-3">
                            <div className="space-y-1">
                                <span className="text-mini font-bold text-muted-foreground tracking-widest uppercase">Эффективность (KPI)</span>
                                <div className={`text-sm font-black tracking-tight ${getKpiRatingColor(inspector.kpiRating)}`}>
                                    {getKpiRatingText(inspector.kpiRating).toUpperCase()}
                                </div>
                            </div>
                            <div className="text-2xl font-mono font-black text-foreground">
                                {inspector.kpiScore}<span className="text-xs text-muted-foreground ml-0.5">%</span>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-muted-foreground/20 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${inspector.kpiScore}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]"
                            />
                        </div>
                    </div>

                    {/* Operational Metrics Grid */}
                    <div className="w-full grid grid-cols-2 gap-px bg-border/60 border border-border/60 rounded-lg overflow-hidden shadow-inner">
                        {[
                            { label: "РЕВИЗИИ", value: inspector.auditsCompleted, color: "text-primary" },
                            { label: "СТАЖ (ЛЕТ)", value: yearsOfService, color: "text-amber-500" },
                            { label: "НАРУШЕНИЯ", value: inspector.violationsFound, color: "text-red-500" },
                            { label: "В РАБОТЕ", value: inspector.auditsInProgress, color: "text-emerald-500" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-card p-4 flex flex-col items-center justify-center transition-colors hover:bg-muted/30">
                                <span className="text-mini font-bold text-muted-foreground tracking-widest uppercase mb-1">{stat.label}</span>
                                <span className={`text-2xl font-mono font-black ${stat.color}`}>{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Contract Validity Banner */}
                    <div className="w-full mt-6 bg-primary/5 rounded-md p-3 border border-primary/20 relative overflow-hidden group">
                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-2">
                                <Icons.ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                <span className="text-mini font-bold text-muted-foreground tracking-widest uppercase">Контракт до:</span>
                            </div>
                            <span className="font-mono text-tiny font-bold text-primary">
                                {new Date(inspector.contractEndDate).toLocaleDateString("ru-RU")}
                            </span>
                        </div>
                        <div className="mt-2 h-1 w-full bg-primary/10 rounded-full">
                            <div className={`h-full rounded-full ${isContractExpiring ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${contractProgress}%` }} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
