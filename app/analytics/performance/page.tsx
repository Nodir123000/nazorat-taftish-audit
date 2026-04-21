import PerformanceDashboard from "@/components/analytics/kpi-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Эффективность и KPI | АИС КРР",
  description: "Мониторинг ключевых показателей эффективности контрольно-ревизионной деятельности",
};

export default function PerformancePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PerformanceDashboard />
    </div>
  );
}
