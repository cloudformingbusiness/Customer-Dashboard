import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const roadmapModule: IBackendModule = {
  id: 'roadmap',
  name: 'Roadmap',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/roadmap',
}
