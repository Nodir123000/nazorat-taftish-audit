"use client"

import type { User } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/hooks"
import { FinancialActivityContent } from "@/components/audits/financial-activity-content"
import { LawEnforcementRegistry } from "@/components/audits/law-enforcement-registry"
import { ServiceInvestigationsRegistry } from "@/components/audits/service-investigations-registry"

interface AuditsContentProps {
  user: User
}

export function AuditsContent({ user }: AuditsContentProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Icons.Clipboard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t("sidebar.audits")}</h1>
          <p className="text-muted-foreground">{t("dashboard.modules.executionDesc")}</p>
        </div>
      </div>

      <Tabs defaultValue="violations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 lg:grid-cols-3 lg:w-full">
          <TabsTrigger value="violations" className="gap-2">
            <Icons.AlertTriangle className="w-4 h-4" />
            {t("sidebar.violations")}
          </TabsTrigger>
          <TabsTrigger value="law_enforcement" className="gap-2">
            <Icons.Shield className="w-4 h-4" />
            {t("audits.tab.lawEnforcement")}
          </TabsTrigger>
          <TabsTrigger value="service_investigations" className="gap-2">
            <Icons.Users className="w-4 h-4" />
            {t("audits.tab.serviceInvestigations")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="violations">
          <FinancialActivityContent />
        </TabsContent>

        <TabsContent value="law_enforcement">
          <LawEnforcementRegistry />
        </TabsContent>

        <TabsContent value="service_investigations">
          <ServiceInvestigationsRegistry />
        </TabsContent>
      </Tabs>
    </div>
  )
}
