"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Mic, MicOff, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [commandInput, setCommandInput] = useState("")
  const router = useRouter()

  const recognitionRef = useRef<any>(null)
  const isListeningRef = useRef(false)

  const commandMappings: Record<string, string> = {
    // Main sections
    главная: "/dashboard",
    главное: "/dashboard",
    "главная страница": "/dashboard",
    "панель управления": "/dashboard",
    дашборд: "/dashboard",
    домой: "/dashboard",
    "на главную": "/dashboard",

    // Planning section - Планирование КРР
    планирование: "/planning/annual",
    план: "/planning/annual",
    планы: "/planning/annual",
    "годовое планирование": "/planning/annual",
    "годовой план": "/planning/annual",
    "годовые планы": "/planning/annual",
    приказы: "/planning/orders",
    приказ: "/planning/orders",
    "приказы и назначения": "/planning/orders",
    назначения: "/planning/orders",
    назначение: "/planning/orders",

    // KPI section - KPI Сотрудников
    кипиай: "/kpi/employees",
    кпи: "/kpi/employees",
    "карточки сотрудников": "/kpi/employees",
    карточки: "/kpi/employees",
    карточка: "/kpi/employees",
    "данные и расчет": "/kpi/management",
    "данные и расчёт": "/kpi/management",
    данные: "/kpi/management",
    расчет: "/kpi/management",
    расчёт: "/kpi/management",
    "аналитика кипиай": "/kpi/analytics",
    "аналитика кпи": "/kpi/analytics",

    // Audits section - Проведение ревизии
    "проведение ревизии": "/audits/financial-activity",
    "проведение ревизий": "/audits/financial-activity",
    ревизии: "/audits/financial-activity",
    ревизия: "/audits/financial-activity",
    "проверка фхд": "/audits/financial-activity",
    "финансовая деятельность": "/audits/financial-activity",
    "финансово хозяйственная деятельность": "/audits/financial-activity",

    // Violations section - Учёт нарушений
    "учет нарушений": "/violations/financial",
    "учёт нарушений": "/violations/financial",
    нарушения: "/violations/financial",
    нарушение: "/violations/financial",
    "финансовые нарушения": "/violations/financial",
    "финансовое нарушение": "/violations/financial",
    "недостачи имущества": "/violations/assets",
    недостачи: "/violations/assets",
    недостача: "/violations/assets",
    имущество: "/violations/assets",

    // Personnel section - Штат
    штат: "/personnel/list",
    кадры: "/personnel/list",
    персонал: "/personnel/list",
    "список военнослужащих": "/personnel/list",
    военнослужащие: "/personnel/list",
    военнослужащий: "/personnel/list",
    категории: "/personnel/categories",
    категория: "/personnel/categories",
    должности: "/personnel/positions",
    должность: "/personnel/positions",

    // Reports section - Отчётность
    отчетность: "/reports/generation",
    отчётность: "/reports/generation",
    отчеты: "/reports/generation",
    отчёты: "/reports/generation",
    отчет: "/reports/generation",
    отчёт: "/reports/generation",
    "формирование отчетов": "/reports/generation",
    "формирование отчётов": "/reports/generation",
    "формирование отчета": "/reports/generation",
    "формирование отчёта": "/reports/generation",
    формирование: "/reports/generation",
    "пояснительная записка": "/reports/explanatory",
    пояснительная: "/reports/explanatory",
    записка: "/reports/explanatory",
    пояснительный: "/reports/explanatory",
    "аналитика и своды": "/reports/analytics",
    "аналитика и свод": "/reports/analytics",
    аналитика: "/reports/analytics",
    своды: "/reports/analytics",
    свод: "/reports/analytics",

    // Reference section - Справочники
    справочники: "/reference/database",
    справочник: "/reference/database",
    "справочная база": "/reference/database",
    справочная: "/reference/database",
    "нормативная база": "/reference/regulatory",
    нормативная: "/reference/regulatory",
    нормативы: "/reference/regulatory",
    норматив: "/reference/regulatory",
    "классификация расходов": "/reference/expense-classification",
    классификация: "/reference/expense-classification",
    расходы: "/reference/expense-classification",
    "статьи расходов": "/reference/expense-classification",
    "коды расходов": "/reference/expense-classification",
    смета: "/reference/expense-classification",
    "довольствующие управления": "/reference/expense-classification",

    // Administration section - Администрирование
    администрирование: "/admin/users",
    админ: "/admin/users",
    администратор: "/admin/users",
    "учет пользователей": "/admin/users",
    "учёт пользователей": "/admin/users",
    пользователи: "/admin/users",
    пользователь: "/admin/users",
    "роли и права": "/admin/roles",
    роли: "/admin/roles",
    роль: "/admin/roles",
    права: "/admin/roles",
    "история изменений": "/admin/audit-log",
    история: "/admin/audit-log",
    изменения: "/admin/audit-log",
    "журнал изменений": "/admin/audit-log",
    "аудит кипиай": "/kpi/audit",
    "аудит кпи": "/kpi/audit",
    "архив ревизий": "/admin/archive",
    архив: "/admin/archive",
    "резервные копии": "/admin/backup",
    резервные: "/admin/backup",
    копии: "/admin/backup",
    бэкап: "/admin/backup",
    backup: "/admin/backup",

    // Security section - Управление доступом
    "управление доступом": "/security-access",
    доступ: "/security-access",
    доступом: "/security-access",
    безопасность: "/security-access",
    "контроль доступа": "/security-access",
    "права доступа": "/security-access",

    // Translation management - Управление переводами системы
    "управление переводами": "/translation-management",
    "управление переводами системы": "/translation-management",
    переводы: "/translation-management",
    переводами: "/translation-management",
    "управление языками": "/translation-management",
    языки: "/translation-management",
    локализация: "/translation-management",
    "система переводов": "/translation-management",
  }

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.log("[VoiceAssistant] Speech Recognition not supported")
      setIsSupported(false)
      return
    }

    const isSecure = window.location.protocol === "https:" || window.location.hostname === "localhost"
    if (!isSecure) {
      console.log("[VoiceAssistant] HTTPS required")
      setIsSupported(false)
      return
    }

    // Initialize recognition
    const recognition = new SpeechRecognition()
    recognition.lang = "ru-RU"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = true

    recognition.onresult = (event: any) => {
      // Get the last result
      const lastResultIndex = event.results.length - 1
      const speechResult = event.results[lastResultIndex][0].transcript.toLowerCase().trim()
      console.log("[VoiceAssistant] Recognized:", speechResult)
      processCommand(speechResult)
    }

    recognition.onerror = (event: any) => {
      // Ignore 'no-speech' errors as they are expected during silence in continuous mode
      if (event.error === "no-speech") {
        return
      }

      console.error("[VoiceAssistant] Error:", event.error)
      if (event.error === "not-allowed") {
        setIsListening(false)
        isListeningRef.current = false
        toast.error("Доступ к микрофону запрещен")
      } else if (event.error === "network") {
        setIsListening(false)
        isListeningRef.current = false
        toast.warning("Проблема с сетью")
      } else if (event.error === "aborted") {
        // User stopped or system stopped
        console.log("[VoiceAssistant] Aborted")
      }
      // Don't stop for 'no-speech', we want to keep listening
    }

    recognition.onend = () => {
      console.log("[VoiceAssistant] Ended. Should restart?", isListeningRef.current)
      if (isListeningRef.current) {
        try {
          recognition.start()
          console.log("[VoiceAssistant] Restarted")
        } catch (e) {
          console.error("[VoiceAssistant] Failed to restart:", e)
          // Avoid infinite loops if start fails immediately
          setTimeout(() => {
            if (isListeningRef.current) recognition.start()
          }, 1000)
        }
      } else {
        setIsListening(false)
      }
    }

    recognition.onstart = () => {
      console.log("[VoiceAssistant] Started")
      setIsListening(true)
    }

    recognitionRef.current = recognition
    setIsSupported(true)

    return () => {
      isListeningRef.current = false
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const processCommand = (command: string) => {
    console.log("[VoiceAssistant] Processing:", command)

    const normalizedCommand = command
      .toLowerCase()
      .replace(/[.,!?;:]/g, "")
      .trim()

    // 1. Exact match
    if (commandMappings[normalizedCommand]) {
      const route = commandMappings[normalizedCommand]
      console.log("[VoiceAssistant] Exact match ->", route)
      toast.success(`Переход: ${normalizedCommand}`)
      router.push(route)
      return
    }

    // 2. Partial match
    for (const [keyword, route] of Object.entries(commandMappings)) {
      if (normalizedCommand.includes(keyword) || keyword.includes(normalizedCommand)) {
        console.log("[VoiceAssistant] Partial match:", keyword, "->", route)
        toast.success(`Переход: ${keyword}`)
        router.push(route)
        return
      }
    }

    toast.error("Команда не распознана", {
      description: `Вы сказали: "${command}"`
    })
  }

  const handleTextCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commandInput.trim()) return

    processCommand(commandInput.toLowerCase().trim())
    setCommandInput("")
    setIsDialogOpen(false)
  }

  const toggleListening = () => {
    if (!recognitionRef.current || !isSupported) {
      toast.error("Голосовой помощник недоступен")
      setIsDialogOpen(true)
      return
    }

    if (isListening) {
      isListeningRef.current = false
      recognitionRef.current.stop()
      toast.info("Голосовой помощник отключен")
    } else {
      isListeningRef.current = true
      try {
        recognitionRef.current.start()
        toast.success("Слушаю...")
      } catch (e) {
        console.error("Start error:", e)
      }
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-400 bg-transparent"
            title="Текстовый ввод команд"
          >
            <Terminal className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Текстовый ввод команды</DialogTitle>
            <DialogDescription>
              Введите команду для навигации по системе
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTextCommand} className="space-y-4">
            <Input
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Введите команду..."
              autoFocus
            />
            <Button type="submit" className="w-full">
              Выполнить
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        size="icon"
        className={`rounded-full transition-all ${isListening
          ? "bg-red-500 text-white border-red-600 hover:bg-red-600 shadow-lg shadow-red-500/50 animate-pulse"
          : "hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-400"
          }`}
        onClick={toggleListening}
        title={isSupported ? "Нажмите для голосового управления" : "Недоступно"}
      >
        {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </Button>
    </div>
  )
}
