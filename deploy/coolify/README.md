# Coolify Deployment – FlowTecsMedia

## Voraussetzungen
- Hetzner VPS (empfohlen: CX21 oder größer)
- Coolify auf dem Server installiert: https://coolify.io/docs
- Domain(s) eingerichtet und auf Server-IP zeigend

## Einmalig: Coolify auf Hetzner einrichten

```bash
# Per SSH auf den Hetzner Server verbinden
ssh root@DEINE-SERVER-IP

# Coolify installieren
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Danach Coolify unter `http://DEINE-SERVER-IP:8000` aufrufen und einrichten.

---

## Website deployen (React + Vite, öffentlich)

1. **Coolify** → New Resource → Application
2. **Source:** GitHub Repo verbinden
3. **Build Pack:** Dockerfile
4. **Dockerfile Location:** `src/frontend/website/Dockerfile`
5. **Build Args:**
   ```
   VITE_API_URL=https://api.deine-domain.de
   ```
6. **Port:** 80
7. **Domain:** `www.deine-domain.de`
8. Deploy 🚀

---

## Webapp deployen (React + Vite, eingeloggt)

1. **Coolify öffnen** → New Resource → Application
2. **Source:** GitHub Repo verbinden
3. **Build Pack:** Dockerfile
4. **Dockerfile Location:** `src/frontend/webapp/Dockerfile`
5. **Build Args** (Environment Variables setzen):
   ```
   VITE_SUPABASE_URL=https://...supabase.co
   VITE_SUPABASE_ANON_KEY=dein-anon-key
   VITE_API_URL=https://api.deine-domain.de
   ```
6. **Port:** 80
7. **Domain:** `app.deine-domain.de`
8. Deploy 🚀

---

## Backend Server deployen (API)

1. **Coolify** → New Resource → Application
2. **Source:** Selbes GitHub Repo
3. **Build Pack:** Dockerfile
4. **Dockerfile Location:** `src/backend/server/Dockerfile`
5. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   DB_TYPE=supabase              # oder: mysql

   # Supabase
   SUPABASE_URL=https://...supabase.co
   SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key

   # MySQL (falls DB_TYPE=mysql)
   MYSQL_HOST=deine-mysql-host
   MYSQL_PORT=3306
   MYSQL_DATABASE=flowtecsm
   MYSQL_USER=flowtecsm
   MYSQL_PASSWORD=sicheres-passwort

   # n8n
   N8N_API_URL=https://n8n.deine-domain.de
   N8N_API_KEY=dein-n8n-api-key
   ```
6. **Port:** 3000
7. **Domain:** `api.deine-domain.de`
8. Deploy 🚀

---

## n8n deployen

1. **Coolify** → New Resource → Application
2. **Source:** Docker Image: `n8nio/n8n:latest`
3. **Environment Variables:**
   ```
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=sicheres-passwort
   N8N_HOST=n8n.deine-domain.de
   N8N_PORT=5678
   N8N_PROTOCOL=https
   WEBHOOK_URL=https://n8n.deine-domain.de
   ```
4. **Persistent Storage:** `/home/node/.n8n` mounten
5. **Port:** 5678
6. **Domain:** `n8n.deine-domain.de`
7. Deploy 🚀

---

## MySQL deployen (falls kein Supabase)

1. **Coolify** → New Resource → Database → MySQL
2. Zugangsdaten setzen
3. Coolify verwaltet Backups automatisch

---

## Empfohlene Domain-Struktur

```
app.deine-domain.de     → Webapp
api.deine-domain.de     → Backend Server
n8n.deine-domain.de     → n8n
```

## Health Checks

Coolify kann Health Checks automatisch konfigurieren:
- Webapp: `GET /health` → 200 ok
- Server: `GET /health` → 200 ok (im Express-Server implementieren)
