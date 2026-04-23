"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PageSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="border-none shadow-lg overflow-hidden">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-3 w-20" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters Skeleton */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <Skeleton className="h-12 flex-1 min-w-75 rounded-2xl" />
                        <Skeleton className="h-12 w-50 rounded-2xl" />
                        <Skeleton className="h-12 w-30 rounded-2xl" />
                    </div>
                </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-75" />
                        <Skeleton className="h-4 w-md" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-11 w-24 rounded-xl" />
                        <Skeleton className="h-11 w-24 rounded-xl" />
                    </div>
                </div>
                <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                        <div className="p-8 space-y-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex gap-4 items-center pb-4 border-b border-slate-50 last:border-0">
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                    <Skeleton className="h-10 flex-1 rounded-lg" />
                                    <Skeleton className="h-10 w-32 rounded-lg" />
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                    <Skeleton className="h-10 w-16 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
