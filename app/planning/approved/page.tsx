"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ApprovedPlansPage() {
  const [viewMode, setViewMode] = useState<"list" | "districts">("list")

  useEffect(() => {
    const saved = localStorage.getItem("approvedPlansViewMode")
    if (saved === "list" || saved === "districts") {
      setViewMode(saved)
    }
  }, [])

  const handleViewModeChange = (mode: "list" | "districts") => {
    setViewMode(mode)
    localStorage.setItem("approvedPlansViewMode", mode)
  }

  const approvals = [
    {
      id: 1,
      planNumber: "КРР-2025-001",
      controlObject: "Финансовое управление Министерства обороны",
      inspectionDirection: "Финансовая ревизия",
      periodCovered: "01.01.2025 - 31.12.2025",
      conductPeriod: "15.01.2025 - 28.02.2025",
      status: "Утверждён",
      district: "Ташкентский военный округ",
    },
    {
      id: 2,
      planNumber: "КРР-2025-002",
      controlObject: "Управление кадров",
      inspectionDirection: "Проверка кадровой работы",
      periodCovered: "01.01.2025 - 31.12.2025",
      conductPeriod: "01.03.2025 - 30.04.2025",
      status: "Утверждён",
      district: "Центральный военный округ",
    },
    {
      id: 3,
      planNumber: "КРР-2025-003",
      controlObject: "Управление логистики",
      inspectionDirection: "Проверка материально-технического обеспечения",
      periodCovered: "01.01.2025 - 31.12.2025",
      conductPeriod: "15.05.2025 - 30.06.2025",
      status: "Утверждён",
      district: "Восточный военный округ",
    },
    {
      id: 4,
      planNumber: "КРР-2025-004",
      controlObject: "Медицинское управление",
      inspectionDirection: "Проверка медобеспечения",
      periodCovered: "01.01.2025 - 31.12.2025",
      conductPeriod: "01.07.2025 - 31.08.2025",
      status: "Утверждён",
      district: "Ташкентский военный округ",
    },
    {
      id: 5,
      planNumber: "КРР-2025-005",
      controlObject: "Управление связи",
      inspectionDirection: "Проверка средств связи",
      periodCovered: "01.01.2025 - 31.12.2025",
      conductPeriod: "01.09.2025 - 30.10.2025",
      status: "Утверждён",
      district: "Центральный военный округ",
    },
    {
      id: 6,
      planNumber: "КРР-2025-006",
      controlObject: "Управление боевой подготовки",
      inspectionDirection: "Проверка боевой подготовки",
      periodCovered: "01.01.2025 - 31.12.2025",
      conductPeriod: "01.11.2025 - 31.12.2025",
      status: "Утверждён",
      district: "Юго-Западный военный округ",
    },
  ]

  const groupedByDistrict = approvals.reduce(
    (acc, approval) => {
      const district = approval.district
      if (!acc[district]) {
        acc[district] = []
      }
      acc[district].push(approval)
      return acc
    },
    {} as Record<string, typeof approvals>,
  )

  const districtStats = Object.entries(groupedByDistrict).map(([district, items]) => ({
    district,
    count: items.length,
    items,
  }))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Утверждённые планы</h2>
          <p className="text-muted-foreground">Учёт утверждённых планов контрольно-ревизионной работы</p>
        </div>
        <Button>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Утвердить план
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего планов</CardTitle>
            <Icons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvals.length}</div>
            <p className="text-xs text-muted-foreground">Утверждено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Объектов контроля</CardTitle>
            <Icons.Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvals.length}</div>
            <p className="text-xs text-muted-foreground">Запланировано</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Направлений проверки</CardTitle>
            <Icons.Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvals.length}</div>
            <p className="text-xs text-muted-foreground">Всего</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Военных округов</CardTitle>
            <Icons.MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districtStats.length}</div>
            <p className="text-xs text-muted-foreground">Охвачено</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация утверждённых планов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Поиск по номеру плана..." />
            <Input placeholder="Поиск по объекту контроля..." />
            <Input placeholder="Поиск по направлению..." />
            <Button variant="outline">Сбросить</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Реестр утверждённых планов</CardTitle>
              <CardDescription>
                Реестр утверждённых планов контрольно-ревизионной работы ({approvals.length} записей)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewModeChange("list")}
              >
                <Icons.List className="mr-2 h-4 w-4" />
                Списком
              </Button>
              <Button
                variant={viewMode === "districts" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewModeChange("districts")}
              >
                <Icons.MapPin className="mr-2 h-4 w-4" />
                По округам
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "list" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер плана</TableHead>
                    <TableHead>Наименование объекта контроля</TableHead>
                    <TableHead>Направление проверки</TableHead>
                    <TableHead>Военный округ</TableHead>
                    <TableHead>Период охваченный контролем</TableHead>
                    <TableHead>Период проведения</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell className="font-medium">{approval.planNumber}</TableCell>
                      <TableCell>{approval.controlObject}</TableCell>
                      <TableCell>{approval.inspectionDirection}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Icons.MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{approval.district}</span>
                        </div>
                      </TableCell>
                      <TableCell>{approval.periodCovered}</TableCell>
                      <TableCell>{approval.conductPeriod}</TableCell>
                      <TableCell>
                        <Badge variant="default">
                          <Icons.CheckCircle className="mr-1 h-3 w-3" />
                          {approval.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" title="Просмотр">
                            <Icons.Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Скачать документ">
                            <Icons.FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Редактировать">
                            <Icons.Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {viewMode === "districts" && (
            <Accordion type="multiple" className="w-full">
              {districtStats.map((stat) => (
                <AccordionItem key={stat.district} value={stat.district}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <Icons.MapPin className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-base">{stat.district}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="font-mono">
                          Планов: {stat.count}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Icons.CheckCircle className="mr-1 h-3 w-3" />
                          100% утверждено
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Номер плана</TableHead>
                            <TableHead>Наименование объекта контроля</TableHead>
                            <TableHead>Направление проверки</TableHead>
                            <TableHead>Период охваченный контролем</TableHead>
                            <TableHead>Период проведения</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stat.items.map((approval) => (
                            <TableRow key={approval.id}>
                              <TableCell className="font-medium">{approval.planNumber}</TableCell>
                              <TableCell>{approval.controlObject}</TableCell>
                              <TableCell>{approval.inspectionDirection}</TableCell>
                              <TableCell>{approval.periodCovered}</TableCell>
                              <TableCell>{approval.conductPeriod}</TableCell>
                              <TableCell>
                                <Badge variant="default">
                                  <Icons.CheckCircle className="mr-1 h-3 w-3" />
                                  {approval.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" title="Просмотр">
                                    <Icons.Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="Скачать документ">
                                    <Icons.FileText className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="Редактировать">
                                    <Icons.Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
