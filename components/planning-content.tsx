"use client"

import type { User } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeRegistry } from "@/components/reference/employee-registry"
import { Icons } from "@/components/icons"

interface PlanningContentProps {
  user: User
}

export function PlanningContent({ user }: PlanningContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Icons.Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Планирование КРР</h1>
          <p className="text-muted-foreground">
            Единая система управления планами, приказами, внеплановыми ревизиями и результатами
          </p>
        </div>
      </div>

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 lg:grid-cols-3 lg:w-fit">
          <TabsTrigger value="employees" className="gap-2">
            <Icons.Users className="w-4 h-4" />
            Сотрудники
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <EmployeeRegistry user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
