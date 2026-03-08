# SFTP Deploy – FlowTecsMedia Website

## Setup

### 1. Abhängigkeit installieren
```bash
cd /projektroot
npm install --save-dev ssh2-sftp-client dotenv
```

### 2. .env konfigurieren
```env
# SFTP Verbindung
SFTP_HOST=deine-server-ip-oder-domain.de
SFTP_PORT=22
SFTP_USER=dein-sftp-user

# Authentifizierung – eines von beiden:
SFTP_PASSWORD=dein-passwort
SFTP_KEY_PATH=~/.ssh/id_ed25519       # Empfohlen

# Ziel-Verzeichnis auf dem Server
SFTP_REMOTE_DIR=/var/www/html

# URL für Abschluss-Meldung
WEBSITE_URL=https://www.deine-domain.de
```

### 3. Deploy ausführen

```bash
# Normal (Build + Upload)
node deploy/sftp/deploy-website.js

# Nur Upload, kein Build
node deploy/sftp/deploy-website.js --no-build

# Dry Run (zeigt was hochgeladen würde)
node deploy/sftp/deploy-website.js --dry-run
```

Oder via VSCode Task: **`📡 SFTP: Website deployen`**

## SSH Key einrichten (empfohlen)

```bash
# Key generieren
ssh-keygen -t ed25519 -C "flowtecsm-deploy"

# Key auf Server kopieren
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server-ip

# In .env setzen
SFTP_KEY_PATH=~/.ssh/id_ed25519
```

## Typischer Workflow

```
1. npm run build        (oder via VSCode Task)
2. Tests laufen lassen  (📮 Postman Local)
3. Deploy ausführen     (📡 SFTP: Website deployen)
```
