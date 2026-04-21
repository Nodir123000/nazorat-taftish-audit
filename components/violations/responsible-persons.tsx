"use client"

import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle } from "lucide-react"

interface ResponsiblePersonsProps {
  user: User
}

interface ResponsiblePerson {
  person_id: number
  rank: string
  fullname: string
  position: string
  unit: string
  violations_count: number
  open_violations: number
  total_amount: number
}

export function ResponsiblePersons({ user }: ResponsiblePersonsProps) {
  const persons: ResponsiblePerson[] = [
    {
      person_id: 1,
      rank: "Старший лейтенант",
      fullname: "Сидоров Алексей Александрович",
      position: "Начальник финансовой службы",
      unit: "Войсковая часть 12345",
      violations_count: 1,
      open_violations: 1,
      total_amount: 500,
    },
    {
      person_id: 2,
      rank: "Капитан",
      fullname: "Иванов Пётр Сергеевич",
      position: "Заместитель командира по тылу",
      unit: "Войсковая часть 12345",
      violations_count: 1,
      open_violations: 0,
      total_amount: 0,
    },
    {
      person_id: 3,
      rank: "Старшина",
      fullname: "Петров Владимир Иванович",
      position: "Начальник продовольственной службы",
      unit: "Войсковая часть 12345",
      violations_count: 1,
      open_violations: 0,
      total_amount: 0,
    },
    {
      person_id: 4,
      rank: "Майор",
      fullname: "Козлов Дмитрий Николаевич",
      position: "Начальник финансовой службы",
      unit: "Войсковая часть 67890",
      violations_count: 1,
      open_violations: 1,
      total_amount: 15000,
    },
    {
      person_id: 5,
      rank: "Лейтенант",
      fullname: "Смирнов Константин Андреевич",
      position: "Помощник начальника штаба",
      unit: "Войсковая часть 67890",
      violations_count: 1,
      open_violations: 0,
      total_amount: 0,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ответственные лица</CardTitle>
        <CardDescription>Военнослужащие, ответственные за выявленные нарушения</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Звание, ФИО</TableHead>
                <TableHead>Должность</TableHead>
                <TableHead>Воинская часть</TableHead>
                <TableHead className="text-center">Всего нарушений</TableHead>
                <TableHead className="text-center">Открытых</TableHead>
                <TableHead className="text-right">Сумма ущерба</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {persons.map((person) => (
                <TableRow key={person.person_id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{person.fullname}</div>
                      <div className="text-sm text-muted-foreground">{person.rank}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{person.position}</TableCell>
                  <TableCell className="text-sm">{person.unit}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{person.violations_count}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {person.open_violations > 0 ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {person.open_violations}
                      </Badge>
                    ) : (
                      <Badge variant="outline">0</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {person.total_amount > 0 ? (
                      <span className="text-red-600">{formatCurrency(person.total_amount)}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">Показано {persons.length} ответственных лиц</div>
      </CardContent>
    </Card>
  )
}
