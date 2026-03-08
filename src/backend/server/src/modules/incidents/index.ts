import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const incidentsModule: IBackendModule = {
  id: 'incidents',
  name: 'Incidents',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/incidents',
}
