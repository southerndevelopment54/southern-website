-- Add government_infrastructure as a valid sub-category under 'other'.
-- It will be displayed as a sub-filter inside the public "其他" tab.

-- 1. Ensure guarding_sites only uses the three top-level categories
ALTER TABLE guarding_sites DROP CONSTRAINT IF EXISTS chk_site_category;
ALTER TABLE guarding_sites ADD CONSTRAINT chk_site_category CHECK (
    category IN ('commercial', 'residential', 'other')
);

-- 2. Ensure tier_limits only tracks the three top-level categories
ALTER TABLE tier_limits DROP CONSTRAINT IF EXISTS chk_limit_category;
ALTER TABLE tier_limits ADD CONSTRAINT chk_limit_category CHECK (
    category IN ('commercial', 'residential', 'other')
);

-- 3. Defensive cleanup: remove the government_infrastructure tier-limit row
--    that would have been created only if a previous V6 migration was run.
--    Existing commercial/residential/other rows are untouched.
DELETE FROM tier_limits WHERE category = 'government_infrastructure';

-- 4. Widen sub_category column to accommodate longer keys
ALTER TABLE guarding_sites ALTER COLUMN sub_category TYPE VARCHAR(30);

-- 5. Enforce valid sub_category values. NULL is allowed; existing rows with
--    hotel/serviced_apartment/large_event/retail_shop remain valid.
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
