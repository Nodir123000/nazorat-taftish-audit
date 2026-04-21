"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload, type UploadedFile } from "./file-upload"
import { FileList } from "./file-list"

interface DocumentUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { title: string; description: string; files: UploadedFile[] }) => void
  title?: string
  description?: string
}

export function DocumentUploadDialog({
  open,
  onOpenChange,
  onSubmit,
  title = "Загрузить документы",
  description = "Добавьте документы и заполните информацию",
}: DocumentUploadDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [files, setFiles] = useState<UploadedFile[]>([])

  const handleSubmit = () => {
    if (!formData.title || files.length === 0) {
      alert("Заполните название и загрузите хотя бы один файл")
      return
    }

    onSubmit({
      ...formData,
      files,
    })

    // Reset form
    setFormData({ title: "", description: "" })
    setFiles([])
    onOpenChange(false)
  }

  const handleUpload = (newFiles: UploadedFile[]) => {
    setFiles([...files, ...newFiles])
  }

  const handleRemove = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название документа *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Введите описание (необязательно)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Файлы *</Label>
            <FileUpload
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024}
              maxFiles={5}
              onUpload={handleUpload}
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Загруженные файлы ({files.length})</Label>
              <FileList files={files} onRemove={handleRemove} />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title || files.length === 0}>
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
