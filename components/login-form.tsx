"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/icons"
import { login } from "@/lib/auth"

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(username, password)

      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(result.error || "Ошибка входа")
      }
    } catch (err) {
      setError("Произошла ошибка при входе")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md relative z-10 border-primary/20 bg-card/95 backdrop-blur">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
          <Icons.Shield className="w-10 h-10 text-primary-foreground" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">АИС КРР</CardTitle>
          <CardDescription className="mt-2">
            Автоматизированная информационная система
            <br />
            контрольно-ревизионной работы
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Введите имя пользователя"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Введите пароль"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Icons.Spinner className="mr-2 h-4 w-4" />
                Вход...
              </>
            ) : (
              "Войти в систему"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
