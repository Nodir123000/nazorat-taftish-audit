'use client'

import { useEffect, useState } from 'react'

export function useSectionVisibility() {
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const saved = localStorage.getItem('hiddenSections')
    if (saved) {
      setHiddenSections(new Set(JSON.parse(saved)))
    }

    const handleVisibilityChange = (event: Event) => {
      const customEvent = event as CustomEvent
      const { visible, sections } = customEvent.detail
      
      // Compute hidden sections: all sections that are NOT in the visible list
      // If visible list is empty, all sections are hidden
      if (sections && sections.size > 0) {
        console.log('[v0] Видимые разделы:', Array.from(sections))
      }
      setHiddenSections(new Set(sections || []))
    }

    window.addEventListener('moduleVisibilityChanged', handleVisibilityChange)
    return () => window.removeEventListener('moduleVisibilityChanged', handleVisibilityChange)
  }, [])

  const isSectionVisible = (sectionId: string): boolean => {
    // Show all sections by default (empty hidden set)
    if (hiddenSections.size === 0) return true
    // Hide sections that are in the hidden set
    return !hiddenSections.has(sectionId)
  }

  return { isSectionVisible, hiddenSections }
}
