import { useContacts } from '../../../hooks/useApi'
import { Plus, Users } from 'lucide-react'

const TYPE_COLORS: Record<string, string> = {
  customer: 'bg-blue-100 text-blue-700',
  partner: 'bg-purple-100 text-purple-700',
  vendor: 'bg-orange-100 text-orange-700',
  internal: 'bg-gray-100 text-gray-600',
}

export default function CmPage() {
  const { data: contacts, isLoading } = useContacts()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kontakte</h1>
          <p className="text-gray-500 mt-1">Kontakte und Ansprechpartner verwalten</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Neuer Kontakt
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : contacts && contacts.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">E-Mail</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Typ</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Unternehmen</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id as string} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{contact.name as string}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(contact.email as string) ?? '–'}
                  </td>
                  <td className="px-6 py-4">
                    {contact.type ? (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[contact.type as string] ?? 'bg-gray-100 text-gray-600'}`}>
                        {contact.type as string}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(contact.company as string) ?? '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Keine Kontakte</h3>
          <p className="text-gray-500 mt-1">Es wurden noch keine Kontakte angelegt.</p>
        </div>
      )}
    </div>
  )
}
