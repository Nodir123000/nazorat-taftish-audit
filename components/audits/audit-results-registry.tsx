"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { useAuditResults, useAuditSummaryStats, useCreateAuditResult } from "@/lib/hooks/use-audits"
import type { AuditResultDTO, CreateAuditResultDTO } from "@/lib/types/audits.dto"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Eye, Edit, Download, CheckCircle, Clock, FileCheck } from "lucide-react"
import { TableSkeleton } from "@/components/ui/skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { NoDataFound, NoSearchResults } from "@/components/ui/empty-state"
import { ErrorBoundary } from "@/components/error-boundary"
import { useToast } from "@/components/ui/use-toast"

interface AuditResultsRegistryProps {
  user: User
}

export function AuditResultsRegistry({ user }: AuditResultsRegistryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // React Query Hooks
  const { data: resultsData, isLoading: resultsLoading } = useAuditResults({
    status: filterStatus === "all" ? undefined : filterStatus,
    search: searchQuery,
  })

  const { data: statsData, isLoading: statsLoading } = useAuditSummaryStats()
  const createMutation = useCreateAuditResult()
  const { toast } = useToast()

  const results = resultsData?.items || []
  const stats = statsData || {
    totalAudits: 0,
    totalFindings: 0,
    totalViolations: 0,
    totalAmount: 0,
    approvedReports: 0,
  }
  const isLoading = resultsLoading

  const [newResult, setNewResult] = useState<Partial<CreateAuditResultDTO>>({
    audit_date: new Date().toISOString().split('T')[0],
    findings_count: 0,
    violations_count: 0,
    total_amount: 0,
    report_text: "",
    status: "draft",
    task_id: 1
  })

  const handleAddResult = () => {
    if (newResult.audit_date && newResult.findings_count !== undefined && newResult.violations_count !== undefined) {
      createMutation.mutate(newResult as CreateAuditResultDTO, {
        onSuccess: () => {
          setIsAddDialogOpen(false)
          setNewResult({
            audit_date: new Date().toISOString().split('T')[0],
            findings_count: 0,
            violations_count: 0,
            total_amount: 0,
            report_text: "",
            status: "draft",
            task_id: 1
          })
          toast({
            title: "Результат добавлен",
            description: "Информация о результатах ревизии успешно сохранена",
          })
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: error?.message || "Не удалось сохранить результат",
          })
        }
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            Черновик
          </Badge>
        )
      case "submitted":
        return (
          <Badge className="gap-1 bg-blue-600">
            <FileCheck className="w-3 h-3" />
            Отправлен
          </Badge>
        )
      case "approved":
        return (
          <Badge className="gap-1 bg-green-600">
            <CheckCircle className="w-3 h-3" />
            Утвержден
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const canCreateResults = user.role === "admin" || user.role === "chief_inspector"

  const filteredResults = results.filter((result: AuditResultDTO) =>
    result.report_text?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Всего ревизий</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalAudits}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Выявлено замечаний</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalFindings}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Нарушений</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalViolations}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Сумма нарушений</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Утвержденных отчетов</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.approvedReports}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Реестр результатов ревизий</CardTitle>
                <CardDescription>Управление результатами и отчетами контрольных мероприятий</CardDescription>
              </div>
              {canCreateResults && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Добавить результат
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Добавить результат ревизии</DialogTitle>
                      <DialogDescription>Заполните информацию о результатах проведенной ревизии</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="audit_date">Дата ревизии *</Label>
                          <Input
                            id="audit_date"
                            type="date"
                            value={newResult.audit_date}
                            onChange={(e) => setNewResult({ ...newResult, audit_date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="findings_count">Количество замечаний *</Label>
                          <Input
                            id="findings_count"
                            type="number"
                            placeholder="0"
                            value={newResult.findings_count}
                            onChange={(e) => setNewResult({ ...newResult, findings_count: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="violations_count">Количество нарушений *</Label>
                          <Input
                            id="violations_count"
                            type="number"
                            placeholder="0"
                            value={newResult.violations_count}
                            onChange={(e) => setNewResult({ ...newResult, violations_count: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="total_amount">Сумма нарушений (руб.)</Label>
                          <Input
                            id="total_amount"
                            type="number"
                            placeholder="0"
                            value={newResult.total_amount}
                            onChange={(e) => setNewResult({ ...newResult, total_amount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="report_text">Текст отчета *</Label>
                        <Textarea
                          id="report_text"
                          placeholder="Описание результатов ревизии..."
                          rows={4}
                          value={newResult.report_text}
                          onChange={(e) => setNewResult({ ...newResult, report_text: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleAddResult} disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Добавление..." : "Добавить результат"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по тексту отчета..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="submitted">Отправлен</SelectItem>
                  <SelectItem value="approved">Утвержден</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата ревизии</TableHead>
                    <TableHead>Замечаний</TableHead>
                    <TableHead>Нарушений</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton rows={5} columns={6} />
                  ) : filteredResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-[300px] text-center">
                        {searchQuery ? (
                          <NoSearchResults query={searchQuery} onClear={() => setSearchQuery("")} />
                        ) : (
                          <NoDataFound onReset={() => setFilterStatus("all")} />
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResults.map((result: AuditResultDTO) => (
                      <TableRow key={result.result_id}>
                        <TableCell>{formatDate(result.audit_date)}</TableCell>
                        <TableCell className="font-medium">{result.findings_count}</TableCell>
                        <TableCell className="font-medium">{result.violations_count}</TableCell>
                        <TableCell>{result.total_amount ? formatCurrency(result.total_amount) : "—"}</TableCell>
                        <TableCell>{getStatusBadge(result.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {canCreateResults && (
                              <>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="text-sm text-muted-foreground">
              Показано {filteredResults.length} из {results.length} результатов
            </div>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  )
}
