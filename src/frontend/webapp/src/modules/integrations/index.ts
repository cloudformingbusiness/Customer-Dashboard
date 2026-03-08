import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'))

export const integrationsModule: IModule = {
  id: 'integrations',
  name: 'Integrationen',
  icon: 'Plug',
  description: 'Übersicht und Verwaltung externer Integrationen und Schnittstellen.',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:integrations:read',
  routes: [
    { path: '/integrations', element: IntegrationsPage },
  ],
  navItems: [
    { label: 'Integrationen', path: '/integrations', icon: 'Plug' },
  ],
  apiPrefix: '/api/integrations',
}
