"use client"

import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Plus } from "lucide-react"

interface ViolationForm52Props {
  user: User
}

export function ViolationForm52({ user }: ViolationForm52Props) {
  const forms = [
    {
      form_id: 1,
      form_num: "52/ФС-2024/001",
      audit_order: "Приказ-2024/045",
      unit_name: "Войсковая часть 12345",
      violations_count: 3,
      total_amount: 500,
      created_date: "2024-04-10",
      status: "approved",
    },
    {
      form_id: 2,
      form_num: "52/ФС-2024/002",
      audit_order: "Приказ-2024/067",
      unit_name: "Войсковая часть 67890",
      violations_count: 2,
      total_amount: 15000,
      created_date: "2024-06-08",
      status: "draft",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Утверждена</Badge>
      case "draft":
        return <Badge variant="outline">Черновик</Badge>
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

  const canCreateForms = user.role === "admin" || user.role === "chief_inspector" || user.role === "inspector"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Форма 52/ФС</CardTitle>
            <CardDescription>Реестр нарушений по форме 52/ФС</CardDescription>
          </div>
          {canCreateForms && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Создать форму 52/ФС
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {forms.map((form) => (
            <Card key={form.form_id} className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{form.form_num}</CardTitle>
                      {getStatusBadge(form.status)}
                    </div>
                    <CardDescription>
                      {form.audit_order} • {form.unit_name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      Просмотр
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Скачать
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Дата создания</div>
                    <div className="font-medium">{formatDate(form.created_date)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Количество нарушений</div>
                    <div className="font-medium">{form.violations_count} шт.</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Общая сумма</div>
                    <div className="font-medium">{formatCurrency(form.total_amount)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
