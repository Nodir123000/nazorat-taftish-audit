export default function FinancialViolationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Финансовые нарушения</h1>
          <p className="text-muted-foreground mt-1">Financial Violations Report</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Экспорт отчёта
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Всего нарушений</div>
          <div className="text-3xl font-bold">247</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Общая сумма</div>
          <div className="text-3xl font-bold text-red-600">UZS 8.4М</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Возмещено</div>
          <div className="text-3xl font-bold text-green-600">UZS 6.1М</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Остаток</div>
          <div className="text-3xl font-bold text-orange-600">UZS 2.3М</div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Нарушения по типам</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Тип нарушения</th>
                <th className="text-left p-3 font-semibold">Количество</th>
                <th className="text-left p-3 font-semibold">Сумма</th>
                <th className="text-left p-3 font-semibold">Возмещено</th>
                <th className="text-left p-3 font-semibold">Процент</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: "Недостачи денежных средств", count: 45, amount: 2450000, recovered: 1890000 },
                { type: "Растраты и хищения", count: 12, amount: 3200000, recovered: 2100000 },
                { type: "Незаконные расходы", count: 89, amount: 1850000, recovered: 1650000 },
                { type: "Переплаты", count: 101, amount: 900000, recovered: 460000 },
              ].map((item, idx) => {
                const percent = Math.round((item.recovered / item.amount) * 100)
                return (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3">{item.type}</td>
                    <td className="p-3 font-semibold">{item.count}</td>
                    <td className="p-3 font-mono">UZS {(item.amount / 1000000).toFixed(2)}М</td>
                    <td className="p-3 font-mono text-green-600">UZS {(item.recovered / 1000000).toFixed(2)}М</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2 max-w-[100px]">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-sm font-medium">{percent}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
