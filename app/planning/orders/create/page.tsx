"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { ClassifierSelect } from "@/components/reference/classifier-select"
import { UnitSelect } from "@/components/reference/unit-select"
import { PersonnelSelect } from "@/components/reference/personnel-select"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons } from "@/components/reference/physical-persons-data"
import { translations } from "@/lib/i18n/translations"
import { useI18n, Locale } from "@/lib/i18n/context"
import { WatermarkService } from "@/lib/security/watermark-service"
import { AuditLogger } from "@/lib/security/audit-logger"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { renderTemplate } from "@/lib/utils/template-renderer"
import { cn } from "@/lib/utils"

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

interface DocumentTemplate {
  id: string
  title: string
  type: string
  locale: string
  content: string
  isActive?: boolean
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
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [previewLocale, setPreviewLocale] = useState<Locale>("ru")
  const [copied, setCopied] = useState(false)
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

    // Fetch Templates
    fetch("/api/reference/templates?type=order")
      .then(res => res.json())
      .then(data => {
        setTemplates(data)
        if (data.length > 0) setSelectedTemplate(data[0].id)
      })

    if (planId) {
      setPrefilledFromPlan(planId)
      const editMode = searchParams.get("edit") === "true"
      setIsEditMode(editMode)

      // 1. Fetch Plan Data (Base for both create and edit)
      fetch(`/api/planning/annual?id=${planId}`)
        .then(res => res.json())
        .then(plan => {
          const uName = plan.unit?.name?.ru || plan.controlObject || plan.unit?.name || ""
          setUnitName(uName)

          // If NOT in edit mode, pre-fill from plan
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

      // 2. If Edit Mode, Fetch Order Data
      if (editMode) {
        fetch(`/api/planning/orders?planId=${planId}`)
          .then(res => res.json())
          .then(orders => {
            if (orders && orders.length > 0) {
              const order = orders[orders.length - 1] // Get latest
              setExistingOrderId(order.id)

              // Find leader and deputy from commission members
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

              if (order.templateId) setSelectedTemplate(order.templateId)
            }
          })
      }
    }
  }, [searchParams])

  // Log viewing event
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
    const groupLeaderName = getPersonnelName(formData.groupLeader)
    const deputyLeaderName = getPersonnelName(formData.deputyLeader)

    // Format leader/deputy strings
    const leaderLine = `${formData.groupLeaderRank?.toLowerCase() || ""} ${groupLeaderName} - ${formData.groupLeaderPosition || ""}`
    const deputyLine = deputyLeaderName ? `${formData.deputyLeaderRank?.toLowerCase() || ""} ${deputyLeaderName} - ${formData.deputyLeaderPosition || ""}` : ""

    const dateStr = formData.orderDate ? `«${formData.orderDate.split("-").reverse()[0]}» ${new Date(formData.orderDate).toLocaleString("ru-RU", { month: "long" })} ${formData.orderDate.split("-")[0]} г.` : "«___» ________ 20__ г."

    return `
${formData.location}                               ${dateStr}

                                     П Р И К А З

                   О проведении контрольных мероприятий в финансово-хозяйственной деятельности 
                  отдельных воинских частей и учреждений, подведомственных Министерству обороны

     В соответствии с утверждённым Министром обороны Республики Узбекистан «Планом проведения контрольных и ревизионных мероприятий на 2025 год» (входящий № _____ от «__» декабря 2024 года), а также Положением об Управлении контроля и ревизии Министерства обороны,

                                П Р И К А З Ы В А Ю:

1. В период с «${formData.startDate ? formData.startDate.split("-").reverse().join(".") : "___"}» ${formData.startDate ? new Date(formData.startDate).toLocaleString("ru-RU", { month: "long" }) : "________"} 2025 года по «${formData.endDate ? formData.endDate.split("-").reverse().join(".") : "___"}» ${formData.endDate ? new Date(formData.endDate).toLocaleString("ru-RU", { month: "long" }) : "________"} 2025 года провести контрольные мероприятия в финансово-хозяйственной деятельности отдельных воинских частей и учреждений, подведомственных Министерству обороны.

2. Для проведения контрольных мероприятий назначить ответственных лиц в следующем составе:
   - руководитель группы – ${formData.groupLeaderRank} ${groupLeaderName} (${formData.groupLeaderPosition});
   - заместитель руководителя группы – ${formData.deputyLeaderRank} ${deputyLeaderName} (${formData.deputyLeaderPosition});
   - члены группы – ${formData.groupMembers}.

3. Руководителю группы:
   - организовать и провести контрольные мероприятия в соответствии с требованиями приказа Министра обороны от 4 июля 2024 г. № 688;
   - «${formData.instructionDate ? formData.instructionDate.split("-").reverse().join(".") : "___"}» ${formData.instructionDate ? new Date(formData.instructionDate).toLocaleString("ru-RU", { month: "long" }) : "________"} 2025 г. провести инструктаж со составом контрольной группы в установленном порядке согласно приложению № 2;
   - осуществлять контроль за повседневной деятельностью личного состава, обеспечением безопасности и дисциплины при выездах и возвращении с мест дислокации воинских частей.

4. Дополнительные положения:
   - ${formData.specialistInvolvement ? formData.specialistInvolvement : "по согласованию с должностными лицами отделов, службы структурных подразделений военного округа (командования) дополнительно привлекать специалистов к проведению контрольных мероприятий;"}
   - ${formData.transportRestrictions ? formData.transportRestrictions : "строго запретить выезды в командировки и возвращения из них на личном автотранспорте;"}
   - ${formData.aviationTransport ? formData.aviationTransport : "разрешить использование авиатранспорта «Uzbekistonhavoyo'llari» для командировок в Республику Каракалпакстан и Хорезмскую область и обратно."}

5. Контроль за исполнением настоящего приказа оставляю за собой.

6. Настоящий приказ довести до сведения всех должностных лиц по принадлежности.

НАЧАЛЬНИК КОНТРОЛЬНО-РЕВИЗИОННОГО УПРАВЛЕНИЯ 
МИНИСТЕРСТВА ОБОРОНЫ РЕСПУБЛИКИ УЗБЕКИСТАН

${formData.groupLeaderRank}                                ${groupLeaderName}

№ ${formData.orderNumber || "_______"}
    `.trim()
  }

  const handleDownload = async (format: "txt" | "docx" | "pdf") => {
    if (format === "txt") {
      const text = generatePlainText()
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Приказ_на_ревизию_${formData.orderNumber.replace("№ ", "") || "новый"}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      AuditLogger.logEvent({
        docId: formData.orderNumber || "NEW-ORDER",
        docType: "ORDER",
        userId: "local-user",
        userName: "Текущий пользователь",
        action: "DOWNLOAD",
        metadata: { format: "txt" }
      });
    } else if (format === "pdf") {
      try {
        const element = document.getElementById('order-preview-container');
        if (!element) throw new Error("Элемент предпросмотра не найден / Preview element not found");

        // 1. Sanitize Data for Watermark (Latin only!)
        // Remove non-latin characters from DocID to prevent pdf-lib encoding errors
        const safeDocId = (formData.orderNumber || "ORDER-TEMP").replace(/[^\w\d\s-]/g, "");
        // Use en-GB locale for date to avoid Cyrillic (e.g. "февраля")
        const safeTimestamp = new Date().toLocaleString("en-GB").replace(",", "");

        // 2. Clone for off-screen rendering (handles hidden elements on mobile)
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.width = '210mm'; // Standard A4 width
        clone.style.minHeight = '297mm'; // Standard A4 height
        clone.style.height = 'auto';
        clone.style.zIndex = '-1';
        clone.style.display = 'block'; // Ensure visible even if original is hidden
        clone.style.visibility = 'visible';
        clone.style.transform = 'none'; // Remove scaling from preview
        clone.style.backgroundColor = '#ffffff';

        // CRITICAL FIX: html2canvas doesn't support oklch() or lab() colors
        // Inject a very simple style override to force all colors to basic RGB/Hex
        const styleOverride = document.createElement('style');
        styleOverride.textContent = `
          * {
            color: #000000 !important;
            border-color: #000000 !important;
            background-color: transparent !important;
            box-shadow: none !important;
            text-shadow: none !important;
            font-family: "Times New Roman", Times, serif !important;
          }
          #order-preview-container, .bg-white, body {
            background-color: #ffffff !important;
          }
          .text-blue-600, .text-blue-700 { color: #1d4ed8 !important; }
          .border-blue-200 { border-color: #bfdbfe !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
        `;
        clone.appendChild(styleOverride);

        document.body.appendChild(clone);

        try {
          // 3. Capture high-resolution image
          const canvas = await html2canvas(clone, {
            scale: 2, // High DPI
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff',
            windowWidth: 1200,
            removeContainer: true,
            onclone: (clonedDoc) => {
              // AGGRESSIVE CSS CLEANUP for html2canvas
              // html2canvas parser crashes on oklch() and lab() colors
              const elements = clonedDoc.getElementsByTagName('*');
              for (let i = 0; i < elements.length; i++) {
                const el = elements[i] as HTMLElement;
                if (el.style) {
                  // If element has inline styles with variables or complex colors, reset them
                  // This is a safety measure
                  const style = window.getComputedStyle(el);
                  if (style.color.includes('lab') || style.color.includes('oklch')) el.style.color = '#000000';
                  if (style.backgroundColor.includes('lab') || style.backgroundColor.includes('oklch')) {
                    el.style.backgroundColor = '#ffffff';
                  }
                }
              }
              console.log("Clone sanitized and ready for capture");
            }
          });

          const imgData = canvas.toDataURL('image/png');

          // 4. Create PDF
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

          // 5. Apply protection w/ Safe Data
          const pdfArrayBuffer = doc.output('arraybuffer');
          const protectedPdf = await WatermarkService.applyProtection(pdfArrayBuffer, {
            userId: "USR-001",
            userName: "R. Fazilov", // Passed but ignored by service, using Latin just in case
            docId: safeDocId || "ORDER",
            timestamp: safeTimestamp,
          });

          // 6. Download
          const blob = new Blob([protectedPdf as any], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Приказ_защищенный_${formData.orderNumber || "новый"}.pdf`;
          link.click();
          URL.revokeObjectURL(url);

          AuditLogger.logEvent({
            docId: formData.orderNumber || "NEW-ORDER",
            docType: "ORDER",
            userId: "local-user",
            userName: "Текущий пользователь",
            action: "DOWNLOAD",
            metadata: { format: "pdf", protected: true, method: "canvas-capture-v2" }
          });

        } finally {
          document.body.removeChild(clone);
        }

      } catch (err: any) {
        console.error("PDF Export failed:", err);
        alert(`Ошибка при генерации PDF: ${err.message || err}`);
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
      const commissionMembers = [
        ...(formData.groupLeader ? [{
          userId: Number(formData.groupLeader),
          role: "Руководитель",
          isResponsible: true
        }] : []),
        ...(formData.deputyLeader ? [{
          userId: Number(formData.deputyLeader),
          role: "Заместитель",
          isResponsible: false
        }] : []),
        ...formData.groupMembersList.map(userId => ({
          userId: Number(userId),
          role: "Член группы",
          isResponsible: false
        }))
      ]

      const payload = {
        id: isEditMode ? existingOrderId : undefined,
        orderNumber: formData.orderNumber,
        orderDate: formData.orderDate,
        issuerId: formData.signerName, // Mapping signer as issuer
        planId: prefilledFromPlan,
        unitId: formData.unit,
        templateId: selectedTemplate,
        orderType: "audit",
        orderText: generatePlainText(),
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
    { id: "additional", label: trUi("orders.create.section.additional"), icon: Icons.Settings },
    { id: "signatory", label: trUi("orders.create.section.signatory"), icon: Icons.Key },
  ]

  /* Document Preview Component (Multilingual) */
  const DocumentPreview = () => {

    // Mapping for DB locales
    const localeMap: Record<string, string> = {
      ru: "ru",
      uzCyrl: "uz_cy",
      uzLatn: "uz_lt"
    }

    // Find dynamic template from templates array
    // Note: selectedTemplate might be an ID like 'order_general_ru' or just 'order_general'
    // We should try to find a template that matches the type/title and locale
    const currentTemplate = templates.find(t =>
      (t.id === selectedTemplate || t.title === templates.find(temp => temp.id === selectedTemplate)?.title) &&
      t.locale === localeMap[previewLocale]
    )

    const dynamicContent = currentTemplate ? renderTemplate(currentTemplate.content, formData as any, previewLocale) : null

    // Translation helper with parameter interpolation
    const tr = (key: string, params: Record<string, string> = {}) => {
      let text = translations[previewLocale]?.[key] || translations["ru"][key] || key
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), v || "___")
      })
      return text
    }

    // Render helper for bold text
    const renderText = (key: string, params: Record<string, string> = {}) => {
      const rawText = tr(key, params);
      if (!rawText.includes("**")) return rawText;

      const parts = rawText.split("**");
      return parts.map((part, index) =>
        index % 2 === 1 ? <b key={index}>{part}</b> : part
      );
    }

    const formatDate = (dateStr: string) => {
      if (!dateStr) return (previewLocale === "ru" ? "«___» ________ 20__ г." : "«___» ________ 20__ y.")
      const parts = dateStr.split("-")
      if (parts.length < 3) return dateStr
      const day = parts[2]
      const month = getMonthName(dateStr, previewLocale)
      const year = parts[0]
      return `«${day}» ${month} ${year} ${previewLocale === "ru" ? "г." : "y."}`
    }

    const groupLeaderName = getPersonnelName(formData.groupLeader)
    const deputyLeaderName = getPersonnelName(formData.deputyLeader)
    const dateStr = formData.orderDate ? `«${formData.orderDate.split("-").reverse()[0]}» ${getMonthName(formData.orderDate, previewLocale)} ${formData.orderDate.split("-")[0]} ${previewLocale === "ru" ? "г." : "y."}` : (previewLocale === "ru" ? "«___» ________ 20__ г." : "«___» ________ 20__ y.")

    return (
      <div id="order-preview-container" className="font-serif text-slate-900 leading-relaxed text-[12pt] flex-1 max-w-[800px] mx-auto bg-white p-[2cm] print:p-0">

        {dynamicContent ? (
          /* DYNAMIC TEMPLATE RENDERING */
          <div className="whitespace-pre-wrap font-serif">
            {dynamicContent.split("\n\n").map((para, i) => (
              <p key={i} className={cn("mb-4", i === 0 || para.startsWith("№") || para.startsWith("г. Ташкент") ? "text-center" : "text-justify indent-8")}>
                {para}
              </p>
            ))}
          </div>
        ) : (
          /* OLD HARDCODED RENDERING (FALLBACK) */
          <>
            {/* Header: Logo and Official Title */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto">
                  <path
                    d="M50 5 L63 37 L95 50 L63 63 L50 95 L37 63 L5 50 L37 37 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M50 15 L60 40 L85 50 L60 60 L50 85 L40 60 L15 50 L40 40 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinejoin="round"
                    className="opacity-50"
                  />
                </svg>
              </div>

              <div className="font-bold text-lg mb-4 uppercase tracking-widest">{tr("orders.template.title")}</div>

              <div className="font-bold text-sm mb-6 whitespace-pre-line leading-tight">
                {tr("orders.template.header.org")}
              </div>

              <div className="flex justify-center items-center gap-2 mb-8">
                <span className="font-bold">№</span>
                <span className="border-b border-black w-24 text-center">{formData.orderNumber || "_______"}</span>
              </div>

              <div className="flex justify-between items-end border-b border-slate-100 pb-2 mb-8">
                <div className="font-medium underline underline-offset-4 decoration-slate-300">
                  {tr("orders.template.header.location", { city: formData.location || tr("orders.template.defaultLocation") })}
                </div>
                <div className="font-medium underline underline-offset-4 decoration-slate-300">
                  {dateStr}
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="text-center font-bold text-lg mb-2 uppercase tracking-[0.2em]">
                {tr("orders.template.title")}
              </div>
              <div className="text-center font-bold text-sm mb-8 max-w-[90%] mx-auto leading-tight">
                {tr("orders.template.subtitle")}
              </div>

              {/* Preamble */}
              <div className="text-justify indent-12 mb-8 text-[11.5pt]">
                {tr("orders.template.preamble", {
                  planYear: formData.planYear?.toString() || "____",
                  incomingNumber: formData.incomingNumber || "____",
                  incomingDate: formatDate(formData.incomingDate || "")
                })}
              </div>

              {/* Command */}
              <div className="text-center font-bold mb-8 tracking-[0.3em] uppercase">
                {tr("orders.template.command")}
              </div>

              {/* Point 1 */}
              <div className="flex gap-4 mb-6">
                <span className="font-bold min-w-[2rem]">1.</span>
                <div className="flex-1 text-justify">
                  {tr("orders.template.point1", {
                    startDate: formatDate(formData.startDate),
                    endDate: formatDate(formData.endDate)
                  })}
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex gap-4 mb-2">
                <span className="font-bold min-w-[2rem]">2.</span>
                <div className="flex-1 text-justify">
                  {tr("orders.template.point2")}
                </div>
              </div>

              <div className="ml-12 mb-8 space-y-2">
                <div className="flex gap-1 flex-wrap">
                  <span>{tr("orders.template.group.leader")}</span>
                  <span className="font-bold uppercase">{formData.groupLeaderRank} {groupLeaderName}</span>
                  <span>({formData.groupLeaderPosition});</span>
                </div>
                {formData.deputyLeader && (
                  <div className="flex gap-1 flex-wrap">
                    <span>{tr("orders.template.group.deputy")}</span>
                    <span className="font-bold uppercase">{formData.deputyLeaderRank} {deputyLeaderName}</span>
                    <span>({formData.deputyLeaderPosition});</span>
                  </div>
                )}
                <div>{tr("orders.template.group.members")}</div>
              </div>

              {/* Point 3 */}
              <div className="flex gap-4 mb-8">
                <span className="font-bold min-w-[2rem]">3.</span>
                <div className="flex-1 text-justify whitespace-pre-wrap">
                  {tr("orders.template.point3", {
                    instructionDate: formatDate(formData.instructionDate)
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Additional Points ONLY if NOT using dynamic template */}
        {!dynamicContent && (
          <div className="space-y-6">
            {[
              formData.specialistInvolvement,
              formData.transportRestrictions,
              formData.aviationTransport
            ].filter(Boolean).map((text, index) => (
              <div key={index} className="flex gap-4">
                <span className="font-bold min-w-[2rem]">{4 + index}.</span>
                <div className="flex-1 whitespace-pre-wrap text-justify">{text}</div>
              </div>
            ))}

            <div className="flex gap-4">
              <span className="font-bold min-w-[2rem]">
                {4 + [formData.specialistInvolvement, formData.transportRestrictions, formData.aviationTransport].filter(Boolean).length}.
              </span>
              <div className="flex-1 text-justify">
                {tr("orders.template.point4", { controller: formData.controlNotes || "_________________" })}
              </div>
            </div>
          </div>
        )}

        {/* Signature Area */}
        <div className="mt-16 pt-8">
          <div className="flex justify-between items-start">
            <div className="flex-1 font-bold uppercase text-sm leading-tight max-w-[300px]">
              {formData.signerPosition || tr("orders.template.defaultSignerPosition")}
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-32 border-b border-black h-8"></div>
              <span className="text-[10pt] italic opacity-60">(подпись)</span>
            </div>
            <div className="flex-1 text-right font-bold uppercase">
              {formData.signerRank && <span className="mr-2">{formData.signerRank.toLowerCase()}</span>}
              {formData.signerName || "Р. ФАЗИЛОВ"}
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
            <h1 className="text-lg font-bold text-slate-900">{trUi("orders.create.title")}</h1>
            <p className="text-xs text-slate-500">{trUi("orders.create.subtitle")}</p>
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
            {trUi("orders.create.button.save")}
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
                <Label htmlFor="selectedTemplate" className="font-semibold text-sm">
                  {trUi("orders.create.field.template")} <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="selectedTemplate" className="border-slate-300 text-sm">
                    <SelectValue placeholder={trUi("common.selectPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title} ({t.locale === 'ru' ? 'RU' : t.locale === 'uz_cy' ? 'ЎЗБ' : 'UZB'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="location" className="font-semibold text-sm">
                  {trUi("orders.create.field.location")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  readOnly
                  placeholder="г. Ташкент"
                  className="border-slate-300 text-sm bg-slate-100 text-slate-600 focus-visible:ring-0 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="orderDate" className="font-semibold text-sm">
                  {trUi("orders.create.field.orderDate")} <span className="text-red-500">*</span>
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
                <Label htmlFor="orderNumber" className="font-semibold text-sm">
                  {trUi("orders.create.field.orderNumber")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orderNumber"
                  value={formData.orderNumber}
                  onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                  placeholder="15"
                  className={`border-slate-300 text-sm ${!formData.orderNumber && 'border-red-300 bg-red-50'}`}
                />
              </div>

              <div className="pt-4 border-t">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Данные годового плана</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-3">Раздел 2: Ответственные лица</div>

              <div className="space-y-1">
                <Label htmlFor="groupLeaderRank" className="font-semibold text-sm">Звание руководителя</Label>
                <ClassifierSelect classifierId={6} value={formData.groupLeaderRank} onValueChange={(v) => handleInputChange("groupLeaderRank", v)} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="groupLeader" className="font-semibold text-sm">{trUi("orders.create.field.groupLeader")} <span className="text-red-500">*</span></Label>
                <PersonnelSelect value={formData.groupLeader} onValueChange={(v) => handlePersonnelChange("groupLeader", v)} returnId />
              </div>

              <div className="space-y-1">
                <Label htmlFor="groupLeaderPosition" className="font-semibold text-sm">{trUi("orders.create.field.leaderPosition")}</Label>
                <ClassifierSelect classifierId={13} value={formData.groupLeaderPosition} onValueChange={(v) => handleInputChange("groupLeaderPosition", v)} placeholder={trUi("common.selectPlaceholder") || "Выберите..."} />
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="space-y-1">
                  <Label htmlFor="deputyLeaderRank" className="font-semibold text-sm">{trUi("orders.create.field.deputyRank")}</Label>
                  <ClassifierSelect classifierId={6} value={formData.deputyLeaderRank} onValueChange={(v) => handleInputChange("deputyLeaderRank", v)} />
                </div>
                <div className="space-y-1 mt-3">
                  <Label htmlFor="deputyLeader" className="font-semibold text-sm">{trUi("orders.create.field.deputyName")}</Label>
                  <PersonnelSelect value={formData.deputyLeader} onValueChange={(v) => handlePersonnelChange("deputyLeader", v)} returnId />
                </div>
                <div className="space-y-1 mt-3">
                  <Label htmlFor="deputyLeaderPosition" className="font-semibold text-sm">{trUi("orders.create.field.deputyPosition")}</Label>
                  <ClassifierSelect classifierId={13} value={formData.deputyLeaderPosition} onValueChange={(v) => handleInputChange("deputyLeaderPosition", v)} placeholder={trUi("common.selectPlaceholder") || "Выберите..."} />
                </div>
              </div>

              {/* Group Members Section */}
              <div className="border-t pt-4 mt-4">
                <Label className="font-semibold text-sm block mb-2">{trUi("orders.create.field.groupMembers")}</Label>

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
                    placeholder={trUi("orders.create.field.addMemberPlaceholder")}
                    onValueChange={(v) => handleAddMember(v)}
                    returnId
                    value=""
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{trUi("orders.create.field.groupMembersHint")}</p>

                {/* Fallback Textarea if they want to edit manually */}
                <div className="mt-4">
                  <Label className="text-xs text-slate-400">{trUi("common.preview") || "Предпросмотр"}</Label>
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
                  <Label htmlFor="startDate" className="font-semibold text-xs">{trUi("orders.create.field.startDate")} <span className="text-red-500">*</span></Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} className={`border-slate-300 text-sm ${!formData.startDate && 'border-red-300 bg-red-50'}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endDate" className="font-semibold text-xs">{trUi("orders.create.field.endDate")} <span className="text-red-500">*</span></Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} className={`border-slate-300 text-sm ${!formData.endDate && 'border-red-300 bg-red-50'}`} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="unit" className="font-semibold text-sm">{trUi("orders.create.field.unit")}</Label>
                {prefilledFromPlan ? (
                  <Input
                    value={unitName || "В/Ч " + prefilledFromPlan}
                    disabled
                    className="bg-slate-50 font-medium opacity-100 cursor-not-allowed"
                  />
                ) : (
                  <UnitSelect
                    value={formData.unit}
                    onValueChange={(v) => handleInputChange("unit", v)}
                    placeholder={trUi("common.selectPlaceholder") || "Выберите..."}
                  />
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="unitCommander" className="font-semibold text-sm">{trUi("orders.create.field.unitCommander")}</Label>
                <PersonnelSelect value={formData.unitCommander} onValueChange={(v) => handleInputChange("unitCommander", v)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="controlMeasuresDescription" className="font-semibold text-sm">{trUi("orders.create.field.measuresDescription")}</Label>
                <Textarea id="controlMeasuresDescription" value={formData.controlMeasuresDescription} onChange={(e) => handleInputChange("controlMeasuresDescription", e.target.value)} placeholder="..." rows={4} className="border-slate-300 text-sm" />
              </div>
            </div>

            <div className={activeTab === "leader" ? "block space-y-4" : "hidden"}>
              <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-3">{trUi("orders.create.section.leader")}</div>

              <div className="space-y-1">
                <Label htmlFor="instructionDate" className="font-semibold text-sm">{trUi("orders.create.field.instructionDate")}</Label>
                <Input id="instructionDate" type="date" value={formData.instructionDate} onChange={(e) => handleInputChange("instructionDate", e.target.value)} className="border-slate-300 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="instructionDetails" className="font-semibold text-sm">{trUi("orders.create.field.instructionDetails")}</Label>
                <Textarea id="instructionDetails" value={formData.instructionDetails} onChange={(e) => handleInputChange("instructionDetails", e.target.value)} placeholder="..." rows={4} className="border-slate-300 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="safetyMeasures" className="font-semibold text-sm">{trUi("orders.create.field.safetyMeasures")}</Label>
                <Textarea id="safetyMeasures" value={formData.safetyMeasures} onChange={(e) => handleInputChange("safetyMeasures", e.target.value)} placeholder="..." rows={4} className="border-slate-300 text-sm" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="controlNotes" className="font-semibold text-sm">{trUi("orders.create.field.controlNotes")}</Label>
                <Textarea id="controlNotes" value={formData.controlNotes} onChange={(e) => handleInputChange("controlNotes", e.target.value)} placeholder="..." rows={2} className="border-slate-300 text-sm" />
              </div>
            </div>

            <div className={activeTab === "signatory" ? "block space-y-4" : "hidden"}>
              <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-3">{trUi("orders.create.section.signatory")}</div>

              <div className="space-y-1">
                <Label htmlFor="signerRank" className="font-semibold text-sm">{trUi("orders.create.field.signerRank")}</Label>
                <ClassifierSelect classifierId={6} value={formData.signerRank} onValueChange={(v) => handleInputChange("signerRank", v)} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="signerName" className="font-semibold text-sm">{trUi("orders.create.field.signer")} <span className="text-red-500">*</span></Label>
                <PersonnelSelect value={formData.signerName} onValueChange={(v) => handlePersonnelChange("signerName", v)} returnId />
              </div>

              <div className="space-y-1">
                <Label htmlFor="signerPosition" className="font-semibold text-sm">{trUi("orders.create.field.signerPosition")}</Label>
                <ClassifierSelect classifierId={13} value={formData.signerPosition} onValueChange={(v) => handleInputChange("signerPosition", v)} placeholder={trUi("common.selectPlaceholder") || "Выберите..."} />
              </div>

            </div>

            <div className={activeTab === "additional" ? "block space-y-4" : "hidden"}>
              <div className="space-y-1">
                <Label htmlFor="specialistInvolvement" className="font-semibold text-sm">{trUi("orders.create.field.specialistInvolvement")}</Label>
                <Textarea id="specialistInvolvement" value={formData.specialistInvolvement} onChange={(e) => handleInputChange("specialistInvolvement", e.target.value)} placeholder="..." rows={3} className="border-slate-300 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="transportRestrictions" className="font-semibold text-sm">{trUi("orders.create.field.transportRestrictions")}</Label>
                <Textarea id="transportRestrictions" value={formData.transportRestrictions} onChange={(e) => handleInputChange("transportRestrictions", e.target.value)} placeholder="..." rows={3} className="border-slate-300 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="aviationTransport" className="font-semibold text-sm">{trUi("orders.create.field.aviationTransport")}</Label>
                <Textarea id="aviationTransport" value={formData.aviationTransport} onChange={(e) => handleInputChange("aviationTransport", e.target.value)} placeholder="..." rows={3} className="border-slate-300 text-sm" />
              </div>
            </div>

            {/* Navigation Buttons (Bottom of Form) */}
            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button variant="ghost" onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeTab);
                if (currentIndex > 0) setActiveTab(sections[currentIndex - 1].id);
              }} disabled={activeTab === sections[0].id}>
                {trUi("orders.create.button.back")}
              </Button>
              <Button onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeTab);
                if (currentIndex < sections.length - 1) setActiveTab(sections[currentIndex + 1].id);
              }} disabled={activeTab === sections[sections.length - 1].id}>
                {trUi("orders.create.button.next")}
              </Button>
            </div>
          </div>
        </main>

        {/* Column 3: Sticky Preview (Right Side) */}
        <aside className="w-[45%] bg-slate-100 border-l border-slate-300 overflow-y-auto hidden lg:flex flex-col">
          <div className="p-3 bg-white border-b flex items-center justify-between sticky top-0 z-10 h-14">
            <div className="flex bg-slate-100 rounded-lg p-0.5 border">
              <button
                onClick={() => setPreviewLocale("ru")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewLocale === "ru" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
              >
                RU
              </button>
              <button
                onClick={() => setPreviewLocale("uzCyrl")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewLocale === "uzCyrl" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
              >
                ЎЗБ
              </button>
              <button
                onClick={() => setPreviewLocale("uzLatn")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewLocale === "uzLatn" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
              >
                UZB
              </button>
            </div>

            <div className="flex gap-1.5">
              <Button variant="outline" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={handleCopy} title={trUi("common.copy")}>
                {copied ? <Icons.Check className="h-4 w-4 text-emerald-500" /> : <Icons.Copy className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={() => handleDownload("pdf")} title={trUi("common.downloadPDF")}>
                <Icons.Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700" onClick={() => handleDownload("txt")} title={trUi("common.downloadTXT")}>
                <Icons.FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center bg-slate-100 overflow-y-auto min-h-0">
            <div className="bg-white min-h-[29.7cm] w-[21cm] origin-top scale-[0.85] mb-20 shrink-0">
              <DocumentPreview />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
