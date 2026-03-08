import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const RoadmapPage = lazy(() => import('./pages/RoadmapPage'))

export const roadmapModule: IModule = {
  id: 'roadmap',
  name: 'Roadmap',
  icon: 'Map',
  description: 'Projekt-Roadmap mit Meilensteinen und Zeitplanung.',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:roadmap:read',
  routes: [
    { path: '/roadmap', element: RoadmapPage },
  ],
  navItems: [
    { label: 'Roadmap', path: '/roadmap', icon: 'Map', group: 'planning' },
  ],
  apiPrefix: '/api/roadmap',
}
