import { useIncidents, useKpis, useChanges, useAutomations } from '../../../hooks/useApi'
import { AlertTriangle, BarChart3, GitBranch, Workflow } from 'lucide-react'

function StatCard({ title, value, icon: Icon, color }: {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Offene Incidents"
          value={openIncidents}
          icon={AlertTriangle}
          color={openIncidents > 0 ? 'bg-red-500' : 'bg-green-500'}
        />
        <StatCard
          title="KPIs"
          value={kpis?.length ?? 0}
          icon={BarChart3}
          color="bg-blue-500"
        />
        <StatCard
          title="Automationen"
          value={activeAutomations}
          icon={Workflow}
          color="bg-purple-500"
        />
        <StatCard
          title="Letzte Changes"
          value={changes?.length ?? 0}
          icon={GitBranch}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktuelle Incidents</h2>
          {incidents && incidents.length > 0 ? (
            <div className="space-y-3">
              {incidents.slice(0, 5).map((incident) => (
                <div key={incident.id as string} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{incident.title as string}</p>
                    <p className="text-xs text-gray-500">{incident.severity as string}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    incident.status === 'open' ? 'bg-red-100 text-red-700' :
                    incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {incident.status as string}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Keine Incidents vorhanden</p>
          )}
        </div>

        {/* Recent Changes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Letzte Changes</h2>
          {changes && changes.length > 0 ? (
            <div className="space-y-3">
              {changes.slice(0, 5).map((change) => (
                <div key={change.id as string} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{change.title as string}</p>
                    <p className="text-xs text-gray-500">{change.type as string} {change.version ? `v${change.version}` : ''}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    change.status === 'deployed' ? 'bg-green-100 text-green-700' :
                    change.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {change.status as string}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Keine Changes vorhanden</p>
          )}
        </div>
      </div>
    </div>
  )
}
