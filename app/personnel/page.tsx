"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { mockPersonnelData } from "@/lib/mock-data/personnel"
import { Button } from "@/components/ui/button"

export default function PersonnelDashboardPage() {
    const stats = useMemo(() => {
        const totalPersonnel = mockPersonnelData.length
        const uniqueRanks = new Set(mockPersonnelData.map((p) => p.militaryRank)).size
        const uniquePositions = new Set(mockPersonnelData.map((p) => p.position)).size
        const uniqueUnits = new Set(mockPersonnelData.map((p) => p.militaryUnit)).size

        return {
            totalPersonnel,
            uniqueRanks,
            uniquePositions,
            uniqueUnits
        }
    }, [])

    return (
        <div className="flex flex-col h-full space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Кадры</h1>
                    <p className="text-sm text-muted-foreground mt-1">Обзор кадрового состава</p>
                </div>
                <Link href="/personnel/list">
                    <Button variant="outline">
                        Перейти к списку
                        <Icons.ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700">Инспекторов</CardTitle>
                        <div className="rounded-full bg-blue-100 p-2 ring-2 ring-blue-200">
                            <Icons.Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900">{stats.totalPersonnel}</div>
                        <p className="text-xs text-blue-600 font-medium">Всего в системе</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-cyan-700">Воинских частей</CardTitle>
                        <div className="rounded-full bg-cyan-100 p-2 ring-2 ring-cyan-200">
                            <Icons.Home className="h-4 w-4 text-cyan-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-cyan-900">{stats.uniqueUnits}</div>
                        <p className="text-xs text-cyan-600 font-medium">Обслужено</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700">Воинские звания</CardTitle>
                        <div className="rounded-full bg-green-100 p-2 ring-2 ring-green-200">
                            <Icons.Badge className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-900">{stats.uniqueRanks}</div>
                        <p className="text-xs text-green-600 font-medium">Уникальных</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-700">Должности</CardTitle>
                        <div className="rounded-full bg-orange-100 p-2 ring-2 ring-orange-200">
                            <Icons.Briefcase className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-900">{stats.uniquePositions}</div>
                        <p className="text-xs text-orange-600 font-medium">Уникальных</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
