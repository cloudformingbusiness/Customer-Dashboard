import { Router, Request, Response } from 'express'
import { getOnboardingChecklist } from './service'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try { res.json({ data: await getOnboardingChecklist() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

export default router
