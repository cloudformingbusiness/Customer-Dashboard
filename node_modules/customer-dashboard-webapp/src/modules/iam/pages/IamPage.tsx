import { useRoles, usePermissions } from '../../../hooks/useApi'
import { Shield, Plus } from 'lucide-react'

export default function IamPage() {
  const { data: roles, isLoading: rolesLoading } = useRoles()
  const { data: permissions, isLoading: permissionsLoading } = usePermissions()

  const isLoading = rolesLoading || permissionsLoading

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rollen & Berechtigungen</h1>
          <p className="text-gray-500 mt-1">Zugriffskontrolle und Benutzerrollen verwalten</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Neue Rolle
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roles */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Rollen</h2>
            {roles && roles.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {roles.map((role) => (
                    <div
                      key={role.id as string}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {role.name as string}
                        </p>
                        {role.description ? (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {role.description as string}
                          </p>
                        ) : null}
                      </div>
                      {role.is_system ? (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600 flex-shrink-0">
                          System
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                <Shield size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Keine Rollen vorhanden</p>
              </div>
            )}
          </div>

          {/* Permissions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Berechtigungen</h2>
            {permissions && permissions.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Berechtigung</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ressource</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm) => (
                      <tr key={perm.id as string} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          {perm.name as string}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {(perm.resource as string) ?? '–'}
                        </td>
                        <td className="px-6 py-3">
                          {perm.action ? (
                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                              {perm.action as string}
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                <Shield size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Keine Berechtigungen vorhanden</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
