"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

interface FileUploadProps {
  accept?: string
  maxSize?: number // in bytes
  maxFiles?: number
  onUpload: (files: UploadedFile[]) => void
  disabled?: boolean
  className?: string
}

export function FileUpload({
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  onUpload,
  disabled,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `Файл "${file.name}" превышает максимальный размер ${formatFileSize(maxSize)}`
    }
    return null
  }

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      setError(null)
      setIsUploading(true)

      try {
        const fileArray = Array.from(files).slice(0, maxFiles)

        // Validate files
        for (const file of fileArray) {
          const validationError = validateFile(file)
          if (validationError) {
            setError(validationError)
            setIsUploading(false)
            return
          }
        }

        // Simulate upload (convert to data URLs for demo)
        const uploadedFiles: UploadedFile[] = await Promise.all(
          fileArray.map(async (file) => {
            // In production, this would upload to Vercel Blob or similar
            const dataUrl = await readFileAsDataURL(file)
            return {
              id: Math.random().toString(36).substring(7),
              name: file.name,
              size: file.size,
              type: file.type,
              url: dataUrl,
              uploadedAt: new Date(),
            }
          }),
        )

        onUpload(uploadedFiles)
      } catch (err) {
        setError("Ошибка при загрузке файлов")
        console.error(err)
      } finally {
        setIsUploading(false)
      }
    },
    [maxFiles, maxSize, onUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging && "border-primary bg-primary/5",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "cursor-pointer hover:border-primary/50",
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled || isUploading}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Icons.Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Загрузка файлов...</p>
            </>
          ) : (
            <>
              <Icons.Upload className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Перетащите файлы сюда или нажмите для выбора</p>
                <p className="text-xs text-muted-foreground">
                  Максимальный размер: {formatFileSize(maxSize)} • Максимум файлов: {maxFiles}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <Icons.AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
