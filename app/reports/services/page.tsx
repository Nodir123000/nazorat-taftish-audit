export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Свод по службам</h1>
          <p className="text-muted-foreground mt-1">Summary by Services</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Экспорт отчёта
        </button>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Нарушения по службам</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Служба</th>
                <th className="text-left p-3 font-semibold">Проверок</th>
                <th className="text-left p-3 font-semibold">Нарушений</th>
                <th className="text-left p-3 font-semibold">Сумма</th>
                <th className="text-left p-3 font-semibold">Средняя</th>
                <th className="text-left p-3 font-semibold">Рейтинг</th>
              </tr>
            </thead>
            <tbody>
              {[
                { service: "Продовольственная", checks: 45, violations: 89, amount: 3200000, rating: "Средний" },
                { service: "Вещевая", checks: 42, violations: 67, amount: 2800000, rating: "Хороший" },
                {
                  service: "Квартирно-эксплуатационная",
                  checks: 38,
                  violations: 54,
                  amount: 1900000,
                  rating: "Хороший",
                },
                {
                  service: "Горюче-смазочных материалов",
                  checks: 31,
                  violations: 37,
                  amount: 1500000,
                  rating: "Отличный",
                },
              ].map((item, idx) => {
                const avg = item.amount / item.violations
                return (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-semibold">{item.service}</td>
                    <td className="p-3">{item.checks}</td>
                    <td className="p-3">{item.violations}</td>
                    <td className="p-3 font-mono">₽ {(item.amount / 1000000).toFixed(1)}М</td>
                    <td className="p-3 font-mono text-sm">₽ {Math.round(avg / 1000)}К</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.rating === "Отличный"
                            ? "bg-green-100 text-green-800"
                            : item.rating === "Хороший"
                              ? "bg-blue-100 text-blue-800"
                              : item.rating === "Средний"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.rating}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Топ нарушений по службам</h2>

        <div className="space-y-4">
          {[
            { service: "Продовольственная", top: "Нарушение норм хранения", count: 34 },
            { service: "Вещевая", top: "Недостачи имущества", count: 28 },
            { service: "КЭС", top: "Нарушение учёта", count: 22 },
            { service: "ГСМ", top: "Превышение норм расхода", count: 18 },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">{item.service}</span>
                <span className="text-sm text-muted-foreground">{item.count} случаев</span>
              </div>
              <div className="text-sm">{item.top}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
