import { Router, Request, Response } from 'express'
import { getIntegrations, createIntegration, updateIntegration } from './service'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try { res.json({ data: await getIntegrations() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/', async (req: Request, res: Response) => {
  try { res.status(201).json({ data: await createIntegration(req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.patch('/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await updateIntegration(req.params.id, req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

export default router
