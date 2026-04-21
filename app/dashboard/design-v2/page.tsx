import { BalancePanel } from '@/components/dashboard-v2/balance-panel';
import { ChartPanel } from '@/components/dashboard-v2/chart-panel';
import { RightPanel } from '@/components/dashboard-v2/right-panel';
import { DashboardProvider } from '@/components/dashboard-v2/dashboard-context';

export default function DesignV2Page() {
  // Mock data would ideally come from a server component or API
  const balanceData = {
    totalAmount: 145000000,
    bySeverity: { critical: 5, high: 12, medium: 24, low: 45 },
    byStatus: { draft: 10, under_review: 15, closed: 85 }
  };

  const chartData = [
    { name: 'Янв', violations: 4000, amt: 2400 },
    { name: 'Фев', violations: 3000, amt: 1398 },
    { name: 'Мар', violations: 2000, amt: 9800 },
    { name: 'Апр', violations: 2780, amt: 3908 },
    { name: 'Май', violations: 1890, amt: 4800 },
    { name: 'Июн', violations: 2390, amt: 3800 },
    { name: 'Июл', violations: 3490, amt: 4300 },
  ];

  const recentActivity = [
    { id: '1', type: 'audit', title: 'Плановая ревизия', description: 'Склад №4', timestamp: '2 мин назад' },
  ];

  return (
    <DashboardProvider>
      <div className="h-[calc(100vh-4rem)] flex gap-0 bg-gray-50 overflow-hidden font-sans text-slate-900">
        <BalancePanel
          totalAmount={balanceData.totalAmount}
          bySeverity={balanceData.bySeverity}
          byStatus={balanceData.byStatus}
        />
        <ChartPanel data={chartData} />
        <RightPanel recentActivity={recentActivity} />
      </div>
    </DashboardProvider>
  );
}
