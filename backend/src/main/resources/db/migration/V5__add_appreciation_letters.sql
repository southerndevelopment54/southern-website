CREATE TABLE appreciation_letters (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    image_key VARCHAR(255),
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appreciation_letters_active_date ON appreciation_letters(is_active, date);
CREATE INDEX idx_appreciation_letters_date ON appreciation_letters(date);
