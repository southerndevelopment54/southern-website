-- Add display-optimized fields to vacancies table

-- 1. Explicit job title for public cards
ALTER TABLE vacancies ADD COLUMN title VARCHAR(200);

-- 2. Display-friendly salary string
ALTER TABLE vacancies ADD COLUMN salary_display VARCHAR(100);

-- 3. Display-friendly location string
ALTER TABLE vacancies ADD COLUMN location_display VARCHAR(255);

-- 4. Display-friendly job type
ALTER TABLE vacancies ADD COLUMN job_type VARCHAR(50);

-- 5. Requirements as JSONB array (bullet points)
ALTER TABLE vacancies ADD COLUMN requirements_json JSONB;

-- ============================================
-- Migrate existing data
-- ============================================

UPDATE vacancies SET
    title = COALESCE(
        (SELECT gt.type_name FROM security_guard_types gt WHERE gt.id = guard_type_id),
        '保安員職位'
    ),
    salary_display = CASE
        WHEN salary_min IS NOT NULL AND salary_max IS NOT NULL
        THEN '$' || salary_min::text || ' - $' || salary_max::text ||
             CASE salary_period
                 WHEN 'monthly' THEN ' / 月'
                 WHEN 'hourly' THEN ' / 小時'
                 WHEN 'yearly' THEN ' / 年'
                 ELSE ''
             END
        ELSE '面議'
    END,
    location_display = COALESCE(
        (SELECT d.district_name FROM districts d WHERE d.id = district_id),
        '香港'
    ) || COALESCE(' / ' || NULLIF(location_description, ''), ''),
    job_type = CASE employment_type
        WHEN 'full-time' THEN '全職'
        WHEN 'part-time' THEN '兼職'
        WHEN 'contract' THEN '合約'
        ELSE '全職'
    END,
    requirements_json = CASE
        WHEN requirements IS NOT NULL AND requirements <> ''
        THEN to_jsonb(string_to_array(requirements, E'\n'))
        ELSE '[]'::jsonb
    END;

-- ============================================
-- Drop old requirements TEXT column and rename JSONB
-- ============================================

ALTER TABLE vacancies DROP COLUMN requirements;
ALTER TABLE vacancies RENAME COLUMN requirements_json TO requirements;

-- Make title non-nullable after migration
ALTER TABLE vacancies ALTER COLUMN title SET NOT NULL;
