import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const customerOnboardingModule: IBackendModule = {
  id: 'customer-onboarding',
  name: 'Kunden-Onboarding',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/customer-onboarding',
}
