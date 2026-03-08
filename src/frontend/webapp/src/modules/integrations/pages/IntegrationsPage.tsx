import { useIntegrations } from '../../../hooks/useApi'
import { Plug, Plus } from 'lucide-react'

const AUTH_STATUS_COLORS: Record<string, string> = {
  connected: 'bg-green-100 text-green-700',
  disconnected: 'bg-gray-100 text-gray-600',
  error: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

const AUTH_STATUS_LABELS: Record<string, string> = {
  connected: 'Verbunden',
  disconnected: 'Getrennt',
  error: 'Fehler',
  pending: 'Ausstehend',
}

const RISK_COLORS: Record<string, string> = {
  critical: 'text-red-600',
  high: 'text-orange-600',
  medium: 'text-yellow-600',
  low: 'text-green-600',
}

export default function IntegrationsPage() {
  const { data: integrations, isLoading } = useIntegrations()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrationen</h1>
          <p className="text-gray-500 mt-1">Verbundene Dienste und Schnittstellen</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Neue Integration
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : integrations && integrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => {
            const authStatus = (integration.auth_status as string) ?? 'disconnected'
            const riskLevel = integration.risk_level as string | undefined

            return (
              <div
                key={integration.id as string}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plug size={20} className="text-primary" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${AUTH_STATUS_COLORS[authStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                    {AUTH_STATUS_LABELS[authStatus] ?? authStatus}
                  </span>
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
                    <span className={`text-xs font-medium ${RISK_COLORS[riskLevel] ?? 'text-gray-400'}`}>
                      {riskLevel}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Plug size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Keine Integrationen</h3>
          <p className="text-gray-500 mt-1">Es wurden noch keine Integrationen eingerichtet.</p>
        </div>
      )}
    </div>
  )
}
