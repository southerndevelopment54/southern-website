#!/bin/bash
# =============================================================================
# Generate Self-Signed SSL Certificates for Local Testing
# =============================================================================
# This creates a local CA + server certificate so you can test the exact
# production nginx configuration on your local machine without a real domain.
#
# Usage:
#   chmod +x scripts/generate-local-ssl.sh
#   ./scripts/generate-local-ssl.sh
#
# Then start the stack with the local SSL override:
#   docker compose -f docker-compose.yml -f docker-compose.local-ssl.yml up -d
#
# Access:
#   https://localhost
#   (Browser will warn about untrusted certificate — that's expected)
#
# To trust the certificate in your browser (optional):
#   - macOS: open nginx/ssl-local/localhost.crt and add to Keychain
#   - Linux: copy to /usr/local/share/ca-certificates/ and run update-ca-certificates
#   - Windows: import into "Trusted Root Certification Authorities"
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SSL_DIR="$PROJECT_ROOT/nginx/ssl-local"

echo "=== Generating self-signed SSL certificates for local testing ==="
echo ""

# Create directory
mkdir -p "$SSL_DIR"

# Generate CA private key
echo "[1/4] Generating CA private key..."
openssl genrsa -out "$SSL_DIR/ca.key" 4096 2>/dev/null

# Generate CA certificate
echo "[2/4] Generating CA certificate..."
openssl req -x509 -new -nodes \
    -key "$SSL_DIR/ca.key" \
    -sha256 -days 365 \
    -out "$SSL_DIR/ca.crt" \
    -subj "/C=HK/O=Southern Services Local/CN=Southern Services Local CA" 2>/dev/null

# Generate server private key
echo "[3/4] Generating server private key..."
openssl genrsa -out "$SSL_DIR/localhost.key" 2048 2>/dev/null

# Create a config file for SAN (Subject Alternative Names)
cat > "$SSL_DIR/localhost.cnf" <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = HK
O = Southern Services Local
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

# Generate Certificate Signing Request (CSR)
openssl req -new \
    -key "$SSL_DIR/localhost.key" \
    -out "$SSL_DIR/localhost.csr" \
    -config "$SSL_DIR/localhost.cnf" 2>/dev/null

# Sign the certificate with our CA
echo "[4/4] Signing server certificate with local CA..."
openssl x509 -req \
    -in "$SSL_DIR/localhost.csr" \
    -CA "$SSL_DIR/ca.crt" \
    -CAkey "$SSL_DIR/ca.key" \
    -CAcreateserial \
    -out "$SSL_DIR/localhost.crt" \
    -days 365 \
    -sha256 \
    -extensions v3_req \
    -extfile "$SSL_DIR/localhost.cnf" 2>/dev/null

# Clean up intermediate files
rm -f "$SSL_DIR/localhost.csr" "$SSL_DIR/localhost.cnf" "$SSL_DIR/ca.srl"

# Set restrictive permissions
chmod 600 "$SSL_DIR/localhost.key" "$SSL_DIR/ca.key"
chmod 644 "$SSL_DIR/localhost.crt" "$SSL_DIR/ca.crt"

echo ""
echo "=========================================="
echo "Self-signed certificates generated!"
echo "=========================================="
echo ""
echo "Location: $SSL_DIR"
echo ""
echo "Files:"
echo "  - localhost.crt  (server certificate)"
echo "  - localhost.key  (server private key)"
echo "  - ca.crt         (local CA certificate)"
echo ""
echo "Next steps:"
echo "  1. Start the stack with local SSL:"
echo "     docker compose -f docker-compose.yml -f docker-compose.local-ssl.yml up -d"
echo ""
echo "  2. Open https://localhost in your browser"
echo "     (Accept the security warning — it's your own certificate)"
echo ""
echo "  3. To remove the warning permanently, trust the CA:"
echo "     Mac:    sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain $SSL_DIR/ca.crt"
echo "     Linux:  sudo cp $SSL_DIR/ca.crt /usr/local/share/ca-certificates/ && sudo update-ca-certificates"
echo ""
