-- Widen guarding_sites.sub_category to support longer sub-category keys.
-- This migration is idempotent: it safely handles deployments that already
-- applied V6 before the column was widened.

-- 1. Widen the column if it is still VARCHAR(20)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'guarding_sites'
          AND column_name = 'sub_category'
          AND data_type = 'character varying'
          AND character_maximum_length < 30
    ) THEN
        ALTER TABLE guarding_sites ALTER COLUMN sub_category TYPE VARCHAR(30);
    END IF;
END $$;

-- 2. Ensure the CHECK constraint allows government_infrastructure
ALTER TABLE guarding_sites DROP CONSTRAINT IF EXISTS chk_site_sub_category;
ALTER TABLE guarding_sites ADD CONSTRAINT chk_site_sub_category CHECK (
    sub_category IS NULL OR sub_category IN (
        'hotel',
        'serviced_apartment',
        'large_event',
        'retail_shop',
        'government_infrastructure'
    )
);
