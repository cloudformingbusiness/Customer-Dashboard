import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const KpisPage = lazy(() => import('./pages/KpisPage'))

export const kpisModule: IModule = {
  id: 'kpis',
  name: 'KPIs',
  icon: 'BarChart3',
  description: 'Key Performance Indicators und Leistungskennzahlen im Überblick.',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:kpis:read',
  routes: [
    { path: '/kpis', element: KpisPage },
  ],
  navItems: [
    { label: 'KPIs', path: '/kpis', icon: 'BarChart3', group: 'operations' },
  ],
  apiPrefix: '/api/kpis',
}
