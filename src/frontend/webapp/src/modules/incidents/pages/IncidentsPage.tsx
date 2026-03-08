import { useState } from 'react'
import { useIncidents } from '../../../hooks/useApi'
import { AlertTriangle } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Badge, variantFor, DataTable } from '../../../components/ui'
import type { IColumn } from '../../../components/ui'
import { SEVERITY_VARIANT, INCIDENT_STATUS_VARIANT } from '../../../lib/status-colors'

type Incident = Record<string, unknown>

const FILTERS = [
  { value: 'all', label: 'Alle' },
  { value: 'open', label: 'open' },
  { value: 'investigating', label: 'investigating' },
  { value: 'resolved', label: 'resolved' },
  { value: 'closed', label: 'closed' },
]

const columns: IColumn<Incident>[] = [
  {
    key: 'title',
    header: 'Titel',
    render: (i) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{i.title as string}</p>
        {i.description ? <p className="text-xs text-gray-500 mt-0.5 truncate max-w-md">{i.description as string}</p> : null}
      </div>
    ),
  },
  {
    key: 'severity',
    header: 'Severity',
    render: (i) => (
      <Badge variant={variantFor(i.severity as string, SEVERITY_VARIANT)}>
        {i.severity as string}
      </Badge>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (i) => (
      <Badge variant={variantFor(i.status as string, INCIDENT_STATUS_VARIANT)}>
        {i.status as string}
      </Badge>
    ),
  },
  {
    key: 'created',
    header: 'Erstellt',
    render: (i) => (
      <span className="text-sm text-gray-500">
        {new Date(i.created_at as string).toLocaleDateString('de-DE')}
      </span>
    ),
  },
]

export default function IncidentsPage() {
  const { data: incidents, isLoading } = useIncidents()
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = statusFilter === 'all'
    ? incidents
    : incidents?.filter((i) => i.status === statusFilter)

  return (
    <div>
      <PageHeader title="Incidents" subtitle="Störungen und Tickets verwalten" action={{ label: 'Neuer Incident' }} />

      <div className="flex gap-2 mb-6">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? <Spinner /> : filtered && filtered.length > 0 ? (
        <DataTable columns={columns} data={filtered} rowKey={(i) => i.id as string} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Keine Incidents" description="Es gibt aktuell keine Incidents." />
      )}
    </div>
  )
}
