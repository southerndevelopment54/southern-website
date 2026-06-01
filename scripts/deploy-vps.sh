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
echo "[1/7] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "[1/7] Installing Certbot..."
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
echo "[2/7] Preparing directories..."
sudo mkdir -p /var/www/certbot
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo mkdir -p /home/southern-tech-workstation/postgres-data
sudo mkdir -p /home/southern-tech-workstation/minio-data

# ---------------------------------------------------------------------------
# Step 3: Configure nginx domain
# ---------------------------------------------------------------------------
echo ""
echo "[3/7] Configuring nginx for $DOMAIN..."
sed -i "s/YOUR_DOMAIN/$DOMAIN/g" nginx/nginx.conf

# ---------------------------------------------------------------------------
# Step 4: Build and start infrastructure
# ---------------------------------------------------------------------------
echo ""
echo "[4/7] Starting infrastructure (postgres, minio)..."
docker compose up -d postgres minio

echo "  Waiting 5 seconds for services to initialize..."
sleep 5

# ---------------------------------------------------------------------------
# Step 5: Obtain SSL certificate
# ---------------------------------------------------------------------------
echo ""
echo "[5/7] Obtaining SSL certificate from Let's Encrypt..."
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
# Step 6: Install Certbot deploy hook
# ---------------------------------------------------------------------------
echo ""
echo "[6/7] Installing Certbot deploy hook for nginx auto-reload..."
sudo cp scripts/certbot-deploy-hook.sh /etc/letsencrypt/renewal-hooks/deploy/
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/certbot-deploy-hook.sh

# ---------------------------------------------------------------------------
# Step 7: Start full application stack
# ---------------------------------------------------------------------------
echo ""
echo "[7/7] Starting full application stack..."
docker compose up -d

# ---------------------------------------------------------------------------
# Step 8: Verification
# ---------------------------------------------------------------------------
echo ""
echo "Running verification checks..."

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
echo "Useful commands:"
echo "  docker compose logs -f nginx     # View nginx logs"
echo "  docker compose logs -f backend   # View backend logs"
echo "  docker compose ps                # Check container status"
echo ""
