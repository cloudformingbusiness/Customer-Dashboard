import { Router, Request, Response } from 'express'
import { getIncidents, getIncident, createIncident, updateIncident } from './service'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try { res.json({ data: await getIncidents() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.get('/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await getIncident(req.params.id) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/', async (req: Request, res: Response) => {
  try { res.status(201).json({ data: await createIncident(req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.patch('/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await updateIncident(req.params.id, req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

export default router
