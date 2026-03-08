Erstelle eine neue API-Route: $ARGUMENTS

## 1. Route: `src/backend/server/src/routes/$ARGUMENTS.ts`

Vollständiger Express Router mit:
- `GET    /api/$ARGUMENTS`       – Liste
- `GET    /api/$ARGUMENTS/:id`   – Einzeln
- `POST   /api/$ARGUMENTS`       – Erstellen
- `PUT    /api/$ARGUMENTS/:id`   – Aktualisieren
- `DELETE /api/$ARGUMENTS/:id`   – Löschen

Jede Route:
- `authMiddleware` aus `../middleware/auth`
- Return-Typen aus `src/shared/types` (`IApiResponse`, `IApiListResponse`)
- Fehler via `next(err)` – nie direkt `res.status(500)`
- JSDoc mit `@route`, `@auth required`

## 2. Registrierung in `src/backend/server/src/index.ts`

```typescript
import $ARGUMENTSRouter from './routes/$ARGUMENTS'
app.use('/api/$ARGUMENTS', $ARGUMENTSRouter)
```

## 3. Shared Type in `src/shared/types/index.ts`

```typescript
export interface I$ARGUMENTS {
  id:        string
  // ✏️ Felder ergänzen
  createdAt: string
  updatedAt: string
}
```

## 4. Test: `src/backend/server/src/__tests__/routes/$ARGUMENTS.test.ts`

```typescript
import request from 'supertest'
import app from '../../index'

describe('$ARGUMENTS API', () => {

  describe('Ohne Auth', () => {
    it('GET /api/$ARGUMENTS → 401', async () => {
      const res = await request(app).get('/api/$ARGUMENTS')
      expect(res.status).toBe(401)
    })
    it('POST /api/$ARGUMENTS → 401', async () => {
      const res = await request(app).post('/api/$ARGUMENTS').send({})
      expect(res.status).toBe(401)
    })
    it('DELETE /api/$ARGUMENTS/123 → 401', async () => {
      const res = await request(app).delete('/api/$ARGUMENTS/123')
      expect(res.status).toBe(401)
    })
  })

  describe('Mit Auth', () => {
    const token = process.env.TEST_TOKEN || ''

    it('GET /api/$ARGUMENTS → 200 mit Array', async () => {
      const res = await request(app)
        .get('/api/$ARGUMENTS')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.data).toBeInstanceOf(Array)
    })

    it('POST /api/$ARGUMENTS → 201 erstellt Eintrag', async () => {
      const res = await request(app)
        .post('/api/$ARGUMENTS')
        .set('Authorization', `Bearer ${token}`)
        .send({ /* ✏️ Testdaten */ })
      expect(res.status).toBe(201)
    })

    // ✏️ Weitere Tests ergänzen
  })
})
```

Test ausführen:
```bash
cd src/backend/server && npm run test
```

## 5. Postman Collection ergänzen

`postman/FlowTecsMedia.postman_collection.json` – neuen Ordner mit Requests:

```
📁 $ARGUMENTS
  GET    {{baseUrl}}/api/$ARGUMENTS              – Liste
  GET    {{baseUrl}}/api/$ARGUMENTS/:id          – Einzeln
  POST   {{baseUrl}}/api/$ARGUMENTS              – Erstellen
  PUT    {{baseUrl}}/api/$ARGUMENTS/:id          – Aktualisieren
  DELETE {{baseUrl}}/api/$ARGUMENTS/:id          – Löschen
```

Alle Requests: Header `Authorization: Bearer {{authToken}}`

Tests im Postman-Request:
```javascript
// GET Liste
pm.test("Status 200", () => pm.response.to.have.status(200))
pm.test("Gibt Array zurück", () => {
  const body = pm.response.json()
  pm.expect(body.data).to.be.an('array')
})

// POST Erstellen
pm.test("Status 201", () => pm.response.to.have.status(201))
```

## 6. Abschluss

- [ ] Tests grün: `npm run test`
- [ ] Postman-Request manuell testen
- [ ] `.claude/progress.md` aktualisieren
