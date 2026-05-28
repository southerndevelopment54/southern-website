CREATE TABLE security_system_clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    logo_key VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_security_system_clients_active ON security_system_clients(is_active);
CREATE INDEX idx_security_system_clients_order ON security_system_clients(display_order);
