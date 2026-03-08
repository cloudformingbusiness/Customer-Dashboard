import { useIntegrations } from '../../../hooks/useApi'
import { Plug } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Badge, variantFor, Card } from '../../../components/ui'
import { AUTH_STATUS_VARIANT, AUTH_STATUS_LABEL, RISK_TEXT_COLOR } from '../../../lib/status-colors'

export default function IntegrationsPage() {
  const { data: integrations, isLoading } = useIntegrations()

  return (
    <div>
      <PageHeader title="Integrationen" subtitle="Verbundene Dienste und Schnittstellen" action={{ label: 'Neue Integration' }} />

      {isLoading ? <Spinner /> : integrations && integrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => {
            const authStatus = (integration.auth_status as string) ?? 'disconnected'
            const riskLevel = integration.risk_level as string | undefined

            return (
              <Card key={integration.id as string} hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plug size={20} className="text-primary" />
                  </div>
                  <Badge variant={variantFor(authStatus, AUTH_STATUS_VARIANT)}>
                    {AUTH_STATUS_LABEL[authStatus] ?? authStatus}
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {integration.provider as string}
                </h3>

                {integration.description ? (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {integration.description as string}
                  </p>
                ) : null}

                {riskLevel && (
                  <div className="flex items-center gap-1 mt-auto pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Risiko:</span>
                    <span className={`text-xs font-medium ${RISK_TEXT_COLOR[riskLevel] ?? 'text-gray-400'}`}>
                      {riskLevel}
                    </span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState icon={Plug} title="Keine Integrationen" description="Es wurden noch keine Integrationen eingerichtet." />
      )}
    </div>
  )
}
