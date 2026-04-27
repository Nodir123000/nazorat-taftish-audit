"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, ScrollText, ChevronDown } from "lucide-react"

interface ModuleSection {
  id: string
  title: string
}

interface SubModule {
  id: string
  title: string
  sections?: ModuleSection[]
}

interface Module {
  id: string
  title: string
  hasSubmodules?: boolean
  submodules?: SubModule[]
  sections?: ModuleSection[]
}

const modules: Module[] = [
  { id: "dashboard", title: "Главная" },
  {
    id: "planning",
    title: "Планирование КРР",
    hasSubmodules: true,
    submodules: [
      {
        id: "annual-plan",
        title: "Годовое планирование",
        sections: [
          { id: "schedule-revisions", title: "План-график ревизий" },
          { id: "approved-plans", title: "Утверждённые планы" },
          { id: "inspector-distribution", title: "Распределение инспекторов" },
          { id: "execution-control", title: "Контроль выполнения" },
        ],
      },
      {
        id: "orders",
        title: "Приказы и назначения",
        sections: [
          { id: "orders", title: "Приказы на проведение ревизий" },
          { id: "commission", title: "Назначенные ревизоры" },
          { id: "prescriptions", title: "Предписания" },
          { id: "briefing", title: "Инструктаж" },
        ],
      },
    ],
  },
  {
    id: "kpi",
    title: "KPI Сотрудников",
    hasSubmodules: true,
    submodules: [
      { id: "kpi-employees", title: "Карточки сотрудников" },
      { id: "kpi-management", title: "Данные и расчёт" },
      { id: "kpi-analytics", title: "Аналитика" },
    ],
  },

  {
    id: "violations",
    title: "Учёт нарушений",
    hasSubmodules: true,
    submodules: [
      {
        id: "financial-violations",
        title: "Финансовые нарушения",
      },
      {
        id: "assets",
        title: "Недостачи имущества",
      },
    ],
  },
  {
    id: "personnel",
    title: "Штат",
    hasSubmodules: true,
    submodules: [
      { id: "personnel-units", title: "Воинские части" },
      { id: "personnel-list", title: "Список военнослужащих" },
      { id: "personnel-personnel", title: "Личный состав" },
      { id: "personnel-categories", title: "Категории" },
      { id: "personnel-positions", title: "Должности" },
    ],
  },
  {
    id: "reports",
    title: "Отчётность",
    hasSubmodules: true,
    submodules: [
      {
        id: "report-generation",
        title: "Формирование отчётов",
        sections: [
          { id: "final", title: "Итоговый отчёт" },
          { id: "preliminary", title: "Предварительный отчёт" },
          { id: "compliance", title: "Соответствие" },
        ],
      },
      {
        id: "explanatory",
        title: "Пояснительная записка",
        sections: [
          { id: "dynamics", title: "Динамика" },
          { id: "analysis", title: "Анализ" },
        ],
      },
      {
        id: "analytics",
        title: "Аналитика и своды",
        sections: [
          { id: "periods", title: "По периодам" },
          { id: "by-divisions", title: "По подразделениям" },
          { id: "by-types", title: "По видам нарушений" },
        ],
      },
    ],
  },
  {
    id: "reference",
    title: "Справочники",
    hasSubmodules: true,
    submodules: [
      {
        id: "database",
        title: "Справочная база",
        sections: [
          { id: "districts", title: "Военные округа" },
          { id: "units", title: "Воинские части" },
          { id: "positions", title: "Должности" },
        ],
      },
      {
        id: "regulatory",
        title: "Нормативная база",
        sections: [
          { id: "regulations", title: "Положения и приказы" },
          { id: "forms", title: "Формы учёта" },
          { id: "documents", title: "Образцы документов" },
        ],
      },
    ],
  },
  {
    id: "admin",
    title: "Администрирование",
    hasSubmodules: true,
    submodules: [
      { id: "users", title: "Учёт пользователей" },
      { id: "roles", title: "Роли и права" },
      { id: "audit-log", title: "История изменений" },
      { id: "kpi-audit", title: "Аудит KPI" },
      { id: "archive", title: "Архив ревизий" },
      { id: "backup", title: "Резервные копии" },
    ],
  },
  {
    id: "security-access",
    title: "Управление доступом",
    sections: [
      { id: "overview", title: "Обзор" },
      { id: "users", title: "Пользователи" },
      { id: "roles", title: "Роли" },
      { id: "permissions", title: "Права" },
      { id: "audit", title: "Аудит" },
      { id: "policies", title: "Политики" },
      { id: "monitoring", title: "Мониторинг" },
    ],
  },
  {
    id: "translation-management",
    title: "Управление переводами системы",
    sections: [
      { id: "overview", title: "Обзор" },
      { id: "translations", title: "Переводы" },
      { id: "modules", title: "Модули" },
      { id: "system-keys", title: "Системные ключи" },
      { id: "settings", title: "Настройки" },
    ],
  },
]

export function ModuleVisibilityDialog() {
  const [visibleModules, setVisibleModules] = useState<Set<string>>(new Set())
  const [visibleSubmodules, setVisibleSubmodules] = useState<Set<string>>(new Set())
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [expandedSubmodules, setExpandedSubmodules] = useState<Set<string>>(new Set())
  const [isOpen, setIsOpen] = useState(false)

  // Load saved settings from localStorage
  useEffect(() => {
    const savedModules = localStorage.getItem("visibleModules")
    const savedSubmodules = localStorage.getItem("visibleSubmodules")
    const savedSections = localStorage.getItem("visibleSections")

    if (savedModules) {
      setVisibleModules(new Set(JSON.parse(savedModules)))
    } else {
      setVisibleModules(new Set(modules.map((m) => m.id)))
    }

    if (savedSubmodules) {
      setVisibleSubmodules(new Set(JSON.parse(savedSubmodules)))
    } else {
      const allSubmodules = modules.flatMap((m) => m.submodules?.map((s) => s.id) || [])
      setVisibleSubmodules(new Set(allSubmodules))
    }

    if (savedSections) {
      setVisibleSections(new Set(JSON.parse(savedSections)))
    } else {
      const allSections = modules.flatMap(
        (m) => m.submodules?.flatMap((s) => s.sections?.map((sec) => sec.id) || []) || [],
      )
      setVisibleSections(new Set(allSections))
    }
  }, [])

  const handleToggleModule = (moduleId: string) => {
    const updated = new Set(visibleModules)
    if (updated.has(moduleId)) {
      updated.delete(moduleId)
    } else {
      updated.add(moduleId)
    }
    setVisibleModules(updated)
    localStorage.setItem("visibleModules", JSON.stringify(Array.from(updated)))
    window.dispatchEvent(
      new CustomEvent("moduleVisibilityChanged", {
        detail: { visible: updated, subvisible: visibleSubmodules, sections: visibleSections },
      }),
    )
  }

  const handleToggleSubmodule = (submoduleId: string) => {
    const updated = new Set(visibleSubmodules)
    if (updated.has(submoduleId)) {
      updated.delete(submoduleId)
    } else {
      updated.add(submoduleId)
    }
    setVisibleSubmodules(updated)
    localStorage.setItem("visibleSubmodules", JSON.stringify(Array.from(updated)))
    window.dispatchEvent(
      new CustomEvent("moduleVisibilityChanged", {
        detail: { visible: visibleModules, subvisible: updated, sections: visibleSections },
      }),
    )
  }

  const handleToggleSection = (sectionId: string) => {
    const updated = new Set(visibleSections)
    if (updated.has(sectionId)) {
      updated.delete(sectionId) // Remove from visible = add to hidden
    } else {
      updated.add(sectionId) // Add to visible = remove from hidden
    }
    setVisibleSections(updated)
    localStorage.setItem("visibleSections", JSON.stringify(Array.from(updated)))

    console.log("[v0] Раздел переключен:", sectionId, "видима:", updated.has(sectionId))

    window.dispatchEvent(
      new CustomEvent("moduleVisibilityChanged", {
        detail: { visible: visibleModules, subvisible: visibleSubmodules, sections: updated },
      }),
    )
  }

  const handleShowAll = () => {
    const allModules = new Set(modules.map((m) => m.id))
    const allSubmodules = new Set(modules.flatMap((m) => m.submodules?.map((s) => s.id) || []))
    const allSections = new Set(
      modules.flatMap((m) => m.submodules?.flatMap((s) => s.sections?.map((sec) => sec.id) || []) || []),
    )
    setVisibleModules(allModules)
    setVisibleSubmodules(allSubmodules)
    setVisibleSections(allSections)
    localStorage.setItem("visibleModules", JSON.stringify(Array.from(allModules)))
    localStorage.setItem("visibleSubmodules", JSON.stringify(Array.from(allSubmodules)))
    localStorage.setItem("visibleSections", JSON.stringify(Array.from(allSections)))
    window.dispatchEvent(
      new CustomEvent("moduleVisibilityChanged", {
        detail: { visible: allModules, subvisible: allSubmodules, sections: allSections },
      }),
    )
  }

  const handleHideAll = () => {
    const allSections = new Set(
      modules.flatMap(
        (m) => m.submodules?.flatMap((s) => s.sections?.map((sec) => sec.id) || []) || [],
        ...modules.flatMap((m) => m.sections?.map((s) => s.id) || []),
      ),
    )

    const empty = new Set<string>()
    setVisibleModules(empty)
    setVisibleSubmodules(empty)
    setVisibleSections(allSections) // Store ALL sections as "hidden"

    localStorage.setItem("visibleModules", JSON.stringify(Array.from(empty)))
    localStorage.setItem("visibleSubmodules", JSON.stringify(Array.from(empty)))
    localStorage.setItem("visibleSections", JSON.stringify(Array.from(allSections)))

    window.dispatchEvent(
      new CustomEvent("moduleVisibilityChanged", {
        detail: { visible: empty, subvisible: empty, sections: allSections },
      }),
    )
    console.log("[v0] Все разделы скрыты:", Array.from(allSections))
  }

  const toggleModuleExpand = (moduleId: string) => {
    const updated = new Set(expandedModules)
    if (updated.has(moduleId)) {
      updated.delete(moduleId)
    } else {
      updated.add(moduleId)
    }
    setExpandedModules(updated)
  }

  const toggleSubmoduleExpand = (submoduleId: string) => {
    const updated = new Set(expandedSubmodules)
    if (updated.has(submoduleId)) {
      updated.delete(submoduleId)
    } else {
      updated.add(submoduleId)
    }
    setExpandedSubmodules(updated)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-cyan-500/30 hover:text-white hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 rounded-lg text-white h-8 w-8"
          title="Управление видимостью модулей и разделов"
        >
          <ScrollText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-[hsl(207,50%,15%)] border-white/10 max-h-96 overflow-y-auto shadow-2xl shadow-cyan-900/20 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Eye className="h-4 w-4 text-cyan-400" />
            Видимость модулей и разделов
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button size="sm" className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" onClick={handleShowAll}>
            Показать все
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
            onClick={handleHideAll}
          >
            Скрыть все
          </Button>
        </div>

        <div className="space-y-2">
          {modules.map((module) => (
            <div key={module.id}>
              <div className="flex items-center gap-2 p-2 rounded hover:bg-white/5">
                <Checkbox
                  id={module.id}
                  checked={visibleModules.has(module.id)}
                  onCheckedChange={() => handleToggleModule(module.id)}
                  className="border-white/30"
                />
                <label htmlFor={module.id} className="flex-1 text-sm text-white cursor-pointer font-medium">
                  {module.title}
                </label>
                {module.hasSubmodules && (
                  <button
                    onClick={() => toggleModuleExpand(module.id)}
                    className="p-1 hover:bg-white/10 rounded transition-all"
                    title={expandedModules.has(module.id) ? "Свернуть" : "Развернуть"}
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform ${expandedModules.has(module.id) ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                )}
              </div>

              {module.hasSubmodules && expandedModules.has(module.id) && (
                <div className="ml-6 space-y-1 mt-1 border-l border-white/10 pl-2 py-1">
                  {module.submodules?.map((submodule) => (
                    <div key={submodule.id}>
                      <div className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5">
                        <Checkbox
                          id={submodule.id}
                          checked={visibleSubmodules.has(submodule.id)}
                          onCheckedChange={() => handleToggleSubmodule(submodule.id)}
                          className="border-white/30"
                        />
                        <label htmlFor={submodule.id} className="flex-1 text-xs text-zinc-200 cursor-pointer">
                          {submodule.title}
                        </label>
                        {submodule.sections && submodule.sections.length > 0 && (
                          <button
                            onClick={() => toggleSubmoduleExpand(submodule.id)}
                            className="p-0.5 hover:bg-white/10 rounded transition-all"
                            title={expandedSubmodules.has(submodule.id) ? "Свернуть" : "Развернуть"}
                          >
                            <ChevronDown
                              className={`h-3 w-3 text-zinc-500 transition-transform ${expandedSubmodules.has(submodule.id) ? "rotate-180" : ""
                                }`}
                            />
                          </button>
                        )}
                      </div>

                      {submodule.sections && expandedSubmodules.has(submodule.id) && (
                        <div className="ml-6 space-y-0.5 mt-0.5 border-l border-white/5 pl-2 py-0.5">
                          {submodule.sections.map((section) => (
                            <div key={section.id} className="flex items-center gap-2 p-1 rounded hover:bg-white/5">
                              <Checkbox
                                id={section.id}
                                checked={visibleSections.has(section.id)}
                                onCheckedChange={() => handleToggleSection(section.id)}
                                className="border-white/30"
                              />
                              <label htmlFor={section.id} className="flex-1 text-xs text-zinc-300 cursor-pointer">
                                {section.title}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
