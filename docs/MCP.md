# MCP & Skills Setup – FlowTecsMedia

Claude Code wird mit zwei Erweiterungen massiv mächtiger für n8n-Arbeit:
- **n8n-MCP** – gibt Claude direkten Zugriff auf 1.084 n8n Nodes, 2.709 Templates, Validation
- **n8n-Skills** – 7 Skill-Dateien die Claude beibringen wie man fehlerfreie Workflows baut

---

## 1. n8n-MCP installieren

### Option A: npx (empfohlen, kein Install nötig)

Claude Code starten und MCP hinzufügen:

```bash
claude mcp add n8n-mcp -- npx n8n-mcp
```

Dann Umgebungsvariablen setzen (einmalig):

```bash
claude mcp add n8n-mcp \
  --env MCP_MODE=stdio \
  --env LOG_LEVEL=error \
  --env DISABLE_CONSOLE_OUTPUT=true \
  --env N8N_API_URL=http://localhost:5678 \
  --env N8N_API_KEY=DEIN_N8N_API_KEY \
  -- npx n8n-mcp
```

### Option B: Docker (isoliert, empfohlen für Produktion)

```bash
# Image holen (einmalig, ~280MB)
docker pull ghcr.io/czlonkowski/n8n-mcp:latest

# MCP in Claude Code registrieren
claude mcp add n8n-mcp \
  -- docker run -i --rm --init \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  -e N8N_API_URL=http://host.docker.internal:5678 \
  -e N8N_API_KEY=DEIN_N8N_API_KEY \
  -e WEBHOOK_SECURITY_MODE=moderate \
  ghcr.io/czlonkowski/n8n-mcp:latest
```

> **Hinweis:** `host.docker.internal` zeigt auf deinen lokalen Rechner.
> Für Coolify/Hetzner: echte Domain verwenden z.B. `https://n8n.deine-domain.de`

### Konfiguration prüfen

```bash
claude mcp list    # Alle MCPs anzeigen
/mcp               # In Claude Code: Status prüfen
```

### N8N_API_KEY ermitteln

n8n öffnen → Settings → API → API Keys → New Key erstellen → kopieren

---

## 2. n8n-Skills installieren

Die Skills lehren Claude wie man n8n Workflows richtig baut.

### Installation (empfohlen: Plugin)

```bash
# In Claude Code:
/plugin install czlonkowski/n8n-skills
```

### Manuell (falls Plugin nicht verfügbar)

```bash
# Repository klonen
git clone https://github.com/czlonkowski/n8n-skills.git /tmp/n8n-skills

# Skills in Claude Code Skills-Verzeichnis kopieren
cp -r /tmp/n8n-skills/skills/* ~/.claude/skills/

# Claude Code neu starten – Skills aktivieren sich automatisch
```

### Was die 7 Skills können

| Skill | Aktiviert automatisch bei |
|---|---|
| **n8n Expression Syntax** | `$json`, `{{}}`, Expression-Fehler |
| **n8n MCP Tools Expert** | Node-Suche, Validation, Templates |
| **n8n Workflow Patterns** | Workflow erstellen, Nodes verbinden |
| **n8n Validation Expert** | Validierungsfehler, Debugging |
| **n8n Node Configuration** | Node konfigurieren, Properties |
| **n8n Code JavaScript** | Code Node, `$input`, `$helpers` |
| **n8n Code Python** | Python in Code Nodes |

---

## 3. .mcp.json im Projekt (projektspezifisch)

Für dieses Projekt eine `.mcp.json` anlegen (liegt in `.gitignore`):

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "DEIN_API_KEY_AUS_ENV"
      }
    }
  }
}
```

> Keys nicht hardcoden – aus `.env` lesen oder leer lassen und in Claude Code setzen.

---

## 4. Telemetrie deaktivieren (optional)

```bash
# npx:
npx n8n-mcp telemetry disable

# Docker: -e N8N_MCP_TELEMETRY_DISABLED=true ergänzen
```

---

## 5. Verwendung in Claude Code

### n8n Workflow bauen

```
"Baue einen n8n Workflow: Webhook empfängt Kontaktformular,
speichert in Supabase, sendet Bestätigungsmail via Gmail,
Slack-Nachricht ans Team."
```

Claude nutzt dann automatisch:
- `search_templates()` – sucht zuerst in 2.709 Vorlagen
- `search_nodes()` – findet passende Nodes
- `get_node()` – holt Konfigurationsdetails
- `validate_node()` – prüft Konfiguration vor dem Bauen
- `validate_workflow()` – Gesamtvalidierung
- `n8n_create_workflow()` – deployed direkt in n8n

### Nützliche Prompts

```
# Workflow bauen
"Erstelle einen n8n Workflow für [Beschreibung]"

# Bestehenden Workflow optimieren
"Analysiere Workflow [ID] und verbessere die Fehlerbehandlung"

# Template finden
"Zeige mir n8n Templates für Slack-Benachrichtigungen"

# Node-Dokumentation
"Wie konfiguriere ich den HTTP Request Node für OAuth2?"
```

### Slash Command verwenden

```bash
/project:new-n8n-workflow mein-workflow-name
```

Claude nutzt dann automatisch MCP + Skills für den besten Workflow.

---

## 6. Wichtige Hinweise

⚠️ **Nie Produktions-Workflows direkt bearbeiten!**
Immer eine Kopie erstellen, in Dev testen, dann deployen.

⚠️ **n8n-MCP braucht laufende n8n-Instanz**
`N8N_API_URL` muss erreichbar sein für Management-Features.
Ohne API-Key: nur Dokumentation + Validation verfügbar.

✅ **MCP + Skills zusammen = beste Ergebnisse**
MCP gibt Claude Daten, Skills geben Claude das Know-How.

---

## Quellen

- n8n-MCP: https://github.com/czlonkowski/n8n-mcp
- n8n-Skills: https://github.com/czlonkowski/n8n-skills
- n8n API Docs: https://docs.n8n.io/api/
