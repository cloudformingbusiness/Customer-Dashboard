import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const ExecutiveSummaryPage = lazy(() => import('./pages/ExecutiveSummaryPage'))

export const executiveSummaryModule: IModule = {
  id: 'executive-summary',
  name: 'Übersicht',
  icon: 'LayoutDashboard',
  description: 'Zentrale Übersicht mit den wichtigsten Kennzahlen und Status-Informationen.',
  version: '1.0.0',
  isCore: true,
  requiredPermission: '',
  routes: [
    { path: '/dashboard', element: ExecutiveSummaryPage },
  ],
  navItems: [
    { label: 'Übersicht', path: '/dashboard', icon: 'LayoutDashboard' },
  ],
  apiPrefix: '/api/executive-summary',
}
