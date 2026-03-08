import { Router, Request, Response } from 'express'
import { getContacts, getContact, createContact, updateContact, deleteContact, getTeams, createTeam } from './service'

const router = Router()

router.get('/contacts', async (_req: Request, res: Response) => {
  try { res.json({ data: await getContacts() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.get('/contacts/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await getContact(req.params.id) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/contacts', async (req: Request, res: Response) => {
  try { res.status(201).json({ data: await createContact(req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.patch('/contacts/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await updateContact(req.params.id, req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.delete('/contacts/:id', async (req: Request, res: Response) => {
  try { await deleteContact(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.get('/teams', async (_req: Request, res: Response) => {
  try { res.json({ data: await getTeams() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/teams', async (req: Request, res: Response) => {
  try { res.status(201).json({ data: await createTeam(req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

export default router
