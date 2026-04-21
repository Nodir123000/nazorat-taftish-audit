"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { httpClient } from "@/lib/api/http-client"
import { Badge } from "@/components/ui/badge"

export default function PlaygroundPage() {
    const [method, setMethod] = useState("GET")
    const [url, setUrl] = useState("/personnel")
    const [response, setResponse] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<number | null>(null)

    const handleRequest = async () => {
        setLoading(true)
        setResponse(null)
        setStatus(null)

        try {
            const res = await httpClient.request(url, { method }) as any
            setResponse(res?.data ?? res)
            setStatus(res?.status ?? 200)
        } catch (error: any) {
            setResponse(error.response?.data || error.message)
            setStatus(error.response?.status || 500)
        } finally {
            setLoading(false)
        }
    }

    const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

    return (
        <div className="container mx-auto p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">🛠 Developer Playground</h1>
                <Badge variant={isMock ? "destructive" : "outline"}>
                    Mode: {isMock ? "MOCK" : "REAL"}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>API Explorer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <select
                            className="border rounded p-2 bg-background"
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                        >
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>DELETE</option>
                        </select>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="/endpoint"
                        />
                        <Button onClick={handleRequest} disabled={loading}>
                            {loading ? "Sending..." : "Send Request"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="h-[500px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3">
                    <span className="font-mono text-sm">Response</span>
                    {status && (
                        <Badge variant={status >= 200 && status < 300 ? "default" : "destructive"}>
                            Status: {status}
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-auto bg-slate-950 text-slate-50 font-mono text-sm">
                    <pre className="p-4">
                        {response ? JSON.stringify(response, null, 2) : "// Waiting for request..."}
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}
