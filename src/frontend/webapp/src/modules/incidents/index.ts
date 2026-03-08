import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const IncidentsPage = lazy(() => import('./pages/IncidentsPage'))

export const incidentsModule: IModule = {
  id: 'incidents',
  name: 'Incidents',
  icon: 'AlertTriangle',
  description: 'Erfassung und Nachverfolgung von Störungen und Vorfällen.',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:incidents:read',
  routes: [
    { path: '/incidents', element: IncidentsPage },
  ],
  navItems: [
    { label: 'Incidents', path: '/incidents', icon: 'AlertTriangle', group: 'operations' },
  ],
  apiPrefix: '/api/incidents',
}
