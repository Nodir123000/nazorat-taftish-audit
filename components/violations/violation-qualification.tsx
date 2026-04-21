"use client"

import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

interface ViolationQualificationProps {
  user: User
}

export function ViolationQualification({ user }: ViolationQualificationProps) {
  const qualifications = [
    {
      id: 1,
      violation_num: "52/ФС-2024/001-1",
      description: "Недостача денежных средств",
      article: "Ст. 293 УК РФ",
      severity: "high",
      amount: 500,
      status: "qualified",
    },
    {
      id: 2,
      violation_num: "52/ФС-2024/001-2",
      description: "Нарушение порядка учета",
      article: "Приказ МО РФ №123",
      severity: "medium",
      amount: 0,
      status: "under_review",
    },
    {
      id: 3,
      violation_num: "52/ФС-2024/002-1",
      description: "Растрата материальных ценностей",
      article: "Ст. 160 УК РФ",
      severity: "critical",
      amount: 15000,
      status: "qualified",
    },
  ]

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="destructive" className="gap-1">
            <Icons.AlertTriangle className="w-3 h-3" />
            Критическое
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
            <Icons.AlertCircle className="w-3 h-3" />
            Высокое
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="gap-1 text-orange-600 border-orange-600">
            <Icons.Info className="w-3 h-3" />
            Среднее
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "qualified":
        return <Badge className="bg-green-600">Квалифицировано</Badge>
      case "under_review":
        return <Badge className="bg-blue-600">На рассмотрении</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "—"
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const canQualify = user.role === "admin" || user.role === "chief_inspector"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Квалификация нарушений</CardTitle>
            <CardDescription>Правовая квалификация выявленных нарушений</CardDescription>
          </div>
          {canQualify && (
            <Button className="gap-2">
              <Icons.Plus className="w-4 h-4" />
              Добавить квалификацию
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер нарушения</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Статья/Приказ</TableHead>
                <TableHead>Тяжесть</TableHead>
                <TableHead className="text-right">Сумма ущерба</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qualifications.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.violation_num}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="font-mono text-sm">{item.article}</TableCell>
                  <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Icons.Eye className="w-4 h-4" />
                      </Button>
                      {canQualify && (
                        <Button variant="ghost" size="sm">
                          <Icons.Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
