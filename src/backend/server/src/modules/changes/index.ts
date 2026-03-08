import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const changesModule: IBackendModule = {
  id: 'changes',
  name: 'Changes',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/changes',
}
