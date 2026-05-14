-- Enterprise types reference table (for client categorization)
CREATE TABLE enterprise_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed enterprise types
INSERT INTO enterprise_types (type_name, display_order) VALUES
    ('地產發展商', 1),
    ('綜合企業', 2),
    ('零售物業', 3),
    ('交通基建', 4),
    ('地產投資', 5),
    ('酒店及旅遊', 6),
    ('金融服務', 7),
    ('其他', 99);

-- Clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    logo_key VARCHAR(255),
    enterprise_type_id INTEGER REFERENCES enterprise_types(id),
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_featured ON clients(is_featured, is_active);
CREATE INDEX idx_clients_active ON clients(is_active);
