import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const AutomationsPage = lazy(() => import('./pages/AutomationsPage'))

export const automationsModule: IModule = {
  id: 'automations',
  name: 'Automationen',
  icon: 'Workflow',
  description: 'Verwaltung und Überwachung von Automatisierungs-Workflows.',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:automations:read',
  routes: [
    { path: '/automations', element: AutomationsPage },
  ],
  navItems: [
    { label: 'Automationen', path: '/automations', icon: 'Workflow' },
  ],
  apiPrefix: '/api/automations',
}
