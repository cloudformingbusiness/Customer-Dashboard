# Hetzner Server Setup – FlowTecsMedia

## Empfohlener Server

| Typ | vCPUs | RAM | Disk | Preis | Empfehlung |
|-----|-------|-----|------|-------|------------|
| CX21 | 2 | 4 GB | 40 GB | ~6€/Mo | Entwicklung / kleines Projekt |
| CX31 | 2 | 8 GB | 80 GB | ~12€/Mo | **Empfohlen für Produktion** |
| CX41 | 4 | 16 GB | 160 GB | ~22€/Mo | Größere Projekte |

**OS:** Ubuntu 24.04 LTS

---

## Server einrichten (einmalig)

```bash
# 1. Mit root verbinden
ssh root@DEINE-SERVER-IP

# 2. System aktualisieren
apt update && apt upgrade -y

# 3. Firewall einrichten
ufw allow 22      # SSH
ufw allow 80      # HTTP
ufw allow 443     # HTTPS
ufw allow 8000    # Coolify Dashboard
ufw enable

# 4. Coolify installieren
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# 5. Coolify öffnen
echo "Coolify erreichbar unter: http://$(curl -s ifconfig.me):8000"
```

---

## SSH Key einrichten (empfohlen)

```bash
# Lokal: SSH Key generieren
ssh-keygen -t ed25519 -C "flowtecsm-hetzner"

# Public Key auf Server kopieren
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@DEINE-SERVER-IP

# Passwort-Login deaktivieren (optional, aber sicherer)
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

---

## Domain auf Server zeigen lassen

In deinem DNS-Provider (z.B. Hetzner DNS Console):

```
A    app.deine-domain.de    → DEINE-SERVER-IP
A    api.deine-domain.de    → DEINE-SERVER-IP
A    n8n.deine-domain.de    → DEINE-SERVER-IP
```

SSL-Zertifikate werden automatisch von Coolify via Let's Encrypt erstellt.

---

## Backups (Hetzner)

In der Hetzner Cloud Console:
- Server → Backups → Enable Backups (~20% Aufpreis)
- Automatische tägliche Snapshots

Oder manuell via Hetzner CLI:
```bash
hcloud server create-image DEINE-SERVER-ID --type snapshot --description "backup-$(date +%Y%m%d)"
```
