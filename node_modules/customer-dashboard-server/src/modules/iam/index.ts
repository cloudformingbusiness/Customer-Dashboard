import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const iamModule: IBackendModule = {
  id: 'iam',
  name: 'Benutzerverwaltung',
  version: '1.0.0',
  isCore: true,
  router,
  apiPrefix: '/api/iam',
}
