import { Request, Response, NextFunction } from 'express'

export interface IAppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export function errorHandler(
  err: IAppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500
  const message    = err.message    || 'Interner Serverfehler'

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${statusCode} – ${message}`, err.stack)
  }

  res.status(statusCode).json({
    error:   message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

/** Hilfsfunktion für bekannte Fehler */
export function createError(message: string, statusCode = 500): IAppError {
  const err: IAppError = new Error(message)
  err.statusCode    = statusCode
  err.isOperational = true
  return err
}
