import { useAutomations } from '../../../hooks/useApi'
import { Workflow } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Badge, variantFor, DataTable } from '../../../components/ui'
import type { IColumn } from '../../../components/ui'
import { SEVERITY_VARIANT, AUTOMATION_STATUS_VARIANT } from '../../../lib/status-colors'

type Automation = Record<string, unknown>

const columns: IColumn<Automation>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (a) => (
      <div className="flex items-center gap-3">
        <Workflow size={18} className="text-gray-400 flex-shrink-0" />
        <p className="text-sm font-medium text-gray-900">{a.name as string}</p>
      </div>
    ),
  },
  {
    key: 'workflow_id',
    header: 'Workflow ID',
    render: (a) => (
      <span className="text-sm text-gray-500 font-mono">
        {(a.n8n_workflow_id as string) ?? '–'}
      </span>
    ),
  },
  {
    key: 'criticality',
    header: 'Kritikalität',
    render: (a) => a.criticality ? (
      <Badge variant={variantFor(a.criticality as string, SEVERITY_VARIANT)}>
        {a.criticality as string}
      </Badge>
    ) : null,
  },
  {
    key: 'status',
    header: 'Letzter Status',
    render: (a) => {
      const status = (a.last_status as string) ?? 'unknown'
      return (
        <Badge variant={variantFor(status, AUTOMATION_STATUS_VARIANT)}>
          {status}
        </Badge>
      )
    },
  },
  {
    key: 'last_run',
    header: 'Letzter Lauf',
    render: (a) => (
      <span className="text-sm text-gray-500">
        {a.last_run_at ? new Date(a.last_run_at as string).toLocaleString('de-DE') : '–'}
      </span>
    ),
  },
]

export default function AutomationsPage() {
  const { data: automations, isLoading } = useAutomations()

  return (
    <div>
      <PageHeader title="Automationen" subtitle="n8n Workflows und Automatisierungen" action={{ label: 'Neue Automation' }} />

      {isLoading ? <Spinner /> : automations && automations.length > 0 ? (
        <DataTable columns={columns} data={automations} rowKey={(a) => a.id as string} />
      ) : (
        <EmptyState icon={Workflow} title="Keine Automationen" description="Es wurden noch keine Automationen eingerichtet." />
      )}
    </div>
  )
}
