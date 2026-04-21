export default function LossesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Утраты материальных ценностей</h1>
          <p className="text-muted-foreground mt-1">Material Losses Report</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Экспорт отчёта
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Всего утрат</div>
          <div className="text-3xl font-bold">89</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Общая сумма</div>
          <div className="text-3xl font-bold text-red-600">₽ 12.7М</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Возмещено</div>
          <div className="text-3xl font-bold text-green-600">₽ 8.9М</div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Утраты по службам</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Служба</th>
                <th className="text-left p-3 font-semibold">Количество</th>
                <th className="text-left p-3 font-semibold">Сумма утрат</th>
                <th className="text-left p-3 font-semibold">Возмещено</th>
                <th className="text-left p-3 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody>
              {[
                { service: "Продовольственная", count: 23, loss: 3200000, recovered: 2800000, status: "В работе" },
                { service: "Вещевая", count: 34, loss: 5600000, recovered: 4100000, status: "В работе" },
                {
                  service: "Квартирно-эксплуатационная",
                  count: 18,
                  loss: 2900000,
                  recovered: 1500000,
                  status: "Просрочено",
                },
                {
                  service: "Горюче-смазочных материалов",
                  count: 14,
                  loss: 1000000,
                  recovered: 500000,
                  status: "В работе",
                },
              ].map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-semibold">{item.service}</td>
                  <td className="p-3">{item.count}</td>
                  <td className="p-3 font-mono text-red-600">₽ {(item.loss / 1000000).toFixed(1)}М</td>
                  <td className="p-3 font-mono text-green-600">₽ {(item.recovered / 1000000).toFixed(1)}М</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "В работе" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
