import type { IBackendModule } from '../_registry/types'
import router from './routes'

export const voiceAgentModule: IBackendModule = {
  id: 'voice-agent',
  name: 'Voice Agent',
  version: '1.0.0',
  isCore: false,
  router,
  apiPrefix: '/api/voice-agent',
}
