"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { ClassifierSelect } from "@/components/reference/classifier-select"
import { UnitSelect } from "@/components/reference/unit-select"
import { PersonnelSelect } from "@/components/reference/personnel-select"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons } from "@/components/reference/physical-persons-data"
import { translations } from "@/lib/i18n/translations"
import { Locale } from "@/lib/i18n/context"
import { militaryUnits } from "@/lib/data/military-data"
import html2canvas from "html2canvas"
import { renderTemplate } from "@/lib/utils/template-renderer"

const getUnitName = (id: string) => {
  const unit = militaryUnits.find((u) => u.id.toString() === id)
  return unit ? unit.name : id
}

const getMonthName = (dateStr: string, locale: Locale) => {
  if (!dateStr) return "___"
  const date = new Date(dateStr)
  let lang = "ru-RU"
  if (locale === "uzCyrl") lang = "uz-Cyrl-UZ"
  if (locale === "uzLatn") lang = "uz-Latn-UZ"
  return date.toLocaleString(lang, { month: "long" })
}

const getPersonnelName = (id: string) => {
  const mp = militaryPersonnel.find((p) => p.id.toString() === id)
  if (!mp) return id
  const person = physicalPersons.find((p) => p.id === mp.personId)
  return person
    ? `${person.lastName} ${person.firstName.charAt(0)}.${person.middleName ? person.middleName.charAt(0) + "." : ""}`
    : id
}

interface OrderFormData {
  // Header
  location: string
  orderDate: string
  orderNumber: string

  // Section 1: Appointment of responsible persons
  groupLeader: string
  groupLeaderRank: string
  groupLeaderPosition: string
  deputyLeader: string
  deputyLeaderRank: string
  deputyLeaderPosition: string
  groupMembers: string

  // Section 2: Control measures details
  startDate: string
  endDate: string
  unit: string
  unitCommander: string
  controlMeasuresDescription: string

  // Section 3: Group leader responsibilities
  instructionDate: string
  instructionDetails: string
  safetyMeasures: string

  // Section 4: Additional provisions
  specialistInvolvement: string
  transportRestrictions: string
  aviationTransport: string

  // Section 5: Control and notification
  controlNotes: string

  // Signatory
  signerName: string
  signerRank: string
  signerPosition: string

  // Internal state for list management
  groupMembersList: string[]

  // Briefing specifics
  planBasis: string
  planYear?: number
  incomingNumber?: string
  incomingDate?: string
}

export default function CreateBriefingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("header")
  const [copied, setCopied] = useState(false)
  const [prefilledFromPlan, setPrefilledFromPlan] = useState<string | null>(null)
  const [templates, setTemplates] = useState<any[]>([])
  const [unitName, setUnitName] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  const [formData, setFormData] = useState<OrderFormData>({
    location: "г. Ташкент",
    orderDate: "",
    orderNumber: "",
    groupLeader: "",
    groupLeaderRank: "",
    groupLeaderPosition: "",
    deputyLeader: "",
    deputyLeaderRank: "",
    deputyLeaderPosition: "",
    groupMembers: "список прилагается",
    groupMembersList: [],
    startDate: "",
    endDate: "",
    unit: "",
    unitCommander: "",
    controlMeasuresDescription: "",
    instructionDate: "",
    instructionDetails: "",
    safetyMeasures: "",
    specialistInvolvement: "",
    transportRestrictions: "",
    aviationTransport: "",
    controlNotes: "",
    signerName: "",
    signerRank: "",
    signerPosition: "",
    planBasis: "",
    planYear: undefined,
    incomingNumber: "",
    incomingDate: "",
  })

  useEffect(() => {
    const planId = searchParams.get("planId")

    // Fetch Templates
    fetch("/api/reference/templates?type=briefing")
      .then(res => res.json())
      .then(data => {
        setTemplates(data)
        if (data.length > 0) setSelectedTemplate(data[0].id)
      })

    if (planId) {
      setPrefilledFromPlan(planId)
      fetch(`/api/planning/annual?id=${planId}`)
        .then(res => res.json())
        .then(plan => {
          const responsibleId = plan.responsibleId?.toString() || ""
          const person = militaryPersonnel.find(p => p.id.toString() === responsibleId)

          const uName = plan.unit?.name?.ru || plan.unit?.name || plan.controlObject || ""
          setUnitName(uName)

          // Auto-fill from Order (Commission Members)
          let memberIds: string[] = []
          let groupLeader = responsibleId
          let deputyLeader = ""

          // Find an active order or the first order
          const activeOrder = plan.orders?.find((o: any) => o.status !== "cancelled") || plan.orders?.[0]
          if (activeOrder && activeOrder.commission_members) {
            // Log for debugging (optional/transient)
            console.log(`Auto-filling from order ${activeOrder.order_number}`);
            
            memberIds = activeOrder.commission_members.map((m: any) => m.user_id.toString())
            
            const leader = activeOrder.commission_members.find((m: any) => m.role === "Руководитель" || m.role?.includes("куководитель"))
            const deputy = activeOrder.commission_members.find((m: any) => m.role === "Заместитель")
            
            if (leader) groupLeader = leader.user_id.toString()
            if (deputy) deputyLeader = deputy.user_id.toString()
          }

          const leaderPerson = militaryPersonnel.find(p => p.id.toString() === groupLeader)
          const deputyPerson = militaryPersonnel.find(p => p.id.toString() === deputyLeader)

          setFormData(prev => {
            const updated = {
              ...prev,
              unit: plan.unitId?.toString() || "",
              unitCommander: plan.unit?.commander_name || "",
              startDate: plan.startDate ? plan.startDate.split('T')[0] : "",
              endDate: plan.endDate ? plan.endDate.split('T')[0] : "",
              planBasis: plan.planNumber ? `План №${plan.planNumber}` : `План №${planId}`,
              groupLeader: groupLeader,
              groupLeaderRank: leaderPerson?.rank || person?.rank || "",
              groupLeaderPosition: leaderPerson?.position || person?.position || "",
              deputyLeader: deputyLeader,
              deputyLeaderRank: deputyPerson?.rank || "",
              deputyLeaderPosition: deputyPerson?.position || "",
              groupMembersList: memberIds,
              signerName: groupLeader, // Default instructor is the group leader
              signerRank: leaderPerson?.rank || person?.rank || "",
              signerPosition: leaderPerson?.position || person?.position || "",
              planYear: plan.year,
              incomingNumber: plan.incomingNumber || "",
              incomingDate: plan.incomingDate ? plan.incomingDate.split('T')[0] : "",
              instructionDetails: `Доведены цели и задачи ${plan.inspectionType || "проверки"} финансово-хозяйственной деятельности ${plan.controlObject || "части"}. Разъяснены права и обязанности ревизора. Обращено внимание на качественное оформление материалов проверки.`,
            }
            return updated
          })

          // Update descriptive strings for members
          if (memberIds.length > 0) {
            const lines = memberIds.map((id) => {
              const mp = militaryPersonnel.find(x => x.id.toString() === id)
              const name = getPersonnelName(id)
              return `${mp?.rank?.toLowerCase() || ""} ${name}`
            })
            setFormData(prev => ({
              ...prev,
              groupMembers: lines.join("\n")
            }))
          }
        })
    }
  }, [searchParams])

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePersonnelChange = (field: "groupLeader" | "deputyLeader" | "signerName", id: string) => {
    const person = militaryPersonnel.find(p => p.id.toString() === id)

    if (field === "signerName") {
      setFormData((prev) => ({
        ...prev,
        signerName: id,
        signerRank: person?.rank || "",
        signerPosition: person?.position || "",
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [field]: id,
      [`${field}Rank`]: person?.rank || "",
      [`${field}Position`]: person?.position || "",
    }))
  }

  const updateGroupMembers = (ids: string[]) => {
    // 1. Fetch details
    const lines = ids.map((id) => {
      const p = militaryPersonnel.find(x => x.id.toString() === id)
      const name = getPersonnelName(id)
      return `${p?.rank?.toLowerCase() || ""} ${name}`
    })

    setFormData(prev => ({
      ...prev,
      groupMembersList: ids,
      groupMembers: ids.length > 0 ? lines.join("\n") : "список прилагается"
    }))
  }

  // Logic for Group Members
  const handleAddMember = (id: string) => {
    if (formData.groupMembersList.includes(id)) return

    const newList = [...formData.groupMembersList, id]
    updateGroupMembers(newList)
  }

  const handleRemoveMember = (id: string) => {
    const newList = formData.groupMembersList.filter(m => m !== id)
    updateGroupMembers(newList)
  }

  const generatePlainText = () => {
    return `ЛИСТ ИНСТРУКТАЖА\n\n${formData.location}\nДата: ${formData.orderDate}`
  }

  const handleDownload = async (format: "txt" | "docx" | "pdf") => {
    if (format === "txt") {
      const text = generatePlainText()
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Инструктаж_${formData.startDate || "новый"}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else if (format === "pdf") {
      const element = document.getElementById("briefing-preview-container")
      if (!element) return

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
          onclone: (clonedDoc) => {
            const clonedEl = clonedDoc.getElementById("briefing-preview-container")
            if (clonedEl) {
              clonedEl.style.boxShadow = "none"
              clonedEl.style.border = "none"
              clonedEl.style.padding = "2cm"
              clonedEl.style.margin = "0"
              clonedEl.style.width = "21cm"
              clonedEl.style.backgroundColor = "#ffffff"
            }
          }
        })

        const imgData = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = imgData
        link.download = `Инструктаж_${formData.orderNumber || "без_номера"}.png`
        link.click()
      } catch (error) {
        console.error("PDF generation error:", error)
        alert("Ошибка при создании PDF. Пожалуйста, попробуйте еще раз.")
      }
    } else {
      alert(`Скачивание в формате ${format.toUpperCase()} будет доступно в следующих обновлениях.`)
    }
  }

  const handleCopy = () => {
    const text = generatePlainText()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        planId: prefilledFromPlan,
        instructorId: formData.signerName,
        instructionDate: formData.orderDate, // Using orderDate as instruction date
        content: generatePlainText(),
        safetyMeasures: formData.safetyMeasures,
        status: "conducted"
      }

      const res = await fetch("/api/planning/briefings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to save briefing")

      alert("Инструктаж успешно сохранен")
      router.push("/planning/orders")
    } catch (error) {
      console.error(error)
      alert("Ошибка при сохранении")
    }
  }

  const sections = [
    { id: "header", label: "1. Инструктирующий", icon: Icons.UserCheck },
    { id: "group", label: "2. Инструктируемые", icon: Icons.Users },
    { id: "content", label: "3. Содержание", icon: Icons.FileText },
  ]

  /* Document Preview Component */
  const DocumentPreview = () => {
    const [previewLocale, setPreviewLocale] = useState<Locale>("ru")

    const currentTemplate = templates.find(t =>
      (previewLocale === "ru" && t.locale === "ru") ||
      (previewLocale === "uzCyrl" && t.locale === "uz_cy") ||
      (previewLocale === "uzLatn" && t.locale === "uz_lt")
    )

    const renderedContent = currentTemplate
      ? renderTemplate(currentTemplate.content, formData, previewLocale)
      : "Загрузка шаблона..."

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Language Switcher & Actions */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b shrink-0 px-2 lg:px-0">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewLocale("ru")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewLocale === "ru" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              RU
            </button>
            <button
              onClick={() => setPreviewLocale("uzCyrl")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewLocale === "uzCyrl" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              ЎЗБ
            </button>
            <button
              onClick={() => setPreviewLocale("uzLatn")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewLocale === "uzLatn" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              UZB
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              title="Копировать текст"
            >
              {copied ? <Icons.Check className="w-4 h-4 text-emerald-500" /> : <Icons.Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              title="Скачать PDF"
            >
              <Icons.Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Page with Fixed ID for PDF capture */}
        <div className="flex-1 overflow-auto bg-slate-100 p-4 lg:p-10 flex justify-center">
          <div
            id="briefing-preview-container"
            className="bg-white shadow-lg w-[21cm] min-h-[29.7cm] p-[2cm] font-serif text-slate-900 leading-relaxed text-[12pt] origin-top"
          >
            {/* Content from Template */}
            <div className="whitespace-pre-wrap text-justify">
              {renderedContent}
            </div>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between shrink-0 h-16">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <Icons.ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Создание листа инструктажа</h1>
            <p className="text-xs text-slate-500">Министерство обороны РУз</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleDownload("docx")} className="gap-2">
            <Icons.File className="h-4 w-4 text-blue-600" />
            Word
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownload("pdf")} className="gap-2 mr-2">
            <Icons.File className="h-4 w-4 text-red-600" />
            PDF
          </Button>
          <Button onClick={handleSubmit} size="sm" className="bg-blue-600 hover:bg-blue-700 ml-2">
            <Icons.Check className="mr-2 h-4 w-4" />
            Сохранить
          </Button>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Column 1: Navigation Sidebar */}
        <nav className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto hidden md:block">
          <div className="p-4 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === section.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <section.icon className={`h-4 w-4 ${activeTab === section.id ? "text-blue-600" : "text-slate-400"}`} />
                {section.label}
              </button>
            ))}
          </div>
          {prefilledFromPlan && (
            <div className="mx-4 mt-auto mb-4 p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800">
              <p className="font-semibold mb-1">Основание:</p>
              План №{prefilledFromPlan}
            </div>
          )}
        </nav>

        {/* Column 2: Form Content (Scrollable) */}
        <main className="flex-1 bg-white overflow-y-auto p-6 md:p-8 min-w-[320px] shadow-inner z-10">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4">
              {sections.find(s => s.id === activeTab)?.label}
            </h2>

            {/* Conditional Rendering of Tabs */}
            <div className={activeTab === "header" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label htmlFor="location" className="font-semibold text-sm">
                  Место <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="г. Ташкент"
                  className={`border-slate-300 text-sm ${!formData.location && 'border-red-300 bg-red-50'}`}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="unit" className="font-semibold text-sm">Воинская часть</Label>
                {prefilledFromPlan ? (
                  <Input
                    value={unitName}
                    disabled
                    className="bg-slate-50 font-medium opacity-100 cursor-not-allowed"
                  />
                ) : (
                  <UnitSelect
                    value={formData.unit}
                    onValueChange={(v) => handleInputChange("unit", v)}
                    placeholder="Выберите часть"
                  />
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="orderDate" className="font-semibold text-sm">
                  Дата <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => handleInputChange("orderDate", e.target.value)}
                  className={`border-slate-300 text-sm ${!formData.orderDate && 'border-red-300 bg-red-50'}`}
                />
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-3 mt-4">Инструктирующее лицо</div>

              <div className="space-y-1">
                <Label htmlFor="signerRank" className="font-semibold text-sm">Звание</Label>
                <ClassifierSelect classifierId={6} value={formData.signerRank} onValueChange={(v) => handleInputChange("signerRank", v)} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="signerName" className="font-semibold text-sm">ФИО <span className="text-red-500">*</span></Label>
                <PersonnelSelect value={formData.signerName} onValueChange={(v) => handlePersonnelChange("signerName", v)} returnId />
              </div>

              <div className="space-y-1">
                <Label htmlFor="signerPosition" className="font-semibold text-sm">Должность</Label>
                <ClassifierSelect classifierId={13} value={formData.signerPosition} onValueChange={(v) => handleInputChange("signerPosition", v)} placeholder="Выберите должность" />
              </div>

              <div className="pt-4 border-t">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Данные годового плана</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="planYear" className="font-semibold text-sm">Год плана</Label>
                  <Input
                    id="planYear"
                    type="number"
                    value={formData.planYear || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, planYear: parseInt(e.target.value) }))}
                    className="border-slate-300 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="planBasis" className="font-semibold text-sm">Основание (для заголовка)</Label>
                  <Input
                    id="planBasis"
                    value={formData.planBasis}
                    onChange={(e) => handleInputChange("planBasis", e.target.value)}
                    placeholder="План №123"
                    className="border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="incomingNumber" className="font-semibold text-sm">Входящий №</Label>
                  <Input
                    id="incomingNumber"
                    value={formData.incomingNumber}
                    onChange={(e) => handleInputChange("incomingNumber", e.target.value)}
                    placeholder="Напр. 12/34"
                    className="border-slate-300 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="incomingDate" className="font-semibold text-sm">Дата документа</Label>
                  <Input
                    id="incomingDate"
                    type="date"
                    value={formData.incomingDate}
                    onChange={(e) => handleInputChange("incomingDate", e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className={activeTab === "group" ? "block space-y-4" : "hidden"}>
              <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-3">Инструктируемые лица</div>
              <div className="border-t pt-4 mt-4">
                <Label className="font-semibold text-sm block mb-2">Состав группы</Label>
                {formData.groupMembersList.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {formData.groupMembersList.map((id, index) => {
                      const p = militaryPersonnel.find(x => x.id.toString() === id)
                      const name = getPersonnelName(id)
                      return (
                        <div key={id} className="flex items-center justify-between p-2 bg-slate-50 border rounded text-sm">
                          <span>{index + 1}. {p?.rank} {name}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(id)} className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50">
                            ✕
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="flex gap-2">
                  <PersonnelSelect
                    placeholder="Добавить сотрудника..."
                    onValueChange={(v) => handleAddMember(v)}
                    returnId
                    value=""
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className={activeTab === "content" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label htmlFor="instructionDetails" className="font-semibold text-sm">1. Тема и содержание инструктажа</Label>
                <Textarea id="instructionDetails" value={formData.instructionDetails} onChange={(e) => handleInputChange("instructionDetails", e.target.value)} placeholder="Доведены цели и задачи..." rows={6} className="border-slate-300 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="safetyMeasures" className="font-semibold text-sm">2. Меры безопасности</Label>
                <Textarea id="safetyMeasures" value={formData.safetyMeasures} onChange={(e) => handleInputChange("safetyMeasures", e.target.value)} placeholder="Соблюдать правила..." rows={6} className="border-slate-300 text-sm" />
              </div>
            </div>

            {/* Navigation Buttons (Bottom of Form) */}
            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button variant="ghost" onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeTab);
                if (currentIndex > 0) setActiveTab(sections[currentIndex - 1].id);
              }} disabled={activeTab === sections[0].id}>
                Назад
              </Button>
              <Button onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeTab);
                if (currentIndex < sections.length - 1) setActiveTab(sections[currentIndex + 1].id);
              }} disabled={activeTab === sections[sections.length - 1].id}>
                Далее
              </Button>
            </div>
          </div>
        </main>

        {/* Column 3: Sticky Preview (Right Side) */}
        <aside className="w-[45%] bg-slate-100 border-l border-slate-300 overflow-hidden hidden lg:flex flex-col">
          <div className="p-6 flex-1 h-full">
            <DocumentPreview />
          </div>
        </aside>
      </div>
    </div>
  )
}
