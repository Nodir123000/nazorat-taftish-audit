"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Ошибка загрузки")
  return data
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

interface AuditLogEntry {
  log_id: number
  user_id: number | null
  username: string
  fullname: string
  action: string
  table_name?: string | null
  record_id?: number | null
  old_value?: string | null
  new_value?: string | null
  ip_address?: string | null
  created_at: string | null
}

export function AuditLogViewer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [page, setPage] = useState(1)
  const LIMIT = 50

  const debouncedSearch = useDebounce(searchQuery, 400)

  const params = new URLSearchParams({
    page: String(page),
    limit: String(LIMIT),
    search: debouncedSearch,
    action: actionFilter,
    date: dateFilter,
  })

  const { data, error, isLoading, mutate } = useSWR(`/api/admin/audit-logs?${params.toString()}`, fetcher, {
    keepPreviousData: true
  })

  const logs = data?.logs || []
  const total = data?.total || 0
  const errorMessage = error instanceof Error ? error.message : ""

  // Сбросить страницу при смене фильтров
  useEffect(() => { setPage(1) }, [debouncedSearch, actionFilter, dateFilter])

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

  const renderJson = (jsonStr: string | null | undefined) => {
    if (!jsonStr) return <span className="text-muted-foreground italic">пусто</span>
    try {
      const obj = JSON.parse(jsonStr)
      return (
        <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-50">
          {JSON.stringify(obj, null, 2)}
        </pre>
      )
    } catch {
      return <span className="text-xs break-all">{jsonStr}</span>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Журнал аудита</CardTitle>
        <CardDescription>История действий пользователей в системе</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-50">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по пользователю, действию, таблице..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-45">
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
            <SelectTrigger className="w-37.5">
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
          <Button variant="outline" size="sm" className="gap-2" onClick={() => mutate()}>
            <Icons.RefreshCw className="w-4 h-4" />
            Обновить
          </Button>
        </div>

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

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
                <TableHead className="text-right">Детали</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <Icons.Spinner className="inline w-4 h-4 mr-2" />Загрузка...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                    <TableCell className="text-right">
                      {(log.old_value || log.new_value) && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Icons.Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Детали изменения</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <h4 className="text-sm font-semibold mb-2">До изменения:</h4>
                                <ScrollArea className="h-75 border rounded-md p-2">
                                  {renderJson(log.old_value)}
                                </ScrollArea>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold mb-2">После изменения:</h4>
                                <ScrollArea className="h-75 border rounded-md p-2">
                                  {renderJson(log.new_value)}
                                </ScrollArea>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
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
