import { useChanges } from '../../../hooks/useApi'
import { GitBranch, Plus } from 'lucide-react'

const TYPE_COLORS: Record<string, string> = {
  standard: 'bg-blue-100 text-blue-700',
  normal: 'bg-blue-100 text-blue-700',
  emergency: 'bg-red-100 text-red-700',
  minor: 'bg-gray-100 text-gray-600',
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  implemented: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-600',
}

export default function ChangesPage() {
  const { data: changes, isLoading } = useChanges()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Changes</h1>
          <p className="text-gray-500 mt-1">Änderungen und Releases verfolgen</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Neuer Change
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : changes && changes.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {changes.map((change) => (
              <div
                key={change.id as string}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <GitBranch size={18} className="text-primary" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {change.title as string}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {change.version ? (
                      <span className="text-xs text-gray-500 font-mono">
                        v{change.version as string}
                      </span>
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
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[change.type as string] ?? 'bg-gray-100 text-gray-600'}`}>
                      {change.type as string}
                    </span>
                  ) : null}
                  {change.status ? (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[change.status as string] ?? 'bg-gray-100 text-gray-600'}`}>
                      {change.status as string}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <GitBranch size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Keine Changes</h3>
          <p className="text-gray-500 mt-1">Es wurden noch keine Changes erfasst.</p>
        </div>
      )}
    </div>
  )
}
