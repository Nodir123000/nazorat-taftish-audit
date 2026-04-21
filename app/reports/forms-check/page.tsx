export default function FormsCheckPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Автоматическая проверка форм</h1>
          <p className="text-muted-foreground mt-1">Automatic Forms Consistency Check</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Запустить проверку
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Всего форм</div>
          <div className="text-3xl font-bold">89</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Проверено</div>
          <div className="text-3xl font-bold text-green-600">82</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Ошибок</div>
          <div className="text-3xl font-bold text-red-600">7</div>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="text-sm text-muted-foreground mb-1">Последняя проверка</div>
          <div className="text-lg font-bold">2025-01-20</div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Результаты проверки форм</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Форма</th>
                <th className="text-left p-3 font-semibold">Описание</th>
                <th className="text-left p-3 font-semibold">Дата проверки</th>
                <th className="text-left p-3 font-semibold">Статус</th>
                <th className="text-left p-3 font-semibold">Ошибки</th>
              </tr>
            </thead>
            <tbody>
              {[
                { form: "Ф.151/ФС", desc: "Итоговый отчёт", date: "2025-01-20", status: "OK", errors: 0 },
                { form: "Ф.52/ФС", desc: "Регистрация нарушений", date: "2025-01-20", status: "Ошибка", errors: 3 },
                { form: "Ф.45/ФС", desc: "Лицевые счета имущества", date: "2025-01-20", status: "OK", errors: 0 },
                {
                  form: "Ф.35/ФС",
                  desc: "Лицевые счета денег",
                  date: "2025-01-20",
                  status: "Предупреждение",
                  errors: 1,
                },
                { form: "Ф.171/ФС", desc: "Книга учёта", date: "2025-01-19", status: "OK", errors: 0 },
              ].map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-mono font-semibold">{item.form}</td>
                  <td className="p-3">{item.desc}</td>
                  <td className="p-3">{item.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "OK"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Предупреждение"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {item.errors > 0 ? (
                      <span className="text-red-600 font-semibold">{item.errors}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Обнаруженные ошибки</h2>

        <div className="space-y-3">
          {[
            { form: "Ф.52/ФС", error: "Несоответствие суммы в строках 12 и 45", severity: "Критическая" },
            { form: "Ф.52/ФС", error: "Отсутствует подпись ответственного лица", severity: "Критическая" },
            { form: "Ф.52/ФС", error: 'Неверный формат даты в поле "Дата обнаружения"', severity: "Средняя" },
            { form: "Ф.35/ФС", error: "Предупреждение: сумма близка к лимиту", severity: "Низкая" },
          ].map((item, idx) => (
            <div key={idx} className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
              <div className="flex justify-between items-start mb-1">
                <span className="font-mono font-semibold">{item.form}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    item.severity === "Критическая"
                      ? "bg-red-100 text-red-800"
                      : item.severity === "Средняя"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {item.severity}
                </span>
              </div>
              <div className="text-sm">{item.error}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
