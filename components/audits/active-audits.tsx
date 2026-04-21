"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { useActiveAudits } from "@/lib/hooks/use-audits"
import type { ActiveAuditDTO } from "@/lib/types/audits.dto"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { NoDataFound, NoSearchResults } from "@/components/ui/empty-state"
import { ErrorBoundary } from "@/components/error-boundary"

interface ActiveAuditsProps {
  user: User
}

export function ActiveAudits({ user }: ActiveAuditsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: audits = [], isLoading } = useActiveAudits()

  const filteredAudits = audits.filter(
    (audit: ActiveAuditDTO) =>
      audit.order_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.unit_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.unit_code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge className="bg-blue-600">В процессе</Badge>
      case "completed":
        return <Badge className="bg-green-600">Завершена</Badge>
      case "suspended":
        return <Badge variant="destructive">Приостановлена</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Активные ревизии</CardTitle>
        <CardDescription>Текущие контрольно-ревизионные мероприятия</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по номеру приказа или части..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ErrorBoundary>
          <div className="grid gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={`active-audit-skeleton-${i}`} className="h-[200px] w-full" />
              ))
            ) : filteredAudits.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                {searchQuery ? (
                  <NoSearchResults query={searchQuery} onClear={() => setSearchQuery("")} />
                ) : (
                  <NoDataFound description="Активных ревизий не найдено" />
                )}
              </div>
            ) : (
              filteredAudits.map((audit: ActiveAuditDTO) => {
                const daysRemaining = getDaysRemaining(audit.end_date)
                return (
                  <Card key={audit.audit_id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{audit.order_num}</CardTitle>
                            {getStatusBadge(audit.status)}
                          </div>
                          <CardDescription>
                            {audit.unit_name} ({audit.unit_code})
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Icons.Eye className="w-4 h-4" />
                          Открыть
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Тип ревизии</div>
                          <div className="font-medium">{audit.audit_type}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Главный ревизор</div>
                          <div className="font-medium">{audit.chairman}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Icons.Users className="w-3 h-3" />
                            Ревизоры
                          </div>
                          <div className="font-medium">{audit.members_count} человек</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Icons.AlertCircle className="w-3 h-3" />
                            Нарушения
                          </div>
                          <div className="font-medium">{audit.violations_count} шт.</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Icons.Calendar className="w-4 h-4" />
                            {formatDate(audit.start_date)} — {formatDate(audit.end_date)}
                          </div>
                          {audit.status === "in_progress" && (
                            <div className="font-medium">
                              {daysRemaining > 0 ? `Осталось ${daysRemaining} дн.` : "Срок истёк"}
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Прогресс</span>
                            <span className="font-medium">{audit.progress}%</span>
                          </div>
                          <Progress value={audit.progress} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </ErrorBoundary>

        <div className="text-sm text-muted-foreground">
          Показано {filteredAudits.length} из {audits.length} ревизий
        </div>
      </CardContent>
    </Card>
  )
}
