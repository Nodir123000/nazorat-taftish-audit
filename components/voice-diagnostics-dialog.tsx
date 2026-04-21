import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type DiagnosticStatus = 'pending' | 'success' | 'error' | 'warning';

type DiagnosticItem = {
  name: string;
  status: DiagnosticStatus;
  message: string;
};

interface VoiceDiagnosticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnostics: DiagnosticItem[];
  progress: number;
}

export function VoiceDiagnosticsDialog({
  open,
  onOpenChange,
  diagnostics,
  progress,
}: VoiceDiagnosticsDialogProps) {
  const getStatusIcon = (status: DiagnosticStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const allComplete = diagnostics.every(d => d.status !== 'pending');
  const hasErrors = diagnostics.some(d => d.status === 'error');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Диагностика голосового помощника</DialogTitle>
          <DialogDescription>
            Проверка системы распознавания речи
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Прогресс</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="space-y-3">
            {diagnostics.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {allComplete && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open('/voice-diagnostics', '_blank')}
              >
                Подробная диагностика
              </Button>
              <Button
                className="flex-1"
                onClick={() => onOpenChange(false)}
                variant={hasErrors ? 'destructive' : 'default'}
              >
                {hasErrors ? 'Закрыть' : 'Готово'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
