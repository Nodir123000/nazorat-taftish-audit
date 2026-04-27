"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { ClassifierSelect } from "@/components/reference/classifier-select"
import { UnitSelect } from "@/components/reference/unit-select"
import { PersonnelSelect } from "@/components/reference/personnel-select"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons } from "@/components/reference/physical-persons-data"
import { translations } from "@/lib/i18n/translations"
import { useI18n } from "@/lib/i18n/context"
import { AuditLogger } from "@/lib/security/audit-logger"

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

  // Plan metadata
  planYear?: number
  incomingNumber?: string
  incomingDate?: string
}

export default function CreateOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale: systemLocale } = useI18n()
  const trUi = (key: string) => translations[systemLocale]?.[key] || translations.ru[key] || key

  const [activeTab, setActiveTab] = useState("requisites")
  const [prefilledFromPlan, setPrefilledFromPlan] = useState<string | null>(null)
  const [existingOrderId, setExistingOrderId] = useState<number | string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [unitName, setUnitName] = useState<string>("")

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
    planYear: undefined,
    incomingNumber: "",
    incomingDate: "",
  })

  useEffect(() => {
    const planId = searchParams.get("planId")

    if (planId) {
      setPrefilledFromPlan(planId)
      const editMode = searchParams.get("edit") === "true"
      setIsEditMode(editMode)

      fetch(`/api/planning/annual?id=${planId}`)
        .then(res => res.json())
        .then(plan => {
          const uName = plan.unit?.name?.ru || plan.controlObject || plan.unit?.name || ""
          setUnitName(uName)

          if (!editMode) {
            const responsibleId = plan.responsibleId?.toString() || ""
            const person = militaryPersonnel.find(p => p.id.toString() === responsibleId)

            setFormData(prev => ({
              ...prev,
              unit: plan.unitId?.toString() || "",
              unitCommander: plan.unit?.commander_name || "",
              startDate: plan.startDate ? plan.startDate.split('T')[0] : "",
              endDate: plan.endDate ? plan.endDate.split('T')[0] : "",
              groupLeader: responsibleId,
              groupLeaderRank: person?.rank || "",
              groupLeaderPosition: person?.position || "",
              planYear: plan.year,
              incomingNumber: plan.incomingNumber || "",
              incomingDate: plan.incomingDate ? plan.incomingDate.split('T')[0] : "",
              controlMeasuresDescription: `${plan.inspectionType || "Проверка"} финансово-хозяйственной деятельности ${plan.controlObject || "части"}.\nПериод: ${plan.periodConducted || ""}.\nНаправление: ${plan.inspectionDirection || ""}.\nОснование: ${plan.planNumber ? "План №" + plan.planNumber : "Плановое задание"}.`,
            }))
          }
        })

      if (editMode) {
        fetch(`/api/planning/orders?planId=${planId}`)
          .then(res => res.json())
          .then(orders => {
            if (orders && orders.length > 0) {
              const order = orders[orders.length - 1]
              setExistingOrderId(order.id)

              const leaderMember = order.commissionMembers?.find((m: any) => m.role === "Руководитель")
              const deputyMember = order.commissionMembers?.find((m: any) => m.role === "Заместитель")
              const members = order.commissionMembers?.filter((m: any) => m.role === "Член группы").map((m: any) => m.userId.toString()) || []

              const leaderId = leaderMember?.userId?.toString() || ""
              const deputyId = deputyMember?.userId?.toString() || ""

              const leaderPerson = militaryPersonnel.find(p => p.id.toString() === leaderId)
              const deputyPerson = militaryPersonnel.find(p => p.id.toString() === deputyId)

              setFormData(prev => ({
                ...prev,
                orderNumber: order.orderNum || order.order_number || "",
                orderDate: order.orderDate ? order.orderDate.split('T')[0] : (order.date ? order.date.split('T')[0] : ""),
                unit: order.unitId?.toString() || prev.unit,
                signerName: order.issuerId?.toString() || "",
                groupLeader: leaderId,
                groupLeaderRank: leaderPerson?.rank || leaderMember?.rank || "",
                groupLeaderPosition: leaderPerson?.position || leaderMember?.position || "",
                deputyLeader: deputyId,
                deputyLeaderRank: deputyPerson?.rank || deputyMember?.rank || "",
                deputyLeaderPosition: deputyPerson?.position || deputyMember?.position || "",
                groupMembersList: members,
                location: order.location || prev.location || "г. Ташкент"
              }))
            }
          })
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (formData.unit || formData.orderNumber) {
      AuditLogger.logEvent({
        docId: formData.orderNumber || "NEW-ORDER",
        docType: "ORDER",
        userId: "local-user",
        userName: "Текущий пользователь",
        action: "VIEW",
      });
    }
  }, [activeTab === "requisites"]);

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
    const lines = ids.map((id) => {
      const p = militaryPersonnel.find(x => x.id.toString() === id)
      const name = getPersonnelName(id)
      return `${p?.rank?.toLowerCase() || ""} ${name} – ${p?.position || ""}`
    })
    setFormData(prev => ({
      ...prev,
      groupMembersList: ids,
      groupMembers: ids.length > 0 ? lines.join("\n") : "согласно приложению № 1 (плану)"
    }))
  }

  const handleSubmit = async () => {
    try {
      const commissionMembers = [
        ...(formData.groupLeader ? [{ userId: Number(formData.groupLeader), role: "Руководитель", isResponsible: true }] : []),
        ...(formData.deputyLeader ? [{ userId: Number(formData.deputyLeader), role: "Заместитель", isResponsible: false }] : []),
        ...formData.groupMembersList.map(userId => ({ userId: Number(userId), role: "Член группы", isResponsible: false }))
      ]

      const payload = {
        id: isEditMode ? existingOrderId : undefined,
        orderNumber: formData.orderNumber,
        orderDate: formData.orderDate,
        issuerId: formData.signerName, 
        planId: prefilledFromPlan,
        unitId: formData.unit,
        orderType: "audit",
        status: "issued",
        commissionMembers: commissionMembers
      }

      const res = await fetch("/api/planning/orders" + (isEditMode ? `?id=${existingOrderId}` : ""), {
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to save order")

      alert(trUi("orders.create.success"))
      router.push("/planning/orders")
    } catch (error) {
      console.error(error)
      alert(trUi("orders.create.error"))
    }
  }

  const sections = [
    { id: "requisites", label: trUi("orders.create.section.requisites"), icon: Icons.FileText },
    { id: "group", label: trUi("orders.create.section.group"), icon: Icons.Users },
    { id: "measures", label: trUi("orders.create.section.measures"), icon: Icons.Calendar },
    { id: "leader", label: trUi("orders.create.section.leader"), icon: Icons.UserCheck },
    { id: "signatory", label: trUi("orders.create.section.signatory"), icon: Icons.Key },
  ]

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between shrink-0 h-16">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <Icons.ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{isEditMode ? "Редактирование приказа" : "Регистрация приказа"}</h1>
            <p className="text-xs text-slate-500">Министерство обороны РУз</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} size="sm" className="bg-blue-600 hover:bg-blue-700 ml-2">
            <Icons.Check className="mr-2 h-4 w-4" />
            Сохранить приказ
          </Button>
        </div>
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
                  <Label htmlFor="orderNumber" className="font-semibold text-sm">Номер приказа</Label>
                  <Input id="orderNumber" value={formData.orderNumber} onChange={(e) => handleInputChange("orderNumber", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="orderDate" className="font-semibold text-sm">Дата приказа</Label>
                  <Input id="orderDate" type="date" value={formData.orderDate} onChange={(e) => handleInputChange("orderDate", e.target.value)} />
                </div>
              </div>
            </div>

            <div className={activeTab === "group" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label className="font-semibold text-sm">Руководитель</Label>
                <PersonnelSelect value={formData.groupLeader} onValueChange={(v) => handlePersonnelChange("groupLeader", v)} returnId />
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-sm">Заместитель</Label>
                <PersonnelSelect value={formData.deputyLeader} onValueChange={(v) => handlePersonnelChange("deputyLeader", v)} returnId />
              </div>
              <div className="border-t pt-4">
                <Label className="font-semibold text-sm block mb-2">Члены группы</Label>
                {formData.groupMembersList.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {formData.groupMembersList.map((id, index) => (
                      <div key={id} className="flex items-center justify-between p-2 bg-slate-50 border rounded text-sm">
                        <span>{index + 1}. {getPersonnelName(id)}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(id)} className="h-6 w-6 text-red-500">✕</Button>
                      </div>
                    ))}
                  </div>
                )}
                <PersonnelSelect placeholder="Добавить участника..." onValueChange={(v) => handleAddMember(v)} returnId value="" />
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
                <UnitSelect value={formData.unit} onValueChange={(v) => handleInputChange("unit", v)} />
              </div>
            </div>

            <div className={activeTab === "signatory" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label className="font-semibold text-sm">Подписывающий</Label>
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
