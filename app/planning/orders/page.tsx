import { UnifiedOrdersView } from "@/components/planning/orders/unified-view"
import { planningService } from "@/lib/services/planning-service"

export default async function OrdersPage() {
  const plans = await planningService.getPlansForOrders()

  return (
    <UnifiedOrdersView initialPlans={plans} />
  )
}
