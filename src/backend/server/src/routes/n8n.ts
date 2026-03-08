import { Router, Request, Response } from 'express'
import {
  getWorkflows,
  getWorkflow,
  activateWorkflow,
  deactivateWorkflow,
  getExecutions,
  triggerWebhook,
} from '../lib/n8n'

const router = Router()

/**
 * GET /api/n8n/workflows
 * Alle Workflows abrufen
 */
router.get('/workflows', async (_req: Request, res: Response) => {
  try {
    const workflows = await getWorkflows()
    res.json({ data: workflows })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

/**
 * GET /api/n8n/workflows/:id
 * Einzelnen Workflow abrufen
 */
router.get('/workflows/:id', async (req: Request, res: Response) => {
  try {
    const workflow = await getWorkflow(req.params.id)
    res.json({ data: workflow })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

/**
 * POST /api/n8n/workflows/:id/activate
 * Workflow aktivieren
 */
router.post('/workflows/:id/activate', async (req: Request, res: Response) => {
  try {
    await activateWorkflow(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

/**
 * POST /api/n8n/workflows/:id/deactivate
 * Workflow deaktivieren
 */
router.post('/workflows/:id/deactivate', async (req: Request, res: Response) => {
  try {
    await deactivateWorkflow(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

/**
 * GET /api/n8n/workflows/:id/executions
 * Ausführungen eines Workflows abrufen
 */
router.get('/workflows/:id/executions', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 20
    const executions = await getExecutions(req.params.id, limit)
    res.json({ data: executions })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

/**
 * POST /api/n8n/trigger/:webhookPath
 * Workflow via Webhook auslösen
 * Body: beliebiges JSON-Payload
 */
router.post('/trigger/:webhookPath', async (req: Request, res: Response) => {
  try {
    const result = await triggerWebhook(req.params.webhookPath, req.body)
    res.json({ data: result })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
