"use client"

import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { useAuditDocuments } from "@/lib/hooks/use-audits"
import type { AuditDocumentDTO } from "@/lib/types/audits.dto"

interface AuditDocumentsProps {
  user: User
}

export function AuditDocuments({ user }: AuditDocumentsProps) {
  const { data: documents = [], isLoading } = useAuditDocuments("Приказ-2024/045")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Утверждён</Badge>
      case "draft":
        return <Badge variant="outline">Черновик</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Документы ревизии</CardTitle>
            <CardDescription>Рабочие документы и материалы проверки</CardDescription>
          </div>
          <Button className="gap-2">
            <Icons.Upload className="w-4 h-4" />
            Загрузить документ
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc: AuditDocumentDTO) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Icons.FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {doc.type} • {formatDate(doc.date)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(doc.status)}
                <Button variant="ghost" size="sm">
                  <Icons.Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icons.Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
