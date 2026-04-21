"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { AuditLogEntry } from "@/lib/types/audit"

interface AuditLogTableProps {
  logs: AuditLogEntry[]
}

const actionLabels: Record<string, string> = {
  create: "Создание",
  update: "Изменение",
  delete: "Удаление",
  calculate: "Расчёт",
  export: "Экспорт",
  approve: "Утверждение",
}

const actionColors: Record<string, string> = {
  create: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  update: "bg-primary/20 text-primary-foreground border-primary/30",
  delete: "bg-destructive/20 text-destructive-foreground border-destructive/30",
  calculate: "bg-accent/20 text-accent-foreground border-accent/30",
  export: "bg-warning/20 text-warning-foreground border-warning/30",
  approve: "bg-secondary/20 text-secondary-foreground border-secondary/30",
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата и время</TableHead>
            <TableHead>Пользователь</TableHead>
            <TableHead>Действие</TableHead>
            <TableHead>Тип объекта</TableHead>
            <TableHead>Детали</TableHead>
            <TableHead>IP адрес</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{new Date(log.timestamp).toLocaleString("ru-RU")}</TableCell>
              <TableCell>{log.userName}</TableCell>
              <TableCell>
                <Badge className={actionColors[log.action] || ""}>{actionLabels[log.action] || log.action}</Badge>
              </TableCell>
              <TableCell className="capitalize">{log.entityType}</TableCell>
              <TableCell className="max-w-md truncate">{log.details}</TableCell>
              <TableCell className="text-muted-foreground">{log.ipAddress || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
