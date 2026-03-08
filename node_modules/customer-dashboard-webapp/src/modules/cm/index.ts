import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const CmPage = lazy(() => import('./pages/CmPage'))

export const cmModule: IModule = {
  id: 'cm',
  name: 'Kontakte',
  icon: 'Users',
  description: 'Kontaktverwaltung und Kundenmanagement.',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:cm:read',
  routes: [
    { path: '/contacts', element: CmPage },
  ],
  navItems: [
    { label: 'Kontakte', path: '/contacts', icon: 'Users' },
  ],
  apiPrefix: '/api/cm',
}
