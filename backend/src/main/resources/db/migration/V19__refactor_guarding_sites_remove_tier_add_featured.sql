-- Refactor guarding_sites: remove tier, add is_featured, migrate key category

-- 1. Add is_featured column
ALTER TABLE guarding_sites ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- 2. Mark existing key projects as featured
UPDATE guarding_sites SET is_featured = true WHERE category = 'key';

-- 3. Convert existing key projects to commercial as default (admin can re-categorize later)
UPDATE guarding_sites SET category = 'commercial' WHERE category = 'key';

-- 4. Drop old index that references tier
DROP INDEX IF EXISTS idx_sites_category_tier;

-- 5. Drop tier column
ALTER TABLE guarding_sites DROP COLUMN tier;

-- 6. Update CHECK constraint on category
ALTER TABLE guarding_sites DROP CONSTRAINT IF EXISTS chk_site_category;
ALTER TABLE guarding_sites ADD CONSTRAINT chk_site_category CHECK (category IN ('commercial', 'residential', 'events'));

-- 7. Create new index
CREATE INDEX idx_sites_category_featured ON guarding_sites(category, is_featured, is_active);

-- 8. Remove key category tier limits (no longer a category)
DELETE FROM tier_limits WHERE category = 'key';

-- 9. Update tier_limits CHECK constraint
ALTER TABLE tier_limits DROP CONSTRAINT IF EXISTS chk_limit_category;
ALTER TABLE tier_limits ADD CONSTRAINT chk_limit_category CHECK (category IN ('commercial', 'residential', 'events'));
