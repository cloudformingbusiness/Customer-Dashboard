import { Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../../middleware/auth'
import { createError } from '../../middleware/errorHandler'

// Supabase mocken damit kein echter API-Call gemacht wird
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}))

import { supabase } from '../../lib/supabase'

const mockReq = (authHeader?: string): Partial<Request> => ({
  headers: authHeader ? { authorization: authHeader } : {},
})

const mockRes = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json:   jest.fn().mockReturnThis(),
})

const mockNext = jest.fn() as NextFunction

beforeEach(() => jest.clearAllMocks())

describe('authMiddleware', () => {
  it('ruft next(401) auf ohne Authorization-Header', async () => {
    await authMiddleware(mockReq() as Request, mockRes() as Response, mockNext)
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('ruft next(401) auf mit falschem Schema (kein Bearer)', async () => {
    await authMiddleware(
      mockReq('Basic abc123') as Request,
      mockRes() as Response,
      mockNext
    )
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('ruft next(401) auf wenn Supabase ungültigen Token zurückgibt', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: new Error('Invalid token'),
    })

    await authMiddleware(
      mockReq('Bearer ungueltig.jwt.token') as Request,
      mockRes() as Response,
      mockNext
    )
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('setzt req.user und ruft next() auf bei gültigem Token', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: {
        user: {
          id:                  'user-123',
          email:               'test@test.de',
          email_confirmed_at:  '2024-01-01',
          user_metadata:       { role: 'user' },
          created_at:          '2024-01-01',
          updated_at:          '2024-01-01',
        },
      },
      error: null,
    })

    const req = mockReq('Bearer gueltig.jwt.token') as Request
    await authMiddleware(req, mockRes() as Response, mockNext)

    expect(mockNext).toHaveBeenCalledWith()  // next() ohne Fehler
    expect(req.userId).toBe('user-123')
    expect(req.user?.email).toBe('test@test.de')
  })
})
