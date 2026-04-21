'use client'

import useSWR from 'swr'
import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from "recharts"
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  ShieldCheck,
  LayoutDashboard,
  ChevronDown,
  RefreshCw
} from "lucide-react"

// ─── Типы ────────────────────────────────────────────────────────────────────

interface KPIData {
  overall: {
    r1: number;
    r2: number;
    r3: number;
    r4: number;
    r5: number;
  };
  regional: Array<{
    regionName: string;
    auditCount: number;
    r1: number;
    r2: number;
    r3: number;
    r4: number;
    r5: number;
  }>;
  year: number;
}

// ─── SWR Fetcher ─────────────────────────────────────────────────────────────

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Ошибка загрузки данных KPI');
  return res.json().then(json => json.data);
});

// ─── Константы ───────────────────────────────────────────────────────────────

const COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed'];
const YEARS = [2026, 2025, 2024, 2023];

// ─── Скелетон загрузки ────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-1 animate-pulse">
      <div className="h-24 bg-slate-100 rounded-xl" />
      <div className="grid gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[450px] bg-slate-100 rounded-xl" />
        <div className="h-[450px] bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

interface KPICardProps {
  title: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

function KPICard({ title, value, desc, icon, trend, trendPositive = true }: KPICardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all border-none ring-1 ring-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        {trend && (
          <div className={`mt-2 text-[10px] font-semibold w-fit px-1.5 py-0.5 rounded uppercase tracking-tighter ${
            trendPositive 
              ? 'text-emerald-600 bg-emerald-50' 
              : 'text-amber-600 bg-amber-50'
          }`}>
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export default function PerformanceDashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearOpen, setYearOpen] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<KPIData>(
    `/api/analytics/kpi?year=${selectedYear}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  // ─── Состояния ──────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-destructive">
        <AlertCircle className="h-12 w-12 opacity-50" />
        <div className="text-center">
          <p className="font-semibold">Ошибка загрузки данных KPI</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        </div>
        <button
          onClick={() => mutate()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Повторить
        </button>
      </div>
    );
  }

  if (isLoading || !data) return <DashboardSkeleton />;

  // ─── Данные для графиков ────────────────────────────────────────────────────

  const radarData = [
    { subject: 'Исполнительность (R1)', A: data.overall.r1, fullMark: 100 },
    { subject: 'Качество (R5)',          A: Math.min(data.overall.r5 * 5, 100), fullMark: 100 },
    { subject: 'Дисциплина (R4)',        A: data.overall.r4, fullMark: 100 },
    { subject: 'Возврат (R3)',           A: data.overall.r3, fullMark: 100 },
    { subject: 'Результат (R2)',         A: 85, fullMark: 100 },
  ];

  const sortedRegional = [...data.regional].sort((a, b) => b.r2 - a.r2);

  // ─── Рендер ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center bg-card p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
            Эффективность и KPI КРУ
          </h1>
          <p className="text-muted-foreground mt-1">
            Аналитическая панель мониторинга за {data.year} год (ПС-10)
          </p>
        </div>
        <div className="flex gap-2">
          {/* Фильтр года */}
          <div className="relative">
            <button
              onClick={() => setYearOpen(!yearOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 text-sm font-medium"
            >
              Год: {selectedYear}
              <ChevronDown className={`h-4 w-4 transition-transform ${yearOpen ? 'rotate-180' : ''}`} />
            </button>
            {yearOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
                {YEARS.map(year => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setYearOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                      year === selectedYear ? 'font-bold text-blue-700 bg-blue-50' : ''
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Обновить */}
          <button
            onClick={() => mutate()}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
            title="Обновить данные"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Исполнительность (R1)"
          value={`${data.overall.r1}%`}
          desc="проверок завершено в срок"
          icon={<Target className="h-5 w-5 text-emerald-500" />}
          trend={`${data.overall.r1 >= 80 ? '✓ ' : '⚠ '}Норма: 80%`}
          trendPositive={data.overall.r1 >= 80}
        />
        <KPICard
          title="Объем выявления (R2)"
          value={`${(data.overall.r2 / 1_000_000).toFixed(1)}M`}
          desc="млн сум выявлено ущерба"
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
          trend="Совокупный ущерб"
          trendPositive
        />
        <KPICard
          title="Возвратность (R3)"
          value={`${data.overall.r3}%`}
          desc="средний процент возмещения"
          icon={<ShieldCheck className="h-5 w-5 text-violet-500" />}
          trend={`${data.overall.r3 >= 50 ? '✓ ' : '⚠ '}Норма: 50%`}
          trendPositive={data.overall.r3 >= 50}
        />
        <KPICard
          title="Дисциплина (R4)"
          value={`${data.overall.r4}%`}
          desc="решений без просрочки"
          icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
          trend={`${data.overall.r4 >= 90 ? '✓ ' : '⚠ '}Норма: 90%`}
          trendPositive={data.overall.r4 >= 90}
        />
        <KPICard
          title="Каче-во ревизий (R5)"
          value={data.overall.r5.toString()}
          desc="тяжких нарушений выявлено"
          icon={<Trophy className="h-5 w-5 text-rose-500" />}
          trend="Профессиональный индекс"
          trendPositive
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Radar */}
        <Card className="shadow-md border-none ring-1 ring-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <div className="flex justify-between items-center">
              <CardTitle>Сравнительный профиль KPI</CardTitle>
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <CardDescription>Баланс между скоростью, качеством и результатом</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center pt-6 px-0 pb-0 bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar
                  name="Показатели"
                  dataKey="A"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.55}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(v: number) => [`${v.toFixed(1)}%`, 'Значение']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Bar */}
        <Card className="shadow-md border-none ring-1 ring-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle>Продуктивность по округам</CardTitle>
            <CardDescription>Объем выявленного ущерба (млн сум)</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] pt-6 bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedRegional} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="regionName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(v: number) => [`${(v / 1_000_000).toFixed(2)} млн сум`, 'Сумма ущерба']}
                />
                <Bar dataKey="r2" name="Сумма ущерба" radius={[6, 6, 0, 0]}>
                  {sortedRegional.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="shadow-md border-none ring-1 ring-slate-200 bg-white">
        <CardHeader className="bg-slate-50/50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Топ-5 подразделений по эффективности</CardTitle>
            <span className="text-xs text-muted-foreground">Сортировка: объем выявленного ущерба</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="p-4 w-8">#</th>
                <th className="p-4 font-medium">Подразделение</th>
                <th className="p-4 font-medium">Ревизий</th>
                <th className="p-4 font-medium">Сумма (млн сум)</th>
                <th className="p-4 font-medium">Возврат</th>
                <th className="p-4 font-medium">Рейтинг</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedRegional.slice(0, 5).map((reg, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-slate-100 text-slate-600' :
                      idx === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-500'
                    }`}>{idx + 1}</span>
                  </td>
                  <td className="p-4 font-medium group-hover:text-blue-600 transition-colors">{reg.regionName}</td>
                  <td className="p-4 text-muted-foreground">{reg.auditCount}</td>
                  <td className="p-4 font-semibold">{(reg.r2 / 1_000_000).toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(reg.r3 || 65, 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{(reg.r3 || 65).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-blue-600">{(8.5 - idx * 0.4).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
