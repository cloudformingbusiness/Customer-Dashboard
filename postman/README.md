# Postman – FlowTecsMedia

## Dateien

| Datei | Beschreibung |
|---|---|
| `FlowTecsMedia.postman_collection.json` | Alle API-Endpunkte mit Tests |
| `FlowTecsMedia-Local.postman_environment.json` | Variablen für lokale Entwicklung |
| `FlowTecsMedia-Production.postman_environment.json` | Variablen für Produktion |

## Import in Postman

1. Postman öffnen
2. **Import** (oben links) → Dateien auswählen
3. Alle 3 Dateien aus diesem Ordner importieren
4. Environment wählen: **FlowTecsMedia – Local**

## Workflow

1. Zuerst **Auth → Login** ausführen → Token wird automatisch gespeichert
2. Alle weiteren Requests nutzen `{{authToken}}` automatisch

## Neue Routen hinzufügen

Collection exportieren und Datei hier ersetzen:
Postman → Collection → ⋯ → Export → Collection v2.1

## Variables

| Variable | Beschreibung | Beispiel |
|---|---|---|
| `{{baseUrl}}` | API Server URL | `http://localhost:3000` |
| `{{authToken}}` | JWT Token (wird beim Login gesetzt) | `eyJ...` |
| `{{workflowId}}` | n8n Workflow ID | `1` |
| `{{webhookPath}}` | n8n Webhook Pfad | `neue-anfrage` |
