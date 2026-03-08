import { useDocuments } from '../../../hooks/useApi'
import { FileText } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Badge, variantFor, DataTable } from '../../../components/ui'
import type { IColumn } from '../../../components/ui'
import { DOC_CATEGORY_VARIANT } from '../../../lib/status-colors'

type Doc = Record<string, unknown>

const columns: IColumn<Doc>[] = [
  {
    key: 'title',
    header: 'Titel',
    render: (doc) => (
      <div className="flex items-center gap-3">
        <FileText size={18} className="text-gray-400 flex-shrink-0" />
        <p className="text-sm font-medium text-gray-900">{doc.title as string}</p>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Kategorie',
    render: (doc) => doc.category ? (
      <Badge variant={variantFor(doc.category as string, DOC_CATEGORY_VARIANT)}>
        {doc.category as string}
      </Badge>
    ) : null,
  },
  {
    key: 'status',
    header: 'Status',
    render: (doc) => (
      <Badge variant={doc.published ? 'green' : 'gray'}>
        {doc.published ? 'Veröffentlicht' : 'Entwurf'}
      </Badge>
    ),
  },
  {
    key: 'updated',
    header: 'Aktualisiert',
    render: (doc) => (
      <span className="text-sm text-gray-500">
        {doc.updated_at ? new Date(doc.updated_at as string).toLocaleDateString('de-DE') : '–'}
      </span>
    ),
  },
]

export default function DocsSopsPage() {
  const { data: documents, isLoading } = useDocuments()

  return (
    <div>
      <PageHeader title="Dokumente & SOPs" subtitle="Dokumentation und Standard Operating Procedures" action={{ label: 'Neues Dokument' }} />

      {isLoading ? <Spinner /> : documents && documents.length > 0 ? (
        <DataTable columns={columns} data={documents} rowKey={(doc) => doc.id as string} />
      ) : (
        <EmptyState icon={FileText} title="Keine Dokumente" description="Es wurden noch keine Dokumente angelegt." />
      )}
    </div>
  )
}
