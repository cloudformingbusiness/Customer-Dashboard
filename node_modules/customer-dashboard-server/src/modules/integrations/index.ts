import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const integrationsModule: IBackendModule = {
  id: 'integrations',
  name: 'Integrationen',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/integrations',
}
