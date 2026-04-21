"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { renderTemplate } from "@/lib/utils/template-renderer"
import html2canvas from "html2canvas"

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

  // Plan details from DB
  planYear?: number
  incomingNumber?: string
  incomingDate?: string
  planBasis?: string
  planNumber?: string
  planDate?: string
  requirements?: string

  // Internal state for list management
  groupMembersList: string[]
}

export default function CreatePrescriptionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("requisites")
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
    groupMembers: "согласно приложению № 1 (плану)",
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
    planNumber: "",
    planDate: "",
    requirements: ""
  })

  useEffect(() => {
    const planId = searchParams.get("planId")

    // Fetch Templates
    fetch("/api/reference/templates?type=prescription")
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

          setFormData(prev => ({
            ...prev,
            unit: plan.unitId?.toString() || "",
            unitCommander: plan.unit?.commander_name || "",
            startDate: plan.startDate ? plan.startDate.split('T')[0] : "",
            endDate: plan.endDate ? plan.endDate.split('T')[0] : "",
            planNumber: plan.planNumber || planId,
            planDate: plan.planDate ? plan.planDate.split('T')[0] : "",
            planYear: plan.year || 2025,
            planBasis: plan.planNumber ? `План контрольных мероприятий №${plan.planNumber}` : `План №${planId}`,
            groupLeader: responsibleId,
            groupLeaderRank: person?.rank || "",
            groupLeaderPosition: person?.position || "",
            controlMeasuresDescription: `${plan.inspectionType || "Проверка"} финансово-хозяйственной деятельности ${plan.controlObject || "части"}.`,
            requirements: `обеспечить группу по проведению ${plan.inspectionType || "контрольных мероприятий"}, а также внутреннюю комиссию по проверке необходимыми служебными помещениями, техникой и техническими средствами;

организовать полное представление ревизорам (специалистам) всех документов, относящихся к проверяемому периоду (доходы-расходы), ответственными лицами;

при необходимости, для служебных нужд в период проверки выделять служебный автотранспорт в установленном порядке.`,
          }))
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

  const updateGroupMembers = (ids: string[]) => {
    // 1. Fetch details
    const lines = ids.map((id) => {
      const p = militaryPersonnel.find(x => x.id.toString() === id)
      const name = getPersonnelName(id)
      // Format: "Rank (lowercase) Name - Position"
      return `${p?.rank?.toLowerCase() || ""} ${name} – ${p?.position || ""}`
    })

    setFormData(prev => ({
      ...prev,
      groupMembersList: ids,
      // If list is empty, revert to default placeholder or keep empty
      groupMembers: ids.length > 0 ? lines.join("\n") : "согласно приложению № 1 (плану)"
    }))
  }

  const generatePlainText = () => {
    // NOTE: Simplified text generation for internal use/clipboard
    return `ПРЕДПИСАНИЕ\n\n${formData.location}\nДата: ${formData.orderDate}`
  }

  const handleDownload = async (format: "txt" | "docx" | "pdf") => {
    if (format === "txt") {
      const text = generatePlainText()
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Предписание_${formData.startDate || "новое"}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else if (format === "pdf") {
      const element = document.getElementById("pdf-content")
      if (!element) return

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById("pdf-content")
            if (el) {
              el.style.boxShadow = "none"
              el.style.border = "none"
              el.style.margin = "0"
              el.style.padding = "2cm"
              el.style.width = "21cm"
              el.style.minHeight = "29.7cm"
              el.style.backgroundColor = "#ffffff"
              el.style.color = "#000000"

              // Remove anything that might use lab() or oklch()
              const allElements = el.getElementsByTagName("*")
              for (let i = 0; i < allElements.length; i++) {
                const item = allElements[i] as HTMLElement
                item.style.boxShadow = "none"
              }
            }
          }
        })

        const imgData = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = imgData
        link.download = `Предписание_${formData.orderNumber || "новое"}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error("PDF export failed:", error)
        alert("Ошибка при генерации документа")
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
        prescriptionNum: formData.orderNumber,
        issueDate: formData.orderDate,
        issuedById: formData.signerName,
        content: generatePlainText(),
        status: "issued"
      }

      const res = await fetch("/api/planning/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to save prescription")

      alert("Предписание успешно сохранено. Переход к карточке инспектора для ввода результатов.");
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
    { id: "leader", label: "4. Руководитель", icon: Icons.UserCheck },
    { id: "additional", label: "5. Дополнительно", icon: Icons.Settings },
  ]

  /* Document Preview Component (Using Dynamic Templates) */
  const DocumentPreview = () => {
    const [previewLocale, setPreviewLocale] = useState<"ru" | "uz_cy" | "uz_lt">("ru")

    // Find current template
    const currentTemplate = templates.find(t =>
      t.type === "prescription" &&
      t.locale === (previewLocale === "uz_cy" ? "uz_cy" : previewLocale === "uz_lt" ? "uz_lt" : "ru")
    )

    const renderedContent = currentTemplate
      ? renderTemplate(currentTemplate.content, {
        ...formData,
        unit: unitName || getUnitName(formData.unit)
      }, previewLocale === "uz_cy" ? "uz_cy" : previewLocale === "uz_lt" ? "uz_lt" : "ru" as any)
      : ""

    return (
      <div className="flex flex-col h-full">
        {/* Language Switcher & Actions */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b print:hidden">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => {
                setPreviewLocale("ru")
                const t = templates.find(temp => temp.locale === "ru" && temp.type === "prescription")
                if (t) setSelectedTemplate(t.id)
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewLocale === "ru" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              RU
            </button>
            <button
              onClick={() => {
                setPreviewLocale("uz_cy")
                const t = templates.find(temp => temp.locale === "uz_cy" && temp.type === "prescription")
                if (t) setSelectedTemplate(t.id)
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewLocale === "uz_cy" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              ЎЗБ
            </button>
            <button
              onClick={() => {
                setPreviewLocale("uz_lt")
                const t = templates.find(temp => temp.locale === "uz_lt" && temp.type === "prescription")
                if (t) setSelectedTemplate(t.id)
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewLocale === "uz_lt" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              UZB
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-blue-600 transition-colors"
              title="Копировать текст"
            >
              {copied ? <Icons.Check className="w-4 h-4 text-emerald-500" /> : <Icons.Copy className="w-4 h-4" />}
            </button>
            <button onClick={() => handleDownload("txt")} className="text-slate-400 hover:text-blue-600 transition-colors" title="Скачать .txt">
              <Icons.Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Template selector if multiple RU templates exist */}
        {templates.filter(t => t.locale === (previewLocale === "uz_cy" ? "uz_cy" : previewLocale === "uz_lt" ? "uz_lt" : "ru") && t.type === "prescription").length > 1 && (
          <div className="mb-4 print:hidden">
            <Label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">Вариант шаблона</Label>
            <select
              className="w-full text-xs border rounded p-1 bg-slate-50"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              {templates
                .filter(t => t.locale === (previewLocale === "uz_cy" ? "uz_cy" : previewLocale === "uz_lt" ? "uz_lt" : "ru") && t.type === "prescription")
                .map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))
              }
            </select>
          </div>
        )}

        {/* Document Page */}
        <div id="pdf-content" className="bg-white shadow-lg mx-auto p-[2cm] min-h-[29.7cm] w-[21cm] font-serif text-slate-900 leading-relaxed text-[12pt] relative overflow-hidden">
          <div className="whitespace-pre-wrap text-justify">
            {renderedContent || <div className="flex flex-col items-center justify-center h-64 text-slate-300 italic">
              <Icons.File className="w-12 h-12 mb-2 opacity-20" />
              Шаблон не найден
            </div>}
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
            <h1 className="text-lg font-bold text-slate-900">Создание предписания на ревизию</h1>
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
            Создать предписание
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
            <div className={activeTab === "requisites" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label htmlFor="location" className="font-semibold text-sm">
                  Место издания предписания <span className="text-red-500">*</span>
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
                <Label htmlFor="orderDate" className="font-semibold text-sm">
                  Дата издания предписания <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => handleInputChange("orderDate", e.target.value)}
                  className={`border-slate-300 text-sm ${!formData.orderDate && 'border-red-300 bg-red-50'}`}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="planBasis" className="font-semibold text-sm">Основание (План)</Label>
                <Input id="planBasis" value={formData.planBasis} onChange={(e) => handleInputChange("planBasis", e.target.value)} className="border-slate-300 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="planNumber" className="font-semibold text-sm">Номер плана</Label>
                  <Input id="planNumber" value={formData.planNumber} onChange={(e) => handleInputChange("planNumber", e.target.value)} className="border-slate-300 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="planDate" className="font-semibold text-sm">Дата плана</Label>
                  <Input id="planDate" type="date" value={formData.planDate} onChange={(e) => handleInputChange("planDate", e.target.value)} className="border-slate-300 text-sm" />
                </div>
              </div>
            </div>

            <div className={activeTab === "group" ? "block space-y-4" : "hidden"}>
              <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-3">Раздел 2: Состав группы</div>

              <div className="space-y-1">
                <Label htmlFor="groupLeaderRank" className="font-semibold text-sm">Звание руководителя</Label>
                <ClassifierSelect classifierId={6} value={formData.groupLeaderRank} onValueChange={(v) => handleInputChange("groupLeaderRank", v)} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="groupLeader" className="font-semibold text-sm">ФИО руководителя <span className="text-red-500">*</span></Label>
                <PersonnelSelect value={formData.groupLeader} onValueChange={(v) => handlePersonnelChange("groupLeader", v)} returnId />
              </div>

              <div className="space-y-1">
                <Label htmlFor="groupLeaderPosition" className="font-semibold text-sm">Должность руководителя</Label>
                <ClassifierSelect classifierId={13} value={formData.groupLeaderPosition} onValueChange={(v) => handleInputChange("groupLeaderPosition", v)} placeholder="Выберите должность" />
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="space-y-1">
                  <Label htmlFor="deputyLeaderRank" className="font-semibold text-sm">Звание заместителя</Label>
                  <ClassifierSelect classifierId={6} value={formData.deputyLeaderRank} onValueChange={(v) => handleInputChange("deputyLeaderRank", v)} />
                </div>
                <div className="space-y-1 mt-3">
                  <Label htmlFor="deputyLeader" className="font-semibold text-sm">ФИО заместителя</Label>
                  <PersonnelSelect value={formData.deputyLeader} onValueChange={(v) => handlePersonnelChange("deputyLeader", v)} returnId />
                </div>
                <div className="space-y-1 mt-3">
                  <Label htmlFor="deputyLeaderPosition" className="font-semibold text-sm">Должность заместителя</Label>
                  <ClassifierSelect classifierId={13} value={formData.deputyLeaderPosition} onValueChange={(v) => handleInputChange("deputyLeaderPosition", v)} placeholder="Выберите должность" />
                </div>
              </div>

              {/* Group Members Section */}
              <div className="border-t pt-4 mt-4">
                <Label className="font-semibold text-sm block mb-2">Члены группы (Специалисты)</Label>

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
                    placeholder="Добавить специалиста..."
                    onValueChange={(v) => handleAddMember(v)}
                    returnId
                    value=""
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Выберите сотрудников, чтобы добавить их в список группы.</p>

                {/* Fallback Textarea if they want to edit manually */}
                <div className="mt-4">
                  <Label className="text-xs text-slate-400">Предпросмотр списка (редактируемый)</Label>
                  <Textarea
                    value={formData.groupMembers}
                    onChange={(e) => setFormData(prev => ({ ...prev, groupMembers: e.target.value }))}
                    className="text-sm font-mono bg-slate-50"
                    rows={5}
                  />
                </div>
              </div>
            </div>

            <div className={activeTab === "measures" ? "block space-y-4" : "hidden"}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="startDate" className="font-semibold text-xs">Дата начала <span className="text-red-500">*</span></Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} className={`border-slate-300 text-sm ${!formData.startDate && 'border-red-300 bg-red-50'}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endDate" className="font-semibold text-xs">Дата окончания <span className="text-red-500">*</span></Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} className={`border-slate-300 text-sm ${!formData.endDate && 'border-red-300 bg-red-50'}`} />
                </div>
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
                <Label htmlFor="unitCommander" className="font-semibold text-sm">Командир части</Label>
                <PersonnelSelect value={formData.unitCommander} onValueChange={(v) => handleInputChange("unitCommander", v)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="controlMeasuresDescription" className="font-semibold text-sm">Описание мероприятий</Label>
                <Textarea id="controlMeasuresDescription" value={formData.controlMeasuresDescription} onChange={(e) => handleInputChange("controlMeasuresDescription", e.target.value)} placeholder="Описание..." rows={4} className="border-slate-300 text-sm" />
              </div>
            </div>

            <div className={activeTab === "leader" ? "block space-y-4" : "hidden"}>
              <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-3">Раздел 4: Подписание предписания</div>

              <div className="space-y-1">
                <Label htmlFor="signerRank" className="font-semibold text-sm">Звание подписывающего</Label>
                <ClassifierSelect classifierId={6} value={formData.signerRank} onValueChange={(v) => handleInputChange("signerRank", v)} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="signerName" className="font-semibold text-sm">ФИО подписывающего <span className="text-red-500">*</span></Label>
                <PersonnelSelect value={formData.signerName} onValueChange={(v) => handlePersonnelChange("signerName", v)} returnId />
              </div>

              <div className="space-y-1">
                <Label htmlFor="signerPosition" className="font-semibold text-sm">Должность подписывающего</Label>
                <ClassifierSelect classifierId={13} value={formData.signerPosition} onValueChange={(v) => handleInputChange("signerPosition", v)} placeholder="Выберите должность" />
              </div>
            </div>

            <div className={activeTab === "additional" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label htmlFor="requirements" className="font-semibold text-sm">Требования к руководителю объекта</Label>
                <Textarea id="requirements" value={formData.requirements} onChange={(e) => handleInputChange("requirements", e.target.value)} placeholder="обеспечить группу..." rows={6} className="border-slate-300 text-sm" />
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

        <aside className="w-[45%] bg-slate-200 border-l border-slate-300 overflow-y-auto hidden lg:flex flex-col items-center py-8">
          <div className="sticky top-8 scale-[0.7] md:scale-[0.8] lg:scale-[0.85] origin-top">
            <DocumentPreview />
          </div>
        </aside>
      </div>
    </div>
  )
}
