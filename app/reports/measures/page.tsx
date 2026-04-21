export default function MeasuresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Принятые меры</h1>
          <p className="text-muted-foreground mt-1">Measures Taken</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Добавить меру
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Всего мер</div>
          <div className="text-3xl font-bold">134</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Выполнено</div>
          <div className="text-3xl font-bold text-green-600">98</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">В работе</div>
          <div className="text-3xl font-bold text-blue-600">28</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Просрочено</div>
          <div className="text-3xl font-bold text-red-600">8</div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Список принятых мер</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Мера</th>
                <th className="text-left p-3 font-semibold">Ответственный</th>
                <th className="text-left p-3 font-semibold">Срок</th>
                <th className="text-left p-3 font-semibold">Результат</th>
                <th className="text-left p-3 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  measure: "Проведение дополнительного инструктажа МОЛ",
                  responsible: "Майор Иванов И.И.",
                  deadline: "2025-02-01",
                  result: "Инструктаж проведён, 45 человек",
                  status: "Выполнено",
                },
                {
                  measure: "Усиление контроля за учётом ГСМ",
                  responsible: "Подполковник Петров П.П.",
                  deadline: "2025-02-15",
                  result: "Внедрена система учёта",
                  status: "В работе",
                },
                {
                  measure: "Замена материально-ответственных лиц",
                  responsible: "Полковник Сидоров С.С.",
                  deadline: "2025-01-20",
                  result: "Заменено 3 МОЛ",
                  status: "Выполнено",
                },
                {
                  measure: "Ремонт складских помещений",
                  responsible: "Капитан Морозов М.М.",
                  deadline: "2025-01-15",
                  result: "-",
                  status: "Просрочено",
                },
              ].map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">{item.measure}</td>
                  <td className="p-3">{item.responsible}</td>
                  <td className="p-3">{item.deadline}</td>
                  <td className="p-3 text-sm">{item.result}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "Выполнено"
                          ? "bg-green-100 text-green-800"
                          : item.status === "В работе"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
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

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Эффективность мер</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
            <span>Снижение количества нарушений после инструктажа</span>
            <span className="font-bold text-green-600">-18%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
            <span>Улучшение учёта после внедрения новой системы</span>
            <span className="font-bold text-green-600">+34%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
            <span>Сокращение времени на проверку</span>
            <span className="font-bold text-green-600">-22%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
