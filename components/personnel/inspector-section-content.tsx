import React, { useState, useCallback, useMemo, Fragment, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    useDeleteAuditViolation
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

// Вспомогательный компонент для строки реестра
function RegistryRow({ label, value, subValue, isLast = false, className }: { label: string; value: React.ReactNode; subValue?: string; isLast?: boolean; className?: string }) {
    return (
        <TableRow className={cn(isLast ? "border-b-0 hover:bg-muted/30" : "hover:bg-muted/30", className)}>
            <TableCell className="py-2 px-4 text-xs font-medium text-muted-foreground w-[300px] border-r">
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
    if (!value) return <span className="text-muted-foreground italic">не указано</span>

    const maskedValue = value.length > 4
        ? `${"*".repeat(value.length - 4)}${value.slice(-4)}`
        : "**********"

    return (
        <div className="flex items-center gap-2 group">
            <span className={cn(
                "font-mono transition-all duration-300 px-1.5 py-0.5 rounded",
                isVisible
                    ? "bg-amber-50 text-amber-900 border border-amber-200"
                    : "bg-slate-100 text-slate-400 blur-[2px] group-hover:blur-0"
            )}>
                {isVisible ? value : maskedValue}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-blue-600 transition-colors"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsVisible(!isVisible)
                }}
                title={isVisible ? "Скрыть" : "Показать"}
            >
                {isVisible ? <Icons.EyeOff className="h-3.5 w-3.5" /> : <Icons.Eye className="h-3.5 w-3.5" />}
            </Button>
        </div>
    )
}

/**
 * [DESIGN] LegendaryInfoRow Component
 * Provides a modernized, high-precision layout for data rows.
 * Compliant with Frontend Design official plugin.
 */
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
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
            className="flex flex-col sm:flex-row sm:items-center py-2.5 px-4 hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0"
        >
            <div className="w-full sm:w-1/3 mb-1 sm:mb-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    {label}
                </span>
            </div>
            <div className="w-full sm:w-2/3">
                {isSecure ? (
                    <SecureMaskedValue value={value} label={label} />
                ) : (
                    <span className={cn(
                        "text-sm font-medium",
                        accent ? "text-blue-700 font-semibold" : "text-slate-800"
                    )}>
                        {value || <span className="text-muted-foreground italic">—</span>}
                    </span>
                )}
            </div>
        </motion.div>
    )
}

// Основные данные (Объединенный раздел в формате Реестра)
function MainInformationSection({ inspector }: { inspector: Inspector }) {
    const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
        personal: true,
        passport: true,
        contacts: true,
        addresses: true
    })

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Icons.User className="text-blue-700 w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Реестр основных данных</h1>
                        <p className="text-xs text-slate-500">Персональная и идентификационная информация сотрудника</p>
                    </div>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono bg-slate-50 text-slate-500 border-slate-200">
                    ID: {inspector.id || "N/A"}
                </Badge>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Секция: ЛИЧНЫЕ ДАННЫЕ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
                >
                    <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                        <div className="flex items-center gap-2 text-blue-900 font-extrabold uppercase tracking-widest text-[11px]">
                            <Icons.Fingerprint className="h-4 w-4 text-blue-600" />
                            Личные данные
                        </div>
                    </div>

                    <div className="flex-1">
                        <LegendaryInfoRow label="Полное ФИО" value={inspector.fullName} accent delay={0.1} />
                        <LegendaryInfoRow label="Дата рождения" value={formatDate(inspector.dateOfBirth)} delay={0.15} />
                        <LegendaryInfoRow label="Пол" value={inspector.gender === "MALE" ? "Мужской" : "Женский"} delay={0.2} />
                        <LegendaryInfoRow label="Национальность" value={inspector.nationality} delay={0.25} />
                        <LegendaryInfoRow label="Гражданство" value={inspector.citizenship} delay={0.3} />
                        <LegendaryInfoRow label="Семейное положение" value={inspector.maritalStatus} delay={0.35} />
                    </div>
                </motion.div>

                {/* Секция: ПАСПОРТ И ИДЕНТИФИКАЦИЯ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
                >
                    <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                        <div className="flex items-center gap-2 text-amber-800 font-extrabold uppercase tracking-widest text-[11px]">
                            <Icons.ShieldCheck className="h-4 w-4 text-amber-600" />
                            Идентификация
                        </div>
                    </div>

                    <div className="flex-1">
                        <LegendaryInfoRow
                            label="ПИНФЛ"
                            value={inspector.pin}
                            isSecure
                            delay={0.2}
                        />
                        <LegendaryInfoRow
                            label="Паспорт"
                            value={`${inspector.passportSeries || ""} ${inspector.passportNumber || ""}`}
                            isSecure
                            delay={0.25}
                        />
                        <LegendaryInfoRow
                            label="Место выдачи"
                            value={inspector.passportIssuedBy}
                            delay={0.3}
                        />
                        <LegendaryInfoRow
                            label="Срок действия"
                            value={formatDate(inspector.passportExpiryDate)}
                            delay={0.35}
                        />
                    </div>
                </motion.div>

                {/* Секция: КОНТАКТНАЯ ИНФОРМАЦИЯ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2"
                >
                    <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                        <div className="flex items-center gap-2 text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">
                            <Icons.PhoneCall className="h-4 w-4 text-emerald-600" />
                            Средства связи
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <LegendaryInfoRow label="Служебный телефон" value={inspector.workPhone} delay={0.3} />
                        <LegendaryInfoRow label="Личный телефон" value={inspector.mobilePhone} delay={0.35} />
                        <LegendaryInfoRow label="Электронная почта" value={inspector.email} delay={0.4} />
                    </div>
                </motion.div>

                {/* Секция: АДРЕСА И МЕСТА */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2"
                >
                    <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                        <div className="flex items-center gap-2 text-indigo-900 font-extrabold uppercase tracking-widest text-[11px]">
                            <Icons.MapPin className="h-4 w-4 text-indigo-600" />
                            Адреса и локации
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <LegendaryInfoRow label="Место рождения" value={inspector.placeOfBirth} delay={0.4} />
                        <LegendaryInfoRow label="Адрес регистрации" value={inspector.registrationAddress} delay={0.45} />
                        <LegendaryInfoRow label="Фактический адрес" value={inspector.actualAddress} delay={0.5} />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

// Военные данные
function MilitarySection({ inspector }: { inspector: Inspector }) {
    const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
        basic: true,
        docs: true
    })

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Icons.Shield className="text-red-700 w-6 h-6" />
                <h1 className="text-xl font-semibold text-slate-800">Реестр военных данных</h1>
            </div>

            <div className="space-y-4">
                {/* Секция: ОСНОВНЫЕ СВЕДЕНИЯ */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div
                        className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => toggleSection("basic")}
                    >
                        <div className="flex items-center gap-2 text-red-800 font-bold uppercase tracking-wider text-sm">
                            <Icons.Shield className="h-[18px] w-[18px]" />
                            ОСНОВНЫЕ СВЕДЕНИЯ
                        </div>
                        <Icons.ChevronDown
                            className={cn(
                                "h-5 w-5 text-slate-400 transition-transform duration-200",
                                !expandedSections.basic && "-rotate-90"
                            )}
                        />
                    </div>

                    {expandedSections.basic && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 w-1/3 border-r border-slate-100">Воинское звание</td>
                                        <td className="px-4 py-4 text-sm text-slate-600"><Badge variant="destructive">{inspector.militaryRank}</Badge></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 border-r border-slate-100">Воинская часть</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{inspector.militaryUnit}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 border-r border-slate-100">Военный округ</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{inspector.militaryDistrict}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 border-r border-slate-100">Пункт дислокации</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{inspector.dislocation || "—"}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 border-r border-slate-100">Должность</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{inspector.position}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 border-r border-slate-100">Отдел</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{inspector.department}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Секция: ДОКУМЕНТЫ */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div
                        className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => toggleSection("docs")}
                    >
                        <div className="flex items-center gap-2 text-red-800 font-bold uppercase tracking-wider text-sm">
                            <Icons.FileText className="h-[18px] w-[18px]" />
                            ДОКУМЕНТЫ
                        </div>
                        <Icons.ChevronDown
                            className={cn(
                                "h-5 w-5 text-slate-400 transition-transform duration-200",
                                !expandedSections.docs && "-rotate-90"
                            )}
                        />
                    </div>

                    {expandedSections.docs && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 w-1/3 border-r border-slate-100">Военный билет</td>
                                        <td className="px-4 py-4 text-sm text-slate-600"><code className="text-xs bg-muted px-2 py-1 rounded">{inspector.militaryID}</code></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 border-r border-slate-100">Дата выдачи</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{formatDate(inspector.militaryIDIssueDate)}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 border-r border-slate-100">Действителен до</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{formatDate(inspector.militaryIDExpiryDate)}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 border-r border-slate-100">Номер службы</td>
                                        <td className="px-4 py-4 text-sm text-slate-600"><code className="text-xs bg-muted px-2 py-1 rounded">{inspector.serviceNumber}</code></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700 border-r border-slate-100">Уровень допуска</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{inspector.clearanceLevel}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Служебная информация (Формат Реестра - Репликация эталонного кода)
function ServiceSection({ inspector }: { inspector: Inspector }) {
    const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
        contracts: true,
        history: true
    })

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Обработчики действий
    const handleAction = (action: string, type: string, id: string) => {
        alert(`${action} ${type === "contract" ? "контракта" : "записи службы"}: ${id}`)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Icons.File className="text-emerald-700 w-6 h-6" />
                <h1 className="text-xl font-semibold text-slate-800">Реестр служебной информации</h1>
            </div>

            <div className="space-y-4">
                {/* Секция: КОНТРАКТЫ */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div
                        className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => toggleSection("contracts")}
                    >
                        <div className="flex items-center gap-2 text-emerald-800 font-bold uppercase tracking-wider text-sm">
                            <Icons.File className="h-[18px] w-[18px]" />
                            КОНТРАКТЫ
                        </div>
                        <Icons.ChevronDown
                            className={cn(
                                "h-5 w-5 text-slate-400 transition-transform duration-200",
                                !expandedSections.contracts && "-rotate-90"
                            )}
                        />
                    </div>

                    {expandedSections.contracts && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-slate-100">
                                        <th className="px-4 py-3 text-xs font-bold text-slate-700 uppercase">Серия и номер контракта</th>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-700 uppercase">Дата заключения контракта</th>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-700 uppercase">Дата окончания контракта</th>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-700 uppercase text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {inspector.contracts && inspector.contracts.length > 0 ? (
                                        inspector.contracts.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-4 text-sm font-medium text-slate-700">{item.seriesAndNumber}</td>
                                                <td className="px-4 py-4 text-sm text-slate-600">{formatDate(item.startDate)}</td>
                                                <td className="px-4 py-4 text-sm text-slate-600">{formatDate(item.endDate)}</td>
                                                <td className="px-4 py-4 text-sm text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleAction("Просмотр", "contract", item.id)}
                                                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded border border-blue-100 shadow-sm transition-all"
                                                        >
                                                            <Icons.Eye className="h-[18px] w-[18px]" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction("Удаление", "contract", item.id)}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-100 shadow-sm transition-all"
                                                        >
                                                            <Icons.Trash className="h-[18px] w-[18px]" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-slate-400 italic text-sm">Данные не найдены</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Секция: СЛУЖБА ПО КОНТРАКТУ */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div
                        className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => toggleSection("history")}
                    >
                        <div className="flex items-center gap-2 text-orange-700 font-bold uppercase tracking-wider text-sm">
                            <Icons.History className="h-[18px] w-[18px]" />
                            СЛУЖБА ПО КОНТРАКТУ
                        </div>
                        <Icons.ChevronDown
                            className={cn(
                                "h-5 w-5 text-slate-400 transition-transform duration-200",
                                !expandedSections.history && "-rotate-90"
                            )}
                        />
                    </div>

                    {expandedSections.history && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-slate-200">
                                        <th className="px-4 py-3 text-[11px] font-bold text-slate-700 uppercase border-r border-slate-100">
                                            Войсковая часть /<br />Военный округ
                                        </th>
                                        <th className="px-4 py-3 text-[11px] font-bold text-slate-700 uppercase border-r border-slate-100">
                                            Должность /<br />Подразделение
                                        </th>
                                        <th className="px-2 py-3 text-[10px] font-bold text-slate-700 uppercase border-r border-slate-100">
                                            Приказ Л/С<br />(назн.)
                                        </th>
                                        <th className="px-2 py-3 text-[10px] font-bold text-slate-700 uppercase border-r border-slate-100">
                                            Приказ Л/С<br />(искл.)
                                        </th>
                                        <th className="px-2 py-3 text-[10px] font-bold text-slate-700 uppercase border-r border-slate-100">
                                            Сут. приказ<br />(зач.)
                                        </th>
                                        <th className="px-2 py-3 text-[10px] font-bold text-slate-700 uppercase border-r border-slate-100">
                                            Сут. приказ<br />(искл.)
                                        </th>
                                        <th className="px-4 py-3 text-[11px] font-bold text-slate-700 uppercase">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {inspector.serviceHistory && inspector.serviceHistory.length > 0 ? (
                                        inspector.serviceHistory.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-4 border-r border-slate-50 text-center">
                                                    <div className="text-sm font-bold whitespace-nowrap text-slate-800">
                                                        Войсковая часть {item.unit}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{item.militaryDistrict || "—"}</div>
                                                </td>
                                                <td className="px-4 py-4 border-r border-slate-50 text-center">
                                                    <div className="text-sm font-bold text-slate-800">{item.position}</div>
                                                    <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{item.subdivision || "—"}</div>
                                                </td>
                                                <td className="px-2 py-4 text-xs font-medium border-r border-slate-50 text-slate-600">
                                                    {formatDate(item.personnelOrderAppointmentDate) || formatDate(item.startDate)}
                                                </td>
                                                <td className="px-2 py-4 text-xs font-medium border-r border-slate-50 text-slate-600">
                                                    {formatDate(item.personnelOrderExclusionDate) || "—"}
                                                </td>
                                                <td className="px-2 py-4 text-xs font-medium border-r border-slate-50 text-slate-600">
                                                    {formatDate(item.dailyOrderEnrollmentDate) || "—"}
                                                </td>
                                                <td className="px-2 py-4 text-xs font-medium border-r border-slate-50 text-slate-600">
                                                    {formatDate(item.dailyOrderExclusionDate) || "—"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleAction("Удаление", "service", item.id)}
                                                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                                                            title="Удалить"
                                                        >
                                                            <Icons.Trash className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction("Просмотр", "service", item.id)}
                                                            className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                                                            title="Просмотр"
                                                        >
                                                            <Icons.Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction("Редактирование", "service", item.id)}
                                                            className="p-1 text-orange-400 hover:text-orange-600 transition-colors"
                                                            title="Редактировать"
                                                        >
                                                            <Icons.Edit className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-slate-400 italic text-sm">Данные не найдены</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
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
                        Реестр результатов ревизии и проверок
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Все данные автоматически синхронизируются с общим реестром
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
                isLoading={auditsLoading || violationsLoading}
                onAddAudit={handleAddAudit}
                onEditAudit={handleEditAudit}
                onViewDetail={(audit) => window.open(`/audits/financial-activity/${audit.id}`, '_blank')}
                onAddViolation={handleAddViolation}
                onEditViolation={handleEditViolation}
                onDeleteViolation={handleDeleteViolation}
                hideFilters={true}
                hideHeader={true}
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
    const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({})

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icons.ListChecks className="h-5 w-5 text-teal-600" />
                    Реестр результатов ревизии и проверок
                </h3>
            </div>
            <Card>
                <CardContent className="p-0">
                    {inspector.inspectionResults && inspector.inspectionResults.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="w-[30px]"></TableHead>
                                    <TableHead className="w-[50px] text-xs">ID плана</TableHead>
                                    <TableHead className="text-xs">№ акта и дата</TableHead>
                                    <TableHead className="text-xs">Объект контроля</TableHead>
                                    <TableHead className="text-xs">Направление проверки</TableHead>
                                    <TableHead className="text-xs text-center">Вид проверки</TableHead>
                                    <TableHead className="text-xs text-right">Сумма нарушений</TableHead>
                                    <TableHead className="text-xs text-right">Возмещено в ходе</TableHead>
                                    <TableHead className="text-xs text-center">Количество</TableHead>
                                    <TableHead className="text-xs text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inspector.inspectionResults.map((result: InspectionResult, index: number) => (
                                    <React.Fragment key={result.id}>
                                        <TableRow className="hover:bg-muted/50 border-b-0">
                                            <TableCell>
                                                <button
                                                    onClick={() => toggleRow(result.id)}
                                                    className="p-1 hover:bg-muted rounded transition-colors"
                                                >
                                                    {expandedRows[result.id] ? (
                                                        <Icons.ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Icons.ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </button>
                                            </TableCell>
                                            <TableCell className="font-medium text-xs text-center">{result.planId}</TableCell>
                                            <TableCell className="text-xs">
                                                <div className="font-semibold">{result.actNumber}</div>
                                                <div className="text-muted-foreground text-[10px]">{result.actDate}</div>
                                            </TableCell>

                                            <TableCell className="text-xs">
                                                <div className="font-medium">{result.controlObject}</div>
                                                <div className="text-muted-foreground text-[10px]">{result.controlObjectRegion}</div>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                <div className="font-medium line-clamp-2 md:line-clamp-none" title={result.inspectionDirection}>
                                                    {result.inspectionDirection}
                                                </div>
                                                <div className="text-muted-foreground text-[10px]">{result.inspectionDepartment}</div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-normal px-2 py-0 h-5">
                                                    {result.inspectionType === "planned" ? "плановые" : "внеплановые"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-xs whitespace-nowrap">
                                                {formatCurrency(result.totalAmount)}
                                            </TableCell>
                                            <TableCell className="text-right text-green-600 font-medium text-xs whitespace-nowrap">
                                                {formatCurrency(result.recoveredAmount)}
                                            </TableCell>
                                            <TableCell className="text-center text-xs font-medium">{result.quantityStats}</TableCell>

                                            <TableCell>
                                                <div className="flex items-center justify-end gap-1">
                                                    <button className="text-muted-foreground hover:text-foreground" title="Развернуть">
                                                        <span className="text-[10px] font-medium mr-1">({result.violations?.length || 0})</span>
                                                    </button>
                                                    <button className="text-blue-600 hover:text-blue-700 p-0.5" title="Добавить">
                                                        <Icons.Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button className="text-muted-foreground hover:text-foreground p-0.5" title="Просмотр">
                                                        <Icons.Eye className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button className="text-muted-foreground hover:text-foreground p-0.5" title="Редактировать">
                                                        <Icons.Edit className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Expandable nested table row */}
                                        {expandedRows[result.id] && (
                                            <TableRow className="hover:bg-transparent bg-muted/5 border-t-0">
                                                <TableCell colSpan={10} className="p-0 border-t-0">
                                                    <div className="pl-8 pr-4 py-4 space-y-2 border-l-2 border-l-red-500 ml-5 my-1 bg-red-50/10">
                                                        <div className="flex items-center gap-2 mb-2 text-red-600 font-semibold text-sm">
                                                            <Icons.Alert className="h-4 w-4" />
                                                            Реестр выявленных нарушений
                                                        </div>

                                                        <div className="rounded-md border bg-white overflow-hidden">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow className="bg-red-50 hover:bg-red-50">
                                                                        <TableHead className="w-[40px] text-xs text-red-900">№ п/п</TableHead>
                                                                        <TableHead className="text-xs text-red-900">Вид нарушения</TableHead>
                                                                        <TableHead className="text-xs text-red-900">Тип нарушения</TableHead>
                                                                        <TableHead className="text-xs text-red-900">Источник</TableHead>
                                                                        <TableHead className="text-right text-xs text-red-900">Сумма нарушений</TableHead>
                                                                        <TableHead className="text-right text-xs text-red-900">Возмещено в ходе</TableHead>
                                                                        <TableHead className="text-center text-xs text-red-900">Количество</TableHead>
                                                                        <TableHead className="text-xs text-red-900">Виновные лица</TableHead>
                                                                        <TableHead className="text-right text-xs text-red-900">Действия</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {result.violations && result.violations.length > 0 ? (
                                                                        result.violations.map((violation: InspectionViolation, vIndex: number) => (
                                                                            <TableRow key={violation.id}>
                                                                                <TableCell className="text-xs text-center text-muted-foreground">{vIndex + 1}</TableCell>
                                                                                <TableCell className="text-xs font-medium">{violation.violationType}</TableCell>
                                                                                <TableCell className="text-xs">{violation.violationSubtype}</TableCell>
                                                                                <TableCell className="text-xs text-muted-foreground">{violation.source}</TableCell>
                                                                                <TableCell className="text-right text-xs font-bold text-red-600 whitespace-nowrap">{formatCurrency(violation.amount)}</TableCell>
                                                                                <TableCell className="text-right text-xs text-green-600 whitespace-nowrap">{formatCurrency(violation.recoveredAmount)}</TableCell>
                                                                                <TableCell className="text-center text-xs">{violation.quantityStats}</TableCell>
                                                                                <TableCell className="text-xs">
                                                                                    <div className="whitespace-pre-line text-[10px] leading-tight">
                                                                                        {violation.responsiblePerson}
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <div className="flex items-center justify-end gap-2">
                                                                                        <button className="text-amber-600 hover:text-amber-700 p-0.5" title="Детали">
                                                                                            <Icons.Shield className="h-3.5 w-3.5" />
                                                                                        </button>
                                                                                        <button className="text-red-600 hover:text-red-700 p-0.5" title="Удалить">
                                                                                            <Icons.Trash className="h-3.5 w-3.5" />
                                                                                        </button>
                                                                                        <button className="text-muted-foreground hover:text-foreground p-0.5" title="Редактировать">
                                                                                            <Icons.Edit className="h-3.5 w-3.5" />
                                                                                        </button>
                                                                                    </div>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    ) : (
                                                                        <TableRow>
                                                                            <TableCell colSpan={9} className="h-10 text-center text-xs text-muted-foreground">
                                                                                Нарушений не выявлено
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <NoDataFound description="Результаты проверок отсутствуют" />
                    )}
                </CardContent>
            </Card>
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

    const toggleRowExpansion = useCallback((id: number) => {
        setExpandedRows((prev) => {
            const newExpanded = new Set(prev)
            if (newExpanded.has(id)) {
                newExpanded.delete(id)
            } else {
                newExpanded.add(id)
            }
            return newExpanded
        })
    }, [])

    const getViolationRepayments = (violationId: number) => {
        const violation = allViolations.find((v: any) => v.id === violationId) as any
        return violation?.financial_repayments || []
    }

    const getViolationRepaidTotal = (violationId: number) => {
        const repayments = getViolationRepayments(violationId)
        return repayments.reduce((sum: number, r: any) => sum + Number(r.repaid_amount || 0), 0)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Icons.TrendingDown className="text-orange-700 w-6 h-6" />
                <h1 className="text-xl font-semibold text-slate-800">Реестр финансовых нарушений</h1>
            </div>

            {/* Summary Cards from violations/financial/page.tsx */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 print:hidden">
                <Card className="relative overflow-hidden border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-cyan-900">Всего переплат</CardTitle>
                        <div className="rounded-full bg-cyan-200 p-2 ring-2 ring-cyan-300">
                            <Icons.TrendingUp className="h-5 w-5 text-cyan-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-cyan-900">{overpayments.length}</div>
                        <p className="text-xs text-cyan-700 font-medium">Выявлено</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-sky-900">Общая сумма</CardTitle>
                        <div className="rounded-full bg-sky-200 p-2 ring-2 ring-sky-300">
                            <Icons.DollarSign className="h-5 w-5 text-sky-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-sky-900">
                            {formatCurrency(overpayments.reduce((sum, o) => sum + Number(o.amount || 0), 0))} cум
                        </div>
                        <p className="text-xs text-sky-700 font-medium">Переплачено</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-lime-200 bg-gradient-to-br from-lime-50 to-lime-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-lime-900">Возвращено</CardTitle>
                        <div className="rounded-full bg-lime-200 p-2 ring-2 ring-lime-300">
                            <Icons.Check className="h-5 w-5 text-lime-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-lime-900">
                            {overpayments.filter((o: any) => Number(o.recovered) >= Number(o.amount)).length}
                        </div>
                        <p className="text-xs text-lime-700 font-medium">Случаев</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-yellow-900">Частично</CardTitle>
                        <div className="rounded-full bg-yellow-200 p-2 ring-2 ring-yellow-300">
                            <Icons.PieChart className="h-5 w-5 text-yellow-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-900">
                            {overpayments.filter((o: any) => Number(o.recovered) > 0 && Number(o.recovered) < Number(o.amount)).length}
                        </div>
                        <p className="text-xs text-yellow-700 font-medium">Возмещено</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-red-900">В процессе</CardTitle>
                        <div className="rounded-full bg-red-200 p-2 ring-2 ring-red-300">
                            <Icons.Clock className="h-5 w-5 text-red-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-900">
                            {overpayments.filter((o: any) => Number(o.recovered) <= 0).length}
                        </div>
                        <p className="text-xs text-red-700 font-medium">Возврата</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-purple-900">Крупные</CardTitle>
                        <div className="rounded-full bg-purple-200 p-2 ring-2 ring-purple-300">
                            <Icons.AlertCircle className="h-5 w-5 text-purple-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-900">
                            {overpayments.filter((o: any) => Number(o.amount) > 5000000).length}
                        </div>
                        <p className="text-xs text-purple-700 font-medium">&gt; 5 млн сум</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div
                    className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => toggleSection("financial")}
                >
                    <div className="flex items-center gap-2 text-orange-800 font-bold uppercase tracking-wider text-sm flex-col items-start gap-0">
                        <div className="flex items-center gap-2">
                            <Icons.TrendingDown className="h-[18px] w-[18px]" />
                            Финансовые нарушения
                        </div>
                        <span className="text-[10px] text-muted-foreground font-normal normal-case ml-6">Всего записей: {overpayments.length + underpayments.length}</span>
                    </div>
                    <Icons.ChevronDown
                        className={cn(
                            "h-5 w-5 text-slate-400 transition-transform duration-200",
                            !expandedSections.financial && "-rotate-90"
                        )}
                    />
                </div>

                {expandedSections.financial && (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead className="text-center text-[11px] font-bold">ID</TableHead>
                                    <TableHead className="text-[11px] font-bold">№ акта и дата</TableHead>
                                    <TableHead className="text-[11px] font-bold">Воинская часть</TableHead>
                                    <TableHead className="text-[11px] font-bold">Выплата</TableHead>
                                    <TableHead className="text-[11px] font-bold text-center">Источник</TableHead>
                                    <TableHead className="text-[11px] font-bold text-right">Сумма</TableHead>
                                    <TableHead className="text-[11px] font-bold text-right text-green-600">Возмещено</TableHead>
                                    <TableHead className="text-[11px] font-bold text-right">Остаток</TableHead>
                                    <TableHead className="text-[11px] font-bold text-center">Статус</TableHead>
                                    <TableHead className="text-[11px] font-bold text-center w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...overpayments, ...underpayments].map((v: any) => {
                                    const repayments = getViolationRepayments(v.id)
                                    const isExpanded = expandedRows.has(v.id)
                                    const detected = Number(v.amount || 0)
                                    const compensated = Number(v.recovered || 0)
                                    const repaidExtra = getViolationRepaidTotal(v.id)
                                    const remainder = detected - compensated - repaidExtra
                                    const audit = v.financial_audits

                                    return (
                                        <Fragment key={v.id}>
                                            <TableRow className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-mono text-[11px] text-center text-muted-foreground">{v.id}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800">{audit?.act_number || "—"}</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono">{audit?.act_date ? new Date(audit.act_date).toLocaleDateString() : "—"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-[13px]">{audit?.unit_name || "—"}</span>
                                                        <span className="text-[11px] text-muted-foreground">{audit?.district || "—"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-[13px]">{v.type || "—"}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase opacity-70 tracking-tight">{v.kind === "Financial" ? 'Финансовое' : v.kind}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center text-[12px]">{v.source || "—"}</TableCell>
                                                <TableCell className="text-right font-bold text-[13px] whitespace-nowrap">
                                                    {formatCurrency(detected)} сум
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-[13px] text-green-600 whitespace-nowrap">
                                                    {formatCurrency(compensated + repaidExtra)} сум
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-[13px] whitespace-nowrap">
                                                    {formatCurrency(remainder)} сум
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={cn(
                                                        "text-[10px] font-bold px-2 py-0 h-5 border-none",
                                                        remainder <= 0 ? "bg-green-100 text-green-700" :
                                                            remainder < detected ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                                    )}>
                                                        {remainder <= 0 ? "Возвращено" : (remainder < detected ? "Частично" : "В работе")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center p-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
                                                        onClick={() => toggleRowExpansion(v.id)}
                                                    >
                                                        {isExpanded ? (
                                                            <Icons.ChevronUp className="h-4 w-4 text-slate-500" />
                                                        ) : (
                                                            <Icons.ChevronDown className="h-4 w-4 text-slate-500" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {isExpanded && repayments.length > 0 && (
                                                <TableRow className="bg-slate-50/50">
                                                    <TableCell colSpan={10} className="p-0 border-b">
                                                        <div className="p-4 bg-white/50 border-l-[4px] border-emerald-500 ml-8 my-2 rounded-r-lg shadow-sm">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                 <Icons.History className="h-4 w-4 text-emerald-600" />
                                                                 <h4 className="font-bold text-sm text-emerald-900">История погашений</h4>
                                                            </div>
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow className="bg-emerald-50/50 border-none">
                                                                        <TableHead className="h-8 text-[10px] font-bold uppercase py-0">Документ</TableHead>
                                                                        <TableHead className="h-8 text-[10px] font-bold uppercase py-0">№ и дата</TableHead>
                                                                        <TableHead className="h-8 text-[10px] font-bold uppercase py-0 text-right">Погашено</TableHead>
                                                                        <TableHead className="h-8 text-[10px] font-bold uppercase py-0 text-right">Остаток</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {repayments.map((repayment: any) => (
                                                                        <TableRow key={repayment.id} className="border-none hover:bg-emerald-50/30 transition-colors">
                                                                            <TableCell className="py-2 text-[12px]">{repayment.document_name}</TableCell>
                                                                            <TableCell className="py-2 text-[11px] font-mono">{repayment.document_number} от {repayment.document_date ? new Date(repayment.document_date).toLocaleDateString() : "—"}</TableCell>
                                                                            <TableCell className="py-2 text-right font-bold text-emerald-600 text-[12px]">
                                                                                {formatCurrency(Number(repayment.repaid_amount))} сум
                                                                            </TableCell>
                                                                            <TableCell className="py-2 text-right font-semibold text-[12px]">
                                                                                {formatCurrency(Number(repayment.remainder_after))} сум
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
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

    const formatNumber = (value: number | undefined | null): string => {
        if (value === undefined || value === null || isNaN(value)) {
            return "0"
        }
        return value.toLocaleString()
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
    const inventoryCount = shortages.filter((s: any) => s.type === "Недостача при инвентаризации").length
    // 'status' field does not exist on DB model - calculate from amount/recovered
    const writtenOffCount = shortages.filter((s: any) => Number(s.recovered || 0) >= Number(s.amount || 0)).length

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
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Icons.Package className="text-amber-700 w-6 h-6" />
                <h1 className="text-xl font-semibold text-slate-800">Реестр имущественных нарушений</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 print:hidden">
                <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Всего недостач</CardTitle>
                        <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                            <Icons.FileText className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700">{shortages.length}</div>
                        <p className="text-xs text-blue-600 mt-1">Зарегистрировано</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-900">Общая сумма</CardTitle>
                        <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                            <Icons.DollarSign className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-green-700">
                            {formatNumber(totalDetected)} cум
                        </div>
                        <p className="text-xs text-green-600 mt-1">Выявлено недостач</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-900">Возмещено</CardTitle>
                        <div className="rounded-full bg-orange-500 p-2 ring-4 ring-orange-200">
                            <Icons.TrendingUp className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-orange-700">
                            {formatNumber(totalCompensated)} cум
                        </div>
                        <p className="text-xs text-orange-600 mt-1">Погашено</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-900">Инвентаризация</CardTitle>
                        <div className="rounded-full bg-yellow-500 p-2 ring-4 ring-yellow-200">
                            <Icons.Clipboard className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-700">
                            {inventoryCount}
                        </div>
                        <p className="text-xs text-yellow-600 mt-1">Выявлено</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-900">Остаток</CardTitle>
                        <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                            <Icons.AlertCircle className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-purple-700">
                            {formatNumber(totalRemainder)} cум
                        </div>
                        <p className="text-xs text-purple-600 mt-1">К возмещению</p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-900">Списано</CardTitle>
                        <div className="rounded-full bg-slate-500 p-2 ring-4 ring-slate-200">
                            <Icons.Trash className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-700">
                            {writtenOffCount}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">Дел закрыто</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div
                    className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => toggleSection("asset")}
                >
                    <div className="flex items-center gap-2 text-amber-800 font-bold uppercase tracking-wider text-sm flex-col items-start gap-0">
                        <div className="flex items-center gap-2">
                            <Icons.Package className="h-[18px] w-[18px]" />
                            Имущественные нарушения
                        </div>
                        <span className="text-[10px] text-muted-foreground font-normal normal-case ml-6">Список имущественных нарушений закрепленных за сотрудником</span>
                    </div>
                    <Icons.ChevronDown
                        className={cn(
                            "h-5 w-5 text-slate-400 transition-transform duration-200",
                            !expandedSections.asset && "-rotate-90"
                        )}
                    />
                </div>

                {expandedSections.asset && (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead className="text-center w-[50px]">ID</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">№ акта и дата</TableHead>
                                    <TableHead className="text-center">Воинская часть</TableHead>
                                    <TableHead className="text-center">Ответственный</TableHead>
                                    <TableHead className="text-center">Виды материальных средств</TableHead>
                                    <TableHead className="text-center">Вид нарушения</TableHead>
                                    <TableHead className="text-center">Источник</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Сумма выявленная</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Сумма возмещена</TableHead>
                                    <TableHead className="text-center">Остаток</TableHead>
                                    <TableHead className="text-center">Статус</TableHead>
                                    <TableHead className="text-center">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shortages.length > 0 ? (
                                    shortages.map((shortage: any) => {
                                        const repayments = getViolationRepayments(shortage.id)
                                        const isExpanded = expandedRows.has(shortage.id)
                                        const audit = shortage.financial_audits
                                        const detected = Number(shortage.amount || 0)
                                        const compensated = Number(shortage.recovered || 0)
                                        const repaidExtra = getViolationRepaidTotal(shortage.id)
                                        const remainder = detected - compensated - repaidExtra

                                        return (
                                            <Fragment key={shortage.id}>
                                                <TableRow className="hover:bg-muted/30 transition-colors">
                                                    <TableCell className="font-mono text-center">{shortage.id}</TableCell>
                                                    <TableCell className="align-top">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium whitespace-nowrap">{audit?.act_number || "—"}</span>
                                                            <span className="text-xs text-muted-foreground">{audit?.act_date ? new Date(audit.act_date).toLocaleDateString() : "—"}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="align-top min-w-[200px]">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-[14px] font-semibold text-slate-800">
                                                                {audit?.unit_name || "—"}
                                                            </div>
                                                            <div className="text-[12px] text-muted-foreground">
                                                                {audit?.district || "—"}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-[14px] font-semibold text-slate-800">
                                                                {shortage.responsible || "—"}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-center">{shortage.source || "—"}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className="text-[10px] uppercase font-bold px-2 py-0 h-5">
                                                            {shortage.type || "—"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">{shortage.source || "—"}</TableCell>
                                                    <TableCell className="text-right font-bold whitespace-nowrap">
                                                        {formatCurrency(detected)} сум
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-green-600 whitespace-nowrap">
                                                        {formatCurrency(compensated + repaidExtra)} сум
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold whitespace-nowrap">
                                                        {formatCurrency(remainder)} сум
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={cn(
                                                            "text-[10px] font-bold px-2 py-0 h-5 border-none",
                                                            remainder <= 0 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                        )}>
                                                            {remainder <= 0 ? (shortage.status === "Списано" ? "Списано" : "Возвращено") : "В работе"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1 justify-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => toggleRowExpansion(shortage.id)}
                                                                title={isExpanded ? "Скрыть погашения" : "Показать погашения"}
                                                            >
                                                                {isExpanded ? (
                                                                    <Icons.ChevronUp className="h-4 w-4" />
                                                                ) : (
                                                                    <Icons.ChevronDown className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                {isExpanded && repayments.length > 0 && (
                                                    <TableRow className="bg-green-50/30 hover:bg-green-50/50">
                                                        <TableCell colSpan={12} className="p-0 border-t-0">
                                                            <div className="p-4 border-l-4 border-green-500 ml-4 my-2 bg-white rounded-r-md shadow-sm">
                                                                <div className="flex items-center gap-2 mb-3 text-green-800 font-semibold">
                                                                    <Icons.FileText className="h-5 w-5" />
                                                                    Реестр погашений для акта {audit?.act_number}
                                                                </div>
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow className="bg-green-100/50 hover:bg-green-100/50 h-8">
                                                                            <TableHead className="text-green-900 text-[11px] font-bold py-0">Статья ДЖ</TableHead>
                                                                            <TableHead className="text-green-900 text-[11px] font-bold py-0">Документ</TableHead>
                                                                            <TableHead className="text-green-900 text-[11px] font-bold py-0">№ и дата</TableHead>
                                                                            <TableHead className="text-green-900 text-[11px] font-bold py-0 text-right">Сумма</TableHead>
                                                                            <TableHead className="text-green-900 text-[11px] font-bold py-0 text-right">Остаток</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {repayments.map((repayment: any) => (
                                                                            <TableRow key={repayment.id} className="hover:bg-green-50/50 border-none transition-colors">
                                                                                <TableCell className="py-2 text-[13px]">{repayment.dj_article || "—"}</TableCell>
                                                                                <TableCell className="py-2 text-[13px]">{repayment.document_name}</TableCell>
                                                                                <TableCell className="py-2 text-[12px] font-mono">{repayment.document_number} от {repayment.document_date ? new Date(repayment.document_date).toLocaleDateString() : "—"}</TableCell>
                                                                                <TableCell className="py-2 text-right font-bold text-green-600 text-[13px]">
                                                                                    {formatCurrency(Number(repayment.repaid_amount))} сум
                                                                                </TableCell>
                                                                                <TableCell className="py-2 text-right font-semibold text-[13px]">
                                                                                    {formatCurrency(Number(repayment.remainder_after))} сум
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Fragment>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} className="h-24 text-center text-muted-foreground text-sm italic">
                                            Имущественных нарушений не найдено
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    )
}


function KpiSection({ inspector }: { inspector: Inspector }) {
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Icons.Chart className="h-5 w-5 text-green-600" />
                KPI показатели
            </h3>

            {/* Main KPI card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
                <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-2xl font-bold text-green-700">Общий рейтинг KPI</h4>
                            <p className="text-green-600">На основе всех показателей</p>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold text-green-600">{inspector.kpiScore}%</div>
                            <Badge className={getKpiRatingColor(inspector.kpiRating)}>
                                {getKpiRatingText(inspector.kpiRating)}
                            </Badge>
                        </div>
                    </div>
                    <Progress value={inspector.kpiScore} className="h-3 [&>div]:bg-green-500" />
                </CardContent>
            </Card>

            {/* KPI metrics */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-sm text-muted-foreground">Количественные показатели</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        <InfoRow label="Проведено ревизий (всего)" value={<span className="font-bold text-lg">{inspector.auditsCompleted}</span>} />
                        <Separator />
                        <InfoRow label="Выявлено нарушений" value={<span className="font-bold text-lg text-red-600">{inspector.violationsFound}</span>} />
                        <Separator />
                        <InfoRow label="Ревизий в работе" value={<span className="font-bold text-lg text-blue-600">{inspector.auditsInProgress}</span>} />
                        <Separator />
                        <InfoRow label="Запланировано" value={<span className="font-bold text-lg text-amber-600">{inspector.auditsPlanned}</span>} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-sm text-muted-foreground">Финансовые показатели</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        <InfoRow
                            label="Общая сумма выявленного ущерба"
                            value={<span className="font-bold text-lg text-emerald-600">{formatCurrency(inspector.totalDamageAmount)}</span>}
                        />
                        <Separator />
                        <InfoRow
                            label="Средний ущерб на ревизию"
                            value={
                                <span className="font-bold">
                                    {formatCurrency(inspector.auditsCompleted > 0 ? inspector.totalDamageAmount / inspector.auditsCompleted : 0)}
                                </span>
                            }
                        />
                        <Separator />
                        <InfoRow
                            label="Нарушений на ревизию"
                            value={
                                <span className="font-bold">
                                    {inspector.auditsCompleted > 0 ? (inspector.violationsFound / inspector.auditsCompleted).toFixed(1) : 0}
                                </span>
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}




// Назначения в контрольные группы (Чаирмен / Член / Специалист)
function CommissionAssignmentsSection({ inspector }: { inspector: Inspector }) {
    const { data: assignments = [], isLoading } = useCommissionAssignments(inspector.id)

    const getRoleBadge = (role: string, isResponsible: boolean) => {
        if (role === "Главный ревизор") {
            return <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-[10px]">Главный ревизор</Badge>
        }
        if (role === "Привлечённый специалист") {
            return <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-[10px]">Специалист</Badge>
        }
        return <Badge variant="secondary" className="text-[10px]">Ревизор</Badge>
    }

    const getStatusBadge = (status: string) => {
        if (status === "approved") return <Badge className="bg-green-500/20 text-green-700 border-green-500/30 text-[10px]">Утверждён</Badge>
        if (status === "in_progress") return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30 text-[10px]">В работе</Badge>
        if (status === "draft") return <Badge className="bg-slate-500/20 text-slate-700 border-slate-500/30 text-[10px]">Черновик</Badge>
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Icons.Users className="h-5 w-5 text-purple-600" />
                        Реестр служебных заданий и назначений
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Все сведения о командировках, приказах и предписаниях сотрудника
                    </p>
                </div>
                {!isLoading && (
                    <Badge variant="outline" className="text-purple-600 border-purple-300">
                        {assignments.length} записей
                    </Badge>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Icons.Loader2 className="h-6 w-6 animate-spin text-purple-500 mr-2" />
                    <span className="text-muted-foreground">Загрузка данных...</span>
                </div>
            ) : assignments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Icons.Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Назначений не найдено</p>
                    <p className="text-xs mt-1">Сотрудник не включён ни в одно служебное задание</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="text-[10px] font-bold text-slate-700 w-[80px]">ИД плана</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-700">Объект контроля</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-700">Направление</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-700">Роль в группе</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-700">Приказ №</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-700">Инструктаж</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-700">Предписание</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-700">Период</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-700 text-center">Статус</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map((a) => (
                                <TableRow key={a.assignmentId} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="py-2.5">
                                        <a
                                            href={`/planning/orders`}
                                            className="font-mono text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded hover:bg-purple-100 transition-colors"
                                            title={`Перейти к плану ${a.planNumber}`}
                                        >
                                            {a.planNumber}
                                        </a>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="font-semibold text-xs text-slate-800">{a.controlObject}</div>
                                        {a.controlObjectSubtitle && (
                                            <div className="text-[9px] text-slate-400 leading-tight">{a.controlObjectSubtitle}</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="text-[10px] text-slate-600 line-clamp-1" title={a.inspectionDirectionLabel || ""}>
                                            {a.inspectionDirectionLabel || "—"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        {getRoleBadge(a.role, a.isResponsible)}
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold">{a.orderNumber}</code>
                                        <div className="text-[9px] text-slate-400 mt-1">{a.orderDate}</div>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="flex items-center gap-1.5">
                                            {a.briefingDate ? (
                                                <>
                                                    <Icons.Check className="h-3 w-3 text-green-500" />
                                                    <span className="text-[10px] text-slate-600">{a.briefingDate}</span>
                                                </>
                                            ) : (
                                                <span className="text-[10px] text-slate-400">не проведён</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        {a.prescriptionNum ? (
                                            <div className="space-y-0.5">
                                                <div className="text-[10px] font-bold text-blue-700">№ {a.prescriptionNum}</div>
                                                <div className="text-[9px] text-slate-400">{a.prescriptionDate}</div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-400">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <span className="text-[10px] text-slate-600 whitespace-nowrap">{a.period}</span>
                                    </TableCell>
                                    <TableCell className="py-2.5 text-center">
                                        {getStatusBadge(a.status)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )
}
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
