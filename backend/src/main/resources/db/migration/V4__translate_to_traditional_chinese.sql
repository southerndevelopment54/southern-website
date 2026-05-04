-- Update education levels to Traditional Chinese
UPDATE education_levels SET level_name = '小學' WHERE level_name = 'Primary';
UPDATE education_levels SET level_name = '中三' WHERE level_name = 'Form 3';
UPDATE education_levels SET level_name = '中五 (會考)' WHERE level_name = 'Form 5 (HKCEE)';
UPDATE education_levels SET level_name = '中六 (高考)' WHERE level_name = 'Form 6 (HKALE)';
UPDATE education_levels SET level_name = '副學士' WHERE level_name = 'Associate Degree';
UPDATE education_levels SET level_name = '學士' WHERE level_name = 'Bachelor Degree';
UPDATE education_levels SET level_name = '碩士或以上' WHERE level_name = 'Master Degree or above';
UPDATE education_levels SET level_name = '其他' WHERE level_name = 'Other';

-- Update security guard types to Traditional Chinese
UPDATE security_guard_types SET type_name = '住宅保安員', description = '住宅大廈及屋苑的保安工作', requirements = '持有有效的保安人員許可證B類' WHERE type_name = 'Residential Security Guard';
UPDATE security_guard_types SET type_name = '商業保安員', description = '辦公大樓及商業處所的保安工作', requirements = '持有有效的保安人員許可證B類' WHERE type_name = 'Commercial Security Guard';
UPDATE security_guard_types SET type_name = '零售保安員', description = '商場及零售店鋪的保安工作', requirements = '持有有效的保安人員許可證B類' WHERE type_name = 'Retail Security Guard';
UPDATE security_guard_types SET type_name = '活動保安員', description = '活動及宴會的人群管理及保安工作', requirements = '持有有效的保安人員許可證A類或B類' WHERE type_name = 'Event Security Guard';
UPDATE security_guard_types SET type_name = '保鑣 / 私人保護', description = '為貴賓客戶提供近身保護服務', requirements = '持有有效的保安人員許可證C類，5年以上經驗' WHERE type_name = 'Bodyguard / Personal Protection';
UPDATE security_guard_types SET type_name = '保安督導員', description = '監督一隊保安人員', requirements = '持有有效的保安人員許可證B類，3年以上經驗' WHERE type_name = 'Security Supervisor';
UPDATE security_guard_types SET type_name = '控制室操作員', description = '監控閉路電視及警報系統', requirements = '持有有效的保安人員許可證B類，閉路電視操作員證書' WHERE type_name = 'Control Room Operator';
UPDATE security_guard_types SET type_name = '流動巡邏保安員', description = '駕車巡邏多個地點', requirements = '持有有效駕駛執照，持有有效的保安人員許可證B類' WHERE type_name = 'Mobile Patrol Guard';

-- Update districts to Traditional Chinese
UPDATE districts SET district_name = '中西區' WHERE district_name = 'Central & Western';
UPDATE districts SET district_name = '灣仔' WHERE district_name = 'Wan Chai';
UPDATE districts SET district_name = '東區' WHERE district_name = 'Eastern';
UPDATE districts SET district_name = '南區' WHERE district_name = 'Southern';
UPDATE districts SET district_name = '油尖旺' WHERE district_name = 'Yau Tsim Mong';
UPDATE districts SET district_name = '深水埗' WHERE district_name = 'Sham Shui Po';
UPDATE districts SET district_name = '九龍城' WHERE district_name = 'Kowloon City';
UPDATE districts SET district_name = '黃大仙' WHERE district_name = 'Wong Tai Sin';
UPDATE districts SET district_name = '觀塘' WHERE district_name = 'Kwun Tong';
UPDATE districts SET district_name = '葵青' WHERE district_name = 'Kwai Tsing';
UPDATE districts SET district_name = '荃灣' WHERE district_name = 'Tsuen Wan';
UPDATE districts SET district_name = '屯門' WHERE district_name = 'Tuen Mun';
UPDATE districts SET district_name = '元朗' WHERE district_name = 'Yuen Long';
UPDATE districts SET district_name = '北區' WHERE district_name = 'North';
UPDATE districts SET district_name = '大埔' WHERE district_name = 'Tai Po';
UPDATE districts SET district_name = '沙田' WHERE district_name = 'Sha Tin';
UPDATE districts SET district_name = '西貢' WHERE district_name = 'Sai Kung';
UPDATE districts SET district_name = '離島' WHERE district_name = 'Islands';
