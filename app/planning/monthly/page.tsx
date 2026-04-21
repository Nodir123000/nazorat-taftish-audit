import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"

export default function MonthlyAdjustmentsPage() {
  const adjustments = [
    {
      id: 1,
      quarter: "I квартал 2025",
      month: "Январь",
      reason: "Изменение приоритетов",
      date: "2025-01-10",
      status: "Утверждено",
    },
    {
      id: 2,
      quarter: "I квартал 2025",
      month: "Февраль",
      reason: "Внеплановая проверка",
      date: "2025-02-05",
      status: "На рассмотрении",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Месячные корректировки</h1>
          <p className="text-muted-foreground">Корректировка квартальных планов по месяцам</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить корректировку
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            <CardTitle>Месячные корректировки планов</CardTitle>
          </div>
          <CardDescription>История изменений квартальных планов</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Квартальный план</TableHead>
                <TableHead>Месяц</TableHead>
                <TableHead>Причина</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adjustments.map((adj) => (
                <TableRow key={adj.id}>
                  <TableCell className="font-medium">{adj.id}</TableCell>
                  <TableCell>{adj.quarter}</TableCell>
                  <TableCell>{adj.month}</TableCell>
                  <TableCell>{adj.reason}</TableCell>
                  <TableCell>{adj.date}</TableCell>
                  <TableCell>
                    <Badge variant={adj.status === "Утверждено" ? "default" : "secondary"}>{adj.status}</Badge>
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
