ALTER TABLE contact_messages
    ADD COLUMN company VARCHAR(100),
    ADD COLUMN phone VARCHAR(20),
    ADD COLUMN service_type VARCHAR(100),
    ADD COLUMN ip_address VARCHAR(45),
    ADD COLUMN user_agent TEXT,
    ADD COLUMN is_read BOOLEAN DEFAULT false;
