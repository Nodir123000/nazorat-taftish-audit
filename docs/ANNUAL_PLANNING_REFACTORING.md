# Annual Planning Module Refactoring

## 📁 Новая архитектура

### До рефакторинга
```
components/planning/
└── annual-plan-page.tsx (2762 строки - монолит)
```

### После рефакторинга
```
components/planning/
├── annual-plan-page.tsx (7 строк - обёртка)
└── annual-plans/
    ├── AnnualPlanPage.tsx (200 строк - главный контейнер)
    ├── hooks/
    │   └── useAnnualPlans.ts (148 строк - вся бизнес-логика)
    └── components/
        ├── StatsCard.tsx (70 строк)
        ├── StatsGrid.tsx (59 строк)
        ├── FilterPanel.tsx (249 строк)
        ├── ApprovedPlansTable.tsx (200 строк)
        ├── ViewPlanDialog.tsx (120 строк)
        ├── CreatePlanDialog.tsx (280 строк)
        └── ApprovedPlanDialog.tsx (300 строк)

lib/utils/
└── localization.ts (147 строк - утилиты локализации)
```

## ✅ Преимущества

### 1. **Разделение ответственности (SRP)**
- **Логика**: `useAnnualPlans` hook
- **UI**: Маленькие презентационные компоненты
- **Утилиты**: `localization.ts`

### 2. **Тестируемость**
- Хук можно тестировать отдельно от UI
- Компоненты — чистые, легко snapshot-тестировать
- Утилиты — pure functions

### 3. **Переиспользование**
```tsx
// Можно использовать в других модулях
import { StatsCard } from '@/components/planning/annual-plans/components/StatsCard'
import { FilterPanel } from '@/components/planning/annual-plans/components/FilterPanel'
import { getLocalizedAuthorityName } from '@/lib/utils/localization'
```

### 4. **Производительность**
- `useMemo` для вычисляемых значений
- `useCallback` для стабильных функций
- Готово к добавлению дебаунса

### 5. **Поддерживаемость**
- Легко найти нужный код
- Изменения изолированы
- Понятная структура

## 🔧 Технические детали

### Custom Hook: `useAnnualPlans`
```typescript
export function useAnnualPlans({ initialPlans, locale }) {
  // State management
  const [plans, setPlans] = useState(initialPlans)
  const [filters, setFilters] = useState({ ... })
  
  // Data fetching
  useEffect(() => {
    loadMilitaryPersonnel().then(setMilitaryPersonnel)
    loadSupplyDepartments().then(setSupplyDepartments)
  }, [])
  
  // CRUD operations
  const handleCreatePlan = useCallback(async (data) => { ... }, [])
  const handleUpdatePlan = useCallback(async (id, data) => { ... }, [])
  const handleDeletePlan = useCallback(async (id) => { ... }, [])
  
  return {
    plans,
    filters,
    setFilters,
    handleCreatePlan,
    handleUpdatePlan,
    handleDeletePlan,
    // ... другие данные и методы
  }
}
```

### Компоненты
Все компоненты — **презентационные** (получают данные через props):

```tsx
<ApprovedPlansTable 
  plans={paginatedPlans}
  locale={locale}
  supplyDepartments={supplyDepartments}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Локализация
Вынесена в отдельный модуль:
```typescript
export const getLocalizedAuthorityName = (
  code: string, 
  locale: Locale, 
  supplyDepartments: any[] = [], 
  mode: 'short' | 'full' = 'full'
) => { ... }
```

## 🔗 Интеграция с БД

### Prisma Schema
```prisma
model RefSupplyDepartment {
  id        Int       @id @default(autoincrement())
  code      String    @unique @db.VarChar(50)
  name      Json
  shortName Json?     @map("short_name")
  status    String?   @default("active") @db.VarChar(20)
  createdAt DateTime? @default(now()) @map("created_at")

  @@map("ref_supply_departments")
}
```

### API Endpoints
- `GET /api/supply-departments` - Получение списка департаментов
- `POST /api/annual-plans` - Создание плана
- `PUT /api/annual-plans/:id` - Обновление плана
- `DELETE /api/annual-plans/:id` - Удаление плана

## 📝 Следующие шаги (опционально)

### 1. Дебаунс поиска
```typescript
const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }, 300),
  []
)
```

### 2. Server-side пагинация
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['annual-plans', filters, currentPage],
  queryFn: () => fetchPlans({ ...filters, page: currentPage })
})
```

### 3. React Query для кеширования
```typescript
const { data: plans, refetch } = useQuery({
  queryKey: ['annual-plans'],
  queryFn: fetchAnnualPlans,
  staleTime: 5 * 60 * 1000 // 5 минут
})
```

### 4. Unit тесты
```typescript
describe('useAnnualPlans', () => {
  it('should filter plans by search query', () => {
    const { result } = renderHook(() => useAnnualPlans({ ... }))
    act(() => {
      result.current.setFilters({ search: 'test' })
    })
    expect(result.current.filteredPlans).toHaveLength(1)
  })
})
```

## 🐛 Известные проблемы

### TypeScript IDE Cache
После `npx prisma generate` IDE может не подхватить новые типы.

**Решение**: См. [PRISMA_TS_CACHE.md](./PRISMA_TS_CACHE.md)

## 📊 Метрики

| Метрика | До | После |
|---------|-----|-------|
| Размер главного файла | 2762 строк | 200 строк |
| Количество файлов | 1 | 10 |
| Средний размер компонента | 2762 строк | ~150 строк |
| Тестируемость | ❌ | ✅ |
| Переиспользование | ❌ | ✅ |

## 🎯 Результат

✅ **Код стал модульным и поддерживаемым**
✅ **Легко добавлять новые фичи**
✅ **Готов к тестированию**
✅ **Соответствует best practices**
