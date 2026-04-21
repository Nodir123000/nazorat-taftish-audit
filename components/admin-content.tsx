"use client"

import type { User } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersManagement } from "@/components/admin/users-management"
import { RolesManagement } from "@/components/admin/roles-management"
import { AuditLogViewer } from "@/components/admin/audit-log-viewer"
import { ArchiveBackup } from "@/components/admin/archive-backup"
import { Icons } from "@/components/icons"

interface AdminContentProps {
  user: User
}

export function AdminContent({ user }: AdminContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
          <Icons.Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Администрирование</h1>
          <p className="text-muted-foreground">Управление пользователями и безопасность системы</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-full">
          <TabsTrigger value="users" className="gap-2">
            <Icons.Users className="w-4 h-4" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Icons.Key className="w-4 h-4" />
            Роли и права
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Icons.Scroll className="w-4 h-4" />
            Журнал аудита
          </TabsTrigger>
          <TabsTrigger value="archive" className="gap-2">
            <Icons.Archive className="w-4 h-4" />
            Архив и резерв
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersManagement currentUser={user} />
        </TabsContent>

        <TabsContent value="roles">
          <RolesManagement />
        </TabsContent>

        <TabsContent value="logs">
          <AuditLogViewer />
        </TabsContent>

        <TabsContent value="archive">
          <ArchiveBackup />
        </TabsContent>
      </Tabs>
    </div>
  )
}
