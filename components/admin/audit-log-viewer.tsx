"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"

interface AuditLogEntry {
  log_id: number
  user_id: number | null
  username: string
  fullname: string
  action: string
  table_name?: string | null
  record_id?: number | null
  ip_address?: string | null
  created_at: string | null
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [page, setPage] = useState(1)
  const LIMIT = 50

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        search: searchQuery,
        action: actionFilter,
        date: dateFilter,
      })
      const res = await fetch(`/api/admin/audit-logs?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Ошибка загрузки")
      setLogs(data.logs)
      setTotal(data.total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, actionFilter, dateFilter])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  // Сбросить страницу при смене фильтров
  useEffect(() => { setPage(1) }, [searchQuery, actionFilter, dateFilter])

  const getActionBadge = (action: string) => {
    if (action.includes("Вход") || action.includes("Выход"))
      return <Badge variant="outline">Аутентификация</Badge>
    if (action.includes("Создание"))
      return <Badge className="bg-green-600">Создание</Badge>
    if (action.includes("Обновление") || action.includes("Изменение") || action.includes("Активация") || action.includes("Деактивация"))
      return <Badge className="bg-blue-600">Изменение</Badge>
    if (action.includes("Удаление"))
      return <Badge variant="destructive">Удаление</Badge>
    if (action.includes("Экспорт") || action.includes("Резервная") || action.includes("Просмотр"))
      return <Badge variant="secondary">Системное</Badge>
    return <Badge variant="outline">Действие</Badge>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).format(new Date(dateString))
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Журнал аудита</CardTitle>
        <CardDescription>История действий пользователей в системе</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по пользователю, действию, таблице..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <Icons.Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все действия</SelectItem>
              <SelectItem value="Вход">Аутентификация</SelectItem>
              <SelectItem value="Создание">Создание</SelectItem>
              <SelectItem value="Обновление">Изменение</SelectItem>
              <SelectItem value="Удаление">Удаление</SelectItem>
              <SelectItem value="Резервная">Резервные копии</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <Icons.Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все даты</SelectItem>
              <SelectItem value="today">Сегодня</SelectItem>
              <SelectItem value="yesterday">Вчера</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchLogs}>
            <Icons.RefreshCw className="w-4 h-4" />
            Обновить
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата и время</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead>Таблица</TableHead>
                <TableHead>IP адрес</TableHead>
                <TableHead>Тип</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Icons.Spinner className="inline w-4 h-4 mr-2" />Загрузка...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Записи не найдены
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.log_id}>
                    <TableCell className="font-mono text-sm">{formatDate(log.created_at)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.fullname}</div>
                        <div className="text-sm text-muted-foreground">@{log.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      {log.table_name ? (
                        <div className="text-sm">
                          <div className="font-mono">{log.table_name}</div>
                          {log.record_id && <div className="text-muted-foreground">ID: {log.record_id}</div>}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ip_address ?? "—"}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Пагинация */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Показано {logs.length} из {total} записей</span>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Назад
              </Button>
              <span>Стр. {page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Вперёд
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
