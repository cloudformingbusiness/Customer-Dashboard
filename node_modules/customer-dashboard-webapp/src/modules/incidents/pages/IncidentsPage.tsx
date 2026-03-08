import { useState } from 'react'
import { useIncidents } from '../../../hooks/useApi'
import { Plus, AlertTriangle } from 'lucide-react'

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-red-100 text-red-700',
  investigating: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
}

export default function IncidentsPage() {
  const { data: incidents, isLoading } = useIncidents()
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = statusFilter === 'all'
    ? incidents
    : incidents?.filter((i) => i.status === statusFilter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
          <p className="text-gray-500 mt-1">Störungen und Tickets verwalten</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Neuer Incident
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'open', 'investigating', 'resolved', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Alle' : status}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Titel</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Erstellt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((incident) => (
                <tr key={incident.id as string} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{incident.title as string}</p>
                    {incident.description ? (
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-md">{incident.description as string}</p>
                    ) : null}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${SEVERITY_COLORS[incident.severity as string] ?? ''}`}>
                      {incident.severity as string}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[incident.status as string] ?? ''}`}>
                      {incident.status as string}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(incident.created_at as string).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Keine Incidents</h3>
          <p className="text-gray-500 mt-1">Es gibt aktuell keine Incidents.</p>
        </div>
      )}
    </div>
  )
}
