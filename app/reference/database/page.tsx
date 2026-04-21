"use client"

import { useState, useEffect, useMemo } from "react"
import { Icons } from "@/components/icons"
import dynamic from "next/dynamic"

const Territories = dynamic(() => import("@/components/reference/territories").then(mod => mod.Territories), { ssr: false, loading: () => <div className="p-8 text-center text-muted-foreground">Загрузка...</div> })
const MilitaryDistricts = dynamic(() => import("@/components/reference/military-districts").then(mod => mod.MilitaryDistricts), { ssr: false })
const MilitaryUnits = dynamic(() => import("@/components/reference/military-units").then(mod => mod.MilitaryUnits), { ssr: false })
const Personnel = dynamic(() => import("@/components/reference/personnel").then(mod => mod.Personnel), { ssr: false })
const PhysicalPersons = dynamic(() => import("@/components/reference/physical-persons").then(mod => mod.PhysicalPersons), { ssr: false })
const ViolationTypes = dynamic(() => import("@/components/reference/violation-types").then(mod => mod.ViolationTypes), { ssr: false })
const DocumentTypes = dynamic(() => import("@/components/reference/document-types").then(mod => mod.DocumentTypes), { ssr: false })
const ControlTypes = dynamic(() => import("@/components/reference/control-types").then(mod => mod.ControlTypes), { ssr: false })
const ControlDirections = dynamic(() => import("@/components/reference/control-directions").then(mod => mod.ControlDirections), { ssr: false })
const MilitaryRanksTable = dynamic(() => import("@/components/reference/military-ranks-table").then(mod => mod.MilitaryRanksTable), { ssr: false })
const UnitNamesTable = dynamic(() => import("@/components/reference/unit-names-table").then(mod => mod.UnitNamesTable), { ssr: false })
const MilitaryPositionsTable = dynamic(() => import("@/components/reference/military-positions-table").then(mod => mod.MilitaryPositionsTable), { ssr: false })
const VusTable = dynamic(() => import("@/components/reference/vus-table").then(mod => mod.VusTable), { ssr: false })
const KruStructure = dynamic(() => import("@/components/reference/kru-structure").then(mod => mod.KruStructure), { ssr: false })
const ExpenseClassificationView = dynamic(() => import("@/components/reference/expense-classification-view").then(mod => mod.ExpenseClassificationView), { ssr: false })
const SupplyDepartments = dynamic(() => import("@/components/reference/supply-departments").then(mod => mod.SupplyDepartments), { ssr: false })
const TranslationManagementView = dynamic(() => import("@/components/reference/translation-management-view").then(mod => mod.TranslationManagementView), { ssr: false })
const ReferenceVerticalNav = dynamic(() => import("@/components/reference/vertical-nav").then(mod => mod.ReferenceVerticalNav), { ssr: false })

const GenericReferenceTable = dynamic(() => import("../../../components/reference/generic-reference-table").then(mod => mod.GenericReferenceTable), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-muted-foreground">Загрузка компонента...</div>
})
import { LucideIcon, Star, HelpCircle, ClipboardList, Warehouse, DollarSign, Package, Network, Globe, Languages } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

export default function ReferenceDatabasePage() {
  const { locale, setLocale } = useI18n()
  const [activeSection, setActiveSection] = useState("territories")
  const [activeGroup, setActiveGroup] = useState("org")

  const groups = useMemo(() => [
    {
      id: "org",
      title: locale === "ru" ? "Оргструктура" : locale === "uzLatn" ? "Tashkiliy tuzilma" : "Ташкилий тузилма",
      subtitle: locale === "ru" ? "Территории и части" : locale === "uzLatn" ? "Hududlar va qismlar" : "Ҳудудлар ва қисмлар",
      icon: Icons.Map
    },
    {
      id: "personnel",
      title: locale === "ru" ? "Кадры" : locale === "uzLatn" ? "Kadrlar" : "Кадры",
      subtitle: locale === "ru" ? "Реестры и данные" : locale === "uzLatn" ? "Reesterlar va ma'lumotlar" : "Реестрлар ва маълумотлар",
      icon: Icons.Users
    },
    {
      id: "audit",
      title: locale === "ru" ? "Контроль" : locale === "uzLatn" ? "Nazorat" : "Контроль",
      subtitle: locale === "ru" ? "Параметры и правила" : locale === "uzLatn" ? "Parametrlar va qoidalar" : "Параметрлар ва қоидалар",
      icon: Icons.Settings
    },
    {
      id: "translations",
      title: locale === "ru" ? "Переводы" : locale === "uzLatn" ? "Tarjimalar" : "Таржималар",
      subtitle: locale === "ru" ? "Локализация системы" : locale === "uzLatn" ? "Tizim mahalliylashtirishi" : "Тизим маҳаллийлаштириши",
      icon: Languages
    },
  ], [locale])

  const sectionsByGroup: Record<string, any[]> = useMemo(() => ({
    org: [
      { id: "territories", title: locale === "ru" ? "Области и районы" : locale === "uzLatn" ? "Viloyatlar va tumanlar" : "Вилоятлар ва туманлар", icon: Icons.Map },
      { id: "districts", title: locale === "ru" ? "Военные округа" : locale === "uzLatn" ? "Harbiy okruglar" : "Ҳарбий округлар", icon: Icons.MapPin },
      { id: "units", title: locale === "ru" ? "Воинские части" : locale === "uzLatn" ? "Harbiy qismlar" : "Ҳарбий қисмлар", icon: Icons.Building },
      { id: "unit-types", title: locale === "ru" ? "Типы воинских частей" : locale === "uzLatn" ? "Harbiy qism turlari" : "Ҳарбий qism turlari", icon: Icons.Tag },
      { id: "specialization", title: locale === "ru" ? "Специализации" : locale === "uzLatn" ? "Ixtisosliklar" : "Ихтисосликлар", icon: Icons.Activity },
      { id: "kru-structure", title: locale === "ru" ? "Структура КРУ" : locale === "uzLatn" ? "KRU tuzilmasi" : "КРУ тузилмаси", icon: Icons.Target },
    ],
    personnel: [
      { id: "people", title: locale === "ru" ? "Реестр физлиц" : locale === "uzLatn" ? "Jismoniy shaxslar reestri" : "Жисмоний шахслар реестри", icon: Icons.User },
      { id: "personnel", title: locale === "ru" ? "Личный состав" : locale === "uzLatn" ? "Shaxsiy tarkib" : "Шахсий таркиб", icon: Icons.Users },
      { id: "ranks", title: locale === "ru" ? "Воинские звания" : locale === "uzLatn" ? "Harbiy unvonlar" : "Ҳарбий унвонлар", icon: Icons.Shield },
      { id: "vus", title: locale === "ru" ? "ВУС" : locale === "uzLatn" ? "HHM (VUS)" : "ҲҲМ (ВУС)", icon: Icons.List },
      { id: "positions", title: locale === "ru" ? "Воинские должности" : locale === "uzLatn" ? "Harbiy lavozimlar" : "Ҳарбий лавозимлар", icon: Icons.User },
      { id: "education", title: locale === "ru" ? "Уровни образования" : locale === "uzLatn" ? "Ma'lumot darajalari" : "Маълумот даражалари", icon: Icons.Book },
      { id: "clearance", title: locale === "ru" ? "Допуски секретности" : locale === "uzLatn" ? "Maxfiylik ruxsatnomalari" : "Махфийлик рухсатномалари", icon: Icons.Key },
      { id: "fitness", title: locale === "ru" ? "Категории годности" : locale === "uzLatn" ? "Yaroqlilik toifalari" : "Яроқлилик тоифалари", icon: Icons.Activity },
      { id: "conduct", title: locale === "ru" ? "Поощрения и взыскания" : locale === "uzLatn" ? "Rag'batlar va jazolar" : "Рағбатлар ва жазолар", icon: Icons.Star },
      { id: "unit-names", title: locale === "ru" ? "Подразделения" : locale === "uzLatn" ? "Bo'linma nomlari" : "Бўлинма номлари", icon: Icons.Building },
      { id: "composition", title: locale === "ru" ? "Состав военнослужащих" : locale === "uzLatn" ? "Harbiy xizmatchilar tarkibi" : "Ҳарбий хизматчилар таркиби", icon: Icons.Users },
      { id: "gender", title: locale === "ru" ? "Пол" : locale === "uzLatn" ? "Jinsi" : "Жинси", icon: Icons.User },
      { id: "nationality", title: locale === "ru" ? "Национальности" : locale === "uzLatn" ? "Millatlar" : "Миллатлар", icon: Icons.Globe },
    ],
    audit: [
      { id: "expense-classification", title: locale === "ru" ? "Статьи бюджета" : locale === "uzLatn" ? "Byudjet moddalari" : "Бюджет моддалари", icon: Icons.Dollar },
      { id: "violations", title: locale === "ru" ? "Виды нарушений" : locale === "uzLatn" ? "Qonunbuzarlik turlari" : "Қонунбузарлик турлари", icon: Icons.ShieldAlert },
      { id: "funding", title: locale === "ru" ? "Источники финансирования" : locale === "uzLatn" ? "Moliyalashtirish manbalari" : "Молиялаштириш манбалари", icon: Icons.Dollar },
      { id: "assets", title: locale === "ru" ? "Виды ТМЦ" : locale === "uzLatn" ? "TMC turlari" : "ТМЦ турлари", icon: Icons.Package },
      { id: "violation-causes", title: locale === "ru" ? "Причины нарушений" : locale === "uzLatn" ? "Qonunbuzarlik sabablari" : "Қонунбузарлик сабаблари", icon: Icons.Alert },
      { id: "inspections", title: locale === "ru" ? "Виды инспекций" : locale === "uzLatn" ? "Inspektsiya turlari" : "Инспекция турлари", icon: Icons.Clipboard },
      { id: "audit-objects", title: locale === "ru" ? "Объекты аудита" : locale === "uzLatn" ? "Audit ob'ektlari" : "Аудит объектлари", icon: Icons.Warehouse },
      { id: "documents", title: locale === "ru" ? "Типы документов" : locale === "uzLatn" ? "Hujjat turlari" : "Ҳужжат турлари", icon: Icons.File },
      { id: "control-types", title: locale === "ru" ? "Виды контроля" : locale === "uzLatn" ? "Nazorat turlari" : "Назорат турлари", icon: Icons.Check },
      { id: "control-directions", title: locale === "ru" ? "Направления контроля" : locale === "uzLatn" ? "Nazorat yo'nalishlari" : "Назорат йўналишлари", icon: Icons.MapPin },
      { id: "check-statuses", title: locale === "ru" ? "Статусы инспекций" : locale === "uzLatn" ? "Inspektsiya holatlari" : "Инспекция ҳолатлари", icon: Icons.Activity },
      { id: "check-types", title: locale === "ru" ? "Типы инспекций" : locale === "uzLatn" ? "Inspektsiya turlari" : "Инспекция турлари", icon: Icons.Tag },
      { id: "severity", title: locale === "ru" ? "Степени серьезности" : locale === "uzLatn" ? "Jiddiylik darajalari" : "Жиддийлик даражалари", icon: Icons.Alert },
      { id: "violation-statuses", title: locale === "ru" ? "Статусы нарушений" : locale === "uzLatn" ? "Qonunbuzarlik holatlari" : "Қонунбузарлик ҳолатлари", icon: Icons.ShieldAlert },
      { id: "decision-statuses", title: locale === "ru" ? "Статусы решений" : locale === "uzLatn" ? "Qaror holatlari" : "Қарор ҳолатлари", icon: Icons.Check },
      { id: "decision-execution", title: locale === "ru" ? "Статусы исполнения принятых решений" : locale === "uzLatn" ? "Qabul qilingan qarorlarning ijro holatlari" : "Қабул қилинган қарорларнинг ижро ҳолатлари", icon: Icons.CheckCircle },
      { id: "supply-departments", title: locale === "ru" ? "Довольствующие управления" : locale === "uzLatn" ? "Dovollantiruvchi boshqarmalar" : "Доволлантирувчи бошқармалар", icon: Icons.Building },
    ],
    translations: [
      { id: "all", title: locale === "ru" ? "Все ресурсы" : "Barcha resurslar", icon: Languages },
      { id: "dashboard", title: locale === "ru" ? "Главная" : "Bosh sahifa", icon: Icons.Home },
      { id: "planning", title: locale === "ru" ? "Планирование КРР" : "KRR rejalashtirish", icon: Icons.Clipboard },
      { id: "audit", title: locale === "ru" ? "Проведение ревизии" : "Reviziya o'tkazish", icon: Icons.Settings },
      { id: "kpi", title: locale === "ru" ? "KPI Сотрудников" : "Xodimlar KPI", icon: Icons.Activity },
      { id: "violations", title: locale === "ru" ? "Учёт нарушений" : "Qonunbuzarliklar hisobi", icon: Icons.ShieldAlert },
      { id: "cards", title: locale === "ru" ? "Карточки" : "Kartochkalar", icon: Icons.FileText },
      { id: "reports", title: locale === "ru" ? "Отчётность" : "Hisobotlar", icon: Icons.PieChart },
      { id: "reference", title: locale === "ru" ? "Справочники" : "Ma'lumotlar", icon: Icons.Book },
      { id: "admin", title: locale === "ru" ? "Администрирование" : "Ma'murlash", icon: Icons.Users },
      { id: "training", title: locale === "ru" ? "Обучение системе" : "Tizimda o'qitish", icon: HelpCircle },
      { id: "common", title: locale === "ru" ? "Общие ресурсы" : "Umumiy resurslar", icon: Icons.Globe },
    ],
  }), [locale])

  const handleGroupChange = (groupId: string) => {
    setActiveGroup(groupId)
    const firstSection = sectionsByGroup[groupId][0].id
    setActiveSection(firstSection)
  }

  const getLocalizedValue = (item: any) => {
    if (!item) return ""

    // Check if the name itself is an object (common for DB-sourced localized JSON)
    if (item.name && typeof item.name === 'object' && !Array.isArray(item.name)) {
      const nameObj = item.name;
      if (locale === "uzLatn") return nameObj.uz || nameObj.ru || "";
      if (locale === "uzCyrl") return nameObj.uzk || nameObj.ru || "";
      return nameObj.ru || "";
    }

    // Fallback for objects with separate language fields
    if (locale === "uzLatn") return item.name_uz_latn || item.name || ""
    if (locale === "uzCyrl") return item.name_uz_cyrl || item.name || ""
    return item.name || ""
  }

  const renderSectionContent = () => {
    if (activeGroup === "translations") {
      return <TranslationManagementView selectedModule={activeSection} />
    }

    switch (activeSection) {
      case "territories": return <Territories />
      case "districts": return <MilitaryDistricts />
      case "units": return <MilitaryUnits />
      case "unit-types": return <GenericReferenceTable classifierId={7} icon={<Icons.Tag className="h-6 w-6 text-primary" />} />
      case "specialization": return <GenericReferenceTable classifierId={10} icon={<Icons.Activity className="h-6 w-6 text-primary" />} />
      case "people": return <PhysicalPersons />
      case "personnel": return <Personnel />
      case "ranks": return <MilitaryRanksTable />
      case "vus": return <VusTable />
      case "positions": return <MilitaryPositionsTable />
      case "unit-names": return <UnitNamesTable />
      case "kru-structure": return <KruStructure />
      case "composition": return <GenericReferenceTable classifierId={11} icon={<Icons.Users className="h-6 w-6 text-primary" />} />
      case "gender": return <GenericReferenceTable classifierId={8} icon={<Icons.User className="h-6 w-6 text-primary" />} />
      case "nationality": return <GenericReferenceTable classifierId={9} icon={<Icons.Globe className="h-6 w-6 text-primary" />} />
      case "education": return <GenericReferenceTable classifierId={18} icon={<Icons.Book className="h-6 w-6 text-primary" />} />
      case "clearance": return <GenericReferenceTable classifierId={19} icon={<Icons.Key className="h-6 w-6 text-primary" />} />
      case "fitness": return <GenericReferenceTable classifierId={20} icon={<Icons.Activity className="h-6 w-6 text-primary" />} />
      case "conduct": return <GenericReferenceTable classifierId={21} icon={<Icons.Trophy className="h-6 w-6 text-primary" />} />
      case "violations": return <ViolationTypes />
      case "expense-classification": return <ExpenseClassificationView />
      case "funding": return <GenericReferenceTable classifierId={15} icon={<Icons.Dollar className="h-6 w-6 text-primary" />} />
      case "assets": return <GenericReferenceTable classifierId={16} icon={<Icons.Package className="h-6 w-6 text-primary" />} />
      case "violation-causes": return <GenericReferenceTable classifierId={17} icon={<Icons.Alert className="h-6 w-6 text-primary" />} />
      case "inspections": return <GenericReferenceTable classifierId={23} icon={<Icons.Clipboard className="h-6 w-6 text-primary" />} />
      case "audit-objects": return <GenericReferenceTable classifierId={22} icon={<Icons.Warehouse className="h-6 w-6 text-primary" />} />
      case "documents": return <DocumentTypes />
      case "control-types": return <ControlTypes />
      case "control-directions": return <ControlDirections />
      case "check-statuses": return <GenericReferenceTable classifierId={1} icon={<Icons.Activity className="h-6 w-6 text-primary" />} />
      case "check-types": return <GenericReferenceTable classifierId={2} icon={<Icons.Tag className="h-6 w-6 text-primary" />} />
      case "severity": return <GenericReferenceTable classifierId={3} icon={<Icons.Alert className="h-6 w-6 text-primary" />} />
      case "violation-statuses": return <GenericReferenceTable classifierId={4} icon={<Icons.ShieldAlert className="h-6 w-6 text-primary" />} />
      case "decision-statuses": return <GenericReferenceTable classifierId={5} icon={<Icons.Check className="h-6 w-6 text-primary" />} />
      case "decision-execution": return <GenericReferenceTable classifierId={5} icon={<Icons.CheckCircle className="h-6 w-6 text-primary" />} />
      case "supply-departments": return <SupplyDepartments />
      case "all":
      case "dashboard":
      case "planning":
      case "audit":
      case "kpi":
      case "violations":
      case "cards":
      case "reports":
      case "reference":
      case "admin":
      case "training":
      case "common":
        return <TranslationManagementView selectedModule={activeSection} />
      default: return null
    }
  }

  return (
    <div className="w-full min-h-screen pb-10">
      {/* HEADER SECTION - Separate Div */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b pb-6 px-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            {locale === "ru" ? "Справочная база" : locale === "uzLatn" ? "Ma'mulotlar bazasi" : "Маълумотлар базаси"}
          </h1>
          <p className="text-muted-foreground text-lg mt-1 leading-tight">
            {locale === "ru" ? "Управление системными данными и реестрами КРУ"
              : locale === "uzLatn" ? "KRU tizim ma'mulotlari va reestrlarini boshqarish"
                : "КРУ тизим маълумотлари ва реестрларини бошқариш"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-muted/30 p-1.5 rounded-2xl border backdrop-blur-sm shadow-inner overflow-x-auto max-w-full">
            {groups.map((group) => {
              const isActive = activeGroup === group.id
              return (
                <button
                  key={group.id}
                  onClick={() => handleGroupChange(group.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02] font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <group.icon className={cn("h-4 w-4", isActive ? "animate-pulse" : "")} />
                  <div className="flex flex-col items-start leading-none text-left">
                    <span className="text-sm font-medium">{group.title}</span>
                    <span className={cn("text-[10px] opacity-70 font-normal", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {group.subtitle}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col lg:flex-row px-4 min-h-[calc(100vh-250px)]">
        {/* Navigation Sidebar Container */}
        <div className="lg:pr-6 lg:border-r border-border/40 pb-10 lg:pb-0">
          <ReferenceVerticalNav
            items={sectionsByGroup[activeGroup]}
            activeId={activeSection}
            onChange={setActiveSection}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-8 w-full pt-6 lg:pt-0">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  )
}
