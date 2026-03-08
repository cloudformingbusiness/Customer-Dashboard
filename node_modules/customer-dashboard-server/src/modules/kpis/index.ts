import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const kpisModule: IBackendModule = {
  id: 'kpis',
  name: 'KPIs',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/kpis',
}
