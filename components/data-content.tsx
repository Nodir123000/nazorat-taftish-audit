"use client"

import { useState } from "react"
import { SectionsTabs } from "@/components/sections-tabs"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DataContent() {
  const [activeSection, setActiveSection] = useState("overview")

  const sections = [
    { id: "overview", title: "Обзор", icon: Icons.Eye },
    { id: "database", title: "Справочная база", icon: Icons.Database },
    { id: "import", title: "Импорт", icon: Icons.Upload },
    { id: "export", title: "Экспорт", icon: Icons.Download },
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Записей в БД</CardTitle>
                  <Icons.Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,547</div>
                  <p className="text-xs text-muted-foreground">Всего записей</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Таблиц</CardTitle>
                  <Icons.Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">Таблиц в системе</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Размер БД</CardTitle>
                  <Icons.HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3 ГБ</div>
                  <p className="text-xs text-muted-foreground">Объём данных</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Последнее обновление</CardTitle>
                  <Icons.Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2 ч</div>
                  <p className="text-xs text-muted-foreground">Назад</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Справочная база</CardTitle>
                  <CardDescription>Управление справочниками и классификаторами</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/data/database">
                    <Button className="w-full">Открыть</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Импорт данных</CardTitle>
                  <CardDescription>Загрузка данных из внешних источников</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/data/import">
                    <Button className="w-full">Открыть</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Экспорт данных</CardTitle>
                  <CardDescription>Выгрузка данных в различные форматы</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/data/export">
                    <Button className="w-full">Открыть</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "database":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Справочная база</h2>
              <p className="text-muted-foreground">Управление справочниками и классификаторами системы</p>
            </div>
            <Link href="/data/database">
              <Button>Перейти в справочную базу</Button>
            </Link>
          </div>
        )
      case "import":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Импорт данных</h2>
              <p className="text-muted-foreground">Загрузка данных из внешних источников</p>
            </div>
            <Link href="/data/import">
              <Button>Перейти в импорт</Button>
            </Link>
          </div>
        )
      case "export":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Экспорт данных</h2>
              <p className="text-muted-foreground">Выгрузка данных в различные форматы</p>
            </div>
            <Link href="/data/export">
              <Button>Перейти в экспорт</Button>
            </Link>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Модуль Данные</h1>
        <p className="text-muted-foreground">Управление данными, справочниками и интеграция с внешними системами</p>
      </div>

      <SectionsTabs
        pageId="data"
        submoduleTitle="Модуль Данные"
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {renderSectionContent()}
    </div>
  )
}
