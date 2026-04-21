export default function FinalReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Итоговые отчёты (Ф.151/ФС)</h1>
          <p className="text-muted-foreground mt-1">Final Reports (Form 151/FS)</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2">
          <span className="text-lg">+</span>
          Создать отчёт
        </button>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <div className="flex gap-4 mb-6">
          <input type="text" placeholder="Поиск по номеру отчёта..." className="flex-1 px-4 py-2 border rounded-md" />
          <select className="px-4 py-2 border rounded-md">
            <option>Все статусы</option>
            <option>Черновик</option>
            <option>На утверждении</option>
            <option>Утверждён</option>
            <option>Отправлен</option>
          </select>
          <select className="px-4 py-2 border rounded-md">
            <option>Все годы</option>
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">ID отчёта</th>
                <th className="text-left p-3 font-semibold">Ревизия</th>
                <th className="text-left p-3 font-semibold">Дата</th>
                <th className="text-left p-3 font-semibold">Статус</th>
                <th className="text-left p-3 font-semibold">Утвердил</th>
                <th className="text-left p-3 font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "REP-2025-001",
                  rev: "РЕВ-2025-045",
                  date: "2025-01-15",
                  status: "Утверждён",
                  approver: "Полковник Иванов И.И.",
                },
                {
                  id: "REP-2025-002",
                  rev: "РЕВ-2025-046",
                  date: "2025-01-18",
                  status: "На утверждении",
                  approver: "-",
                },
                {
                  id: "REP-2024-089",
                  rev: "РЕВ-2024-234",
                  date: "2024-12-28",
                  status: "Отправлен",
                  approver: "Генерал-майор Петров П.П.",
                },
              ].map((report) => (
                <tr key={report.id} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-mono text-sm">{report.id}</td>
                  <td className="p-3">{report.rev}</td>
                  <td className="p-3">{report.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        report.status === "Утверждён"
                          ? "bg-green-100 text-green-800"
                          : report.status === "На утверждении"
                            ? "bg-yellow-100 text-yellow-800"
                            : report.status === "Отправлен"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3">{report.approver}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-muted rounded" title="Просмотр">
                        👁️
                      </button>
                      <button className="p-1 hover:bg-muted rounded" title="Редактировать">
                        ✏️
                      </button>
                      <button className="p-1 hover:bg-muted rounded" title="Скачать">
                        ⬇️
                      </button>
                    </div>
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
