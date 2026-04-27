"use client"

import { Personnel } from "@/components/reference/personnel"

import { EnhancedStatCard } from "@/components/enhanced-stat-card"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"



import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function KruPersonnelPage() {
  const { t } = useTranslation()
  const { data: summaryData } = useSWR('/api/personnel?isInspector=true&limit=1', fetcher)
  const summary = summaryData?.kruSummary || {}
  
  const totalCount = Object.values(summary).reduce((a: number, b: any) => a + Number(b), 0) as number
  
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50/30 min-h-screen">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t("common.home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/personnel">{t("sidebar.personnel")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("sidebar.personnel.kru.title")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center border-l-4 border-blue-600 pl-6 py-2">

        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {t("sidebar.personnel.kru.title")}
          </h1>
          <p className="text-muted-foreground">{t("sidebar.personnel.kru.description")} — Регламент №600</p>
        </div>
        <div className="flex gap-3 items-center">
           <div className="px-6 py-4 bg-white shadow-2xl shadow-blue-100/50 rounded-2xl border border-blue-100/50 flex flex-col items-end justify-center ring-1 ring-blue-50/50">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Всего в КРУ</span>
             <span className="text-4xl font-black text-blue-600 leading-none tracking-tighter">{totalCount}<span className="text-lg ml-1 text-slate-400">чел.</span></span>
           </div>
           <div className="flex flex-col gap-2">
             <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-2 shadow-sm">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Актуально
             </div>
             <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100 flex items-center gap-2 shadow-sm">
               <Icons.Users className="w-3 h-3" />
               Регламент №600
             </div>
           </div>
        </div>
      </div>


      {/* KRU Department Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <EnhancedStatCard
          title="Руководство"
          value={summary[208] || 0}
          subtitle="Командование КРУ"
          icon={Icons.Shield}
          color="blue"
          sparklineData={[5, 6, 5, 5, summary[208] || 5]}
        />
        <EnhancedStatCard
          title="Организационный"
          value={summary[20801] || 0}
          subtitle="ОМО КРУ"
          icon={Icons.Users}
          color="indigo"
          sparklineData={[10, 12, 11, 13, summary[20801] || 13]}
        />
        <EnhancedStatCard
          title="Аудит"
          value={summary[20802] || 0}
          subtitle="Отдел аудита"
          icon={Icons.FileText}
          color="green"
          sparklineData={[8, 10, 12, 11, summary[20802] || 13]}
        />
        <EnhancedStatCard
          title="Финансы"
          value={summary[20803] || 0}
          subtitle="Финансовый отдел"
          icon={Icons.Chart}
          color="cyan"
          sparklineData={[10, 9, 11, 12, summary[20803] || 12]}
        />
        <EnhancedStatCard
          title="Обеспечение"
          value={summary[20804] || 0}
          subtitle="Инспекция МТО"
          icon={Icons.Briefcase}
          color="orange"
          sparklineData={[8, 9, 10, 11, summary[20804] || 12]}
        />
      </div>

      
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Реестр личного состава КРУ</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        
        <Personnel 
          navigateOnView={true}
          initialShowOnlyInspectors={true}
          hideToggle={true}
          hideRegionalColumns={true}
        />
      </div>
    </div>
  )
}
