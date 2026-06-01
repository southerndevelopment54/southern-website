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
Frontend  Backend ──► Postgres, MinIO (internal only)
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
DB_NAME=southern_website_db
DB_USERNAME=postgres
DB_PASSWORD=<strong-password>
MINIO_ACCESS_KEY=<strong-key>
MINIO_SECRET_KEY=<strong-secret>
MINIO_BUCKET=securityco-files
MINIO_ROOT_USER=<admin-user>
MINIO_ROOT_PASSWORD=<strong-password>
JWT_SECRET=<64-char-random-string>
```

**Generate a strong JWT secret:**
```bash
openssl rand -base64 48
```

Or run the provided script:
```bash
./init-secrets.sh
```

---

## Step 3: Replace Domain in nginx.conf

```bash
# Replace YOUR_DOMAIN with your actual domain
sed -i 's/YOUR_DOMAIN/yourdomain.com/g' nginx/nginx.conf
```

---

## Step 4: Obtain SSL Certificate

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

## Step 5: Install Certbot Auto-Reload Hook

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

## Step 6: Deploy

```bash
# Start the full stack
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

## Step 7: Create Admin User

The first time you deploy, create an admin user in the database:

```bash
# Run the admin creation script
./create_admin.sh
```

Or manually insert into PostgreSQL:
```bash
docker exec -it postgres-db psql -U ${DB_USERNAME} -d ${DB_NAME} \
  -c "INSERT INTO admin_users (username, password, role, created_at) VALUES ('admin', '\$2a\$10\$...', 'ADMIN', NOW());"
```

Default admin credentials (if you used `create_admin.sh`):
- Username: `admin`
- Password: `rS7IJg2CO2OOPvIp`

---

## Step 8: Security Verification

Run these checks on your VPS:

```bash
# 1. Verify internal services are NOT exposed to the internet
sudo ss -tlnp | grep -E ':(5432|9000|9001|8080|3000)'
# Expected: NOTHING (empty output)

# 2. Verify only nginx (80/443) is listening publicly
sudo ss -tlnp | grep -E ':(80|443)'
# Expected: Shows nginx on 80 and 443

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
```

---

## Accessing Internal Services

Since internal services have no public ports, use these methods:

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

### Backend fails to start
**Check logs:**
```bash
docker compose logs -f backend
```

Common causes:
- `.env` values missing or incorrect
- PostgreSQL not ready (wait 10 seconds, then restart backend)

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
| postgres | 1.0 | 1G |
| minio | 1.0 | 512M |
| backend | 1.0 | 1G (JVM heap: 512m–768m) |
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

- [ ] `docker-compose.yml` has NO ports except nginx (80/443)
- [ ] `nginx/nginx.conf` has `YOUR_DOMAIN` replaced with real domain
- [ ] `.env` is properly configured and NOT in git (`git status` shows ignored)
- [ ] SSL certificate is active (visit `https://yourdomain.com`, check padlock)
- [ ] HTTP redirects to HTTPS
- [ ] `/actuator/health` works publicly
- [ ] `/actuator/info`, `/actuator/metrics` return 404 from internet
- [ ] Rate limiting returns 503 after rapid requests to `/api/contact`
- [ ] UFW enabled: `sudo ufw enable && sudo ufw allow 22,80,443`
- [ ] Internal ports NOT exposed: `sudo ss -tlnp | grep -E ':(5432|9000|9001|8080|3000)'` returns empty
- [ ] Certbot auto-renewal timer is active: `sudo systemctl status certbot.timer`
- [ ] Deploy hook installed: `ls -la /etc/letsencrypt/renewal-hooks/deploy/`
