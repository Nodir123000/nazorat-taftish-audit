"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { ClassifierSelect } from "@/components/reference/classifier-select"
import { UnitSelect } from "@/components/reference/unit-select"
import { PersonnelSelect } from "@/components/reference/personnel-select"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons } from "@/components/reference/physical-persons-data"
import { translations } from "@/lib/i18n/translations"
import { useI18n } from "@/lib/i18n/context"

const getPersonnelName = (id: string) => {
  const mp = militaryPersonnel.find((p) => p.id.toString() === id)
  if (!mp) return id
  const person = physicalPersons.find((p) => p.id === mp.personId)
  return person
    ? `${person.lastName} ${person.firstName.charAt(0)}.${person.middleName ? person.middleName.charAt(0) + "." : ""}`
    : id
}

interface OrderFormData {
  location: string
  orderDate: string
  orderNumber: string
  groupLeader: string
  groupLeaderRank: string
  groupLeaderPosition: string
  startDate: string
  endDate: string
  unit: string
  signerName: string
}

export default function CreatePrescriptionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale: systemLocale } = useI18n()
  const trUi = (key: string) => translations[systemLocale]?.[key] || translations.ru[key] || key

  const [activeTab, setActiveTab] = useState("requisites")
  const [prefilledFromPlan, setPrefilledFromPlan] = useState<string | null>(null)
  const [unitName, setUnitName] = useState<string>("")

  const [formData, setFormData] = useState<OrderFormData>({
    location: "г. Ташкент",
    orderDate: "",
    orderNumber: "",
    groupLeader: "",
    groupLeaderRank: "",
    groupLeaderPosition: "",
    startDate: "",
    endDate: "",
    unit: "",
    signerName: "",
  })

  useEffect(() => {
    const planId = searchParams.get("planId")
    if (planId) {
      setPrefilledFromPlan(planId)
      fetch(`/api/planning/annual?id=${planId}`)
        .then(res => res.json())
        .then(plan => {
          const responsibleId = plan.responsibleId?.toString() || ""
          const person = militaryPersonnel.find(p => p.id.toString() === responsibleId)
          const uName = plan.unit?.name?.ru || plan.unit?.name || plan.controlObject || ""
          setUnitName(uName)

          setFormData(prev => ({
            ...prev,
            unit: plan.unitId?.toString() || "",
            startDate: plan.startDate ? plan.startDate.split('T')[0] : "",
            endDate: plan.endDate ? plan.endDate.split('T')[0] : "",
            groupLeader: responsibleId,
            groupLeaderRank: person?.rank || "",
            groupLeaderPosition: person?.position || "",
          }))
        })
    }
  }, [searchParams])

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePersonnelChange = (field: "groupLeader" | "signerName", id: string) => {
    const person = militaryPersonnel.find(p => p.id.toString() === id)
    if (field === "signerName") {
      setFormData((prev) => ({ ...prev, signerName: id }))
      return
    }
    setFormData((prev) => ({
      ...prev,
      [field]: id,
      [`${field}Rank`]: person?.rank || "",
      [`${field}Position`]: person?.position || "",
    }))
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        planId: prefilledFromPlan,
        prescriptionNum: formData.orderNumber,
        issueDate: formData.orderDate,
        issuerId: formData.signerName,
        status: "issued"
      }

      const res = await fetch("/api/planning/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to save prescription")

      alert("Предписание успешно зарегистрировано");
      router.push(`/personnel/view/${formData.groupLeader}?mode=inspector&action=fill-audit&planId=${prefilledFromPlan || ""}`);
    } catch (error) {
      console.error(error)
      alert("Ошибка при сохранении")
    }
  }

  const sections = [
    { id: "requisites", label: "1. Реквизиты", icon: Icons.FileText },
    { id: "group", label: "2. Группа", icon: Icons.Users },
    { id: "measures", label: "3. Мероприятия", icon: Icons.Calendar },
    { id: "signatory", label: "4. Подписание", icon: Icons.Key },
  ]

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between shrink-0 h-16">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <Icons.ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Регистрация предписания</h1>
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

            <div className={activeTab === "requisites" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label htmlFor="location" className="font-semibold text-sm">Место издания</Label>
                <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="orderNumber" className="font-semibold text-sm">Номер предписания</Label>
                  <Input id="orderNumber" value={formData.orderNumber} onChange={(e) => handleInputChange("orderNumber", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="orderDate" className="font-semibold text-sm">Дата</Label>
                  <Input id="orderDate" type="date" value={formData.orderDate} onChange={(e) => handleInputChange("orderDate", e.target.value)} />
                </div>
              </div>
            </div>

            <div className={activeTab === "group" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label className="font-semibold text-sm">Руководитель группы</Label>
                <PersonnelSelect value={formData.groupLeader} onValueChange={(v) => handlePersonnelChange("groupLeader", v)} returnId />
              </div>
            </div>

            <div className={activeTab === "measures" ? "block space-y-4" : "hidden"}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-semibold text-sm">Начало</Label>
                  <Input type="date" value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="font-semibold text-sm">Конец</Label>
                  <Input type="date" value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-sm">Объект</Label>
                <Input value={unitName} disabled className="bg-slate-50" />
              </div>
            </div>

            <div className={activeTab === "signatory" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label className="font-semibold text-sm">Кто подписал</Label>
                <PersonnelSelect value={formData.signerName} onValueChange={(v) => handlePersonnelChange("signerName", v)} returnId />
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
