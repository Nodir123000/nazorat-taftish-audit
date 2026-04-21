import { UnifiedOrdersView } from "@/components/planning/orders/unified-view"
import { planningService } from "@/lib/services/planning-service"

export default async function OrdersPage() {
  const plans = await planningService.getPlansForOrders()

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6">
        <UnifiedOrdersView initialPlans={plans} />
      </div>
    </div>
  )
}
