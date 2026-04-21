"use client"

import type { User } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DecisionsList } from "@/components/decisions/decisions-list"
import { CorrectiveActions } from "@/components/decisions/corrective-actions"
import { DeadlineTracking } from "@/components/decisions/deadline-tracking"
import { ImplementationStatus } from "@/components/decisions/implementation-status"
import { Icons } from "@/components/icons"

interface DecisionsContentProps {
  user: User
}

export function DecisionsContent({ user }: DecisionsContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
          <Icons.Gavel className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Контроль решений</h1>
          <p className="text-muted-foreground">Мониторинг исполнения решений по результатам ревизий</p>
        </div>
      </div>

      <Tabs defaultValue="decisions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
          <TabsTrigger value="decisions" className="gap-2">
            <Icons.Gavel className="w-4 h-4" />
            Решения
          </TabsTrigger>
          <TabsTrigger value="actions" className="gap-2">
            <Icons.Check className="w-4 h-4" />
            Мероприятия
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="gap-2">
            <Icons.Calendar className="w-4 h-4" />
            Сроки
          </TabsTrigger>
          <TabsTrigger value="status" className="gap-2">
            <Icons.Chart className="w-4 h-4" />
            Исполнение
          </TabsTrigger>
        </TabsList>

        <TabsContent value="decisions">
          <DecisionsList user={user} />
        </TabsContent>

        <TabsContent value="actions">
          <CorrectiveActions user={user} />
        </TabsContent>

        <TabsContent value="deadlines">
          <DeadlineTracking user={user} />
        </TabsContent>

        <TabsContent value="status">
          <ImplementationStatus user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
