"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { useCashChecks, useServiceChecks, useStorageNorms } from "@/lib/hooks/use-audits"
import type { CashCheckDTO, ServiceCheckDTO, StorageNormDTO } from "@/lib/types/audits.dto"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { TableSkeleton, Skeleton } from "@/components/ui/skeleton"
import { NoDataFound } from "@/components/ui/empty-state"
import { ErrorBoundary } from "@/components/error-boundary"

interface FinancialChecksProps {
  user: User
}

export function FinancialChecks({ user }: FinancialChecksProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const { data: cashChecks = [], isLoading: cashLoading } = useCashChecks()
  const { data: serviceChecks = [], isLoading: servicesLoading } = useServiceChecks()
  const { data: storageNorms = [], isLoading: storageLoading } = useStorageNorms()

  const isLoading = cashLoading || servicesLoading || storageLoading

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return (
          <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
            <Icons.CheckCircle className="w-3 h-3" />
            Норма
          </Badge>
        )
      case "discrepancy":
        return (
          <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
            <Icons.XCircle className="w-3 h-3" />
            Расхождение
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="gap-1 text-orange-600 border-orange-600">
            <Icons.AlertTriangle className="w-3 h-3" />
            Ниже нормы
          </Badge>
        )
      case "completed":
        return <Badge className="bg-green-600">Завершена</Badge>
      case "in_progress":
        return <Badge className="bg-blue-600">В процессе</Badge>
      case "pending":
        return <Badge variant="outline">Ожидает</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="cash" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
          <TabsTrigger value="cash" className="gap-2">
            <Icons.DollarSign className="w-4 h-4" />
            Касса
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Icons.Package className="w-4 h-4" />
            Службы
          </TabsTrigger>
          <TabsTrigger value="storage" className="gap-2">
            <Icons.Warehouse className="w-4 h-4" />
            Нормы хранения
          </TabsTrigger>
          <TabsTrigger value="enterprises" className="gap-2">
            <Icons.Store className="w-4 h-4" />
            Подсобные хозяйства
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cash">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Проверка кассы</CardTitle>
                  <CardDescription>Ревизия наличных средств и денежных документов</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Icons.Plus className="w-4 h-4" />
                      Добавить проверку
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить проверку кассы</DialogTitle>
                      <DialogDescription>Заполните данные о проверке кассы</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="check_date">Дата проверки *</Label>
                        <Input id="check_date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cash_type">Тип проверки *</Label>
                        <Input id="cash_type" placeholder="Наличные средства" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expected">Ожидаемая сумма *</Label>
                          <Input id="expected" type="number" placeholder="150000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="actual">Фактическая сумма *</Label>
                          <Input id="actual" type="number" placeholder="150000" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Примечания</Label>
                        <Textarea id="notes" placeholder="Дополнительная информация..." rows={3} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>Добавить</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Тип проверки</TableHead>
                        <TableHead className="text-right">Ожидаемая сумма</TableHead>
                        <TableHead className="text-right">Фактическая сумма</TableHead>
                        <TableHead className="text-right">Расхождение</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cashLoading ? (
                        <TableSkeleton columns={6} rows={5} />
                      ) : cashChecks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-[300px] text-center">
                            <NoDataFound description="Проверок кассы не найдено" />
                          </TableCell>
                        </TableRow>
                      ) : (
                        cashChecks.map((check: CashCheckDTO) => (
                          <TableRow key={check.check_id}>
                            <TableCell>{formatDate(check.check_date)}</TableCell>
                            <TableCell className="font-medium">{check.cash_type}</TableCell>
                            <TableCell className="text-right">{formatCurrency(check.expected_amount)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(check.actual_amount)}</TableCell>
                            <TableCell className="text-right">
                              <span className={check.discrepancy !== 0 ? "text-red-600 font-medium" : ""}>
                                {formatCurrency(check.discrepancy)}
                              </span>
                            </TableCell>
                            <TableCell>{getStatusBadge(check.status)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Проверка служб</CardTitle>
              <CardDescription>Ревизия финансово-хозяйственной деятельности служб</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <div className="grid gap-4">
                  {servicesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={`service-skeleton-${i}`} className="h-[200px] w-full" />
                    ))
                  ) : serviceChecks.length === 0 ? (
                    <NoDataFound description="Проверок служб не найдено" />
                  ) : (
                    serviceChecks.map((service: ServiceCheckDTO) => (
                      <Card key={service.id} className="border-2">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="font-medium text-lg">{service.service}</div>
                              <div className="text-sm text-muted-foreground">
                                Проверено позиций: {service.items_checked} • Нарушений: {service.violations}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(service.status)}
                              <Button variant="outline" size="sm">
                                Подробнее
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Нормы хранения</CardTitle>
              <CardDescription>Проверка соответствия фактических остатков установленным нормам</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Наименование</TableHead>
                        <TableHead className="text-right">Норма</TableHead>
                        <TableHead className="text-right">Фактически</TableHead>
                        <TableHead className="text-right">Отклонение</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storageLoading ? (
                        <TableSkeleton columns={5} rows={5} />
                      ) : storageNorms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-[300px] text-center">
                            <NoDataFound description="Данных о нормах хранения не найдено" />
                          </TableCell>
                        </TableRow>
                      ) : (
                        storageNorms.map((item: StorageNormDTO) => {
                          const deviation = item.actual - item.norm
                          const deviationPercent = Math.round((deviation / item.norm) * 100)
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.item}</TableCell>
                              <TableCell className="text-right">
                                {item.norm} {item.unit}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.actual} {item.unit}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={deviation < 0 ? "text-red-600 font-medium" : ""}>
                                  {deviation > 0 ? "+" : ""}
                                  {deviation} {item.unit} ({deviationPercent > 0 ? "+" : ""}
                                  {deviationPercent}%)
                                </span>
                              </TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enterprises">
          <Card>
            <CardHeader>
              <CardTitle>Подсобные хозяйства</CardTitle>
              <CardDescription>Проверка деятельности подсобных хозяйств</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <div className="py-12">
                  <NoDataFound description="Данные о подсобных хозяйствах будут доступны в ближайшее время" />
                </div>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
