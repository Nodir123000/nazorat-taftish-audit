export default function CausesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Основные причины нарушений</h1>
          <p className="text-muted-foreground mt-1">Main Causes of Violations</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Распределение по причинам</h2>

        <div className="space-y-4">
          {[
            { cause: "Недостаточный контроль со стороны командования", count: 89, percent: 36 },
            { cause: "Низкая квалификация материально-ответственных лиц", count: 67, percent: 27 },
            { cause: "Нарушение порядка учёта и отчётности", count: 45, percent: 18 },
            { cause: "Несоблюдение норм хранения", count: 28, percent: 11 },
            { cause: "Халатность и небрежность", count: 18, percent: 8 },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.cause}</span>
                <span className="text-sm text-muted-foreground">
                  {item.count} случаев ({item.percent}%)
                </span>
              </div>
              <div className="bg-muted rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Детальный анализ причин</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Причина</th>
                <th className="text-left p-3 font-semibold">Служба</th>
                <th className="text-left p-3 font-semibold">Частота</th>
                <th className="text-left p-3 font-semibold">Средняя сумма</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cause: "Недостаточный контроль", service: "Продовольственная", freq: "Высокая", avg: 45000 },
                { cause: "Низкая квалификация", service: "Вещевая", freq: "Средняя", avg: 38000 },
                { cause: "Нарушение учёта", service: "КЭС", freq: "Средняя", avg: 52000 },
                { cause: "Несоблюдение норм", service: "ГСМ", freq: "Низкая", avg: 67000 },
              ].map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">{item.cause}</td>
                  <td className="p-3">{item.service}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.freq === "Высокая"
                          ? "bg-red-100 text-red-800"
                          : item.freq === "Средняя"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.freq}
                    </span>
                  </td>
                  <td className="p-3 font-mono">₽ {item.avg.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
