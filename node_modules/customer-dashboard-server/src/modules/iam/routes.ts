import { Router, Request, Response } from 'express'
import { getRoles, getPermissions, getUsersWithRoles, assignRoleToUser } from './service'

const router = Router()

router.get('/roles', async (_req: Request, res: Response) => {
  try {
    const roles = await getRoles()
    res.json({ data: roles })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.get('/permissions', async (_req: Request, res: Response) => {
  try {
    const permissions = await getPermissions()
    res.json({ data: permissions })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await getUsersWithRoles()
    res.json({ data: users })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/users/:userId/roles', async (req: Request, res: Response) => {
  try {
    const { role, organizationId } = req.body as { role: string; organizationId?: string }
    await assignRoleToUser(req.params.userId, role, organizationId, req.userId)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
