"use client"

import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Upload } from "lucide-react"

interface ViolationDocumentsProps {
  user: User
}

export function ViolationDocuments({ user }: ViolationDocumentsProps) {
  const documents = [
    {
      doc_id: 1,
      name: "Акт о выявленных нарушениях НАР-2024/001",
      violation_num: "НАР-2024/001",
      type: "Акт",
      date: "2024-04-02",
      status: "signed",
    },
    {
      doc_id: 2,
      name: "Объяснительная записка Сидорова А.А.",
      violation_num: "НАР-2024/001",
      type: "Объяснительная",
      date: "2024-04-03",
      status: "signed",
    },
    {
      doc_id: 3,
      name: "Предписание об устранении нарушения НАР-2024/001",
      violation_num: "НАР-2024/001",
      type: "Предписание",
      date: "2024-04-05",
      status: "issued",
    },
    {
      doc_id: 4,
      name: "Акт о выявленных нарушениях НАР-2024/002",
      violation_num: "НАР-2024/002",
      type: "Акт",
      date: "2024-04-03",
      status: "draft",
    },
    {
      doc_id: 5,
      name: "Акт о выявленных нарушениях НАР-2024/004",
      violation_num: "НАР-2024/004",
      type: "Акт",
      date: "2024-06-03",
      status: "signed",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <Badge className="bg-green-600">Подписан</Badge>
      case "issued":
        return <Badge className="bg-blue-600">Выдан</Badge>
      case "draft":
        return <Badge variant="outline">Черновик</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const canUpload = user.role === "admin" || user.role === "chief_inspector" || user.role === "inspector"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Документы по нарушениям</CardTitle>
            <CardDescription>Акты, объяснительные, предписания и другие документы</CardDescription>
          </div>
          {canUpload && (
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Загрузить документ
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.doc_id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {doc.type} • {doc.violation_num} • {formatDate(doc.date)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(doc.status)}
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">Показано {documents.length} документов</div>
      </CardContent>
    </Card>
  )
}
