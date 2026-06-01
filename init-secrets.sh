#!/bin/bash
# =============================================================================
# Secret Initialization Script
# =============================================================================
# Generates cryptographically strong passwords for all services.
# Run this ONCE before the first deployment to create your .env file.
#
# Usage:
#   chmod +x init-secrets.sh
#   ./init-secrets.sh
#
# WARNING: This script will REFUSE to run if .env already contains secrets
#          to prevent accidental overwrite.
# =============================================================================

set -euo pipefail

ENV_FILE=".env"

# Check if .env already has non-empty secrets
if [ -f "$ENV_FILE" ]; then
    if grep -qE '^(DB_PASSWORD|MINIO_SECRET_KEY|JWT_SECRET)=.+$' "$ENV_FILE"; then
        echo "ERROR: $ENV_FILE already contains secrets."
        echo "To regenerate, delete or rename $ENV_FILE first."
        exit 1
    fi
fi

echo "Generating strong secrets for all services..."
echo ""

cat > "$ENV_FILE" <<EOF
# =============================================================================
# Auto-generated secrets — $(date '+%Y-%m-%d %H:%M:%S')
# =============================================================================
# DO NOT COMMIT THIS FILE TO VERSION CONTROL.
# This file should be listed in .gitignore.
# =============================================================================

# -----------------------------------------------------------------------------
# Database (PostgreSQL)
# -----------------------------------------------------------------------------
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=$(openssl rand -base64 32)

# -----------------------------------------------------------------------------
# MinIO (Application-level credentials for Spring Boot)
# -----------------------------------------------------------------------------
MINIO_ACCESS_KEY=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
MINIO_SECRET_KEY=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 64)
MINIO_BUCKET=security-co

# -----------------------------------------------------------------------------
# MinIO (Container root credentials — required at container startup)
# -----------------------------------------------------------------------------
MINIO_ROOT_USER=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 20)
MINIO_ROOT_PASSWORD=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 40)

# -----------------------------------------------------------------------------
# HashiCorp Vault
# -----------------------------------------------------------------------------
VAULT_ENABLED=true
VAULT_ADDR=http://vault:8200
VAULT_TOKEN=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)

# -----------------------------------------------------------------------------
# JWT (used by vault-seed script to store secret in Vault)
# Must be at least 64 characters for HS512 algorithm.
# -----------------------------------------------------------------------------
JWT_SECRET=$(openssl rand -base64 64 | tr -dc 'a-zA-Z0-9' | head -c 64)
EOF

# Secure the file: only owner can read/write
chmod 600 "$ENV_FILE"

echo "✅ Secrets generated successfully in: $ENV_FILE"
echo ""
echo "Summary:"
echo "  - DB_PASSWORD:        $(grep '^DB_PASSWORD=' "$ENV_FILE" | cut -d= -f2 | wc -c) chars"
echo "  - MINIO_ACCESS_KEY:   $(grep '^MINIO_ACCESS_KEY=' "$ENV_FILE" | cut -d= -f2 | wc -c) chars"
echo "  - MINIO_SECRET_KEY:   $(grep '^MINIO_SECRET_KEY=' "$ENV_FILE" | cut -d= -f2 | wc -c) chars"
echo "  - MINIO_ROOT_USER:    $(grep '^MINIO_ROOT_USER=' "$ENV_FILE" | cut -d= -f2 | wc -c) chars"
echo "  - MINIO_ROOT_PASS:    $(grep '^MINIO_ROOT_PASSWORD=' "$ENV_FILE" | cut -d= -f2 | wc -c) chars"
echo "  - VAULT_TOKEN:        $(grep '^VAULT_TOKEN=' "$ENV_FILE" | cut -d= -f2 | wc -c) chars"
echo "  - JWT_SECRET:         $(grep '^JWT_SECRET=' "$ENV_FILE" | cut -d= -f2 | wc -c) chars"
echo ""
echo "Next steps:"
echo "  1. Verify .env is in .gitignore"
echo "  2. Review $ENV_FILE to ensure values look correct"
echo "  3. Run: docker compose up -d"
echo ""
echo "WARNING: Keep $ENV_FILE secure. If lost, you will need to reset all passwords."
