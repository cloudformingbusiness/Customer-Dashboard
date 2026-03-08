import { useRoadmapItems } from '../../../hooks/useApi'
import { Map } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Card } from '../../../components/ui'
import { ROADMAP_STATUS_LABEL, ROADMAP_STATUS_HEADER, PRIORITY_TEXT_COLOR } from '../../../lib/status-colors'

const STATUSES = ['backlog', 'planned', 'in_progress', 'done']

export default function RoadmapPage() {
  const { data: items, isLoading } = useRoadmapItems()

  const grouped = STATUSES.reduce<Record<string, Record<string, unknown>[]>>((acc, status) => {
    acc[status] = items?.filter((i) => i.status === status) ?? []
    return acc
  }, {})

  return (
    <div>
      <PageHeader title="Roadmap" subtitle="Features und Initiativen planen" action={{ label: 'Neues Item' }} />

      {isLoading ? <Spinner /> : items && items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {STATUSES.map((status) => (
            <div key={status}>
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg mb-3 ${ROADMAP_STATUS_HEADER[status]}`}>
                <span className="text-sm font-semibold">{ROADMAP_STATUS_LABEL[status]}</span>
                <span className="text-xs font-medium">{grouped[status].length}</span>
              </div>

              <div className="space-y-3">
                {grouped[status].map((item) => (
                  <Card key={item.id as string} hover className="p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {item.title as string}
                    </h4>

                    {item.priority ? (
                      <div className="flex items-center gap-1 mb-2">
                        <span className={`text-xs font-medium ${PRIORITY_TEXT_COLOR[item.priority as string] ?? 'text-gray-400'}`}>
                          {item.priority as string}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {item.value_score != null ? <span>Wert: {item.value_score as number}</span> : null}
                      {item.effort_score != null ? <span>Aufwand: {item.effort_score as number}</span> : null}
                    </div>
                  </Card>
                ))}

                {grouped[status].length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-400">Keine Items</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Map} title="Keine Roadmap-Items" description="Es wurden noch keine Roadmap-Items angelegt." />
      )}
    </div>
  )
}
