#!/bin/bash
# =============================================================================
# VPS Deployment Script
# =============================================================================
# Run this on your Hostinger VPS after cloning the repository.
#
# Prerequisites:
#   - Ubuntu 22.04+ (or Debian 12+)
#   - Docker + Docker Compose installed
#   - Domain pointing to your VPS IP
#   - SSH access as a non-root user with sudo
#
# Usage:
#   chmod +x scripts/deploy-vps.sh
#   ./scripts/deploy-vps.sh yourdomain.com
# =============================================================================

set -euo pipefail

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
    echo "Usage: $0 <domain>"
    echo "Example: $0 southern-services.com"
    exit 1
fi

echo "=========================================="
echo "Deploying Southern Services Website"
echo "Domain: $DOMAIN"
echo "=========================================="

# ---------------------------------------------------------------------------
# Step 1: System updates & dependencies
# ---------------------------------------------------------------------------
echo ""
echo "[1/10] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "[1/10] Installing Certbot..."
    sudo apt install -y certbot
fi

# Verify Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Install it first:"
    echo "  curl -fsSL https://get.docker.com | sh"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "ERROR: Docker Compose is not installed."
    exit 1
fi

# ---------------------------------------------------------------------------
# Step 2: Prepare directories
# ---------------------------------------------------------------------------
echo ""
echo "[2/10] Preparing directories..."
sudo mkdir -p /var/www/certbot
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo mkdir -p /home/southern-tech-workstation/postgres-data
sudo mkdir -p /home/southern-tech-workstation/minio-data
sudo mkdir -p /home/southern-tech-workstation/vault-data

# ---------------------------------------------------------------------------
# Step 3: Configure nginx domain
# ---------------------------------------------------------------------------
echo ""
echo "[3/10] Configuring nginx for $DOMAIN..."
sed -i "s/YOUR_DOMAIN/$DOMAIN/g" nginx/nginx.conf

# ---------------------------------------------------------------------------
# Step 4: Build and start infrastructure
# ---------------------------------------------------------------------------
echo ""
echo "[4/10] Starting infrastructure (postgres, minio, vault)..."
docker compose up -d postgres minio vault

echo "  Waiting 5 seconds for services to initialize..."
sleep 5

# ---------------------------------------------------------------------------
# Step 5: Initialize Vault (interactive)
# ---------------------------------------------------------------------------
echo ""
echo "[5/10] Vault initialization..."
echo ""
echo "⚠️  IMPORTANT: You need to initialize Vault now."
echo "   Run the following command and SAVE the unseal keys and root token:"
echo ""
echo "   docker exec -it vault-server vault operator init -key-shares=5 -key-threshold=3"
echo ""
read -rp "Press Enter after you have saved the unseal keys and root token..."

echo ""
echo "   Now unseal Vault with 3 different keys:"
echo "   docker exec -it vault-server vault operator unseal <key-1>"
echo "   docker exec -it vault-server vault operator unseal <key-2>"
echo "   docker exec -it vault-server vault operator unseal <key-3>"
echo ""
read -rp "Press Enter after Vault is unsealed..."

# ---------------------------------------------------------------------------
# Step 6: Seed Vault secrets
# ---------------------------------------------------------------------------
echo ""
echo "[6/10] Seeding Vault with application secrets..."
echo ""
echo "   Set your root token as an environment variable and run:"
echo "   VAULT_TOKEN=<root-token> ./vault/init-vault.sh"
echo ""
read -rp "Press Enter after you have run init-vault.sh and updated .env with VAULT_ROLE_ID and VAULT_SECRET_ID..."

# ---------------------------------------------------------------------------
# Step 7: Obtain SSL certificate
# ---------------------------------------------------------------------------
echo ""
echo "[7/10] Obtaining SSL certificate from Let's Encrypt..."
sudo certbot certonly --webroot \
    -w /var/www/certbot \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --agree-tos \
    --non-interactive \
    --email "admin@$DOMAIN" 2>/dev/null || {
    echo "WARNING: Certbot failed. You may need to run it manually:"
    echo "  sudo certbot certonly --webroot -w /var/www/certbot -d $DOMAIN"
}

# ---------------------------------------------------------------------------
# Step 8: Install Certbot deploy hook
# ---------------------------------------------------------------------------
echo ""
echo "[8/10] Installing Certbot deploy hook for nginx auto-reload..."
sudo cp scripts/certbot-deploy-hook.sh /etc/letsencrypt/renewal-hooks/deploy/
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/certbot-deploy-hook.sh

# ---------------------------------------------------------------------------
# Step 9: Start full application stack
# ---------------------------------------------------------------------------
echo ""
echo "[9/10] Starting full application stack..."
docker compose up -d

# ---------------------------------------------------------------------------
# Step 10: Verification
# ---------------------------------------------------------------------------
echo ""
echo "[10/10] Running verification checks..."

# Check that internal services are NOT exposed
echo ""
echo "  Checking that internal services are not publicly exposed..."
EXPOSED_PORTS=$(sudo ss -tlnp | grep -E ':(5432|9000|9001|8080|3000)' || true)
if [ -z "$EXPOSED_PORTS" ]; then
    echo "  ✅ Internal services are secure (no public ports)"
else
    echo "  ⚠️  WARNING: Some internal ports appear to be exposed:"
    echo "$EXPOSED_PORTS"
fi

# Check nginx is listening
echo ""
echo "  Checking nginx..."
if sudo ss -tlnp | grep -q ':80\|:443'; then
    echo "  ✅ Nginx is listening on ports 80 and/or 443"
else
    echo "  ⚠️  Nginx does not appear to be listening"
fi

# Check certbot timer
echo ""
echo "  Checking Certbot auto-renewal timer..."
if systemctl is-active --quiet certbot.timer 2>/dev/null; then
    echo "  ✅ Certbot timer is active"
else
    echo "  ⚠️  Certbot timer not found. Auto-renewal may not be configured."
fi

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your app should be accessible at:"
echo "  https://$DOMAIN"
echo ""
echo "Vault UI (via SSH tunnel):"
echo "  ssh -L 8200:localhost:8200 user@$DOMAIN"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f nginx     # View nginx logs"
echo "  docker compose logs -f backend   # View backend logs"
echo "  docker compose ps                # Check container status"
echo "  docker exec -it vault-server vault status"
echo ""
