import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const IamPage = lazy(() => import('./pages/IamPage'))

export const iamModule: IModule = {
  id: 'iam',
  name: 'Einstellungen',
  icon: 'Shield',
  description: 'Identity & Access Management, Benutzer- und Rechteverwaltung.',
  version: '1.0.0',
  isCore: true,
  requiredPermission: 'module:iam:read',
  routes: [
    { path: '/settings', element: IamPage },
  ],
  navItems: [
    { label: 'Einstellungen', path: '/settings', icon: 'Shield' },
  ],
  apiPrefix: '/api/iam',
}
