"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

interface Role {
  role_id: number
  role_name: string
  access_level: number
  can_create_plans: boolean
  can_approve_plans: boolean
  can_conduct_audits: boolean
  can_view_reports: boolean
  can_manage_users: boolean
  description: string
}

export function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([
    {
      role_id: 1,
      role_name: "admin",
      access_level: 100,
      can_create_plans: true,
      can_approve_plans: true,
      can_conduct_audits: true,
      can_view_reports: true,
      can_manage_users: true,
      description: "Администратор системы",
    },
    {
      role_id: 2,
      role_name: "chief_inspector",
      access_level: 90,
      can_create_plans: true,
      can_approve_plans: true,
      can_conduct_audits: true,
      can_view_reports: true,
      can_manage_users: false,
      description: "Главный инспектор",
    },
    {
      role_id: 3,
      role_name: "inspector",
      access_level: 50,
      can_create_plans: false,
      can_approve_plans: false,
      can_conduct_audits: true,
      can_view_reports: true,
      can_manage_users: false,
      description: "Инспектор",
    },
    {
      role_id: 4,
      role_name: "viewer",
      access_level: 10,
      can_create_plans: false,
      can_approve_plans: false,
      can_conduct_audits: false,
      can_view_reports: true,
      can_manage_users: false,
      description: "Наблюдатель",
    },
  ])

  const [editingRoleId, setEditingRoleId] = useState<number | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const getRoleName = (roleName: string) => {
    switch (roleName) {
      case "admin":
        return "Администратор"
      case "chief_inspector":
        return "Главный инспектор"
      case "inspector":
        return "Инспектор"
      case "viewer":
        return "Наблюдатель"
      default:
        return roleName
    }
  }

  const getAccessLevelBadge = (level: number) => {
    if (level >= 90) return <Badge variant="destructive">Полный доступ</Badge>
    if (level >= 50) return <Badge className="bg-blue-600">Расширенный</Badge>
    if (level >= 10) return <Badge variant="secondary">Базовый</Badge>
    return <Badge variant="outline">Ограниченный</Badge>
  }

  const handlePermissionToggle = (
    roleId: number,
    permission: keyof Omit<Role, "role_id" | "role_name" | "access_level" | "description">,
  ) => {
    setRoles(
      roles.map((role) =>
        role.role_id === roleId
          ? {
              ...role,
              [permission]: !role[permission],
            }
          : role,
      ),
    )
  }

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role })
    setEditingRoleId(role.role_id)
    setIsEditDialogOpen(true)
  }

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(roles.map((role) => (role.role_id === editingRole.role_id ? editingRole : role)))
      setIsEditDialogOpen(false)
      setEditingRole(null)
      setEditingRoleId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Роли и права доступа</CardTitle>
        <CardDescription>Управление правами доступа для различных ролей пользователей</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {roles.map((role) => (
          <Card key={role.role_id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                    <Icons.Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{getRoleName(role.role_name)}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getAccessLevelBadge(role.access_level)}
                  <Dialog open={isEditDialogOpen && editingRoleId === role.role_id} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEditRole(role)} className="gap-2">
                        <Icons.Edit className="w-4 h-4" />
                        Редактировать
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Редактировать роль: {getRoleName(role.role_name)}</DialogTitle>
                        <DialogDescription>Измените описание и уровень доступа для этой роли</DialogDescription>
                      </DialogHeader>
                      {editingRole && (
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="role_description">Описание роли</Label>
                            <Input
                              id="role_description"
                              value={editingRole.description}
                              onChange={(e) =>
                                setEditingRole({
                                  ...editingRole,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="access_level">Уровень доступа (0-100)</Label>
                            <Input
                              id="access_level"
                              type="number"
                              min="0"
                              max="100"
                              value={editingRole.access_level}
                              onChange={(e) =>
                                setEditingRole({
                                  ...editingRole,
                                  access_level: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Отмена
                        </Button>
                        <Button onClick={handleSaveRole}>Сохранить изменения</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {role.can_create_plans ? (
                        <Icons.Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Icons.X className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">Создание планов</span>
                    </div>
                    <Switch
                      checked={role.can_create_plans}
                      onCheckedChange={() => handlePermissionToggle(role.role_id, "can_create_plans")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {role.can_approve_plans ? (
                        <Icons.Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Icons.X className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">Утверждение планов</span>
                    </div>
                    <Switch
                      checked={role.can_approve_plans}
                      onCheckedChange={() => handlePermissionToggle(role.role_id, "can_approve_plans")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {role.can_conduct_audits ? (
                        <Icons.Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Icons.X className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">Проведение ревизий</span>
                    </div>
                    <Switch
                      checked={role.can_conduct_audits}
                      onCheckedChange={() => handlePermissionToggle(role.role_id, "can_conduct_audits")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {role.can_view_reports ? (
                        <Icons.Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Icons.X className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">Просмотр отчётов</span>
                    </div>
                    <Switch
                      checked={role.can_view_reports}
                      onCheckedChange={() => handlePermissionToggle(role.role_id, "can_view_reports")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {role.can_manage_users ? (
                        <Icons.Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Icons.X className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">Управление пользователями</span>
                    </div>
                    <Switch
                      checked={role.can_manage_users}
                      onCheckedChange={() => handlePermissionToggle(role.role_id, "can_manage_users")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
