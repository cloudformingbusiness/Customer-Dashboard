import { Router, Request, Response } from 'express'
import {
  getWorkflows,
  getWorkflow,
  activateWorkflow,
  deactivateWorkflow,
  getExecutions,
  triggerWebhook,
} from '../../lib/n8n'
import { getAutomations, createAutomation, updateAutomation } from './service'

const router = Router()

// ── n8n Workflow Routes (live from n8n API) ──────────────────

router.get('/workflows', async (_req: Request, res: Response) => {
  try {
    const workflows = await getWorkflows()
    res.json({ data: workflows })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.get('/workflows/:id', async (req: Request, res: Response) => {
  try {
    const workflow = await getWorkflow(req.params.id)
    res.json({ data: workflow })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/workflows/:id/activate', async (req: Request, res: Response) => {
  try {
    await activateWorkflow(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/workflows/:id/deactivate', async (req: Request, res: Response) => {
  try {
    await deactivateWorkflow(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.get('/workflows/:id/executions', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 20
    const executions = await getExecutions(req.params.id, limit)
    res.json({ data: executions })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/trigger/:webhookPath', async (req: Request, res: Response) => {
  try {
    const result = await triggerWebhook(req.params.webhookPath, req.body)
    res.json({ data: result })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// ── DB-tracked Automations (from Supabase) ───────────────────

router.get('/tracked', async (_req: Request, res: Response) => {
  try { res.json({ data: await getAutomations() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/tracked', async (req: Request, res: Response) => {
  try { res.status(201).json({ data: await createAutomation(req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.patch('/tracked/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await updateAutomation(req.params.id, req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

export default router
