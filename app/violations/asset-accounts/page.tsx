"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search, Plus, Eye, Edit, Trash2, MoreHorizontal,
  Package, Calendar, Building2, UserCircle2,
  FileText, CheckCircle2, Clock, AlertCircle,
  History, Filter, Download, LayoutGrid, Info,
  ShieldCheck, ClipboardCheck, Box
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

export default function AssetAccountsPage() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")

  const t = (ru: string, uzL: string, uzC: string) => {
    if (locale === "ru") return ru;
    if (locale === "uzLatn") return uzL;
    return uzC;
  }

  const accounts = [
    {
      id: 1,
      assetType: "Вещевое имущество",
      amount: 185000000,
      caseId: "Д-2024-001",
      date: "2024-01-15",
      status: "Открыто",
      unit: "в/ч 12345",
      responsible: "Майор Хакимов А.Б."
    },
    {
      id: 2,
      assetType: "Продовольствие",
      amount: 95000000,
      caseId: "Д-2024-003",
      date: "2024-02-10",
      status: "Расследуется",
      unit: "в/ч 67890",
      responsible: "Капитан Каримов Ш.Т."
    },
    {
      id: 3,
      assetType: "ГСМ (Горюче-смазочные материалы)",
      amount: 420000000,
      caseId: "Д-2024-007",
      date: "2024-03-05",
      status: "Закрыто",
      unit: "в/ч 54321",
      responsible: "Лейтенант Назаров О.М."
    },
  ]

  const totalAmount = accounts.reduce((sum, a) => sum + a.amount, 0)
  const activeCount = accounts.filter(a => a.status !== "Закрыто").length
  const closedCount = accounts.filter(a => a.status === "Закрыто").length

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + " UZS"
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
              <Box className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {t("Лицевые счета (Ф.45/ФС)", "Shaxsiy hisobvaraqlar (F.45/FS)", "Шахсий ҳисобварақлар (Ф.45/ФС)")}
            </h2>
          </div>
          <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed pl-1">
            {t("Учёт и контроль недостач материальных ценностей", "Moddiy boyliklar kamomadi hisobi va nazorati", "Моддий бойликлар камомади ҳисоби ва назорати")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 rounded-2xl px-6 bg-white border-none shadow-xl shadow-slate-200/50 font-black uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02]">
            <Download className="h-4 w-4 mr-2" />
            {t("Экспорт", "Eksport", "Экспорт")}
          </Button>
          <Button className="h-12 rounded-2xl px-6 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-4 w-4 mr-2" />
            {t("Открыть счёт", "Hisob ochish", "Ҳисоб очиш")}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500">
                <FileText className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-indigo-50/50 border-indigo-100 text-indigo-600">
                {t("Всего", "Jami", "Жами")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{accounts.length}</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">{t("Лицевых счетов", "Shaxsiy hisoblar", "Шахсий ҳисоблар")}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-rose-50/50 border-rose-100 text-rose-600">
                {t("Сумма", "Summa", "Сумма")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{formatAmount(totalAmount)}</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">{t("Общий ущерб", "Umumiy zarar", "Умумий зарар")}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                <Clock className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-orange-50/50 border-orange-100 text-orange-600">
                {t("В работе", "Jarayonda", "Жараёнда")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{activeCount}</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">{t("Счетов активно", "Faol hisoblar", "Фаол ҳисоблар")}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-emerald-50/50 border-emerald-100 text-emerald-600">
                {t("Закрыто", "Yopilgan", "Ёпилган")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{closedCount}</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">{t("Погашено ущерба", "Zarar qoplangan", "Зарар қопланган")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
            <Input
              placeholder={t("Поиск по номеру дела, подразделению...", "Ish raqami yoki bo'linma bo'yicha qidirish...", "Иш рақами ёки бўлинма бўйича қидириш...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 w-full rounded-2xl bg-white border-none shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm"
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
                    <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Номер дела", "Ish raqami", "Иш рақами")}</TableHead>
                    <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Имущество", "Mulk", "Мулк")}</TableHead>
                    <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Подразделение / Лицо", "Bo'linma / Shaxs", "Бўлинма / Шахс")}</TableHead>
                    <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{t("Сумма", "Summa", "Сумма")}</TableHead>
                    <TableHead className="px-6 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">{t("Статус", "Holati", "Ҳолати")}</TableHead>
                    <TableHead className="w-[80px] px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">{t("Действия", "Harakatlar", "Ҳаракатлар")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id} className="group h-24 hover:bg-indigo-50/30 transition-all duration-300 border-b border-slate-50 last:border-none">
                      <TableCell className="px-8 text-center text-slate-300 font-mono text-[13px] font-black group-hover:text-indigo-300 transition-colors">
                        {account.id.toString().padStart(3, '0')}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="w-fit bg-slate-50 text-slate-600 border-slate-200 font-mono text-[12px] px-3 py-1 rounded-xl shadow-sm">
                            {account.caseId}
                          </Badge>
                          <div className="flex items-center gap-1.5 px-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {account.date}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all scale-90 border border-indigo-100/50">
                            <Package className="h-4 w-4" />
                          </div>
                          <span className="font-black text-[15px] text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                            {account.assetType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-indigo-500/60" />
                            <span className="font-black text-[14px] text-slate-700">{account.unit}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-0.5">
                            <UserCircle2 className="h-3 w-3 text-slate-400" />
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest opacity-80">
                              {account.responsible}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <span className="font-black text-[16px] text-slate-900 transition-colors">
                          {formatAmount(account.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-3 py-1 font-bold text-[11px]",
                            account.status === 'Закрыто'
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : account.status === 'Расследуется'
                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                : "bg-blue-50 text-blue-600 border-blue-100"
                          )}
                        >
                          {account.status === 'Закрыто' ? <CheckCircle2 className="h-3 w-3 mr-1.5" /> : <Clock className="h-3 w-3 mr-1.5" />}
                          {account.status}
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
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer transition-colors font-bold">
                              <Eye className="h-4 w-4 mr-2.5" />
                              {t("Просмотр деталей", "Tafsilotlar", "Тафсилотлар")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer transition-colors font-bold">
                              <History className="h-4 w-4 mr-2.5" />
                              {t("История расследования", "Tarix", "Тарих")}
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
