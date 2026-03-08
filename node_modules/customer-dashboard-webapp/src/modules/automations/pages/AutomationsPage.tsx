import { useAutomations } from '../../../hooks/useApi'
import { Workflow, Plus } from 'lucide-react'

const CRITICALITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
}

const STATUS_COLORS: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  running: 'bg-blue-100 text-blue-700',
  waiting: 'bg-yellow-100 text-yellow-700',
  unknown: 'bg-gray-100 text-gray-600',
}

export default function AutomationsPage() {
  const { data: automations, isLoading } = useAutomations()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automationen</h1>
          <p className="text-gray-500 mt-1">n8n Workflows und Automatisierungen</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Neue Automation
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : automations && automations.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Workflow ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Kritikalität</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Letzter Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Letzter Lauf</th>
              </tr>
            </thead>
            <tbody>
              {automations.map((automation) => {
                const lastStatus = (automation.last_status as string) ?? 'unknown'

                return (
                  <tr key={automation.id as string} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Workflow size={18} className="text-gray-400 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-900">{automation.name as string}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 font-mono">
                        {(automation.n8n_workflow_id as string) ?? '–'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {automation.criticality ? (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${CRITICALITY_COLORS[automation.criticality as string] ?? 'bg-gray-100 text-gray-600'}`}>
                          {automation.criticality as string}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[lastStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                        {lastStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {automation.last_run_at
                        ? new Date(automation.last_run_at as string).toLocaleString('de-DE')
                        : '–'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Workflow size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Keine Automationen</h3>
          <p className="text-gray-500 mt-1">Es wurden noch keine Automationen eingerichtet.</p>
        </div>
      )}
    </div>
  )
}
