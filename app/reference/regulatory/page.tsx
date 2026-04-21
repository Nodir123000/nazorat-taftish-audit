"use client"

import { useState, useEffect } from "react"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload, type UploadedFile } from "@/components/file-upload"
import { FileList } from "@/components/file-list"

import { DocumentTemplates } from "@/components/reference/document-templates"

export default function RegulatoryBasePage() {
  const [activeSection, setActiveSection] = useState("regulations")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [regulations, setRegulations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/regulatory")
      const data = await res.json()
      if (Array.isArray(data)) {
        setRegulations(data)
      } else {
        console.error("Invalid regulatory data format:", data)
        setRegulations([])
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error)
      setRegulations([])
    } finally {
      setIsLoading(false)
    }
  }

  const [regulationFormData, setRegulationFormData] = useState({
    num: "",
    type: "",
    name: "",
    date: "",
    direction: "",
    files: [] as UploadedFile[],
  })
  const [formFormData, setFormFormData] = useState({
    num: "",
    name: "",
    category: "",
    period: "",
    version: "",
    files: [] as UploadedFile[],
  })
  const [sampleFormData, setSampleFormData] = useState({
    code: "",
    name: "",
    type: "",
    format: "",
    files: [] as UploadedFile[],
  })

  const [selectedRegulation, setSelectedRegulation] = useState<any>(null)

  const sections = [
    { id: "regulations", title: "Положения и приказы", icon: Icons.FileText },
    { id: "forms", title: "Формы учёта", icon: Icons.File },
    { id: "samples", title: "Образцы документов", icon: Icons.Clipboard },
    { id: "templates", title: "Шаблоны документов", icon: Icons.Book },
  ]

  const handleFilePreview = (file: UploadedFile) => {
    if (!file.url) {
      console.error("No file URL found")
      return
    }

    // Check if file is PDF or Image for preview
    const isViewable = file.type === "application/pdf" || file.type.startsWith("image/")

    if (isViewable) {
      // Open in new tab
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(
          `<iframe src="${file.url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        )
        newWindow.document.title = file.name
      } else {
        alert("Пожалуйста, разрешите всплывающие окна для просмотра документа")
      }
    } else {
      alert("Предварительный просмотр для данного формата не поддерживается (только PDF и изображения).")
    }
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case "regulations":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-blue-700">Всего документов</CardTitle>
                    <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                      <Icons.FileText className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-blue-700 mt-2">89</div>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-green-700">Приказов</CardTitle>
                    <div className="rounded-full bg-green-500 p-2 ring-4 ring-green-200">
                      <Icons.Clipboard className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-green-700 mt-2">45</div>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-purple-700">Положений</CardTitle>
                    <div className="rounded-full bg-purple-500 p-2 ring-4 ring-purple-200">
                      <Icons.Book className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-purple-700 mt-2">44</div>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Положения и приказы</CardTitle>
                    <CardDescription>Нормативные документы и приказы</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Icons.Plus className="mr-2 h-4 w-4" />
                        Добавить документ
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Добавить документ</DialogTitle>
                        <DialogDescription>Заполните информацию о новом нормативном документе</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Номер</Label>
                            <Input
                              placeholder="№ 123"
                              value={regulationFormData.num}
                              onChange={(e) => setRegulationFormData({ ...regulationFormData, num: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Тип</Label>
                            <Select
                              value={regulationFormData.type}
                              onValueChange={(value) => setRegulationFormData({ ...regulationFormData, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Приказ">Приказ</SelectItem>
                                <SelectItem value="Положение">Положение</SelectItem>
                                <SelectItem value="Инструкция">Инструкция</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Название</Label>
                          <Input
                            placeholder="О проведении контрольно-ревизионной работы"
                            value={regulationFormData.name}
                            onChange={(e) => setRegulationFormData({ ...regulationFormData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Дата</Label>
                          <Input
                            type="date"
                            value={regulationFormData.date}
                            onChange={(e) => setRegulationFormData({ ...regulationFormData, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Направление</Label>
                          <Select
                            value={regulationFormData.direction}
                            onValueChange={(value) => setRegulationFormData({ ...regulationFormData, direction: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите направление" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Финансовое">Финансовое</SelectItem>
                              <SelectItem value="Юридическое">Юридическое</SelectItem>
                              <SelectItem value="Тыловое">Тыловое</SelectItem>
                              <SelectItem value="Кадровое">Кадровое</SelectItem>
                              <SelectItem value="Медицинское">Медицинское</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Файлы документа</Label>
                          <FileUpload
                            accept=".pdf,.doc,.docx"
                            maxSize={20 * 1024 * 1024}
                            maxFiles={3}
                            onUpload={(files) =>
                              setRegulationFormData({
                                ...regulationFormData,
                                files: [...regulationFormData.files, ...files],
                              })
                            }
                          />
                        </div>
                        {regulationFormData.files.length > 0 && (
                          <div className="space-y-2">
                            <Label>Загруженные файлы ({regulationFormData.files.length})</Label>
                            <FileList
                              files={regulationFormData.files}
                              onRemove={(fileId) =>
                                setRegulationFormData({
                                  ...regulationFormData,
                                  files: regulationFormData.files.filter((f) => f.id !== fileId),
                                })
                              }
                            />
                          </div>
                        )}
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Отмена
                          </Button>
                          <Button
                            onClick={async () => {
                              const newDoc = {
                                ...regulationFormData,
                                status: "active",
                              }

                              try {
                                const res = await fetch("/api/regulatory", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify(newDoc),
                                })
                                if (res.ok) {
                                  fetchDocuments()
                                }
                              } catch (error) {
                                console.error("Failed to save document:", error)
                              }

                              setIsDialogOpen(false)
                              setRegulationFormData({ num: "", type: "", name: "", date: "", direction: "", files: [] })
                            }}
                          >
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Input placeholder="Поиск по номеру или названию..." className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-md bg-background">
                    <option value="">Все типы</option>
                    <option value="order">Приказ</option>
                    <option value="regulation">Положение</option>
                    <option value="instruction">Инструкция</option>
                  </select>
                </div>

                {/* View Document Dialog */}
                <Dialog open={!!selectedRegulation} onOpenChange={(open) => !open && setSelectedRegulation(null)}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Карточка документа</DialogTitle>
                      <DialogDescription>Информация о нормативном документе</DialogDescription>
                    </DialogHeader>

                    {selectedRegulation && (
                      <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Номер</Label>
                            <div className="font-mono font-semibold text-lg">{selectedRegulation.num}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Дата</Label>
                            <div className="font-medium">{selectedRegulation.date}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Направление</Label>
                            <div className="font-medium">{selectedRegulation.direction || "—"}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Тип</Label>
                            <div><Badge variant="outline">{selectedRegulation.type}</Badge></div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Статус</Label>
                            <div><Badge variant="default">{selectedRegulation.status}</Badge></div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-muted-foreground">Наименование</Label>
                          <div className="font-medium text-lg leading-relaxed">{selectedRegulation.name}</div>
                        </div>

                        <div>
                          <Label className="text-muted-foreground mb-2 block">Прикрепленные файлы</Label>
                          {selectedRegulation.files && selectedRegulation.files.length > 0 ? (
                            <div className="grid gap-2">
                              {selectedRegulation.files.map((file: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                                  <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                                      <Icons.FileText className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">{file.name}</div>
                                      <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => handleFilePreview(file)}>
                                    <Icons.Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground italic">Нет прикрепленных файлов</div>
                          )}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Направление</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(regulations) && regulations.map((doc, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{doc.num}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">{doc.direction || "Финансовое"}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{doc.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(doc.date).toLocaleDateString("ru-RU")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{doc.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedRegulation(doc)}>
                              <Icons.Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div >
        )

      case "forms":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-blue-700">Форм учёта</CardTitle>
                    <div className="rounded-full bg-blue-500 p-2 ring-4 ring-blue-200">
                      <Icons.File className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-blue-700 mt-2">34</div>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-amber-700">Финансовых форм</CardTitle>
                    <div className="rounded-full bg-amber-500 p-2 ring-4 ring-amber-200">
                      <Icons.DollarSign className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-amber-700 mt-2">18</div>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-rose-700">Имущественных форм</CardTitle>
                    <div className="rounded-full bg-rose-500 p-2 ring-4 ring-rose-200">
                      <Icons.Package className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-rose-700 mt-2">16</div>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Формы учёта</CardTitle>
                    <CardDescription>Формы финансового и имущественного учёта</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Icons.Plus className="mr-2 h-4 w-4" />
                        Добавить форму
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Добавить форму учёта</DialogTitle>
                        <DialogDescription>Заполните информацию о новой форме учёта</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Номер формы</Label>
                            <Input
                              placeholder="Ф.151/ФС"
                              value={formFormData.num}
                              onChange={(e) => setFormFormData({ ...formFormData, num: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Категория</Label>
                            <Select
                              value={formFormData.category}
                              onValueChange={(value) => setFormFormData({ ...formFormData, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите категорию" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="financial">Финансовые</SelectItem>
                                <SelectItem value="property">Имущественные</SelectItem>
                                <SelectItem value="personnel">Кадровые</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Наименование</Label>
                          <Input
                            placeholder="Книга учёта денежных средств"
                            value={formFormData.name}
                            onChange={(e) => setFormFormData({ ...formFormData, name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Периодичность</Label>
                            <Input
                              placeholder="Ежедневно"
                              value={formFormData.period}
                              onChange={(e) => setFormFormData({ ...formFormData, period: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Версия</Label>
                            <Input
                              placeholder="v2.1"
                              value={formFormData.version}
                              onChange={(e) => setFormFormData({ ...formFormData, version: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Файлы формы</Label>
                          <FileUpload
                            accept=".xlsx,.xls,.pdf,.docx"
                            maxSize={20 * 1024 * 1024}
                            maxFiles={3}
                            onUpload={(files) =>
                              setFormFormData({ ...formFormData, files: [...formFormData.files, ...files] })
                            }
                          />
                        </div>
                        {formFormData.files.length > 0 && (
                          <div className="space-y-2">
                            <Label>Загруженные файлы ({formFormData.files.length})</Label>
                            <FileList
                              files={formFormData.files}
                              onRemove={(fileId) =>
                                setFormFormData({
                                  ...formFormData,
                                  files: formFormData.files.filter((f) => f.id !== fileId),
                                })
                              }
                            />
                          </div>
                        )}
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Отмена
                          </Button>
                          <Button
                            onClick={() => {
                              console.log("[v0] Сохранение формы:", formFormData)
                              setIsDialogOpen(false)
                              setFormFormData({ num: "", name: "", category: "", period: "", version: "", files: [] })
                            }}
                          >
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Input placeholder="Поиск по номеру или названию..." className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-md bg-background">
                    <option value="">Все категории</option>
                    <option value="financial">Финансовые</option>
                    <option value="property">Имущественные</option>
                    <option value="personnel">Кадровые</option>
                  </select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер формы</TableHead>
                      <TableHead>Наименование</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Периодичность</TableHead>
                      <TableHead>Версия</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        num: "Ф.151/ФС",
                        name: "Книга учёта денежных средств",
                        category: "Финансовые",
                        period: "Ежедневно",
                        version: "v2.1",
                      },
                      {
                        num: "Ф.171/ФС",
                        name: "Акт ревизии кассы",
                        category: "Финансовые",
                        period: "По требованию",
                        version: "v1.5",
                      },
                      {
                        num: "Ф.52/ФС",
                        name: "Акт о выявленных нарушениях",
                        category: "Финансовые",
                        period: "По факту",
                        version: "v3.0",
                      },
                    ].map((form, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-semibold">{form.num}</TableCell>
                        <TableCell className="font-semibold">{form.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{form.category}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{form.period}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{form.version}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Icons.Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Icons.Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )

      case "samples":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="relative overflow-hidden border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-cyan-700">Образцов документов</CardTitle>
                    <div className="rounded-full bg-cyan-500 p-2 ring-4 ring-cyan-200">
                      <Icons.Files className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-cyan-700 mt-2">56</div>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-indigo-700">Актов и протоколов</CardTitle>
                    <div className="rounded-full bg-indigo-500 p-2 ring-4 ring-indigo-200">
                      <Icons.FileText className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-indigo-700 mt-2">28</div>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-violet-700">Служебных записок</CardTitle>
                    <div className="rounded-full bg-violet-500 p-2 ring-4 ring-violet-200">
                      <Icons.Mail className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-violet-700 mt-2">28</div>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Образцы документов</CardTitle>
                    <CardDescription>Шаблоны и образцы документов</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Icons.Plus className="mr-2 h-4 w-4" />
                        Добавить образец
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Добавить образец документа</DialogTitle>
                        <DialogDescription>Заполните информацию о новом образце документа</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Код</Label>
                            <Input
                              placeholder="DOC-001"
                              value={sampleFormData.code}
                              onChange={(e) => setSampleFormData({ ...sampleFormData, code: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Тип</Label>
                            <Select
                              value={sampleFormData.type}
                              onValueChange={(value) => setSampleFormData({ ...sampleFormData, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="act">Акты</SelectItem>
                                <SelectItem value="protocol">Протоколы</SelectItem>
                                <SelectItem value="memo">Служебные записки</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Наименование</Label>
                          <Input
                            placeholder="Акт ревизии финансово-хозяйственной деятельности"
                            value={sampleFormData.name}
                            onChange={(e) => setSampleFormData({ ...sampleFormData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Формат</Label>
                          <Select
                            value={sampleFormData.format}
                            onValueChange={(value) => setSampleFormData({ ...sampleFormData, format: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите формат" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="docx">DOCX</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="xlsx">XLSX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Файлы образца</Label>
                          <FileUpload
                            accept=".pdf,.doc,.docx,.xlsx,.xls"
                            maxSize={20 * 1024 * 1024}
                            maxFiles={3}
                            onUpload={(files) =>
                              setSampleFormData({ ...sampleFormData, files: [...sampleFormData.files, ...files] })
                            }
                          />
                        </div>
                        {sampleFormData.files.length > 0 && (
                          <div className="space-y-2">
                            <Label>Загруженные файлы ({sampleFormData.files.length})</Label>
                            <FileList
                              files={sampleFormData.files}
                              onRemove={(fileId) =>
                                setSampleFormData({
                                  ...sampleFormData,
                                  files: sampleFormData.files.filter((f) => f.id !== fileId),
                                })
                              }
                            />
                          </div>
                        )}
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Отмена
                          </Button>
                          <Button
                            onClick={() => {
                              console.log("[v0] Сохранение образца:", sampleFormData)
                              setIsDialogOpen(false)
                              setSampleFormData({ code: "", name: "", type: "", format: "", files: [] })
                            }}
                          >
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Input placeholder="Поиск по названию..." className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-md bg-background">
                    <option value="">Все типы</option>
                    <option value="act">Акты</option>
                    <option value="protocol">Протоколы</option>
                    <option value="memo">Служебные записки</option>
                  </select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Код</TableHead>
                      <TableHead>Наименование</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Формат</TableHead>
                      <TableHead>Обновлён</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        code: "DOC-001",
                        name: "Акт ревизии финансово-хозяйственной деятельности",
                        type: "Акт",
                        format: "DOCX",
                        updated: "15.01.2024",
                      },
                      {
                        code: "DOC-002",
                        name: "Протокол заседания комиссии",
                        type: "Протокол",
                        format: "DOCX",
                        updated: "20.02.2024",
                      },
                      {
                        code: "DOC-003",
                        name: "Служебная записка о выявленных нарушениях",
                        type: "Записка",
                        format: "DOCX",
                        updated: "10.03.2024",
                      },
                    ].map((doc, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{doc.code}</TableCell>
                        <TableCell className="font-semibold">{doc.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{doc.format}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{doc.updated}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const templateType = doc.code === "DOC-001" ? "act" : doc.code === "DOC-002" ? "protocol" : "sample"
                                window.location.href = `/reference/regulatory/generate?type=${templateType}&code=${doc.code}`
                              }}
                            >
                              <Icons.FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Icons.Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )

      case "templates":
        return <DocumentTemplates />

      default:
        return null
    }
  }

  return (
    <div className="w-full min-h-screen pb-10">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b pb-6 px-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            Нормативная база
          </h1>
          <p className="text-muted-foreground text-lg mt-1 leading-tight">
            Нормативные документы и образцы
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-muted/30 p-1.5 rounded-2xl border backdrop-blur-sm shadow-inner overflow-x-auto max-w-full">
            {sections.map((section) => {
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02] font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <section.icon className={cn("h-4 w-4", isActive ? "animate-pulse" : "")} />
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="px-4">
        {renderSectionContent()}
      </div>
    </div>
  )
}
