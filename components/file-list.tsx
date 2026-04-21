"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import type { UploadedFile } from "./file-upload"

interface FileListProps {
  files: UploadedFile[]
  onRemove?: (fileId: string) => void
  onDownload?: (file: UploadedFile) => void
  showActions?: boolean
}

export function FileList({ files, onRemove, onDownload, showActions = true }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Icons.FileText className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Нет загруженных файлов</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="flex items-center gap-3 rounded-lg border p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">{getFileIcon(file.type)}</div>

          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
            </p>
          </div>

          {showActions && (
            <div className="flex items-center gap-1">
              {onDownload && (
                <Button variant="ghost" size="icon" onClick={() => onDownload(file)} title="Скачать">
                  <Icons.Download className="h-4 w-4" />
                </Button>
              )}
              {onRemove && (
                <Button variant="ghost" size="icon" onClick={() => onRemove(file.id)} title="Удалить">
                  <Icons.Trash className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) {
    return <Icons.FileImage className="h-5 w-5 text-muted-foreground" />
  }
  if (type.includes("pdf")) {
    return <Icons.FileText className="h-5 w-5 text-muted-foreground" />
  }
  if (type.includes("word") || type.includes("document")) {
    return <Icons.FileText className="h-5 w-5 text-muted-foreground" />
  }
  if (type.includes("excel") || type.includes("spreadsheet")) {
    return <Icons.FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
  }
  return <Icons.File className="h-5 w-5 text-muted-foreground" />
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
