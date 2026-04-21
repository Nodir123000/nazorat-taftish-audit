"use client"

import * as React from "react"
import createCache from "@emotion/cache"
import { useServerInsertedHTML } from "next/navigation"
import { CacheProvider } from "@emotion/react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { theme } from "@/lib/theme"

// Компонент регистрации стилей с поддержкой nonce для CSP
export default function ThemeRegistry({ 
  children, 
  nonce 
}: { 
  children: React.ReactNode,
  nonce?: string 
}) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ 
      key: "mui", 
      nonce: nonce // Внедрение nonce в динамические стили Emotion
    })
    cache.compat = true
    const prevInsert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }
    const flush = () => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }
    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) {
      return null
    }
    let styles = ""
    for (const name of names) {
      styles += cache.inserted[name]
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        nonce={nonce} // Применение nonce к серверным стилям
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    )
  })

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}
