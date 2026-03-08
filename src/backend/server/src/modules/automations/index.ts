import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const automationsModule: IBackendModule = {
  id: 'automations',
  name: 'Automationen',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/automations',
}
