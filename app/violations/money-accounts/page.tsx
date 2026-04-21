"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search, Plus, Eye, Edit, Trash2, MoreHorizontal,
  DollarSign, Calendar, Building2, UserCircle2,
  FileText, CheckCircle2, Clock, AlertCircle,
  ArrowUpRight, ArrowDownLeft, Wallet, Receipt,
  History, Filter, Download, LayoutGrid, Info
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

export default function MoneyAccountsPage() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")

  const t = (ru: string, uzL: string, uzC: string) => {
    if (locale === "ru") return ru;
    if (locale === "uzLatn") return uzL;
    return uzC;
  }

  const shortages = [
    {
      id: 1,
      actNumber: "АКТ-2024-001",
      detectionDate: "15.01.2024",
      militaryUnit: "в/ч 12345",
      responsiblePerson: "Капитан Иванов И.И.",
      detectedAmount: 125000000,
      recoveryAmount: 125000000,
      compensatedAmount: 40000000,
      status: "Удерживается",
      prescriptionNumber: "ПР-2024-015",
      recoveryDate: "20.02.2024",
      basisDocument: "Акт ревизии №45 от 10.01.2024",
      note: "Ежемесячное удержание 20%",
    },
    {
      id: 2,
      actNumber: "АКТ-2023-089",
      detectionDate: "05.11.2023",
      militaryUnit: "в/ч 67890",
      responsiblePerson: "Майор Петров П.П.",
      detectedAmount: 280000000,
      recoveryAmount: 280000000,
      compensatedAmount: 280000000,
      status: "Погашено",
      prescriptionNumber: "ПР-2023-142",
      recoveryDate: "15.12.2023",
      basisDocument: "Приказ командира №234 от 01.11.2023",
      note: "Полностью возмещено",
    },
    {
      id: 3,
      actNumber: "АКТ-2024-012",
      detectionDate: "20.02.2024",
      militaryUnit: "в/ч 54321",
      responsiblePerson: "Рядовой Сидоров С.С.",
      detectedAmount: 45000000,
      recoveryAmount: 45000000,
      compensatedAmount: 0,
      status: "Открыто",
      prescriptionNumber: "ПР-2024-028",
      recoveryDate: "",
      basisDocument: "Акт инвентаризации №12 от 18.02.2024",
      note: "Ожидается начало взыскания",
    },
  ]

  const totalDetected = shortages.reduce((sum, s) => sum + s.detectedAmount, 0)
  const totalCompensated = shortages.reduce((sum, s) => sum + s.compensatedAmount, 0)
  const totalBalance = totalDetected - totalCompensated

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + " UZS"
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/20">
              <Wallet className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {t("Недостачи денежных средств", "Pul mablag'lari kamomadi", "Пул маблағлари камомади")}
            </h2>
          </div>
          <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed pl-1">
            {t("Реестр и контроль возмещения выявленного ущерба", "Aniqlangan zararni qoplash reyestri va nazorati", "Аниқланган зарарни қоплаш реестри ва назорати")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 rounded-2xl px-6 bg-white border-none shadow-xl shadow-slate-200/50 font-black uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02]">
            <Download className="h-4 w-4 mr-2" />
            {t("Экспорт", "Eksport", "Экспорт")}
          </Button>
          <Button className="h-12 rounded-2xl px-6 bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-4 w-4 mr-2" />
            {t("Добавить", "Qo'shish", "Қўшиш")}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-orange-50/50 border-orange-100 text-orange-600">
                {t("Выявлено", "Aniqlangan", "Аниқланган")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{formatAmount(totalDetected)}</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">{t("Общая сумма ущерба", "Umumiy zarar summasi", "Умумий зарар суммаси")}</p>
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-emerald-50/50 border-emerald-100 text-emerald-600">
                {t("Возмещено", "Qoplangan", "Қопланган")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{formatAmount(totalCompensated)}</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">
              {((totalCompensated / totalDetected) * 100).toFixed(1)}% {t("от общей суммы", "umumiy summadan", "умумий суммадан")}
            </p>
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${(totalCompensated / totalDetected) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
                <Clock className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-blue-50/50 border-blue-100 text-blue-600">
                {t("Остаток", "Qoldiq", "Қолдиқ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{formatAmount(totalBalance)}</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">{t("К взысканию", "Undirilishi kerak", "Ундирилиши керак")}</p>
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${(totalBalance / totalDetected) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-rose-600 transition-colors" />
            <Input
              placeholder={t("Поиск по акту, части или лицу...", "Akt, qism yoki shaxs bo'yicha qidirish...", "Акт, қисм ёки шахс бўйича қидириш...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 w-full rounded-2xl bg-white border-none shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-rose-500/10 transition-all font-bold text-sm"
            />
          </div>
          <Button variant="outline" className="h-12 rounded-2xl px-6 bg-white border-none shadow-xl shadow-slate-200/50 font-black uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02]">
            <Filter className="h-4 w-4 mr-2" />
            {t("Фильтры", "Filtrlar", "Фильтрлар")}
          </Button>
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100 h-20 bg-slate-50/50">
                    <TableHead className="w-[80px] px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">ID</TableHead>
                    <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Основание", "Asos", "Асос")}</TableHead>
                    <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Подразделение / Лицо", "Bo'linma / Shaxs", "Бўлинма / Шахс")}</TableHead>
                    <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Сумма ущерба", "Zarar summasi", "Зарар суммаси")}</TableHead>
                    <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">{t("Статус", "Holati", "Ҳолати")}</TableHead>
                    <TableHead className="w-[80px] px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">{t("Действия", "Harakatlar", "Ҳаракатлар")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shortages.map((shortage) => (
                    <TableRow key={shortage.id} className="group h-24 hover:bg-rose-50/30 transition-all duration-300 border-b border-slate-50 last:border-none">
                      <TableCell className="px-8 text-center text-slate-300 font-mono text-[13px] font-black group-hover:text-rose-300 transition-colors">
                        {shortage.id.toString().padStart(3, '0')}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-[15px] text-slate-800 tracking-tight">
                            {shortage.actNumber}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {shortage.detectionDate}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-rose-500/60" />
                            <span className="font-black text-[14px] text-slate-700">{shortage.militaryUnit}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-0.5">
                            <UserCircle2 className="h-3 w-3 text-slate-400" />
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest opacity-80">
                              {shortage.responsiblePerson}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-4 max-w-[200px]">
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{t("Всего", "Hammasi", "Жами")}</span>
                            <span className="font-black text-[14px] text-slate-900">{formatAmount(shortage.detectedAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 max-w-[200px]">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t("Возмещено", "Qoplangan", "Қопланган")}</span>
                            <span className="font-bold text-[13px] text-emerald-600">{formatAmount(shortage.compensatedAmount)}</span>
                          </div>
                          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${(shortage.compensatedAmount / shortage.detectedAmount) * 100}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-3 py-1 font-bold text-[11px]",
                            shortage.status === 'Погашено'
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : shortage.status === 'Удерживается'
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-orange-50 text-orange-600 border-orange-100"
                          )}
                        >
                          {shortage.status === 'Погашено' ? <CheckCircle2 className="h-3 w-3 mr-1.5" /> : <Clock className="h-3 w-3 mr-1.5" />}
                          {shortage.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-lg">
                              <MoreHorizontal className="h-5 w-5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64 rounded-2xl border-none shadow-2xl p-2 bg-white/95 backdrop-blur-xl">
                            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("Управление", "Boshqarish", "Бошқариш")}</DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-rose-50 focus:text-rose-600 cursor-pointer transition-colors font-bold">
                              <Eye className="h-4 w-4 mr-2.5" />
                              {t("Просмотр деталей", "Tafsilotlar", "Тафсилотлар")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer transition-colors font-bold">
                              <History className="h-4 w-4 mr-2.5" />
                              {t("История взысканий", "Undirish tarixi", "Ундириш тарихи")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100 my-1" />
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-slate-50 cursor-pointer transition-colors font-bold">
                              <Edit className="h-4 w-4 mr-2.5" />
                              {t("Редактировать", "Tahrirlash", "Таҳрирлаш")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-rose-50 focus:text-rose-600 text-rose-500 cursor-pointer transition-colors font-bold">
                              <Trash2 className="h-4 w-4 mr-2.5" />
                              {t("Удалить запись", "O'chirish", "Ўчириш")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
