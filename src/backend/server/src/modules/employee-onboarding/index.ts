import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const employeeOnboardingModule: IBackendModule = {
  id: 'employee-onboarding',
  name: 'Mitarbeiter-Onboarding',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/employee-onboarding',
}
