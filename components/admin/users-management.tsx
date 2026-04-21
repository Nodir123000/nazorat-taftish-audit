"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/icons"

interface UsersManagementProps {
  currentUser: User
}

const EMPTY_ADD_FORM = {
  username: "", password: "", fullname: "",
  rank: "", position: "", email: "", phone: "", role: "inspector",
}

export function UsersManagement({ currentUser }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState("")
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState(EMPTY_ADD_FORM)
  const [addError, setAddError] = useState("")

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<User & { password?: string }>>({})
  const [editError, setEditError] = useState("")

  // ─── Fetch ───────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (search = "") => {
    setLoading(true)
    setApiError("")
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : ""
      const res = await fetch(`/api/admin/users${q}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Ошибка загрузки")
      setUsers(data.users)
    } catch (e: any) {
      setApiError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Поиск с задержкой
  useEffect(() => {
    const t = setTimeout(() => fetchUsers(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery, fetchUsers])

  // ─── Create ───────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    setAddError("")
    if (!addForm.username.trim() || !addForm.password || !addForm.fullname.trim()) {
      setAddError("Заполните обязательные поля: логин, пароль, ФИО")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      })
      const data = await res.json()
      if (!res.ok) { setAddError(data.error || "Ошибка создания"); return }
      setIsAddDialogOpen(false)
      setAddForm(EMPTY_ADD_FORM)
      fetchUsers(searchQuery)
    } catch {
      setAddError("Ошибка сети")
    } finally {
      setSaving(false)
    }
  }

  // ─── Update ───────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!editForm.user_id) return
    setEditError("")
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${editForm.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (!res.ok) { setEditError(data.error || "Ошибка обновления"); return }
      setIsEditDialogOpen(false)
      fetchUsers(searchQuery)
    } catch {
      setEditError("Ошибка сети")
    } finally {
      setSaving(false)
    }
  }

  // ─── Toggle status ────────────────────────────────────────────────────────
  const handleToggleStatus = async (userId: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "PATCH" })
      if (res.ok) {
        const { is_active } = await res.json()
        setUsers((prev) => prev.map((u) => u.user_id === userId ? { ...u, is_active } : u))
      }
    } catch {}
  }

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (userId: number) => {
    if (userId === currentUser.user_id) return
    if (!confirm("Вы уверены, что хотите удалить пользователя?")) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
      if (res.ok) setUsers((prev) => prev.filter((u) => u.user_id !== userId))
    } catch {}
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return <Badge variant="destructive">Администратор</Badge>
      case "chief_inspector": return <Badge className="bg-purple-600">Главный инспектор</Badge>
      case "inspector": return <Badge className="bg-blue-600">Инспектор</Badge>
      case "viewer": return <Badge variant="secondary">Наблюдатель</Badge>
      default: return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Управление пользователями</CardTitle>
            <CardDescription>Добавление, редактирование и удаление пользователей системы</CardDescription>
          </div>

          {/* Диалог добавления */}
          <Dialog open={isAddDialogOpen} onOpenChange={(o) => { setIsAddDialogOpen(o); if (!o) { setAddForm(EMPTY_ADD_FORM); setAddError("") } }}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={currentUser.role !== "admin"}>
                <Icons.Plus className="w-4 h-4" />
                Добавить пользователя
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Добавить нового пользователя</DialogTitle>
                <DialogDescription>Заполните информацию о новом пользователе системы</DialogDescription>
              </DialogHeader>
              {addError && <Alert variant="destructive"><AlertDescription>{addError}</AlertDescription></Alert>}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Имя пользователя *</Label>
                    <Input placeholder="ivanov" value={addForm.username} onChange={(e) => setAddForm((f) => ({ ...f, username: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Пароль * (мин. 8 символов)</Label>
                    <Input type="password" placeholder="••••••••" value={addForm.password} onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ФИО *</Label>
                  <Input placeholder="Иванов Иван Иванович" value={addForm.fullname} onChange={(e) => setAddForm((f) => ({ ...f, fullname: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Звание</Label>
                    <Input placeholder="Майор" value={addForm.rank} onChange={(e) => setAddForm((f) => ({ ...f, rank: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Должность</Label>
                    <Input placeholder="Инспектор" value={addForm.position} onChange={(e) => setAddForm((f) => ({ ...f, position: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="user@mil.uz" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input placeholder="+998 XX XXX XX XX" value={addForm.phone} onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Роль *</Label>
                  <Select value={addForm.role} onValueChange={(v) => setAddForm((f) => ({ ...f, role: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="chief_inspector">Главный инспектор</SelectItem>
                      <SelectItem value="inspector">Инспектор</SelectItem>
                      <SelectItem value="viewer">Наблюдатель</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
                <Button onClick={handleCreate} disabled={saving}>
                  {saving ? <><Icons.Spinner className="mr-2 h-4 w-4" />Создание...</> : "Создать пользователя"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {apiError && <Alert variant="destructive"><AlertDescription>{apiError}</AlertDescription></Alert>}

        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени, логину или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Звание / Должность</TableHead>
                <TableHead>Контакты</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground"><Icons.Spinner className="inline w-4 h-4 mr-2" />Загрузка...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Пользователи не найдены</TableCell></TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.fullname}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.rank}</div>
                        <div className="text-muted-foreground">{user.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.email}</div>
                        <div className="text-muted-foreground">{user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                          <Icons.Check className="w-3 h-3" />Активен
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
                          <Icons.X className="w-3 h-3" />Неактивен
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Редактировать"
                          disabled={user.user_id === currentUser.user_id}
                          onClick={() => { setEditForm({ ...user, password: "" }); setEditError(""); setIsEditDialogOpen(true) }}>
                          <Icons.Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title={user.is_active ? "Деактивировать" : "Активировать"}
                          disabled={user.user_id === currentUser.user_id}
                          onClick={() => handleToggleStatus(user.user_id)}>
                          <Icons.Eye className={`w-4 h-4 ${user.is_active ? "opacity-50" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="sm" title="Удалить"
                          disabled={user.user_id === currentUser.user_id}
                          onClick={() => handleDelete(user.user_id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50">
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

        <div className="text-sm text-muted-foreground">Всего пользователей: {users.length}</div>
      </CardContent>

      {/* Диалог редактирования */}
      <Dialog open={isEditDialogOpen} onOpenChange={(o) => { setIsEditDialogOpen(o); if (!o) setEditError("") }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
            <DialogDescription>Измените данные пользователя @{editForm.username}</DialogDescription>
          </DialogHeader>
          {editError && <Alert variant="destructive"><AlertDescription>{editError}</AlertDescription></Alert>}
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>ФИО *</Label>
              <Input value={editForm.fullname || ""} onChange={(e) => setEditForm((f) => ({ ...f, fullname: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Звание</Label>
                <Input value={editForm.rank || ""} onChange={(e) => setEditForm((f) => ({ ...f, rank: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Должность</Label>
                <Input value={editForm.position || ""} onChange={(e) => setEditForm((f) => ({ ...f, position: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={editForm.email || ""} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input value={editForm.phone || ""} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Роль</Label>
              <Select value={editForm.role || "inspector"} onValueChange={(v) => setEditForm((f) => ({ ...f, role: v as User["role"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="chief_inspector">Главный инспектор</SelectItem>
                  <SelectItem value="inspector">Инспектор</SelectItem>
                  <SelectItem value="viewer">Наблюдатель</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Новый пароль (оставьте пустым, чтобы не менять)</Label>
              <Input type="password" placeholder="••••••••" value={editForm.password || ""}
                onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleUpdate} disabled={saving}>
              {saving ? <><Icons.Spinner className="mr-2 h-4 w-4" />Сохранение...</> : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
