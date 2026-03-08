import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const cmModule: IBackendModule = {
  id: 'cm',
  name: 'Kontakte',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/cm',
}
