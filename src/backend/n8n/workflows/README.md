# n8n Workflows – FlowTecsMedia

Hier werden exportierte n8n Workflow-JSONs gespeichert.

## Workflow exportieren

In n8n: Workflow öffnen → **⋮ Menü → Download**
Datei hier ablegen: `src/backend/n8n/workflows/mein-workflow.json`

## Workflow importieren

In n8n: **Workflows → Import from File**

## Verfügbare Workflows

<!-- ✏️ Hier dokumentieren welche Workflows existieren -->
| Datei | Beschreibung | Webhook-Pfad |
|---|---|---|
| `beispiel.json` | Beispiel-Workflow | `beispiel` |

## Webhook aufrufen (via API)

```bash
# Direkt via curl
curl -X POST https://deine-n8n-instanz.com/webhook/mein-pfad \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Via FlowTecsMedia Backend API
curl -X POST http://localhost:3000/api/n8n/trigger/mein-pfad \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```
