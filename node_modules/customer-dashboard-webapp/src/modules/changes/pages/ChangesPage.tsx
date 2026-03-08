import { useChanges } from '../../../hooks/useApi'
import { GitBranch } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Badge, variantFor, Card } from '../../../components/ui'
import { CHANGE_TYPE_VARIANT, CHANGE_STATUS_VARIANT } from '../../../lib/status-colors'

export default function ChangesPage() {
  const { data: changes, isLoading } = useChanges()

  return (
    <div>
      <PageHeader title="Changes" subtitle="Änderungen und Releases verfolgen" action={{ label: 'Neuer Change' }} />

      {isLoading ? <Spinner /> : changes && changes.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            {changes.map((change) => (
              <div
                key={change.id as string}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GitBranch size={18} className="text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {change.title as string}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {change.version ? (
                      <span className="text-xs text-gray-500 font-mono">v{change.version as string}</span>
                    ) : null}
                    {change.scheduled_at ? (
                      <span className="text-xs text-gray-400">
                        {new Date(change.scheduled_at as string).toLocaleDateString('de-DE')}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {change.type ? (
                    <Badge variant={variantFor(change.type as string, CHANGE_TYPE_VARIANT)}>
                      {change.type as string}
                    </Badge>
                  ) : null}
                  {change.status ? (
                    <Badge variant={variantFor(change.status as string, CHANGE_STATUS_VARIANT)}>
                      {change.status as string}
                    </Badge>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EmptyState icon={GitBranch} title="Keine Changes" description="Es wurden noch keine Changes erfasst." />
      )}
    </div>
  )
}
