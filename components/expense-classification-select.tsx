"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { expenseGroups, type ExpenseArticle } from "@/lib/data/expense-classification"

interface ExpenseClassificationSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ExpenseClassificationSelect({
  value,
  onValueChange,
  placeholder = "Выберите статью расходов",
  disabled = false,
  className,
}: ExpenseClassificationSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Получить выбранную статью
  const getSelectedArticle = (): { group: (typeof expenseGroups)[0]; article: ExpenseArticle } | null => {
    if (!value) return null
    for (const group of expenseGroups) {
      for (const category of group.categories) {
        for (const article of category.articles) {
          if (article.code === value) {
            return { group, article }
          }
        }
      }
    }
    return null
  }

  const selectedArticle = getSelectedArticle()

  // Фильтрация по поисковому запросу
  const filteredGroups = React.useMemo(() => {
    if (!searchQuery) return expenseGroups

    const query = searchQuery.toLowerCase()
    return expenseGroups
      .map((group) => ({
        ...group,
        categories: group.categories
          .map((category) => ({
            ...category,
            articles: category.articles.filter(
              (article) => article.code.toLowerCase().includes(query) || article.name.toLowerCase().includes(query),
            ),
          }))
          .filter((category) => category.articles.length > 0),
      }))
      .filter((group) => group.categories.length > 0)
  }, [searchQuery])

  const groupColors: Record<string, string> = {
    I: "bg-blue-100 text-blue-800 border-blue-200",
    II: "bg-green-100 text-green-800 border-green-200",
    III: "bg-purple-100 text-purple-800 border-purple-200",
    IV: "bg-orange-100 text-orange-800 border-orange-200",
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between text-left font-normal", className)}
        >
          {selectedArticle ? (
            <div className="flex items-center gap-2 truncate">
              <Badge variant="outline" className={cn("shrink-0", groupColors[selectedArticle.group.id])}>
                Группа {selectedArticle.group.id}
              </Badge>
              <span className="truncate">
                {selectedArticle.article.code} - {selectedArticle.article.name}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск по коду или названию..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>Статья расходов не найдена</CommandEmpty>
            {filteredGroups.map((group) => (
              <CommandGroup
                key={group.id}
                heading={
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={groupColors[group.id]}>
                      Группа {group.id}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">{group.name}</span>
                  </div>
                }
              >
                {group.categories.map((category) =>
                  category.articles.map((article) => (
                    <CommandItem
                      key={article.code}
                      value={article.code}
                      onSelect={() => {
                        onValueChange(article.code)
                        setOpen(false)
                        setSearchQuery("")
                      }}
                      className="flex items-center gap-2"
                    >
                      <Check className={cn("h-4 w-4 shrink-0", value === article.code ? "opacity-100" : "opacity-0")} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-mono text-xs text-muted-foreground">{article.code}</span>
                        <span className="truncate">{article.name}</span>
                      </div>
                    </CommandItem>
                  )),
                )}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
