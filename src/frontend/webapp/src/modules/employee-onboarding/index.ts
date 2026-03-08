import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const EmployeeOnboardingPage = lazy(() => import('./pages/EmployeeOnboardingPage'))

export const employeeOnboardingModule: IModule = {
  id: 'employee-onboarding',
  name: 'Mitarbeiter-Onboarding',
  icon: 'UserCheck',
  description: 'Mitarbeiter-Onboarding Checklisten',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:employee-onboarding:read',
  routes: [
    { path: '/employee-onboarding', element: EmployeeOnboardingPage },
  ],
  navItems: [
    { label: 'Mitarbeiter-Onboarding', path: '/employee-onboarding', icon: 'UserCheck', group: 'addons' },
  ],
  apiPrefix: '/api/employee-onboarding',
}
