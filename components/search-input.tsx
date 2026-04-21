"use client"

import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = "Поиск...", className }: SearchInputProps) {
  return (
    <div className="relative">
      <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("pl-9", className)}
      />
    </div>
  )
}
