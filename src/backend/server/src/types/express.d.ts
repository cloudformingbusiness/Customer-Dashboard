import 'express'
import type { IUser } from '../../../../shared/types'

// Erweitert Express Request um req.user
declare module 'express' {
  interface Request {
    /** Eingeloggter User – gesetzt durch authMiddleware */
    user?: IUser
    /** User ID shortcut */
    userId?: string
  }
}
