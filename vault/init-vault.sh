#!/bin/bash
# =============================================================================
# Vault Initialization Script
# =============================================================================
# Run this AFTER starting Vault in production mode and initializing/unsealing it.
#
# Steps:
#   1. docker compose up -d vault
#   2. docker exec -it vault-server vault operator init -key-shares=5 -key-threshold=3
#   3. Save the unseal keys and root token securely
#   4. Unseal Vault (run 3 times with 3 different keys)
#   5. Run this script with the root token:
#      VAULT_TOKEN=<root-token> ./vault/init-vault.sh
# =============================================================================

set -euo pipefail

VAULT_TOKEN="${VAULT_TOKEN:-}"
if [ -z "$VAULT_TOKEN" ]; then
    echo "ERROR: Set VAULT_TOKEN environment variable with the root token."
    exit 1
fi

echo "=== Initializing Vault configuration ==="

# 1. Enable KV v2 secrets engine
echo "[1/7] Enabling KV v2 secrets engine..."
docker exec -e VAULT_TOKEN="$VAULT_TOKEN" -e VAULT_ADDR=http://127.0.0.1:8200 vault-server \
    vault secrets enable -version=2 -path=secret kv 2>/dev/null || echo "KV already enabled"

# 2. Create policies
echo "[2/7] Creating policies..."
docker exec -e VAULT_TOKEN="$VAULT_TOKEN" -e VAULT_ADDR=http://127.0.0.1:8200 vault-server \
    vault policy write security-co-app /vault/config/security-co-app.hcl
docker exec -e VAULT_TOKEN="$VAULT_TOKEN" -e VAULT_ADDR=http://127.0.0.1:8200 vault-server \
    vault policy write security-co-infra /vault/config/security-co-infra.hcl

# 3. Enable AppRole auth
echo "[3/7] Enabling AppRole auth..."
docker exec -e VAULT_TOKEN="$VAULT_TOKEN" -e VAULT_ADDR=http://127.0.0.1:8200 vault-server \
    vault auth enable approle 2>/dev/null || echo "AppRole already enabled"

# 4. Create AppRole
echo "[4/7] Creating AppRole..."
docker exec -e VAULT_TOKEN="$VAULT_TOKEN" -e VAULT_ADDR=http://127.0.0.1:8200 vault-server \
    vault write auth/approle/role/security-co-app \
    token_policies="security-co-app" \
    token_ttl=1h \
    token_max_ttl=4h \
    secret_id_ttl=24h \
    secret_id_num_uses=10

# 5. Get Role ID
echo "[5/7] Getting Role ID..."
ROLE_ID=$(docker exec -e VAULT_TOKEN="$VAULT_TOKEN" -e VAULT_ADDR=http://127.0.0.1:8200 vault-server \
    vault read -field=role_id auth/approle/role/security-co-app/role-id)
echo "  Role ID: $ROLE_ID"

# 6. Generate Secret ID
echo "[6/7] Generating Secret ID..."
SECRET_ID=$(docker exec -e VAULT_TOKEN="$VAULT_TOKEN" -e VAULT_ADDR=http://127.0.0.1:8200 vault-server \
    vault write -f -field=secret_id auth/approle/role/security-co-app/secret-id)
echo "  Secret ID: $SECRET_ID"

# 7. Write initial secrets
echo "[7/7] Writing application secrets..."

# Read from .env if available
ENV_FILE="../.env"
JWT_SECRET=""
DB_USERNAME=""
DB_PASSWORD=""
MINIO_ACCESS_KEY=""
MINIO_SECRET_KEY=""

if [ -f "$ENV_FILE" ]; then
    JWT_SECRET=$(grep '^JWT_SECRET=' "$ENV_FILE" | sed 's/^JWT_SECRET=//' || true)
    DB_USERNAME=$(grep '^DB_USERNAME=' "$ENV_FILE" | sed 's/^DB_USERNAME=//' || true)
    DB_PASSWORD=$(grep '^DB_PASSWORD=' "$ENV_FILE" | sed 's/^DB_PASSWORD=//' || true)
    MINIO_ACCESS_KEY=$(grep '^MINIO_ACCESS_KEY=' "$ENV_FILE" | sed 's/^MINIO_ACCESS_KEY=//' || true)
    MINIO_SECRET_KEY=$(grep '^MINIO_SECRET_KEY=' "$ENV_FILE" | sed 's/^MINIO_SECRET_KEY=//' || true)
fi

# Prompt for missing values
if [ -z "$JWT_SECRET" ]; then
    read -rp "Enter JWT_SECRET (min 64 chars): " JWT_SECRET
fi
if [ -z "$DB_USERNAME" ]; then
    read -rp "Enter DB_USERNAME: " DB_USERNAME
fi
if [ -z "$DB_PASSWORD" ]; then
    read -rp "Enter DB_PASSWORD: " DB_PASSWORD
fi
if [ -z "$MINIO_ACCESS_KEY" ]; then
    read -rp "Enter MINIO_ACCESS_KEY: " MINIO_ACCESS_KEY
fi
if [ -z "$MINIO_SECRET_KEY" ]; then
    read -rp "Enter MINIO_SECRET_KEY: " MINIO_SECRET_KEY
fi

docker exec -e VAULT_TOKEN="$VAULT_TOKEN" -e VAULT_ADDR=http://127.0.0.1:8200 vault-server \
    vault kv put secret/security-co \
    jwt.secret="$JWT_SECRET" \
    db.username="$DB_USERNAME" \
    db.password="$DB_PASSWORD" \
    minio.access-key="$MINIO_ACCESS_KEY" \
    minio.secret-key="$MINIO_SECRET_KEY"

echo ""
echo "=========================================="
echo "Vault initialization complete!"
echo "=========================================="
echo ""
echo "Add these to your .env file:"
echo ""
echo "VAULT_ROLE_ID=$ROLE_ID"
echo "VAULT_SECRET_ID=$SECRET_ID"
echo ""
echo "=========================================="
echo "IMPORTANT: Store the root token and unseal"
echo "keys securely. They are NOT stored in .env."
echo "=========================================="
