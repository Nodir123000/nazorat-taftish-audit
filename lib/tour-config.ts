export interface TourStep {
  target: string // CSS selector or element ID
  title: string
  content: string
  placement?: "top" | "bottom" | "left" | "right" | "center"
  disableBeacon?: boolean
  spotlightClicks?: boolean
  route?: string // Optional route to navigate to when this step becomes active
  expandParent?: string // Optional parent module to expand (for submodules)
}

export interface TourModule {
  id: string
  name: string
  description: string
  steps: TourStep[]
  category?: string
}

// Main welcome tour for first-time users
export const welcomeTourSteps: TourStep[] = [
  {
    target: "body",
    title: "Добро пожаловать в АИС КРР!",
    content:
      "Автоматизированная информационная система контрольно-ревизионной работы Министерства обороны. Давайте познакомимся с основными возможностями системы.",
    placement: "center",
    disableBeacon: true,
    route: "/dashboard",
  },
  {
    target: '[data-tour="sidebar"]',
    title: "Навигация",
    content: "Здесь расположено главное меню системы. Все модули организованы по категориям для удобного доступа.",
    placement: "right",
  },
  {
    target: '[data-tour="visualization"]',
    title: "Визуализация системы",
    content: "Раздел для визуального представления структуры и архитектуры системы АИС КРР.",
    placement: "right",
    route: "/visualization/system-map",
  },
  {
    target: '[data-tour="planning"]',
    title: "Планирование",
    content:
      "Модуль планирования позволяет создавать годовые, квартальные и месячные планы проверок, управлять составом комиссий и уведомлениями.",
    placement: "right",
    route: "/planning/annual",
  },

  {
    target: '[data-tour="violations"]',
    title: "Нарушения",
    content: "Модуль для учета всех видов нарушений: недостачи, хищения, незаконные расходы и контроль их взыскания.",
    placement: "right",
    route: "/violations/financial",
  },
  {
    target: '[data-tour="decisions"]',
    title: "Решения",
    content: "Управление решениями по результатам проверок, контроль исполнения, сроков и обратная связь.",
    placement: "right",
    route: "/decisions/registry",
  },
  {
    target: '[data-tour="reports"]',
    title: "Отчеты",
    content: "Формирование различных отчетов: финансовые нарушения, динамика, аналитика и пояснительные записки.",
    placement: "right",
    route: "/reports/generation",
  },
  {
    target: '[data-tour="reference"]',
    title: "Справочники",
    content: "Справочная информация: воинские части, звания, имущество, нормативная база и образцы документов.",
    placement: "right",
    route: "/reference/database",
  },
]

export const tourModules: TourModule[] = [
  // Dashboard
  {
    id: "dashboard",
    name: "Главная",
    description: "Главная страница системы",
    category: "Основное",
    steps: [
      {
        target: "body",
        title: "Главная страница",
        content: "Главная страница системы АИС КРР с основной информацией и быстрыми ссылками на ключевые функции.",
        placement: "center",
        route: "/dashboard",
      },
    ],
  },

  // Визуализация системы
  {
    id: "visualization",
    name: "Визуализация системы",
    description: "Карта системы, древовидная структура и архитектура",
    category: "Визуализация",
    steps: [
      {
        target: '[data-tour="visualization"]',
        title: "Визуализация системы",
        content: "Раздел для визуального представления структуры и архитектуры системы АИС КРР.",
        placement: "right",
        route: "/visualization/system-map",
      },
      {
        target: '[data-tour="system-map"]',
        title: "Карта системы",
        content: "Интерактивная карта, показывающая все компоненты и связи в системе АИС КРР.",
        placement: "right",
        route: "/visualization/system-map",
        expandParent: "visualization",
      },
      {
        target: '[data-tour="tree-view"]',
        title: "Древовидная структура",
        content: "Иерархическое представление всех модулей и подмодулей системы в виде дерева.",
        placement: "right",
        route: "/visualization/tree-view",
        expandParent: "visualization",
      },
      {
        target: '[data-tour="architecture"]',
        title: "Архитектура",
        content: "Диаграмма архитектуры системы, показывающая взаимодействие между компонентами.",
        placement: "right",
        route: "/visualization/architecture",
        expandParent: "visualization",
      },
    ],
  },

  // Планирование КРР
  {
    id: "planning",
    name: "Планирование КРР",
    description: "Годовое, квартальное и месячное планирование",
    category: "Планирование",
    steps: [
      {
        target: '[data-tour="planning"]',
        title: "Планирование КРР",
        content: "Модуль для создания и управления планами контрольно-ревизионной работы на разные периоды.",
        placement: "right",
        route: "/planning",
      },
      {
        target: '[data-tour="annual-plan"]',
        title: "Годовое планирование",
        content: "Создайте годовой план КРР с указанием объектов проверки, сроков и ответственных лиц.",
        placement: "right",
        route: "/planning/annual",
        expandParent: "planning",
      },
      {
        target: '[data-tour="orders"]',
        title: "Приказы и назначения",
        content: "Управление приказами о проведении проверок и назначением ответственных лиц.",
        placement: "right",
        route: "/planning/orders",
        expandParent: "planning",
      },
    ],
  },



  // Учёт нарушений
  {
    id: "violations",
    name: "Учёт нарушений",
    description: "Финансовые нарушения, недостачи и взыскания",
    category: "Нарушения",
    steps: [
      {
        target: '[data-tour="violations"]',
        title: "Учёт нарушений",
        content: "Комплексный модуль для учета всех типов нарушений и контроля их устранения.",
        placement: "right",
        route: "/violations",
      },
      {
        target: '[data-tour="financial-violations"]',
        title: "Финансовые нарушения",
        content: "Реестр всех финансовых нарушений с суммами, статьями и ответственными лицами.",
        placement: "right",
        route: "/violations/financial",
        expandParent: "violations",
      },
      {
        target: '[data-tour="assets"]',
        title: "Недостачи имущества",
        content: "Учет недостач и хищений имущества с указанием стоимости и ответственных лиц.",
        placement: "right",
        route: "/violations/assets",
        expandParent: "violations",
      },
      {
        target: '[data-tour="recoveries"]',
        title: "Денежные взыскания",
        content: "Контроль взыскания денежных средств по выявленным нарушениям.",
        placement: "right",
        route: "/violations/recoveries",
        expandParent: "violations",
      },
    ],
  },

  // Контроль решений
  {
    id: "decisions",
    name: "Контроль решений",
    description: "Реестр решений, контроль исполнения и обратная связь",
    category: "Решения",
    steps: [
      {
        target: '[data-tour="decisions"]',
        title: "Контроль решений",
        content: "Модуль для управления решениями по результатам проверок и контроля их исполнения.",
        placement: "right",
        route: "/decisions",
      },
      {
        target: '[data-tour="registry"]',
        title: "Реестр решений",
        content: "Полный реестр всех решений, принятых по результатам проверок.",
        placement: "right",
        route: "/decisions/registry",
        expandParent: "decisions",
      },
      {
        target: '[data-tour="execution"]',
        title: "Контроль исполнения",
        content: "Отслеживание исполнения решений и контроль сроков выполнения.",
        placement: "right",
        route: "/decisions/execution",
        expandParent: "decisions",
      },
      {
        target: '[data-tour="feedback"]',
        title: "Обратная связь",
        content: "Получение информации об исполнении решений от проверяемых объектов.",
        placement: "right",
        route: "/decisions/feedback",
        expandParent: "decisions",
      },
    ],
  },

  // Отчётность
  {
    id: "reports",
    name: "Отчётность",
    description: "Формирование отчётов, аналитика и своды",
    category: "Отчеты",
    steps: [
      {
        target: '[data-tour="reports"]',
        title: "Отчётность",
        content: "Модуль для формирования различных видов отчетов и аналитических материалов.",
        placement: "right",
        route: "/reports",
      },
      {
        target: '[data-tour="report-generation"]',
        title: "Формирование отчётов",
        content: "Создание отчетов по заданным параметрам: период, тип нарушений, объекты проверки.",
        placement: "right",
        route: "/reports/generation",
        expandParent: "reports",
      },
      {
        target: '[data-tour="explanatory"]',
        title: "Пояснительная записка",
        content: "Подготовка пояснительных записок к отчетам с анализом результатов проверок.",
        placement: "right",
        route: "/reports/explanatory",
        expandParent: "reports",
      },
      {
        target: '[data-tour="analytics"]',
        title: "Аналитика и своды",
        content: "Аналитические материалы, графики и диаграммы для принятия управленческих решений.",
        placement: "right",
        route: "/reports/analytics",
        expandParent: "reports",
      },
    ],
  },

  // Справочники
  {
    id: "reference",
    name: "Справочники",
    description: "Справочная и нормативная база данных",
    category: "Справочники",
    steps: [
      {
        target: '[data-tour="reference"]',
        title: "Справочники",
        content: "Справочная информация и нормативная база для работы в системе.",
        placement: "right",
        route: "/reference",
      },
      {
        target: '[data-tour="database"]',
        title: "Справочная база",
        content: "Справочная информация: воинские части, звания, имущество и другие справочные данные.",
        placement: "right",
        route: "/reference/database",
        expandParent: "reference",
      },
      {
        target: '[data-tour="regulatory"]',
        title: "Нормативная база",
        content: "Нормативные документы, приказы и инструкции для проведения контрольно-ревизионной работы.",
        placement: "right",
        route: "/reference/regulatory",
        expandParent: "reference",
      },
    ],
  },
]
