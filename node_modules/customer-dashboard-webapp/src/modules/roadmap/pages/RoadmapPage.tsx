import { useRoadmapItems } from '../../../hooks/useApi'
import { Plus, Map } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  backlog: 'Backlog',
  planned: 'Geplant',
  in_progress: 'In Bearbeitung',
  done: 'Erledigt',
}

const STATUS_HEADER_COLORS: Record<string, string> = {
  backlog: 'bg-gray-100 text-gray-700',
  planned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-600',
  high: 'text-orange-600',
  medium: 'text-yellow-600',
  low: 'text-gray-400',
}

const STATUSES = ['backlog', 'planned', 'in_progress', 'done']

export default function RoadmapPage() {
  const { data: items, isLoading } = useRoadmapItems()

  const grouped = STATUSES.reduce<Record<string, Record<string, unknown>[]>>((acc, status) => {
    acc[status] = items?.filter((i) => i.status === status) ?? []
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roadmap</h1>
          <p className="text-gray-500 mt-1">Features und Initiativen planen</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Neues Item
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {STATUSES.map((status) => (
            <div key={status}>
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg mb-3 ${STATUS_HEADER_COLORS[status]}`}>
                <span className="text-sm font-semibold">{STATUS_LABELS[status]}</span>
                <span className="text-xs font-medium">{grouped[status].length}</span>
              </div>

              <div className="space-y-3">
                {grouped[status].map((item) => (
                  <div
                    key={item.id as string}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {item.title as string}
                    </h4>

                    {item.priority ? (
                      <div className="flex items-center gap-1 mb-2">
                        <span className={`text-xs font-medium ${PRIORITY_COLORS[item.priority as string] ?? 'text-gray-400'}`}>
                          {item.priority as string}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {item.value_score != null ? (
                        <span>Wert: {item.value_score as number}</span>
                      ) : null}
                      {item.effort_score != null ? (
                        <span>Aufwand: {item.effort_score as number}</span>
                      ) : null}
                    </div>
                  </div>
                ))}

                {grouped[status].length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-400">
                    Keine Items
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Map size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Keine Roadmap-Items</h3>
          <p className="text-gray-500 mt-1">Es wurden noch keine Roadmap-Items angelegt.</p>
        </div>
      )}
    </div>
  )
}
