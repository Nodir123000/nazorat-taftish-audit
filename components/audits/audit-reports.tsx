"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Plus, Download } from "lucide-react"
import type { User } from "@/lib/types"
import { useAuditReports } from "@/lib/hooks/use-audits"
import type { AuditReportDTO } from "@/lib/types/audits.dto"
import { TableSkeleton } from "@/components/ui/skeleton"
import { NoDataFound } from "@/components/ui/empty-state"
import { ErrorBoundary } from "@/components/error-boundary"

interface AuditReportsProps {
  user: User
}

export function AuditReports({ user }: AuditReportsProps) {
  const { data: reports = [], isLoading } = useAuditReports()

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Промежуточные отчеты</CardTitle>
                <CardDescription>Регистрация ежедневных и еженедельных отчетов о ходе проверки</CardDescription>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Создать отчет
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Наименование</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead>Период</TableHead>
                    <TableHead>Автор</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton columns={7} rows={5} />
                  ) : reports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-[300px] text-center">
                        <NoDataFound description="Отчетов пока не создано" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    reports.map((report: AuditReportDTO) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-500" />
                            {report.name}
                          </div>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.createdAt}</TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>{report.author}</TableCell>
                        <TableCell>
                          <Badge className={
                            report.status === "Утвержден" ? "bg-green-100 text-green-800" :
                              report.status === "На проверке" ? "bg-blue-100 text-blue-800" :
                                "bg-gray-100 text-gray-800"
                          }>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  )
}
