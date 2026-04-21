"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnifiedPlansRegistry } from "./unified-plans-registry"
import { UnifiedOrdersRegistry } from "./unified-orders-registry"
import { UnplannedAuditsRegistry } from "./unplanned-audits-registry"
import { EmployeeRegistry } from "@/components/reference/employee-registry"
import { AuditResultsRegistry } from "@/components/audits/audit-results-registry"
import { Calendar, FileText, AlertTriangle, Users, BarChart3 } from "lucide-react"

interface OptimizedPlanningContentProps {
  user: User
}

export function OptimizedPlanningContent({ user }: OptimizedPlanningContentProps) {
  const [activeTab, setActiveTab] = useState("plans")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Планирование КРР</h1>
          <p className="text-muted-foreground mt-2">
            Единая система управления планированием, приказами и результатами контрольно-ревизионной работы
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="plans" className="gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Планы</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Приказы</span>
          </TabsTrigger>
          <TabsTrigger value="unplanned" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Внеплановые</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Сотрудники</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Результаты</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <UnifiedPlansRegistry user={user} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <UnifiedOrdersRegistry user={user} />
        </TabsContent>

        <TabsContent value="unplanned" className="space-y-4">
          <UnplannedAuditsRegistry user={user} />
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <EmployeeRegistry user={user} />
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <AuditResultsRegistry user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
