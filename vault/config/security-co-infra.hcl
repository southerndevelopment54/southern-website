# Policy for infrastructure operators (not the app)
# This policy allows access to infrastructure secrets.

path "secret/data/security-co-infra" {
  capabilities = ["read"]
}

path "secret/data/security-co-infra/*" {
  capabilities = ["read"]
}
