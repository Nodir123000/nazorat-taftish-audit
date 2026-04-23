"use client"

import { useState, useEffect } from "react"
import type { Employee, User } from "@/lib/types"
// import { employeeService } from "@/lib/services/employee-service" - REMOVED: Direct DB access from client component causes build errors
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
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Plus, Search, Eye, Edit, Trash2, CheckCircle, XCircle, Check, ChevronsUpDown, UserPlus, Users, Briefcase, ShieldCheck, Activity, Filter, MoreHorizontal, User as UserIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { z } from "zod"

const employeeSchema = z.object({
  fullname: z.string().min(5, { message: "ФИО должно содержать минимум 5 символов" }),
  rank: z.string().min(2, { message: "Звание обязательно" }),
  position: z.string().min(3, { message: "Должность обязательна" }),
  specialization: z.string().optional(),
  role: z.enum(["admin", "chief_inspector", "inspector", "viewer"]),
  is_active: z.boolean()
})

interface EmployeeRegistryProps {
  user: User
}

export function EmployeeRegistry({ user }: EmployeeRegistryProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const [form, setForm] = useState<Partial<Employee>>({
    fullname: "",
    rank: "",
    position: "",
    specialization: "",
    role: "inspector",
    is_active: true
  })

  const [formErrors, setFormErrors] = useState<any>({})
  const [openRole, setOpenRole] = useState(false)
  const [openStatus, setOpenStatus] = useState(false)
  const [openFilterRole, setOpenFilterRole] = useState(false)
  const [openFilterStatus, setOpenFilterStatus] = useState(false)

  useEffect(() => {
    loadEmployees()
  }, [filterRole, filterStatus, searchQuery])

  const loadEmployees = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterRole !== "all") params.append("role", filterRole)
      if (searchQuery) params.append("search", searchQuery)
      
      const response = await fetch(`/api/admin/users?${params.toString()}`)
      const data = await response.json()
      
      if (data.users) {
        setEmployees(data.users.map((u: any) => ({
          employee_id: u.user_id,
          fullname: u.fullname,
          rank: u.rank,
          position: u.position,
          specialization: u.specialization,
          role: u.role,
          is_active: u.is_active,
          created_at: u.created_at,
          updated_at: u.updated_at
        })))
      }
    } catch (err) {
      console.error("Failed to load employees:", err)
      toast.error("Ошибка загрузки данных")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleLabels: Record<string, { label: string; color: string }> = {
      admin: { label: "Администратор", color: "bg-red-600" },
      chief_inspector: { label: "Старший инспектор", color: "bg-purple-600" },
      inspector: { label: "Инспектор", color: "bg-blue-600" },
      viewer: { label: "Просмотр", color: "bg-gray-600" },
    }
    const roleInfo = roleLabels[role] || { label: role, color: "bg-gray-600" }
    return <Badge className={`gap-1 ${roleInfo.color}`}>{roleInfo.label}</Badge>
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="gap-1 bg-green-600">
        <CheckCircle className="w-3 h-3" />
        Активен
      </Badge>
    ) : (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="w-3 h-3" />
        Неактивен
      </Badge>
    )
  }

  const handleAddClick = () => {
    setEditingEmployee(null)
    setFormErrors({})
    setForm({
      fullname: "",
      rank: "",
      position: "",
      specialization: "",
      role: "inspector",
      is_active: true
    })
    setIsDialogOpen(true)
  }

  const handleEditClick = (emp: Employee) => {
    setEditingEmployee(emp)
    setFormErrors({})
    setForm({ ...emp })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const result = employeeSchema.safeParse(form)
    if (!result.success) {
      toast.error(result.error.errors[0].message)
      setFormErrors(result.error.format())
      return
    }
    setFormErrors({})

    if (editingEmployee) {
      setEmployees(prev =>
        prev.map(e =>
          e.employee_id === editingEmployee.employee_id ? ({ ...e, ...form } as Employee) : e
        )
      )
      toast.success("Обновлено успешно")
    } else {
      const uuid = crypto.randomUUID()
      const newEmp = {
        ...form,
        employee_id: employees.length + 1,
        uuid,
      } as Employee
      setEmployees(prev => [...prev, newEmp])
      toast.success("Добавлено успешно")
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Вы уверены?")) {
      setEmployees(prev => prev.filter(e => e.employee_id !== id))
      toast.success("Удалено")
    }
  }

  const canManageEmployees = user.role === "admin"

  const filteredEmployees = employees

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Справочник сотрудников</CardTitle>
            <CardDescription>Управление сотрудниками и инспекторами КРУ</CardDescription>
          </div>
          {canManageEmployees && (
            <Button className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 px-6 h-11 transition-all" onClick={handleAddClick}>
              <UserPlus className="w-4 h-4" />
              Добавить сотрудника
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по ФИО, должности или специализации..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Popover open={openFilterRole} onOpenChange={setOpenFilterRole}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openFilterRole}
                className="w-48 justify-between h-10 border-border/40"
              >
                {filterRole === "all" ? "Все роли" : (
                  <div className="flex items-center gap-2">
                    <Filter className="w-3 h-3 opacity-50" />
                    {filterRole === "admin" ? "Администратор" : filterRole === "chief_inspector" ? "Старший инспектор" : filterRole === "inspector" ? "Инспектор" : "Просмотр"}
                  </div>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-0 rounded-xl" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {[
                      { value: "all", label: "Все роли" },
                      { value: "admin", label: "Администратор" },
                      { value: "chief_inspector", label: "Старший инспектор" },
                      { value: "inspector", label: "Инспектор" },
                      { value: "viewer", label: "Просмотр" }
                    ].map((role) => (
                      <CommandItem
                        key={role.value}
                        value={role.value}
                        onSelect={(currentValue: string) => {
                          setFilterRole(currentValue)
                          setOpenFilterRole(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filterRole === role.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {role.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openFilterStatus} onOpenChange={setOpenFilterStatus}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openFilterStatus}
                className="w-48 justify-between h-10 border-border/40"
              >
                {filterStatus === "all" ? "Все статусы" : (
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 opacity-50" />
                    {filterStatus === "active" ? "Активные" : "Неактивные"}
                  </div>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-45 p-0 rounded-xl" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {[
                      { value: "all", label: "Все статусы" },
                      { value: "active", label: "Активные" },
                      { value: "inactive", label: "Неактивные" }
                    ].map((status) => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={(currentValue: string) => {
                          setFilterStatus(currentValue)
                          setOpenFilterStatus(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filterStatus === status.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {status.label}
                      </CommandItem>
                    ))}
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
                <TableHead>ФИО</TableHead>
                <TableHead>Звание</TableHead>
                <TableHead>Должность</TableHead>
                <TableHead>Специализация</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Сотрудники не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((emp) => (
                  <TableRow key={emp.employee_id}>
                    <TableCell className="font-medium">{emp.fullname}</TableCell>
                    <TableCell>{emp.rank}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{emp.specialization || "—"}</TableCell>
                    <TableCell>{getRoleBadge(emp.role)}</TableCell>
                    <TableCell>{getStatusBadge(emp.is_active)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {canManageEmployees && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(emp)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(emp.employee_id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Показано {filteredEmployees.length} из {employees.length} сотрудников
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                  {editingEmployee ? "Редактировать сотрудника" : "Добавить сотрудника"}
                </DialogTitle>
                <DialogDescription className="font-medium">
                  Заполните информацию о сотруднике инспекции
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="text-[11px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                <span className="h-1 w-8 bg-blue-600 rounded-full" />
                Основные данные
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">ФИО *</Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                    <Input id="fullname" value={form.fullname} onChange={e => setForm({ ...form, fullname: e.target.value })} placeholder="Иванов Иван Иванович" className="h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-bold" />
                  </div>
                  {formErrors?.fullname && (
                    <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.fullname._errors[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">Звание *</Label>
                  <Input id="rank" value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })} placeholder="Подполковник" className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-bold" />
                  {formErrors?.rank && (
                    <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.rank._errors[0]}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[11px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                <span className="h-1 w-8 bg-emerald-600 rounded-full" />
                Служебная информация
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">Должность *</Label>
                  <div className="relative group">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                    <Input id="position" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Старший инспектор" className="h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-medium" />
                  </div>
                  {formErrors?.position && (
                    <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.position._errors[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">Специализация</Label>
                  <Input id="specialization" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Финансовый контроль" className="h-11 rounded-xl bg-muted/40 border-none focus:bg-white transition-all font-medium" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[11px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                <span className="h-1 w-8 bg-purple-600 rounded-full" />
                Системный доступ
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">Роль в системе *</Label>
                  <Popover open={openRole} onOpenChange={setOpenRole}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openRole}
                        className="w-full justify-between h-11 rounded-xl bg-muted/40 border-none font-normal"
                      >
                        {form.role ? (
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-purple-500" />
                            {form.role === "admin" ? "Администратор" : form.role === "chief_inspector" ? "Старший инспектор" : form.role === "inspector" ? "Инспектор" : "Просмотр"}
                          </div>
                        ) : "Выберите роль"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-0 z-10000" align="start">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {[
                              { value: "admin", label: "Администратор" },
                              { value: "chief_inspector", label: "Старший инспектор" },
                              { value: "inspector", label: "Инспектор" },
                              { value: "viewer", label: "Просмотр" }
                            ].map((role) => (
                              <CommandItem
                                key={role.value}
                                value={role.value}
                                onSelect={(currentValue: string) => {
                                  setForm({ ...form, role: currentValue as any })
                                  setOpenRole(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    form.role === role.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {role.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {formErrors?.role && (
                    <p className="text-sm text-destructive mt-1 ml-1 font-medium">{formErrors.role._errors[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">Статус</Label>
                  <Popover open={openStatus} onOpenChange={setOpenStatus}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openStatus}
                        className="w-full justify-between h-11 rounded-xl bg-muted/40 border-none font-normal"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className={cn("w-4 h-4", form.is_active ? "text-emerald-500" : "text-slate-400")} />
                          {form.is_active ? "Активен" : "Неактивен"}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-45 p-0 z-10000" align="start">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {[
                              { value: "active", label: "Активен", active: true },
                              { value: "inactive", label: "Неактивен", active: false }
                            ].map((status) => (
                              <CommandItem
                                key={status.value}
                                value={status.value}
                                onSelect={() => {
                                  setForm({ ...form, is_active: status.active })
                                  setOpenStatus(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    form.is_active === status.active ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {status.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 px-6 font-bold">
              Отмена
            </Button>
            <Button onClick={handleSave} className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 font-bold transition-all hover:scale-[1.02] text-white">
              {editingEmployee ? "Сохранить изменения" : "Добавить сотрудника"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
