import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const CustomerOnboardingPage = lazy(() => import('./pages/CustomerOnboardingPage'))

export const customerOnboardingModule: IModule = {
  id: 'customer-onboarding',
  name: 'Kunden-Onboarding',
  icon: 'UserPlus',
  description: 'Kunden-Onboarding Workflows',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:customer-onboarding:read',
  routes: [
    { path: '/customer-onboarding', element: CustomerOnboardingPage },
  ],
  navItems: [
    { label: 'Kunden-Onboarding', path: '/customer-onboarding', icon: 'UserPlus' },
  ],
  apiPrefix: '/api/customer-onboarding',
}
