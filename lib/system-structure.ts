// System structure data for visualizations

export interface SystemModule {
  id: string
  title: string
  description: string
  icon: string
  color: string
  href: string
  submodules?: SystemSubmodule[]
  sections?: SystemSection[]
  connections?: string[] // IDs of connected modules
  status?: "active" | "development" | "planned"
  usage?: number // percentage
}

export interface SystemSubmodule {
  id: string
  title: string
  href: string
  sections?: SystemSection[]
  description?: string
}

export interface SystemSection {
  id: string
  title: string
  href: string
  description?: string
}

export const systemModules: SystemModule[] = [
  {
    id: "home",
    title: "Главная",
    description: "Дашборд и обзор системы",
    icon: "Home",
    color: "hsl(var(--primary))",
    href: "/dashboard",
    status: "active",
    usage: 95,
    connections: ["planning", "execution", "violations", "decisions", "reports"],
  },
  {
    id: "planning",
    title: "Планирование КРР",
    description: "Годовое, квартальное и месячное планирование ревизий",
    icon: "Calendar",
    color: "hsl(221, 83%, 53%)",
    href: "/planning",
    status: "active",
    usage: 87,
    connections: ["execution", "reports"],
    submodules: [
      {
        id: "planning-annual",
        title: "Годовое планирование",
        href: "/planning/annual",
        description: "Формирование годовых планов КРР",
      },
      {
        id: "planning-orders",
        title: "Приказы и назначения",
        href: "/planning/orders",
        description: "Оформление приказов на проведение ревизий",
      },
    ],
  },
  {
    id: "execution",
    title: "Проведение ревизии",
    description: "Оперативный модуль проведения проверок",
    icon: "Clipboard",
    color: "hsl(142, 71%, 45%)",
    href: "/audits",
    status: "active",
    usage: 92,
    connections: ["planning", "violations", "reports"],
    submodules: [
      {
        id: "execution-preparation",
        title: "Подготовка к проверке",
        href: "/audits/preparation",
        description: "Подготовительные мероприятия",
      },
      {
        id: "execution-financial",
        title: "Проверка ФХД",
        href: "/audits/financial-activity",
        description: "Проверка финансово-хозяйственной деятельности",
      },
      {
        id: "execution-violations",
        title: "Фиксация нарушений",
        href: "/audits/violations-recording",
        description: "Документирование выявленных нарушений",
      },
    ],
  },
  {
    id: "violations",
    title: "Учёт нарушений",
    description: "Регистрация и учёт нарушений и утрат",
    icon: "Alert",
    color: "hsl(0, 84%, 60%)",
    href: "/violations",
    status: "active",
    usage: 78,
    connections: ["execution", "decisions", "reports"],
    submodules: [
      {
        id: "violations-financial",
        title: "Финансовые нарушения",
        href: "/violations/financial",
        description: "Учёт финансовых нарушений",
      },
      {
        id: "violations-assets",
        title: "Недостачи имущества",
        href: "/violations/assets",
        description: "Учёт недостач и утрат имущества",
      },
      {
        id: "violations-recoveries",
        title: "Денежные взыскания",
        href: "/violations/recoveries",
        description: "Учёт взысканий и возмещений",
      },
    ],
  },
  {
    id: "decisions",
    title: "Контроль решений",
    description: "Реализация и контроль исполнения решений",
    icon: "Check",
    color: "hsl(262, 83%, 58%)",
    href: "/decisions",
    status: "active",
    usage: 85,
    connections: ["violations", "reports"],
    submodules: [
      {
        id: "decisions-registry",
        title: "Реестр решений",
        href: "/decisions/registry",
        description: "Регистрация принятых решений",
      },
      {
        id: "decisions-execution",
        title: "Контроль исполнения",
        href: "/decisions/execution",
        description: "Мониторинг выполнения решений",
      },
      {
        id: "decisions-feedback",
        title: "Обратная связь",
        href: "/decisions/feedback",
        description: "Получение информации об исполнении",
      },
    ],
  },
  {
    id: "reports",
    title: "Отчётность",
    description: "Формирование отчётов и аналитика",
    icon: "Chart",
    color: "hsl(173, 58%, 39%)",
    href: "/reports",
    status: "active",
    usage: 90,
    connections: ["planning", "execution", "violations", "decisions"],
    submodules: [
      {
        id: "reports-generation",
        title: "Формирование отчётов",
        href: "/reports/generation",
        description: "Создание отчётных документов",
      },
      {
        id: "reports-explanatory",
        title: "Пояснительная записка",
        href: "/reports/explanatory",
        description: "Подготовка пояснительных записок",
      },
      {
        id: "reports-analytics",
        title: "Аналитика и своды",
        href: "/reports/analytics",
        description: "Аналитические отчёты и сводки",
      },
    ],
  },
  {
    id: "reference",
    title: "Справочники",
    description: "Справочная и нормативная база",
    icon: "Book",
    color: "hsl(24, 95%, 53%)",
    href: "/reference",
    status: "active",
    usage: 65,
    connections: ["execution", "violations"],
    submodules: [
      {
        id: "reference-database",
        title: "Справочная база",
        href: "/reference/database",
        description: "Справочники и классификаторы",
      },
      {
        id: "reference-regulatory",
        title: "Нормативная база",
        href: "/reference/regulatory",
        description: "Нормативные документы",
      },
    ],
  },
  {
    id: "admin",
    title: "Администрирование",
    description: "Управление пользователями и безопасность",
    icon: "Settings",
    color: "hsl(215, 20%, 65%)",
    href: "/admin",
    status: "active",
    usage: 45,
    connections: [],
    submodules: [
      {
        id: "admin-users",
        title: "Пользователи и роли",
        href: "/admin/users",
        description: "Управление пользователями",
        sections: [
          { id: "admin-users-list", title: "Учёт пользователей", href: "/admin/users" },
          { id: "admin-roles", title: "Роли и права", href: "/admin/roles" },
        ],
      },
      {
        id: "admin-audit",
        title: "Журнал аудита",
        href: "/admin/audit-log",
        description: "История изменений в системе",
        sections: [{ id: "admin-audit-log", title: "История изменений", href: "/admin/audit-log" }],
      },
      {
        id: "admin-archive",
        title: "Архив и резерв",
        href: "/admin/archive",
        description: "Архивирование и резервное копирование",
        sections: [
          { id: "admin-archive-list", title: "Архив ревизий", href: "/admin/archive" },
          { id: "admin-backup", title: "Резервные копии", href: "/admin/backup" },
        ],
      },
    ],
  },
  {
    id: "services",
    title: "Интерактивные сервисы",
    description: "Уведомления и мониторинг",
    icon: "Bell",
    color: "hsl(280, 65%, 60%)",
    href: "/services",
    status: "active",
    usage: 72,
    connections: ["planning", "execution", "decisions"],
    submodules: [
      {
        id: "services-notifications",
        title: "Уведомления",
        href: "/services/notifications",
        description: "Система уведомлений",
        sections: [
          { id: "services-notifications-list", title: "Сроки ревизий", href: "/services/notifications" },
          { id: "services-reminders", title: "Просроченные взыскания", href: "/services/reminders" },
        ],
      },
      {
        id: "services-monitoring",
        title: "Мониторинг КРР",
        href: "/services/map",
        description: "Визуальный мониторинг",
        sections: [
          { id: "services-map", title: "Карта проверок", href: "/services/map" },
          { id: "services-indicators", title: "Индикаторы состояния", href: "/services/indicators" },
          { id: "services-rating", title: "Рейтинг дисциплины", href: "/services/rating" },
        ],
      },
    ],
  },
  {
    id: "integration",
    title: "Интеграция",
    description: "Взаимодействие с системами МО",
    icon: "Network",
    color: "hsl(199, 89%, 48%)",
    href: "/integration",
    status: "active",
    usage: 58,
    connections: ["planning", "execution", "reports"],
    submodules: [
      {
        id: "integration-mo",
        title: "Взаимодействие с МО",
        href: "/integration/personnel",
        description: "Интеграция с системами МО",
        sections: [
          { id: "integration-personnel", title: "Кадровая интеграция", href: "/integration/personnel" },
          { id: "integration-finance", title: "Финансовые системы", href: "/integration/finance" },
        ],
      },
      {
        id: "integration-export",
        title: "Экспорт и отчётность",
        href: "/integration/export",
        description: "Экспорт данных",
        sections: [
          { id: "integration-export-reports", title: "Экспорт отчётов", href: "/integration/export" },
          { id: "integration-docs", title: "Документооборот", href: "/integration/docs" },
        ],
      },
    ],
  },
]

export function getModuleById(id: string): SystemModule | undefined {
  return systemModules.find((m) => m.id === id)
}

export function getModuleConnections(moduleId: string): SystemModule[] {
  const module = getModuleById(moduleId)
  if (!module || !module.connections) return []
  return module.connections.map((id) => getModuleById(id)).filter(Boolean) as SystemModule[]
}

export function getTotalSubmodules(module: SystemModule): number {
  return module.submodules?.length || 0
}

export function getTotalSections(module: SystemModule): number {
  if (!module.submodules) return 0
  return module.submodules.reduce((total, sub) => total + (sub.sections?.length || 0), 0)
}
