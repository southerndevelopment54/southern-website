-- Reorder existing education levels to make room for new entries
UPDATE education_levels SET display_order = 10 WHERE level_name = '小學';
UPDATE education_levels SET display_order = 30 WHERE level_name = '中三';
UPDATE education_levels SET display_order = 50 WHERE level_name = '中五 (會考)';
UPDATE education_levels SET display_order = 60 WHERE level_name = '中六 (高考)';
UPDATE education_levels SET display_order = 75 WHERE level_name = '副學士';
UPDATE education_levels SET display_order = 80 WHERE level_name = '學士';
UPDATE education_levels SET display_order = 85 WHERE level_name = '碩士或以上';
UPDATE education_levels SET display_order = 100 WHERE level_name = '其他';

-- Insert new education levels
INSERT INTO education_levels (level_name, display_order) VALUES
    ('幼稚園', 0),
    ('中一', 20),
    ('中二', 25),
    ('中四', 40),
    ('中七 / 預科', 65),
    ('高級文憑', 70),
    ('博士', 90),
    ('專業資格', 95);
