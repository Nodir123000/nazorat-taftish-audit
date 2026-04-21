"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

export default function PlanControlPage() {
  const controls = [
    { id: 1, plan: "План КРР 2025", stage: "Подготовка", progress: 100, status: "Завершено" },
    { id: 2, plan: "План КРР 2025", stage: "Проведение ревизий", progress: 45, status: "В процессе" },
    { id: 3, plan: "План КРР 2025", stage: "Оформление результатов", progress: 20, status: "В процессе" },
    { id: 4, plan: "План КРР 2025", stage: "Контроль исполнения", progress: 0, status: "Не начато" },
  ]

  const avgProgress = Math.round(controls.reduce((sum, c) => sum + c.progress, 0) / controls.length)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Контроль выполнения плана</h2>
        <p className="text-muted-foreground">Мониторинг выполнения годового плана КРР</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего стадий</CardTitle>
            <Icons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controls.length}</div>
            <p className="text-xs text-muted-foreground">В плане</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний прогресс</CardTitle>
            <Icons.TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgProgress}%</div>
            <p className="text-xs text-muted-foreground">Выполнено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
            <Icons.CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {controls.filter((c) => c.status === "Завершено").length}
            </div>
            <p className="text-xs text-muted-foreground">Стадий</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В процессе</CardTitle>
            <Icons.Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {controls.filter((c) => c.status === "В процессе").length}
            </div>
            <p className="text-xs text-muted-foreground">Стадий</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Поиск и фильтрация стадий выполнения плана</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Поиск по плану или стадии..." />
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все статусы</option>
              <option value="completed">Завершено</option>
              <option value="inprogress">В процессе</option>
              <option value="notstarted">Не начато</option>
            </select>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Все планы</option>
              <option value="2025">План КРР 2025</option>
              <option value="2024">План КРР 2024</option>
            </select>
            <Button variant="outline">Сбросить</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icons.Activity className="h-5 w-5 text-primary" />
            <CardTitle>Реестр стадий выполнения плана</CardTitle>
          </div>
          <CardDescription>Прогресс выполнения по каждой стадии ({controls.length} записей)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>План</TableHead>
                <TableHead>Стадия</TableHead>
                <TableHead>Прогресс</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.map((control) => (
                <TableRow key={control.id}>
                  <TableCell className="font-medium">{control.id}</TableCell>
                  <TableCell>{control.plan}</TableCell>
                  <TableCell>{control.stage}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={control.progress} className="w-32" />
                      <span className="text-sm text-muted-foreground">{control.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        control.status === "Завершено"
                          ? "default"
                          : control.status === "В процессе"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {control.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
