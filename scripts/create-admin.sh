#!/bin/bash
# =============================================================================
# Create / Update Admin User
# =============================================================================
# Reads ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_EMAIL from .env
# Inserts/updates the admin user in PostgreSQL.
#
# Generate your hash before deploying:
#   python3 -c "import bcrypt; print(bcrypt.hashpw(b'your-password', bcrypt.gensalt()).decode())"
#
# Usage (run AFTER docker compose up -d):
#   chmod +x scripts/create-admin.sh
#   ./scripts/create-admin.sh
# =============================================================================

set -euo pipefail

# Load .env if present
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ADMIN_PASSWORD_HASH=${ADMIN_PASSWORD_HASH:-}
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@localhost}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_NAME=${DB_NAME:-southern_website_db}

if [ -z "$ADMIN_PASSWORD_HASH" ]; then
    echo "ERROR: ADMIN_PASSWORD_HASH not set in .env"
    echo ""
    echo "Generate a BCrypt hash first:"
    echo "  python3 -c \"import bcrypt; print(bcrypt.hashpw(b'your-password', bcrypt.gensalt()).decode())\""
    echo ""
    echo "Then add to .env:"
    echo "  ADMIN_USERNAME=admin"
    echo "  ADMIN_PASSWORD_HASH=\$2a\$10\$..."
    echo "  ADMIN_EMAIL=admin@yourdomain.com"
    exit 1
fi

# Wait for postgres container to be ready
echo "Waiting for postgres container..."
for i in {1..30}; do
    if docker exec postgres-db pg_isready -U "$DB_USERNAME" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

echo "Creating/updating admin user: $ADMIN_USERNAME"

# Execute SQL via docker
printf "%s\n" \
"INSERT INTO admin_users (username, password_hash, full_name, email, role, is_active)
VALUES ('$ADMIN_USERNAME', '$ADMIN_PASSWORD_HASH', 'System Administrator', '$ADMIN_EMAIL', 'admin', true)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;" \
| docker exec -i postgres-db psql -U "$DB_USERNAME" -d "$DB_NAME" -q

echo "✅ Admin user '$ADMIN_USERNAME' created/updated successfully."
