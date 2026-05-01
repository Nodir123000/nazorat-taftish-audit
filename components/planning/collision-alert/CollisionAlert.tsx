"use client"

import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import { Locale, toSafeString } from "@/lib/utils/localization"
import { CollisionResult } from "@/lib/types/hierarchy"

interface CollisionAlertProps {
  collision: CollisionResult | null;
  locale: Locale;
  isLoading?: boolean;
}

export function CollisionAlert({ collision, locale, isLoading }: CollisionAlertProps) {
  if (!collision?.hasCollision || !collision.plans || collision.plans.length === 0) {
    return null;
  }

  const isHardBlock = collision.blockLevel === 3;
  const canOverride = collision.canOverride ?? false;
  const requiredMinisterApproval = collision.requiredMinisterApproval ?? false;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
      <Alert
        variant={isHardBlock ? "destructive" : "default"}
        className={cn(
          "rounded-2xl overflow-hidden p-0 shadow-sm",
          isHardBlock
            ? "bg-red-50 border-red-200 text-red-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        )}
      >
        <div className="flex">
          <div className={cn(
            "p-4 flex items-center justify-center flex-shrink-0",
            isHardBlock ? "bg-red-500" : "bg-amber-500"
          )}>
            <Icons.AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div className="p-4 flex-1">
            <AlertTitle className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
              {isHardBlock
                ? (locale === "ru" ? "Внимание: Конфликт планов" : "Diqqat: Rejalar to'qnashuvi")
                : (locale === "ru" ? "Предупреждение: Возможный конфликт" : "Ogohlanish: Mumkin bo'lgan to'qnashuv")}
              <Badge className={cn(
                "border-none text-[10px] h-5",
                isHardBlock ? "bg-red-500 text-white" : "bg-amber-500 text-white"
              )}>
                {collision.plans.length}
              </Badge>
            </AlertTitle>

            <AlertDescription className={cn(
              "text-xs mt-2 font-medium",
              isHardBlock ? "text-red-700/80" : "text-amber-700/80"
            )}>
              {isHardBlock
                ? (locale === "ru"
                  ? "Для этой части уже запланированы проверки на этот год. Требуется приказ министра для переопределения."
                  : "Ushbu qism uchun ushbu yil uchun rejalar mavjud. Qayta belgilash uchun ministr buyrug'i kerak.")
                : (locale === "ru"
                  ? "В базе уже имеются планы проверок для этой части на этот год:"
                  : "Bazada ushbu qism uchun ushbu yil uchun rejalar mavjud:")}
            </AlertDescription>

            <div className="grid grid-cols-1 gap-1 mt-3">
              {collision.plans.map((p: any, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded-lg border",
                    isHardBlock
                      ? "bg-white/50 border-red-100"
                      : "bg-white/50 border-amber-100"
                  )}
                >
                  <Icons.Shield className={cn(
                    "w-3.5 h-3.5 flex-shrink-0",
                    isHardBlock ? "text-red-400" : "text-amber-400"
                  )} />
                  <span className="font-bold text-sm">
                    {toSafeString(p.authority, locale as any)}
                  </span>
                  <span className="opacity-60">|</span>
                  <span className="text-xs opacity-70">
                    {toSafeString(p.type, locale as any)}
                  </span>
                  {p.startDate && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-auto text-[9px] font-mono",
                        isHardBlock
                          ? "border-red-200 text-red-700 bg-red-50"
                          : "border-amber-200 text-amber-700 bg-amber-50"
                      )}
                    >
                      {dayjs(p.startDate).format('DD.MM.YYYY')}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {isHardBlock && requiredMinisterApproval && !canOverride && (
              <div className={cn(
                "mt-3 p-2 rounded border text-[11px] font-semibold",
                "bg-red-50/50 border-red-200 text-red-700"
              )}>
                <Icons.Lock className="h-3 w-3 inline mr-1" />
                {locale === "ru"
                  ? "Переопределение невозможно - недостаточно прав"
                  : "Qayta belgilash mumkin emas - yetarli huquqlar yo'q"}
              </div>
            )}

            {requiredMinisterApproval && canOverride && (
              <div className={cn(
                "mt-3 p-2 rounded border text-[11px] font-semibold",
                "bg-blue-50/50 border-blue-200 text-blue-700"
              )}>
                <Icons.Info className="h-3 w-3 inline mr-1" />
                {locale === "ru"
                  ? "Требуется приказ министра для переопределения"
                  : "Qayta belgilash uchun ministr buyrug'i kerak"}
              </div>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
}
