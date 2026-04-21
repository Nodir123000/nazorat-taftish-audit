import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  // Plan statuses
  draft: { label: "Черновик", variant: "secondary" },
  approved: { label: "Утвержден", variant: "default" },
  in_progress: { label: "В работе", variant: "default" },
  completed: { label: "Завершен", variant: "outline" },

  // Audit statuses
  planned: { label: "Запланирована", variant: "secondary" },
  cancelled: { label: "Отменена", variant: "destructive" },

  // Violation statuses
  under_review: { label: "На рассмотрении", variant: "secondary" },
  confirmed: { label: "Подтверждено", variant: "destructive" },
  resolved: { label: "Устранено", variant: "default" },
  closed: { label: "Закрыто", variant: "outline" },

  // Decision statuses
  pending: { label: "Ожидает", variant: "secondary" },
  overdue: { label: "Просрочено", variant: "destructive" },

  // Severity
  low: { label: "Низкая", variant: "secondary" },
  medium: { label: "Средняя", variant: "default" },
  high: { label: "Высокая", variant: "destructive" },
  critical: { label: "Критическая", variant: "destructive" },
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "default" }

  return (
    <Badge variant={variant || config.variant} className={cn("font-normal", className)}>
      {config.label}
    </Badge>
  )
}
