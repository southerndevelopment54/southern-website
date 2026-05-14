-- Guarding sites table (sites where the company provides/has provided security services)
CREATE TABLE guarding_sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    image_key VARCHAR(255),
    address VARCHAR(255),
    category VARCHAR(20) NOT NULL,
    tier INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_site_category CHECK (category IN ('key', 'commercial', 'residential')),
    CONSTRAINT chk_site_tier CHECK (tier IN (1, 2))
);

CREATE INDEX idx_sites_category_tier ON guarding_sites(category, tier, is_active);
CREATE INDEX idx_sites_active ON guarding_sites(is_active);

-- Tier limits table (admin-configurable per category+tier)
CREATE TABLE tier_limits (
    id SERIAL PRIMARY KEY,
    category VARCHAR(20) NOT NULL,
    tier INTEGER NOT NULL,
    max_count INTEGER NOT NULL DEFAULT 9,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_limit_category CHECK (category IN ('key', 'commercial', 'residential')),
    CONSTRAINT chk_limit_tier CHECK (tier IN (1, 2)),
    CONSTRAINT uq_tier_limits UNIQUE (category, tier)
);

-- Seed default tier limits
INSERT INTO tier_limits (category, tier, max_count) VALUES
    ('key', 1, 9), ('key', 2, 200),
    ('commercial', 1, 9), ('commercial', 2, 200),
    ('residential', 1, 9), ('residential', 2, 200);
