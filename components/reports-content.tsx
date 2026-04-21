"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"
import { StandardReports } from "@/components/reports/standard-reports"
import { CustomReports } from "@/components/reports/custom-reports"
import { AnalyticsDashboard } from "@/components/reports/analytics-dashboard"
import { FileText, BarChart3, Settings, TrendingUp } from "lucide-react"

export function ReportsContent() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Отчетность и аналитика</h1>
        <p className="text-muted-foreground mt-2">Формирование отчетов и анализ данных контрольно-ревизионной работы</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Панель отчетов
          </TabsTrigger>
          <TabsTrigger value="standard" className="gap-2">
            <FileText className="h-4 w-4" />
            Типовые отчеты
          </TabsTrigger>
          <TabsTrigger value="custom" className="gap-2">
            <Settings className="h-4 w-4" />
            Настраиваемые отчеты
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Аналитика
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <ReportsDashboard />
        </TabsContent>

        <TabsContent value="standard" className="space-y-6">
          <StandardReports />
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <CustomReports />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
