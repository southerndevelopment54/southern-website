-- Add 物業管理 as a new enterprise type for client categorization
INSERT INTO enterprise_types (type_name, display_order)
VALUES ('物業管理', 8)
ON CONFLICT (type_name) DO NOTHING;
