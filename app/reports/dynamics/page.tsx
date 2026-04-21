export default function DynamicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Анализ динамики нарушений</h1>
          <p className="text-muted-foreground mt-1">Violations Dynamics Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Текущий год</div>
          <div className="text-3xl font-bold">247</div>
          <div className="text-sm text-green-600 mt-1">↓ -12% к прошлому году</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Прошлый год</div>
          <div className="text-3xl font-bold">281</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Средняя сумма</div>
          <div className="text-3xl font-bold">₽ 34К</div>
          <div className="text-sm text-red-600 mt-1">↑ +8% к прошлому году</div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Динамика по кварталам</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Период</th>
                <th className="text-left p-3 font-semibold">Количество</th>
                <th className="text-left p-3 font-semibold">Сумма</th>
                <th className="text-left p-3 font-semibold">Изменение</th>
                <th className="text-left p-3 font-semibold">Вывод</th>
              </tr>
            </thead>
            <tbody>
              {[
                { period: "2025 Q1", count: 58, amount: 1950000, change: -8, conclusion: "Снижение нарушений" },
                { period: "2024 Q4", count: 63, amount: 2100000, change: -5, conclusion: "Положительная динамика" },
                { period: "2024 Q3", count: 66, amount: 2350000, change: +3, conclusion: "Рост нарушений" },
                { period: "2024 Q2", count: 64, amount: 2200000, change: -2, conclusion: "Стабилизация" },
              ].map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-semibold">{item.period}</td>
                  <td className="p-3">{item.count}</td>
                  <td className="p-3 font-mono">₽ {(item.amount / 1000000).toFixed(2)}М</td>
                  <td className="p-3">
                    <span className={`font-semibold ${item.change < 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.change > 0 ? "↑" : "↓"} {Math.abs(item.change)}%
                    </span>
                  </td>
                  <td className="p-3">{item.conclusion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Основные тренды</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>Снижение количества финансовых нарушений на 12% по сравнению с прошлым годом</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-600 font-bold">✗</span>
            <span>Увеличение средней суммы нарушения на 8%, что требует усиления контроля</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>Улучшение показателей возмещения ущерба с 65% до 71%</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-600 font-bold">!</span>
            <span>Рост нарушений в продовольственной службе требует дополнительного внимания</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
