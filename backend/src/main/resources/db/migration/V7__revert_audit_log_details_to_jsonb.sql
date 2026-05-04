ALTER TABLE audit_log ALTER COLUMN details TYPE JSONB USING details::jsonb;
