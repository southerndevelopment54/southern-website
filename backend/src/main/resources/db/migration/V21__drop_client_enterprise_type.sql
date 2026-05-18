-- Remove enterprise_type_id from clients table
ALTER TABLE clients DROP COLUMN IF EXISTS enterprise_type_id;
