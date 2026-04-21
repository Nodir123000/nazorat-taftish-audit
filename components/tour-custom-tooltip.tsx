"use client"

import type { TooltipRenderProps } from "react-joyride"

export function TourCustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      className="rounded-lg p-4 shadow-2xl border border-blue-200"
      style={{
        maxWidth: "220px",
        width: "220px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Content */}
      <div className="mb-4">
        <div className="text-sm text-white leading-relaxed font-medium">{step.content}</div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        {/* First row: Back and Skip buttons */}
        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="flex-1 px-3 py-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded transition-all"
            >
              Назад
            </button>
          )}
          {!isLastStep && (
            <button
              {...skipProps}
              className="flex-1 px-3 py-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded transition-all"
            >
              Пропустить
            </button>
          )}
        </div>

        {/* Second row: Next/Finish button */}
        <button
          {...primaryProps}
          className="w-full px-4 py-2 text-sm font-semibold text-purple-700 bg-white hover:bg-gray-50 rounded transition-colors shadow-md"
        >
          {isLastStep ? "Завершить" : "Вперед"}
        </button>
      </div>
    </div>
  )
}
