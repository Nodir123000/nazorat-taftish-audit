"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardRecentActivity({ activity }: { activity: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Последняя активность</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activity.map((item) => (
                        <div key={item.id} className="flex flex-col border-b pb-2 last:border-0">
                            <span className="font-semibold text-sm">{item.title}</span>
                            <span className="text-xs text-muted-foreground">{item.description}</span>
                            <span className="text-[10px] text-muted-foreground mt-1">{new Date(item.timestamp).toLocaleString()} • {item.user}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
