-- ============================================================
-- Baseline schema — consolidated from all historical migrations
-- ============================================================

-- --------------------------------------------------------
-- 1. Reference / lookup tables
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS education_levels (
    id SERIAL PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS security_guard_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enterprise_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 2. Core business tables
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    admin_user_id INTEGER REFERENCES admin_users(id),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vacancies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    guard_type_id INTEGER NOT NULL REFERENCES security_guard_types(id),
    district_id INTEGER REFERENCES districts(id),
    location_description VARCHAR(255),
    location_display VARCHAR(255),
    start_date DATE NOT NULL,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_display VARCHAR(100),
    salary_period VARCHAR(20) DEFAULT 'monthly',
    employment_type VARCHAR(20) DEFAULT 'full-time',
    job_type VARCHAR(50),
    requirements JSONB,
    description TEXT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    image_key VARCHAR(255),
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE
);

CREATE TABLE IF NOT EXISTS applicant_submissions (
    id SERIAL PRIMARY KEY,
    vacancy_id INTEGER NOT NULL REFERENCES vacancies(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    education_level_id INTEGER REFERENCES education_levels(id),
    years_of_experience INTEGER,
    has_security_license BOOLEAN DEFAULT false,
    license_number VARCHAR(50),
    message TEXT,
    status VARCHAR(20) DEFAULT 'new',
    admin_notes TEXT,
    reviewed_by INTEGER REFERENCES admin_users(id),
    reviewed_at TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    phone VARCHAR(20),
    service_type VARCHAR(100),
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    name_cn VARCHAR(200),
    logo_key VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guarding_sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    name_cn VARCHAR(200),
    image_key VARCHAR(255),
    address VARCHAR(255),
    address_en VARCHAR(255),
    address_cn VARCHAR(255),
    category VARCHAR(20) NOT NULL,
    district VARCHAR(20),
    sub_category VARCHAR(20),
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_site_category CHECK (category IN ('commercial', 'residential', 'other'))
);

CREATE TABLE IF NOT EXISTS tier_limits (
    id SERIAL PRIMARY KEY,
    category VARCHAR(20) NOT NULL UNIQUE,
    max_count INTEGER NOT NULL DEFAULT 9,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_limit_category CHECK (category IN ('commercial', 'residential', 'other'))
);

CREATE TABLE IF NOT EXISTS vacancy_inquiries (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    education_level_id INTEGER REFERENCES education_levels(id),
    years_of_experience INTEGER,
    license_number VARCHAR(50),
    service_type VARCHAR(100) NOT NULL,
    district_preference VARCHAR(100),
    message TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 3. Indexes
-- --------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_vacancies_guard_type ON vacancies(guard_type_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_district ON vacancies(district_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_active ON vacancies(is_active);
CREATE INDEX IF NOT EXISTS idx_submissions_vacancy ON applicant_submissions(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON applicant_submissions(status);
CREATE INDEX IF NOT EXISTS idx_sites_category_featured ON guarding_sites(category, is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_sites_active ON guarding_sites(is_active);
CREATE INDEX IF NOT EXISTS idx_clients_featured ON clients(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);

-- --------------------------------------------------------
-- 4. Seed data
-- --------------------------------------------------------

-- Default admin (password: admin123)
INSERT INTO admin_users (username, password_hash, full_name, email, role, is_active)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Administrator', 'admin@securityco.hk', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- Education levels
INSERT INTO education_levels (level_name, display_order) VALUES
    ('小學', 10),
    ('中一', 20),
    ('中二', 25),
    ('中三', 30),
    ('中四', 40),
    ('中五 (會考)', 50),
    ('中六 (高考)', 60),
    ('中七 / 預科', 65),
    ('高級文憑', 70),
    ('副學士', 75),
    ('學士', 80),
    ('碩士或以上', 85),
    ('博士', 90),
    ('專業資格', 95),
    ('其他', 100)
ON CONFLICT (level_name) DO NOTHING;

-- Security guard types
INSERT INTO security_guard_types (type_name, description, requirements) VALUES
    ('住宅保安員', '住宅大廈及屋苑的保安工作', '持有有效的保安人員許可證B類'),
    ('商業保安員', '辦公大樓及商業處所的保安工作', '持有有效的保安人員許可證B類'),
    ('零售保安員', '商場及零售店鋪的保安工作', '持有有效的保安人員許可證B類'),
    ('活動保安員', '活動及宴會的人群管理及保安工作', '持有有效的保安人員許可證A類或B類'),
    ('保鑣 / 私人保護', '為貴賓客戶提供近身保護服務', '持有有效的保安人員許可證C類，5年以上經驗'),
    ('保安督導員', '監督一隊保安人員', '持有有效的保安人員許可證B類，3年以上經驗'),
    ('控制室操作員', '監控閉路電視及警報系統', '持有有效的保安人員許可證B類，閉路電視操作員證書'),
    ('流動巡邏保安員', '駕車巡邏多個地點', '持有有效駕駛執照，持有有效的保安人員許可證B類')
ON CONFLICT (type_name) DO NOTHING;

-- Districts
INSERT INTO districts (district_name, region) VALUES
    ('中西區', 'Hong Kong Island'),
    ('灣仔', 'Hong Kong Island'),
    ('東區', 'Hong Kong Island'),
    ('南區', 'Hong Kong Island'),
    ('油尖旺', 'Kowloon'),
    ('深水埗', 'Kowloon'),
    ('九龍城', 'Kowloon'),
    ('黃大仙', 'Kowloon'),
    ('觀塘', 'Kowloon'),
    ('葵青', 'New Territories'),
    ('荃灣', 'New Territories'),
    ('屯門', 'New Territories'),
    ('元朗', 'New Territories'),
    ('北區', 'New Territories'),
    ('大埔', 'New Territories'),
    ('沙田', 'New Territories'),
    ('西貢', 'New Territories'),
    ('離島', 'New Territories')
ON CONFLICT (district_name) DO NOTHING;

-- Enterprise types
INSERT INTO enterprise_types (type_name, display_order) VALUES
    ('地產發展商', 1),
    ('綜合企業', 2),
    ('零售物業', 3),
    ('交通基建', 4),
    ('地產投資', 5),
    ('酒店及旅遊', 6),
    ('金融服務', 7),
    ('物業管理', 8),
    ('其他', 99)
ON CONFLICT (type_name) DO NOTHING;

-- Tier limits
INSERT INTO tier_limits (category, max_count) VALUES
    ('commercial', 9),
    ('residential', 9),
    ('other', 9)
ON CONFLICT (category) DO NOTHING;
