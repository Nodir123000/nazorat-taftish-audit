import React, { useState, useCallback, useMemo, Fragment, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/lib/i18n/context"
import { FinancialAuditDialogs } from "@/components/audits/financial-audit-dialogs"
import { FinancialAuditStats } from "@/components/audits/financial-audit-stats"
import { FinancialAuditRegistry } from "@/components/audits/financial-audit-registry"
import {
    useFinancialAudits,
    useCreateFinancialAudit,
    useUpdateFinancialAudit,
    useAuditViolations,
    useCreateAuditViolation,
    useUpdateAuditViolation,
    useDeleteAuditViolation,
    useViolationReferences,
    useAllReferences
} from "@/lib/hooks/use-audits"
import { useCommissionAssignments, CommissionAssignment } from "@/lib/hooks/use-commission-assignments"
import { useToast } from "@/lib/hooks/use-toast"
import { FinancialAuditDTO, AuditViolationDTO } from "@/lib/types/audits.dto"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"
import { cn, getDistrictAbbreviation } from "@/lib/utils"
import type { Inspector, AuditRecord, InspectionResult, InspectionViolation } from "@/lib/types/inspector"
import { getKpiRatingColor, getKpiRatingText } from "@/lib/types/inspector"
import { ErrorBoundary } from "@/components/error-boundary"
import { NoDataFound } from "@/components/ui/empty-state"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface InspectorSectionContentProps {
    section: string
    inspector: Inspector
    action?: string | null
    planId?: string | null
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("uz-UZ", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

function formatDate(dateString: string | undefined | null): string {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("ru-RU")
}

function getAuditStatusBadge(status: string) {
    switch (status) {
        case "completed":
            return <Badge className="bg-green-500/20 text-green-700 border-green-500/50">Завершена</Badge>
        case "in_progress":
            return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/50">В работе</Badge>
        case "planned":
            return <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/50">Запланирована</Badge>
        default:
            return <Badge variant="outline">Неизвестно</Badge>
    }
}

function getCertificationStatusBadge(status: string) {
    switch (status) {
        case "active":
            return <Badge className="bg-green-500/20 text-green-700 border-green-500/50">Действителен</Badge>
        case "expiring":
            return <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/50">Истекает</Badge>
        case "expired":
            return <Badge className="bg-red-500/20 text-red-700 border-red-500/50">Истёк</Badge>
        default:
            return <Badge variant="outline">Неизвестно</Badge>
    }
}

function InfoRow({ label, value }: { label: string; value: string | React.ReactNode }) {
    return (
        <div className="grid grid-cols-2 gap-4 py-1">
            <span className="text-sm text-muted-foreground font-medium">{label}</span>
            <span className="text-sm text-foreground">{value || "—"}</span>
        </div>
    )
}

function renderQuantityStats(stats: string | undefined | null) {
    if (!stats) return <span className="text-muted-foreground">—</span>;
    
    // Пытаемся распарсить формат "Всего (Возмещено)" или "Всего/Возмещено"
    const match = stats.match(/(\d+)(?:\s*[(\/]\s*(\d+)\s*[)]?)?/);
    
    if (!match) return <span className="font-mono font-bold">{stats}</span>;
    
    const total = match[1];
    const recovered = match[2];
    
    return (
        <div className="flex items-center justify-center gap-1.5 font-mono text-[11px]">
            <span className="font-black text-foreground" title="Общее количество лиц">{total}</span>
            {recovered && (
                <span className="text-emerald-600 font-black" title="Количество возместивших лиц">({recovered})</span>
            )}
        </div>
    );
}

function AbbreviatedText({ text }: { text: string | undefined | null }) {
    const { data: allRefs } = useAllReferences();
    const { locale } = useI18n();
    
    if (!text) return <span>—</span>;
    
    let display = text;
    let isAbbreviated = false;

    const normalize = (s: any) => {
        if (typeof s !== 'string') return '';
        return s.toLowerCase().replace(/[-\s]/g, '').trim();
    };
    const searchText = normalize(text);
    
    // Check all reference categories for abbreviations
    const refLists = [
        allRefs?.violations || [],
        allRefs?.directions || [],
        allRefs?.authorities || [],
        allRefs?.districts || []
    ];

    for (const list of refLists) {
        if (isAbbreviated) break;
        
        const ref = list.find((r: any) => {
            const rName = normalize(r.name);
            const rNameRu = normalize(r.nameRu);
            const rCode = normalize(r.code);
            
            if (rName === searchText || rNameRu === searchText || rCode === searchText) return true;
            
            // Stem matching for directions
            if (searchText.includes('финанс') && searchText.includes('хозяйств') && (rCode === 'fin' || rCode === 'fin_s')) return true;
            if (searchText.includes('материал') && searchText.includes('технич') && (rCode === 'sup' || rCode === 'sup_s')) return true;
            if (searchText.includes('кадр') && (rCode === 'pers' || rCode === 'pers_s')) return true;
            if (searchText.includes('боевой') && searchText.includes('подготов') && (rCode === 'train' || rCode === 'train_s')) return true;

            return (r.name && searchText.includes(normalize(r.name))) ||
                   (r.nameRu && searchText.includes(normalize(r.nameRu)));
        });

        if (ref) {
            const localizedAbbr = locale === "uzLatn" 
                ? ref.abbreviation_uz_latn 
                : locale === "uzCyrl" 
                    ? ref.abbreviation_uz_cyrl 
                    : ref.abbreviation;

            if (localizedAbbr) {
                const target = [ref.nameRu, ref.name, ref.name_uz_latn, ref.name_uz_cyrl]
                    .filter(Boolean)
                    .find(n => searchText.includes(normalize(n!)));
                
                if (target) {
                    // Try to preserve original string structure but replace matched part
                    // Find actual original substring that matches normalized target
                    // This is complex so we'll just replace the whole text if it's a direct match or use simple replace
                    display = localizedAbbr;
                    isAbbreviated = true;
                }
            }
        }
    }
    
    if (!isAbbreviated) return <span className="uppercase">{text}</span>;
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dotted border-muted-foreground/40 uppercase font-bold">{display}</span>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none text-[10px] py-1 px-2 font-bold max-w-75">
                    {text.toUpperCase()}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// Вспомогательный компонент для строки реестра
function RegistryRow({ label, value, subValue, isLast = false, className }: { label: string; value: React.ReactNode; subValue?: string; isLast?: boolean; className?: string }) {
    return (
        <TableRow className={cn(isLast ? "border-b-0 hover:bg-muted/30" : "hover:bg-muted/30", className)}>
            <TableCell className="py-2 px-4 text-xs font-medium text-muted-foreground w-75 border-r">
                {label}
            </TableCell>
            <TableCell className="py-2 px-4">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{value || "—"}</span>
                    {subValue && <span className="text-[10px] text-muted-foreground uppercase mt-0.5">{subValue}</span>}
                </div>
            </TableCell>
        </TableRow>
    )
}

// Вспомогательный компонент для заголовка группы в реестре
function RegistryGroupHeader({
    title,
    icon: Icon,
    colorClass,
    isExpanded = true,
    onToggle
}: {
    title: string;
    icon: any;
    colorClass: string;
    isExpanded?: boolean;
    onToggle?: () => void;
}) {
    return (
        <TableRow
            className="bg-muted/40 hover:bg-muted/50 border-y-2 cursor-pointer transition-colors"
            onClick={onToggle}
        >
            <TableCell colSpan={2} className="py-2 px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-foreground">
                        <Icon className={`h-4 w-4 ${colorClass}`} />
                        {title}
                    </div>
                    {onToggle && (
                        <Icons.ChevronDown
                            className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                !isExpanded && "-rotate-90"
                            )}
                        />
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}

/**
 * [SECURITY] SecureMaskedValue Component
 * Masks sensitive data (PINFL, Passports) by default.
 * Compliant with Security Guidance official plugin.
 */
function SecureMaskedValue({ value, label }: { value: string | undefined | null; label: string }) {
    const [isVisible, setIsVisible] = useState(false)
    if (!value) return <span className="text-muted-foreground italic font-mono text-xs">NO_DATA</span>

    const maskedValue = value.length > 4
        ? `${"*".repeat(value.length - 4)}${value.slice(-4)}`
        : "••••••••"

    return (
        <div className="flex items-center gap-2 group">
            <span className={cn(
                "font-mono text-sm tracking-tighter transition-all duration-300 px-2 py-0.5 rounded-sm border",
                isVisible
                    ? "bg-primary/5 text-primary border-primary/30"
                    : "bg-muted/50 text-muted-foreground/40 border-transparent blur-[1px] group-hover:blur-0"
            )}>
                {isVisible ? value : maskedValue}
            </span>
            <button
                type="button"
                className="p-1 text-muted-foreground hover:text-primary transition-colors outline-none"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsVisible(!isVisible)
                }}
            >
                {isVisible ? <Icons.EyeOff className="h-3.5 w-3.5" /> : <Icons.Eye className="h-3.5 w-3.5" />}
            </button>
        </div>
    )
}

function LegendaryInfoRow({
    label,
    value,
    isSecure = false,
    delay = 0,
    accent = false
}: {
    label: string
    value: any
    isSecure?: boolean
    delay?: number
    accent?: boolean
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
            className="flex flex-col sm:flex-row sm:items-center py-3 px-5 hover:bg-primary/5 transition-all border-b border-border/40 last:border-0 group"
        >
            <div className="w-full sm:w-[40%] mb-1 sm:mb-0">
                <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] group-hover:text-primary/60 transition-colors">
                    {label}
                </span>
            </div>
            <div className="w-full sm:w-[60%]">
                {isSecure ? (
                    <SecureMaskedValue value={value} label={label} />
                ) : (
                    <span className={cn(
                        "text-sm font-mono tracking-tight",
                        accent ? "text-primary font-bold" : "text-foreground font-medium"
                    )}>
                        {value || <span className="text-muted-foreground/40 italic">---</span>}
                    </span>
                )}
            </div>
        </motion.div>
    )
}

function MainInformationSection({ inspector }: { inspector: Inspector }) {
    return (
        <div className="space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <Icons.User className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">РЕЕСТР ПЕРСОНАЛЬНЫХ ДАННЫХ</h1>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">Официальная идентификация сотрудника</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Секция: ЛИЧНЫЕ ДАННЫЕ */}
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm flex flex-col transition-all hover:border-primary/30">
                    <div className="bg-muted/30 px-5 py-3 flex items-center justify-between border-b-2 border-border/60">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.15em] text-[11px]">
                            <Icons.Fingerprint className="h-4 w-4" />
                            ОСНОВНЫЕ СВЕДЕНИЯ
                        </div>
                    </div>

                    <div className="flex-1 bg-white/50">
                        <LegendaryInfoRow label="ПОЛНОЕ Ф.И.О." value={inspector.fullName} accent delay={0.1} />
                        <LegendaryInfoRow label="ДАТА РОЖДЕНИЯ" value={formatDate(inspector.dateOfBirth)} delay={0.15} />
                        <LegendaryInfoRow label="ПОЛ" value={inspector.gender === "MALE" ? "МУЖСКОЙ" : "ЖЕНСКИЙ"} delay={0.2} />
                        <LegendaryInfoRow label="НАЦИОНАЛЬНОСТЬ" value={inspector.nationality} delay={0.25} />
                        <LegendaryInfoRow label="ГРАЖДАНСТВО" value={inspector.citizenship} delay={0.3} />
                        <LegendaryInfoRow label="СЕМЕЙНОЕ ПОЛОЖЕНИЕ" value={inspector.maritalStatus} delay={0.35} />
                    </div>
                </div>

                {/* Секция: ИДЕНТИФИКАЦИЯ */}
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm flex flex-col transition-all hover:border-primary/30">
                    <div className="bg-muted/30 px-5 py-3 flex items-center justify-between border-b-2 border-border/60">
                        <div className="flex items-center gap-2 text-amber-600 font-black uppercase tracking-[0.15em] text-[11px]">
                            <Icons.ShieldCheck className="h-4 w-4" />
                            ИДЕНТИФИКАЦИОННЫЕ ДАННЫЕ
                        </div>
                    </div>

                    <div className="flex-1 bg-white/50">
                        <LegendaryInfoRow label="ПИНФЛ (14 знаков)" value={inspector.pin} isSecure delay={0.2} />
                        <LegendaryInfoRow label="СЕРИЯ И НОМЕР ПАСПОРТА" value={`${inspector.passportSeries || ""} ${inspector.passportNumber || ""}`} isSecure delay={0.25} />
                        <LegendaryInfoRow label="ОРГАН ВЫДАЧИ" value={inspector.passportIssuedBy} delay={0.3} />
                        <LegendaryInfoRow label="СРОК ДЕЙСТВИЯ" value={formatDate(inspector.passportExpiryDate)} delay={0.35} />
                    </div>
                </div>

                {/* Секция: КОНТАКТНАЯ ИНФОРМАЦИЯ */}
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm lg:col-span-2 transition-all hover:border-primary/30">
                    <div className="bg-muted/30 px-5 py-3 flex items-center justify-between border-b-2 border-border/60">
                        <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.15em] text-[11px]">
                            <Icons.PhoneCall className="h-4 w-4" />
                            КОНТАКТЫ И СВЯЗЬ
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 bg-white/50">
                        <LegendaryInfoRow label="СЛУЖЕБНЫЙ ТЕЛЕФОН" value={inspector.workPhone} delay={0.3} />
                        <LegendaryInfoRow label="ЛИЧНЫЙ ТЕЛЕФОН" value={inspector.personalPhone || (inspector as any).contactPhone} delay={0.35} />
                        <LegendaryInfoRow label="E-MAIL АДРЕС" value={inspector.email} delay={0.4} />
                    </div>
                </div>

                {/* Секция: АДРЕСА */}
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm lg:col-span-2 transition-all hover:border-primary/30">
                    <div className="bg-muted/30 px-5 py-3 flex items-center justify-between border-b-2 border-border/60">
                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.15em] text-[11px]">
                            <Icons.MapPin className="h-4 w-4" />
                            МЕСТОЖИТЕЛЬСТВО И ПРОПИСКА
                        </div>
                    </div>

                    <div className="grid grid-cols-1 bg-white/50">
                        <LegendaryInfoRow label="АДРЕС РЕГИСТРАЦИИ (ПО ПАСПОРТУ)" value={inspector.registrationAddress} delay={0.4} />
                        <LegendaryInfoRow label="ФАКТИЧЕСКИЙ АДРЕС ПРОЖИВАНИЯ" value={inspector.actualAddress} delay={0.45} />
                        <LegendaryInfoRow label="МЕСТО РОЖДЕНИЯ" value={inspector.placeOfBirth} delay={0.5} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function MilitarySection({ inspector }: { inspector: Inspector }) {
    return (
        <div className="space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <Icons.Shield className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">РЕЕСТР ВОЕННЫХ ДАННЫХ</h1>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">Служебные сведения и документы МО РУз</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Секция: СЛУЖЕБНЫЕ СВЕДЕНИЯ */}
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm flex flex-col transition-all hover:border-primary/30">
                    <div className="bg-muted/30 px-5 py-3 flex items-center justify-between border-b-2 border-border/60">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.15em] text-[11px]">
                            <Icons.Shield className="h-4 w-4" />
                            ОСНОВНЫЕ СВЕДЕНИЯ
                        </div>
                    </div>

                    <div className="flex-1 bg-white/50">
                        <LegendaryInfoRow 
                            label="ВОИНСКОЕ ЗВАНИЕ" 
                            value={<Badge variant="destructive" className="rounded-sm font-black px-3">{inspector.militaryRank.toUpperCase()}</Badge>} 
                            delay={0.1} 
                        />
                        <LegendaryInfoRow label="ВОИНСКАЯ ЧАСТЬ" value={inspector.militaryUnit} accent delay={0.15} />
                        <LegendaryInfoRow label="ВОЕННЫЙ ОКРУГ" value={inspector.militaryDistrict} delay={0.2} />
                        <LegendaryInfoRow label="ПРИКАЗ О НАЗНАЧЕНИИ" value={inspector.dislocation || "ОТСУТСТВУЕТ"} delay={0.25} />
                        <LegendaryInfoRow label="ТЕКУЩАЯ ДОЛЖНОСТЬ" value={inspector.position} delay={0.3} />
                        <LegendaryInfoRow label="ПОДРАЗДЕЛЕНИЕ / ОТДЕЛ" value={inspector.department} delay={0.35} />
                    </div>
                </div>

                {/* Секция: ВОЕННЫЕ ДОКУМЕНТЫ */}
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm flex flex-col transition-all hover:border-primary/30">
                    <div className="bg-muted/30 px-5 py-3 flex items-center justify-between border-b-2 border-border/60">
                        <div className="flex items-center gap-2 text-amber-600 font-black uppercase tracking-[0.15em] text-[11px]">
                            <Icons.FileText className="h-4 w-4" />
                            ДОКУМЕНТЫ И ДОПУСКИ
                        </div>
                    </div>

                    <div className="flex-1 bg-white/50">
                        <LegendaryInfoRow label="ВОЕННЫЙ БИЛЕТ (СЕРИЯ/№)" value={inspector.militaryID} delay={0.2} />
                        <LegendaryInfoRow label="ДАТА ВЫДАЧИ БИЛЕТА" value={formatDate(inspector.militaryIDIssueDate)} delay={0.25} />
                        <LegendaryInfoRow label="СРОК ДЕЙСТВИЯ" value={formatDate(inspector.militaryIDExpiryDate)} delay={0.3} />
                        <LegendaryInfoRow label="ЛИЧНЫЙ НОМЕР (ЖЕТОН)" value={inspector.serviceNumber} accent delay={0.35} />
                        <LegendaryInfoRow label="УРОВЕНЬ ДОПУСКА (ФОРМА)" value={inspector.clearanceLevel} delay={0.4} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ServiceSection({ inspector }: { inspector: Inspector }) {
    // Обработчики действий
    const handleAction = (action: string, type: string, id: string) => {
        alert(`${action} ${type === "contract" ? "контракта" : "записи службы"}: ${id}`)
    }

    return (
        <div className="space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <Icons.History className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">РЕЕСТР СЛУЖЕБНОГО ПУТИ</h1>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">История контрактов и кадровых перемещений</p>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-8">
                {/* Секция: КОНТРАКТЫ */}
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm">
                    <div className="bg-muted/30 px-5 py-3 border-b-2 border-border/60 flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.15em] text-[11px]">
                        <Icons.FileText className="h-4 w-4" />
                        ДЕЙСТВУЮЩИЕ И ПРОШЛЫЕ КОНТРАКТЫ
                    </div>
                    
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent border-b-2 border-border/40">
                                    <TableHead className="text-[10px] font-black tracking-widest uppercase">Серия и № контракта</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-widest uppercase text-center">Дата заключения</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-widest uppercase text-center">Дата окончания</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-widest uppercase text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inspector.contracts && inspector.contracts.length > 0 ? (
                                    inspector.contracts.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-primary/5 transition-colors group">
                                            <TableCell className="font-mono font-bold text-sm text-primary">{item.seriesAndNumber}</TableCell>
                                            <TableCell className="text-center font-mono text-sm">{formatDate(item.startDate)}</TableCell>
                                            <TableCell className="text-center font-mono text-sm">{formatDate(item.endDate)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10" onClick={() => handleAction("Просмотр", "contract", item.id)}>
                                                        <Icons.Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive hover:bg-destructive/10" onClick={() => handleAction("Удаление", "contract", item.id)}>
                                                        <Icons.Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <td colSpan={4} className="py-12 text-center text-muted-foreground/40 font-mono text-xs italic tracking-widest uppercase">Данные контрактов отсутствуют</td>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Секция: ИСТОРИЯ СЛУЖБЫ */}
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm">
                    <div className="bg-muted/30 px-5 py-3 border-b-2 border-border/60 flex items-center gap-2 text-orange-600 font-black uppercase tracking-[0.15em] text-[11px]">
                        <Icons.History className="h-4 w-4" />
                        ХРОНОЛОГИЯ ПРОХОЖДЕНИЯ СЛУЖБЫ
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent border-b-2 border-border/40">
                                    <TableHead className="text-[10px] font-black tracking-widest uppercase py-4">Войсковая часть / Округ</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-widest uppercase py-4">Должность / Отдел</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-widest uppercase text-center py-4">Приказ Л/С (Назн/Искл)</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-widest uppercase text-center py-4">Сут. приказ (Зач/Искл)</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-widest uppercase text-right py-4 pr-6">Управление</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inspector.serviceHistory && inspector.serviceHistory.length > 0 ? (
                                    inspector.serviceHistory.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-primary/5 transition-colors group">
                                            <TableCell className="py-4">
                                                <div className="text-sm font-black text-foreground uppercase tracking-tight">В/Ч {item.unit}</div>
                                                <div className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase mt-1">{item.militaryDistrict}</div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="text-sm font-bold text-foreground">{item.position}</div>
                                                <div className="text-[10px] text-primary font-medium mt-0.5">{item.subdivision}</div>
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <span className="font-mono text-[11px] bg-primary/5 px-2 rounded border border-primary/10 text-primary">{formatDate(item.personnelOrderAppointmentDate || item.startDate)}</span>
                                                    <span className="font-mono text-[11px] text-muted-foreground/60 italic">{formatDate(item.personnelOrderExclusionDate)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <span className="font-mono text-[11px] bg-muted px-2 rounded border border-border/40">{formatDate(item.dailyOrderEnrollmentDate)}</span>
                                                    <span className="font-mono text-[11px] text-muted-foreground/60 italic">{formatDate(item.dailyOrderExclusionDate)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-right pr-6">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" onClick={() => handleAction("Редактирование", "service", item.id)}>
                                                        <Icons.Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive hover:bg-destructive/10" onClick={() => handleAction("Удаление", "service", item.id)}>
                                                        <Icons.Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <td colSpan={5} className="py-12 text-center text-muted-foreground/40 font-mono text-xs italic tracking-widest uppercase">Служебные записи отсутствуют</td>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

// История ревизий (Реестр приказов)
function AuditsSection({ 
    inspector, 
    action, 
    planId 
}: { 
    inspector: Inspector, 
    action?: string | null, 
    planId?: string | null 
}) {
    const { toast } = useToast()

    // Data Fetching - filtered by inspector
    const { data: audits = [], isLoading: auditsLoading } = useFinancialAudits({ inspectorId: inspector.id })
    const { data: violations = [], isLoading: violationsLoading } = useAuditViolations()
    const { data: allRefs } = useAllReferences()

    // Mutations
    const createAudit = useCreateFinancialAudit()
    const updateAudit = useUpdateFinancialAudit()
    const createViolation = useCreateAuditViolation()
    const updateViolation = useUpdateAuditViolation()
    const deleteViolation = useDeleteAuditViolation()

    // Dialog States
    const [auditDialogOpen, setAuditDialogOpen] = useState(false)
    const [violationDialogOpen, setViolationDialogOpen] = useState(false)

    // Selection States
    const [selectedAudit, setSelectedAudit] = useState<FinancialAuditDTO | null>(null)
    const [selectedViolation, setSelectedViolation] = useState<AuditViolationDTO | null>(null)

    useEffect(() => {
        if (action === "fill-audit") {
            setAuditDialogOpen(true)
        }
    }, [action])

    const handleAddAudit = () => {
        setSelectedAudit(null)
        setAuditDialogOpen(true)
    }

    const handleEditAudit = (audit: FinancialAuditDTO) => {
        setSelectedAudit(audit)
        setAuditDialogOpen(true)
    }

    const handleSaveAudit = (data: any) => {
        // Automatically inject inspector context
        const auditData = {
            ...data,
            inspectorId: Number(inspector.id), // Ensure it's number
            inspectorName: inspector.fullName,
            prescriptionId: planId ? Number(planId) : undefined
        }

        if (selectedAudit) {
            updateAudit.mutate({ id: selectedAudit.id, data: auditData }, {
                onSuccess: () => {
                    toast({
                        title: "Данные обновлены",
                        description: "Результаты аудита успешно сохранены в базе."
                    })
                    setAuditDialogOpen(false)
                }
            })
        } else {
            createAudit.mutate(auditData, {
                onSuccess: () => {
                    toast({
                        title: "Результаты сохранены",
                        description: "Новый аудит успешно добавлен и синхронизирован с общим реестром."
                    })
                    setAuditDialogOpen(false)
                }
            })
        }
    }

    const handleAddViolation = (audit: FinancialAuditDTO) => {
        if (!audit.unit || audit.unit === "Не указан объект" || audit.unit.includes("НЕ УКАЗАН")) {
            toast({
                variant: "destructive",
                title: "Объект не указан",
                description: "Пожалуйста, сначала отредактируйте акт и укажите объект контроля (в/ч), прежде чем добавлять нарушения."
            })
            return
        }
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
                    toast({
                        title: "Нарушение обновлено",
                        description: "Данные успешно сохранены."
                    })
                    setViolationDialogOpen(false)
                }
            })
        } else {
            createViolation.mutate({ ...data, auditId: selectedAudit?.id }, {
                onSuccess: () => {
                    toast({
                        title: "Нарушение добавлено",
                        description: "Данные успешно сохранены в базе."
                    })
                    setViolationDialogOpen(false)
                }
            })
        }
    }

    const handleDeleteViolation = (id: number) => {
        if (confirm("Вы уверены, что хотите удалить это нарушение?")) {
            deleteViolation.mutate(id, {
                onSuccess: () => {
                    toast({
                        title: "Нарушение удалено",
                        description: "Запись успешно удалена из базы."
                    })
                }
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Icons.Receipt className="h-5 w-5 text-blue-600" />
                        Реестр назначенных ревизий
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">
                        Мои текущие ревизии и назначенные проверки
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="default" 
                        className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95"
                        onClick={handleAddAudit}
                    >
                        <Icons.Plus className="h-4 w-4 mr-2" />
                        Добавить результаты
                    </Button>
                </div>
            </div>

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
                hideFilters={true}
                hideHeader={true}
                hideControlBody={true}
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
        </div>
    )
}

function ResultsSection({ inspector }: { inspector: Inspector }) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const totalDetected = useMemo(() => 
        inspector.inspectionResults?.reduce((sum, r) => sum + (r.totalAmount || 0), 0) || 0,
    [inspector.inspectionResults])

    const totalRecovered = useMemo(() => 
        inspector.inspectionResults?.reduce((sum, r) => sum + (r.recoveredAmount || 0), 0) || 0,
    [inspector.inspectionResults])

    const totalRemainder = totalDetected - totalRecovered

    return (
        <div className="space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <Icons.ListChecks className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">РЕЕСТР РЕЗУЛЬТАТОВ ПРОВЕРОК</h1>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">Официальные показатели контрольно-ревизионной деятельности</p>
                    </div>
                </div>
            </motion.div>

            {/* Summary Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-card p-4 rounded-xl border-2 border-border/60 flex flex-col justify-between shadow-sm">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ПРОВЕДЕНО ПРОВЕРОК</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-black tabular-nums">{inspector.inspectionResults?.length || 0}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">АКТОВ</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-destructive/30 flex flex-col justify-between shadow-sm bg-destructive/2">
                    <span className="text-[10px] font-black text-destructive uppercase tracking-widest">ВЫЯВЛЕНО УЩЕРБА</span>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-destructive tabular-nums">{formatCurrency(totalDetected)}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">СУМ</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-emerald-500/30 flex flex-col justify-between shadow-sm bg-emerald-500/2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ВОЗМЕЩЕНО</span>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-emerald-600 tabular-nums">{formatCurrency(totalRecovered)}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">СУМ</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-amber-500/30 flex flex-col justify-between shadow-sm bg-amber-500/2">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">ОСТАТОК</span>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-amber-600 tabular-nums">{formatCurrency(totalRemainder)}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">СУМ</span>
                    </div>
                </div>
            </div>

            {inspector.inspectionResults && inspector.inspectionResults.length > 0 ? (
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-b-2 border-border/40">
                                <TableHead className="w-10"></TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4 pl-4">№ АКТА / ДАТА</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4">ОБЪЕКТ КОНТРОЛЯ</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4 text-center">ТИП</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4 text-right">СУММА НАРУШЕНИЯ</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4 text-right">ВОЗМЕЩЕНО</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4 text-center">ЛИЦ</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4 text-right pr-6">ДЕЙСТВИЯ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inspector.inspectionResults.map((result: InspectionResult) => (
                                <React.Fragment key={result.id}>
                                    <TableRow className={cn(
                                        "hover:bg-primary/5 transition-colors group border-b border-border/40",
                                        expandedRows[result.id] && "bg-primary/2"
                                    )}>
                                        <TableCell className="pl-4">
                                            <button
                                                onClick={() => toggleRow(result.id)}
                                                className={cn(
                                                    "p-1.5 rounded transition-all",
                                                    expandedRows[result.id] ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted"
                                                )}
                                            >
                                                <Icons.ChevronRight className={cn("h-4 w-4 transition-transform", expandedRows[result.id] && "rotate-90")} />
                                            </button>
                                        </TableCell>
                                        <TableCell className="py-4 pl-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-foreground uppercase tracking-tight">№ {result.actNumber}</span>
                                                <span className="text-[10px] font-mono text-muted-foreground uppercase">ОТ {result.actDate}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <div className="text-[11px] font-bold text-primary uppercase tracking-wider">{result.controlObject}</div>
                                                <div className="text-[9px] text-muted-foreground uppercase mt-0.5">{result.controlObjectRegion}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] font-black uppercase px-2 py-0 h-5 border-2",
                                                result.inspectionType === "planned" 
                                                    ? "text-blue-600 border-blue-200 bg-blue-50" 
                                                    : "text-orange-600 border-orange-200 bg-orange-50"
                                            )}>
                                                {result.inspectionType === "planned" ? "ПЛАН" : "ВПЛАН"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right py-4">
                                            <span className="text-sm font-mono font-black text-destructive">{formatCurrency(result.totalAmount)}</span>
                                        </TableCell>
                                        <TableCell className="text-right py-4">
                                            <span className="text-sm font-mono font-black text-emerald-600">{formatCurrency(result.recoveredAmount)}</span>
                                        </TableCell>
                                        <TableCell className="text-center py-4">
                                            {renderQuantityStats(result.quantityStats)}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                                                    <Icons.Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                                                    <Icons.Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* Вложенный реестр нарушений */}
                                    <AnimatePresence>
                                        {expandedRows[result.id] && (
                                            <TableRow className="hover:bg-transparent border-b border-border/40">
                                                <TableCell colSpan={7} className="p-0">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-muted/20"
                                                    >
                                                        <div className="pl-14 pr-6 py-6 space-y-4 border-l-4 border-primary/40 ml-6 my-2">
                                                            <div className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-[0.2em]">
                                                                <Icons.AlertTriangle className="h-4 w-4" />
                                                                ДЕТАЛИЗИРОВАННЫЙ ПЕРЕЧЕНЬ НАРУШЕНИЙ
                                                            </div>

                                                            <div className="rounded-lg border-2 border-border/60 bg-white overflow-hidden shadow-inner">
                                                                <Table>
                                                                    <TableHeader className="bg-muted/30">
                                                                        <TableRow className="hover:bg-transparent border-b-2 border-border/40">
                                                                            <TableHead className="text-[9px] font-black uppercase text-center w-10">№</TableHead>
                                                                            <TableHead className="text-[9px] font-black uppercase">ВИД / ТИП НАРУШЕНИЯ</TableHead>
                                                                            <TableHead className="text-[9px] font-black uppercase text-right">СУММА</TableHead>
                                                                            <TableHead className="text-[9px] font-black uppercase text-right">ВОЗМЕЩЕНО</TableHead>
                                                                            <TableHead className="text-[9px] font-black uppercase text-center">ЛИЦ</TableHead>
                                                                            <TableHead className="text-[9px] font-black uppercase">ОТВЕТСТВЕННЫЕ</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {result.violations && result.violations.length > 0 ? (
                                                                            result.violations.map((violation: InspectionViolation, vIndex: number) => (
                                                                                <TableRow key={violation.id} className="hover:bg-muted/10 border-b border-border/20 last:border-0">
                                                                                    <TableCell className="text-[11px] font-mono text-center text-muted-foreground">{vIndex + 1}</TableCell>
                                                                                    <TableCell className="py-3">
                                                                                        <div className="text-[11px] font-bold text-foreground leading-tight">
                                                                                            <AbbreviatedText text={violation.violationType} />
                                                                                        </div>
                                                                                        <div className="text-[9px] text-muted-foreground mt-0.5">
                                                                                            <AbbreviatedText text={violation.violationSubtype} />
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right font-mono text-[11px] font-black text-destructive">{formatCurrency(violation.amount)}</TableCell>
                                                                                    <TableCell className="text-right font-mono text-[11px] font-black text-emerald-600">{formatCurrency(violation.recoveredAmount)}</TableCell>
                                                                                    <TableCell className="text-center">
                                                                                        {renderQuantityStats(violation.quantityStats)}
                                                                                    </TableCell>
                                                                                    <TableCell className="py-3">
                                                                                        <div className="text-[10px] font-medium leading-tight max-w-50 truncate uppercase" title={violation.responsiblePerson}>
                                                                                            {violation.responsiblePerson}
                                                                                        </div>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow>
                                                                                <TableCell colSpan={6} className="h-12 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Нарушений не зафиксировано</TableCell>
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="bg-muted/10 border-2 border-dashed border-border/60 rounded-xl p-12 text-center">
                    <Icons.Inbox className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Результаты проверок в базе данных отсутствуют</p>
                </div>
            )}
        </div>
    )
}

// Removed legacy mock imports

// ... (existing code remains same until KpiSection)

function FinancialViolationsSection({ inspector }: { inspector: Inspector }) {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        financial: true
    })

    const { data: allViolations = [], isLoading } = useAuditViolations({ inspectorId: inspector.id })

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const overpayments = useMemo(() => 
        allViolations.filter((v: any) => v.type === "Переплата" || v.kind === "Financial"), 
    [allViolations])

    const underpayments = useMemo(() => 
        allViolations.filter((v: any) => v.type === "Недоплата"), 
    [allViolations])

    const totalDetected = useMemo(() => 
        allViolations.reduce((sum: number, v: any) => sum + Number(v.amount || 0), 0),
    [allViolations])

    const totalRecovered = useMemo(() => 
        allViolations.reduce((sum: number, v: any) => sum + Number(v.recovered || 0), 0),
    [allViolations])

    return (
        <div className="space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <Icons.TrendingDown className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">РЕЕСТР ФИНАНСОВЫХ НАРУШЕНИЙ</h1>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">Персональный учет допущенных нарушений и возмещений</p>
                    </div>
                </div>
            </motion.div>

            {/* Summary Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-card p-4 rounded-xl border-2 border-border/60 flex flex-col justify-between shadow-sm">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ВСЕГО НАРУШЕНИЙ</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-black tabular-nums">{allViolations.length}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">СЛУЧАЕВ</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-destructive/30 flex flex-col justify-between shadow-sm bg-destructive/2">
                    <span className="text-[10px] font-black text-destructive uppercase tracking-widest">СУММА УЩЕРБА</span>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-destructive tabular-nums">{formatCurrency(totalDetected)}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">СУМ</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-emerald-500/30 flex flex-col justify-between shadow-sm bg-emerald-500/2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ВОЗМЕЩЕНО</span>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-emerald-600 tabular-nums">{formatCurrency(totalRecovered)}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">СУМ</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-amber-500/30 flex flex-col justify-between shadow-sm bg-amber-500/2">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">ОСТАТОК</span>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-amber-600 tabular-nums">{formatCurrency(totalDetected - totalRecovered)}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">СУМ</span>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm">
                <div
                    className="bg-muted/20 px-6 py-4 flex items-center justify-between border-b-2 border-border/60 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleSection("financial")}
                >
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Icons.ShieldAlert className="h-4 w-4 text-primary" />
                            <span className="text-[11px] font-black text-foreground uppercase tracking-widest">ДЕТАЛИЗИРОВАННЫЙ РЕЕСТР</span>
                        </div>
                    </div>
                    <Icons.ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", !expandedSections.financial && "-rotate-90")} />
                </div>

                {expandedSections.financial && (
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-b-2 border-border/40">
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 pl-6">№ АКТА / ДАТА</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4">ОБЪЕКТ КОНТРОЛЯ</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4">ВИД / ТИП НАРУШЕНИЯ</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 text-center">ЛИЦ</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 text-right">СУММА НАРУШЕНИЯ</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 text-right">ВОЗМЕЩЕНО</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 text-center pr-6">СТАТУС</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...overpayments, ...underpayments].map((v: any) => {
                                const detected = Number(v.amount || 0)
                                const compensated = Number(v.recovered || 0)
                                const remainder = detected - compensated
                                const audit = v.financial_audits

                                return (
                                    <TableRow key={v.id} className="hover:bg-primary/5 transition-colors border-b border-border/40 last:border-0">
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-foreground uppercase tracking-tight">№ {audit?.act_number || "—"}</span>
                                                <span className="text-[9px] font-mono text-muted-foreground uppercase">ОТ {audit?.act_date ? new Date(audit.act_date).toLocaleDateString() : "—"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{audit?.unit_name || "—"}</span>
                                                <span className="text-[9px] text-muted-foreground uppercase mt-0.5">{audit?.district || "—"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <div className="text-[11px] font-bold text-primary">
                                                    <AbbreviatedText text={v.type} />
                                                </div>
                                                <div className="text-[9px] text-muted-foreground mt-0.5">
                                                    <AbbreviatedText text={v.kind === "Financial" ? 'ФИНАНСОВОЕ' : v.kind} />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-center">
                                            {renderQuantityStats(v.quantityStats || "1 (0)")}
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <span className="text-[11px] font-mono font-black text-destructive">{formatCurrency(detected)}</span>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <span className="text-[11px] font-mono font-black text-emerald-600">{formatCurrency(compensated)}</span>
                                        </TableCell>
                                        <TableCell className="py-4 text-center pr-6">
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] font-black uppercase px-2 py-0 h-5 border-2",
                                                remainder <= 0 ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-amber-600 border-amber-200 bg-amber-50"
                                            )}>
                                                {remainder <= 0 ? "ВОЗМЕЩЕНО" : "В РАБОТЕ"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}

function AssetViolationsSection({ inspector }: { inspector: Inspector }) {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        asset: true
    })

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const { data: allViolations = [], isLoading } = useAuditViolations({ inspectorId: inspector.id })

    const shortages = useMemo(() => {
        return allViolations.filter((v: any) => v.kind === "Asset")
    }, [allViolations])

    const getViolationRepayments = (violationId: number) => {
        const violation = allViolations.find((v: any) => v.id === violationId) as any
        return violation?.financial_repayments || []
    }

    const getViolationRepaidTotal = (violationId: number) => {
        const repayments = getViolationRepayments(violationId)
        return repayments.reduce((sum: number, r: any) => sum + Number(r.repaid_amount || 0), 0)
    }

    const totalDetected = shortages.reduce((sum, s) => sum + Number(s.amount || 0), 0)
    const totalCompensated = shortages.reduce((sum, s) => sum + Number(s.recovered || 0) + getViolationRepaidTotal(s.id), 0)
    const totalRemainder = totalDetected - totalCompensated

    const toggleRowExpansion = (id: number) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedRows(newExpanded)
    }

    return (
        <div className="space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <Icons.Package className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">РЕЕСТР ИМУЩЕСТВЕННЫХ НАРУШЕНИЙ</h1>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">Учет недостач и материального ущерба</p>
                    </div>
                </div>
            </motion.div>

            {/* Summary Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-card p-4 rounded-xl border-2 border-border/60 flex flex-col justify-between shadow-sm">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ВСЕГО НЕСТАЧ</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-black tabular-nums">{shortages.length}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">СЛУЧАЕВ</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-destructive/30 flex flex-col justify-between shadow-sm bg-destructive/2">
                    <span className="text-[10px] font-black text-destructive uppercase tracking-widest">СУММА НЕДОСТАЧИ</span>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-destructive tabular-nums">{formatCurrency(totalDetected)}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">СУМ</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-emerald-500/30 flex flex-col justify-between shadow-sm bg-emerald-500/2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ПОГАШЕНО</span>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-emerald-600 tabular-nums">{formatCurrency(totalCompensated)}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">СУМ</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-amber-500/30 flex flex-col justify-between shadow-sm bg-amber-500/2">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">К ВОЗМЕЩЕНИЮ</span>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-amber-600 tabular-nums">{formatCurrency(totalRemainder)}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">СУМ</span>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm">
                <div
                    className="bg-muted/20 px-6 py-4 flex items-center justify-between border-b-2 border-border/60 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleSection("asset")}
                >
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Icons.Package className="h-4 w-4 text-primary" />
                            <span className="text-[11px] font-black text-foreground uppercase tracking-widest">ДЕТАЛИЗИРОВАННЫЙ РЕЕСТР ИМУЩЕСТВА</span>
                        </div>
                    </div>
                    <Icons.ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", !expandedSections.asset && "-rotate-90")} />
                </div>

                {expandedSections.asset && (
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-b-2 border-border/40">
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 pl-6">№ АКТА / ДАТА</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4">ОБЪЕКТ КОНТРОЛЯ</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4">ВИД / ТИП НАРУШЕНИЯ</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 text-center">ЛИЦ</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 text-right">СУММА НАРУШЕНИЯ</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 text-right">ВОЗМЕЩЕНО</TableHead>
                                <TableHead className="text-[9px] font-black tracking-widest uppercase py-4 text-center pr-6">СТАТУС</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shortages.map((shortage: any) => {
                                const detected = Number(shortage.amount || 0)
                                const compensated = Number(shortage.recovered || 0) + getViolationRepaidTotal(shortage.id)
                                const remainder = detected - compensated
                                const audit = shortage.financial_audits

                                return (
                                    <TableRow key={shortage.id} className="hover:bg-primary/5 transition-colors border-b border-border/40 last:border-0">
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-foreground uppercase tracking-tight">№ {audit?.act_number || "—"}</span>
                                                <span className="text-[9px] font-mono text-muted-foreground uppercase">ОТ {audit?.act_date ? new Date(audit.act_date).toLocaleDateString() : "—"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{audit?.unit_name || "—"}</span>
                                                <span className="text-[9px] text-muted-foreground uppercase mt-0.5">{audit?.district || "—"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <div className="text-[11px] font-bold text-foreground">
                                                    <AbbreviatedText text={shortage.type} />
                                                </div>
                                                <div className="text-[9px] text-muted-foreground mt-0.5">
                                                    <AbbreviatedText text={shortage.source} />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-center">
                                            {renderQuantityStats(shortage.quantityStats || "1 (0)")}
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <span className="text-[11px] font-mono font-black text-destructive">{formatCurrency(detected)}</span>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <span className="text-[11px] font-mono font-black text-emerald-600">{formatCurrency(compensated)}</span>
                                        </TableCell>
                                        <TableCell className="py-4 text-center pr-6">
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] font-black uppercase px-2 py-0 h-5 border-2",
                                                remainder <= 0 ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-amber-600 border-amber-200 bg-amber-50"
                                            )}>
                                                {remainder <= 0 ? "ВОЗМЕЩЕНО" : "ОСТАТОК"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}



function KpiSection({ inspector }: { inspector: Inspector }) {
    return (
        <div className="space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <Icons.Chart className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">АНАЛИТИКА ЭФФЕКТИВНОСТИ (KPI)</h1>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">Автоматизированный расчет рейтинга инспектора</p>
                    </div>
                </div>
            </motion.div>

            {/* Main KPI Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-card rounded-xl border-2 border-primary/30 overflow-hidden shadow-lg flex flex-col items-center justify-center p-8 bg-linear-to-br from-primary/2 to-primary/5">
                    <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-4">ОБЩИЙ РЕЙТИНГ</div>
                    <div className="relative">
                        <div className="text-7xl font-black text-primary tracking-tighter tabular-nums">{inspector.kpiScore}%</div>
                        <div className="absolute -right-4 top-0 w-2 h-2 rounded-full bg-primary animate-ping" />
                    </div>
                    <Badge className={cn(
                        "mt-6 px-4 py-1 text-[11px] font-black uppercase tracking-widest border-2",
                        getKpiRatingColor(inspector.kpiRating)
                    )}>
                        {getKpiRatingText(inspector.kpiRating)}
                    </Badge>
                    <div className="w-full mt-8 space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                            <span>Уровень выполнения</span>
                            <span>{inspector.kpiScore}/100</span>
                        </div>
                        <Progress value={inspector.kpiScore} className="h-2 bg-muted border border-border/40" />
                    </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm">
                        <div className="bg-muted/30 px-4 py-2 border-b-2 border-border/60 text-[10px] font-black text-muted-foreground uppercase tracking-widest">КОЛИЧЕСТВЕННЫЙ АНАЛИЗ</div>
                        <div className="p-2">
                            <LegendaryInfoRow label="ПРОВЕДЕНО РЕВИЗИЙ" value={inspector.auditsCompleted} accent />
                            <LegendaryInfoRow label="ВЫЯВЛЕНО НАРУШЕНИЙ" value={inspector.violationsFound} />
                            <LegendaryInfoRow label="РЕВИЗИЙ В РАБОТЕ" value={inspector.auditsInProgress} />
                            <LegendaryInfoRow label="ЗАПЛАНИРОВАНО" value={inspector.auditsPlanned} />
                        </div>
                    </div>
                    <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm">
                        <div className="bg-muted/30 px-4 py-2 border-b-2 border-border/60 text-[10px] font-black text-muted-foreground uppercase tracking-widest">ФИНАНСОВЫЙ АНАЛИЗ</div>
                        <div className="p-2">
                            <LegendaryInfoRow 
                                label="ОБЩАЯ СУММА УЩЕРБА" 
                                value={<span className="text-destructive font-black">{formatCurrency(inspector.totalDamageAmount)}</span>} 
                            />
                            <LegendaryInfoRow 
                                label="СРЕДНИЙ УЩЕРБ / РЕВИЗИЯ" 
                                value={formatCurrency(inspector.auditsCompleted > 0 ? inspector.totalDamageAmount / inspector.auditsCompleted : 0)} 
                            />
                            <LegendaryInfoRow 
                                label="НАРУШЕНИЙ / РЕВИЗИЯ" 
                                value={(inspector.auditsCompleted > 0 ? (inspector.violationsFound / inspector.auditsCompleted).toFixed(1) : 0)} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




// Назначения в контрольные группы (Чаирмен / Член / Специалист)
function CommissionAssignmentsSection({ inspector }: { inspector: Inspector }) {
    const { data: assignments = [], isLoading } = useCommissionAssignments(inspector.id)

    const getRoleBadge = (role: string) => {
        if (role === "Главный ревизор") {
            return <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-[9px] font-black uppercase tracking-widest rounded-sm px-2">ГЛАВНЫЙ</Badge>
        }
        if (role === "Привлечённый специалист") {
            return <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-black uppercase tracking-widest rounded-sm px-2">СПЕЦИАЛИСТ</Badge>
        }
        return <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest rounded-sm px-2">РЕВИЗОР</Badge>
    }

    const getStatusBadge = (status: string) => {
        if (status === "approved") return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">УТВЕРЖДЕН</Badge>
        if (status === "in_progress") return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px] font-black uppercase tracking-widest">В РАБОТЕ</Badge>
        if (status === "draft") return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 text-[9px] font-black uppercase tracking-widest">ЧЕРНОВИК</Badge>
        return <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest">{status}</Badge>
    }

    return (
        <div className="space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <Icons.Users className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">РЕЕСТР СЛУЖЕБНЫХ ЗАДАНИЙ</h1>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">Официальные назначения в контрольные группы</p>
                    </div>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Icons.Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
                </div>
            ) : assignments.length === 0 ? (
                <div className="bg-muted/10 border-2 border-dashed border-border/60 rounded-xl p-24 text-center">
                    <Icons.Inbox className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Назначения на текущий период отсутствуют</p>
                </div>
            ) : (
                <div className="bg-card rounded-xl border-2 border-border/60 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-b-2 border-border/40">
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4 pl-6">Объект / План</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4">Роль в группе</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4">Приказ / Предписание</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4 text-center">Срок проведения</TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase py-4 text-right pr-6">Статус</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map((a) => (
                                <TableRow key={a.assignmentId} className="hover:bg-primary/5 transition-colors group border-b border-border/40 last:border-0">
                                    <TableCell className="py-4 pl-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-foreground uppercase tracking-tight">{a.controlObject}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-mono bg-primary/5 text-primary border border-primary/20 px-1.5 rounded">ID: {a.planNumber}</span>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{a.inspectionDirectionLabel}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        {getRoleBadge(a.role)}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">ПРИКАЗ:</span>
                                                <code className="text-[11px] font-black text-primary">{a.orderNumber}</code>
                                            </div>
                                            {a.prescriptionNum && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">ПРЕДПИС:</span>
                                                    <code className="text-[11px] font-bold text-blue-600">{a.prescriptionNum}</code>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-center">
                                        <span className="text-[11px] font-mono font-bold text-foreground bg-muted/50 px-2 py-1 rounded border border-border/40">{a.period}</span>
                                    </TableCell>
                                    <TableCell className="py-4 text-right pr-6">
                                        {getStatusBadge(a.status)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}


// Main component
export function InspectorSectionContent({ section, inspector, action, planId }: InspectorSectionContentProps) {
    return (
        <ErrorBoundary>
            {(() => {
                switch (section) {
                    case "personal":
                        return <MainInformationSection inspector={inspector} />
                    case "military":
                        return <MilitarySection inspector={inspector} />
                    case "service":
                        return <ServiceSection inspector={inspector} />
                    case "commission_assignments":
                        return <CommissionAssignmentsSection inspector={inspector} />
                    case "audits":
                    case "my_revisions":
                        return <AuditsSection inspector={inspector} action={action} planId={planId} />
                    case "results":
                        return <ResultsSection inspector={inspector} />
                    case "financial_violations":
                        return <FinancialViolationsSection inspector={inspector} />
                    case "asset_violations":
                        return <AssetViolationsSection inspector={inspector} />
                    case "kpi":
                        return <KpiSection inspector={inspector} />
                    default:
                        return <MainInformationSection inspector={inspector} />
                }
            })()}
        </ErrorBoundary>
    )
}
