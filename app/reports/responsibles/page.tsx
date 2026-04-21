export default function ResponsiblesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Привлечённые к ответственности</h1>
          <p className="text-muted-foreground mt-1">Persons Held Accountable</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Экспорт отчёта
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Всего лиц</div>
          <div className="text-3xl font-bold">156</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Дисциплинарная</div>
          <div className="text-3xl font-bold text-yellow-600">89</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Материальная</div>
          <div className="text-3xl font-bold text-orange-600">54</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Уголовная</div>
          <div className="text-3xl font-bold text-red-600">13</div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Список привлечённых лиц</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">ФИО</th>
                <th className="text-left p-3 font-semibold">Звание</th>
                <th className="text-left p-3 font-semibold">Должность</th>
                <th className="text-left p-3 font-semibold">Мера ответственности</th>
                <th className="text-left p-3 font-semibold">Сумма</th>
                <th className="text-left p-3 font-semibold">Дата</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Сидоров С.С.",
                  rank: "Майор",
                  position: "Начальник финслужбы",
                  measure: "Материальная",
                  amount: 450000,
                  date: "2025-01-10",
                },
                {
                  name: "Кузнецов К.К.",
                  rank: "Капитан",
                  position: "Зам. командира",
                  measure: "Дисциплинарная",
                  amount: 0,
                  date: "2025-01-08",
                },
                {
                  name: "Морозов М.М.",
                  rank: "Старший лейтенант",
                  position: "Начальник склада",
                  measure: "Уголовная",
                  amount: 1200000,
                  date: "2024-12-20",
                },
                {
                  name: "Волков В.В.",
                  rank: "Подполковник",
                  position: "Командир части",
                  measure: "Дисциплинарная",
                  amount: 0,
                  date: "2024-12-15",
                },
              ].map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-semibold">{item.name}</td>
                  <td className="p-3">{item.rank}</td>
                  <td className="p-3">{item.position}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.measure === "Дисциплинарная"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.measure === "Материальная"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.measure}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{item.amount > 0 ? `₽ ${(item.amount / 1000).toFixed(0)}К` : "-"}</td>
                  <td className="p-3">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
