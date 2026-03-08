import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const docsSopsModule: IBackendModule = {
  id: 'docs-sops',
  name: 'Dokumente',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/docs',
}
