export default function RecoveriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Возмещение ущерба</h1>
          <p className="text-muted-foreground mt-1">Damage Recovery Report</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Экспорт отчёта
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Всего к возмещению</div>
          <div className="text-3xl font-bold">₽ 21.1М</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Возмещено</div>
          <div className="text-3xl font-bold text-green-600">₽ 15.0М</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Остаток</div>
          <div className="text-3xl font-bold text-orange-600">₽ 6.1М</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Процент возмещения</div>
          <div className="text-3xl font-bold text-blue-600">71%</div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Возмещение по периодам</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Период</th>
                <th className="text-left p-3 font-semibold">Сумма взыскания</th>
                <th className="text-left p-3 font-semibold">Возмещено</th>
                <th className="text-left p-3 font-semibold">Остаток</th>
                <th className="text-left p-3 font-semibold">Процент</th>
              </tr>
            </thead>
            <tbody>
              {[
                { period: "2025 Q1", total: 5200000, recovered: 4100000, balance: 1100000 },
                { period: "2024 Q4", total: 6800000, recovered: 5300000, balance: 1500000 },
                { period: "2024 Q3", total: 4500000, recovered: 3200000, balance: 1300000 },
                { period: "2024 Q2", total: 4600000, recovered: 2400000, balance: 2200000 },
              ].map((item, idx) => {
                const percent = Math.round((item.recovered / item.total) * 100)
                return (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-semibold">{item.period}</td>
                    <td className="p-3 font-mono">₽ {(item.total / 1000000).toFixed(1)}М</td>
                    <td className="p-3 font-mono text-green-600">₽ {(item.recovered / 1000000).toFixed(1)}М</td>
                    <td className="p-3 font-mono text-orange-600">₽ {(item.balance / 1000000).toFixed(1)}М</td>
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
