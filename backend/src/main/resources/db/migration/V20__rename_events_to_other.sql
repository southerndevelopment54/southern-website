-- Rename 'events' category to 'other'

-- 1. Drop constraints first so updates can proceed
ALTER TABLE guarding_sites DROP CONSTRAINT IF EXISTS chk_site_category;
ALTER TABLE tier_limits DROP CONSTRAINT IF EXISTS chk_limit_category;

-- 2. Update existing data
UPDATE guarding_sites SET category = 'other' WHERE category = 'events';
UPDATE tier_limits SET category = 'other' WHERE category = 'events';

-- 3. Re-create constraints with new allowed values
ALTER TABLE guarding_sites ADD CONSTRAINT chk_site_category CHECK (category IN ('commercial', 'residential', 'other'));
ALTER TABLE tier_limits ADD CONSTRAINT chk_limit_category CHECK (category IN ('commercial', 'residential', 'other'));
