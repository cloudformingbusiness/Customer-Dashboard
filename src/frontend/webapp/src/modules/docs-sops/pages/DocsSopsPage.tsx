import { useDocuments } from '../../../hooks/useApi'
import { FileText, Plus } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  sop: 'bg-blue-100 text-blue-700',
  policy: 'bg-purple-100 text-purple-700',
  guide: 'bg-green-100 text-green-700',
  template: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-600',
}

export default function DocsSopsPage() {
  const { data: documents, isLoading } = useDocuments()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokumente & SOPs</h1>
          <p className="text-gray-500 mt-1">Dokumentation und Standard Operating Procedures</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Neues Dokument
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : documents && documents.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Titel</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Kategorie</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Aktualisiert</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id as string} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900">{doc.title as string}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {doc.category ? (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[doc.category as string] ?? 'bg-gray-100 text-gray-600'}`}>
                        {doc.category as string}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      doc.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {doc.published ? 'Veröffentlicht' : 'Entwurf'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doc.updated_at
                      ? new Date(doc.updated_at as string).toLocaleDateString('de-DE')
                      : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Keine Dokumente</h3>
          <p className="text-gray-500 mt-1">Es wurden noch keine Dokumente angelegt.</p>
        </div>
      )}
    </div>
  )
}
