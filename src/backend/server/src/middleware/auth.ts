import { Request, Response, NextFunction } from 'express'
import { createError } from './errorHandler'
import { supabase } from '../lib/supabase'

/**
 * Auth Middleware – validiert JWT Token aus Authorization Header
 * Setzt req.user und req.userId für nachfolgende Handler
 *
 * Usage: router.get('/geschuetzt', authMiddleware, handler)
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return next(createError('Kein Token angegeben', 401))
    }

    const token = authHeader.split(' ')[1]

    if (process.env.DB_TYPE === 'mysql') {
      // ── MySQL: eigenes JWT validieren ─────────────────────
      // ✏️ Eigene JWT-Logik hier implementieren
      // Beispiel mit jsonwebtoken:
      // const jwt = require('jsonwebtoken')
      // const payload = jwt.verify(token, process.env.JWT_SECRET!)
      // req.user   = payload as IUser
      // req.userId = payload.id
      return next(createError('JWT Auth für MySQL noch nicht implementiert', 501))
    } else {
      // ── Supabase: Token validieren ─────────────────────────
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return next(createError('Ungültiger oder abgelaufener Token', 401))
      }

      req.userId = user.id
      req.user   = {
        id:            user.id,
        email:         user.email ?? '',
        role:          (user.user_metadata?.role as 'admin' | 'user' | 'guest') ?? 'user',
        isActive:      true,
        emailVerified: !!user.email_confirmed_at,
        createdAt:     user.created_at,
        updatedAt:     user.updated_at ?? user.created_at,
      }
    }

    next()
  } catch {
    next(createError('Auth-Fehler', 401))
  }
}

/**
 * Admin-Only Middleware – nur nach authMiddleware verwenden
 * Usage: router.delete('/alles', authMiddleware, adminMiddleware, handler)
 */
export function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (req.user?.role !== 'admin') {
    return next(createError('Kein Zugriff – Admin erforderlich', 403))
  }
  next()
}
