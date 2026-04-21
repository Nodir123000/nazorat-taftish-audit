"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, FileSignature } from "lucide-react"

interface SignatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentTitle: string
  onSign: (comments?: string) => void
}

export function SignatureDialog({ open, onOpenChange, documentTitle, onSign }: SignatureDialogProps) {
  const [comments, setComments] = useState("")
  const [isSigning, setIsSigning] = useState(false)

  const handleSign = async () => {
    setIsSigning(true)
    // Simulate signing process
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSign(comments)
    setIsSigning(false)
    setComments("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Электронная подпись документа
          </DialogTitle>
          <DialogDescription>Вы подписываете: {documentTitle}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Подписант</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Полковник Фазылов Рустам Жураевич</p>
              <p className="text-sm text-muted-foreground">Начальник отдела внутреннего контроля</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Комментарий (необязательно)</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Добавьте комментарий к подписи..."
              rows={3}
            />
          </div>
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning-foreground">
              После подписания документ будет зафиксирован и не подлежит изменению
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSigning}>
            Отмена
          </Button>
          <Button onClick={handleSign} disabled={isSigning} className="gap-2">
            {isSigning ? (
              <>Подписание...</>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Подписать документ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
