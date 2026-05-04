CREATE TABLE security_guard_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vacancies (
    id SERIAL PRIMARY KEY,
    guard_type_id INTEGER NOT NULL REFERENCES security_guard_types(id),
    district_id INTEGER NOT NULL REFERENCES districts(id),
    location_description VARCHAR(255),
    start_date DATE NOT NULL,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_period VARCHAR(20) DEFAULT 'monthly',
    employment_type VARCHAR(20) DEFAULT 'full-time',
    working_hours VARCHAR(100),
    requirements TEXT,
    description TEXT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    image_key VARCHAR(255),
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE
);

CREATE TABLE admin_users (
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

CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    admin_user_id INTEGER REFERENCES admin_users(id),
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE education_levels (
    id SERIAL PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applicant_submissions (
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
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vacancies_guard_type ON vacancies(guard_type_id);
CREATE INDEX idx_vacancies_district ON vacancies(district_id);
CREATE INDEX idx_vacancies_active ON vacancies(is_active);
CREATE INDEX idx_submissions_vacancy ON applicant_submissions(vacancy_id);
CREATE INDEX idx_submissions_status ON applicant_submissions(status);
