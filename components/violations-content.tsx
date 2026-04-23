"use client"

import type { User } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ViolationsList } from "@/components/violations/violations-list"
import { ViolationForm52 } from "@/components/violations/violation-form52"
import { ResponsiblePersons } from "@/components/violations/responsible-persons"
import { ViolationDocuments } from "@/components/violations/violation-documents"
import { Icons } from "@/components/icons"

interface ViolationsContentProps {
  user?: User
  initialSection?: string
}

export function ViolationsContent({ user, initialSection = "list" }: ViolationsContentProps) {
  // Mock user if not provided (for pages where it's not passed yet)
  const currentUser = user || {
    id: 1,
    name: "Администратор",
    role: "admin",
    username: "admin"
  } as any;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-linear-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
          <Icons.Alert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Учёт нарушений</h1>
          <p className="text-muted-foreground">Регистрация и контроль выявленных нарушений</p>
        </div>
      </div>

      <Tabs defaultValue={initialSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-200">
          <TabsTrigger value="list" className="gap-2">
            <Icons.Alert className="w-4 h-4" />
            Все нарушения
          </TabsTrigger>
          <TabsTrigger value="form52" className="gap-2">
            <Icons.FileText className="w-4 h-4" />
            Форма 52/ФС
          </TabsTrigger>
          <TabsTrigger value="responsible" className="gap-2">
            <Icons.Users className="w-4 h-4" />
            Ответственные
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <Icons.Folder className="w-4 h-4" />
            Документы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ViolationsList user={currentUser} />
        </TabsContent>

        <TabsContent value="form52">
          <ViolationForm52 user={currentUser} />
        </TabsContent>

        <TabsContent value="responsible">
          <ResponsiblePersons user={currentUser} />
        </TabsContent>

        <TabsContent value="documents">
          <ViolationDocuments user={currentUser} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
