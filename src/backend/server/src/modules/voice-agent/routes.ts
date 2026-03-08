import { Router, Request, Response } from 'express'
import { getCalls, getCallById, createCall, updateCall, getStats, getConfig, upsertConfig } from './service'
import { getWorkflow, getExecutions, activateWorkflow, deactivateWorkflow } from '../../lib/n8n'

const router = Router()

// ── Stats ────────────────────────────────────────────────────
router.get('/stats', async (_req: Request, res: Response) => {
  try { res.json({ data: await getStats() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

// ── Calls ────────────────────────────────────────────────────
router.get('/calls', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200)
    const offset = Number(req.query.offset) || 0
    const result = await getCalls(limit, offset)
    res.json({ data: result.data, total: result.total })
  } catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.get('/calls/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await getCallById(req.params.id) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/calls', async (req: Request, res: Response) => {
  try { res.status(201).json({ data: await createCall(req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.patch('/calls/:id', async (req: Request, res: Response) => {
  try { res.json({ data: await updateCall(req.params.id, req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

// ── Webhook (provider-agnostic) ──────────────────────────────
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const data = await createCall(req.body)
    res.status(201).json({ data })
  } catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

// ── Config ───────────────────────────────────────────────────
router.get('/config', async (_req: Request, res: Response) => {
  try { res.json({ data: await getConfig() }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.put('/config', async (req: Request, res: Response) => {
  try { res.json({ data: await upsertConfig(req.body) }) }
  catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

// ── n8n Workflow Status ──────────────────────────────────────
router.get('/n8n/status/:workflowId', async (req: Request, res: Response) => {
  try {
    const workflow = await getWorkflow(req.params.workflowId)
    const executions = await getExecutions(req.params.workflowId, 10)
    res.json({
      data: {
        workflow: {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active,
          updatedAt: workflow.updatedAt,
        },
        recentExecutions: executions.map((e) => ({
          id: e.id,
          status: e.status,
          startedAt: e.startedAt,
          stoppedAt: e.stoppedAt,
        })),
        n8nUrl: process.env.N8N_API_URL,
      },
    })
  } catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/n8n/activate/:workflowId', async (req: Request, res: Response) => {
  try {
    await activateWorkflow(req.params.workflowId)
    res.json({ data: { active: true } })
  } catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

router.post('/n8n/deactivate/:workflowId', async (req: Request, res: Response) => {
  try {
    await deactivateWorkflow(req.params.workflowId)
    res.json({ data: { active: false } })
  } catch (err) { res.status(500).json({ error: (err as Error).message }) }
})

export default router
