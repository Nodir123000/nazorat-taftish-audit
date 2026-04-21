"use client"

import { useEffect, useState } from "react"

interface TourCustomArrowProps {
  targetSelector: string
  isActive: boolean
}

export function TourCustomArrow({ targetSelector, isActive }: TourCustomArrowProps) {
  const [path, setPath] = useState<string>("")

  useEffect(() => {
    if (!isActive || !targetSelector || targetSelector === "body") {
      setPath("")
      return
    }

    const updatePath = () => {
      const targetElement = document.querySelector(targetSelector)
      if (!targetElement) {
        setPath("")
        return
      }

      const targetRect = targetElement.getBoundingClientRect()

      const tooltipWidth = 220
      const tooltipLeft = 20
      const startX = tooltipLeft + tooltipWidth / 2
      const startY = window.innerHeight - 20

      const sidebarEdge = 200

      const targetCenterX = targetRect.left + targetRect.width / 2
      const targetCenterY = targetRect.top + targetRect.height / 2

      const pathData = `
        M ${startX} ${startY}
        L ${sidebarEdge} ${startY}
        L ${sidebarEdge} ${targetCenterY}
        L ${targetCenterX} ${targetCenterY}
      `

      setPath(pathData.trim())
    }

    updatePath()
    window.addEventListener("resize", updatePath)
    window.addEventListener("scroll", updatePath)

    const observer = new MutationObserver(updatePath)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true })

    return () => {
      window.removeEventListener("resize", updatePath)
      window.removeEventListener("scroll", updatePath)
      observer.disconnect()
    }
  }, [targetSelector, isActive])

  if (!path || !isActive) return null

  return (
    <svg className="pointer-events-none fixed inset-0 z-[9999]" style={{ width: "100%", height: "100%" }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
        </marker>
      </defs>
      <path
        d={path}
        stroke="#3b82f6"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 4"
        markerEnd="url(#arrowhead)"
        opacity="0.7"
        style={{
          filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))",
        }}
      />
    </svg>
  )
}
