"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { Icons } from "@/components/icons"

interface BackupRecord {
  backup_id: number
  backup_name: string
  backup_type: "full" | "incremental" | "differential"
  size_mb: number
  created_at: string
  created_by: string
  status: "completed" | "in_progress" | "failed"
  filename: string
  retention_days: number
  tables_count?: number
}

interface ArchivedData {
  archive_id: number
  archive_name: string
  data_type: string
  record_count: number
  size_mb: number
  archived_at: string
  archived_by: string
  status: "active" | "archived" | "deleted"
  description: string
}

export function ArchiveBackup() {
  const [searchQuery, setSearchQuery] = useState("")
  const [backupTypeFilter, setBackupTypeFilter] = useState("all")
  const [backupType, setBackupType] = useState("full")
  const [backupName, setBackupName] = useState("")
  const [retentionDays, setRetentionDays] = useState("30")
  const [archiveType, setArchiveType] = useState("audits")
  const [openBackupType, setOpenBackupType] = useState(false)
  const [openBackupFilter, setOpenBackupFilter] = useState(false)
  const [openArchiveType, setOpenArchiveType] = useState(false)
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false)
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"backups" | "archives">("backups")

  // Real data from API
  const [backups, setBackups] = useState<BackupRecord[]>([])
  const [loadingBackups, setLoadingBackups] = useState(true)
  const [savingBackup, setSavingBackup] = useState(false)
  const [backupError, setBackupError] = useState("")

  const fetchBackups = async () => {
    setLoadingBackups(true)
    try {
      const res = await fetch("/api/admin/backup")
      const data = await res.json()
      if (res.ok) setBackups(data.backups ?? [])
    } finally {
      setLoadingBackups(false)
    }
  }

  useEffect(() => { fetchBackups() }, [])

  const handleCreateBackup = async () => {
    setSavingBackup(true)
    setBackupError("")
    try {
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backup_type: backupType,
          backup_name: backupName,
          retention_days: parseInt(retentionDays, 10) || 30,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setBackupError(data.error || "Ошибка создания"); return }
      setIsBackupDialogOpen(false)
      setBackupName("")
      fetchBackups()
    } catch {
      setBackupError("Ошибка сети")
    } finally {
      setSavingBackup(false)
    }
  }

  const handleDeleteBackup = async (filename: string) => {
    if (!confirm("Удалить резервную копию?")) return
    try {
      await fetch(`/api/admin/backup?filename=${encodeURIComponent(filename)}`, { method: "DELETE" })
      fetchBackups()
    } catch {}
  }

  // Архивы — пока статические (нет отдельной таблицы в БД)
  const archives: ArchivedData[] = [
    { archive_id: 1, archive_name: "Архив ревизий 2023", data_type: "Ревизии", record_count: 145, size_mb: 512, archived_at: "2024-01-15T10:00:00Z", archived_by: "admin", status: "archived", description: "Завершённые ревизии за 2023 год" },
    { archive_id: 2, archive_name: "Архив нарушений 2023", data_type: "Нарушения", record_count: 287, size_mb: 768, archived_at: "2024-01-20T14:30:00Z", archived_by: "admin", status: "archived", description: "Зарегистрированные нарушения за 2023 год" },
    { archive_id: 3, archive_name: "Архив отчётов 2022", data_type: "Отчёты", record_count: 89, size_mb: 256, archived_at: "2024-02-01T09:15:00Z", archived_by: "admin", status: "archived", description: "Финальные отчёты за 2022 год" },
  ]

  const filteredBackups = backups.filter((backup) => {
    const matchesSearch = backup.backup_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = backupTypeFilter === "all" || backup.backup_type === backupTypeFilter
    return matchesSearch && matchesType
  })

  const filteredArchives = archives.filter((archive) =>
    archive.archive_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getBackupTypeBadge = (type: string) => {
    switch (type) {
      case "full":
        return <Badge className="bg-blue-600">Полная</Badge>
      case "incremental":
        return <Badge className="bg-green-600">Инкрементная</Badge>
      case "differential":
        return <Badge className="bg-purple-600">Дифференциальная</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Завершено
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            В процессе
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Ошибка</Badge>
      case "active":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Активно
          </Badge>
        )
      case "archived":
        return <Badge variant="secondary">Архивировано</Badge>
      case "deleted":
        return <Badge variant="destructive">Удалено</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} ГБ`
    }
    return `${mb} МБ`
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("backups")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "backups"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          <div className="flex items-center gap-2">
            <Icons.Database className="w-4 h-4" />
            Резервные копии
          </div>
        </button>
        <button
          onClick={() => setActiveTab("archives")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "archives"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          <div className="flex items-center gap-2">
            <Icons.Archive className="w-4 h-4" />
            Архивы данных
          </div>
        </button>
      </div>

      {/* Backups Tab */}
      {activeTab === "backups" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Управление резервными копиями</CardTitle>
                <CardDescription>Создание, восстановление и управление резервными копиями базы данных</CardDescription>
              </div>
              <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icons.Plus className="w-4 h-4" />
                    Создать резервную копию
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Создать резервную копию</DialogTitle>
                    <DialogDescription>Выберите тип резервной копии и параметры сохранения</DialogDescription>
                  </DialogHeader>
                  {backupError && (
                    <p className="text-sm text-destructive px-1">{backupError}</p>
                  )}
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="backup_type">Тип резервной копии *</Label>
                      <Popover open={openBackupType} onOpenChange={setOpenBackupType}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openBackupType}
                            className="w-full justify-between"
                          >
                            {backupType === "full" && "Полная резервная копия"}
                            {backupType === "incremental" && "Инкрементная копия"}
                            {backupType === "differential" && "Дифференциальная копия"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput placeholder="Поиск типа..." />
                            <CommandList>
                              <CommandEmpty>Тип не найден</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="full"
                                  onSelect={() => {
                                    setBackupType("full")
                                    setOpenBackupType(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", backupType === "full" ? "opacity-100" : "opacity-0")} />
                                  Полная резервная копия
                                </CommandItem>
                                <CommandItem
                                  value="incremental"
                                  onSelect={() => {
                                    setBackupType("incremental")
                                    setOpenBackupType(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", backupType === "incremental" ? "opacity-100" : "opacity-0")} />
                                  Инкрементная копия
                                </CommandItem>
                                <CommandItem
                                  value="differential"
                                  onSelect={() => {
                                    setBackupType("differential")
                                    setOpenBackupType(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", backupType === "differential" ? "opacity-100" : "opacity-0")} />
                                  Дифференциальная копия
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup_name">Название резервной копии</Label>
                      <Input
                        id="backup_name"
                        placeholder="Резервная копия 2024-12-10"
                        value={backupName}
                        onChange={(e) => setBackupName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retention">Период хранения (дни) *</Label>
                      <Input
                        id="retention"
                        type="number"
                        placeholder="30"
                        value={retentionDays}
                        onChange={(e) => setRetentionDays(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={handleCreateBackup} disabled={savingBackup}>
                      {savingBackup ? (
                        <><Icons.Spinner className="mr-2 h-4 w-4" />Создание...</>
                      ) : (
                        "Создать резервную копию"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию резервной копии..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Popover open={openBackupFilter} onOpenChange={setOpenBackupFilter}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openBackupFilter}
                    className="w-[200px] justify-between font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <Icons.Filter className="w-4 h-4 opacity-50" />
                      {backupTypeFilter === "all" && "Все типы"}
                      {backupTypeFilter === "full" && "Полная"}
                      {backupTypeFilter === "incremental" && "Инкрементная"}
                      {backupTypeFilter === "differential" && "Дифференциальная"}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Фильтр типа..." />
                    <CommandList>
                      <CommandEmpty>Не найдено</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setBackupTypeFilter("all")
                            setOpenBackupFilter(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", backupTypeFilter === "all" ? "opacity-100" : "opacity-0")} />
                          Все типы
                        </CommandItem>
                        <CommandItem
                          value="full"
                          onSelect={() => {
                            setBackupTypeFilter("full")
                            setOpenBackupFilter(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", backupTypeFilter === "full" ? "opacity-100" : "opacity-0")} />
                          Полная
                        </CommandItem>
                        <CommandItem
                          value="incremental"
                          onSelect={() => {
                            setBackupTypeFilter("incremental")
                            setOpenBackupFilter(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", backupTypeFilter === "incremental" ? "opacity-100" : "opacity-0")} />
                          Инкрементная
                        </CommandItem>
                        <CommandItem
                          value="differential"
                          onSelect={() => {
                            setBackupTypeFilter("differential")
                            setOpenBackupFilter(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", backupTypeFilter === "differential" ? "opacity-100" : "opacity-0")} />
                          Дифференциальная
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Хранение</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingBackups ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <Icons.Spinner className="inline w-4 h-4 mr-2" />Загрузка...
                      </TableCell>
                    </TableRow>
                  ) : filteredBackups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Резервные копии не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBackups.map((backup) => (
                      <TableRow key={backup.backup_id}>
                        <TableCell>
                          <div className="font-medium">{backup.backup_name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{backup.filename}</div>
                        </TableCell>
                        <TableCell>{getBackupTypeBadge(backup.backup_type)}</TableCell>
                        <TableCell>{formatSize(backup.size_mb)}</TableCell>
                        <TableCell className="text-sm">{formatDate(backup.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(backup.status)}</TableCell>
                        <TableCell className="text-sm">{backup.retention_days} дней</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" title="Скачать">
                              <Icons.Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Удалить"
                              onClick={() => handleDeleteBackup(backup.filename)}
                            >
                              <Icons.Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="text-sm text-muted-foreground">
              Показано {filteredBackups.length} из {backups.length} резервных копий
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archives Tab */}
      {activeTab === "archives" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Управление архивами данных</CardTitle>
                <CardDescription>Архивирование и восстановление исторических данных</CardDescription>
              </div>
              <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icons.Plus className="w-4 h-4" />
                    Создать архив
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Создать архив данных</DialogTitle>
                    <DialogDescription>Выберите данные для архивирования</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="archive_type">Тип данных *</Label>
                      <Popover open={openArchiveType} onOpenChange={setOpenArchiveType}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openArchiveType}
                            className="w-full justify-between"
                          >
                            {archiveType === "audits" && "Ревизии"}
                            {archiveType === "violations" && "Нарушения"}
                            {archiveType === "reports" && "Отчёты"}
                            {archiveType === "decisions" && "Решения"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput placeholder="Поиск типа данных..." />
                            <CommandList>
                              <CommandEmpty>Тип не найден</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="audits"
                                  onSelect={() => {
                                    setArchiveType("audits")
                                    setOpenArchiveType(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", archiveType === "audits" ? "opacity-100" : "opacity-0")} />
                                  Ревизии
                                </CommandItem>
                                <CommandItem
                                  value="violations"
                                  onSelect={() => {
                                    setArchiveType("violations")
                                    setOpenArchiveType(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", archiveType === "violations" ? "opacity-100" : "opacity-0")} />
                                  Нарушения
                                </CommandItem>
                                <CommandItem
                                  value="reports"
                                  onSelect={() => {
                                    setArchiveType("reports")
                                    setOpenArchiveType(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", archiveType === "reports" ? "opacity-100" : "opacity-0")} />
                                  Отчёты
                                </CommandItem>
                                <CommandItem
                                  value="decisions"
                                  onSelect={() => {
                                    setArchiveType("decisions")
                                    setOpenArchiveType(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", archiveType === "decisions" ? "opacity-100" : "opacity-0")} />
                                  Решения
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="archive_year">Год архивирования *</Label>
                      <Input id="archive_year" type="number" placeholder="2023" defaultValue="2023" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="archive_description">Описание</Label>
                      <Input id="archive_description" placeholder="Описание архива" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={() => setIsArchiveDialogOpen(false)}>Создать архив</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию архива..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название архива</TableHead>
                    <TableHead>Тип данных</TableHead>
                    <TableHead>Записей</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead>Дата архивирования</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArchives.map((archive) => (
                    <TableRow key={archive.archive_id}>
                      <TableCell>
                        <div className="font-medium">{archive.archive_name}</div>
                        <div className="text-sm text-muted-foreground">{archive.description}</div>
                      </TableCell>
                      <TableCell>{archive.data_type}</TableCell>
                      <TableCell>{archive.record_count}</TableCell>
                      <TableCell>{formatSize(archive.size_mb)}</TableCell>
                      <TableCell className="text-sm">{formatDate(archive.archived_at)}</TableCell>
                      <TableCell>{getStatusBadge(archive.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" title="Просмотр">
                            <Icons.Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Восстановить">
                            <Icons.Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Удалить"
                          >
                            <Icons.Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="text-sm text-muted-foreground">
              Показано {filteredArchives.length} из {archives.length} архивов
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
