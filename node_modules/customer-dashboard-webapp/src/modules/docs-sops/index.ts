import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const DocsSopsPage = lazy(() => import('./pages/DocsSopsPage'))

export const docsSopsModule: IModule = {
  id: 'docs-sops',
  name: 'Dokumente',
  icon: 'FileText',
  description: 'Dokumentenverwaltung und Standard Operating Procedures.',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:docs-sops:read',
  routes: [
    { path: '/docs', element: DocsSopsPage },
  ],
  navItems: [
    { label: 'Dokumente', path: '/docs', icon: 'FileText', group: 'planning' },
  ],
  apiPrefix: '/api/docs-sops',
}
