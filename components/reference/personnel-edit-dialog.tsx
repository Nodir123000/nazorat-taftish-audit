"use client"

import { useState, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import useSWR from "swr"

interface PersonnelEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  personnelId: number
  onSuccess?: () => void
}

export function PersonnelEditDialog({ isOpen, onOpenChange, personnelId, onSuccess }: PersonnelEditDialogProps) {
  const { locale } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<any>({
    pnr: "",
    serviceNumber: "",
    rankId: "",
    unitId: "",
    positionId: "",
    vusId: "",
    category: "Офицер",
    status: "active",
    clearanceLevel: "",
    emergencyContact: "",
    emergencyPhone: "",
    firstName: "",
    lastName: "",
    middleName: "",
    pinfl: "",
    passportSeries: "",
    passportNumber: "",
    passportIssuedBy: "",
    passportExpiryDate: "",
    birthPlace: "",
    actualAddress: "",
    registrationAddress: "",
    biography: "",
    contactPhone: "",
    email: ""
  })

  const t = useCallback((ru: string, uzL: string, uzC: string) => {
    if (locale === "ru") return ru;
    if (locale === "uzLatn") return uzL;
    return uzC;
  }, [locale])

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data: unitsResponse } = useSWR('/api/units', fetcher)
  const { data: rankResponse } = useSWR('/api/ranks', fetcher)
  const { data: positionResponse } = useSWR('/api/positions', fetcher)
  const { data: vusResponse } = useSWR('/api/vus', fetcher)

  const unitOptions = unitsResponse?.data || []
  const rankOptions = Array.isArray(rankResponse) ? rankResponse : []
  const positionOptions = Array.isArray(positionResponse) ? positionResponse : []
  const vusOptions = Array.isArray(vusResponse) ? vusResponse : []

  const getLocalizedName = (item: any) => {
    if (!item) return ""
    if (typeof item === 'string') return item
    const nameData = item.name;
    if (nameData && typeof nameData === 'object') {
      return nameData[locale] || nameData.ru || ""
    }
    return item.name || ""
  }

  useEffect(() => {
    if (isOpen && personnelId) {
      const fetchFullData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/personnel/${personnelId}`)
          const fullData = await response.json()
          setForm({
            pnr: fullData.pnr || "",
            rankId: (fullData.rankId || fullData.rank_id)?.toString() || "",
            unitId: (fullData.unitId || fullData.unit_id)?.toString() || "",
            positionId: (fullData.positionId || fullData.position_id)?.toString() || "",
            vusId: (fullData.vusId || fullData.vus_id)?.toString() || "",
            category: fullData.category || "Офицер",
            status: fullData.status || "active",
            serviceNumber: fullData.serviceNumber || "",
            clearanceLevel: fullData.clearanceLevel || "",
            emergencyContact: fullData.emergencyContact || "",
            emergencyPhone: fullData.emergencyPhone || "",
            firstName: fullData.firstName || "",
            lastName: fullData.lastName || "",
            middleName: fullData.patronymic || "",
            pinfl: fullData.pin || "",
            passportSeries: fullData.passport?.series || "",
            passportNumber: fullData.passport?.number || "",
            passportIssuedBy: fullData.passportIssuedBy || "",
            passportExpiryDate: fullData.passportExpiryDate ? fullData.passportExpiryDate.split('T')[0] : "",
            birthPlace: fullData.birthPlace || "",
            actualAddress: fullData.actualAddress || "",
            registrationAddress: fullData.registrationAddress || "",
            biography: fullData.biography || "",
            contactPhone: fullData.contactPhone || "",
            email: fullData.email || ""
          })
        } catch (error) {
          console.error("Failed to fetch full data", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchFullData()
    }
  }, [isOpen, personnelId])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/personnel/${personnelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Error")
      
      toast.success(t("Данные успешно обновлены", "Yangilandi", "Янгиланди"))
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95 z-9999">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Icons.Edit className="h-5 w-5" />
            </div>
            <DialogTitle className="text-2xl font-bold">{t("Редактирование профиля", "Profilni tahrirlash", "Профилни таҳрирлаш")}</DialogTitle>
          </div>
          <DialogDescription className="text-base font-medium">
            {form.lastName} {form.firstName}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 font-medium">
          <Tabs defaultValue="service" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted/50 p-1 mb-6">
              <TabsTrigger value="service" className="rounded-lg font-bold">{t("Служба", "Xizmat", "Хизмат")}</TabsTrigger>
              <TabsTrigger value="personal" className="rounded-lg font-bold">{t("Личные", "Shaxsiy", "Шахсий")}</TabsTrigger>
              <TabsTrigger value="contacts" className="rounded-lg font-bold">{t("Связь", "Aloqa", "Алоқа")}</TabsTrigger>
              <TabsTrigger value="biography" className="rounded-lg font-bold">{t("Био", "Bio", "Био")}</TabsTrigger>
            </TabsList>

            <div className="max-h-[60vh] overflow-y-auto px-1">
              {/* --- TAB 1: SERVICE DATA --- */}
              <TabsContent value="service" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Личный номер (PNR)</Label>
                    <Input value={form.pnr} onChange={(e) => setForm({ ...form, pnr: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Номер жетона</Label>
                    <Input value={form.serviceNumber} onChange={(e) => setForm({ ...form, serviceNumber: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Звание</Label>
                    <Select value={form.rankId} onValueChange={(v) => setForm({ ...form, rankId: v })}>
                      <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none font-bold">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        {rankOptions.map((r: any) => (
                          <SelectItem key={r.rank_id || r.id} value={(r.rank_id || r.id).toString()}>{getLocalizedName(r)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Категория</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none font-bold">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        {["Офицер", "Сержант", "Рядовой"].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Воинская часть</Label>
                  <Select value={form.unitId} onValueChange={(v) => setForm({ ...form, unitId: v })}>
                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none font-bold">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                      {unitOptions.slice(0, 50).map((u: any) => (
                        <SelectItem key={u.unit_id || u.id} value={(u.unit_id || u.id).toString()}>
                          <span className="font-bold text-primary mr-2">{u.unitId || u.unit_code}</span>
                          <span className="opacity-70">{getLocalizedName(u)}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Должность</Label>
                  <Select value={form.positionId} onValueChange={(v) => setForm({ ...form, positionId: v })}>
                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none font-bold">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                      {positionOptions.map((p: any) => (
                        <SelectItem key={p.position_id || p.id} value={(p.position_id || p.id).toString()}>{getLocalizedName(p)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">ВУС</Label>
                    <Select value={form.vusId} onValueChange={(v) => setForm({ ...form, vusId: v })}>
                      <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none font-bold">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        {vusOptions.map((v: any) => (
                          <SelectItem key={v.id} value={v.id.toString()}>{v.code} - {getLocalizedName(v)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Уровень допуска</Label>
                    <Select value={form.clearanceLevel} onValueChange={(v) => setForm({ ...form, clearanceLevel: v })}>
                      <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none font-bold">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="1">Форма 1</SelectItem>
                        <SelectItem value="2">Форма 2</SelectItem>
                        <SelectItem value="3">Форма 3</SelectItem>
                        <SelectItem value="none">Без допуска</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* --- TAB 2: PERSONAL DATA --- */}
              <TabsContent value="personal" className="space-y-6 mt-0">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Фамилия</Label>
                    <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Имя</Label>
                    <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Отчество</Label>
                    <Input value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">ПИНФЛ</Label>
                  <Input value={form.pinfl} onChange={(e) => setForm({ ...form, pinfl: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold font-mono" maxLength={14} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Паспорт</Label>
                    <div className="flex gap-2">
                      <Input value={form.passportSeries} onChange={(e) => setForm({ ...form, passportSeries: e.target.value })} className="h-11 w-20 rounded-xl bg-muted/30 border-none font-bold uppercase text-center" maxLength={2} />
                      <Input value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} className="h-11 flex-1 rounded-xl bg-muted/30 border-none font-bold font-mono" maxLength={7} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Срок действия</Label>
                    <Input type="date" value={form.passportExpiryDate} onChange={(e) => setForm({ ...form, passportExpiryDate: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Кем выдан</Label>
                  <Input value={form.passportIssuedBy} onChange={(e) => setForm({ ...form, passportIssuedBy: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Место рождения</Label>
                  <Input value={form.birthPlace} onChange={(e) => setForm({ ...form, birthPlace: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Адрес прописки</Label>
                  <Input value={form.registrationAddress} onChange={(e) => setForm({ ...form, registrationAddress: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Фактический адрес</Label>
                  <Input value={form.actualAddress} onChange={(e) => setForm({ ...form, actualAddress: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                </div>
              </TabsContent>

              {/* --- TAB 3: CONTACTS --- */}
              <TabsContent value="contacts" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Телефон</Label>
                    <Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Email</Label>
                    <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                  </div>
                </div>

                <div className="pt-4 border-t border-muted">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Экстренные контакты</span>
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">ФИО</Label>
                      <Input value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Телефон</Label>
                      <Input value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} className="h-11 rounded-xl bg-muted/30 border-none font-bold font-mono" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* --- TAB 4: BIOGRAPHY --- */}
              <TabsContent value="biography" className="space-y-4 mt-0">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Автобиография</Label>
                <textarea
                  value={form.biography}
                  onChange={(e) => setForm({ ...form, biography: e.target.value })}
                  className="w-full min-h-[300px] p-4 rounded-2xl bg-muted/30 border-none font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="..."
                />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end gap-3 pt-8 border-t border-muted mt-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl h-11 px-6 font-bold">
              Отмена
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
