import { lazy } from 'react'
import type { IModule } from '../_registry/types'

const VoiceAgentPage = lazy(() => import('./pages/VoiceAgentPage'))
const VoiceAgentConfigPage = lazy(() => import('./pages/VoiceAgentConfigPage'))

export const voiceAgentModule: IModule = {
  id: 'voice-agent',
  name: 'Voice Agent',
  icon: 'Phone',
  description: 'Voice Agent KPI-Tracking',
  version: '1.0.0',
  isCore: false,
  requiredPermission: 'module:voice-agent:read',
  routes: [
    { path: '/voice-agent', element: VoiceAgentPage },
    { path: '/voice-agent/config', element: VoiceAgentConfigPage },
  ],
  navItems: [
    { label: 'Voice Agent', path: '/voice-agent', icon: 'Phone', group: 'addons' },
    { label: 'VA Konfiguration', path: '/voice-agent/config', icon: 'Settings', group: 'addons' },
  ],
  apiPrefix: '/api/voice-agent',
}
