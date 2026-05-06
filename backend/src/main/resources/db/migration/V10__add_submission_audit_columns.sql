ALTER TABLE applicant_submissions
    ADD COLUMN IF NOT EXISTS user_agent TEXT,
    ADD COLUMN IF NOT EXISTS admin_notes TEXT,
    ADD COLUMN IF NOT EXISTS reviewed_by INTEGER REFERENCES admin_users(id),
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;
