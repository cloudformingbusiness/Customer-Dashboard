Erstelle einen neuen n8n Workflow für: $ARGUMENTS

## Schritt 1 – MCP-Tools nutzen (falls n8n-MCP aktiv)

Status prüfen: `/mcp` → ist `n8n-mcp` in der Liste?

**Ja → MCP-Workflow:**
```
1. search_templates({ query: "$ARGUMENTS" })
   → Passende Vorlage gefunden? Direkt nutzen mit get_template()

2. search_nodes({ query: "[benötigte Nodes]", includeExamples: true })
   → Nodes finden

3. get_node({ nodeType: "...", detail: "standard", includeExamples: true })
   → Konfiguration holen

4. validate_node({ nodeType: "...", config: {...}, mode: "full" })
   → Vor dem Bauen validieren

5. validate_workflow(workflow)
   → Gesamtworkflow prüfen

6. n8n_create_workflow(workflow)
   → Direkt in n8n deployen
```

**Nein → Manuell:**
- Workflow in n8n UI bauen
- Fehlerbehandlung (Error-Branch) einbauen
- Webhook-Node als Trigger falls von außen auslösbar

---

## Schritt 2 – Exportieren

Workflow aus n8n exportieren:
`src/backend/n8n/workflows/$ARGUMENTS.json`

---

## Schritt 3 – README aktualisieren

`src/backend/n8n/workflows/README.md` – Zeile ergänzen:

| Name | Trigger | Zweck | Webhook-Pfad |
|---|---|---|---|
| $ARGUMENTS | Webhook | ✏️ Zweck | /api/n8n/trigger/✏️pfad |

---

## Schritt 4 – Backend-Route prüfen

`src/backend/server/src/routes/n8n.ts` – der generische
`/trigger/:webhookPath` Handler deckt alle Pfade ab.
Nur bei neuen Auth-Anforderungen anpassen.

---

## Schritt 5 – Postman-Request ergänzen

`postman/FlowTecsMedia.postman_collection.json`:

```json
{
  "name": "Trigger: $ARGUMENTS",
  "request": {
    "method": "POST",
    "url": "{{baseUrl}}/api/n8n/trigger/WEBHOOK_PFAD",
    "header": [{"key": "Content-Type", "value": "application/json"}],
    "body": { "mode": "raw", "raw": "{}" }
  },
  "event": [{
    "listen": "test",
    "script": { "exec": [
      "pm.test(\"Status 200\", () => pm.response.to.have.status(200))"
    ]}
  }]
}
```

---

## Schritt 6 – Abschluss

- [ ] Workflow in n8n aktiv und getestet
- [ ] JSON exportiert
- [ ] Postman-Request funktioniert
- [ ] `.claude/progress.md` aktualisieren
