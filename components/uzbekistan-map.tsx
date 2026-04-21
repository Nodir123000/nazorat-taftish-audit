"use client"

import { useState, useMemo } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// Import all map data
import { regionPaths } from "./map-data/uzbekistan-region-paths"
import { andijanDistrictPaths } from "./map-data/andijan-district-paths"
import { bukharaDistrictPaths } from "./map-data/bukhara-district-paths"
import { ferganaDistrictPaths } from "./map-data/fergana-district-paths"
import { jizzakhDistrictPaths } from "./map-data/jizzakh-district-paths"
import { khorezmDistrictPaths } from "./map-data/xorazm-district-paths"
import { namanganDistrictPaths } from "./map-data/namangan-district-paths"
import { navoiDistrictPaths } from "./map-data/navoi-district-paths"
import { kashkadaryaDistrictPaths } from "./map-data/kashkadarya-district-paths"
import { samarkandDistrictPaths } from "./map-data/samarkand-district-paths"
import { surkhandaryaDistrictPaths } from "./map-data/surkhandarya-district-paths"
import { syrdaryaDistrictPaths } from "./map-data/syrdarya-district-paths"
import { tashkentDistrictPaths } from "./map-data/tashkent-city-district-paths"
import { tashkentRegionDistrictPaths } from "./map-data/tashkent-region-district-paths"
import { karakalpakstanDistrictPaths } from "./map-data/karakalpakstan-district-paths"

// Configuration for each region
const REGION_CONFIG: Record<string, { paths: any; viewBox: string; label: string }> = {
  "UZAN": { paths: andijanDistrictPaths, viewBox: "40 -7 280 450", label: "Андижанская область" },
  "UZBU": { paths: bukharaDistrictPaths, viewBox: "-10 -18 690 900", label: "Бухарская область" },
  "UZFA": { paths: ferganaDistrictPaths, viewBox: "20 -26 450 620", label: "Ферганская область" },
  "UZJI": { paths: jizzakhDistrictPaths, viewBox: "-15 -24 680 800", label: "Джизакская область" },
  "UZXO": { paths: khorezmDistrictPaths, viewBox: "40 -24 520 710", label: "Хорезмская область" },
  "UZNG": { paths: namanganDistrictPaths, viewBox: "-10 -10 500 600", label: "Наманганская область" },
  "UZNW": { paths: navoiDistrictPaths, viewBox: "-150 -18 1000 950", label: "Навоийская область" },
  "UZQA": { paths: kashkadaryaDistrictPaths, viewBox: "-24 -10 447 510", label: "Кашкадарьинская область" },
  "UZSA": { paths: samarkandDistrictPaths, viewBox: "-0 -12 500 640", label: "Самаркандская область" },
  "UZSU": { paths: surkhandaryaDistrictPaths, viewBox: "-20 -25 900 1150", label: "Сурхандарьинская область" },
  "UZSI": { paths: syrdaryaDistrictPaths, viewBox: "-30 -20 750 900", label: "Сырдарьинская область" },
  "UZTK": { paths: tashkentDistrictPaths, viewBox: "-1500 300 7500 4760", label: "г. Ташкент" },
  "UZTO": { paths: tashkentRegionDistrictPaths, viewBox: "-1 -25 700 900", label: "Ташкентская область" },
  "UZQR": { paths: karakalpakstanDistrictPaths, viewBox: "-24 -10 428 900", label: "Республика Каракалпакстан" },
}

import { REGION_DATA, POLITICAL_PALETTE } from "@/lib/data/regions"
import { useDashboard } from "./dashboard-v2/dashboard-context"

// Генерируем моковые данные для районов на основе ключей путей
const generateDistrictData = (regionId: string, paths: Record<string, string>) => {
  const paletteValues = Object.values(POLITICAL_PALETTE);

  return Object.keys(paths).map((districtId, index) => {
    // Simple hash function to generate deterministic numbers based on districtId
    // This prevents hydration mismatches that occur with Math.random()
    const hash = districtId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(hash + seed) * 10000;
      return x - Math.floor(x);
    };

    return {
      id: districtId,
      name: districtId, // В реальном проекте здесь был бы маппинг названий
      violations: Math.floor(pseudoRandom(1) * 15) + 2,
      audits: Math.floor(pseudoRandom(2) * 20) + 5,
      damage: Math.floor(pseudoRandom(3) * 200000) + 50000,
      // Assign color based on index to ensure variety
      color: paletteValues[index % paletteValues.length]
    };
  });
}

// Helper to lighten color for default state (if needed) or hover effect
const getHoverColor = (color: string) => {
  // Simple darkening/lightening logic or just return same slightly modified
  // For now, let's just use CSS filter in the component, so this might not be needed.
  return color;
}

export interface UzbekistanMapProps {
  view?: string // 'country' or region ID
  onViewChange?: (view: string) => void
  hideControls?: boolean
  className?: string
  style?: React.CSSProperties
}

export function UzbekistanMap({ view: controlledView, onViewChange, hideControls, className, style }: UzbekistanMapProps) {
  const { setFilter } = useDashboard()
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [localView, setLocalView] = useState<string>('country')

  // Sync internal view state with external filter if needed, 
  // but for now we primarily drive the map view from the click.
  // Ideally, we might want the map view to listen to the filter too?
  // For this step, we just push changes OUT.

  const view = controlledView ?? localView
  const setView = onViewChange ?? setLocalView

  const currentData = useMemo(() => {
    if (view === 'country') return REGION_DATA
    const config = REGION_CONFIG[view]
    if (config) {
      return generateDistrictData(view, config.paths)
    }
    return []
  }, [view])

  const currentPaths = useMemo(() => {
    // ... existing logic ...
    if (view === 'country') return regionPaths
    const config = REGION_CONFIG[view]
    return config ? config.paths : {}
  }, [view])

  const currentViewBox = useMemo(() => {
    // ... existing logic ...
    if (view === 'country') return "-5 5 1010 1300"
    if (view === 'UZQR') return "-120 -1 600 900"
    const config = REGION_CONFIG[view]
    return config ? config.viewBox : "0 0 402 416"
  }, [view])

  const handleRegionClick = (regionId: string) => {
    if (view === 'country' && REGION_CONFIG[regionId]) {
      setView(regionId)
      setHoveredRegion(null)
      // Update global dashboard filter
      setFilter('district', regionId)
    }
  }

  const handleBackToCountry = () => {
    setView('country')
    setFilter('district', null)
  }

  return (
    <div
      className={cn("w-full h-full flex items-center justify-center overflow-hidden relative p-4", className)}
      style={style}
    >
      {view !== 'country' && !hideControls && (
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white text-slate-700 border-slate-200"
            onClick={handleBackToCountry}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Назад к карте страны
          </Button>
        </div>
      )}
      <TooltipProvider>
        <svg
          viewBox={currentViewBox}
          className="w-full h-full"
          strokeLinecap="round"
          strokeLinejoin="round"
          preserveAspectRatio="xMidYMin meet"
        >
          {/* Регионы / Районы */}
          <g>
            {currentData.map((item) => {
              const regionId = item.id
              const path = (currentPaths as any)[regionId]

              if (!path) return null

              const isHovered = hoveredRegion === regionId
              // Use static color from data
              const color = (item as any).color || "#CBD5E1" // Fallback to slate-300 if undefined

              // Adjust stroke based on view
              const strokeWidth = view === 'country' ? "0.5" : (view === 'UZTK' ? "15" : "1")

              return (
                <Tooltip key={regionId}>
                  <TooltipTrigger asChild>
                    <g
                      className={`transition-all duration-300 ${view === 'country' ? 'cursor-pointer' : ''}`}
                      onMouseEnter={() => setHoveredRegion(regionId)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => handleRegionClick(regionId)}
                    >
                      <path
                        d={path}
                        fill={color}
                        stroke="#FFF" // White stroke for political map style
                        strokeWidth={strokeWidth}
                        className="transition-all duration-300 ease-out"
                        style={{
                          filter: isHovered ? "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.2))" : "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                          transform: isHovered ? "scale(1.005)" : "scale(1)",
                          transformOrigin: "center",
                          opacity: isHovered ? 1 : 0.9, // Slight transparency for texture feel
                        }}
                      />
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-zinc-950/95 text-white border-zinc-800 backdrop-blur-md px-3 py-2 shadow-2xl">
                    <div className="space-y-1.5 min-w-[140px]">
                      <p className="font-bold text-sm text-blue-400 border-b border-zinc-800 pb-1 mb-1">{item.name}</p>
                      <div className="grid grid-cols-2 gap-x-2 text-[11px] leading-relaxed">
                        <span className="text-zinc-400">Нарушений:</span>
                        <span className="font-semibold text-right">{item.violations}</span>
                        <span className="text-zinc-400">Ревизий:</span>
                        <span className="font-semibold text-right">{item.audits}</span>
                        <span className="text-zinc-400 border-t border-zinc-800/50 mt-1 pt-0.5">Ущерб:</span>
                        <span className="font-semibold text-right text-emerald-400 border-t border-zinc-800/50 mt-1 pt-0.5">{(item.damage / 1000000).toFixed(1)} млн</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </g>
        </svg>
      </TooltipProvider>
    </div>
  )
}
