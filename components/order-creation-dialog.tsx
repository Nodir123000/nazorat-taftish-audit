"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface OrderFormData {
  orderDate: string
  orderNumber: string
  orderPlace: string
  signerPosition: string
  signerName: string
  signerRank: string
  orderTitle: string
  orderContent: string
  orderBasis: string
  unit: string
  startDate: string
  endDate: string
  notes: string
}

interface OrderCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: OrderFormData) => void
}

export default function OrderCreationDialog({ open, onOpenChange, onSubmit }: OrderCreationDialogProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    orderDate: "",
    orderNumber: "",
    orderPlace: "",
    signerPosition: "",
    signerName: "",
    signerRank: "",
    orderTitle: "О временном переводе на другую работу по инициативе работника",
    orderContent: "",
    orderBasis: "",
    unit: "",
    startDate: "",
    endDate: "",
    notes: "",
  })

  const [activeTab, setActiveTab] = useState("requisites")

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    onSubmit?.(formData)
    onOpenChange(false)
  }

  const generatePreview = () => {
    return `
П Р И К А З

Дата принятия приказа: ${formData.orderDate || "_______________"}
Номер приказа: ${formData.orderNumber || "_______________"}
Место принятия приказа: ${formData.orderPlace || "_______________"}

${formData.orderTitle}

В соответствии со статьей 142 Трудового кодекса Республики Узбекистан, приказываю:

${formData.orderContent || "1. [Содержание приказа]"}

Основание: ${formData.orderBasis || "Документы, служащие основанием для приказа"}

Должность лица, подписавшего приказ: ${formData.signerPosition || "_______________"}
Ф.И.О лица, подписавшего приказ: ${formData.signerName || "_______________"}
Звание: ${formData.signerRank || "_______________"}

Период действия: ${formData.startDate || "_______________"} - ${formData.endDate || "_______________"}
Воинская часть: ${formData.unit || "_______________"}
    `.trim()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icons.FileText className="h-5 w-5" />
            Создать приказ на ревизию
          </DialogTitle>
          <DialogDescription>
            Заполните все разделы для создания приказа. Предпросмотр документа обновляется в реальном времени.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel - Form */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-200px)] pr-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="requisites" className="flex items-center gap-2">
                  <span className="text-xs bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                  Реквизиты
                </TabsTrigger>
                <TabsTrigger value="parties" className="flex items-center gap-2">
                  <span className="text-xs bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    6
                  </span>
                  Стороны
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <span className="text-xs bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    5
                  </span>
                  Содержание
                </TabsTrigger>
              </TabsList>

              {/* Реквизиты приказа */}
              <TabsContent value="requisites" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Реквизиты приказа</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderDate">
                        Дата принятия приказа
                        <span className="text-xs text-muted-foreground ml-2">(указывается день, месяц, год)</span>
                      </Label>
                      <Input
                        id="orderDate"
                        type="date"
                        value={formData.orderDate}
                        onChange={(e) => handleInputChange("orderDate", e.target.value)}
                        placeholder="ДД.ММ.ГГГГ"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderNumber">Номер приказа</Label>
                      <Input
                        id="orderNumber"
                        value={formData.orderNumber}
                        onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                        placeholder="№ 45"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderPlace">
                        Место принятия приказа
                        <span className="text-xs text-muted-foreground ml-2">(указывается название района/города)</span>
                      </Label>
                      <Input
                        id="orderPlace"
                        value={formData.orderPlace}
                        onChange={(e) => handleInputChange("orderPlace", e.target.value)}
                        placeholder="Ташкент"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Воинская часть</Label>
                      <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите воинскую часть" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12345">Воинская часть 12345</SelectItem>
                          <SelectItem value="67890">Воинская часть 67890</SelectItem>
                          <SelectItem value="54321">Воинская часть 54321</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Стороны */}
              <TabsContent value="parties" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Лицо, подписывающее приказ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signerPosition">Должность лица, подписавшего приказ</Label>
                      <Input
                        id="signerPosition"
                        value={formData.signerPosition}
                        onChange={(e) => handleInputChange("signerPosition", e.target.value)}
                        placeholder="Начальник КРУ"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signerRank">Звание</Label>
                      <Select
                        value={formData.signerRank}
                        onValueChange={(value) => handleInputChange("signerRank", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите звание" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Генерал-майор">Генерал-майор</SelectItem>
                          <SelectItem value="Полковник">Полковник</SelectItem>
                          <SelectItem value="Подполковник">Подполковник</SelectItem>
                          <SelectItem value="Майор">Майор</SelectItem>
                          <SelectItem value="Капитан">Капитан</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signerName">Ф.И.О лица, подписавшего приказ</Label>
                      <Input
                        id="signerName"
                        value={formData.signerName}
                        onChange={(e) => handleInputChange("signerName", e.target.value)}
                        placeholder="Кузнецов В.П."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Дата начала действия</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">Дата окончания действия</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Содержание приказа */}
              <TabsContent value="content" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Содержание приказа</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderTitle">Название приказа</Label>
                      <Input
                        id="orderTitle"
                        value={formData.orderTitle}
                        onChange={(e) => handleInputChange("orderTitle", e.target.value)}
                        placeholder="О временном переводе на другую работу..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderContent">Текст приказа</Label>
                      <Textarea
                        id="orderContent"
                        value={formData.orderContent}
                        onChange={(e) => handleInputChange("orderContent", e.target.value)}
                        placeholder="1. Перевести Должность работника, переходящего на другую работу по своей инициативе отдела Название отдела (структурное подразделение), в котором работает работник..."
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderBasis">Основание (документы, служащие основанием для приказа)</Label>
                      <Textarea
                        id="orderBasis"
                        value={formData.orderBasis}
                        onChange={(e) => handleInputChange("orderBasis", e.target.value)}
                        placeholder="Документы, служащие основанием для приказа"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Примечания</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Дополнительная информация..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-4">
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icons.Eye className="h-4 w-4" />
                  Предпросмотр документа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-gray-300 p-6 rounded font-serif text-sm leading-relaxed max-h-[calc(90vh-300px)] overflow-y-auto whitespace-pre-wrap text-justify">
                  {generatePreview()}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  const preview = generatePreview()
                  const blob = new Blob([preview], { type: "text/plain;charset=utf-8" })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement("a")
                  link.href = url
                  link.download = `Приказ_${formData.orderNumber.replace("№ ", "")}.txt`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(url)
                }}
              >
                <Icons.Download className="mr-2 h-4 w-4" />
                Скачать
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  const preview = generatePreview()
                  navigator.clipboard.writeText(preview)
                }}
              >
                <Icons.Copy className="mr-2 h-4 w-4" />
                Копировать
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Icons.Check className="mr-2 h-4 w-4" />
            Создать приказ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
