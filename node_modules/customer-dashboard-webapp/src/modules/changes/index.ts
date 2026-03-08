import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const ChangesPage = lazy(() => import('./pages/ChangesPage'))

export const changesModule: IModule = {
  id: 'changes',
  name: 'Changes',
  icon: 'GitBranch',
  description: 'Change-Management und Nachverfolgung von Änderungen.',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:changes:read',
  routes: [
    { path: '/changes', element: ChangesPage },
  ],
  navItems: [
    { label: 'Changes', path: '/changes', icon: 'GitBranch', group: 'operations' },
  ],
  apiPrefix: '/api/changes',
}
