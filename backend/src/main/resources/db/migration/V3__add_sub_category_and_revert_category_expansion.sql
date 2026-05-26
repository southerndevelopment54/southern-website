-- Add sub_category to guarding_sites and revert category expansion

-- 1. Add sub_category column
ALTER TABLE guarding_sites ADD COLUMN IF NOT EXISTS sub_category VARCHAR(20);

-- 2. Migrate existing sites from expanded categories back to 'other' with sub_category
UPDATE guarding_sites SET
    sub_category = category,
    category = 'other'
WHERE category IN ('hotel', 'serviced_apartment', 'large_event');

-- 3. Revert guarding_sites CHECK constraint
ALTER TABLE guarding_sites DROP CONSTRAINT IF EXISTS chk_site_category;
ALTER TABLE guarding_sites ADD CONSTRAINT chk_site_category CHECK (category IN ('commercial', 'residential', 'other'));

-- 4. Remove tier_limits for the expanded categories BEFORE re-adding constraint
DELETE FROM tier_limits WHERE category IN ('hotel', 'serviced_apartment', 'large_event');

-- 5. Revert tier_limits CHECK constraint
ALTER TABLE tier_limits DROP CONSTRAINT IF EXISTS chk_limit_category;
ALTER TABLE tier_limits ADD CONSTRAINT chk_limit_category CHECK (category IN ('commercial', 'residential', 'other'));
