-- Expand guarding site categories to include hotel, serviced apartment, and large event

-- 1. Update guarding_sites CHECK constraint
ALTER TABLE guarding_sites DROP CONSTRAINT IF EXISTS chk_site_category;
ALTER TABLE guarding_sites ADD CONSTRAINT chk_site_category CHECK (category IN ('commercial', 'residential', 'hotel', 'serviced_apartment', 'large_event', 'other'));

-- 2. Update tier_limits CHECK constraint
ALTER TABLE tier_limits DROP CONSTRAINT IF EXISTS chk_limit_category;
ALTER TABLE tier_limits ADD CONSTRAINT chk_limit_category CHECK (category IN ('commercial', 'residential', 'hotel', 'serviced_apartment', 'large_event', 'other'));

-- 3. Seed tier limits for new categories
INSERT INTO tier_limits (category, max_count) VALUES
    ('hotel', 9),
    ('serviced_apartment', 9),
    ('large_event', 9)
ON CONFLICT (category) DO NOTHING;
