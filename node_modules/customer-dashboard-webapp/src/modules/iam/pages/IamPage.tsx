import { useRoles, usePermissions } from '../../../hooks/useApi'
import { Shield } from 'lucide-react'
import { PageHeader, Spinner, Badge, Card, DataTable } from '../../../components/ui'
import type { IColumn } from '../../../components/ui'

type Permission = Record<string, unknown>

const permColumns: IColumn<Permission>[] = [
  {
    key: 'name',
    header: 'Berechtigung',
    render: (p) => <span className="text-sm font-medium text-gray-900">{p.name as string}</span>,
  },
  {
    key: 'resource',
    header: 'Ressource',
    render: (p) => <span className="text-sm text-gray-500">{(p.resource as string) ?? '–'}</span>,
  },
  {
    key: 'action',
    header: 'Aktion',
    render: (p) => p.action ? <Badge variant="blue">{p.action as string}</Badge> : null,
  },
]

export default function IamPage() {
  const { data: roles, isLoading: rolesLoading } = useRoles()
  const { data: permissions, isLoading: permissionsLoading } = usePermissions()

  const isLoading = rolesLoading || permissionsLoading

  return (
    <div>
      <PageHeader title="Rollen & Berechtigungen" subtitle="Zugriffskontrolle und Benutzerrollen verwalten" action={{ label: 'Neue Rolle' }} />

      {isLoading ? <Spinner /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Rollen</h2>
            {roles && roles.length > 0 ? (
              <Card className="overflow-hidden">
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
                        <p className="text-sm font-medium text-gray-900">{role.name as string}</p>
                        {role.description ? (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{role.description as string}</p>
                        ) : null}
                      </div>
                      {role.is_system ? <Badge variant="gray">System</Badge> : null}
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <Shield size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Keine Rollen vorhanden</p>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Berechtigungen</h2>
            {permissions && permissions.length > 0 ? (
              <DataTable columns={permColumns} data={permissions} rowKey={(p) => p.id as string} />
            ) : (
              <Card className="p-8 text-center">
                <Shield size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Keine Berechtigungen vorhanden</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
