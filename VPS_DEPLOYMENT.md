# VPS Deployment Guide (Hostinger)

## ⚠️ Critical Security Fix Applied

The previous `docker-compose.yml` exposed PostgreSQL (5432), MinIO (9000/9001), backend (8080), and frontend (3000) directly to the public internet via `0.0.0.0` bindings. **This has been fixed.**

**Current state:** Only nginx (80/443) is publicly accessible. All other services communicate exclusively through Docker's internal network.

---

## Quick Start (If You're in a Hurry)

```bash
# 1. SSH into your VPS
ssh user@your-vps-ip

# 2. Clone the repo
git clone <your-repo-url>
cd southern-website

# 3. Create .env from template
cp .env.example .env
# Edit .env and fill in ALL values

# 4. Run the deployment script
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh yourdomain.com
```

The script handles most steps automatically. Read below for the full manual process and explanations.

---

## Architecture Overview

```
Internet
    │
    ▼
┌─────────────┐
│  Nginx      │  ← Only public entry point (80/443)
│  (443 SSL)  │
└──────┬──────┘
       │
   ┌───┴───┐
   ▼       ▼
Frontend  Backend ──► Postgres, MinIO, Vault (internal only)
(3000)    (8080)
```

**Internal services have NO host port bindings:**
| Service | Old Binding | New Binding | Accessible From |
|---------|-------------|-------------|-----------------|
| nginx | `80:80` | `80:80`, `443:443` | Internet ✅ |
| postgres | `5432:5432` | *(none)* | Internal only |
| minio | `9000:9000`, `9001:9001` | *(none)* | Internal only |
| backend | `8080:8080` | *(none)* | Internal only |
| frontend | `3000:3000` | *(none)* | Internal only |
| vault | `127.0.0.1:8200:8200` | `127.0.0.1:8200:8200` | Localhost only |

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| **VPS** | Hostinger (or any VPS) with Ubuntu 22.04+ or Debian 12+ |
| **RAM** | Minimum 2GB (4GB recommended) |
| **Domain** | A domain pointing to your VPS IP address (A record) |
| **Docker** | Install: `curl -fsSL https://get.docker.com \| sh` |
| **Git** | `sudo apt install git` |

---

## Step 1: Prepare the VPS

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y docker.io docker-compose-plugin git certbot

# Add your user to docker group (log out and back in after)
sudo usermod -aG docker $USER

# Create data directories
sudo mkdir -p /home/southern-tech-workstation/postgres-data
sudo mkdir -p /home/southern-tech-workstation/minio-data
sudo mkdir -p /home/southern-tech-workstation/vault-data
sudo mkdir -p /var/www/certbot
```

---

## Step 2: Clone and Configure

```bash
# Clone the repository
git clone <your-repo-url>
cd southern-website

# Create environment file
cp .env.example .env
nano .env
```

**Fill in ALL values in `.env`:**
```
DB_NAME=securityco
DB_USERNAME=postgres
DB_PASSWORD=<strong-password>
MINIO_ACCESS_KEY=<strong-key>
MINIO_SECRET_KEY=<strong-secret>
MINIO_BUCKET=securityco-files
MINIO_ROOT_USER=<admin-user>
MINIO_ROOT_PASSWORD=<strong-password>
VAULT_ENABLED=true
VAULT_ADDR=http://vault:8200
JWT_SECRET=<64-char-random-string>
```

**Generate a strong JWT secret:**
```bash
openssl rand -base64 48
```

---

## Step 3: Replace Domain in nginx.conf

```bash
# Replace YOUR_DOMAIN with your actual domain
sed -i 's/YOUR_DOMAIN/yourdomain.com/g' nginx/nginx.conf
```

---

## Step 4: Start Infrastructure

```bash
# Start postgres, minio, and vault
docker compose up -d postgres minio vault

# Wait a few seconds
sleep 5
```

---

## Step 5: Initialize Vault

### 5.1 Initialize Vault (Generates 5 unseal keys + 1 root token)
```bash
docker exec -it vault-server vault operator init -key-shares=5 -key-threshold=3
```

**CRITICAL:** Save the output securely. You will see:
- 5 Unseal Keys
- 1 Initial Root Token

Store these in a password manager. **Never commit them to Git.**

### 5.2 Unseal Vault (run 3 times with 3 different keys)
```bash
docker exec -it vault-server vault operator unseal <key-1>
docker exec -it vault-server vault operator unseal <key-2>
docker exec -it vault-server vault operator unseal <key-3>
```

### 5.3 Verify Vault is unsealed
```bash
docker exec -e VAULT_ADDR=http://127.0.0.1:8200 vault-server vault status
```
Look for `Sealed: false`.

---

## Step 6: Seed Vault Secrets

```bash
# Set your root token as environment variable
export VAULT_TOKEN=<your-root-token>

# Run the initialization script
./vault/init-vault.sh
```

The script will:
1. Enable KV v2 secrets engine
2. Create policies
3. Enable AppRole authentication
4. Generate Role ID and Secret ID
5. Store your application secrets in Vault

**After the script completes, add these to your `.env`:**
```
VAULT_ROLE_ID=<role-id-from-output>
VAULT_SECRET_ID=<secret-id-from-output>
```

---

## Step 7: Obtain SSL Certificate

```bash
# Create webroot directory
sudo mkdir -p /var/www/certbot

# Obtain certificate from Let's Encrypt
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d yourdomain.com \
  -d www.yourdomain.com
```

**Verify the certificate was created:**
```bash
sudo ls /etc/letsencrypt/live/yourdomain.com/
# Should show: fullchain.pem  privkey.pem
```

---

## Step 8: Install Certbot Auto-Reload Hook

Certbot auto-renews certificates, but nginx doesn't know the files changed. This hook reloads nginx after every renewal:

```bash
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo cp scripts/certbot-deploy-hook.sh /etc/letsencrypt/renewal-hooks/deploy/
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/certbot-deploy-hook.sh
```

**Verify auto-renewal is configured:**
```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

---

## Step 9: Start Full Stack

```bash
# Start ALL services (including nginx with SSL)
docker compose up -d

# Watch logs to confirm everything starts correctly
docker compose logs -f
```

**In another terminal, verify:**
```bash
# Check all containers are running
docker compose ps

# Check nginx is serving
curl -I http://yourdomain.com
# Expected: 301 redirect to HTTPS

curl -I -k https://yourdomain.com
# Expected: 200 OK
```

---

## Step 10: Security Verification

Run these checks on your VPS:

```bash
# 1. Verify internal services are NOT exposed to the internet
sudo ss -tlnp | grep -E ':(5432|9000|9001|8080|3000)'
# Expected: NOTHING (empty output)

# 2. Verify only nginx (80/443) and vault-localhost are listening
sudo ss -tlnp | grep -E ':(80|443|8200)'
# Expected: Shows nginx on 80 and 443, vault on 127.0.0.1:8200

# 3. Verify actuator lockdown
curl -k https://yourdomain.com/actuator/health
# Expected: {"status":"UP"}

curl -k https://yourdomain.com/actuator/info
# Expected: 404 Not Found

curl -k https://yourdomain.com/actuator/metrics
# Expected: 404 Not Found

# 4. Verify rate limiting (run quickly 6 times)
for i in {1..6}; do curl -k https://yourdomain.com/api/contact; done
# Expected: Last request returns 503 (rate limited)

# 5. Check SSL certificate
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Accessing Internal Services

Since internal services have no public ports, use these methods:

### Vault UI
```bash
# From your local machine
ssh -L 8200:localhost:8200 user@your-vps-ip
# Then open http://localhost:8200 in your browser
```

### PostgreSQL
```bash
# SSH tunnel from your local machine
ssh -L 5433:localhost:5432 user@your-vps-ip
# Then connect: psql -h localhost -p 5433 -U <db-user> -d <db-name>

# Or run queries directly on the VPS
docker exec -it postgres-db psql -U <db-user> -d <db-name>
```

### MinIO Console
```bash
# SSH tunnel from your local machine
ssh -L 9001:localhost:9001 user@your-vps-ip
# Then open http://localhost:9001 in your browser
```

### Backend Logs / Debug
```bash
# View logs
docker compose logs -f backend

# Run a command inside the container
docker exec -it backend-app sh
```

---

## Updating the App After Deployment

```bash
# SSH into VPS
ssh user@your-vps-ip
cd southern-website

# Pull latest changes
git pull

# Rebuild and restart
docker compose build backend frontend
docker compose up -d

# If nginx config changed:
docker compose restart nginx
```

---

## Troubleshooting

### "nginx: [emerg] cannot load certificate"
**Cause:** Certbot hasn't obtained the certificate yet, or the domain doesn't match.

**Fix:**
```bash
# Check certificate exists
sudo ls /etc/letsencrypt/live/yourdomain.com/

# If missing, re-run certbot
sudo certbot certonly --webroot -w /var/www/certbot -d yourdomain.com
```

### Vault is sealed after VPS reboot
**Expected behavior.** Production Vault seals on restart.

**Fix:**
```bash
# Unseal with 3 keys
docker exec -e VAULT_ADDR=http://127.0.0.1:8200 vault-server vault operator unseal <key-1>
docker exec -e VAULT_ADDR=http://127.0.0.1:8200 vault-server vault operator unseal <key-2>
docker exec -e VAULT_ADDR=http://127.0.0.1:8200 vault-server vault operator unseal <key-3>
```

Consider setting up [Auto-Unseal](https://developer.hashicorp.com/vault/docs/concepts/seal#auto-unseal) via AWS/GCP KMS for hands-off operation.

### Backend fails to start with "Vault connection refused"
**Cause:** Vault is still sealed or not started.

**Fix:**
```bash
# Check Vault status
docker exec -e VAULT_ADDR=http://127.0.0.1:8200 vault-server vault status

# If sealed, unseal it
# Then restart backend
docker compose restart backend
```

### "Cannot connect to postgres from my local machine"
**Expected.** PostgreSQL is internal-only.

**Fix:** Use SSH tunnel:
```bash
ssh -L 5433:localhost:5432 user@your-vps-ip
```

### Certificate expiry warnings
**Check auto-renewal:**
```bash
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

**Force renewal:**
```bash
sudo certbot renew --force-renewal
docker exec nginx-local nginx -s reload
```

---

## Resource Limits

| Service | CPU | Memory |
|---------|-----|--------|
| postgres | 1.0 | 512M |
| minio | 1.0 | 512M |
| vault | 0.5 | 256M |
| backend | 1.0 | 1G (JVM heap: 256m–512m) |
| frontend | 1.0 | 512M |
| nginx | 0.5 | 256M |

To increase backend memory:
```bash
# Edit docker-compose.yml
JAVA_OPTS=-Xms512m -Xmx768m
# And increase the container limit:
deploy:
  resources:
    limits:
      memory: 2G
```

---

## Security Checklist (Before Going Live)

- [ ] `docker-compose.yml` has NO ports except nginx (80/443) and vault (127.0.0.1:8200)
- [ ] `nginx/nginx.conf` has `YOUR_DOMAIN` replaced with real domain
- [ ] `.env` is properly configured and NOT in git (`git status` shows ignored)
- [ ] `VAULT_CREDENTIALS.md` (with unseal keys) is NOT in git
- [ ] SSL certificate is active (visit `https://yourdomain.com`, check padlock)
- [ ] HTTP redirects to HTTPS
- [ ] `/actuator/health` works publicly
- [ ] `/actuator/info`, `/actuator/metrics` return 404 from internet
- [ ] Rate limiting returns 503 after rapid requests to `/api/contact`
- [ ] UFW enabled: `sudo ufw enable && sudo ufw allow 22,80,443`
- [ ] Internal ports NOT exposed: `sudo ss -tlnp | grep -E ':(5432|9000|9001|8080|3000)'` returns empty
- [ ] Certbot auto-renewal timer is active: `sudo systemctl status certbot.timer`
- [ ] Deploy hook installed: `ls -la /etc/letsencrypt/renewal-hooks/deploy/`
