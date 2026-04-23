"use client"

import { Box, Grid, Paper, Typography, Card, CardContent, Chip } from "@mui/material"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts"
import { TrendingUp, User, Award, Percent } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

/**
 * Дашборд KPI (ПС-2)
 * Особенности:
 * 1. Использование Recharts (локальное).
 * 2. Нулевая математическая логика (все баллы рассчитываются MathJS на бэкенде).
 * 3. Поддержка CSP Nonce через ThemeRegistry.
 */
export default function KpiDashboard() {
  // Получение готовых расчетов из API
  const { data: stats, isLoading } = useSWR("/api/kpi/stats", fetcher)

  // Данные для визуализации
  const chartData = [
    { name: "Исполнительность", score: stats?.performance || 85 },
    { name: "Выявление", score: stats?.volume || 72 },
    { name: "Дисциплина", score: stats?.discipline || 94 },
    { name: "Качество", score: stats?.quality || 68 },
  ]

  // История для линейного графика (сравнение с отделом)
  const historyData = stats?.history || [
    { date: "Янв", personal: 70, department_avg: 65 },
    { date: "Фев", personal: 75, department_avg: 68 },
    { date: "Мар", personal: 82, department_avg: 70 },
  ]

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a237e', mb: 1 }}>
          АНАЛИТИКА ЭФФЕКТИВНОСТИ ИНСПЕКТОРА
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Подсистема ПС-2: Мониторинг ключевых показателей KPI на основе реляционной модели КРР
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Карточка текущего рейтинга */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ 
            bgcolor: "primary.dark", 
            color: "white", 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.2)'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 5 }}>
              <Award size={48} style={{ marginBottom: 16 }} />
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>Текущий совокупный балл</Typography>
              <Typography variant="h1" sx={{ fontWeight: 900, my: 1 }}>
                {stats?.total_score || "78.4"}
              </Typography>
              <Chip 
                label="+5.2% за месяц" 
                size="small" 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Столбчатый график распределения */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", fontWeight: 700 }}>
              <TrendingUp style={{ marginRight: 12, color: '#1976d2' }} />
              Распределение по метрикам
            </Typography>
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="score" fill="#1976d2" radius={[6, 6, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Линейный график динамики */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Динамика личного рейтинга относительно отдела</Typography>
            <Box sx={{ height: 350 }}>
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="personal" 
                    name="Личный показатель"
                    stroke="#1976d2" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#1976d2' }} 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="department_avg" 
                    name="Среднее по отделу"
                    stroke="#b0bec5" 
                    strokeWidth={2} 
                    strokeDasharray="8 4" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
