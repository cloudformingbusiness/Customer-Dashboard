import { useIncidents, useKpis, useChanges, useAutomations } from '../../../hooks/useApi'
import { AlertTriangle, BarChart3, GitBranch, Workflow } from 'lucide-react'
import { Card, Badge, variantFor } from '../../../components/ui'
import { INCIDENT_STATUS_VARIANT, CHANGE_STATUS_VARIANT } from '../../../lib/status-colors'

function StatCard({ title, value, icon: Icon, color }: {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </Card>
  )
}

export default function ExecutiveSummaryPage() {
  const { data: incidents } = useIncidents()
  const { data: kpis } = useKpis()
  const { data: changes } = useChanges()
  const { data: automations } = useAutomations()

  const openIncidents = incidents?.filter((i) => i.status === 'open' || i.status === 'investigating').length ?? 0
  const activeAutomations = automations?.filter((a) => a.is_active).length ?? 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Willkommen im Customer Dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Offene Incidents"
          value={openIncidents}
          icon={AlertTriangle}
          color={openIncidents > 0 ? 'bg-red-500' : 'bg-green-500'}
        />
        <StatCard title="KPIs" value={kpis?.length ?? 0} icon={BarChart3} color="bg-blue-500" />
        <StatCard title="Automationen" value={activeAutomations} icon={Workflow} color="bg-purple-500" />
        <StatCard title="Letzte Changes" value={changes?.length ?? 0} icon={GitBranch} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktuelle Incidents</h2>
          {incidents && incidents.length > 0 ? (
            <div className="space-y-3">
              {incidents.slice(0, 5).map((incident) => (
                <div key={incident.id as string} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{incident.title as string}</p>
                    <p className="text-xs text-gray-500">{incident.severity as string}</p>
                  </div>
                  <Badge variant={variantFor(incident.status as string, INCIDENT_STATUS_VARIANT)}>
                    {incident.status as string}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Keine Incidents vorhanden</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Letzte Changes</h2>
          {changes && changes.length > 0 ? (
            <div className="space-y-3">
              {changes.slice(0, 5).map((change) => (
                <div key={change.id as string} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{change.title as string}</p>
                    <p className="text-xs text-gray-500">{change.type as string} {change.version ? `v${change.version}` : ''}</p>
                  </div>
                  <Badge variant={variantFor(change.status as string, CHANGE_STATUS_VARIANT)}>
                    {change.status as string}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Keine Changes vorhanden</p>
          )}
        </Card>
      </div>
    </div>
  )
}
