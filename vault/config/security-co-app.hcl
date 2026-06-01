# Policy for the Spring Boot application (security-co)
# This policy allows read-only access to application secrets.

path "secret/data/security-co" {
  capabilities = ["read"]
}

path "secret/data/security-co/*" {
  capabilities = ["read"]
}
