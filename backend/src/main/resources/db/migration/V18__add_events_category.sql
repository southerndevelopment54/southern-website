-- Add 'events' category to guarding sites and tier limits

-- Drop old check constraints on guarding_sites
ALTER TABLE guarding_sites DROP CONSTRAINT IF EXISTS chk_site_category;
ALTER TABLE guarding_sites ADD CONSTRAINT chk_site_category CHECK (category IN ('key', 'commercial', 'residential', 'events'));

-- Drop old check constraints on tier_limits
ALTER TABLE tier_limits DROP CONSTRAINT IF EXISTS chk_limit_category;
ALTER TABLE tier_limits ADD CONSTRAINT chk_limit_category CHECK (category IN ('key', 'commercial', 'residential', 'events'));

-- Seed default tier limits for events
INSERT INTO tier_limits (category, tier, max_count) VALUES
    ('events', 1, 9), ('events', 2, 200);
