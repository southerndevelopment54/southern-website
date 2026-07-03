-- Add youth_dormitory as a valid sub-category under 'other'.
-- Existing data is preserved; only the CHECK constraint is updated.

ALTER TABLE guarding_sites DROP CONSTRAINT IF EXISTS chk_site_sub_category;
ALTER TABLE guarding_sites ADD CONSTRAINT chk_site_sub_category CHECK (
    sub_category IS NULL OR sub_category IN (
        'hotel',
        'serviced_apartment',
        'large_event',
        'retail_shop',
        'government_infrastructure',
        'youth_dormitory'
    )
);
