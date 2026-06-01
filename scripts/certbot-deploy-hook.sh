#!/bin/bash
# =============================================================================
# Certbot Deploy Hook — Auto-Reload Nginx After Certificate Renewal
# =============================================================================
# This script is called automatically by Certbot after every successful renewal.
# It reloads the nginx container so it picks up the new certificate without
# dropping connections.
#
# INSTALLATION on your VPS:
#   sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
#   sudo cp scripts/certbot-deploy-hook.sh /etc/letsencrypt/renewal-hooks/deploy/
#   sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/certbot-deploy-hook.sh
#
# To test:
#   sudo certbot renew --dry-run
#   # Check docker logs: docker logs nginx-local | grep "reload"
# =============================================================================

set -e

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Certbot deploy hook triggered. Reloading nginx..."

# Reload nginx inside the Docker container (zero-downtime)
if docker exec nginx-local nginx -t 2>/dev/null; then
    docker exec nginx-local nginx -s reload
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Nginx reloaded successfully."
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: Nginx config test failed. Not reloading."
    exit 1
fi
