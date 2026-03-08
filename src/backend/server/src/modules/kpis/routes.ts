import { Router, Request, Response } from 'express'
import { getKpis, getKpi, createKpi, updateKpi, getKpiHistory, addKpiHistoryEntry } from './service'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try { res.json({ data: await getKpis() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.get('/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await getKpi(req.params.id) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/', async (req: Request, res: Response) => {
  try { res.status(201).json({ data: await createKpi(req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.patch('/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await updateKpi(req.params.id, req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.get('/:id/history', async (req: Request, res: Response) => {
  try { res.json({ data: await getKpiHistory(req.params.id) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/:id/history', async (req: Request, res: Response) => {
  try { res.status(201).json({ data: await addKpiHistoryEntry(req.params.id, req.body.value) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

export default router
