/*
  # Add Created By Admin Fields to Invoices

  ## Overview
  This migration adds fields to track which admin created each invoice,
  allowing better tracking and accountability in the system.

  ## Changes
  1. Add `created_by_admin_id` column to invoices table
  2. Add `created_by_admin_email` column to invoices table
  3. Update existing invoices with historical data from audit logs
  4. Add foreign key constraint for data integrity

  ## Notes
  - Existing invoices will be linked to admins based on audit log history
  - For invoices without audit logs, they'll be marked as created by 'system'
*/

-- Add columns to invoices table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'created_by_admin_id'
  ) THEN
    ALTER TABLE invoices ADD COLUMN created_by_admin_id uuid REFERENCES admin_users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'created_by_admin_email'
  ) THEN
    ALTER TABLE invoices ADD COLUMN created_by_admin_email text DEFAULT 'system';
  END IF;
END $$;

-- Update existing invoices with admin info from audit logs
UPDATE invoices i
SET 
  created_by_admin_id = al.admin_id,
  created_by_admin_email = al.admin_email
FROM audit_logs al
WHERE 
  al.entity_id = i.id::text
  AND al.action_type = 'create_invoice'
  AND i.created_by_admin_id IS NULL;

-- For remaining invoices without audit logs, use the first main admin
DO $$
DECLARE
  main_admin_id uuid;
  main_admin_email text;
BEGIN
  SELECT id, email INTO main_admin_id, main_admin_email
  FROM admin_users 
  WHERE role = 'main_admin' 
  LIMIT 1;

  UPDATE invoices
  SET 
    created_by_admin_id = main_admin_id,
    created_by_admin_email = COALESCE(created_by_admin_email, main_admin_email)
  WHERE created_by_admin_id IS NULL;
END $$;
