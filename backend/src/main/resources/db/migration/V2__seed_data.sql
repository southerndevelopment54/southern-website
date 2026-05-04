-- Education levels
INSERT INTO education_levels (level_name, display_order) VALUES
    ('Primary', 1),
    ('Form 3', 2),
    ('Form 5 (HKCEE)', 3),
    ('Form 6 (HKALE)', 4),
    ('Associate Degree', 5),
    ('Bachelor Degree', 6),
    ('Master Degree or above', 7),
    ('Other', 8);

-- Security guard types
INSERT INTO security_guard_types (type_name, description, requirements) VALUES
    ('Residential Security Guard', 'Guard duty at residential buildings and estates', 'Valid Security Personnel Permit Type B'),
    ('Commercial Security Guard', 'Guard duty at office buildings and commercial premises', 'Valid Security Personnel Permit Type B'),
    ('Retail Security Guard', 'Guard duty at shopping malls and retail stores', 'Valid Security Personnel Permit Type B'),
    ('Event Security Guard', 'Crowd control and security at events and functions', 'Valid Security Personnel Permit Type A or B'),
    ('Bodyguard / Personal Protection', 'Close protection services for VIP clients', 'Valid Security Personnel Permit Type C, 5+ years experience'),
    ('Security Supervisor', 'Supervise a team of security guards', 'Valid Security Personnel Permit Type B, 3+ years experience'),
    ('Control Room Operator', 'Monitor CCTV and alarm systems', 'Valid Security Personnel Permit Type B, CCTV operator certificate'),
    ('Mobile Patrol Guard', 'Patrol multiple sites by vehicle', 'Valid driving license, Valid Security Personnel Permit Type B');

-- Districts
INSERT INTO districts (district_name, region) VALUES
    ('Central & Western', 'Hong Kong Island'),
    ('Wan Chai', 'Hong Kong Island'),
    ('Eastern', 'Hong Kong Island'),
    ('Southern', 'Hong Kong Island'),
    ('Yau Tsim Mong', 'Kowloon'),
    ('Sham Shui Po', 'Kowloon'),
    ('Kowloon City', 'Kowloon'),
    ('Wong Tai Sin', 'Kowloon'),
    ('Kwun Tong', 'Kowloon'),
    ('Kwai Tsing', 'New Territories'),
    ('Tsuen Wan', 'New Territories'),
    ('Tuen Mun', 'New Territories'),
    ('Yuen Long', 'New Territories'),
    ('North', 'New Territories'),
    ('Tai Po', 'New Territories'),
    ('Sha Tin', 'New Territories'),
    ('Sai Kung', 'New Territories'),
    ('Islands', 'New Territories');

-- Default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, full_name, email, role, is_active)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Administrator', 'admin@securityco.hk', 'admin', true);
