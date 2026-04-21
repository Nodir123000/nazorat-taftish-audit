"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { usePreparationChecklist, useSourceDocuments } from "@/lib/hooks/use-audits"
import type { PreparationChecklistItemDTO, SourceDocumentDTO } from "@/lib/types/audits.dto"
import { Skeleton } from "@/components/ui/skeleton"
import { NoDataFound } from "@/components/ui/empty-state"
import { ErrorBoundary } from "@/components/error-boundary"

interface AuditPreparationProps {
  user: User
}

export function AuditPreparation({ user }: AuditPreparationProps) {
  const [selectedAudit] = useState("Приказ-2024/045")

  const { data: preparationChecklist = [], isLoading: checklistLoading } = usePreparationChecklist(selectedAudit)
  const { data: sourceDocuments = [], isLoading: docsLoading } = useSourceDocuments(selectedAudit)

  const isLoading = checklistLoading || docsLoading

  const completedCount = preparationChecklist.filter((item: PreparationChecklistItemDTO) => item.completed).length
  const totalCount = preparationChecklist.length
  const progress = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Подготовка к ревизии</CardTitle>
              <CardDescription>Ревизия: {selectedAudit}</CardDescription>
            </div>
            <Badge variant="outline" className="text-base">
              {completedCount} из {totalCount} выполнено
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ErrorBoundary>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`checklist-skeleton-${i}`} className="flex items-start gap-3 p-4 border rounded-lg">
                    <Skeleton className="w-5 h-5 mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              ) : preparationChecklist.length === 0 ? (
                <NoDataFound description="Чек-лист подготовки пуст" />
              ) : (
                preparationChecklist.map((item: PreparationChecklistItemDTO) => (
                  <div key={item.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <Checkbox checked={item.completed} className="mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{item.title}</div>
                        {item.required && <Badge variant="destructive">Обязательно</Badge>}
                        {item.completed ? (
                          <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Icons.Clock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ErrorBoundary>
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 lg:w-[400px]">
          <TabsTrigger value="documents">Исходные данные</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Исходные документы</CardTitle>
                  <CardDescription>Документы для подготовки к ревизии</CardDescription>
                </div>
                <Button className="gap-2">
                  <Icons.Upload className="w-4 h-4" />
                  Загрузить документ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <div className="space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={`doc-skeleton-${i}`} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-5 h-5" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    ))
                  ) : sourceDocuments.length === 0 ? (
                    <NoDataFound description="Документы не загружены" />
                  ) : (
                    sourceDocuments.map((doc: SourceDocumentDTO) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icons.FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(doc.date).toLocaleDateString("ru-RU")}
                            </div>
                          </div>
                        </div>
                        {doc.status === "uploaded" ? (
                          <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                            <Icons.CheckCircle className="w-3 h-3" />
                            Загружен
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
                            <Icons.XCircle className="w-3 h-3" />
                            Ожидается
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
