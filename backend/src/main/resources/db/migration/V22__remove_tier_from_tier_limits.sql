-- Remove tier 2 data (dead code) and drop the tier column entirely.
-- Tier 1 now represents "featured limit per category".

-- 1. Delete all tier 2 rows (no longer used by any code)
DELETE FROM tier_limits WHERE tier = 2;

-- 2. Drop constraints that reference the tier column
ALTER TABLE tier_limits DROP CONSTRAINT IF EXISTS chk_limit_tier;
ALTER TABLE tier_limits DROP CONSTRAINT IF EXISTS uq_tier_limits;

-- 3. Drop the tier column
ALTER TABLE tier_limits DROP COLUMN tier;

-- 4. Enforce category uniqueness (one limit row per category)
ALTER TABLE tier_limits ADD CONSTRAINT uq_tier_limits_category UNIQUE (category);
