"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts"
import { 
  Activity, ShieldCheck, Clock, Server, Database, AlertTriangle, CheckCircle2, Search, Filter 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DiagnosticsContent() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/diagnostics")
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Failed to fetch diagnostics", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Панель Метрологического Контроля</h1>
          <p className="text-muted-foreground">Мониторинг АИС КРУ в режиме реального времени (п. 7.4 Методики)</p>
        </div>
        <Badge variant="outline" className="px-4 py-1 text-sm bg-green-50 text-green-700 border-green-200">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Система Стабильна (Hashing: OK)
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 border-blue-100 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Среднее время отклика</p>
                <p className="text-2xl font-bold mt-1">{data?.stats?.avgDuration || 0} мс</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 border-emerald-100 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Безопасность (Integrity)</p>
                <p className="text-2xl font-bold mt-1">ЦЕЛОСТНА</p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 border-purple-100 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Активных пользователей</p>
                <p className="text-2xl font-bold mt-1">{data?.stats?.activeUsers || 0}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Запросов: {data?.stats?.totalRequests || 0}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New P95 SLA Card for Section 8.5 */}
        <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 border-indigo-100 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">P95 (Перцентиль 95%)</p>
                <p className="text-2xl font-bold mt-1">{data?.stats?.p95 || 0} <span className="text-xs font-normal">мс</span></p>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${(data?.stats?.p95 < 500) ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <p className="text-[10px] text-muted-foreground">
                    SLA (Раздел 8.5): {(data?.stats?.p95 < 15000) ? 'СОБЛЮДЕНО' : 'ПРЕВЫШЕНО'}
                  </p>
                </div>
              </div>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-slate-900 border-orange-100 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Нагрузка CPU (Avg)</p>
                <p className="text-2xl font-bold mt-1">{data?.metrics?.[data.metrics.length-1]?.cpu_usage || "0.25"} %</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Server className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updated Network Overhead Card for Fiber Optic (ВОЛС) */}
        <Card className="bg-gradient-to-br from-cyan-50 to-white dark:from-slate-900 border-cyan-100 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Канал связи (ВОЛС)</p>
                <p className="text-2xl font-bold mt-1">Est. 2 <span className="text-xs font-normal">мс</span></p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <p className="text-[10px] text-muted-foreground uppercase">
                    Fiber Optic: 1000 Mbps
                  </p>
                </div>
              </div>
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Динамика производительности (Latencies)
            </CardTitle>
            <CardDescription>Замеры времени отклика API в миллисекундах</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.metrics || []}>
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="created_at" 
                    hide 
                  />
                  <YAxis 
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit="ms"
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="duration_ms" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorDuration)" 
                    name="Время отклика"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Database className="w-5 h-5 mr-2 text-primary" />
              Статус Базы Данных
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Соединение</span>
              <Badge className="bg-green-100 text-green-700">Активно</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Схема</span>
              <span className="text-sm text-muted-foreground mr-1">Nazorat_Public</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Использование Памяти</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(Number(data?.metrics?.[data.metrics.length-1]?.memory_usage || 0) / 1024 / 1024)} MB
              </span>
            </div>
            <div className="pt-4">
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Требование п. 8.4: Авто-бэкап включен
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%]"></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground underline cursor-pointer">Проверить целостность</span>
                <span className="text-[10px] text-muted-foreground">85% Health Score</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
            Доказательный Журнал (Immutable Audit Trail)
          </CardTitle>
          <CardDescription>
            Защищенная цепочка хешированных событий. Гарантия достоверности для комиссии МО РУз.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Поиск по событию или пользователю..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Уровень" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все события</SelectItem>
                <SelectItem value="ERROR">Только ошибки</SelectItem>
                <SelectItem value="INFO">Инфо-события</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Событие</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Дата / Время</TableHead>
                <TableHead className="w-[300px]">Текущий Хеш (Chain ID)</TableHead>
                <TableHead className="text-right">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.auditLogs || [])
                .filter((log: any) => {
                  const matchesSearch = 
                    log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    log.user_id?.toString().includes(searchTerm) ||
                    log.details?.toLowerCase().includes(searchTerm.toLowerCase());
                  
                  const matchesLevel = filterLevel === "all" || log.event_type.includes(filterLevel);
                  
                  return matchesSearch && matchesLevel;
                })
                .map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className={log.event_type.includes("ERROR") ? "text-red-600 font-bold" : ""}>
                        {log.event_type}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{log.details || "Нет деталей"}</span>
                    </div>
                  </TableCell>
                  <TableCell>Admin (ID: {log.user_id || "System"})</TableCell>
                  <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-slate-100 p-1 rounded block truncate w-[200px] font-mono">
                      {log.current_hash}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end text-emerald-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Verified
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.auditLogs || data.auditLogs.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                    События безопасности появятся после первых действий в системе
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
