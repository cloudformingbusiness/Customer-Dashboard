import type { Router } from 'express'

export interface IBackendModule {
  id: string
  name: string
  version: string
  isCore: boolean
  router: Router
  apiPrefix: string
  initialize?: () => Promise<void>
}
