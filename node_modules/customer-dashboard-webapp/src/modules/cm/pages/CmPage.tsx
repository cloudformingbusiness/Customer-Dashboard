import { useContacts } from '../../../hooks/useApi'
import { Users } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Badge, variantFor, DataTable } from '../../../components/ui'
import type { IColumn } from '../../../components/ui'
import { CONTACT_TYPE_VARIANT } from '../../../lib/status-colors'

type Contact = Record<string, unknown>

const columns: IColumn<Contact>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (c) => <p className="text-sm font-medium text-gray-900">{c.name as string}</p>,
  },
  {
    key: 'email',
    header: 'E-Mail',
    render: (c) => <span className="text-sm text-gray-500">{(c.email as string) ?? '–'}</span>,
  },
  {
    key: 'type',
    header: 'Typ',
    render: (c) => c.type ? (
      <Badge variant={variantFor(c.type as string, CONTACT_TYPE_VARIANT)}>
        {c.type as string}
      </Badge>
    ) : null,
  },
  {
    key: 'company',
    header: 'Unternehmen',
    render: (c) => <span className="text-sm text-gray-500">{(c.company as string) ?? '–'}</span>,
  },
]

export default function CmPage() {
  const { data: contacts, isLoading } = useContacts()

  return (
    <div>
      <PageHeader title="Kontakte" subtitle="Kontakte und Ansprechpartner verwalten" action={{ label: 'Neuer Kontakt' }} />

      {isLoading ? <Spinner /> : contacts && contacts.length > 0 ? (
        <DataTable columns={columns} data={contacts} rowKey={(c) => c.id as string} />
      ) : (
        <EmptyState icon={Users} title="Keine Kontakte" description="Es wurden noch keine Kontakte angelegt." />
      )}
    </div>
  )
}
