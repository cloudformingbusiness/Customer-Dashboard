import { Router, Request, Response } from 'express'
import { getDocuments, getDocument, createDocument, updateDocument, deleteDocument } from './service'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try { res.json({ data: await getDocuments() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.get('/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await getDocument(req.params.id) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/', async (req: Request, res: Response) => {
  try { res.status(201).json({ data: await createDocument(req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.patch('/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await updateDocument(req.params.id, req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try { await deleteDocument(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

export default router
