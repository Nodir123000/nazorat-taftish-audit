"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, FileSignature, Download } from "lucide-react"
import { AuditLogTable } from "@/components/kpi/audit-log-table"
import { SignatureDialog } from "@/components/kpi/signature-dialog"
import type { AuditLogEntry, ElectronicSignature } from "@/lib/types/audit"

// Mock data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: "2025-01-15T14:30:00",
    userId: "admin",
    userName: "Фазылов Р.Ж.",
    action: "calculate",
    entityType: "kpi-calculation",
    entityId: "calc-001",
    details: "Расчёт KPI для сотрудника Иванов И.И. за Q1-2025",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    timestamp: "2025-01-15T14:25:00",
    userId: "admin",
    userName: "Фазылов Р.Ж.",
    action: "update",
    entityType: "kpi-data",
    entityId: "data-001",
    details: "Обновление данных за Q1-2025: изменено поле bxBudget с 800 на 850",
    ipAddress: "192.168.1.100",
  },
  {
    id: "3",
    timestamp: "2025-01-15T10:15:00",
    userId: "admin",
    userName: "Фазылов Р.Ж.",
    action: "create",
    entityType: "employee",
    entityId: "emp-003",
    details: "Добавлен новый сотрудник: Сидоров С.С.",
    ipAddress: "192.168.1.100",
  },
  {
    id: "4",
    timestamp: "2025-01-14T16:45:00",
    userId: "admin",
    userName: "Фазылов Р.Ж.",
    action: "export",
    entityType: "report",
    entityId: "report-q4-2024",
    details: "Экспорт отчёта за Q4-2024 в формате Excel",
    ipAddress: "192.168.1.100",
  },
  {
    id: "5",
    timestamp: "2025-01-14T16:30:00",
    userId: "admin",
    userName: "Фазылов Р.Ж.",
    action: "approve",
    entityType: "report",
    entityId: "report-q4-2024",
    details: "Утверждён квартальный отчёт за Q4-2024",
    ipAddress: "192.168.1.100",
  },
]

const mockSignatures: ElectronicSignature[] = [
  {
    id: "sig-001",
    documentId: "report-q1-2025",
    documentType: "quarterly-report",
    signedBy: "admin",
    signedByName: "Фазылов Рустам Жураевич",
    signedByPosition: "Начальник отдела внутреннего контроля",
    signedAt: "2025-01-15T15:00:00",
    signatureHash: "a1b2c3d4e5f6...",
    status: "signed",
    comments: "Отчёт утверждён без замечаний",
  },
  {
    id: "sig-002",
    documentId: "report-q4-2024",
    documentType: "quarterly-report",
    signedBy: "admin",
    signedByName: "Фазылов Рустам Жураевич",
    signedByPosition: "Начальник отдела внутреннего контроля",
    signedAt: "2025-01-14T16:30:00",
    signatureHash: "f6e5d4c3b2a1...",
    status: "signed",
  },
]

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false)

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    return matchesSearch && matchesAction
  })

  const handleSign = (comments?: string) => {
    console.log("[v0] Document signed with comments:", comments)
    alert("Документ успешно подписан")
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Аудит и подписи</h1>
          <p className="text-sm text-muted-foreground mt-1">Журнал операций и электронные подписи документов</p>
        </div>
        <Button className="gap-2" onClick={() => setIsSignatureDialogOpen(true)}>
          <FileSignature className="h-4 w-4" />
          Подписать отчёт
        </Button>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList>
          <TabsTrigger value="logs">Журнал операций</TabsTrigger>
          <TabsTrigger value="signatures">Электронные подписи</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Журнал аудита</CardTitle>
              <CardDescription>История всех операций в системе KPI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по пользователю или деталям..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Тип действия" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все действия</SelectItem>
                    <SelectItem value="create">Создание</SelectItem>
                    <SelectItem value="update">Изменение</SelectItem>
                    <SelectItem value="delete">Удаление</SelectItem>
                    <SelectItem value="calculate">Расчёт</SelectItem>
                    <SelectItem value="export">Экспорт</SelectItem>
                    <SelectItem value="approve">Утверждение</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AuditLogTable logs={filteredLogs} />

              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  Показано записей: {filteredLogs.length} из {mockAuditLogs.length}
                </p>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Экспорт журнала
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signatures">
          <Card>
            <CardHeader>
              <CardTitle>Электронные подписи</CardTitle>
              <CardDescription>Подписанные документы и отчёты KPI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSignatures.map((signature) => (
                  <div key={signature.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileSignature className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            {signature.documentType === "quarterly-report" && "Квартальный отчёт"}
                            {signature.documentType === "annual-report" && "Годовой отчёт"}
                            {signature.documentType === "kpi-report" && "Отчёт KPI"}
                          </p>
                          <p className="text-sm text-muted-foreground">ID: {signature.documentId}</p>
                        </div>
                      </div>
                      <div className="ml-8 space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Подписал:</span>{" "}
                          <span className="font-medium">{signature.signedByName}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Должность:</span> {signature.signedByPosition}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Дата:</span>{" "}
                          {new Date(signature.signedAt).toLocaleString("ru-RU")}
                        </p>
                        {signature.comments && (
                          <p>
                            <span className="text-muted-foreground">Комментарий:</span> {signature.comments}
                          </p>
                        )}
                        <p className="font-mono text-xs text-muted-foreground">Хеш: {signature.signatureHash}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        signature.status === "signed"
                          ? "bg-secondary/20 text-secondary-foreground border-secondary/30"
                          : signature.status === "pending"
                            ? "bg-warning/20 text-warning-foreground border-warning/30"
                            : "bg-destructive/20 text-destructive-foreground border-destructive/30"
                      }
                    >
                      {signature.status === "signed" && "Подписан"}
                      {signature.status === "pending" && "Ожидает"}
                      {signature.status === "rejected" && "Отклонён"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SignatureDialog
        open={isSignatureDialogOpen}
        onOpenChange={setIsSignatureDialogOpen}
        documentTitle="Квартальный отчёт KPI за Q1-2025"
        onSign={handleSign}
      />
    </div>
  )
}
