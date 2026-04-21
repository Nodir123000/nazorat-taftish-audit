export default function PeriodsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Свод по периодам</h1>
          <p className="text-muted-foreground mt-1">Summary by Periods</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Экспорт отчёта
        </button>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Годовой свод</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Год</th>
                <th className="text-left p-3 font-semibold">Ревизий</th>
                <th className="text-left p-3 font-semibold">Нарушений</th>
                <th className="text-left p-3 font-semibold">Сумма</th>
                <th className="text-left p-3 font-semibold">Возмещено</th>
                <th className="text-left p-3 font-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {[
                { year: 2025, audits: 45, violations: 247, amount: 8400000, recovered: 6100000 },
                { year: 2024, audits: 156, violations: 891, amount: 28900000, recovered: 21200000 },
                { year: 2023, audits: 148, violations: 934, amount: 31200000, recovered: 19800000 },
              ].map((item) => {
                const percent = Math.round((item.recovered / item.amount) * 100)
                return (
                  <tr key={item.year} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-bold">{item.year}</td>
                    <td className="p-3">{item.audits}</td>
                    <td className="p-3">{item.violations}</td>
                    <td className="p-3 font-mono">₽ {(item.amount / 1000000).toFixed(1)}М</td>
                    <td className="p-3 font-mono text-green-600">₽ {(item.recovered / 1000000).toFixed(1)}М</td>
                    <td className="p-3 font-semibold">{percent}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Квартальный свод (2025)</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Квартал</th>
                <th className="text-left p-3 font-semibold">Ревизий</th>
                <th className="text-left p-3 font-semibold">Нарушений</th>
                <th className="text-left p-3 font-semibold">Сумма</th>
                <th className="text-left p-3 font-semibold">Возмещено</th>
              </tr>
            </thead>
            <tbody>
              {[
                { quarter: "Q1 2025", audits: 45, violations: 247, amount: 8400000, recovered: 6100000 },
                { quarter: "Q4 2024", audits: 42, violations: 234, amount: 7800000, recovered: 5600000 },
                { quarter: "Q3 2024", audits: 38, violations: 218, amount: 7200000, recovered: 5100000 },
                { quarter: "Q2 2024", audits: 36, violations: 201, amount: 6900000, recovered: 4800000 },
              ].map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-semibold">{item.quarter}</td>
                  <td className="p-3">{item.audits}</td>
                  <td className="p-3">{item.violations}</td>
                  <td className="p-3 font-mono">₽ {(item.amount / 1000000).toFixed(1)}М</td>
                  <td className="p-3 font-mono text-green-600">₽ {(item.recovered / 1000000).toFixed(1)}М</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
