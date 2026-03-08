import request from 'supertest'
import app from '../../index'

describe('GET /health', () => {
  it('gibt 200 und "ok" zurück', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.text).toBe('ok')
  })
})

describe('GET /api/n8n/workflows – Auth Guard', () => {
  it('gibt 401 ohne Token zurück', async () => {
    const res = await request(app).get('/api/n8n/workflows')
    expect(res.status).toBe(401)
  })

  it('gibt 401 bei ungültigem Token zurück', async () => {
    const res = await request(app)
      .get('/api/n8n/workflows')
      .set('Authorization', 'Bearer ungueltig')
    expect(res.status).toBe(401)
  })
})
