"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { UnitSelect } from "@/components/reference/unit-select"
import { PersonnelSelect } from "@/components/reference/personnel-select"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { translations } from "@/lib/i18n/translations"
import { useI18n } from "@/lib/i18n/context"

interface OrderFormData {
  location: string
  orderDate: string
  unit: string
  signerName: string
  signerRank: string
  signerPosition: string
  instructionDetails: string
  safetyMeasures: string
  groupMembersList: string[]
}

export default function CreateBriefingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale: systemLocale } = useI18n()
  const trUi = (key: string) => translations[systemLocale]?.[key] || translations.ru[key] || key

  const [activeTab, setActiveTab] = useState("header")
  const [prefilledFromPlan, setPrefilledFromPlan] = useState<string | null>(null)
  const [unitName, setUnitName] = useState<string>("")

  const [formData, setFormData] = useState<OrderFormData>({
    location: "г. Ташкент",
    orderDate: "",
    unit: "",
    signerName: "",
    signerRank: "",
    signerPosition: "",
    instructionDetails: "",
    safetyMeasures: "",
    groupMembersList: [],
  })

  useEffect(() => {
    const planId = searchParams.get("planId")
    if (planId) {
      setPrefilledFromPlan(planId)
      fetch(`/api/planning/annual?id=${planId}`)
        .then(res => res.json())
        .then(plan => {
          const uName = plan.unit?.name?.ru || plan.unit?.name || plan.controlObject || ""
          setUnitName(uName)

          setFormData(prev => ({
            ...prev,
            unit: plan.unitId?.toString() || "",
            instructionDetails: `Доведены цели и задачи проверки финансово-хозяйственной деятельности. Разъяснены права и обязанности.`,
          }))
        })
    }
  }, [searchParams])

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePersonnelChange = (field: "signerName", id: string) => {
    const person = militaryPersonnel.find(p => p.id.toString() === id)
    setFormData((prev) => ({
      ...prev,
      [field]: id,
      signerRank: person?.rank || "",
      signerPosition: person?.position || "",
    }))
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        planId: prefilledFromPlan,
        instructorId: formData.signerName,
        instructionDate: formData.orderDate,
        safetyMeasures: formData.safetyMeasures,
        status: "conducted"
      }

      const res = await fetch("/api/planning/briefings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to save briefing")

      alert("Инструктаж успешно зарегистрирован")
      router.push("/planning/orders")
    } catch (error) {
      console.error(error)
      alert("Ошибка при сохранении")
    }
  }

  const sections = [
    { id: "header", label: "1. Общие данные", icon: Icons.UserCheck },
    { id: "content", label: "2. Содержание", icon: Icons.FileText },
  ]

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between shrink-0 h-16">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <Icons.ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Регистрация инструктажа</h1>
            <p className="text-xs text-slate-500">Министерство обороны РУз</p>
          </div>
        </div>
        <Button onClick={handleSubmit} size="sm" className="bg-blue-600 hover:bg-blue-700 ml-2">
          <Icons.Check className="mr-2 h-4 w-4" />
          Зарегистрировать
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto hidden md:block">
          <div className="p-4 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === section.id ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                <section.icon className={`h-4 w-4 ${activeTab === section.id ? "text-blue-600" : "text-slate-400"}`} />
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-1 bg-white overflow-y-auto p-6 md:p-8 shadow-inner z-10">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4">
              {sections.find(s => s.id === activeTab)?.label}
            </h2>

            <div className={activeTab === "header" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label htmlFor="location" className="font-semibold text-sm">Место проведения</Label>
                <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="orderDate" className="font-semibold text-sm">Дата проведения</Label>
                <Input id="orderDate" type="date" value={formData.orderDate} onChange={(e) => handleInputChange("orderDate", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-sm">Инструктирующее лицо</Label>
                <PersonnelSelect value={formData.signerName} onValueChange={(v) => handlePersonnelChange("signerName")} returnId />
              </div>
            </div>

            <div className={activeTab === "content" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label htmlFor="instructionDetails" className="font-semibold text-sm">Тема и содержание</Label>
                <Textarea id="instructionDetails" value={formData.instructionDetails} onChange={(e) => handleInputChange("instructionDetails", e.target.value)} rows={6} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="safetyMeasures" className="font-semibold text-sm">Меры безопасности</Label>
                <Textarea id="safetyMeasures" value={formData.safetyMeasures} onChange={(e) => handleInputChange("safetyMeasures", e.target.value)} rows={6} />
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="ghost" onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeTab);
                if (currentIndex > 0) setActiveTab(sections[currentIndex - 1].id);
              }} disabled={activeTab === sections[0].id}>Назад</Button>
              <Button onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeTab);
                if (currentIndex < sections.length - 1) setActiveTab(sections[currentIndex + 1].id);
              }} disabled={activeTab === sections[sections.length - 1].id}>Далее</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
